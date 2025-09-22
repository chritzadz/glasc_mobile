import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function Root() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return;

        const timeout = setTimeout(() => {
            if (isAuthenticated) {
                router.replace("/scan");
            } else {
                router.replace("/login");
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [isAuthenticated, isLoading]);

    return (
        <View className="flex-1 justify-center items-center bg-[#B87C4C]">
            <ActivityIndicator size="large" color="#ffffff" />
        </View>
    );
}
