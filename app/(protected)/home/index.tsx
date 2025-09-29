import { useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Search from "./tabs/search";
import Routine from "./tabs/routine";
import Scan from "./tabs/scan";
import {
    QrCode,
    SearchIcon,
    FlaskConical,
    UsersRound,
    Sparkles,
} from "lucide-react-native";
import Navbar from "./tabs/components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native";
import { Dropdown } from "../../../components/Dropdown";
import Settings from "./settings-dropdown";
import { useRouter } from "expo-router";

export enum Tabs {
    Scan = "scan",
    Search = "search",
    Routine = "routine",
}

export const NavItems: {
    [key in Tabs]: {
        label: string;
        icon: any;
        tab: React.ReactNode;
    };
} = {
    [Tabs.Scan]: {
        label: "Scan",

        icon: QrCode,
        tab: <Scan />,
    },
    [Tabs.Search]: {
        label: "Search",

        icon: SearchIcon,
        tab: <Search />,
    },
    [Tabs.Routine]: {
        label: "Routine",

        icon: FlaskConical,
        tab: <Routine />,
    },
};

export default function Page() {
    const [permission, requestPermission] = useCameraPermissions();
    const [settingOpen, setSettingOpen] = useState(false);
    const [tabs, setTabs] = useState<Tabs>(Tabs.Scan);
    const router = useRouter();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        requestPermission();
        return (
            <View>
                <Text>Not Permitted</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F7F4EA] relative">
            <Dropdown
                trigger={<></>}
                open={settingOpen}
                setOpen={setSettingOpen}
            >
                <Settings />
            </Dropdown>
            <View
                style={{
                    zIndex: 10,
                    boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                }}
                className="flex flex-row gap-4 absolute bg-[#F7F4EA] rounded-full p-4 self-center top-16 shadow z-10"
            >
                <TouchableOpacity onPress={() => setSettingOpen(!settingOpen)}>
                    <UsersRound size={24} color="#B87C4C" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/chatbot")}>
                    <Sparkles size={24} color="#B87C4C" />
                </TouchableOpacity>
            </View>

            {NavItems[tabs].tab}
            <Navbar tabs={tabs} setTabs={setTabs} navItems={NavItems} />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
    },
    message: {
        textAlign: "center",
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 64,
        flexDirection: "row",
        backgroundColor: "transparent",
        width: "100%",
        paddingHorizontal: 64,
    },
    button: {
        flex: 1,
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    cameraStyle: {
        flex: 1,
        zIndex: 5,
    },
});
