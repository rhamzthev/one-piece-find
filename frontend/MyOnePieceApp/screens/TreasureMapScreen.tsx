// screens/TreasureMapScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Image, Dimensions, Text } from 'react-native';
import MapView, { Camera, MapStyleElement, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';

// Hardcoded treasure location
const TREASURE_LAT = 43.0839; // e.g., RIT shed
const TREASURE_LNG = -77.6760;

const { width, height } = Dimensions.get('window');

// If you want a custom map style, set it here. 
// Currently empty = default style.
const mapStyle: MapStyleElement[] | undefined = [];

// Haversine distance function
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth radius in meters
    const toRad = (val: number) => (val * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function TreasureMapScreen() {
    const mapRef = useRef<MapView>(null);

    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [region, setRegion] = useState<Region>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Show chest if within 5 meters
    const [withinRange, setWithinRange] = useState(false);

    // Track daily steps in the background
    const [dailySteps, setDailySteps] = useState<number>(0);

    // Store real-time distance to treasure
    const [distance, setDistance] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            // Watch user location
            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    distanceInterval: 1,
                },
                (loc) => {
                    setLocation(loc.coords);
                    setRegion((prev) => ({
                        ...prev,
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    }));
                }
            );
        })();

        // Steps logic
        Pedometer.isAvailableAsync()
            .then((available) => {
                if (available) {
                    const sub = Pedometer.watchStepCount((result) => {
                        setDailySteps((prev) => prev + result.steps);
                        // Optionally store in DB: storeStepsInDB(...)
                    });
                    return () => sub?.remove();
                }
            })
            .catch((err) => console.log('Pedometer error:', err));

        // Camera tilt logic
        if (!location) return;
        const camera: Camera = {
            center: { latitude: TREASURE_LAT, longitude: TREASURE_LNG },
            pitch: 60,
            heading: 0,
            zoom: 17,
            altitude: 500,
        };

        setTimeout(() => {
            if (mapRef.current) {
                mapRef.current.animateCamera(camera, { duration: 2000 });
            }
        }, 1000);
    }, []);

    // Check distance & show/hide treasure chest
    useEffect(() => {
        if (!location) return;
        const dist = getDistance(location.latitude, location.longitude, TREASURE_LAT, TREASURE_LNG);
        setDistance(dist); // Update distance in state

        if (dist < 5) {
            setWithinRange(true);
            Alert.alert('Treasure Found!', 'A strange presence is here... The chest is visible now!');
        } else {
            setWithinRange(false);
        }
    }, [location]);

    if (errorMsg) {
        return <View style={styles.container} />;
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                customMapStyle={mapStyle}
            >
                {/* User Marker */}
                {location && (
                    <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }}>
                        <Image
                            source={require('../assets/luffy_icon.png')}
                            style={{ width: 40, height: 40 }}
                        />
                    </Marker>
                )}

                {/* Show chest marker only if withinRange */}
                {withinRange && (
                    <Marker coordinate={{ latitude: TREASURE_LAT, longitude: TREASURE_LNG }}>
                        <Image
                            source={require('../assets/treasure_chest.png')}
                            style={{ width: 40, height: 40 }}
                        />
                    </Marker>
                )}
            </MapView>

            {/* Real-time distance overlay */}
            <View style={styles.overlay}>
                <Text style={styles.distanceText}>
                    Distance to Treasure: {distance.toFixed(1)} m
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width,
        height
    },
    overlay: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    distanceText: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
});
