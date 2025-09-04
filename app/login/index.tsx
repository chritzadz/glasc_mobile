import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert, SafeAreaView } from 'react-native';

import validation from '../../util/validation';
import { User } from '../../model/User';
import CurrentUser from '../../model/CurrentUser';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const userExist = (users: User[]): User | null => {
        const found = users.find((user: User) => user.email === email && user.password === password)
        return found ? found : null;
    }

    const handleLogInButton = async () => {
        if (!areFieldsFilled()) return;
        if (!isEmailValid()) return;
    
        const currUser = await getUser();
        if (currUser) {
            CurrentUser.getInstance().setId(currUser.id);
            Alert.alert('Success', 'User successfully logged in');
            router.push('/scan');
        } else {
            Alert.alert('Error', 'User not found. Please check your email and try again.');
        }
    };

    const getUser = async (): Promise<User | null> => {
        try {
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const data = await response.json();
            const users: User[] = data;
    
            return userExist(users); // Return the current user or null
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch users. Please try again later.');
            return null; // Return null in case of an error
        }
    };

    const areFieldsFilled = (): boolean => {
        if (!email || !password){
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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.greeting}>Log In</Text>
            <Text style={styles.formTitle}>Hello, welcome back!</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    placeholderTextColor={'#6A7E97'}
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.inputTitle}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Password"
                    placeholderTextColor={'#6A7E97'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <View>
                    <Pressable
                    onPress={handleLogInButton}
                    style={({ pressed }) => [
                        styles.button,
                        {
                        backgroundColor : 'white',
                        },
                    ]}>
                    <Text style={styles.buttonText}>Log In</Text>
                    </Pressable>
                </View>
                <Text style={{marginTop: 10, color: 'white'}}>
                    Do not have an account? {' '}
                    <Text
                        onPress={() => router.replace('/')}
                        style={{ color: 'white', textDecorationLine: 'underline', fontWeight:'bold' }}
                    >
                        Sign Up
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        backgroundColor: '#bf7641',
    },
    greeting: {
        paddingHorizontal: '7%',
        marginTop: 60,
        fontSize: 35,
        textAlign: 'center',
        fontWeight: 'bold',
        color:  'white',
    },
    formTitle: {
        paddingHorizontal: '7%',
        marginTop: 10,
        fontSize: 25,
        textAlign: 'center',
        color:  'white',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center', 
        paddingHorizontal: '7%',
        marginTop: 40,
        
    }, 
    inputTitle: {
        alignSelf: 'flex-start',
        color:  'white',
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
    button: {
        marginTop: 40,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 8,
        alignItems: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
    },
})
export default Login;
