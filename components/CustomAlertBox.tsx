import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CustomAlertBoxProps {
    title: string;
    message: string;
    onYes: () => void;  
    onNo: () => void;   
}

const CustomAlertBox = ({ title, message, onYes, onNo }: CustomAlertBoxProps) => (
    <View className="w-full h-60 flex-col items-center justify-center rounded-2xl bg-[#B87C4C] p-4">
        <Text className="font-bold text-lg text-[#F7F4EA] mb-2">{title}</Text>
        <Text className="text-md text-[#F7F4EA] mb-4 text-center">{message}</Text>
        <View className="flex-row justify-around w-full">
            <TouchableOpacity
                onPress={onYes}
                className="w-1/3 h-10 bg-[#F7F4EA] rounded-xl items-center justify-center mr-2"
            >
                <Text className="font-bold text-[#B87C4C]">Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onNo}
                className="w-1/3 h-10 bg-[#F7F4EA] rounded-xl items-center justify-center ml-2"
            >
                <Text className="font-bold text-[#B87C4C]">No</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default CustomAlertBox;