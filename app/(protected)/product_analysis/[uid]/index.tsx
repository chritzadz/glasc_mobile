import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertTriangle, ChevronLeft, Lightbulb } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ProductItemBox } from "../../../../components/ProductItemBox";
import { Product } from "../../../../model/Product";

interface HarmfulIngredient {
    ingredient: string;
    why: string;
}

interface Analysis {
    type: string;
    match_percentage: string;
    harmful_ingredients: HarmfulIngredient[];
}

export default function ProductAnalysisPage() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const productName = Array.isArray(params.productName)
        ? params.productName[0]
        : params.productName;
    const analysisStr = Array.isArray(params.analysis)
        ? params.analysis[0]
        : params.analysis;
    const analysis: Analysis = JSON.parse(analysisStr);

    const [skincareProducts, setSkincareProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchSkincareProducts = async () => {
            try {
                const response = await fetch("/api/skincare");
                const data = await response.json();
                setSkincareProducts(data);
            } catch (error) {
                console.error("Error fetching skincare products:", error);
            }
        };
        fetchSkincareProducts();
    }, []);

    return (
        <View className="bg-[#F7F4EA] flex-1">
            <SafeAreaView className="flex-1 px-5">
                <ScrollView className="flex-1">
                    <View className="flex-col flex gap-4">
                        <View className="flex flex-row justify-center items-center p-2">
                            <ChevronLeft
                                onPress={() => {
                                    router.back();
                                }}
                            ></ChevronLeft>
                            <Text className="font-bold text-2xl flex w-full justify-center items-center">
                                {productName}
                            </Text>
                        </View>

                        <View className="flex-row flex-wrap flex items-center mb-2 gap-2">
                            <View className="flex-row items-center bg-[#5078a7] border-[#B87C4C] border-2 px-2 py-1 rounded-full gap-1">
                                <Lightbulb size={14} color={"white"} />
                                <Text className="text-white font-bold text-sm ">
                                    {analysis.type}
                                </Text>
                            </View>

                            <View className="flex-row items-center bg-green-600 border-[#B87C4C] border-2 px-2 py-1 rounded-full gap-1">
                                <Text className="text-white font-bold text-sm">
                                    {analysis.match_percentage}%
                                </Text>
                                <Text className="text-white text-sm font-bold">
                                    Match
                                </Text>
                            </View>
                        </View>

                        {analysis.harmful_ingredients &&
                        analysis.harmful_ingredients.length > 0 ? (
                            analysis.harmful_ingredients.map((item, idx) => (
                                <View
                                    key={idx}
                                    className="bg-[#ffe5e5] rounded-lg flex flex-row gap-3 items-center p-2"
                                >
                                    <AlertTriangle></AlertTriangle>
                                    <View>
                                        <Text className="font-bold">
                                            {item.ingredient}
                                        </Text>
                                        <Text className="text-sm">
                                            {item.why}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={{ marginTop: 8 }}>None detected.</Text>
                        )}

                        <View className="w-full">
                            <Text className="font-bold text-2xl flex w-full justify-center items-center">
                                {"Similar Products"}
                            </Text>
                        </View>

                        {Array.from({
                            length: Math.ceil(skincareProducts.length / 2),
                        }).map((_, rowIdx) => (
                            <View
                                key={rowIdx}
                                className="flex flex-row gap-2 mb-2"
                            >
                                <View className="flex-1">
                                    <ProductItemBox
                                        imageUrl={
                                            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"
                                        }
                                        name={
                                            skincareProducts[rowIdx * 2]
                                                ?.product_name
                                        }
                                        description=""
                                    />
                                </View>
                                {skincareProducts[rowIdx * 2 + 1] && (
                                    <View className="flex-1">
                                        <ProductItemBox
                                            imageUrl={
                                                "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80"
                                            }
                                            name={
                                                skincareProducts[rowIdx * 2 + 1]
                                                    ?.product_name
                                            }
                                            description=""
                                        />
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
