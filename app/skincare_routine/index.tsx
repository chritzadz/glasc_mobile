import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { TextInput, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';

import { Product } from '../../model/Product';

export default function SkincareRoutine() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        router.push('settings');
    };

    const getProduct = async (): Promise<void> => {
        try {
            const response = await fetch('/api/skincare', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            console.log(data);

            const productObjects: Product[] = data.map((item: any) => ({
                name: item.product_name,
                url: item.product_url,
                ingredients: item.ingredients || '', 
            }));

            setProducts(productObjects);
        } 
        catch (error) {
            Alert.alert('Error', 'Failed to fetch products. Please try again later.');
        }
    };

    const addNewMyProduct = (newProduct: Product) => {
        setSelectedProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    const filterProduct = () => {
        if (!Array.isArray(products) || products.length === 0) {
            setFilteredProducts([]); // Reset if products array is empty or not an array
            return;
        }

        if (searchTerm.trim() === "") {
            setFilteredProducts(products); // Reset to all products if search term is empty
            return;
        }

        const newFilteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredProducts(newFilteredProducts);
    };

    useEffect(() => {
        getProduct();
    }, []);

    const handleProductPress = (product: Product) => {
        console.log("Product selected:", product);
        addNewMyProduct(product);
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
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleProductPress(item)}>
                        <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                style={{ marginTop: 0, width: '100%' }}
            />

            <View className="w-full flex flex-row gap-2">
                <TouchableOpacity className="mt-10 py-3 px-5 rounded-lg items-center bg-white" onPress={filterProduct}>
                    <Text className="font-bold text-lg text-[#bf7641]">Submit</Text>
                </TouchableOpacity>
            </View>
            <Text className="text-4xl font-bold text-[#B87C4C]" >My Products:</Text>
            <FlatList
                data={selectedProducts}
                keyExtractor={(item) => item.name} 
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                style={{ marginTop: 20, width: '100%' }}
            />
        </View>
    );
};

