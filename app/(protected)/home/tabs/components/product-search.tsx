import {
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Text,
} from "react-native";
import { SearchIcon, X } from "lucide-react-native";
import React, { useState, useEffect } from "react";

import { Product } from "../../../../../model/Product";
import CurrentUser from "../../../../../model/CurrentUser";
import CustomAlertBox from "../../../../../components/CustomAlertBox";
import { ProductItemBox } from "../../../../../components/ProductItemBox";

interface ProductSearchProps {
    type: "morning" | "evening";
    onProductAdded: () => void;
    onClose: () => void;
}

export default function ProductSearch({
    type,
    onProductAdded,
    onClose,
}: ProductSearchProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);

    const showAlert = (product_id: string) => {
        setSelectedProduct(parseInt(product_id));
        console.log("product " + product_id);
        setAlertVisible(true);
    };

    const handleYes = async () => {
        console.log("User selected Yes");
        setIsLoading(true);
        const success = await addProduct(selectedProduct);
        setIsLoading(false);
        setAlertVisible(false);
        if (success) {
            onProductAdded();
            onClose();
        }
    };

    const handleNo = () => {
        console.log("User selected No");
        setAlertVisible(false);
    };

    const getProducts = async (): Promise<void> => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/skincare", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            const productObjects: Product[] = data.map((item: any) => ({
                product_name: item.product_name,
                product_url: item.product_url,
                price: item.price || "",
                product_id: item.product_id || "",
                image_url: item.image_url || "",
                category: item.category || "",
            }));
            setFilteredProducts(productObjects);
            setProducts(productObjects);
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to fetch products. Please try again later."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const filterProducts = () => {
        if (!Array.isArray(products) || products.length === 0) {
            setFilteredProducts(products);
            return;
        }

        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
            return;
        }

        const newFilteredProducts = products.filter((product) =>
            product.product_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );

        setFilteredProducts(newFilteredProducts);
    };

    const addProduct = async (product_id: number): Promise<boolean> => {
        try {
            console.log(product_id);
            const response = await fetch("/api/skincareRoutine", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: CurrentUser.getInstance().getId(),
                    product_id: product_id,
                    type: type,
                }),
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                Alert.alert("Success", `Product added to ${type} routine.`);
                return true;
            } else {
                Alert.alert("Error", `Failed to add ${type} routine.`);
                return false;
            }
        } catch (error) {
            Alert.alert("Error", "Failed to add product. Please try again.");
            return false;
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, products]);

    return (
        <View className="flex-1 bg-[#F7F4EA]">
            <View className="px-5 pt-4 h-full">
                {/* Header with close and search */}
                <View className="w-full flex flex-row gap-2 mb-4">
                    <TouchableOpacity
                        onPress={onClose}
                        className="items-center w-[40px] p-2 flex justify-center"
                    >
                        <X color="#B87C4C" size={24} />
                    </TouchableOpacity>
                    <View className="rounded-2xl p-1 border-2 items-center border-[#B87C4C] bg-[#F7F4EA] flex-1 px-2 flex flex-row gap-2">
                        <SearchIcon color="#B87C4C" />
                        <TextInput
                            placeholder="Search your products here..."
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                            className="text-[#b69982] w-full text-lg border-0"
                        />
                    </View>
                </View>

                {/* Products Grid */}
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >
                    {isLoading ? (
                        <View className="flex-1 items-center justify-center py-8">
                            <Text className="text-[#B87C4C] text-lg">
                                Loading products...
                            </Text>
                        </View>
                    ) : filteredProducts.length > 0 ? (
                        <View className="flex flex-col gap-2 w-full">
                            {Array.from({
                                length: Math.ceil(filteredProducts.length / 2),
                            }).map((_, rowIdx) => (
                                <View
                                    key={rowIdx}
                                    className="flex flex-row gap-2 mb-2"
                                >
                                    <View className="flex-1 shadow">
                                        <TouchableOpacity
                                            onPress={() =>
                                                showAlert(
                                                    filteredProducts[rowIdx * 2]
                                                        ?.product_id
                                                )
                                            }
                                        >
                                            <ProductItemBox
                                                imageUrl={
                                                    filteredProducts[rowIdx * 2]
                                                        ?.image_url ||
                                                    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"
                                                }
                                                name={
                                                    filteredProducts[rowIdx * 2]
                                                        ?.product_name
                                                }
                                                description=""
                                                onPress={() => {
                                                    showAlert(
                                                        filteredProducts[rowIdx * 2]
                                                            ?.product_id
                                                    )
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {filteredProducts[rowIdx * 2 + 1] && (
                                        <View className="flex-1 shadow">
                                            <TouchableOpacity
                                                onPress={() =>
                                                    showAlert(
                                                        filteredProducts[
                                                            rowIdx * 2 + 1
                                                        ]?.product_id
                                                    )
                                                }
                                            >
                                                <ProductItemBox
                                                    imageUrl={
                                                        filteredProducts[
                                                            rowIdx * 2 + 1
                                                        ]?.image_url ||
                                                        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"
                                                    }
                                                    name={
                                                        filteredProducts[
                                                            rowIdx * 2 + 1
                                                        ]?.product_name
                                                    }
                                                    description=""
                                                    onPress={() => {
                                                        showAlert(
                                                            filteredProducts[rowIdx * 2]
                                                                ?.product_id
                                                        )
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="flex-1 items-center justify-center py-8">
                            <Text className="text-[#B87C4C] text-lg text-center">
                                {searchTerm
                                    ? `No products found for "${searchTerm}"`
                                    : "No products available"}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            {isAlertVisible && (
                <CustomAlertBox
                    title="Confirm Action"
                    message={`Are you sure you want to add ${selectedProduct} to your ${type} routine?`}
                    onYes={handleYes}
                    onNo={handleNo}
                />
            )}
        </View>
    );
}
