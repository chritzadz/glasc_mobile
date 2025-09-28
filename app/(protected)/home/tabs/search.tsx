import { ActivityIndicator, View, Text, Keyboard } from "react-native";
import { SearchIcon, Clock, X, CornerDownLeft } from "lucide-react-native";
import { TextInput, Alert, ScrollView } from "react-native";
import { ProductItemBox } from "../../../../components/ProductItemBox";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";

import { Product } from "../../../../model/Product";

export const Search = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isFetchingFromDb, setIsFetchingFromDb] = useState(true);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const searchInputRef = useRef<TextInput>(null);

    const searchBarPosition = useSharedValue(0);

    const filterProduct = () => {
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

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await fetch("/api/skincare");
                const data = await response.json();

                setProducts(data);
                setFilteredProducts(data);
                setIsFetchingFromDb(false);
            } catch (error) {
                Alert.alert(
                    "Error",
                    "Failed to fetch products. Please try again later."
                );
            }
        };

        const loadRecentSearches = async () => {
            const recent = await getRecentSearches();
            setRecentSearches(recent);
        };

        getProduct();
        loadRecentSearches();
    }, []);

    useEffect(() => {
        if (isSearchFocused) {
            searchBarPosition.value = withTiming(-1, {
                duration: 300,
                easing: Easing.inOut(Easing.ease),
            });
        } else {
            searchBarPosition.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.ease),
            });
        }
    }, [isSearchFocused]);

    const updateRecentSearches = async (searchTerm: string) => {
        if (searchTerm.trim() === "") return;

        const recentSearches = await AsyncStorage.getItem("recentSearches");
        let searches: string[] = [];

        if (recentSearches) {
            searches = JSON.parse(recentSearches);
        }

        searches = searches.filter((search) => search !== searchTerm);
        searches.unshift(searchTerm);
        searches = searches.slice(0, 10);

        await AsyncStorage.setItem("recentSearches", JSON.stringify(searches));
        setRecentSearches(searches);
    };

    const getRecentSearches = async (): Promise<string[]> => {
        const recentSearches = await AsyncStorage.getItem("recentSearches");
        if (recentSearches) {
            return JSON.parse(recentSearches);
        }
        return [];
    };

    const clearRecentSearches = async () => {
        await AsyncStorage.removeItem("recentSearches");
        setRecentSearches([]);
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchBlur = () => {
        if (searchTerm.trim() === "") {
            setIsSearchFocused(false);
        }
    };

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            updateRecentSearches(searchTerm);
            filterProduct();
            setIsSearchFocused(false);
            searchInputRef.current?.blur();
            Keyboard.dismiss();
        }
    };

    const handleRecentSearchPress = (search: string) => {
        setSearchTerm(search);
        updateRecentSearches(search);
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
        Keyboard.dismiss();

        const newFilteredProducts = products.filter((product) =>
            product.product_name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(newFilteredProducts);
    };

    const handleCloseSearch = () => {
        setSearchTerm("");
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
        Keyboard.dismiss();
    };

    const animatedSearchBarStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: searchBarPosition.value }],
        };
    });

    return (
        <View className="relative flex flex-col w-full h-screen items-center px-5">
            {/* Animated Search Bar */}
            <Animated.View
                style={[animatedSearchBarStyle]}
                className={`shadow z-30 w-full flex flex-row gap-2 ${
                    isSearchFocused ? "absolute top-0" : "absolute bottom-44"
                }`}
            >
                <View
                    style={{
                        boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                    }}
                    className="text-secondary rounded-full shadow p-1 items-center bg-primary flex-1 px-3 flex flex-row gap-2"
                >
                    <SearchIcon color="#F7F4EA" size={20} />
                    <TextInput
                        ref={searchInputRef}
                        placeholder="Search your products here..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onFocus={handleSearchFocus}
                        onBlur={handleSearchBlur}
                        onSubmitEditing={handleSearchSubmit}
                        placeholderTextColor={"#F7F4EA"}
                        className="text-secondary-200 flex-1 text-lg border-0"
                        returnKeyType="search"
                    />
                    {isSearchFocused && (
                        <View className="flex items-center justify-center flex-row gap-4 pe-2">
                            <TouchableOpacity onPress={handleSearchSubmit}>
                                <CornerDownLeft color="#F7F4EA" size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCloseSearch}>
                                <X color="#F7F4EA" size={20} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Animated.View>

            {/* Recent Searches - Show when search is focused */}
            {isSearchFocused && (
                <View
                    className="absolute top-16 left-5 right-5 z-20 bg-primary rounded-2xl shadow p-4"
                    style={{
                        boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                    }}
                >
                    <View className="flex flex-row justify-between items-center mb-3">
                        <Text className="text-lg font-semibold text-secondary">
                            Recent Searches
                        </Text>
                        {recentSearches.length > 0 && (
                            <TouchableOpacity onPress={clearRecentSearches}>
                                <Text className="text-sm text-secondary opacity-70">
                                    Clear All
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {recentSearches.length === 0 ? (
                        <View className="flex items-center py-8">
                            <Clock color="#F7F4EA" size={32} opacity={0.5} />
                            <Text className="text-secondary opacity-70 mt-2">
                                No recent searches
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            className="max-h-64"
                            showsVerticalScrollIndicator={false}
                        >
                            {recentSearches.map((search, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() =>
                                        handleRecentSearchPress(search)
                                    }
                                    className="flex flex-row items-center py-3 px-2 border-b border-secondary/20"
                                >
                                    <Clock
                                        color="#F7F4EA"
                                        size={16}
                                        opacity={0.7}
                                    />
                                    <Text className="ml-3 text-secondary text-base flex-1">
                                        {search}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
            )}

            {/* Main Content */}
            {!isSearchFocused && (
                <>
                    {isFetchingFromDb ? (
                        <View className="bg-[#F7F4EA] flex-1 mt-32">
                            <ActivityIndicator size="large" color="#B87C4C" />
                        </View>
                    ) : (
                        <View className="max-h-[85vh] mb-32 w-full relative">
                            <LinearGradient
                                colors={["transparent", "#F7F4EA"]}
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: 80,
                                    zIndex: 10,
                                    width: "100%",
                                }}
                            />
                            <ScrollView className="flex flex-col gap-2 h-full w-full">
                                {Array.from({
                                    length: Math.ceil(
                                        filteredProducts.length / 2
                                    ),
                                }).map((_, rowIdx) => (
                                    <View
                                        key={rowIdx}
                                        className="flex flex-row gap-2 mb-2"
                                    >
                                        <ProductItemBox
                                            imageUrl={
                                                "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80"
                                            }
                                            name={
                                                filteredProducts[rowIdx * 2]
                                                    ?.product_name
                                            }
                                            description={"tthis"}
                                        />

                                        {filteredProducts[rowIdx * 2 + 1] && (
                                            <ProductItemBox
                                                imageUrl={
                                                    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80"
                                                }
                                                name={
                                                    filteredProducts[
                                                        rowIdx * 2 + 1
                                                    ]?.product_name
                                                }
                                                description={"tthis"}
                                            />
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};
