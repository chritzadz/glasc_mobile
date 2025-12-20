import { View, Text, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Sun, Moon, Sparkles, Edit } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Dropdown } from "../../../../components/Dropdown";
import RoutineEdit from "./components/routine-edit";
import { useQuery } from "@tanstack/react-query";
import { Routine as RoutineType } from "../../../../model/Routine";
import CurrentUser from "../../../../model/CurrentUser";
import { Alert } from "react-native";
import { Loader } from "lucide-react-native";

export default function Routine() {
    const [AMRoutineProducts, setAMRoutineProducts] = useState<RoutineType[]>(
        []
    );
    const [PMRoutineProducts, setPMRoutineProducts] = useState<RoutineType[]>(
        []
    );
    const [editRoutine, setEditRoutine] = useState<boolean>(false);
    const router = useRouter();
    const timeOfDay = (): "morning" | "night" => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return "morning";
        }
        return "night";
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

            const routineObjects: RoutineType[] = data;

            return routineObjects;
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to fetch products. Please try again later."
            );
        }
    };

    const deleteProduct = async (product: RoutineType) => {
        try {
            const userId = CurrentUser.getInstance().getId();
            const response = await fetch("/api/skincareRoutine", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: CurrentUser.getInstance().getId(),
                    product_id: product.product_id,
                    type: product.type,
                }),
            });

            const data = await response.json();
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
        if (!isRoutineLoading && routineProductsData) {
            setAMRoutineProducts(routineProductsData.morning);
            setPMRoutineProducts(routineProductsData.evening);
        }
    }, [routineProductsData, isRoutineLoading]);

    return (
        <SafeAreaView className="flex-1 bg-secondary">
            <Dropdown
                trigger={<></>}
                open={editRoutine}
                setOpen={setEditRoutine}
            >
                <RoutineEdit
                    morning={AMRoutineProducts}
                    evening={PMRoutineProducts}
                    onRoutineUpdated={refetchRoutineProducts}
                />
            </Dropdown>

            <View className="mx-6 mb-6 mt-8">
                <View
                    className="bg-primary rounded-2xl py-4 shadow"
                    style={{
                        boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                    }}
                >
                    <View className="flex-row pb-2 flex w-full gap-2 items-center justify-between px-4">
                        {timeOfDay() === "morning" ? (
                            <View className="flex-row gap-2 items-center justify-start">
                                <Sun size={20} color="#F7F4EA" />
                                <Text className="text-secondary font-bold">
                                    Your AM Routine
                                </Text>
                            </View>
                        ) : (
                            <View className="flex-row gap-2 items-center justify-start">
                                <Moon size={20} color="#F7F4EA" />
                                <Text className="text-secondary font-bold">
                                    Your PM Routine
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={() => setEditRoutine(!editRoutine)}
                        >
                            <Edit size={20} color="#F7F4EA" />
                        </TouchableOpacity>
                    </View>

                    <View
                        className="flex flex-col gap-2 justify-between mb-6 bg-tertiary rounded-2xl p-2 shadow"
                        style={{
                            boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        {/* Day Tabs */}
                        {/* <View
                            className="flex-row rounded-2xl overflow-clip justify-between"
                            style={{ overflow: "hidden" }}
                        >
                            {days.map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    onPress={() => setActiveDay(day)}
                                    className={`flex-1 py-3 items-center ${
                                        activeDay === day
                                            ? "bg-secondary"
                                            : "bg-primary/50"
                                    }`}
                                    style={
                                        activeDay === day
                                            ? {
                                                  boxShadow:
                                                      "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                              }
                                            : {}
                                    }
                                >
                                    <Text
                                        className={`font-semibold ${
                                            activeDay === day
                                                ? "text-primary"
                                                : "text-secondary/70"
                                        }`}
                                    >
                                        Day {day}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View> */}

                        <View className="gap-4 mt-4">
                            {isRoutineLoading ? (
                                <View className="flex items-center justify-center py-4">
                                    <Loader
                                        color="white"
                                        className="animate-spin"
                                    />
                                </View>
                            ) : timeOfDay() === "morning" ? (
                                AMRoutineProducts.length > 0 ? (
                                    AMRoutineProducts.map((step, index) => (
                                        <View
                                            key={index}
                                            className="bg-secondary rounded-2xl p-4 mb-3 flex-row items-center"
                                            style={{
                                                boxShadow:
                                                    "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            <View
                                                className="w-8 h-8 rounded-full bg-secondary items-center justify-center mr-3"
                                                style={{
                                                    boxShadow:
                                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                                }}
                                            >
                                                <Text className="text-primary font-bold text-sm">
                                                    {index + 1}
                                                </Text>
                                            </View>

                                            <View className="flex-1">
                                                <Text className="text-primary font-semibold text-base">
                                                    {step.product_name}
                                                </Text>
                                                <Text className="text-primary/70 text-sm">
                                                    {step.type}
                                                </Text>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <Text className="text-secondary/80 p-4 justify-center items-center w-full text-center text-xs">
                                        No products found, Add products to start
                                    </Text>
                                )
                            ) : PMRoutineProducts.length > 0 ? (
                                PMRoutineProducts.map((step, index) => (
                                    <View
                                        key={index}
                                        className="bg-secondary rounded-2xl p-4 mb-3 flex-row items-center"
                                        style={{
                                            boxShadow:
                                                "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                        }}
                                    >
                                        <View
                                            className="w-8 h-8 rounded-full bg-secondary items-center justify-center mr-3"
                                            style={{
                                                boxShadow:
                                                    "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                            }}
                                        >
                                            <Text className="text-primary font-bold text-sm">
                                                {index + 1}
                                            </Text>
                                        </View>

                                        <View className="flex-1">
                                            <Text className="text-primary font-semibold text-base">
                                                {step.product_name}
                                            </Text>
                                            <Text className="text-primary/70 text-sm">
                                                {step.type}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text className="text-secondary/80 p-4 justify-center items-center w-full text-center text-xs">
                                    No products found, Add products to start
                                </Text>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.push("/chatbot")}
                        style={{
                            boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                        }}
                        className="flex gap-4 flex-row justify-center items-center bg-secondary rounded-full p-4 mx-2"
                    >
                        <Sparkles size={20} color="#B87C4C" />
                        <Text className="text-primary font-bold">
                            Get Suggestions From FairyAI
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
