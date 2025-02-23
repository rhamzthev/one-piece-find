import React, { useState, useEffect, useMemo } from 'react';
import MapView, { Region, Marker } from 'react-native-maps';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { FactsDisplay } from '@/components/FactsDisplay';
import { Compass } from '@/components/Compass';
import { SplashScreen, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

// Constants for the One Piece location and proximity thresholds
const ONE_PIECE_LOCATION = {
    latitude: 43.083892,
    longitude: -77.675791
};

const PROXIMITY_THRESHOLDS = {
    REACHABLE: 1, // 10 meters
    VERY_CLOSE: 5, // 50 meters
    CLOSE: 10, // 100 meters
    WARM: 25, // 250 meters
    NEARBY: 50, // 500 meters
};

export default function App() {

    const router = useRouter();

    // Add font loading
    const [loaded, error] = useFonts({
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

    // Add this to your state declarations
    const [hasCollected, setHasCollected] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [distance, setDistance] = useState<number>(Infinity);

    // Calculate distance between two coordinates in meters
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    // Get proximity message based on distance
    const getProximityMessage = (distance: number) => {
        if (distance <= PROXIMITY_THRESHOLDS.REACHABLE) {
            return "You can feel an overwhelming presence... Something is here!";
        } else if (distance <= PROXIMITY_THRESHOLDS.VERY_CLOSE) {
            return "You're extremely close!";
        } else if (distance <= PROXIMITY_THRESHOLDS.CLOSE) {
            return "Very warm! Keep going!";
        } else if (distance <= PROXIMITY_THRESHOLDS.WARM) {
            return "";
        } else if (distance <= PROXIMITY_THRESHOLDS.NEARBY) {
            return "You sense something in this area...";
        }
        return "No spiritual presence detected...";
    };

    // Update distance whenever location changes
    useEffect(() => {
        if (location?.coords) {
            const newDistance = calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                ONE_PIECE_LOCATION.latitude,
                ONE_PIECE_LOCATION.longitude
            );
            setDistance(newDistance);
        }
    }, [location]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            try {
                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Low // Prioritize speed over accuracy
                });
                setLocation(location);
            } catch (error) {
                setErrorMsg('Could not get location');
            } finally {
                setLoading(false);
            }
        })();

        // Set up interval for updating location
        const intervalId = setInterval(async () => {
            try {
                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Low
                });
                setLocation(location);
            } catch (error) {
                console.log('Error updating location:', error);
            }
        }, 2500); // Update every 5 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    const proximityMessage = useMemo(() => getProximityMessage(distance), [distance]);
    const isReachable = distance <= PROXIMITY_THRESHOLDS.REACHABLE;

    // Modify the handleGrabTreasure function
    const handleGrabTreasure = () => {
        router.push('/collect');
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Getting location...</Text>
                <FactsDisplay />
            </View>
        );
    }

    const initialRegion: Region = {
        latitude: location?.coords.latitude ?? 0,
        longitude: location?.coords.longitude ?? 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };
    
    // Modify the return statement to conditionally render the overlays
    return (
        <View style={styles.container}>
            <MapView
                showsUserLocation={true}
                followsUserLocation={true}
                style={styles.map}
                initialRegion={initialRegion}
            >
            </MapView>
            {!hasCollected && (
                <>
                    <View style={styles.overlayTop}>
                        {location && (
                            <Compass
                                userLocation={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                targetLocation={ONE_PIECE_LOCATION}
                            />
                        )}
                        {errorMsg && <Text style={styles.infoText}>{errorMsg}</Text>}
                    </View>
                    <View style={styles.overlayBottom}>
                        <Text style={styles.proximityText}>{proximityMessage}</Text>
                        {isReachable && (
                            <TouchableOpacity
                                style={styles.grabButton}
                                onPress={handleGrabTreasure}
                            >
                                <Text style={styles.grabButtonText}>Grab Mysterious Object</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            )}
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
    overlayTop: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    overlayBottom: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    infoText: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 4,
        fontFamily: 'OnePieceText',
    },
    distanceText: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#FFD700',
        fontSize: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 4,
        fontFamily: 'OnePieceText',
    },
    stepsText: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#00FF00',
        fontSize: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        fontFamily: 'OnePieceText',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    coordsText: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: '#FFF',
        fontSize: 14,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 4,
        textAlign: 'center',
        fontFamily: 'OnePieceText',
    },
    proximityText: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: '#FFD700',
        fontSize: 18,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 8,
        textAlign: 'center',
        fontFamily: 'OnePieceText',
    },
    grabButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    grabButtonText: {
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'OnePieceText',
    },
});
