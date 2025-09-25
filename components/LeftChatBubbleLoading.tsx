import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const LeftChatBubbleLoading: React.FC = () => {
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
        <View className="max-w-[80%] bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
            <Text className="text-gray-600 text-base leading-5 italic">
            Ryan is typing{dots}
            </Text>
        </View>
        </View>
    );
};

export default LeftChatBubbleLoading;