import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, ChevronLeft, Lightbulb, Flag, ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';

import IngredientItem from '../../components/SingleIngredientBox';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../model/Product';

interface HarmfulIngredient {
    ingredient: string;
    why: string;
}

interface Analysis {
    type: string;
    match_percentage: string;
    harmful_ingredients: HarmfulIngredient[];
}


export default function ProductAnalysisPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [ingredients, setIngredients] = useState<string[]>([]);
    const productName = Array.isArray(params.productName) ? params.productName[0] : params.productName;
    const productId = Array.isArray(params.productId) ? params.productId[0] : params.productId;
    const analysisStr = Array.isArray(params.analysis) ? params.analysis[0] : params.analysis;
    const analysis: Analysis = JSON.parse(analysisStr);

    const [skincareProducts, setSkincareProducts] = useState<Product[]>([]);

    const defaultImageURL ="https://guardianindonesia.co.id/media/catalog/product/3/1/3117507.png?auto=webp&format=png&width=640&height=800&fit=cover";

    useEffect(() => {
        fetchIngredients();
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
    }, []);

    const handleBack = () => {
        router.back();
    };

    const handlePress = () => {
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
    
            const data = await response.text();  // Use .text() since the API returns a plain string
            console.log("Fetched data:", data);  // Log the raw string
    
            // Split the string into an array
            //const ingredientsArray = data.split(',').map(item => item.trim());  // Trim whitespace from each item
            //setIngredients(ingredientsArray);  // Set the state with the array of ingredients
            const ingredientsArray = JSON.parse(data);  // Convert string to array
            setIngredients(ingredientsArray); 
        } catch (error) {
            console.error("Error fetching ingredients:", error);
        }
    };

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
                            source={{uri: "https://guardianindonesia.co.id/media/catalog/product/3/1/3117507.png?auto=webp&format=png&width=640&height=800&fit=cover"}}
                            className="w-full h-[370px] rounded-[16px]"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="flex-col flex gap-4 px-5">
                        <View className="flex-row flex-wrap flex items-center mb-2 gap-2 justify-center">
                            <View className="flex-row items-center bg-[#6AB778] border-[#B87C4C] border-2 px-2 py-1 rounded-full gap-1 w-40 justify-center">
                                <Text className="text-white font-bold text-sm">{analysis.match_percentage}%</Text>
                                <Text className="text-white text-sm font-bold">Match</Text>
                            </View>
                            <View className="flex-row items-center bg-[#6A7CB7] border-[#B87C4C] border-2 px-2 py-1 rounded-full gap-1 w-40 justify-center">
                                <Lightbulb size={14} color={"white"}/>
                                <Text className="text-white font-bold text-sm ">{analysis.type}</Text>
                            </View>
                        </View>

                        {analysis.harmful_ingredients && analysis.harmful_ingredients.length > 0 ? (
                            analysis.harmful_ingredients.map((item, idx) => (
                            <View
                                key={idx}
                                className="bg-[#ffe5e5] rounded-lg flex flex-row gap-3 items-center p-2 mx-5"
                            >
                                <AlertTriangle></AlertTriangle>
                                <View>
                                    <Text className="font-bold text-white">{item.ingredient}</Text>
                                    <Text className="text-sm text-white">{item.why}</Text>
                                </View>
                            </View>
                            ))
                        ) : (
                            <Text style={{ marginTop: 8, color: 'white', fontSize: 12, fontWeight: 'bold' }}>None detected.</Text>
                        )}
                        <View className="gap-2 mb-2">
                            <Text className="font-bold text-white text-base">Overview</Text>
                            <Text className="font-semibold text-white text-xs">Physical sunscreen with green tint color corrector to help cover face with redness.</Text>
                        </View>
                        <View className="gap-2 mb-2">
                            <Text className="font-bold text-white text-base">Ingredients</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex flex-row gap-1">
                                {ingredients.map((item, index) => (
                                    <IngredientItem key={index} name={item} />
                                ))}
                            </ScrollView>
                        </View>
                        <View className="gap-2 mb-2">
                            <Text className="font-bold text-white text-base flex w-full justify-center items-center">
                                {"Similar Products"}
                            </Text>
                        </View>

                        {Array.from({ length: Math.ceil(skincareProducts.length / 2) }).map((_, rowIdx) => (
                            <View key={rowIdx} className="flex flex-row gap-2 mb-2">
                            <View className="flex-1">
                                <ProductCard
                                    productImage= {skincareProducts[rowIdx * 2]?.image_url || defaultImageURL}
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

