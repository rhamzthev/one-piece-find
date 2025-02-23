// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// If using a param list:
type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
    TreasureMap: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: HomeScreenNavigationProp;
    route: HomeScreenRouteProp;
}

export default function HomeScreen({ navigation }: Props) {
    return (
        <ImageBackground
            source={require('../assets/onepiece_background.jpg')} // your custom One Piece image
            style={styles.background}
        >
            <View style={styles.overlay}>
                <Text style={styles.title}>Welcome to One Piece Find!</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={styles.buttonText}>Go to Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('TreasureMap')}
                >
                    <Text style={styles.buttonText}>Open Treasure Map</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Leaderboard')}
                >
                    <Text style={styles.buttonText}>Leaderboard</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        color: '#FFD700', // gold color
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#8B0000', // dark red
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});
