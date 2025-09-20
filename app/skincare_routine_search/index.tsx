import { useRouter } from 'expo-router';
import { Text, View, ScrollView, TouchableOpacity, FlatList, TextInput, Alert} from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';

import { Product } from '../../model/Product';
import CurrentUser from '../../model/CurrentUser';

export default function SkincareRoutine() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const handleBack = () => {
        router.push('skincare_routine');
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.backHeader}>
                <TouchableOpacity onPress={handleBack}>
                    <ChevronLeft color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <View style={styles.searchBox}>
                        <TextInput
                            placeholder="Search your products here..."
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            style={styles.textInput}
                        />
                    </View>
                    <TouchableOpacity style={styles.searchIcon} onPress={filterProduct}>
                        <SearchIcon />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    style={{ marginTop: 0, width: '100%' }}
                />
            </View>
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
    searchContainer: {
        paddingHorizontal: 20,
    },
    searchBar: {
        width: '100%',
        flexDirection: 'row', 
        gap: 8, 
        // className="w-full flex flex-row gap-2"
    },
    textInput: {
        width: '100%',
        paddingLeft: 10,
        alignItems: 'center',
        fontSize: 16,
        //className="text-[white] w-full text-lg border-0"
    },
    searchBox: {
        height: 40, 
        width: '85%',
        borderRadius: 10, 
        padding: 4, 
        backgroundColor: 'white',
        marginTop: 16, 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 8, 
        justifyContent: 'center',
    },
    searchIcon: {
        marginTop: 16, 
        height: 40, 
        width: '15%',
        borderRadius: 10, 
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
