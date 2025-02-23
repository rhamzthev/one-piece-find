import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert
} from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Pedometer } from 'expo-sensors';

// Use full screen for the map
const { width, height } = Dimensions.get('window');

/**
 * Hardcoded location for RIT's shed (approximate).
 * If you have exact lat/lng for a specific spot on campus, use that instead.
 */
const TREASURE_LAT = 43.0839;
const TREASURE_LNG = -77.6760;

export default function App() {
  // 1) Track user location & map region
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 2) Distance & bearing to treasure
  const [distanceToTreasure, setDistanceToTreasure] = useState<number>(0);
  const [bearing, setBearing] = useState<number>(0);

  // 3) Daily steps
  const [dailySteps, setDailySteps] = useState<number>(0);

  // 4) Request location permission & watch position
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
          distanceInterval: 1, // update every meter
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
  }, []);

  // 5) Calculate distance & bearing whenever location changes
  useEffect(() => {
    if (!location) return;
    const dist = getDistance(location.latitude, location.longitude, TREASURE_LAT, TREASURE_LNG);
    setDistanceToTreasure(dist);

    const brng = getBearing(location.latitude, location.longitude, TREASURE_LAT, TREASURE_LNG);
    setBearing(brng);

    // If <5m => alert
    if (dist < 5) {
      Alert.alert('Strange Presence', 'A strange presence is lingering nearby!');
    }
  }, [location]);

  // 6) Track steps with Pedometer
  useEffect(() => {
    Pedometer.isAvailableAsync().then((available) => {
      if (available) {
        const subscription = Pedometer.watchStepCount((result) => {
          // # of steps since subscription started
          setDailySteps((prev) => prev + result.steps);
        });
        return () => subscription?.remove();
      }
    }).catch((err) => console.log('Pedometer error:', err));
  }, []);

  // Display location status or error
  let locationStatus = 'Fetching location...';
  if (errorMsg) {
    locationStatus = errorMsg;
  } else if (location) {
    locationStatus = `You are at lat: ${location.latitude.toFixed(4)}, lon: ${location.longitude.toFixed(4)}`;
  }

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      />

      {/* Overlay text */}
      <View style={styles.overlayTop}>
        <Text style={styles.infoText}>{locationStatus}</Text>
        <Text style={styles.distanceText}>
          Distance to RIT Shed: {distanceToTreasure.toFixed(1)} m
        </Text>
        <Text style={styles.stepsText}>Daily Steps: {dailySteps}</Text>
      </View>

      {/* Triangle arrow for compass bearing */}
      <View style={styles.arrowContainer}>
        <View style={[styles.arrow, { transform: [{ rotate: `${bearing}deg` }] }]} />
      </View>
    </View>
  );
}

/** 
 * Haversine distance (meters)
 */
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

/**
 * Bearing in degrees [0..360)
 */
function getBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const dLon = toRad(lon2 - lon1);

  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);

  let brng = Math.atan2(y, x);
  brng = (brng * 180) / Math.PI;
  return (brng + 360) % 360;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width,
    height,
  },
  overlayTop: {
    position: 'absolute',
    top: 40,
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
  },
  distanceText: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  stepsText: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#00FF00',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 50,
    left: (width / 2) - 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red', // arrow color
  },
});
