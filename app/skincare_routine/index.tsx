import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { TextInput, ScrollView, Alert, FlatList } from 'react-native';
import React, { useState } from 'react';

import { Product } from '../../model/Product';

const SkincareRoutine = ({ onClose }: { onClose?: () => void }) => {

    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

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
            <Text className="text-4xl font-bold text-[#B87C4C]" >My Skincare Routine</Text>
            
            <View className="w-full flex flex-row gap-2">
                <View className="rounded-2xl p-1 border-2 items-center border-[#B87C4C] flex-1 px-2 flex flex-row gap-2">
                    <SearchIcon/>
                    <TextInput
                        placeholder="Search your products here..."
                        value={""}
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

export default SkincareRoutine;