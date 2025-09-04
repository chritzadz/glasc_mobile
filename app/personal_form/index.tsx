import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { TouchableWithoutFeedback, Keyboard, StyleSheet, Text, View, Pressable, TextInput, Alert, Button, Platform } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native';

import { User } from '../../model/User';
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

const Home = () => {
    const router = useRouter();
    const [userId, setUserId] = useState<number | undefined>(undefined);;
    const [birthDate, setBirthDate] = useState(new Date());
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
    const [skinGoals, setSkinGoals]  = useState<SkinGoals>({
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

    const showDatepicker = () => {
        setShow(true);
    };
    
    const getUserId = () => {
        setUserId(CurrentUser.getInstance().getId());
        console.log(`Current user id: ${userId}`);
    };

    useEffect(() => {
        getUserId();
    }, []);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // Check if the event is a change event
        if (event.type === 'set') {
            const currentDate = selectedDate || date; // Default to current date if undefined
            showDatepicker();
            setBirthDate(currentDate);
        } else {
            setShow(false); // If the picker is canceled
        }
    };

    const handleSkinConcernChange = (concern: keyof typeof skinConcerns) => {
        setSkinConcerns((prev: typeof skinConcerns)  => ({
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
        if (!areFieldsFilled) return;

        const success = await savePersonalInfo();
        if (success){
            Alert.alert("Your skin information is successfully saved.")
            router.push('scan');
        }
        else {
            Alert.alert("Error occured.")
        }
    };

    const areFieldsFilled = (): boolean => {
        if (birthDate && gender && skinType){
            return true;
        }
        return false;
    }

    const savePersonalInfo = async () => {
        const response = await fetch('/api/personalDetails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                birth_date: birthDate.toISOString().split('T')[0],
                gender: gender,
                skin_type: skinType,
                ... skinConcerns,
                allergies: allergies,
                exercise_frequency: exerciseFreq,
                sleep_duration: sleepDuration,
                climate: climate,
                sun_exposure: sunExposure,
                ... skinGoals,
            })
        });
        const data = await response.json();
        
        console.log(data);
        console.log(response.status);

        if (response.ok) {
            return true;
        }
        else {
            return false;
        }
    };

    return (
    <TouchableWithoutFeedback
        onPress={() => {
            setShow(false);   
            Keyboard.dismiss(); 
        }}
    >
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Skin Information</Text>
        <Text style={styles.formTitle}>Help us better understand your skin</Text>
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>*Birth Date</Text>
            <Button onPress={showDatepicker} title="Select Date" />
                {show && (
                <DateTimePicker
                    value={birthDate}
                    mode="date"  
                    display="spinner"
                    onChange={onChange}
                />
                )}
            <Text>Selected Date: {birthDate.toLocaleDateString()}</Text>
            <Text style={styles.inputTitle}>*Gender</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)}>
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="male" />
                    <Picker.Item label="Female" value="female" />
                </Picker>
            </View>
            <Text style={styles.inputTitle}>*Skin Type</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={skinType} onValueChange={(itemValue) => setSkinType(itemValue)}>
                    <Picker.Item label="Select Skin Type" value="" />
                    <Picker.Item label="Oily" value="oily" />
                    <Picker.Item label="Dry" value="dry" />
                    <Picker.Item label="Combination" value="combination" />
                    <Picker.Item label="Sensitive" value="sensitive" />
                </Picker>
            </View>
            <Text style={styles.inputTitle}>Specific Skin Concerns</Text>
            <CheckBox title="Acne" checked={skinConcerns.acne} onPress={() => handleSkinConcernChange('acne')} />
            <CheckBox title="Wrinkles" checked={skinConcerns.wrinkles} onPress={() => handleSkinConcernChange('wrinkles')} />
            <CheckBox title="Sensitivity" checked={skinConcerns.sensitivity} onPress={() => handleSkinConcernChange('sensitivity')} />
            <CheckBox title="Dryness" checked={skinConcerns.dryness} onPress={() => handleSkinConcernChange('dryness')} />
            <CheckBox title="Dark spots" checked={skinConcerns.dark_spots} onPress={() => handleSkinConcernChange('dark_spots')} />
            <Text style={styles.inputTitle}>Allergies</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g alcohol, lanolin"
                placeholderTextColor={'#6A7E97'}
                value={allergies}
                onChangeText={setAllergies}
            />
            <Text style={styles.inputTitle}>Exercise Frequency</Text>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={exerciseFreq} onValueChange={(itemValue) => setExerciseFreq(itemValue)}>
                    <Picker.Item label="Select Execise Frequency" value="" />
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Several times a week" value="several" />
                    <Picker.Item label="Weekly" value="weekly" />
                    <Picker.Item label="Monthly" value="monthly" />
                    <Picker.Item label="Rarely" value="rarely" />
                    <Picker.Item label="Never" value="never" />
                </Picker>
            </View>
            <Text style={styles.inputTitle}>Average Sleep Duration</Text>
            <View style={styles.pickerContainer}>
                <Picker 
                    selectedValue={sleepDuration} 
                    onValueChange={(itemValue) => setSleepDuration(itemValue)}>
                    <Picker.Item label="Select Sleep Duration" value="" />
                    <Picker.Item label="Less than 4 hours" value="less_than_4" />
                    <Picker.Item label="4-5 hours" value="4_to_5" />
                    <Picker.Item label="6-7 hours" value="6_to_7" />
                    <Picker.Item label="7-8 hours" value="7_to_8" />
                    <Picker.Item label="8-9 hours" value="8_to_9" />
                    <Picker.Item label="More than 9 hours" value="more_than_9" />
                </Picker>
            </View>
            <Text style={styles.inputTitle}>Climate</Text>
            <View style={styles.pickerContainer}>
                <Picker 
                    selectedValue={climate} 
                    onValueChange={(itemValue) => setClimate(itemValue)}>
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
            <Text style={styles.inputTitle}>How often do you spend time in direct sunlight?</Text>
            <View style={styles.pickerContainer}>
                <Picker 
                    selectedValue={sunExposure} 
                    onValueChange={(itemValue) => setSunExposure(itemValue)}>
                    <Picker.Item label="Select Sun Exposure" value="" />
                    <Picker.Item label="Daily" value="daily" />
                    <Picker.Item label="Several times a week" value="several" />
                    <Picker.Item label="Occasionally" value="occasionally" />
                    <Picker.Item label="Rarely" value="rarely" />
                    <Picker.Item label="Never" value="never" />
                </Picker>
            </View>
            <Text style={styles.inputTitle}>Skin Goals</Text>
            <CheckBox title="Clear skin" checked={skinGoals.clear_skin} onPress={() => handleSkinGoalsChange('clear_skin')} />
            <CheckBox title="Even skin tone" checked={skinGoals.even_skin_tone} onPress={() => handleSkinGoalsChange('even_skin_tone')} />
            <CheckBox title="Hydration" checked={skinGoals.hydration} onPress={() => handleSkinGoalsChange('hydration')} />
            <CheckBox title="Anti-aging" checked={skinGoals.anti_aging} onPress={() => handleSkinGoalsChange('anti_aging')} />
            <CheckBox title="Firmness" checked={skinGoals.firmness} onPress={() => handleSkinGoalsChange('firmness')} />
            <CheckBox title="Radiance" checked={skinGoals.radiance} onPress={() => handleSkinGoalsChange('radiance')} />
            <CheckBox title="Minimized pores" checked={skinGoals.minimized_pores} onPress={() => handleSkinGoalsChange('minimized_pores')} />
            <CheckBox title="Sun protection" checked={skinGoals.sun_protection} onPress={() => handleSkinGoalsChange('sun_protection')} />
            <CheckBox title="Soothing sensitivity" checked={skinGoals.soothing_sensitivity} onPress={() => handleSkinGoalsChange('soothing_sensitivity')} />
        </View>
        <Pressable
                onPress = {handleSubmitButton}
                style={styles.submitButton}>
                <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
    </ScrollView>
    </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        backgroundColor: 'white',
        padding: '7%'
    },
    greeting: {
        marginTop: 60,
        fontSize: 35,
        //textAlign: 'center',
        fontWeight: 'bold',
        color:  '#bf7641',
    },
    formTitle: {
        marginTop: 10,
        fontSize: 20,
        textAlign: 'center',
        color:  '#bf7641',
    },
    inputContainer: {
        width: '100%',
        marginTop: 40,
        marginBottom: 40,
        
    }, 
    inputTitle: {
        color:  '#bf7641',
        fontWeight: 'bold'
    },
    input: {
        justifyContent: 'center',
        width: '100%',
        height: 50,
        padding: '3%',
        margin: 5,
        fontSize: 17,
        borderWidth: 1,           
        borderColor: '#bf7641',     
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: 'white',
    },
    
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
    pickerContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#bf7641',
        borderRadius: 8,
        marginVertical: 10,
        backgroundColor: 'white',
        paddingHorizontal: 8,
        zIndex: 100,    
        elevation: 5,   
      },
      
})
export default Home;