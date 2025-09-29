import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Sun,
    Moon,
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    Save,
} from "lucide-react-native";
import { FlatList } from "react-native";
import { Routine as RoutineType } from "../../../../../model/Routine";
import CurrentUser from "../../../../../model/CurrentUser";
import ProductSearch from "./product-search";
import CustomAlertBox from "../../../../../components/CustomAlertBox";

interface RoutineEditProps {
    morning: RoutineType[];
    evening: RoutineType[];
    onRoutineUpdated?: () => void;
}

export default function RoutineEdit({
    morning,
    evening,
    onRoutineUpdated,
}: RoutineEditProps) {
    const currentUser = CurrentUser.getInstance();
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [searchType, setSearchType] = useState<"morning" | "evening">(
        "morning"
    );
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<RoutineType | null>(
        null
    );
    const [activeTab, setActiveTab] = useState<"morning" | "evening">(
        "morning"
    );

    const [routineData, setRoutineData] = useState<RoutineEditProps>({
        morning,
        evening,
    });

    const handleShowProductSearch = (type: "morning" | "evening") => {
        setSearchType(type);
        setShowProductSearch(true);
    };

    const handleProductAdded = () => {
        // Refresh the routine data after adding a product
        if (onRoutineUpdated) {
            onRoutineUpdated();
        }
    };

    const handleCloseProductSearch = () => {
        setShowProductSearch(false);
    };

    const showDeleteAlert = (product: RoutineType) => {
        setSelectedProduct(product);
        setIsAlertVisible(true);
    };

    const getProductNameById = async (id: number): Promise<string> => {
        try {
            console.log(`Fetching product name for ID: ${id}`);
            
            const response = await fetch(`/api/skincare?product_id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log(`Product fetch response status: ${response.status}`);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Product fetch error:', errorData);
                
                if (response.status === 404) {
                    return 'Product Not Found';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Product data:', data);
            
            if (data && data.length > 0) {
                return data[0].product_name || data[0].name || 'Unknown Product';
            } else {
                return 'No Product Data';
            }
        } catch (error) {
            console.error('Error fetching product name:', error);
            return 'Error Loading Product';
        }
    };
    
    const handleDeleteConfirm = async () => {
        if (selectedProduct) {
            try {
                const response = await fetch("/api/skincareRoutine", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: CurrentUser.getInstance().getId(),
                        product_id: selectedProduct.product_id,
                        type: selectedProduct.type,
                    }),
                });

                if (response.ok) {
                    Alert.alert("Success", "Product removed from routine.");
                    if (onRoutineUpdated) {
                        onRoutineUpdated();
                    }
                } else {
                    Alert.alert("Error", "Failed to remove product.");
                }
            } catch (error) {
                Alert.alert(
                    "Error",
                    "Failed to remove product. Please try again."
                );
            }
        }
        setIsAlertVisible(false);
        setSelectedProduct(null);
    };

    const handleDeleteCancel = () => {
        setIsAlertVisible(false);
        setSelectedProduct(null);
    };

    const handleMoveUp = (tab: "morning" | "evening", index: number) => {
        if (index === 0) return; // Can't move first item up

        setRoutineData((prev) => {
            const newProducts = [...prev[tab]];
            [newProducts[index - 1], newProducts[index]] = [
                newProducts[index],
                newProducts[index - 1],
            ];
            return {
                ...prev,
                [tab]: newProducts,
            };
        });
    };

    const handleMoveDown = (tab: "morning" | "evening", index: number) => {
        setRoutineData((prev) => {
            if (index === prev[tab].length - 1) return prev; // Can't move last item down

            const newProducts = [...prev[tab]];
            [newProducts[index], newProducts[index + 1]] = [
                newProducts[index + 1],
                newProducts[index],
            ];
            return {
                ...prev,
                [tab]: newProducts,
            };
        });
    };

    const handleSaveChanges = () => {
        const body = routineData;
        Alert.alert("Success", "Routine saved successfully!");
    };

    const renderProduct = ({
        item,
        index,
    }: {
        item: RoutineType & { index: number; activeTab: "morning" | "evening" };
        index: number;
    }) => (
        <View
            className="bg-secondary rounded-2xl p-4 mb-3 flex-row items-center"
            style={{
                boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
            }}
        >
            <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-3">
                <Text className="text-secondary font-bold text-sm">
                    {item.index}
                </Text>
            </View>

            <View className="flex-1">
                <Text className="text-primary font-semibold text-base">
                    {item.product_name}
                </Text>
                <Text className="text-primary/70 text-sm">
                    Step {item.index}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => showDeleteAlert(item)}
                className="p-2"
            >
                <Trash2 size={16} color="#B87C4C" />
            </TouchableOpacity>

            {/* Move Up/Down Buttons */}
            <View className="flex-col">
                <TouchableOpacity
                    onPress={() => handleMoveUp(item.activeTab, index)}
                    className="p-1"
                    disabled={index === 0}
                >
                    <ChevronUp
                        size={16}
                        color={index === 0 ? "#B87C4C50" : "#B87C4C"}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleMoveDown(item.activeTab, index)}
                    className="p-1"
                    disabled={index === routineData[activeTab].length - 1}
                >
                    <ChevronDown
                        size={16}
                        color={
                            index === routineData[activeTab].length - 1
                                ? "#B87C4C50"
                                : "#B87C4C"
                        }
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <>
            {/* Header */}
            <View className="flex-row items-center justify-between border-b-2 border-tertiary">
                <View className="flex-row items-center justify-between px-6 py-3 border-b-2 border-secondary w-full">
                    <View className="flex-row items-center">
                        <Text className="text-xl font-bold text-secondary">
                            Edit Routine
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={handleSaveChanges}
                        className="bg-secondary flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-full"
                        style={{
                            boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <Save size={16} color="#B87C4C" />
                        <Text className="text-primary font-semibold">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tab Switcher */}
            <View className="mx-6 py-4">
                <View
                    className="bg-secondary rounded-2xl p-2 flex-row"
                    style={{
                        boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setActiveTab("morning")}
                        className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                            activeTab === "morning" ? "bg-primary" : ""
                        }`}
                        style={
                            activeTab === "morning"
                                ? {
                                      boxShadow:
                                          "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                  }
                                : {}
                        }
                        activeOpacity={1}
                    >
                        <Sun
                            size={20}
                            color={
                                activeTab === "morning" ? "#F7F4EA" : "#B87C4C"
                            }
                        />
                        <Text
                            className={`ml-2 font-semibold ${
                                activeTab === "morning"
                                    ? "text-secondary"
                                    : "text-primary"
                            }`}
                        >
                            Morning
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab("evening")}
                        className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                            activeTab === "evening" ? "bg-primary" : ""
                        }`}
                        style={
                            activeTab === "evening"
                                ? {
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }
                                : {}
                        }
                        activeOpacity={1}
                    >
                        <Moon
                            size={20}
                            color={
                                activeTab === "evening" ? "#F7F4EA" : "#B87C4C"
                            }
                        />
                        <Text
                            className={`ml-2 font-semibold ${
                                activeTab === "evening"
                                    ? "text-secondary"
                                    : "text-primary"
                            }`}
                        >
                            Evening
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Products List */}
            <ScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-6">
                    <View
                        className="bg-secondary rounded-3xl p-2"
                        style={{
                            boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        {/* Products List */}
                        {routineData[activeTab].length > 0 ? (
                            <FlatList
                                data={routineData[activeTab].map(
                                    (product, index) => ({
                                        ...product,
                                        index: index + 1,
                                        activeTab: activeTab,
                                    })
                                )}
                                keyExtractor={(item, index) =>
                                    `${getProductNameById(item.product_id)}-${index}`
                                }
                                renderItem={renderProduct}
                                scrollEnabled={false}
                                showsVerticalScrollIndicator={false}
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center py-8">
                                <Text className="text-primary/50 text-center">
                                    No products added yet.{"\n"}Tap "Add
                                    Product" to get started.
                                </Text>
                            </View>
                        )}

                        {/* Add Product Button */}
                        <TouchableOpacity
                            onPress={() => handleShowProductSearch(activeTab)}
                            activeOpacity={1}
                            className="flex-row items-center justify-center py-3 mt-2 border-2 border-dashed border-primary/30 rounded-2xl"
                        >
                            <Plus size={20} color="#B87C4C" />
                            <Text className="ml-2 text-primary font-medium">
                                Add Product
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Product Search Modal */}
            {showProductSearch && (
                <View className="absolute inset-0 bg-white z-50">
                    <ProductSearch
                        type={searchType}
                        onProductAdded={handleProductAdded}
                        onClose={handleCloseProductSearch}
                    />
                </View>
            )}

            {/* Delete Confirmation Alert */}
            {isAlertVisible && selectedProduct && (
                <CustomAlertBox
                    title="Confirm Delete"
                    message={`Are you sure you want to remove ${selectedProduct.product_name} from your ${selectedProduct.type} routine?`}
                    onYes={handleDeleteConfirm}
                    onNo={handleDeleteCancel}
                />
            )}
        </>
    );
}
