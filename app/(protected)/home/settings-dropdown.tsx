import { View, Text, Pressable } from "react-native";
import { User, Settings as SettingsIcon, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ScrollView, Alert } from "react-native";
import CurrentUser from "../../../model/CurrentUser";
import { useAuth } from "../../../contexts/AuthContext";

export function Settings() {
    const router = useRouter();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            CurrentUser.getInstance().setId(-1);
            Alert.alert("Success", "You have successfully logged out.");
            router.replace("/login");
        } catch (error) {
            Alert.alert("Error", "Failed to logout. Please try again.");
            console.error("Logout error:", error);
        }
    };

    const SettingsItems: { component: React.ReactNode }[] = [
        {
            component: (
                <Pressable
                    className="w-full flex-row gap-4 items-center rounded-2xl p-4"
                    onPress={() => router.push("/edit_personal_form")}
                >
                    <User size={28} color="#FFFFFF" />
                    <View className="flex flex-col justify-start ">
                        <Text className="text-lg font-semibold text-white">
                            {user?.name}
                        </Text>
                        <Text className="text-sm text-gray-200">
                            {user?.email}
                        </Text>
                    </View>
                </Pressable>
            ),
        },
        {
            component: (
                <Pressable
                    className="w-full flex-row gap-4 items-center rounded-2xl p-4"
                    onPress={() => router.push("/edit_personal_form")}
                >
                    <SettingsIcon size={28} color="#FFFFFF" />
                    <View className="flex flex-col justify-start ">
                        <Text className="text-lg font-semibold text-white">
                            Settings
                        </Text>
                    </View>
                </Pressable>
            ),
        },
        {
            component: (
                <Pressable
                    className="w-full flex-row gap-4 items-center rounded-2xl p-4"
                    onPress={handleLogout}
                >
                    <LogOut size={28} color="#FFFFFF" />
                    <View className="flex flex-col justify-start ">
                        <Text className="text-lg font-semibold text-white">
                            Log out
                        </Text>
                    </View>
                </Pressable>
            ),
        },
    ];

    return (
        <View className="flex-1 w-full pt-2">
            <ScrollView className="flex flex-col">
                {SettingsItems.map((item, index) => (
                    <View
                        key={index}
                        className="w-full border-white border-b-2"
                    >
                        <View className="w-full border-[#996032] border-b-2">
                            {item.component}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
