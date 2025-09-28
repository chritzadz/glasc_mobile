import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { UsersRound, Camera } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ProcessPhoto } from "./components/process-photo";
import { Dropdown } from "../../../../components/Dropdown";
import { Settings } from "../settings-dropdown";

export function Scan() {
    const [facing, setFacing] = useState<CameraType>("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [showCamera, setShowCamera] = useState(true);
    const cameraRef = useRef<CameraView>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [settingOpen, setSettingOpen] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setShowCamera(true);

            return () => {
                setShowCamera(false);
            };
        }, [])
    );

    const handleTakePhoto = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: true,
                });

                await AsyncStorage.setItem("skinPhoto", photo.uri);
                setCapturedPhoto(photo.uri);
            } catch (error) {
                Alert.alert("Error", "Failed to capture photo");
            }
        }
    };

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
        <>
            {capturedPhoto ? (
                <ProcessPhoto
                    uri={capturedPhoto}
                    onBack={() => setCapturedPhoto(null)}
                />
            ) : (
                <View className="bg-[#F7F4EA] w-full justify-center flex-1 relative">
                    <View
                        className="shadow rounded-3xl overflow-hidden flex-1 border-[#B87C4C] border-2 mx-1"
                        style={{
                            boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        {showCamera && (
                            <CameraView
                                ref={cameraRef}
                                style={styles.cameraStyle}
                                facing={facing}
                            />
                        )}
                    </View>
                </View>
            )}

            {!capturedPhoto && (
                <TouchableOpacity
                    onPress={handleTakePhoto}
                    className="absolute z-[0] w-24 flex justify-center items-center self-center bottom-28 bg-[#F7F4EA] rounded-full p-3 "
                    style={{ boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)" }}
                >
                    <Camera size={32} color="#B87C4C" />
                </TouchableOpacity>
            )}
        </>
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
