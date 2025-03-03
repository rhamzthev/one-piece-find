import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SplashScreen, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { useOnePiece } from '@/context/OnePieceContext';

export default function CollectScreen() {
    const { setHasFoundOnePiece } = useOnePiece();
    const router = useRouter();
    const [revealed, setRevealed] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));

    const [loaded, error] = useFonts({
        'OnePieceTitle': require('@/assets/fonts/OnePieceTitle.ttf'),
        'OnePieceText': require('@/assets/fonts/OnePieceText.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    const handleReveal = () => {
        setRevealed(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    const handleReturn = () => {
        // Set the collected state in storage/context
        // For now, we'll just navigate back
        router.replace('/main');
    };

    const handleCollect = async () => {
        await setHasFoundOnePiece(true);
        // Additional collection logic...
    };

    return (
        <View style={styles.container}>
            {!revealed ? (
                <TouchableOpacity onPress={handleReveal} style={styles.chestContainer}>
                    <Image
                        source={require('@/assets/images/close.png')}
                        style={styles.chestImage}
                    />
                    <Text style={styles.tapText}>Tap to open...</Text>
                </TouchableOpacity>
            ) : (
                <Animated.View style={[styles.revealContainer, { opacity: fadeAnim }]}>
                    <Image
                        source={require('@/assets/images/open.png')}
                        style={styles.treasureImage}
                    />
                    <Text style={styles.heading}>All Hail the Pirate King!</Text>
                    <Text style={styles.subheading}>You found the One Piece! Congrats!</Text>
                    <TouchableOpacity
                        style={styles.returnButton}
                        onPress={handleReturn}
                    >
                        <Text style={styles.returnButtonText}>Continue Adventure</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chestContainer: {
        alignItems: 'center',
    },
    chestImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    tapText: {
        color: '#FFD700',
        fontSize: 20,
        fontFamily: "OnePieceText"
    },
    revealContainer: {
        alignItems: 'center',
        padding: 20,
    },
    treasureImage: {
        width: 250,
        height: 250,
        marginBottom: 30,
    },
    heading: {
        fontSize: 32,
        fontFamily: "OnePieceText",
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    subheading: {
        fontSize: 24,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: "OnePieceText"
    },
    returnButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 5,
    },
    returnButtonText: {
        color: '#000',
        fontSize: 18,
        fontFamily: "OnePieceText"
    },
});