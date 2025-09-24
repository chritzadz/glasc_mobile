import React from 'react';
import { View, Text, Image } from 'react-native';

interface RoutineProductProps {
    imageUrl: string;
    name: string;
}

const RoutineProduct = ({ imageUrl, name }: RoutineProductProps) => {
    return (
        <View className="items-center bg-[#B87C4C] rounded-lg p-2 shadow-md">
        <Image
            source={{ uri: imageUrl }}
            className="w-24 h-24 rounded-lg mb-2"
            resizeMode="cover"
        />
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

export default RoutineProduct;