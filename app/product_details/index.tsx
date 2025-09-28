import { useRouter } from "expo-router";
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { SearchIcon, ArrowLeft, Flag } from 'lucide-react-native';
import { TextInput, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';
import ProductItemBox from '../../components/ProductItemBox';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';

import { Product } from '../../model/Product';
import  IngredientItem from '../../components/SingleIngredientBox';
import CurrentProduct from "../../model/CurrentProduct";

const ProductDetailScreen = ({ onClose }: { onClose?: () => void }) => {
    const items = [
        "Aqua",
        "Zinc Oxide",
        "C12-15 Alky Benzoate",
        "Propanediol",
        "Propanediol",
        "Propanediol",
        "Propanediol",
        "Propanediol",
        "Propanediol",
        "Propanediol",
        "Propanediol",
        "Propanediol"
    ];

    const router = useRouter();
    const [productName, setProductName] = useState<string | null>(null);
    const maxLength = 30;

    const handleBack = () => {
        router.back();
    };

    const fetchIngredients = async (productName: string) => {
        console.log("FETCH INGREDIENTS:\n");
        const response = await fetch(`/api/ingredient?product_name=${productName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();

        const temp: string[] = data;
        console.log(temp);
        return temp;
    };

    useEffect(() => {
        const productInstance = CurrentProduct.getInstance(); // Type is CurrentProduct
        const product_name = productInstance.getProductName();
        console.log(product_name);
        setProductName(product_name);
    })
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
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.overview}>
                        <Text className="font-semibold text-white text-base">Overview</Text>
                        <Text className="font-semibold text-white text-xs">Physical sunscreen with green tint color corrector to help cover face with redness.</Text>
                    </View>
                    <View style={styles.ingredients}>
                        <Text className="font-semibold text-white text-base">Ingredients</Text>
                        <View className="flex flex-row gap-1">
                            {/* {items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`bg-[#996032] rounded-full px-4 py-2 m-1`}
                            >
                                <Text className="text-white font-semibold">{item}</Text>
                            </TouchableOpacity>
                            ))} */}
                            {items.map((item, index) => (
                            <IngredientItem key={index} name={item} />
                        ))}
                        </View>
                    </View>
                    <View style={styles.similarProducts}>
                        <Text className="font-semibold text-white text-base">Similar Products</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
        
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row', // Equivalent to flex-row
        alignItems: 'center', // Equivalent to items-center
        marginHorizontal: 20, // Equivalent to px-5 (5 * 4 = 20px)
        marginBottom: 8, // Equivalent to mb-2 (2 * 4 = 8px)
        backgroundColor: '#996032',
        borderRadius: 999,
        height: 48,
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4, 
        paddingRight: 16,
        justifyContent: 'space-between',
    },
    image: {
        width: '100%',
        height: 370,
        borderRadius: 16,
    },
    overview: {
        marginHorizontal: 20,
        gap: 8,
        marginBottom: 10,
    },
    ingredients: {
        marginHorizontal: 20,
        gap: 8,
        marginBottom: 10,
    },
    similarProducts: {
        marginHorizontal: 20,
        gap: 8,
    },
});

export default ProductDetailScreen;
