import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, Keyboard, StyleSheet, Text, View, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native';

import CurrentUser from '../../model/CurrentUser';

type SkinConcerns = {
    acne: boolean;
    wrinkles: boolean;
    sensitivity: boolean;
    dryness: boolean;
    dark_spots: boolean;
};

type SkinGoals = {
    clear_skin: boolean,
    even_skin_tone: boolean,
    hydration: boolean,
    anti_aging: boolean,
    firmness: boolean,
    radiance: boolean,
    minimized_pores: boolean,
    sun_protection: boolean,
    soothing_sensitivity: boolean,
};

const EditPersonalForm = () => {
    const router = useRouter();
    const [birthDate, setBirthDate] = useState(new Date());
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
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        fetchPersonalDetails();
    }, []);

    const fetchPersonalDetails = async () => {
        try {
            const userId = CurrentUser.getInstance().getId();
            const response = await fetch(`/api/personalDetails?user_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response);
            const data = await response.json();
            console.log(data);
            
            if (response.ok && data.task && data.task.rows && data.task.rows[0]) {
                const personalData = data.task.rows[0];
                setBirthDate(new Date(personalData.birth_date));
                setGender(personalData.gender || "");
                setSkinType(personalData.skin_type || null);
                setSkinConcerns({
                    acne: personalData.acne,
                    wrinkles: personalData.wrinkles,
                    sensitivity: personalData.sensitivity,
                    dryness: personalData.dryness,
                    dark_spots: personalData.dark_spots,
                });
                setAllergies(personalData.allergies || "");
                setExerciseFreq(personalData.exercise_frequency || "");
                setSleepDuration(personalData.sleep_duration || "");
                setClimate(personalData.climate || "");
                setSunExposure(personalData.sun_exposure || "");
                setSkinGoals({
                    clear_skin: personalData.clear_skin ?? false,
                    even_skin_tone: personalData.even_skin_tone ?? false,
                    hydration: personalData.hydration ?? false,
                    anti_aging: personalData.anti_aging ?? false,
                    firmness: personalData.firmness ?? false,
                    radiance: personalData.radiance ?? false,
                    minimized_pores: personalData.minimized_pores ?? false,
                    sun_protection: personalData.sun_protection ?? false,
                    soothing_sensitivity: personalData.soothing_sensitivity ?? false,
                });
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to fetch personal details");
        } finally {
            setFetchLoading(false);
        }
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || birthDate;
            setBirthDate(currentDate);
        }
        setShow(false);
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
        const success = await updatePersonalInfo();
        
        if (success) {
            Alert.alert("Success", "Your skin information has been updated.");
            router.back();
        } else {
            Alert.alert("Error", "Failed to update information.");
        }
        setLoading(false);
    };

    const areFieldsFilled = (): boolean => {
        return !!(birthDate && gender && skinType);
    };

    const updatePersonalInfo = async () => {
        try {
            const response = await fetch('/api/personalDetails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: CurrentUser.getInstance().getId(),
                    birth_date: birthDate.toISOString().split('T')[0],
                    gender: gender,
                    skin_type: skinType,
                    skin_concerns: skinConcerns,
                    allergies: allergies,
                    exercise_frequency: exerciseFreq,
                    sleep_duration: sleepDuration,
                    climate: climate,
                    sun_exposure: sunExposure,
                    skin_goals: skinGoals,
                })
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    if (fetchLoading) {
        return (
            <View className="bg-[#F7F4EA] flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#B87C4C" />
                <Text className="text-[#B87C4C] mt-4">Loading your information...</Text>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={() => { setShow(false); Keyboard.dismiss(); }}>
            <ScrollView className="bg-[#F7F4EA] w-full flex flex-col pt-20 px-5">
                <Text className="text-5xl font-bold text-[#B87C4C]">Update your skin information</Text>
                
                <View className="flex flex-col gap-8 my-10">
                    <View>
                        <Text className="text-xl text-[#B87C4C]">*Birth Date</Text>
                        <DateTimePicker
                            value={birthDate}
                            mode="date"
                            display="spinner"
                            onChange={onChange}
                        />
                    </View>
                    
                    <View>
                        <Text className="text-xl text-[#B87C4C]">*Gender</Text>
                        <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)}>
                            <Picker.Item label="Select Gender" value="" />
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View>
                    
                    <View>
                        <Text className="text-xl text-[#B87C4C]">*Skin Type</Text>
                        <Picker selectedValue={skinType} onValueChange={(itemValue) => setSkinType(itemValue)}>
                            <Picker.Item label="Select Skin Type" value="" />
                            <Picker.Item label="Oily" value="oily" />
                            <Picker.Item label="Dry" value="dry" />
                            <Picker.Item label="Combination" value="combination" />
                            <Picker.Item label="Sensitive" value="sensitive" />
                        </Picker>
                    </View>
                    
                    <View>
                        <Text className="text-xl text-[#B87C4C]">Specific Skin Concerns</Text>
                        <CheckBox containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} checkedColor="#B87C4C" title="Acne" checked={skinConcerns.acne} onPress={() => handleSkinConcernChange('acne')} />
                        <CheckBox containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Wrinkles" checkedColor="#B87C4C" checked={skinConcerns.wrinkles} onPress={() => handleSkinConcernChange('wrinkles')} />
                        <CheckBox containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Sensitivity" checkedColor="#B87C4C" checked={skinConcerns.sensitivity} onPress={() => handleSkinConcernChange('sensitivity')} />
                        <CheckBox containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Dryness" checkedColor="#B87C4C" checked={skinConcerns.dryness} onPress={() => handleSkinConcernChange('dryness')} />
                        <CheckBox containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Dark spots" checkedColor="#B87C4C" checked={skinConcerns.dark_spots} onPress={() => handleSkinConcernChange('dark_spots')} />
                    </View>
                    
                    <View className='flex flex-col gap-3'>
                        <Text className="text-xl text-[#B87C4C]">Allergies</Text>
                        <TextInput
                            className="w-full border-b-2 border-[#B87C4C] text-lg pb-2 px-1"
                            placeholder="e.g alcohol, lanolin"
                            placeholderTextColor={'#6A7E97'}
                            value={allergies}
                            onChangeText={setAllergies}
                        />
                    </View>
                    
                    <View>
                        <Text className="text-xl text-[#B87C4C]">Exercise Frequency</Text>
                        <Picker selectedValue={exerciseFreq} onValueChange={(itemValue) => setExerciseFreq(itemValue)}>
                            <Picker.Item label="Select Exercise Frequency" value="" />
                            <Picker.Item label="Daily" value="daily" />
                            <Picker.Item label="Several times a week" value="several" />
                            <Picker.Item label="Weekly" value="weekly" />
                            <Picker.Item label="Monthly" value="monthly" />
                            <Picker.Item label="Rarely" value="rarely" />
                            <Picker.Item label="Never" value="never" />
                        </Picker>
                    </View>
                    
                    <View>
                        <Text className="text-xl text-[#B87C4C]">Average Sleep Duration</Text>
                        <Picker selectedValue={sleepDuration} onValueChange={(itemValue) => setSleepDuration(itemValue)}>
                            <Picker.Item label="Select Sleep Duration" value="" />
                            <Picker.Item label="Less than 4 hours" value="less_than_4" />
                            <Picker.Item label="4-5 hours" value="4_to_5" />
                            <Picker.Item label="6-7 hours" value="6_to_7" />
                            <Picker.Item label="7-8 hours" value="7_to_8" />
                            <Picker.Item label="8-9 hours" value="8_to_9" />
                            <Picker.Item label="More than 9 hours" value="more_than_9" />
                        </Picker>
                    </View>
                    
                    <View>
                        <Text className="text-xl text-[#B87C4C]">Climate</Text>
                        <Picker selectedValue={climate} onValueChange={(itemValue) => setClimate(itemValue)}>
                            <Picker.Item label="Select Climate" value="" />
                            <Picker.Item label="Tropical" value="tropical" />
                            <Picker.Item label="Temperate" value="temperate" />
                            <Picker.Item label="Continental" value="continental" />
                            <Picker.Item label="Polar" value="polar" />
                            <Picker.Item label="Subtropical" value="subtropical" />
                            <Picker.Item label="Oceanic" value="oceanic" />
                            <Picker.Item label="Mediterranean" value="mediterranean" />
                            <Picker.Item label="Highland" value="highland" />
                        </Picker>
                    </View>
                    
                    <View>
                        <Text className="text-xl text-[#B87C4C]">Direct sunlight exposure</Text>
                        <Picker selectedValue={sunExposure} onValueChange={(itemValue) => setSunExposure(itemValue)}>
                            <Picker.Item label="Select Sun Exposure" value="" />
                            <Picker.Item label="Daily" value="daily" />
                            <Picker.Item label="Several times a week" value="several" />
                            <Picker.Item label="Occasionally" value="occasionally" />
                            <Picker.Item label="Rarely" value="rarely" />
                            <Picker.Item label="Never" value="never" />
                        </Picker>
                    </View>
                    
                    <View>
                        <Text className="text-xl text-[#B87C4C]">Skin Goals</Text>
                        <CheckBox checkedColor="#B87C4C" containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Clear skin" checked={skinGoals.clear_skin} onPress={() => handleSkinGoalsChange('clear_skin')} />
                        <CheckBox checkedColor="#B87C4C" containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Even skin tone" checked={skinGoals.even_skin_tone} onPress={() => handleSkinGoalsChange('even_skin_tone')} />
                        <CheckBox checkedColor="#B87C4C" containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Hydration" checked={skinGoals.hydration} onPress={() => handleSkinGoalsChange('hydration')} />
                        <CheckBox checkedColor="#B87C4C" containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Anti-aging" checked={skinGoals.anti_aging} onPress={() => handleSkinGoalsChange('anti_aging')} />
                        <CheckBox checkedColor="#B87C4C" containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Firmness" checked={skinGoals.firmness} onPress={() => handleSkinGoalsChange('firmness')} />
                        <CheckBox checkedColor="#B87C4C" containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Radiance" checked={skinGoals.radiance} onPress={() => handleSkinGoalsChange('radiance')} />
                        <CheckBox checkedColor="#B87C4C" containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Minimized pores" checked={skinGoals.minimized_pores} onPress={() => handleSkinGoalsChange('minimized_pores')} />
                        <CheckBox checkedColor="#B87C4C" containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Sun protection" checked={skinGoals.sun_protection} onPress={() => handleSkinGoalsChange('sun_protection')} />
                        <CheckBox checkedColor="#B87C4C" containerStyle={{backgroundColor: '#F7F4EA', borderWidth: 0, marginVertical: 0}} title="Soothing sensitivity" checked={skinGoals.soothing_sensitivity} onPress={() => handleSkinGoalsChange('soothing_sensitivity')} />
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#B87C4C" />
                ) : (
                    <Pressable
                        onPress={handleSubmitButton}
                        style={styles.submitButton}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Update</Text>
                    </Pressable>
                )}
            </ScrollView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    submitButton: {
        width: '100%',
        height: 55,
        borderRadius: 20,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#bf7641',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
    },
});

export default EditPersonalForm;