import { View, Text, Pressable } from "react-native";
import { User, ListChecks, LogOut, ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { ScrollView, Alert } from "react-native";
import CurrentUser from "../../model/CurrentUser";
import { useAuth } from "../../contexts/AuthContext";

export default function Settings({ onClose }: { onClose?: () => void }) {
    const router = useRouter();
    const { logout } = useAuth();

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

    const handleTest = () => {router.push({
        pathname: '/product_analysis',
        params: {
            productName: "LABORE Acne Oil Product Skincare",
            analysis: JSON.stringify("this is the analysis"),
        },
        })}


    return (
        <>
            <View className="absolute h-screen w-screen z-10 bg-black/30 backdrop-blur-xl" />
            <View className="bg-[#F7F4EA] relative z-20 flex-1 w-full px-6 pt-16 rounded-b-2xl">
                <View className="w-full flex flex-row gap-5 mb-8">
                    <View className="items-center w-[20px] p-2 flex justify-center">
                        <ChevronLeft
                            color="#B87C4C"
                            onPress={onClose}
                        ></ChevronLeft>
                    </View>
                    <View className="justify-start items-center">
                        <Text className="text-3xl font-bold text-[#B87C4C]">
                            Settings
                        </Text>
                    </View>
                </View>
                <ScrollView className="flex-1 flex flex-col gap-2">
                    <View className="mb-4">
                        <Pressable
                            className="flex-row items-center rounded-2xl bg-white p-4"
                            onPress={() => router.push("/edit_personal_form")}
                        >
                            <User size={28} color="#B87C4C" />
                            <Text className="ml-4 text-lg font-semibold text-[#B87C4C]">
                                Personal Details
                            </Text>
                        </Pressable>
                    </View>

                    <View className="mb-4">
                        <Pressable
                            className="flex-row items-center rounded-2xl bg-white p-4"
                            onPress={() => router.push("/skincare_routine")}
                        >
                            <ListChecks size={28} color="#B87C4C" />
                            <Text className="ml-4 text-lg font-semibold text-[#B87C4C]">
                                Skincare Routine
                            </Text>
                        </Pressable>
                    </View>

                    <View className="mb-4">
                        <Pressable
                            className="flex-row items-center rounded-2xl bg-white p-4"
                            onPress={() => router.push("/chatbot")}
                        >
                            <ListChecks size={28} color="#B87C4C" />
                            <Text className="ml-4 text-lg font-semibold text-[#B87C4C]">
                                Skinbot
                            </Text>
                        </Pressable>
                    </View>

                    <View className="mb-4">
                        <Pressable
                            className="flex-row items-center rounded-2xl bg-[#B87C4C] p-4 justify-start"
                            onPress={handleLogout}
                        >
                            <LogOut size={28} color="#fff" />
                            <Text className="ml-4 text-lg font-semibold text-white">
                                Logout
                            </Text>
                        </Pressable>
                    </View>
                    <View className="mb-4">
                        <Pressable
                            className="flex-row items-center rounded-2xl bg-[#B87C4C] p-4 justify-start"
                            onPress={handleTest}
                        >
                            <LogOut size={28} color="#fff" />
                            <Text className="ml-4 text-lg font-semibold text-white">
                                Test
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}
