import { useRef } from 'react';
import { Animated, Button, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Search = () => {
    const screenHeight = Dimensions.get('window').height;
    const slideAnim = useRef(new Animated.Value(-screenHeight)).current;

    const panResponder = useRef(
        PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy < -10,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.dy < -30) hideSearch();
        },
        })
    ).current;

    const hideSearch = () => {
        Animated.timing(slideAnim, {
        toValue: -screenHeight,
        duration: 1000,
        useNativeDriver: true,
        }).start();
    };


    return(
        <View className="w-screen h-screen">
            <Animated.View
                style={{
                    position: 'absolute',
                    height: screenHeight,
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#F7F4EA',
                    transform: [{ translateY: slideAnim }],
                    zIndex: 10,
                }}
                {...panResponder.panHandlers}
            ></Animated.View>
            <Text>Search screen</Text>
        </View>
    );
}

export default Search;