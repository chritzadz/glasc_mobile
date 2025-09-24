import { useRouter } from 'expo-router';
import { Text, View, ScrollView, TouchableOpacity, FlatList, TextInput, Alert} from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';

import { Product } from '../../model/Product';
import CurrentUser from '../../model/CurrentUser';
import CustomAlertBox from '../../components/CustomAlertBox';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductItemBox from '../../components/ProductItemBox';

interface SkincareRoutineSearchProp{
    type: string; //AM or PM only
}

export default function SkincareRoutineSearch({type}: SkincareRoutineSearchProp) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");

    const handleBack = () => {
        router.push("/skincare_routine");
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
            setFilteredProducts(productObjects);
            setProducts(productObjects);
        } 
        catch (error) {
            Alert.alert('Error', 'Failed to fetch products. Please try again later.');
        }
    };

    const filterProduct = () => {
        if (!Array.isArray(products) || products.length === 0) {
            setFilteredProducts(products);
            return;
        }

        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
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
        console.log(type);
        getProduct();
    }, []);

    return (
        <View className="flex-1 bg-[#F7F4EA]">
            <SafeAreaView>
                <View className="gap-2">
                    <View className="px-5 pt-4 h-full">
                        <View className="w-full flex flex-row gap-2">
                            <View className="items-center w-[20px] p-2 flex justify-center">
                                <ChevronLeft color="#B87C4C" onPress={handleBack}></ChevronLeft>
                            </View>
                            <View className="rounded-2xl p-1 border-2 items-center border-[#B87C4C] bg-[#F7F4EA] flex-1 px-2 flex flex-row gap-2">
                                <SearchIcon color="#B87C4C" onPress={filterProduct}/>
                                <TextInput
                                    placeholder="Search your products here..."
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    className="text-[#b69982] w-full text-lg border-0"
                                    />
                            </View>
                        </View>
                        <ScrollView className="flex flex-col gap-2 mt-2 w-full">
                            {Array.from({ length: Math.ceil(filteredProducts.length / 2) }).map((_, rowIdx) => (
                                <View key={rowIdx} className="flex flex-row gap-2 mb-2">
                                <View className="flex-1 shadow">
                                    <TouchableOpacity onPress={() => showAlert(filteredProducts[rowIdx * 2]?.name)}>
                                        <ProductItemBox
                                        imageUrl={"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"}
                                        name={filteredProducts[rowIdx * 2]?.name}
                                        description={"desc"}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {filteredProducts[rowIdx * 2 + 1] && (
                                    <View className="flex-1 shadow">
                                        <TouchableOpacity onPress={() => showAlert(filteredProducts[rowIdx * 2 + 1]?.name)}>
                                            <ProductItemBox
                                                imageUrl={"https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"}
                                                name={filteredProducts[rowIdx * 2 + 1]?.name}
                                                description={"desc"}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                                </View>
                            ))}
                        </ScrollView>
                        {/* <FlatList
                            data={filteredProducts}
                            keyExtractor={(item) => item.name}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => showAlert(item.name)}>
                                    <Text className="p-2 text-lg">{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            className="mt-0 w-full" // Apply any Tailwind classes here
                        /> */}
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
