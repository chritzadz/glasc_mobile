import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    StyleSheet,
    Text,
    View,
    Pressable,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";

import validation from "../../../util/validation";
import { User } from "../../../model/User";
import CurrentUser from "../../../model/CurrentUser";
import { useAuth } from "../../../contexts/AuthContext";

const Login = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userExist = (users: User[]): User | null => {
        const found = users.find(
            (user: User) => user.email === email && user.password === password
        );
        return found ? found : null;
    };

    const handleLogInButton = async () => {
        if (!areFieldsFilled()) return;
        if (!isEmailValid()) return;

        setIsSubmitting(true);

        try {
            const currUser = await getUser();
            if (currUser) {
                await login(currUser);

                CurrentUser.getInstance().setId(currUser.id);

                Alert.alert("Success", "User successfully logged in");
                router.push("/home");
            } else {
                setIsSubmitting(false);
                Alert.alert(
                    "Error",
                    "User not found. Please check your email and try again."
                );
            }
        } catch (error) {
            setIsSubmitting(false);
            Alert.alert("Error", "Failed to log in. Please try again.");
            console.error("Login error:", error);
        }
    };

    const getUser = async (): Promise<User | null> => {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password })
            });


            const data = await response.json();

            return data;
        } catch (error) {
            Alert.alert(
                "Error",
                "Failed to fetch users. Please try again later."
            );
            return null;
        }
    };

    const areFieldsFilled = (): boolean => {
        if (!email || !password) {
            Alert.alert("Empty Field", "All field must be filled");
            return false;
        }
        return true;
    };

    const isEmailValid = (): boolean => {
        if (!validation.validateEmail(email)) {
            Alert.alert("Invalid Email", "Email format is invalid");
            return false;
        }
        return true;
    };

    return (
        <SafeAreaView className="bg-secondary flex-1 items-center justify-center px-6">
            <View className="w-full max-w-sm">
                {/* Header */}
                <View className="items-center mb-12">
                    <Text className="text-4xl font-bold text-primary mb-2">
                        Welcome Back
                    </Text>
                    <Text className="text-lg text-primary/70 text-center">
                        Sign in to continue your skincare journey
                    </Text>
                </View>

                {/* Form Container */}
                <View
                    className="bg-primary rounded-3xl p-6 shadow-lg"
                    style={{
                        boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                    }}
                >
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
                            placeholder="Enter your password"
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
                                onPress={handleLogInButton}
                                className="py-4 rounded-2xl items-center bg-secondary"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Text className="font-bold text-lg text-primary">
                                    Sign In
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Sign Up Link */}
                <View className="items-center mt-8">
                    <Text className="text-primary/70 text-center text-base">
                        Don't have an account?{" "}
                        <Text
                            onPress={() => router.push("/signup")}
                            className="text-primary font-bold underline"
                        >
                            Sign Up
                        </Text>
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Login;
