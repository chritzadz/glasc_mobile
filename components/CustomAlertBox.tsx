import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomAlertBoxProps {
    title: string;
    message: string;
    onYes: () => void;
    onNo: () => void;
}

const CustomAlertBox = ({ title, message, onYes, onNo }: CustomAlertBoxProps) => (
    <View style={styles.overlay}>
        <View style={styles.alertBox}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onYes} style={styles.buttonYes}>
                    <Text style={styles.buttonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onNo} style={styles.buttonNo}>
                    <Text style={styles.buttonText}>No</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensure it's on top
    },
    alertBox: {
        width: '80%',
        backgroundColor: '#F7F4EA',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#B87C4C',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        color: '#B87C4C',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonYes: {
        flex: 1,
        height: 40,
        backgroundColor: '#B87C4C',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginRight: 5,
    },
    buttonNo: {
        flex: 1,
        height: 40,
        backgroundColor: '#B87C4C',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#F7F4EA',
    },
});

export default CustomAlertBox;