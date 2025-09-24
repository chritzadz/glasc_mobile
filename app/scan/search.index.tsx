import { ActivityIndicator, Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { TextInput, Alert, ScrollView } from 'react-native';
import ProductItemBox from '../../components/ProductItemBox';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';

import { Product } from '../../model/Product';

const SearchScreen = ({ onClose }: { onClose?: () => void }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isFetchingFromDb, setIsFetchingFromDb] = useState(true);

    const filterProduct = () => {
        if (!Array.isArray(products) || products.length === 0) {
            setFilteredProducts(products); // Reset if products array is empty or not an array
            return;
        }

        if (searchTerm.trim() === "") {
            setFilteredProducts(products); // Reset to all products if search term is empty
            return;
        }

        const newFilteredProducts = products.filter(product =>
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredProducts(newFilteredProducts);
    };

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await fetch('/api/skincare');
                const data = await response.json();

                console.log("got to client ");
                console.log(data);
                setProducts(data);
                setFilteredProducts(data);
                setIsFetchingFromDb(false);
            }
            catch (error) {
                Alert.alert('Error', 'Failed to fetch products. Please try again later.');
            }
        };

        getProduct();
    }, []);

    return (
        <View className="px-5">
            <SafeAreaView className="flex flex-col gap-5 w-full items-center bg-[#F7F4EA] pd-10 px-5">
                <View className="w-full flex flex-row gap-2">
                    {/* <View className="items-center w-[20px] flex justify-center">
                        <ChevronLeft color="#B87C4C" onPress={onClose}></ChevronLeft>
                    </View> */}
                    <View className="rounded-2xl p-1 border-2 items-center border-[#B87C4C] flex-1 px-2 flex flex-row gap-2">
                        <SearchIcon color="#B87C4C" onPress={() => filterProduct()}/>
                        <TextInput
                            placeholder="Search your products here..."
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            onSubmitEditing={filterProduct}
                            className="text-[#b69982] w-full text-lg border-0"
                            />
                    </View>
                </View>
                {
                    isFetchingFromDb ? (
                        <View className="bg-[#F7F4EA] flex-1 mt-10 justify-center items-center">
                            <ActivityIndicator size="large" color="#B87C4C" />
                        </View>
                    ) : (
                        <ScrollView className="flex flex-col gap-2 w-full">
                            {Array.from({ length: Math.ceil(filteredProducts.length / 2) }).map((_, rowIdx) => (
                                <View key={rowIdx} className="flex flex-row gap-2 mb-2">
                                <View className="flex-1 shadow">
                                    <ProductItemBox
                                    imageUrl={'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80'}
                                    name={filteredProducts[rowIdx * 2]?.product_name}
                                    description={"tthis"}
                                    />
                                </View>
                                {filteredProducts[rowIdx * 2 + 1] && (
                                    <View className="flex-1 shadow">
                                    <ProductItemBox
                                        imageUrl={'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80'}
                                        name={filteredProducts[rowIdx * 2 + 1]?.product_name}
                                        description={"tthis"}
                                    />
                                    </View>
                                )}
                                </View>
                            ))}
                        </ScrollView>
                    )
                }
                
                
            </SafeAreaView>
        </View>
        
    );
};

export default SearchScreen;
