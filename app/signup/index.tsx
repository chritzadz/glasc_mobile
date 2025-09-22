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
import { useAuth } from "../../contexts/AuthContext";
import { User } from "../../model/User";
import CurrentUser from "../../model/CurrentUser";
import { useAuth } from "../../contexts/AuthContext";

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
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();

    const userExist = (users: User[]): User | null => {
        const found = users.find(
            (user: User) => user.email === email && user.password === password
        );
        return found ? found : null;
    };

    const handleSignUpButton = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        const success = await saveCredential();
        console.log(success);
        await handleSignUpResponse(success);
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

    const handleSignUpResponse = async (success: boolean): Promise<void> => {
        if (success) {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser) {
                    await login(currentUser);
                    CurrentUser.getInstance().setId(currentUser.id);
                    Alert.alert("Success", "User successfully signed up");
                    router.push("/personal_form");
                } else {
                    Alert.alert(
                        "Error",
                        "Failed to retrieve user information after signup."
                    );
                }
            } catch (error) {
                Alert.alert(
                    "Error",
                    "Failed to complete signup. Please try again."
                );
                console.error("Signup completion error:", error);
            }
        } else {
            Alert.alert("Error", "Failed to sign up. Please try again.");
        }
        setIsSubmitting(false);
    };

    const saveCredential = async () => {
        const response = await fetch("/api/users", {
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

        console.log(data);
        console.log(response.status);

        if (response.ok) {
            return true;
        } else {
            return false;
        }
    };

    const getCurrentUser = async (): Promise<User | null> => {
        try {
            const response = await fetch("/api/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            const users: User[] = data;

            const currUser: User | null = userExist(users);
            if (currUser != null) {
                console.log(`Current user id signup is: ${currUser.id}`);
                return currUser;
            }
            return null;
        } catch (error) {
            console.error("Error fetching current user:", error);
            return null;
        }
        return currUser;
    };

    return (
        <SafeAreaView className="bg-[#B87C4C] flex-1 items-center justify-center">
            <View className="flex justify-center items-center">
                <Text className="text-4xl text-white">Create your account</Text>
            </View>

            <View className="w-full items-center px-7 mt-10">
                <Text className="self-start text-white font-bold mb-2">
                    Name
                </Text>
                <TextInput
                    className="w-full h-12 px-3 my-1 text-lg border border-[#bf7641] rounded-lg mb-5 bg-white"
                    placeholder="Enter your name"
                    placeholderTextColor={"#6A7E97"}
                    value={username}
                    onChangeText={setUsername}
                />
                <Text className="self-start text-white font-bold mb-2">
                    Email Address
                </Text>
                <TextInput
                    className="w-full h-12 px-3 my-1 text-lg border border-[#bf7641] rounded-lg mb-5 bg-white"
                    placeholder="Enter Email"
                    placeholderTextColor={"#6A7E97"}
                    value={email}
                    onChangeText={setEmail}
                />
                <Text className="self-start text-white font-bold mb-2">
                    Password
                </Text>
                <TextInput
                    className="w-full h-12 px-3 my-1 text-lg border border-[#bf7641] rounded-lg mb-5 bg-white"
                    placeholder="Enter Password"
                    placeholderTextColor={"#6A7E97"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <View className="w-full">
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#fffff" />
                    ) : (
                        <Pressable
                            onPress={handleSignUpButton}
                            className="mt-10 py-3 px-5 rounded-lg items-center bg-white"
                        >
                            <Text className="font-bold text-lg text-[#bf7641]">
                                Sign Up
                            </Text>
                        </Pressable>
                    )}
                </View>
                <Text className="mt-10 text-white text-center">
                    Already have an account?{" "}
                    <Text
                        onPress={() => router.push("/login")}
                        className="text-white underline font-bold"
                    >
                        Log In
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default Signup;
