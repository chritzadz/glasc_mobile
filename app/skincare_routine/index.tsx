import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { ChevronLeft, SquarePen, CirclePlus, Save } from 'lucide-react-native';
import { StyleSheet, TextInput, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';

import { Product } from '../../model/Product';
import CurrentUser from '../../model/CurrentUser';

export default function SkincareRoutine() {
    const router = useRouter();
    const [isAMEditMode, setIsAMEditMode] = useState(false);
    const [isPMEditMode, setIsPMEditMode] = useState(false);
    const [time, setTime] = useState("")
    const [products, setProducts] = useState<Product[]>([]);
    const [routineProducts, setRoutineProducts] = useState([]);
    const [error, setError] = useState(null);

    const handleClose = () => {
        router.push('setting');
    };

    const displayAMSearchScreen = () => {
        router.push('/skincare_routine_search');
    }

    const displayPMSearchScreen = () => {
        router.push('/skincare_routine_search_PM');
    }

    const toggleAMDisplay = () => {
        setIsAMEditMode(!isAMEditMode);
    };

    const togglePMDisplay = () => {
        setIsPMEditMode(!isPMEditMode);
    };

    const fetchSkincareRoutine = async () => {
        try {
            const userId = CurrentUser.getInstance().getId();
            const response = await fetch(`/api/skincareRoutine?user_id=${userId}`);
    
            if (!response.ok) {
                const errorData = await response.text(); // Change to text to see full error
                console.error("API response error:", errorData);
                throw new Error('Failed to fetch skincare routine');
            }
    
            // Check if the response is JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                console.log(data.routineProducts); 
    
                if (data.routineProducts && data.routineProducts.length > 0) {
                    setRoutineProducts(data.routineProducts);
                } else {
                    console.log("No products found in the skincare routine.");
                    setRoutineProducts([]);
                }
            } else {
                console.error("Expected JSON response, but got:", contentType);
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error("Error fetching skincare routine:", error);
            Alert.alert('Error', 'Failed to fetch skincare routine');
        }
    };

    const displayAMRoutine = () => {
        if (!Array.isArray(products) || products.length === 0) {
            return;
        }

        // const AMRoutineProducts = products.filter(product => 
        //     product.type.toLowerCase().includes(searchTerm.toLowerCase())
        // );

        // setFilteredProducts(newFilteredProducts);
    };


    const handleDelete = async (product_name: String) => {
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

    useEffect(() => {
        fetchSkincareRoutine();
    }, []);

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
                <View style={styles.row}>
                    <Text style={styles.routineTitle}>AM Routine</Text>
                    <TouchableOpacity onPress={toggleAMDisplay}>
                        {isAMEditMode ? < Save color="white"  /> : <SquarePen color="white" onPress={toggleAMDisplay} />} {/* Conditional rendering */}
                    </TouchableOpacity>
                </View>
                <View style={styles.productContainer}>
                    <Text>Everyday</Text>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => item.name} 
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleDelete(item.name)}>
                                <Text style={{ padding: 10, fontSize: 20 }}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        style={{ marginTop: 10, width: '100%' }}
                    />
                <View style={styles.addButtonSection}>
                    {isAMEditMode && (
                        <View style={styles.addIcon}>
                        <CirclePlus color="white" onPress={displayAMSearchScreen}  />
                        </View>
                    )}
                </View>
                </View>
                
                <View style={styles.line}>
                </View>
            </View>
            <View style={styles.PMSection}>
                <View style={styles.row}>
                    <Text style={styles.routineTitle}>PM Routine</Text>
                    <TouchableOpacity onPress={togglePMDisplay}>
                        {isPMEditMode ? < Save color="white"  /> : <SquarePen color="white" onPress={togglePMDisplay} />} {/* Conditional rendering */}
                    </TouchableOpacity>
                </View>
                <View style={styles.productContainer}>
                    <Text>Everyday</Text>
                {/* <FlatList
                    data={}
                    keyExtractor={(item) => item.name} 
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <Text style={{ padding: 10, fontSize: 16 }}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    style={{ marginTop: 10, width: '100%' }}
                /> */}
                <View style={styles.addButtonSection}>
                    {isPMEditMode && (
                        <View style={styles.addIcon}>
                        <CirclePlus color="white" onPress={displayPMSearchScreen} />
                        </View>
                    )}
                </View>
                </View>
                
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
    row: {
        flexDirection: 'row',      
        justifyContent: 'space-between', 
        width: '100%',    
        paddingRight: 20,
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
        marginHorizontal: 20,
        marginVertical: 16,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#996032',
        borderRadius: 10,
    },
    addButtonSection: {
        alignItems: 'center',
    },
    addIcon: {
        margin: 10,
    },
});
