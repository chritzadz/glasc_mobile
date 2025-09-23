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

    // return (
    //     <View style={styles.container}>
    //         <View style={styles.backHeader}>
    //             <TouchableOpacity
    //                 style={styles.chevronLeft}
    //                 onPress={handleClose}
    //             >
    //                 <ChevronLeft color="white" />
    //             </TouchableOpacity>
    //             <Text style={styles.backText}>Back</Text>
    //         </View>

    //         {/* Title */}
    //         <View>
    //             <Text style={styles.routineTitle}>My Routine</Text>
    //             <View style={styles.line}></View>
    //         </View>
    //         <View style={styles.AMSection}>
    //             <View style={styles.row}>
    //                 <Text style={styles.routineTitle}>AM Routine</Text>
    //                 <TouchableOpacity onPress={toggleAMDisplay}>
    //                     {isAMEditMode ? (
    //                         <Save color="white" />
    //                     ) : (
    //                         <SquarePen
    //                             color="white"
    //                             onPress={toggleAMDisplay}
    //                         />
    //                     )}
    //                     {/* Conditional rendering */}
    //                 </TouchableOpacity>
    //             </View>
    //             <View style={styles.productContainer}>
    //                 <View className="flex-row gap-2 w-full">
    //                     {isRoutineLoading ? (
    //                         <Loader color="white" className="animate-spin" />
    //                     ) : (
    //                         AMRoutineProducts.map((product, index) => (
    //                             <TouchableOpacity key={index} onPress={() => showAlert(product)}>
    //                                 <Text style={{ padding: 10, fontSize: 16 }}>
    //                                     {product.product}
    //                                 </Text>
    //                             </TouchableOpacity>
    //                         ))
    //                     )}
    //                 </View>
    //                 <View style={styles.addButtonSection}>
    //                     {isAMEditMode && (
    //                         <View style={styles.addIcon}>
    //                             <CirclePlus
    //                                 color="white"
    //                                 onPress={displayAMSearchScreen}
    //                             />
    //                         </View>
    //                     )}
    //                 </View>
    //             </View>

    //             <View style={styles.line}></View>
    //         </View>
    //         <View style={styles.PMSection}>
    //             <View style={styles.row}>
    //                 <Text style={styles.routineTitle}>PM Routine</Text>
    //                 <TouchableOpacity onPress={togglePMDisplay}>
    //                     {isPMEditMode ? (
    //                         <Save color="white" />
    //                     ) : (
    //                         <SquarePen
    //                             color="white"
    //                             onPress={togglePMDisplay}
    //                         />
    //                     )}
    //                     {/* Conditional rendering */}
    //                 </TouchableOpacity>
    //             </View>
    //             <View style={styles.productContainer}>
    //                 {isRoutineLoading ? (
    //                     <Loader color="white" className="animate-spin" />
    //                 ) : (
    //                     PMRoutineProducts.map((product, index) => (
    //                         <TouchableOpacity key={index} onPress={() => showAlert(product)}>
    //                             <Text style={{ padding: 10, fontSize: 16 }}>
    //                                 {product.product}
    //                             </Text>
    //                         </TouchableOpacity>
    //                     ))
    //                 )}
    //                 <View style={styles.addButtonSection}>
    //                     {isPMEditMode && (
    //                         <View style={styles.addIcon}>
    //                             <CirclePlus
    //                                 color="white"
    //                                 onPress={displayPMSearchScreen}
    //                             />
    //                         </View>
    //                     )}
    //                 </View>
    //             </View>
    //         </View>
    //         {isAlertVisible && (
    //             <CustomAlertBox
    //                 title="Confirm Action"
    //                 message={`Are you sure you want to delete ${selectedProduct?.product}?`}
    //                 onYes={handleYes}
    //                 onNo={handleNo}
    //             />
    //         )}
    //     </View>
    // );
    return (
        <View className="flex-1 bg-[#B87C4C] pt-14 pb-20">
            <View className="flex-row items-center gap-5 mb-2 px-5">
                <TouchableOpacity onPress={handleClose}>
                    <ChevronLeft color="white" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-white">Back</Text>
            </View>

            <View>
                <Text className="text-2xl font-bold text-white my-2 pl-5">My Routine</Text>
                <View className="h-0.5 bg-white my-1 shadow-md"></View>
            </View>

            <View className="py-2">
                <View className="flex-row justify-between w-full pr-5">
                    <Text className="text-2xl font-bold text-white pl-5">AM Routine</Text>
                    <TouchableOpacity onPress={toggleAMDisplay}>
                        {isAMEditMode ? (
                            <Save color="white" />
                        ) : (
                            <SquarePen color="white" />
                        )}
                    </TouchableOpacity>
                </View>
                <View className="mx-5 my-4 p-2 bg-[#996032] rounded-lg">
                    <View className="flex-row gap-2 w-full">
                        {isRoutineLoading ? (
                            <Loader color="white" className="animate-spin" />
                        ) : (
                            AMRoutineProducts.map((product, index) => (
                                <TouchableOpacity key={index} onPress={() => showAlert(product)}>
                                    <Text className="p-2 text-lg text-white">{product.product}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                    {isAMEditMode && (
                        <View className="flex items-center">
                            <CirclePlus color="white" onPress={displayAMSearchScreen} />
                        </View>
                    )}
                </View>

                <View className="h-0.5 bg-white my-1"></View>
            </View>

            <View className="py-2">
                <View className="flex-row justify-between w-full pr-5">
                    <Text className="text-2xl font-bold text-white pl-5">PM Routine</Text>
                    <TouchableOpacity onPress={togglePMDisplay}>
                        {isPMEditMode ? (
                            <Save color="white" />
                        ) : (
                            <SquarePen color="white" />
                        )}
                    </TouchableOpacity>
                </View>
                <View className="mx-5 my-4 p-2 bg-[#996032] rounded-lg">
                    {isRoutineLoading ? (
                        <Loader color="white" className="animate-spin" />
                    ) : (
                        PMRoutineProducts.map((product, index) => (
                            <TouchableOpacity key={index} onPress={() => showAlert(product)}>
                                <Text className="p-2 text-lg text-white">{product.product}</Text>
                            </TouchableOpacity>
                        ))
                    )}
                    {isPMEditMode && (
                        <View className="flex items-center">
                            <CirclePlus color="white" onPress={displayPMSearchScreen} />
                        </View>
                    )}
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
