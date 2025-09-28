import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { AlertTriangle, Lightbulb } from "lucide-react-native";
import { Sparkles } from "lucide-react-native";

interface HarmfulIngredient {
    ingredient: string;
    why: string;
}

interface Analysis {
    type: string;
    match_percentage: string;
    harmful_ingredients: HarmfulIngredient[];
}

interface DetailBoxProps {
    productName: string;
    analysis: Analysis;
}

export default function DetailBox({ productName, analysis }: DetailBoxProps) {
    const truncatedName =
        productName.length > 30
            ? `${productName.substring(0, 30)}...`
            : productName;

    const warningCount = analysis.harmful_ingredients?.length || 0;

    useEffect(() => {
        console.log("DetailBox analysis:", analysis);
        console.log(analysis.type);
    }, []);

    return (
        <View
            className="bg-white border-primary border-2 rounded-2xl p-3 mx-5 mb-4 shadow flex flex-col gap-2"
            style={{
                boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
            }}
        >
            <View className="flex-row flex-wrap flex items-center justify-start gap-2">
                <Sparkles size={20} color={"#B87C4C"} />
                <Text
                    className="text-[#B87C4C] font-bold text-lg"
                    numberOfLines={1}
                >
                    {truncatedName}
                </Text>
            </View>

            <View className="flex-row flex-wrap flex items-center mb-2 gap-2">
                <View className="flex-row items-center bg-indigo-500 border-indigo-200 shadow border-2 px-2 py-1 rounded-full gap-1">
                    <Lightbulb size={14} color={"white"} />
                    <Text className="text-white font-bold text-sm ">
                        {analysis.type}
                    </Text>
                </View>

                <View className="flex-row items-center bg-emerald-600 border-emerald-200 shadow border-2 px-2 py-1 rounded-full gap-1">
                    <Text className="text-white font-bold text-sm">
                        {analysis.match_percentage}%
                    </Text>
                    <Text className="text-white text-sm font-bold">Match</Text>
                </View>

                <View className="flex-row items-center bg-red-600 border-red-200 shadow border-2 px-2 py-1 rounded-full gap-1">
                    <AlertTriangle
                        size={16}
                        color={warningCount > 0 ? "#ffffff" : "#ffffff"}
                    />
                    <Text
                        className={`text-sm font-medium ${
                            warningCount > 0 ? "text-white" : "text-white"
                        }`}
                    >
                        {warningCount} Warning{warningCount !== 1 ? "s" : ""}
                    </Text>
                </View>
            </View>
        </View>
    );
}
