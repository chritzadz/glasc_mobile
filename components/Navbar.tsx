import { QrCode, Search, FlaskConical } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";

enum Tab {
    Scan = "scan",
    Search = "search",
    Routine = "routine",
}

const NavItems: {
    [key in Tab]: { label: string; route: string; icon: any };
} = {
    [Tab.Scan]: {
        label: "Scan",
        route: "/scan",
        icon: QrCode,
    },
    [Tab.Search]: {
        label: "Search",
        route: "/search",
        icon: Search,
    },
    [Tab.Routine]: {
        label: "Routine",
        route: "/skincare_routine",
        icon: FlaskConical,
    },
};

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [tab, setTab] = useState<Tab>(Tab.Scan);

    const slidePosition = useSharedValue(0);
    const tabs = Object.values(Tab);

    const getActiveTabIndex = () => {
        const currentTab = tabs.find((t) => NavItems[t].route === pathname);
        return currentTab ? tabs.indexOf(currentTab) : 0;
    };

    useEffect(() => {
        const activeIndex = getActiveTabIndex();
        slidePosition.value = withTiming(activeIndex, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
        });
    }, [pathname]);

    const handleSwitchTab = (selectedTab: Tab) => {
        setTab(selectedTab);
        router.push(NavItems[selectedTab].route);
    };

    const animatedBackgroundStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: slidePosition.value * 100 }],
        };
    });

    return (
        <View className="z-10 absolute self-center bottom-8 flex rounded-full bg-[#B87C4C]/80 backdrop-blur-xl shadow justify-center items-center p-0">
            <View
                style={{ boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)" }}
                className="relative flex flex-row items-center justify-center gap-1 p-1"
            >
                <Animated.View
                    style={[
                        animatedBackgroundStyle,
                        {
                            position: "absolute",
                            borderRadius: 20,
                            width: 100,
                            height: 40,
                            left: 4,
                            backgroundColor: "#F7F4EA",
                            overflow: "hidden",
                            boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                        },
                    ]}
                />

                {tabs.map((tabItem, index) => {
                    const isActive = pathname === NavItems[tabItem].route;
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSwitchTab(tabItem)}
                            className="flex min-h-10 flex-row items-center justify-center gap-1 rounded-full px-3 py-1 w-[100px]"
                        >
                            {React.createElement(NavItems[tabItem].icon, {
                                size: 20,
                                color: isActive ? "#B87C4C" : "#F7F4EA",
                            })}
                            <Text
                                className={`font-semibold text-md m-0 ${
                                    isActive
                                        ? "text-[#B87C4C]"
                                        : "text-[#F7F4EA]"
                                }`}
                            >
                                {NavItems[tabItem].label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
