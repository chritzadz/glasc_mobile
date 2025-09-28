import React from 'react';
import { View, Text } from 'react-native';

interface RightChatBubbleProps {
    message: string;
}

const RightChatBubble: React.FC<RightChatBubbleProps> = ({ message }) => {
    return (
        <View className="flex-row justify-end mb-3">
        <View className="max-w-[80%] bg-[#B87C4C] p-3 rounded-2xl rounded-br-sm shadow-sm">
            <Text className="text-white text-base leading-5">
            {message}
            </Text>
        </View>
        </View>
    );
};

export default RightChatBubble;