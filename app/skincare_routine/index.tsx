import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import {
    ChevronLeft,
    SquarePen,
    CirclePlus,
    Save,
    Loader,
} from "lucide-react-native";
import {
    StyleSheet,
    Alert,
    TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { Routine } from "../../model/Routine";
import CurrentUser from "../../model/CurrentUser";

import CustomAlertBox from '../../components/CustomAlertBox';

export default function SkincareRoutine() {
    const router = useRouter();
    const [isAMEditMode, setIsAMEditMode] = useState(false);
    const [isPMEditMode, setIsPMEditMode] = useState(false);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [selectedProductName, setSelectedProductName] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Routine>();
    const [AMRoutineProducts, setAMRoutineProducts] = useState<Routine[]>([]);
    const [PMRoutineProducts, setPMRoutineProducts] = useState<Routine[]>([]);
    const [error, setError] = useState(null);

    const handleClose = () => {
        router.back();
    };

    const displayAMSearchScreen = () => {
        router.push("/skincare_routine_search");
    };

    const displayPMSearchScreen = () => {
        router.push("/skincare_routine_search_PM");
    };

    const toggleAMDisplay = () => {
        setIsAMEditMode(!isAMEditMode);
    };

    const togglePMDisplay = () => {
        setIsPMEditMode(!isPMEditMode);
    };

    const showAlert = (product: Routine) => {
        setSelectedProduct(product);
        setAlertVisible(true);
    };

    const handleYes = async () => {
        console.log("User selected Yes");
        if (selectedProduct) {
            await deleteProduct(selectedProduct);
            await refetchRoutineProducts();
        }
        setAlertVisible(false);
    };

    const handleNo = () => {
        console.log("User selected No");
        setAlertVisible(false);
    };

    const fetchSkincareRoutine = async () => {
        try {
            const userId = CurrentUser.getInstance().getId();
            const response = await fetch(
                `/api/skincareRoutine?user_id=${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();
            console.log(data);

            const routineObjects: Routine[] = data.map((item: any) => ({
                user_id: item.user_id,
                product: item.product,
                type: item.type,
            }));

            return routineObjects;
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to fetch products. Please try again later."
            );
        }
    };

    const {
        data: routineProductsData,
        isLoading: isRoutineLoading,
        isError: isRoutineError,
        refetch: refetchRoutineProducts,
    } = useQuery({
        queryKey: ["routineProducts"],
        queryFn: async () => {
            const res = await fetchSkincareRoutine();
            if (!res) {
                throw new Error("Failed to fetch skincare routine");
            }
            return {
                morning: res?.filter((routine) => routine.type === "morning"),
                evening: res?.filter((routine) => routine.type === "evening"),
            };
        },
    });

    useEffect(() => {
        if (routineProductsData) {
            setAMRoutineProducts(routineProductsData.morning);
            setPMRoutineProducts(routineProductsData.evening);
        }
    }, [routineProductsData]);
    console.log(isRoutineLoading);

    const deleteProduct = async (product: Routine) => {
        try {
            const userId = CurrentUser.getInstance().getId();
            const response = await fetch(
                '/api/skincareRoutine',
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: CurrentUser.getInstance().getId(),
                        product: product.product,
                        type: product.type,
                    })
                }
            );

            const data = await response.json();
            console.log(data);
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to fetch products. Please try again later."
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.backHeader}>
                <TouchableOpacity
                    style={styles.chevronLeft}
                    onPress={handleClose}
                >
                    <ChevronLeft color="white" />
                </TouchableOpacity>
                <Text style={styles.backText}>Back</Text>
            </View>

            {/* Title */}
            <View>
                <Text style={styles.routineTitle}>My Routine</Text>
                <View style={styles.line}></View>
            </View>
            <View style={styles.AMSection}>
                <View style={styles.row}>
                    <Text style={styles.routineTitle}>AM Routine</Text>
                    <TouchableOpacity onPress={toggleAMDisplay}>
                        {isAMEditMode ? (
                            <Save color="white" />
                        ) : (
                            <SquarePen
                                color="white"
                                onPress={toggleAMDisplay}
                            />
                        )}
                        {/* Conditional rendering */}
                    </TouchableOpacity>
                </View>
                <View style={styles.productContainer}>
                    <View className="flex-row gap-2 w-full">
                        {isRoutineLoading ? (
                            <Loader color="white" className="animate-spin" />
                        ) : (
                            AMRoutineProducts.map((product, index) => (
                                <TouchableOpacity key={index} onPress={() => showAlert(product)}>
                                    <Text style={{ padding: 10, fontSize: 16 }}>
                                        {product.product}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                    <View style={styles.addButtonSection}>
                        {isAMEditMode && (
                            <View style={styles.addIcon}>
                                <CirclePlus
                                    color="white"
                                    onPress={displayAMSearchScreen}
                                />
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.line}></View>
            </View>
            <View style={styles.PMSection}>
                <View style={styles.row}>
                    <Text style={styles.routineTitle}>PM Routine</Text>
                    <TouchableOpacity onPress={togglePMDisplay}>
                        {isPMEditMode ? (
                            <Save color="white" />
                        ) : (
                            <SquarePen
                                color="white"
                                onPress={togglePMDisplay}
                            />
                        )}
                        {/* Conditional rendering */}
                    </TouchableOpacity>
                </View>
                <View style={styles.productContainer}>
                    {isRoutineLoading ? (
                        <Loader color="white" className="animate-spin" />
                    ) : (
                        PMRoutineProducts.map((product, index) => (
                            <TouchableOpacity key={index} onPress={() => showAlert(product)}>
                                <Text style={{ padding: 10, fontSize: 16 }}>
                                    {product.product}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                    <View style={styles.addButtonSection}>
                        {isPMEditMode && (
                            <View style={styles.addIcon}>
                                <CirclePlus
                                    color="white"
                                    onPress={displayPMSearchScreen}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
            {isAlertVisible && (
                <CustomAlertBox
                    title="Confirm Action"
                    message={`Are you sure you want to delete ${selectedProduct?.product}?`}
                    onYes={handleYes}
                    onNo={handleNo}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        gap: 20,
        width: "100%",
        backgroundColor: "#B87C4C",
        paddingTop: 56, // 56px
        paddingBottom: 80, // 80px
    },
    backHeader: {
        display: "flex",
        flexDirection: "row",
        paddingLeft: 20, // 20px
        paddingRight: 20, // 20px
        alignItems: "center",
        gap: 5,
        marginBottom: 10,
        // "flex flex-row items-center gap-5 mb-10"
    },
    chevronLeft: {
        //className="w-[20px] p-2 flex justify-center
    },
    backText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        marginVertical: 8,
        // className="text-4xl font-bold text-[white] my-8"
    },
    line: {
        height: 2,
        backgroundColor: "white",
        marginVertical: 5,
    },
    AMSection: {
        paddingVertical: 8,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingRight: 20,
    },
    routineTitle: {
        paddingLeft: 20, // 20px
        paddingRight: 20, // 20px
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        //className="text-2xl font-bold text-[white]
    },
    PMSection: {},
    productContainer: {
        marginHorizontal: 20,
        marginVertical: 16,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#996032",
        borderRadius: 10,
    },
    addButtonSection: {
        alignItems: "center",
    },
    addIcon: {
        margin: 10,
    },
});
