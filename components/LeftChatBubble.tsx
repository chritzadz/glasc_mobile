import React from 'react';
import { View, Text } from 'react-native';

interface LeftChatBubbleProps {
    message: string;
    }

const LeftChatBubble: React.FC<LeftChatBubbleProps> = ({ message }) => {
    return (
        <View className="flex-row justify-start mb-3">
        <View className="max-w-[80%] bg-white p-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
            <Text className="text-gray-800 text-base leading-5">
            {message}
            </Text>
        </View>
        </View>
    );
};

export default LeftChatBubble;