import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle, Lightbulb } from 'lucide-react-native';

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
    const truncatedName = productName.length > 30
        ? `${productName.substring(0, 30)}...`
        : productName;

    const warningCount = analysis.harmful_ingredients?.length || 0;

    useEffect(() => {
        console.log("DetailBox analysis:", analysis);
        console.log(analysis.type);
    }, [])

    return (
        <View className="bg-white rounded-2xl p-4 mx-5 mb-4 border-2 border-[#B87C4C] shadow-sm">
            <Text className="text-[#B87C4C] font-bold text-lg mb-2" numberOfLines={1}>
                {truncatedName}
            </Text>
            
            <View className="flex-row flex-wrap flex items-center mb-2 gap-2">
                <View className="flex-row items-center bg-[#5078a7] border-[#B87C4C] border-2 px-2 py-1 rounded-full gap-1">
                    <Lightbulb size={14} color={"white"}/>
                    <Text className="text-white font-bold text-sm ">{analysis.type}</Text>
                </View>
                
                <View className="flex-row items-center bg-green-600 border-[#B87C4C] border-2 px-2 py-1 rounded-full gap-1">
                    <Text className="text-white font-bold text-sm">{analysis.match_percentage}%</Text>
                    <Text className="text-white text-sm font-bold">Match</Text>
                </View>

                <View className="flex-row items-center bg-red-600 border-[#B87C4C] border-2 px-2 py-1 rounded-full gap-1">
                    <AlertTriangle size={16} color={warningCount > 0 ? "#ffffff" : "#ffffff"} />
                    <Text className={`text-sm font-medium ${warningCount > 0 ? 'text-white' : 'text-white'}`}>
                        {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                    </Text>
                </View>
            </View>
        </View>
    );
}