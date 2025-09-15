import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { TextInput, ScrollView, Alert, FlatList } from 'react-native';
import React, { useState } from 'react';

import { Product } from '../../model/Product';

export default function SkincareRoutine({ onClose }: { onClose?: () => void }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        router.push('settings');
        // Add your close logic here, e.g., navigating back or closing a modal.
    };

    const productExist = (products: Product[]): Product | null => {
        const found = products.find((product: Product) => product.name.includes(searchTerm))
        return found ? found : null;
    };

    const getProduct = async (): Promise<Product | null> => {
        try {
            const response = await fetch('/api/skincare', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            const products: Product[] = data;
            setProducts(products);
    
            return productExist(products); // Return the current user or null
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch products. Please try again later.');
            return null; // Return null in case of an error
        }
    };

    return (
        <View className="flex flex-col gap-5 w-full items-center bg-[#F7F4EA] pd-10 px-5 pt-14">
            <View className="w-full flex flex-row gap-5 mb-8">
                <View className="items-center w-[20px] p-2 flex justify-center">
                    <ChevronLeft color="#B87C4C" onPress={handleClose}></ChevronLeft>
                </View>
                <View className="justify-center items-center">
                    <Text className="text-2xl text-[#B87C4C]">Back</Text>
                </View>
            </View>
            <Text className="text-4xl font-bold text-[#B87C4C]" >My Skincare Routine</Text>
            
            <View className="w-full flex flex-row gap-2">
                <View className="rounded-2xl p-1 border-2 items-center border-[#B87C4C] flex-1 px-2 flex flex-row gap-2">
                    <SearchIcon/>
                    <TextInput
                        placeholder="Search your products here..."
                        value={searchTerm}
                        onChangeText={(text) => setSearchTerm(text)}
                        className="text-[#b69982] w-full text-lg border-0"
                        />
                </View>
            </View>
            <Text className="text-4xl font-bold text-[#B87C4C]" >My Products:</Text>
            <ScrollView className="flex flex-col gap-2 w-full">
                {/* <FlatList
                    data={items}
                    keyExtractor={(item, index) => index.toString()} // Use index as key
                    renderItem={({ item }) => (
                        <Text style={{ padding: 10, fontSize: 16 }}>{item}</Text>
                    )}
                    style={{ marginTop: 20 }}
                /> */}
            </ScrollView>
        </View>
    );
};
