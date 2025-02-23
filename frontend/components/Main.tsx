import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default function App() {

    const [region, setRegion] = useState({
        latitude: 43.080090,
        longitude: -77.676544,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    const [position, setPosition] = useState<string | null>(null);

    useEffect(() => {
        Geolocation.getCurrentPosition((pos) => {
            setPosition(JSON.stringify(pos));
        });
    }, [])

    // Geolocation.getCurrentPosition(info => console.log("Hello"));

    return (
        <View style={styles.container}>
            <Text>Position: {position}</Text>
            <MapView initialRegion={region} style={styles.map} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
