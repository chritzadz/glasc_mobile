import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    Pressable,
    Text,
    View,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";
import { z } from "zod";
import CurrentUser from "../../../model/CurrentUser";

const signupSchema = z.object({
    username: z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    email: z.email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be less than 100 characters"),
});

const Signup = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSignUpButton = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: username,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok && data) {
                const currentUser = data;
                CurrentUser.getInstance().setId(currentUser.id);
                router.push("/personal_form");
            } else {
                Alert.alert("Error", "Failed to sign up. Please try again.");
            }
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to complete signup. Please try again."
            );
            console.error("Signup completion error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = (): boolean => {
        try {
            signupSchema.parse({
                username: username.trim(),
                email: email.trim(),
                password: password,
            });
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const firstError = error.issues[0];
                Alert.alert("Validation Error", firstError.message);
            } else {
                Alert.alert("Error", "An unexpected error occurred");
            }
            return false;
        }
    };

    return (
        <SafeAreaView className="bg-secondary flex-1 items-center justify-center px-6">
            <View className="w-full max-w-sm">
                {/* Header */}
                <View className="items-center mb-12">
                    <Text className="text-4xl font-bold text-primary mb-2">
                        Join Glasc
                    </Text>
                    <Text className="text-lg text-primary/70 text-center">
                        Start your personalized skincare journey
                    </Text>
                </View>

                {/* Form Container */}
                <View
                    className="bg-primary rounded-3xl p-6 shadow-lg"
                    style={{
                        boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                    }}
                >
                    {/* Name Field */}
                    <View className="mb-4">
                        <Text className="text-secondary font-semibold mb-2 text-base">
                            Full Name
                        </Text>
                        <TextInput
                            className="w-full h-12 px-4 text-lg rounded-2xl bg-secondary text-primary"
                            style={{
                                boxShadow:
                                    "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                            }}
                            placeholder="Enter your full name"
                            placeholderTextColor={"#B87C4C80"}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Email Field */}
                    <View className="mb-4">
                        <Text className="text-secondary font-semibold mb-2 text-base">
                            Email Address
                        </Text>
                        <TextInput
                            className="w-full h-12 px-4 text-lg rounded-2xl bg-secondary text-primary"
                            style={{
                                boxShadow:
                                    "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                            }}
                            placeholder="Enter your email"
                            placeholderTextColor={"#B87C4C80"}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Field */}
                    <View className="mb-6">
                        <Text className="text-secondary font-semibold mb-2 text-base">
                            Password
                        </Text>
                        <TextInput
                            className="w-full h-12 px-4 text-lg rounded-2xl bg-secondary text-primary"
                            style={{
                                boxShadow:
                                    "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                            }}
                            placeholder="Create a secure password"
                            placeholderTextColor={"#B87C4C80"}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={true}
                        />
                    </View>

                    {/* Submit Button */}
                    <View className="w-full">
                        {isSubmitting ? (
                            <View className="py-4 items-center">
                                <ActivityIndicator
                                    size="small"
                                    color="#F7F4EA"
                                />
                            </View>
                        ) : (
                            <Pressable
                                onPress={handleSignUpButton}
                                className="py-4 rounded-2xl items-center bg-secondary"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Text className="font-bold text-lg text-primary">
                                    Create Account
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Login Link */}
                <View className="items-center mt-8">
                    <Text className="text-primary/70 text-center text-base">
                        Already have an account?{" "}
                        <Text
                            onPress={() => router.push("/login")}
                            className="text-primary font-bold underline"
                        >
                            Sign In
                        </Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Signup;
