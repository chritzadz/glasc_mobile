import { CircleMinus } from 'lucide-react-native';
import React from 'react';
import { View, Text, Image } from 'react-native';

interface RoutineProductProps {
    imageUrl: string;
    name: string;
}

const EditRoutineProduct = ({ imageUrl, name }: RoutineProductProps) => {
    return (
        <View className="items-center bg-[#B87C4C] rounded-lg p-2 shadow-md">
        <Image
            source={{ uri: imageUrl }}
            className="w-24 h-24 rounded-lg mb-2"
            resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black rounded-lg opacity-50" />
                
        <View className="absolute inset-0 items-center justify-center mb-2">
            <CircleMinus size={24} color="white" />
        </View>
        <Text
            className="text-center text-sm font-medium text-white"
            numberOfLines={2}
            ellipsizeMode="tail"
        >
            {name}
        </Text>
        </View>
    );
};

export default EditRoutineProduct;