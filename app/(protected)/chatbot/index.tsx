import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Send,
    Bot,
    User,
    ChevronLeft,
    SendHorizontal,
} from "lucide-react-native";
import { router, useRouter } from "expo-router";
import { TouchableWithoutFeedback } from "react-native";
import LeftChatBubble from "../../../components/LeftChatBubble";
import { Message, MessageType } from "../../../model/Message";
import RightChatBubble from "../../../components/RightChatBubble";
import RightChatBubbleLoading from "../../../components/RightChatBubbleLoading";
import { MessageImpl } from "../../../model/MessageImpl";
import LeftChatBubbleLoading from "../../../components/LeftChatBubbleLoading";
import { FlatList } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";

export default function Chatbot() {
    const router = useRouter();
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        new MessageImpl("Hello! How can I assist you today?", MessageType.BOT),
    ]);
    const [isFetching, setIsFetching] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const inputTranslateY = useSharedValue(0);
    const chatTranslateY = useSharedValue(0);

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            (e) => {
                const height = e.endCoordinates.height;
                setKeyboardHeight(height);

                inputTranslateY.value = withTiming(-height, {
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                });

                chatTranslateY.value = withTiming(-height, {
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                });
            }
        );

        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                setKeyboardHeight(0);

                inputTranslateY.value = withTiming(0, {
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                });

                chatTranslateY.value = withTiming(0, {
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                });
            }
        );

        return () => {
            keyboardWillShowListener?.remove();
            keyboardWillHideListener?.remove();
        };
    }, []);

    const onSend = async () => {
        Keyboard.dismiss();
        const userMessage: Message = new MessageImpl(prompt, MessageType.USER);
        setMessages((prev) => [userMessage, ...prev]);
        setPrompt("");
        setIsFetching(true);
        if (prompt.trim()) {
            try {
                const response = await fetch("/api/chatbot", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: prompt,
                        previousMessage: messages[messages.length - 2] || "",
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to get response from chatbot");
                }

                const data = await response.json();
                const botMessage: Message = data.analysis;
                setMessages((prev) => [botMessage, ...prev]);
                setIsFetching(false);
                console.log(messages);
            } catch (error) {
                console.error("Error calling chatbot API:", error);
                throw error;
            }
        }
    };

    const animatedInputStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: inputTranslateY.value }],
    }));

    const animatedChatStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: chatTranslateY.value }],
    }));

    return (
        <SafeAreaView className="flex-1 bg-secondary">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex-1">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-4">
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-10 h-10 rounded-full bg-primary items-center justify-center mr-3"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                                }}
                            >
                                <ChevronLeft size={20} color="#F7F4EA" />
                            </TouchableOpacity>
                            <Text className="text-xl font-bold text-primary">
                                FairyAI
                            </Text>
                        </View>
                    </View>

                    {/* Chat Area */}
                    <Animated.View
                        style={[animatedChatStyle, { flex: 1 }]}
                        className="px-4"
                    >
                        <FlatList
                            data={messages}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) =>
                                item.from === MessageType.BOT ? (
                                    <View className="flex-row gap-0 items-end justify-end mb-4">
                                        <View className="flex-1 mr-2">
                                            <RightChatBubble
                                                message={item.message}
                                            />
                                        </View>
                                        {item === messages[0] && (
                                            <View className="w-16 h-16">
                                                <Image
                                                    source={require("../../../assets/ryanfairy_cropped.png")}
                                                    className="w-16 h-16"
                                                    resizeMode="cover"
                                                />
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <View className="flex-row items-end mb-4">
                                        <View className="w-12 h-12 rounded-full bg-secondary border-2 border-primary items-center justify-center mr-2">
                                            <User size={20} color="#B87C4C" />
                                        </View>
                                        <View className="flex-1">
                                            <LeftChatBubble
                                                message={item.message}
                                            />
                                        </View>
                                    </View>
                                )
                            }
                            inverted={true}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            ListHeaderComponent={
                                isFetching ? (
                                    <View className="flex-row gap-0 items-end justify-end mb-4">
                                        <View className="flex-1 mr-2">
                                            <RightChatBubbleLoading />
                                        </View>
                                        <View className="w-16 h-16">
                                            <Image
                                                source={require("../../../assets/ryanfairy_cropped.png")}
                                                className="w-16 h-16"
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </View>
                                ) : null
                            }
                        />
                    </Animated.View>

                    {/* Input Area */}
                    <Animated.View
                        style={[animatedInputStyle]}
                        className="px-4 pb-4"
                    >
                        <View
                            className="bg-primary rounded-3xl p-4 flex-row items-center gap-3"
                            style={{
                                boxShadow:
                                    "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            <TextInput
                                value={prompt}
                                onChangeText={setPrompt}
                                placeholder="Type your message..."
                                className="flex-1 bg-secondary rounded-2xl px-4 py-3 text-primary text-base"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                    maxHeight: 100,
                                }}
                                multiline
                                placeholderTextColor="#B87C4C80"
                                onSubmitEditing={onSend}
                                returnKeyType="send"
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity
                                onPress={onSend}
                                className="bg-secondary p-3 rounded-full"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                                disabled={!prompt.trim()}
                            >
                                <SendHorizontal
                                    size={20}
                                    color={
                                        prompt.trim() ? "#B87C4C" : "#B87C4C50"
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
