import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';

import { Product } from '../../model/Product';
import CurrentUser from '../../model/CurrentUser';

export default function SkincareRoutine() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        router.push('settings');
    };

    return (
        <View style={styles.container}>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20, 
        width: '100%',
        backgroundColor: '#B87C4C',
        paddingTop: 56, // 56px
        paddingBottom: 80, // 80px
    },
});
