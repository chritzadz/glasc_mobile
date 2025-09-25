import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, ChevronLeft, SendHorizontal } from 'lucide-react-native';
import { router, useRouter } from 'expo-router';
import { TouchableWithoutFeedback } from 'react-native';
import LeftChatBubble from '../../components/LeftChatBubble';
import { Message, MessageType } from '../../model/Message';
import RightChatBubble from '../../components/RightChatBubble';
import RightChatBubbleLoading from '../../components/RightChatBubbleLoading';
import { MessageImpl } from '../../model/MessageImpl';
import LeftChatBubbleLoading from '../../components/LeftChatBubbleLoading';

export default function Chatbot() {
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        new MessageImpl("Hello! How can I assist you today?", MessageType.BOT)
    ]);
    const [isFetching, setIsFetching] = useState(false);

    const onSend = async () => {
        Keyboard.dismiss;
        const userMessage: Message = new MessageImpl(prompt, MessageType.USER);
        setMessages(prev => [...prev, userMessage]);
        setPrompt("");
        setIsFetching(true);
        if (prompt.trim()) {
            try {
                const response = await fetch('/api/chatbot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: prompt,
                        previousMessage: messages[messages.length - 2] || ""
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to get response from chatbot');
                }

                const data = await response.json();
                const botMessage: Message = data.analysis;
                setMessages(prev => [...prev, botMessage])
                setIsFetching(false);
                console.log(messages);
            } catch (error) {
                console.error('Error calling chatbot API:', error);
                throw error;
            }
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                <SafeAreaView className="flex-1 bg-[#F7F4EA] relative" >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex bg-[#F7F4EA] flex-row gap-3 items-center px-5">
                            <View className="items-center w-[20px] flex justify-center">
                                <ChevronLeft color="#B87C4C" onPress={() => {router.back()}}></ChevronLeft>
                            </View>
                            <Text className="text-center items-center justify-center text-2xl"> RyanFairy </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    

                    <View className="flex-1 px-5 bg-[#F7F4EA] pt-5">
                        <ScrollView className="flex-1">
                            {messages.map((message, index) => (
                                message.from === MessageType.BOT ? (
                                    <RightChatBubble
                                        key={index}
                                        message={message.message}
                                    />
                                    
                                ) : (
                                    <LeftChatBubble
                                        key={index}
                                        message={message.message}
                                    />
                                )
                            ))}
                            {
                                isFetching && (
                                    <RightChatBubbleLoading>
                                    </RightChatBubbleLoading>
                                )
                            }
                        </ScrollView>
                    </View>
                    
                    <View className="border-[#B87C4C] border-t-2"></View>
                    <View className="left-0 right-0 px-3 pt-3 bg-[#F7F4EA]">
                        <View className="flex-row items-center gap-2">
                            <TextInput
                                value={prompt}
                                onChangeText={setPrompt}
                                placeholder="Type your message..."
                                className="flex-1 bg-white border text-xl border-gray-300 rounded-lg px-3 py-2"
                                multiline
                            />
                            <TouchableOpacity
                                onPress={onSend}
                                className="bg-[#B87C4C] p-2 rounded-lg"
                                disabled={!prompt.trim()}
                            >
                                <SendHorizontal size={20} color="white" onPress={onSend}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
        </KeyboardAvoidingView>
    );
}