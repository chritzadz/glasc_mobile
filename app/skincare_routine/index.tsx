import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { StyleSheet, TextInput, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';

import { Product } from '../../model/Product';
import CurrentUser from '../../model/CurrentUser';

export default function SkincareRoutine() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedMorningProducts, setSelectedMorningProducts] = useState<Product[]>([]);
    const [selectedNightProducts, setSelectedNightProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        router.push('settings');
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

    const addNewMorningProduct = async (newProduct: Product) => {
        const response = await fetch('/api/skincareRoutine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: CurrentUser.getInstance().getId(),
                product: newProduct,
                type: "morning"
            })
        });
        const data = await response.json();
        
        console.log(data);
        console.log(response.status);

        if (response.ok) {
            return true;
        }
        else {
            return false;
        }
        
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
        <ScrollView style={styles.container}>
            <View style={styles.backHeader}>
                <TouchableOpacity style={styles.chevronLeft} onPress={handleClose}>
                    <ChevronLeft color="white" />
                </TouchableOpacity>
                <Text style={styles.backText}>Back</Text>
            </View>

            {/* Title */}
            <View>
                <Text style={styles.routineTitle}>My Routine</Text>
                <View style={styles.line}>
                </View>
            </View>
            <View style={styles.AMSection}>
                <Text style={styles.routineTitle}>AM Routine</Text>
                <View style={styles.productContainer}>
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
                </View>
                <View style={styles.line}>
                </View>
            </View>
            <View style={styles.PMSection}>
                <Text style={styles.routineTitle}>PM Routine</Text>
                <View style={styles.productContainer}>
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
                </View>
            </View>

            {/* Search and Submit Section
            <View className="w-full flex flex-row gap-2">
                <View className="h-10 rounded-2xl p-1 border-2 border-[#B87C4C] flex-1 mt-4 flex flex-row items-center gap-2 px-2">
                    <TextInput
                        placeholder="Search your products here..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        className="text-[#b69982] w-full text-lg border-0"
                    />
                </View>
                <TouchableOpacity className="mt-10 py-3 px-5 rounded-lg items-center bg-white" onPress={filterProduct}>
                    <SearchIcon />
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
                /> */}

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20, 
        width: '100%',
        backgroundColor: '#B87C4C',
        paddingTop: 56, // 56px
        paddingBottom: 80, // 80px
    },
    backHeader: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 20, // 20px
        paddingRight: 20, // 20px
        alignItems: 'center',
        gap: 5,
        marginBottom: 10,
        // "flex flex-row items-center gap-5 mb-10"
    },
    chevronLeft: {
        //className="w-[20px] p-2 flex justify-center
    },
    backText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white'
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 8,
        // className="text-4xl font-bold text-[white] my-8"
    },
    line: {
        height: 2,
        backgroundColor: 'white',
        marginVertical: 5,
    },
    AMSection: {
        paddingVertical: 8,
    },
    routineTitle: {
        paddingLeft: 20, // 20px
        paddingRight: 20, // 20px
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        //className="text-2xl font-bold text-[white]
    },
    PMSection: {

    },
    productContainer: {

    },
});
