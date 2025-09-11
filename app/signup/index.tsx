import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Pressable, Text, View, TextInput, Alert, SafeAreaView, ActivityIndicator } from 'react-native';

import validation from '../../util/validation';
import { User } from '../../model/User';
import CurrentUser from '../../model/CurrentUser';

const Signup = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userExist = (users: User[]): User | null => {
        const found = users.find((user: User) => user.email === email && user.password === password)
        return found ? found : null;
    }

    const handleSignUpButton = async () => {
        if (!areFieldsFilled()) return;
        if (!isEmailValid()) return;

        setIsSubmitting(true);

        const success = await saveCredential();
        console.log(success);
        handleSignUpResponse(success);
    };

    const areFieldsFilled = (): boolean => {
        if (!username || !email || !password){
            Alert.alert('Empty Field', 'All field must be filled');
            return false;
        }
        return true;
    };

    const isEmailValid = (): boolean => {
        if (!validation.validateEmail(email)){
            Alert.alert('Invalid Email', 'Email format is invalid');
            return false;
        }
        return true;
    };

    const handleSignUpResponse = (success: boolean): void => {
        if (success) {
            getCurrentUser();
            Alert.alert('Success', 'User successfully signed up');
            router.push('/personal_form');
        } else {
            Alert.alert('Error', 'Failed to sign up. Please try again.');
        }
    };

    const saveCredential = async () => {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username,
                email: email,
                password: password
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

    const getCurrentUser = async () => {
        const response = await fetch('/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        const users: User[] = data;

        const currUser: User | null = userExist(users);
        if (currUser != null){
            console.log(`Current user id signup is: ${currUser.id}`);
            CurrentUser.getInstance().setId(currUser.id);
        }
    }

    return (
        <SafeAreaView className="bg-[#B87C4C] flex-1 items-center justify-center">
            <View className="flex justify-center items-center">
                <Text className="text-4xl text-white">Create your account</Text>
            </View>

            <View className="w-full items-center px-7 mt-10">
                <Text className="self-start text-white font-bold mb-2">Name</Text>
                <TextInput
                    className="w-full h-12 px-3 my-1 text-lg border border-[#bf7641] rounded-lg mb-5 bg-white"
                    placeholder="Enter your name"
                    placeholderTextColor={'#6A7E97'}
                    value={username}
                    onChangeText={setUsername}
                />
                <Text className="self-start text-white font-bold mb-2">Email Address</Text>
                <TextInput
                    className="w-full h-12 px-3 my-1 text-lg border border-[#bf7641] rounded-lg mb-5 bg-white"
                    placeholder="Enter Email"
                    placeholderTextColor={'#6A7E97'}
                    value={email}
                    onChangeText={setEmail}
                />
                <Text className="self-start text-white font-bold mb-2">Password</Text>
                <TextInput
                    className="w-full h-12 px-3 my-1 text-lg border border-[#bf7641] rounded-lg mb-5 bg-white"
                    placeholder="Enter Password"
                    placeholderTextColor={'#6A7E97'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <View className="w-full">
                    {isSubmitting? 
                        (
                            <ActivityIndicator size="small" color="#fffff" />
                        ) : (
                        <Pressable
                            onPress={handleSignUpButton}
                            className="mt-10 py-3 px-5 rounded-lg items-center bg-white"
                            >
                            <Text className="font-bold text-lg text-[#bf7641]">Sign Up</Text>
                        </Pressable>
                        )
                    }
                </View>
                <Text className="mt-10 text-white text-center">
                    Already have an account?{' '}
                    <Text
                    onPress={() => router.push('/login')}
                    className="text-white underline font-bold"
                    >
                    Log In
                    </Text>
                </Text>
                </View>
        </SafeAreaView>
    )
}

export default Signup;
