import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

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
        
        <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center">
            <Text className="text-gray-600 text-sm">Type: </Text>
            <Text className="text-[#B87C4C] font-semibold text-sm">{analysis.type}</Text>
            </View>
            
            <View className="flex-row items-center">
            <Text className="text-gray-600 text-sm">Match: </Text>
            <Text className="text-green-600 font-bold text-sm">{analysis.match_percentage}%</Text>
            </View>
        </View>
        
        <View className="flex-row items-center">
            <AlertTriangle size={16} color={warningCount > 0 ? "#ef4444" : "#22c55e"} />
            <Text className={`ml-2 text-sm font-medium ${warningCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {warningCount} Warning{warningCount !== 1 ? 's' : ''}
            </Text>
        </View>
        </View>
    );
}