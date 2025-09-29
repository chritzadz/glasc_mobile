import "../global.css";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../contexts/AuthContext";
import AuthGuard from "../components/AuthGuard";
import {
    useFonts,
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
    Lexend_900Black,
} from "@expo-google-fonts/lexend";
import { View } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
    let [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_500Medium,
        Lexend_600SemiBold,
        Lexend_700Bold,
        Lexend_800ExtraBold,
        Lexend_900Black,
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AuthGuard>
                    <View className="flex-1">
                        <Stack screenOptions={{ headerShown: false }} />
                    </View>
                </AuthGuard>
            </AuthProvider>
        </QueryClientProvider>
    );
}
