import { Stack } from "expo-router";
import { View } from "react-native";
import { Navbar } from "../../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanLayout() {
    return (
        <SafeAreaView className="flex-1 bg-[#F7F4EA]">
            <View className="flex-1">
                <Stack screenOptions={{ headerShown: false }} />
                <Navbar />
            </View>
        </SafeAreaView>
    );
}
