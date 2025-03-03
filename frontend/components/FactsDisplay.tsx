import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { ONE_PIECE_FACTS } from '../constants/facts';

export function FactsDisplay() {
    const [loaded, error] = useFonts({
        'OnePieceText': require('@/assets/fonts/OnePieceText.ttf'),
    });

    const [currentFact, setCurrentFact] = useState(ONE_PIECE_FACTS[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * ONE_PIECE_FACTS.length);
            setCurrentFact(ONE_PIECE_FACTS[randomIndex]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!loaded && !error) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.factText}>{currentFact}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 8,
        margin: 16,
    },
    factText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'OnePieceText'
    },
});