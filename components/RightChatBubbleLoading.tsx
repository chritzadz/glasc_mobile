import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const RightChatBubbleLoading: React.FC = () => {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
        setDots(prev => {
            if (prev === '...') return '.';
            return prev + '.';
        });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <View className="flex-row justify-start mb-3">
        <View className="max-w-[80%] bg-[#B87C4C] p-3 rounded-2xl rounded-tr-sm shadow-sm">
            <Text className="text-white text-base leading-5 opacity-70">
            Typing{dots}
            </Text>
        </View>
        </View>
    );
};

export default RightChatBubbleLoading;