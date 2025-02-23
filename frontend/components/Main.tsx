import React, { useState } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function App() {

    const [region, setRegion] = useState({
        latitude: 43.080090,
        longitude: -77.676544,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    })

    return (
        <View style={styles.container}>
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
