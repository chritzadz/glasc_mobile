import { useRouter } from 'expo-router';
import { Text, View, ScrollView, TouchableOpacity, FlatList, TextInput, Alert} from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';

import { Product } from '../../model/Product';
import CurrentUser from '../../model/CurrentUser';
import CustomAlertBox from '../../components/CustomAlertBox';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SkincareRoutineSearchPM() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");

    const handleBack = () => {
        router.back();
    };

    const showAlert = (productName: string) => {
        setSelectedProduct(productName);
        setAlertVisible(true);
    };

    const handleYes = async () => {
        console.log("User selected Yes");
        await addProduct(selectedProduct);
        setAlertVisible(false);
        handleBack();
    };

    const handleNo = () => {
        console.log("User selected No");
        setAlertVisible(false);
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

    const filterProduct = () => {
        if (!Array.isArray(products) || products.length === 0) {
            setFilteredProducts([]); 
            return;
        }

        if (searchTerm.trim() === "") {
            setFilteredProducts([]); 
            return;
        }

        const newFilteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredProducts(newFilteredProducts);
    };

    const addProduct = async (name: String) => {
        console.log(name);
        const response = await fetch('/api/skincareRoutine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: CurrentUser.getInstance().getId(),
                product: name,
                type: "evening",
            })
        });

        console.log('Response status:', response.status);

        if (response.ok) {
            Alert.alert("Success", "Product added to PM routine.")
            return true;
        }
        else {
            Alert.alert("Error", "Fail to add PM routine.")
            return false;
        }
    };

    useEffect(() => {
        getProduct();
    }, []);

    return (
        <View className="flex-1 bg-[#B87C4C] pb-24">
            <SafeAreaView>
                <View>
                    <View className="flex flex-row items-center px-5 mb-2">
                        <TouchableOpacity onPress={handleBack}>
                            <ChevronLeft color="white" />
                        </TouchableOpacity>
                    </View>
                    <View className="px-5 pt-4 h-full">
                        <View className="flex flex-row gap-2 w-full pb-4">
                            <View className="h-10 w-4/5 bg-white rounded-lg flex-row items-center p-1">
                                <TextInput
                                    placeholder="Search your products here..."
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    className="w-full text-lg text-black pl-2"
                                />
                            </View>
                            <TouchableOpacity
                                className="h-10 w-1/5 bg-white rounded-lg flex justify-center items-center"
                                onPress={filterProduct}
                            >
                                <SearchIcon />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={filteredProducts}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => showAlert(item.name)}>
                                    <Text className="p-2 text-lg">{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            className="mt-0 w-full" // Apply any Tailwind classes here
                        />
                    </View>
                </View>
            </SafeAreaView>
            {isAlertVisible && (
                <CustomAlertBox
                    title="Confirm Action"
                    message={`Are you sure you want to add ${selectedProduct} to your morning routine?`}
                    onYes={handleYes}
                    onNo={handleNo}
                />
            )}
        </View>
    );
};
