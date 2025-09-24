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
import { ScrollView } from "react-native";
import RoutineProduct from "../../components/RoutineProduct";
import EditRoutineProduct from "../../components/EditRoutineProduct";
import SkincareRoutineSearch from "../skincare_routine_search";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SkincareRoutine() {
    const router = useRouter();
    const [isAMEditMode, setIsAMEditMode] = useState(false);
    const [isPMEditMode, setIsPMEditMode] = useState(false);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Routine>();
    const [AMRoutineProducts, setAMRoutineProducts] = useState<Routine[]>([]);
    const [PMRoutineProducts, setPMRoutineProducts] = useState<Routine[]>([]);
    const [openSetting, setOpenSetting] = useState(false);
    const [searchType, setSearchType] = useState("");
    const [error, setError] = useState(null);

    const handleClose = () => {
        router.back();
    };

    const displaySearchScreen = (type: string) => {
        setSearchType(type);
        setOpenSetting(true);
    };

    const toggleAMDisplay = () => {
        setIsAMEditMode(!isAMEditMode);
    };

    const togglePMDisplay = () => {
        setIsPMEditMode(!isPMEditMode);
    };

    const showDeleteAlert = (product: Routine, from: string) => {
        if (isAMEditMode && from === "AM") {
            setSelectedProduct(product);
            setAlertVisible(true);
        }
        else if (isPMEditMode && from === "PM") {
            setSelectedProduct(product);
            setAlertVisible(true);
        }
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
            );        }
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

    return (
        <View className="flex-1">
            { openSetting ? (
                    <SkincareRoutineSearch type={searchType}></SkincareRoutineSearch>
                ) : (
                    <SafeAreaView className="flex-1 bg-[#B87C4C] h-full">
                        <View>
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
                                    {isRoutineLoading ? (
                                        <View className="flex items-center justify-center py-4">
                                            <Loader color="white" className="animate-spin" />
                                        </View>
                                    ) : (
                                        isAMEditMode ? (
                                            <ScrollView
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                className="flex flex-row"
                                                contentContainerStyle={{ gap: 8 }}
                                            >
                                                {AMRoutineProducts.map((product, index) => (
                                                    <TouchableOpacity key={index} className="w-40" onPress={() => showDeleteAlert(product, "AM")}>
                                                        <EditRoutineProduct
                                                            imageUrl={'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80'}
                                                            name={product.product}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                                <View className="flex items-center w-40 justify-center">
                                                    <CirclePlus color="white" onPress={() => displaySearchScreen("AM")} />
                                                </View>
                                            </ScrollView>
                                        ) : (
                                            <ScrollView
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                className="flex flex-row"
                                                contentContainerStyle={{ gap: 8 }}
                                            >
                                                {AMRoutineProducts.map((product, index) => (
                                                    <TouchableOpacity key={index} className="w-40" onPress={() => showDeleteAlert(product, "AM")}>
                                                        <RoutineProduct
                                                            imageUrl={'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80'}
                                                            name={product.product}
                                                        />
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        )
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
                                            <View className="flex items-center justify-center py-4">
                                                <Loader color="white" className="animate-spin" />
                                            </View>
                                        ) : (
                                            isPMEditMode ? (
                                                <ScrollView
                                                    horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                    className="flex flex-row"
                                                    contentContainerStyle={{ gap: 8 }}
                                                >
                                                    {PMRoutineProducts.map((product, index) => (
                                                        <TouchableOpacity key={index} className="w-40" onPress={() => showDeleteAlert(product, "PM")}>
                                                            <EditRoutineProduct
                                                                imageUrl={'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80'}
                                                                name={product.product}
                                                            />
                                                        </TouchableOpacity>
                                                    ))}
                                                    <View className="flex items-center w-40 justify-center">
                                                        <CirclePlus color="white" onPress={() => displaySearchScreen("PM")} />
                                                    </View>
                                                </ScrollView>
                                            ) : (
                                                <ScrollView
                                                    horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                    className="flex flex-row"
                                                    contentContainerStyle={{ gap: 8 }}
                                                >
                                                    {PMRoutineProducts.map((product, index) => (
                                                        <TouchableOpacity key={index} className="w-40" onPress={() => showDeleteAlert(product, "PM")}>
                                                            <RoutineProduct
                                                                imageUrl={'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80'}
                                                                name={product.product}
                                                            />
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            )
                                        )
                                    }
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
                    </SafeAreaView>
                )
            }
        </View>
    );
}
