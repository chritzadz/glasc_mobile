import { useRouter } from "expo-router";
import { ActivityIndicator, Text, View, StyleSheet, Dimensions } from 'react-native';
import { SearchIcon, ArrowLeft, Flag } from 'lucide-react-native';
import { TextInput, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import ProductItemBox from '../../components/ProductItemBox';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';

import { Product } from '../../model/Product';
import  IngredientItem from '../../components/SingleIngredientBox';
import ProductCard from '../../components/ProductCard';
import CurrentProduct from "../../model/CurrentProduct";

import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
} from "react-native-reanimated";

const ProductDetailScreen = ({ onClose }: { onClose?: () => void }) => {
    const router = useRouter();
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [productName, setProductName] = useState<string | null>(null);
    const [productId, setProductId] = useState<string | null>(null);
    const [imageURL, setImageUrl] = useState<string | null>(null);
    const [skincareProducts, setSkincareProducts] = useState<Product[]>([]);
    const [IngredientDetailsOpen, setIngredientDetailsOpen] = useState(false);

    const screenHeight = Dimensions.get("window").height - 50;
    const slideAnim = useSharedValue(-screenHeight);

    const defaultImageURL ="https://guardianindonesia.co.id/media/catalog/product/3/1/3117507.png?auto=webp&format=png&width=640&height=800&fit=cover";

    const slideStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: withTiming(slideAnim.value, { duration: 600 }) },
        ],
    }));

    const showIngredientDetails = () => {
        setIngredientDetailsOpen(true);
        slideAnim.value = 0;
    };

    const hideIngredientDetails = () => {
        setIngredientDetailsOpen(false);
        slideAnim.value = -screenHeight;
    };

    const handleBack = () => {
        router.back();
    };

    const handleIngredientClick = () => {
        router.push({
            pathname: '/ingredient_details',
            params: {
                productName,
                ingredients: JSON.stringify(ingredients),
            },
        })
    }

    const fetchIngredients = async () => {
        if (!productId) {
            console.log("No product ID available");
            return;
        }
    
        try {
            const response = await fetch(`https://glasc-api.netlify.app/api/skincare/ingredient?product_id=${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log("succesful");
    
            const data = await response.text();  
            console.log("Fetched data:", data); 
            

            const ingredientsArray = JSON.parse(data);  
            setIngredients(ingredientsArray); 
        } catch (error) {
            console.error("Error fetching ingredients:", error);
        }
    };

    useEffect(() => {
        const fetchSkincareProducts = async () => {
            try {
                const response = await fetch('/api/skincare');
                const data = await response.json();
                setSkincareProducts(data);
            } catch (error) {
                console.error('Error fetching skincare products:', error);
            }
        };
        fetchSkincareProducts();

        const productInstance = CurrentProduct.getInstance(); // Type is CurrentProduct
        const product_name = productInstance.getProductName();
        const product_id = productInstance.getProductId();
        const image_url = productInstance.getProductUrl();

        console.log(product_name);
        console.log(product_id);
        console.log(image_url);

        setProductName(product_name);
        setProductId(product_id);
        setImageUrl(image_url);
        if (product_id) {
            fetchIngredients();
        }
    }, [productId]);

    return (
        <View className="flex-1 bg-[#B87C4C] shadow-md">
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.headerContainer}>
                        <View className="bg-[#FFFFFF] rounded-full p-2">
                            <TouchableOpacity onPress={handleBack}>
                                <ArrowLeft color="#B87C4C" />
                            </TouchableOpacity>
                        </View>
                        <View className="w-56">
                            <Text className="font-semibold text-white text-base ml-4 overflow-hidden" 
                                numberOfLines={1} 
                                ellipsizeMode="tail">
                                {productName || 'Loading...'}
                            </Text>
                        </View>
                        <Flag color="white" size={16}></Flag>
                    </View>
                    <View className="flex flex-row items-center px-5 mb-2">
                        <Image
                            source={{ uri: imageURL || defaultImageURL }}
                            className="w-full h-[370px] rounded-[16px]"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="gap-2 mb-2 px-5">
                        <Text className="font-semibold text-white text-base">Overview</Text>
                        <Text className="font-semibold text-white text-xs">Physical sunscreen with green tint color corrector to help cover face with redness.</Text>
                    </View>
                    <View className="gap-2 mb-2 px-5">
                        <Text className="font-bold text-white text-base" onPress={handleIngredientClick}>Ingredients</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex flex-row gap-1">
                            {ingredients.map((item, index) => (
                                <IngredientItem key={index} name={item} />
                            ))}
                        </ScrollView>
                    </View>
                    <View className="gap-2 mb-2 px-5">
                        <Text className="font-bold text-white text-base flex w-full justify-center items-center">
                            {"Similar Products"}
                        </Text>
                        {Array.from({ length: Math.ceil(skincareProducts.length / 2) }).map((_, rowIdx) => (
                            <View key={rowIdx} className="flex flex-row gap-2 mb-2">
                            <View className="flex-1">
                                <ProductCard
                                    productImage="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"
                                    productName= {skincareProducts[rowIdx * 2]?.product_name}
                                    similarPercentage={'86'}
                                    matchPercentage={'96'}
                                    productType="Sunscreen"
                                />
                            </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
        
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        marginHorizontal: 20, 
        marginBottom: 8, 
        backgroundColor: '#996032',
        borderRadius: 999,
        height: 48,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4, 
        paddingRight: 16,
        justifyContent: 'space-between',
    },
});

export default ProductDetailScreen;
