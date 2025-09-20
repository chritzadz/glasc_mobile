import { useRouter } from 'expo-router';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SearchIcon, ChevronLeft } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';

import { Product } from '../../model/Product';
import CurrentUser from '../../model/CurrentUser';

export default function SkincareRoutine() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleBack = () => {
        router.push('skincare_routine_search');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.backHeader}>
                <TouchableOpacity onPress={handleBack}>
                    <ChevronLeft color="white" />
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    backHeader: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 20, // 20px
        paddingRight: 20, // 20px
        alignItems: 'center',
        gap: 5,
        marginBottom: 10,
        // "flex flex-row items-center gap-5 mb-10"
    },
});
