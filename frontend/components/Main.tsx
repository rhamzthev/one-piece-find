import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
// import * as Location from 'expo-location';

export default function App() {

    const [region, setRegion] = useState({
        latitude: 43.080090,
        longitude: -77.676544,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    return (
        <View style={styles.container}>
            <MapView userLocationPriority="high" showsUserLocation={true} followsUserLocation={true} region={region} style={styles.map} />
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
