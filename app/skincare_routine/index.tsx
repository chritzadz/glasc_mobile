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
    const [selectedMorningProducts, setSelectedMorningProducts] = useState<Product[]>([]);
    const [selectedNightProducts, setSelectedNightProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        router.back();
    };

    const handleDelete = (product_name: String) => {
        Alert.alert(
            "Delete",
            "Do you want to delete this product?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        // Remove the product from the list
                        setProducts((prevProducts) => 
                            prevProducts.filter(product => product.name !== product_name)
                        );
                    },
                    style: "destructive"
                }
            ]
        );
    }

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

    const addNewMorningProduct = (newProduct: Product) => {
        setSelectedMorningProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    const addNewNightProduct = (newProduct: Product) => {
        setSelectedNightProducts((prevProducts) => [...prevProducts, newProduct]);
    };

    const filterProduct = () => {
        if (!Array.isArray(products) || products.length === 0) {
            setFilteredProducts([]); // Reset if products array is empty or not an array
            return;
        }

        if (searchTerm.trim() === "") {
            setFilteredProducts([]); // Reset to all products if search term is empty
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

    const handleMorningProductPress = (product: Product) => {
        console.log("Product selected:", product);
        addNewMorningProduct(product);
    };

    const handleNightProductPress = (product: Product) => {
        console.log("Product selected:", product);
        addNewNightProduct(product);
    };

    return (
        <ScrollView className="flex flex-col gap-5 w-full bg-[#F7F4EA] pd-10 px-5 pt-14 pb-20">
            <View className="flex flex-row items-center gap-5">
                <TouchableOpacity className="w-[20px] p-2 flex justify-center" onPress={handleClose}>
                    <ChevronLeft color="#B87C4C" />
                </TouchableOpacity>
                <Text className="text-2xl text-[#B87C4C]">Back</Text>
            </View>

            {/* Title */}
            <Text className="text-4xl font-bold text-[#B87C4C] my-8">My Skincare Routine</Text>
            <Text className="text-3xl font-bold text-[#B87C4C]">Morning Routine</Text>

            {/* Search and Submit Section */}
            <View className="w-full flex flex-row gap-2">
                <View className="h-10 rounded-2xl p-1 border-2 border-[#B87C4C] flex-1 mt-4 flex flex-row items-center gap-2 px-2">
                    <SearchIcon />
                    <TextInput
                        placeholder="Search your products here..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        className="text-[#b69982] w-full text-lg border-0"
                    />
                </View>
                <TouchableOpacity className="mt-10 py-3 px-5 rounded-lg items-center bg-white" onPress={filterProduct}>
                    <Text className="font-bold text-lg text-[#bf7641]">Find</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleMorningProductPress(item)}>
                            <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    style={{ marginTop: 0, width: '100%' }}
                />
            <Text className="text-2xl font-bold text-[#B87C4C]">My Morning Products: </Text>
            <FlatList
                data={selectedMorningProducts}
                keyExtractor={(item) => item.name} 
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleDelete(item.name)}>
                        <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                style={{ marginTop: 10, width: '100%' }}
            />


            {/* Title */}
            <Text className="text-3xl font-bold text-[#B87C4C] mt-20">Night Routine</Text>

            {/* Search and Submit Section */}
            <View className="w-full flex flex-row gap-2">
                <View className="h-10 rounded-2xl p-1 border-2 border-[#B87C4C] flex-1 mt-4 flex flex-row items-center gap-2 px-2">
                    <SearchIcon />
                    <TextInput
                        placeholder="Search your products here..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        className="text-[#b69982] w-full text-lg border-0"
                    />
                </View>
                <TouchableOpacity className="mt-10 py-3 px-5 rounded-lg items-center bg-white" onPress={filterProduct}>
                    <Text className="font-bold text-lg text-[#bf7641]">Find</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleNightProductPress(item)}>
                            <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    style={{ marginTop: 0, width: '100%' }}
                />
            <Text className="text-2xl font-bold text-[#B87C4C]">My Night Products: </Text>
            <FlatList
                data={selectedNightProducts}
                keyExtractor={(item) => item.name} 
                renderItem={({ item }) => (
                    <TouchableOpacity>
                        <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                style={{ marginTop: 10, width: '100%' }}
            />

        </ScrollView>
    );
};

