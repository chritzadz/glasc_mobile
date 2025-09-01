import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native';

const Home = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const testAPI = async () => {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            })
        });
        const data = await response.json();
        console.log(data);
    };

    return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.greeting}>Welcome!</Text>
        <Text style={styles.formTitle}>Create your account</Text>
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={'#6A7E97'}
                value={username}
                onChangeText={setUsername}
            />
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
                style={({ pressed }) => [
                    styles.button,
                    {
                    backgroundColor : 'white',
                    },
                ]}>
                <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
            </View>
            <Text style={{marginTop: 10, color: 'white'}}>
                Already having an account? {' '}
                <Text
                    onPress={() => router.replace('')}
                    style={{ color: 'white', textDecorationLine: 'underline', fontWeight:'bold' }}
                >
                Log In
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
        padding: '3%',
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
export default Home;
