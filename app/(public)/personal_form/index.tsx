import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    Text,
    View,
    Pressable,
    TextInput,
    Alert,
    Button,
    Platform,
    ActivityIndicator,
} from "react-native";
import { Input, CheckBox } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ScrollView } from "react-native";

import { User } from "../../../model/User";
import CurrentUser from "../../../model/CurrentUser";
import { SafeAreaView } from "react-native-safe-area-context";

type SkinConcerns = {
    acne: boolean;
    wrinkles: boolean;
    sensitivity: boolean;
    dryness: boolean;
    dark_spots: boolean;
};

type SkinGoals = {
    clear_skin: boolean;
    even_skin_tone: boolean;
    hydration: boolean;
    anti_aging: boolean;
    firmness: boolean;
    radiance: boolean;
    minimized_pores: boolean;
    sun_protection: boolean;
    soothing_sensitivity: boolean;
};

const Home = () => {
    const router = useRouter();
    // Initialize birth date to 25 years ago as a reasonable default
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 25);
    const [birthDate, setBirthDate] = useState(defaultDate);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [gender, setGender] = useState("");
    const [skinType, setSkinType] = useState(null);
    const [skinConcerns, setSkinConcerns] = useState<SkinConcerns>({
        acne: false,
        wrinkles: false,
        sensitivity: false,
        dryness: false,
        dark_spots: false,
    });
    const [allergies, setAllergies] = useState("");
    const [exerciseFreq, setExerciseFreq] = useState("");
    const [sleepDuration, setSleepDuration] = useState("");
    const [climate, setClimate] = useState("");
    const [sunExposure, setSunExposure] = useState("");
    const [skinGoals, setSkinGoals] = useState<SkinGoals>({
        clear_skin: false,
        even_skin_tone: false,
        hydration: false,
        anti_aging: false,
        firmness: false,
        radiance: false,
        minimized_pores: false,
        sun_protection: false,
        soothing_sensitivity: false,
    });
    const [loading, setLoading] = useState(false);

    const showDatepicker = () => {
        setShow(true);
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShow(false); // Hide the picker

        // Check if the event is a change event and we have a selected date
        if (event.type === "set" && selectedDate) {
            setBirthDate(selectedDate);
            console.log("Birth date updated:", selectedDate);
        }
    };

    const handleSkinConcernChange = (concern: keyof typeof skinConcerns) => {
        setSkinConcerns((prev: typeof skinConcerns) => ({
            ...prev,
            [concern]: !prev[concern],
        }));
    };

    const handleSkinGoalsChange = (goal: keyof typeof skinGoals) => {
        setSkinGoals((prev: typeof skinGoals) => ({
            ...prev,
            [goal]: !prev[goal],
        }));
    };

    const handleSubmitButton = async () => {
        if (!areFieldsFilled()) return;

        setLoading(true);

        const success = await savePersonalInfo();
        if (success) {
            Alert.alert("Your skin information is successfully saved.");
            router.push("/home");
            setLoading(false);
        } else {
            Alert.alert("Error occurred.");
            setLoading(false);
        }
    };

    const areFieldsFilled = (): boolean => {
        // Check if birth date is set and user has actually selected a date
        // (not just using the default 25-years-ago date)
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() - 25);
        const isDefaultDate =
            birthDate.toDateString() === defaultDate.toDateString();

        if (!birthDate) {
            Alert.alert(
                "Missing Information",
                "Please select your birth date."
            );
            return false;
        }
        if (!gender || gender === "") {
            Alert.alert("Missing Information", "Please select your gender.");
            return false;
        }
        if (!skinType || skinType === "") {
            Alert.alert("Missing Information", "Please select your skin type.");
            return false;
        }
        return true;
    };

    const savePersonalInfo = async () => {
        console.log("currUser id: " + CurrentUser.getInstance().getId());
        const response = await fetch("/api/personalDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id: CurrentUser.getInstance().getId(),
                birth_date: birthDate.toISOString().split("T")[0],
                gender: gender,
                skin_type: skinType,
                skin_concerns: skinConcerns,
                allergies: allergies,
                exercise_frequency: exerciseFreq,
                sleep_duration: sleepDuration,
                climate: climate,
                sun_exposure: sunExposure,
                skin_goals: skinGoals,
            }),
        });
        const data = await response.json();

        console.log(data);
        console.log(response.status);

        if (response.ok) {
            return true;
        } else {
            return false;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-secondary">
            <TouchableWithoutFeedback
                onPress={() => {
                    setShow(false);
                    Keyboard.dismiss();
                }}
            >
                <ScrollView
                    className="flex-1 px-6 pt-8"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-3xl font-bold text-primary mb-2">
                            Tell us about your skin
                        </Text>
                        <Text className="text-lg text-primary/70">
                            Help us create your personalized skincare routine
                        </Text>
                    </View>
                    {/* Form Container */}
                    <View
                        className="bg-primary rounded-3xl p-6 mb-6"
                        style={{
                            boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        {/* Birth Date */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Birth Date *
                            </Text>
                            <View
                                className="bg-secondary rounded-2xl p-3"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <DateTimePicker
                                    value={birthDate}
                                    mode="date"
                                    display="spinner"
                                    onChange={onChange}
                                    textColor="#B87C4C"
                                />
                            </View>
                        </View>

                        {/* Gender */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Gender *
                            </Text>
                            <View
                                className="bg-secondary rounded-2xl"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Picker
                                    selectedValue={gender}
                                    onValueChange={(itemValue) =>
                                        setGender(itemValue)
                                    }
                                    style={{ color: "#B87C4C" }}
                                >
                                    <Picker.Item
                                        label="Select Gender"
                                        value=""
                                        color="#B87C4C80"
                                    />
                                    <Picker.Item
                                        label="Male"
                                        value="male"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Female"
                                        value="female"
                                        color="#B87C4C"
                                    />
                                </Picker>
                            </View>
                        </View>

                        {/* Skin Type */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Skin Type *
                            </Text>
                            <View
                                className="bg-secondary rounded-2xl"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Picker
                                    selectedValue={skinType}
                                    onValueChange={(itemValue) =>
                                        setSkinType(itemValue)
                                    }
                                    style={{ color: "#B87C4C" }}
                                >
                                    <Picker.Item
                                        label="Select Skin Type"
                                        value=""
                                        color="#B87C4C80"
                                    />
                                    <Picker.Item
                                        label="Oily"
                                        value="oily"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Dry"
                                        value="dry"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Combination"
                                        value="combination"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Sensitive"
                                        value="sensitive"
                                        color="#B87C4C"
                                    />
                                </Picker>
                            </View>
                        </View>

                        {/* Skin Concerns */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Skin Concerns
                            </Text>
                            <View
                                className="bg-secondary rounded-2xl p-4"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <CheckBox
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    checkedColor="#B87C4C"
                                    title="Acne"
                                    checked={skinConcerns.acne}
                                    onPress={() =>
                                        handleSkinConcernChange("acne")
                                    }
                                />
                                <CheckBox
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Wrinkles"
                                    checkedColor="#B87C4C"
                                    checked={skinConcerns.wrinkles}
                                    onPress={() =>
                                        handleSkinConcernChange("wrinkles")
                                    }
                                />
                                <CheckBox
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Sensitivity"
                                    checkedColor="#B87C4C"
                                    checked={skinConcerns.sensitivity}
                                    onPress={() =>
                                        handleSkinConcernChange("sensitivity")
                                    }
                                />
                                <CheckBox
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Dryness"
                                    checkedColor="#B87C4C"
                                    checked={skinConcerns.dryness}
                                    onPress={() =>
                                        handleSkinConcernChange("dryness")
                                    }
                                />
                                <CheckBox
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Dark spots"
                                    checkedColor="#B87C4C"
                                    checked={skinConcerns.dark_spots}
                                    onPress={() =>
                                        handleSkinConcernChange("dark_spots")
                                    }
                                />
                            </View>
                        </View>
                    </View>

                    {/* Lifestyle & Health Container */}
                    <View
                        className="bg-primary rounded-3xl p-6 mb-6"
                        style={{
                            boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        {/* Allergies */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Allergies
                            </Text>
                            <TextInput
                                className="w-full h-12 px-4 text-lg rounded-2xl bg-secondary text-primary"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                                placeholder="e.g. alcohol, lanolin"
                                placeholderTextColor={"#B87C4C80"}
                                value={allergies}
                                onChangeText={setAllergies}
                            />
                        </View>

                        {/* Exercise Frequency */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Exercise Frequency
                            </Text>
                            <View
                                className="bg-secondary rounded-2xl"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Picker
                                    selectedValue={exerciseFreq}
                                    onValueChange={(itemValue) =>
                                        setExerciseFreq(itemValue)
                                    }
                                    style={{ color: "#B87C4C" }}
                                >
                                    <Picker.Item
                                        label="Select Exercise Frequency"
                                        value=""
                                        color="#B87C4C80"
                                    />
                                    <Picker.Item
                                        label="Daily"
                                        value="daily"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Several times a week"
                                        value="several"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Weekly"
                                        value="weekly"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Monthly"
                                        value="monthly"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Rarely"
                                        value="rarely"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Never"
                                        value="never"
                                        color="#B87C4C"
                                    />
                                </Picker>
                            </View>
                        </View>

                        {/* Sleep Duration */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Average Sleep Duration
                            </Text>
                            <View
                                className="bg-secondary rounded-2xl"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Picker
                                    selectedValue={sleepDuration}
                                    onValueChange={(itemValue) =>
                                        setSleepDuration(itemValue)
                                    }
                                    style={{ color: "#B87C4C" }}
                                >
                                    <Picker.Item
                                        label="Select Sleep Duration"
                                        value=""
                                        color="#B87C4C80"
                                    />
                                    <Picker.Item
                                        label="Less than 4 hours"
                                        value="less_than_4"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="4-5 hours"
                                        value="4_to_5"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="6-7 hours"
                                        value="6_to_7"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="7-8 hours"
                                        value="7_to_8"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="8-9 hours"
                                        value="8_to_9"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="More than 9 hours"
                                        value="more_than_9"
                                        color="#B87C4C"
                                    />
                                </Picker>
                            </View>
                        </View>

                        {/* Climate */}
                        <View className="mb-6">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Climate
                            </Text>
                            <View
                                className="bg-secondary rounded-2xl"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Picker
                                    selectedValue={climate}
                                    onValueChange={(itemValue) =>
                                        setClimate(itemValue)
                                    }
                                    style={{ color: "#B87C4C" }}
                                >
                                    <Picker.Item
                                        label="Select Climate"
                                        value=""
                                        color="#B87C4C80"
                                    />
                                    <Picker.Item
                                        label="Tropical"
                                        value="tropical"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Temperate"
                                        value="temperate"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Continental"
                                        value="continental"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Polar"
                                        value="polar"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Subtropical"
                                        value="subtropical"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Oceanic"
                                        value="oceanic"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Mediterranean"
                                        value="mediterranean"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Highland"
                                        value="highland"
                                        color="#B87C4C"
                                    />
                                </Picker>
                            </View>
                        </View>

                        {/* Sun Exposure */}
                        <View className="mb-0">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Direct Sunlight Exposure
                            </Text>
                            <View
                                className="bg-secondary rounded-2xl"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Picker
                                    selectedValue={sunExposure}
                                    onValueChange={(itemValue) =>
                                        setSunExposure(itemValue)
                                    }
                                    style={{ color: "#B87C4C" }}
                                >
                                    <Picker.Item
                                        label="Select Sun Exposure"
                                        value=""
                                        color="#B87C4C80"
                                    />
                                    <Picker.Item
                                        label="Daily"
                                        value="daily"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Several times a week"
                                        value="several"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Occasionally"
                                        value="occasionally"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Rarely"
                                        value="rarely"
                                        color="#B87C4C"
                                    />
                                    <Picker.Item
                                        label="Never"
                                        value="never"
                                        color="#B87C4C"
                                    />
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* Skin Goals Container */}
                    <View
                        className="bg-primary rounded-3xl p-6 mb-6"
                        style={{
                            boxShadow: "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <View className="mb-0">
                            <Text className="text-lg font-semibold text-secondary mb-3">
                                Skin Goals
                            </Text>
                            <View
                                className="bg-secondary rounded-2xl p-4"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <CheckBox
                                    checkedColor="#B87C4C"
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Clear skin"
                                    checked={skinGoals.clear_skin}
                                    onPress={() =>
                                        handleSkinGoalsChange("clear_skin")
                                    }
                                />
                                <CheckBox
                                    checkedColor="#B87C4C"
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Even skin tone"
                                    checked={skinGoals.even_skin_tone}
                                    onPress={() =>
                                        handleSkinGoalsChange("even_skin_tone")
                                    }
                                />
                                <CheckBox
                                    checkedColor="#B87C4C"
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Hydration"
                                    checked={skinGoals.hydration}
                                    onPress={() =>
                                        handleSkinGoalsChange("hydration")
                                    }
                                />
                                <CheckBox
                                    checkedColor="#B87C4C"
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Anti-aging"
                                    checked={skinGoals.anti_aging}
                                    onPress={() =>
                                        handleSkinGoalsChange("anti_aging")
                                    }
                                />
                                <CheckBox
                                    checkedColor="#B87C4C"
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Firmness"
                                    checked={skinGoals.firmness}
                                    onPress={() =>
                                        handleSkinGoalsChange("firmness")
                                    }
                                />
                                <CheckBox
                                    checkedColor="#B87C4C"
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Radiance"
                                    checked={skinGoals.radiance}
                                    onPress={() =>
                                        handleSkinGoalsChange("radiance")
                                    }
                                />
                                <CheckBox
                                    checkedColor="#B87C4C"
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Minimized pores"
                                    checked={skinGoals.minimized_pores}
                                    onPress={() =>
                                        handleSkinGoalsChange("minimized_pores")
                                    }
                                />
                                <CheckBox
                                    checkedColor="#B87C4C"
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Sun protection"
                                    checked={skinGoals.sun_protection}
                                    onPress={() =>
                                        handleSkinGoalsChange("sun_protection")
                                    }
                                />
                                <CheckBox
                                    checkedColor="#B87C4C"
                                    containerStyle={{
                                        backgroundColor: "transparent",
                                        borderWidth: 0,
                                        marginVertical: 2,
                                        paddingHorizontal: 0,
                                    }}
                                    textStyle={{
                                        color: "#B87C4C",
                                        fontSize: 16,
                                    }}
                                    title="Soothing sensitivity"
                                    checked={skinGoals.soothing_sensitivity}
                                    onPress={() =>
                                        handleSkinGoalsChange(
                                            "soothing_sensitivity"
                                        )
                                    }
                                />
                            </View>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <View className="mb-8">
                        {loading ? (
                            <View className="py-4 items-center">
                                <ActivityIndicator
                                    size="large"
                                    color="#B87C4C"
                                />
                            </View>
                        ) : (
                            <Pressable
                                onPress={handleSubmitButton}
                                className="py-4 rounded-2xl items-center bg-primary"
                                style={{
                                    boxShadow:
                                        "inset 0 0 10px 0 rgba(0, 0, 0, 0.3)",
                                }}
                                disabled={loading}
                            >
                                <Text className="font-bold text-lg text-secondary">
                                    Complete Profile
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

// Styles now handled by Tailwind CSS classes
export default Home;
