import React, { useRef, useEffect } from 'react';
import {  TouchableOpacity, Animated } from 'react-native';

export default function ToggleButton({ isActive, setIsActive }) {
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Synchronize the animation immediately when isActive changes
    useEffect(() => {
        animatedValue.setValue(isActive ? 1 : 0); // Reset animated value instantly
        Animated.timing(animatedValue, {
            toValue: isActive ? 1 : 0, // Animate to match isActive state
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isActive]);

    const toggle = () => {
        const newValue = !isActive;
        Animated.timing(animatedValue, {
            toValue: newValue ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
        setIsActive(newValue);
    };

    const toggleTranslateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 33],
    });

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#D5D5D5', '#BE2929'],
    });

    return (
        <TouchableOpacity onPress={toggle} style={styles.container}>
            <Animated.View style={[styles.toggleBackground, { backgroundColor }]}>
                <Animated.View
                    style={[
                        styles.circle,
                        { transform: [{ translateX: toggleTranslateX }] },
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
}

