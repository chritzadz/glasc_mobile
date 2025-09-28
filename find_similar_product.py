import psycopg2
import pandas as pd
from dotenv import load_dotenv
import os
from typing import List, Dict, Tuple

# ADD THIS LINE - Load environment variables from .env.local
load_dotenv('.env.local')

class ProductSimilarityFinder:
    def __init__(self):
        """Initialize the database connection using credentials from .env.local"""
        self.db_config = {
            'host': os.getenv('DB_HOST'),
            'port': os.getenv('DB_PORT'),
            'database': os.getenv('DB_NAME'),
            'user': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD')
        }
        self.connection = None
        
    def connect(self):
        """Establish connection to PostgreSQL database"""
        try:
            self.connection = psycopg2.connect(**self.db_config)
            print("Successfully connected to PostgreSQL database!")
            return True
        except Exception as e:
            print(f"Error connecting to database: {e}")
            return False
            
    def disconnect(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            print("Database connection closed.")
            
class FixedCategoryAwareProductSimilarityFinder(ProductSimilarityFinder):
    def get_product_by_name(self, product_name: str) -> Tuple[int, str, str]:
        """
        Get product ID, exact name, and category by searching for product name.
        Returns (product_id, exact_product_name, category) or (None, None, None) if not found.
        """
        try:
            cursor = self.connection.cursor()
            
            # Updated to include category in the query
            # First try exact match
            cursor.execute("""
                SELECT product_id, product_name, category
                FROM products 
                WHERE LOWER(product_name) = LOWER(%s)
                LIMIT 1
            """, (product_name,))
            result = cursor.fetchone()
            
            if result:
                cursor.close()
                return result
            
            # If no exact match, try partial match
            cursor.execute("""
                SELECT product_id, product_name, category
                FROM products 
                WHERE LOWER(product_name) LIKE LOWER(%s)
                LIMIT 5
            """, (f'%{product_name}%',))
            results = cursor.fetchall()
            cursor.close()
            
            if results:
                print(f"No exact match found for '{product_name}'. Did you mean one of these?")
                for i, (pid, pname, cat) in enumerate(results, 1):
                    print(f"  {i}. {pname} ({cat})")
                return results[0]  # Return first match
            
            return None, None, None
            
        except Exception as e:
            print(f"Error searching for product: {e}")
            return None, None, None
    
    def get_product_ingredients(self, product_id: int) -> List[Tuple[int, str, int]]:
        """
        Get all ingredients for a product.
        Returns list of (ingredient_id, ingredient_name, ingredient_order).
        """
        try:
            cursor = self.connection.cursor()
            # Fixed: using correct table names
            cursor.execute("""
                SELECT pi.ingredient_id, i.ingredient_name, 1 as ingredient_order
                FROM product_ingredients pi
                JOIN ingredients_3 i ON pi.ingredient_id = i.ingredient_id
                WHERE pi.product_id = %s
                ORDER BY pi.ingredient_id
            """, (product_id,))
            results = cursor.fetchall()
            cursor.close()
            return results
        except Exception as e:
            print(f"Error getting ingredients: {e}")
            return []
    
    def calculate_similarity(self, ingredients1: List[int], ingredients2: List[int]) -> Dict[str, float]:
        """
        Calculate similarity between two products based on their ingredients.
        Returns dictionary with different similarity metrics.
        """
        set1 = set(ingredients1)
        set2 = set(ingredients2)
        
        intersection = set1.intersection(set2)
        union = set1.union(set2)
        
        # Different similarity metrics
        jaccard_similarity = len(intersection) / len(union) if union else 0
        common_count = len(intersection)
        ingredient_overlap_ratio = len(intersection) / min(len(set1), len(set2)) if set1 and set2 else 0
        
        return {
            'jaccard_similarity': jaccard_similarity,
            'common_ingredients': common_count,
            'overlap_ratio': ingredient_overlap_ratio,
            'shared_ingredients': list(intersection)
        }
    
    def find_similar_products_with_category_priority(self, product_name: str, min_common_ingredients: int = 3, 
                                                   limit: int = 10, similarity_threshold: float = 0.10) -> List[Dict]:
        """
        Find products similar to the given product name with category prioritization.
        
        Args:
            product_name: Name of the product to find similarities for
            min_common_ingredients: Minimum number of shared ingredients
            limit: Maximum number of similar products to return
            similarity_threshold: If best same-category similarity is below this, include other categories
        
        Returns:
            List of similar products with similarity metrics, prioritized by category
        """
        # Get the target product with its category
        target_product_id, exact_name, target_category = self.get_product_by_name(product_name)
        if not target_product_id:
            print(f"Product '{product_name}' not found in database.")
            return []
        
        print(f"Found product: '{exact_name}' (Category: {target_category})")
        
        # Get target product ingredients
        target_ingredients = self.get_product_ingredients(target_product_id)
        if not target_ingredients:
            print("No ingredients found for this product.")
            return []
        
        target_ingredient_ids = [ing[0] for ing in target_ingredients]
        print(f"Target product has {len(target_ingredient_ids)} ingredients:")
        for ing_id, ing_name, order in target_ingredients[:10]:  # Show first 10
            print(f"  {order}. {ing_name}")
        if len(target_ingredients) > 10:
            print(f"  ... and {len(target_ingredients) - 10} more")
        
        try:
            cursor = self.connection.cursor()
            
            # STEP 1: Find products within the same category first
            print(f"\n🎯 Step 1: Searching for similar products in '{target_category}' category...")
            
            # Fixed: using correct table names
            cursor.execute("""
                WITH target_ingredients AS (
                    SELECT unnest(%s::bigint[]) as ingredient_id
                ),
                product_overlaps AS (
                    SELECT 
                        pi.product_id,
                        COUNT(DISTINCT pi.ingredient_id) as common_ingredients,
                        COUNT(DISTINCT pi.ingredient_id) * 100.0 / %s as overlap_percentage
                    FROM product_ingredients pi
                    INNER JOIN target_ingredients ti ON pi.ingredient_id = ti.ingredient_id
                    WHERE pi.product_id != %s
                    GROUP BY pi.product_id
                    HAVING COUNT(DISTINCT pi.ingredient_id) >= %s
                )
                SELECT 
                    po.product_id,
                    p.product_name,
                    p.category,
                    po.common_ingredients,
                    po.overlap_percentage
                FROM product_overlaps po
                JOIN products p ON po.product_id = p.product_id
                WHERE p.category = %s
                ORDER BY po.common_ingredients DESC, po.overlap_percentage DESC
                LIMIT %s
            """, (target_ingredient_ids, len(target_ingredient_ids), 
                  target_product_id, min_common_ingredients, target_category, limit))
            
            same_category_results = cursor.fetchall()
            
            # Process same-category results
            same_category_products = []
            best_same_category_similarity = 0
            
            for result in same_category_results:
                similar_product_id, similar_product_name, category, common_count, overlap_pct = result
                
                # Get detailed similarity metrics
                similar_ingredients_data = self.get_product_ingredients(similar_product_id)
                similar_ingredient_ids = [ing[0] for ing in similar_ingredients_data]
                
                similarity_metrics = self.calculate_similarity(target_ingredient_ids, similar_ingredient_ids)
                
                # Track best similarity score
                if similarity_metrics['jaccard_similarity'] > best_same_category_similarity:
                    best_same_category_similarity = similarity_metrics['jaccard_similarity']
                
                # Get names of shared ingredients
                shared_ingredient_names = []
                for ing_id, ing_name, order in target_ingredients:
                    if ing_id in similarity_metrics['shared_ingredients']:
                        shared_ingredient_names.append(ing_name)
                
                same_category_products.append({
                    'product_name': similar_product_name,
                    'product_id': similar_product_id,
                    'category': category,
                    'common_ingredients_count': common_count,
                    'jaccard_similarity': similarity_metrics['jaccard_similarity'],
                    'overlap_ratio': similarity_metrics['overlap_ratio'],
                    'shared_ingredients': shared_ingredient_names,
                    'total_ingredients': len(similar_ingredient_ids),
                    'category_match': True
                })
            
            print(f"✅ Found {len(same_category_products)} products in same category")
            if same_category_products:
                print(f"📊 Best same-category similarity: {best_same_category_similarity:.2%}")
            
            # STEP 2: Decide whether to include other categories
            include_other_categories = (best_same_category_similarity < similarity_threshold or 
                                      len(same_category_products) < limit)
            
            other_category_products = []
            
            if include_other_categories:
                print(f"\n🌐 Step 2: Including other categories (similarity < {similarity_threshold:.0%} or insufficient results)")
                
                # Calculate how many more products we need
                remaining_limit = limit - len(same_category_products)
                
                if remaining_limit > 0:
                    # Fixed: using correct table names
                    cursor.execute("""
                        WITH target_ingredients AS (
                            SELECT unnest(%s::bigint[]) as ingredient_id
                        ),
                        product_overlaps AS (
                            SELECT 
                                pi.product_id,
                                COUNT(DISTINCT pi.ingredient_id) as common_ingredients,
                                COUNT(DISTINCT pi.ingredient_id) * 100.0 / %s as overlap_percentage
                            FROM product_ingredients pi
                            INNER JOIN target_ingredients ti ON pi.ingredient_id = ti.ingredient_id
                            WHERE pi.product_id != %s
                            GROUP BY pi.product_id
                            HAVING COUNT(DISTINCT pi.ingredient_id) >= %s
                        )
                        SELECT 
                            po.product_id,
                            p.product_name,
                            p.category,
                            po.common_ingredients,
                            po.overlap_percentage
                        FROM product_overlaps po
                        JOIN products p ON po.product_id = p.product_id
                        WHERE p.category != %s OR p.category IS NULL
                        ORDER BY po.common_ingredients DESC, po.overlap_percentage DESC
                        LIMIT %s
                    """, (target_ingredient_ids, len(target_ingredient_ids), 
                          target_product_id, min_common_ingredients, target_category, remaining_limit))
                    
                    other_category_results = cursor.fetchall()
                    
                    for result in other_category_results:
                        similar_product_id, similar_product_name, category, common_count, overlap_pct = result
                        
                        # Get detailed similarity metrics
                        similar_ingredients_data = self.get_product_ingredients(similar_product_id)
                        similar_ingredient_ids = [ing[0] for ing in similar_ingredients_data]
                        
                        similarity_metrics = self.calculate_similarity(target_ingredient_ids, similar_ingredient_ids)
                        
                        # Get names of shared ingredients
                        shared_ingredient_names = []
                        for ing_id, ing_name, order in target_ingredients:
                            if ing_id in similarity_metrics['shared_ingredients']:
                                shared_ingredient_names.append(ing_name)
                        
                        other_category_products.append({
                            'product_name': similar_product_name,
                            'product_id': similar_product_id,
                            'category': category or 'Unknown',
                            'common_ingredients_count': common_count,
                            'jaccard_similarity': similarity_metrics['jaccard_similarity'],
                            'overlap_ratio': similarity_metrics['overlap_ratio'],
                            'shared_ingredients': shared_ingredient_names,
                            'total_ingredients': len(similar_ingredient_ids),
                            'category_match': False
                        })
                    
                    print(f"✅ Found {len(other_category_products)} products from other categories")
            else:
                print(f"✅ Same-category results sufficient (similarity ≥ {similarity_threshold:.0%})")
            
            cursor.close()
            
            # Combine results: same-category first, then others
            all_similar_products = same_category_products + other_category_products
            
            return all_similar_products[:limit]  # Ensure we don't exceed the limit
            
        except Exception as e:
            print(f"Error finding similar products: {e}")
            return []

# Create new fixed category-aware instance
print("🔧 Creating fixed category-aware similarity finder...")
fixed_category_finder = FixedCategoryAwareProductSimilarityFinder()
fixed_category_finder.connect()
print("✅ Fixed Category-aware ProductSimilarityFinder created and connected successfully!")

def find_similar_skincare_products_with_category_fixed(product_name: str, min_shared_ingredients: int = 3, 
                                                      max_results: int = 10, similarity_threshold: float = 0.10):
    """
    Enhanced interface function that prioritizes products within the same category.
    
    Args:
        product_name: Name of the product to find similarities for
        min_shared_ingredients: Minimum number of shared ingredients (default: 3)
        max_results: Maximum number of similar products to return (default: 10)
        similarity_threshold: If best same-category similarity is below this, include other categories (default: 10%)
    
    Returns:
        List of similar products with their similarity metrics, prioritized by category
    """
    print(f"🔍 Enhanced Category-Aware Search for: '{product_name}'")
    print(f"📋 Minimum shared ingredients: {min_shared_ingredients}")
    print(f"🎯 Similarity threshold for other categories: {similarity_threshold:.0%}")
    print("=" * 70)
    
    similar_products = fixed_category_finder.find_similar_products_with_category_priority(
        product_name=product_name,
        min_common_ingredients=min_shared_ingredients,
        limit=max_results,
        similarity_threshold=similarity_threshold
    )
    
    if not similar_products:
        print("❌ No similar products found.")
        return []
    
    print(f"\n✅ Found {len(similar_products)} similar products:")
    print("=" * 70)
    
    # Separate same-category and other-category products for display
    same_category_count = sum(1 for p in similar_products if p['category_match'])
    other_category_count = len(similar_products) - same_category_count
    
    if same_category_count > 0:
        print(f"🎯 Same Category Results ({same_category_count}):")
        print("-" * 40)
    
    same_category_index = 1
    other_category_index = 1
    
    for product in similar_products:
        if product['category_match']:
            print(f"\n🎯 {same_category_index}. {product['product_name']}")
            print(f"   📂 Category: {product['category']} (SAME)")
            same_category_index += 1
        else:
            if same_category_index == 1 and other_category_index == 1:  # First other-category product
                print(f"\n🌐 Other Category Results ({other_category_count}):")
                print("-" * 40)
            print(f"\n🌐 {other_category_index}. {product['product_name']}")
            print(f"   📂 Category: {product['category']} (OTHER)")
            other_category_index += 1
        
        # Common display for both types
        print(f"   📊 Similarity Metrics:")
        print(f"   • Common ingredients: {product['common_ingredients_count']}")
        print(f"   • Jaccard similarity: {product['jaccard_similarity']:.2%}")
        print(f"   • Overlap ratio: {product['overlap_ratio']:.2%}")
        print(f"   • Total ingredients in this product: {product['total_ingredients']}")
        
        if product['shared_ingredients']:
            print(f"   🧪 Shared ingredients ({len(product['shared_ingredients'])}):")
            # Show first 5 shared ingredients
            for j, ingredient in enumerate(product['shared_ingredients'][:5]):
                print(f"      • {ingredient}")
            if len(product['shared_ingredients']) > 5:
                print(f"      ... and {len(product['shared_ingredients']) - 5} more")
    
    # Summary
    if same_category_count > 0 and other_category_count > 0:
        print(f"\n📊 Summary: {same_category_count} same-category + {other_category_count} other-category results")
    elif same_category_count > 0:
        print(f"\n📊 Summary: {same_category_count} same-category results (sufficient similarity found)")
    else:
        print(f"\n📊 Summary: {other_category_count} other-category results (no same-category matches)")
    
    return similar_products

print("🎉 Product similarity system is ready!")
