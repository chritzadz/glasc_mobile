import React, { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import CurrentUser from "../model/CurrentUser";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(public)";
        if (!isAuthenticated && !inAuthGroup) {
            router.replace("/(public)/login");
        } else if (isAuthenticated && inAuthGroup) {
            if (user != null) {
                CurrentUser.getInstance().setId(user.id);
            }
            router.replace("/(protected)/home");
        }
    }, [isAuthenticated, isLoading, segments]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-[#B87C4C]">
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return <>{children}</>;
};

export default AuthGuard;
