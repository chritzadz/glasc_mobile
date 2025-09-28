import {
    QrCode,
    Search as SearchIcon,
    FlaskConical,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { BlurView } from "expo-blur";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";
import { type Dispatch, type SetStateAction } from "react";
import { Tabs, NavItems } from "../..";

export const Navbar = ({
    tabs,
    setTabs,
    navItems,
}: {
    tabs: Tabs;
    setTabs: Dispatch<SetStateAction<Tabs>>;
    navItems: typeof NavItems;
}) => {
    const slidePosition = useSharedValue(0);
    const getActiveTabIndex = () => {
        const tabKeys = Object.keys(navItems);
        const activeIndex = tabKeys.findIndex((key) => key === tabs);
        return activeIndex !== -1 ? activeIndex : 0;
    };

    useEffect(() => {
        const activeIndex = getActiveTabIndex();
        slidePosition.value = withTiming(activeIndex, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
        });
    }, [tabs]);

    const handleSwitchTab = (selectedTab: Tabs) => {
        setTabs(selectedTab);
    };

    const animatedBackgroundStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: slidePosition.value * 105 }],
        };
    });

    return (
        <View className="absolute z-10 bottom-12 left-0 right-0 flex justify-center items-center">
            <BlurView
                experimentalBlurMethod="dimezisBlurView"
                intensity={80}
                tint="light"
                style={{
                    overflow: "hidden",
                    elevation: 8,
                    boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                    opacity: 1,
                }}
                className="shadow rounded-full relative flex flex-row justify-center items-center"
            >
                <View
                    style={{ boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)" }}
                    className="flex flex-row gap-1 bg-primary/80 p-1.5 items-center"
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
                                boxShadow:
                                    "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                            },
                        ]}
                    />

                    {Object.keys(navItems).map((item, index) => {
                        const isActive = tabs === item;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleSwitchTab(item as Tabs)}
                                activeOpacity={1}
                                className="relative z-20 flex min-h-10 flex-row items-center justify-center gap-1 rounded-full py-1 px-2 w-[100px]"
                            >
                                {React.createElement(
                                    navItems[item as keyof typeof navItems]
                                        .icon,
                                    {
                                        size: 20,
                                        color: isActive ? "#B87C4C" : "#F7F4EA",
                                    }
                                )}
                                <Text
                                    style={{
                                        color: isActive ? "#B87C4C" : "#F7F4EA",
                                    }}
                                    className={`font-semibold text-md m-0 ${
                                        isActive
                                            ? "text-primary"
                                            : "text-secondary"
                                    }`}
                                >
                                    {
                                        navItems[item as keyof typeof navItems]
                                            .label
                                    }
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
};
