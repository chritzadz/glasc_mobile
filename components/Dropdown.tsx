import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { type Dispatch, type SetStateAction } from "react";
import { ChevronUp } from "lucide-react-native";
import { BlurView } from "expo-blur";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS,
} from "react-native-reanimated";

type DropdownProps = {
    heading?: string | React.ReactNode;
    children: React.ReactNode;
    trigger: React.ReactNode;
    open?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
};

export const Dropdown = ({
    heading,
    children,
    trigger,
    open,
    setOpen,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(-600);

    const currentOpenState = open !== undefined ? open : isOpen;

    useEffect(() => {
        if (currentOpenState) {
            setIsVisible(true);
            opacity.value = withTiming(1, {
                duration: 400,
                easing: Easing.inOut(Easing.ease),
            });
            translateY.value = withTiming(0, {
                duration: 400,
                easing: Easing.inOut(Easing.ease),
            });
        } else {
            opacity.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.ease),
            });
            translateY.value = withTiming(
                -600,
                {
                    duration: 300,
                    easing: Easing.inOut(Easing.ease),
                },
                () => {
                    runOnJS(setIsVisible)(false);
                }
            );
        }
    }, [currentOpenState]);

    const handleOpenChange = () => {
        if (open !== undefined && setOpen) {
            setOpen(!open);
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleClose = () => {
        if (open !== undefined && setOpen) {
            setOpen(false);
        } else {
            setIsOpen(false);
        }
    };

    // Animated styles
    const backdropStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const dropdownStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <>
            <TouchableOpacity onPress={handleOpenChange}>
                {trigger}
            </TouchableOpacity>
            {isVisible && (
                <>
                    <TouchableOpacity
                        style={[
                            backdropStyle,
                            {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 9999,
                            },
                        ]}
                        onPress={handleClose}
                        activeOpacity={1}
                    >
                        <BlurView
                            intensity={80}
                            tint="dark"
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 9999,
                            }}
                        />
                        <View
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: "rgba(0,0,0,0.7)",
                            }}
                        />
                    </TouchableOpacity>

                    <Animated.View
                        className="bg-primary  border-b-4  border-secondary rounded-b-2xl"
                        style={[
                            dropdownStyle,
                            {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                minHeight: "70%",
                                zIndex: 10000,
                                boxShadow: "inset 0 2 0 rgb(153 96 50 100)",
                            },
                        ]}
                    >
                        <SafeAreaView style={{ flex: 1 }}>
                            {heading && (
                                <Text className="text-2xl font-bold text-secondary px-6 pt-4">
                                    {heading}
                                </Text>
                            )}
                            <View style={{ flex: 1 }}>{children}</View>

                            <View
                                style={{
                                    alignItems: "center",
                                    paddingBottom: 20,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={handleClose}
                                    className="bg-primary rounded-full p-2 px-4"
                                >
                                    <ChevronUp size={24} color="#F7F4EA" />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Animated.View>
                </>
            )}
        </>
    );
};
