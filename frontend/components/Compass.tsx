import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';

interface CompassProps {
  userLocation: {
    latitude: number;
    longitude: number;
  };
  targetLocation: {
    latitude: number;
    longitude: number;
  };
}

export function Compass({ userLocation, targetLocation }: CompassProps) {
  const [magnetometer, setMagnetometer] = useState(0);

  useEffect(() => {
    let subscription: any;

    const startMagnetometer = async () => {
      subscription = Magnetometer.addListener((data) => {
        let angle = Math.atan2(data.y, data.x);
        angle = angle * (180 / Math.PI);
        if (angle < 0) {
          angle = 360 + angle;
        }
        setMagnetometer(angle);
      });

      await Magnetometer.setUpdateInterval(100);
    };

    startMagnetometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Calculate bearing to target
  const calculateBearing = () => {
    const startLat = userLocation.latitude * Math.PI / 180;
    const startLng = userLocation.longitude * Math.PI / 180;
    const destLat = targetLocation.latitude * Math.PI / 180;
    const destLng = targetLocation.longitude * Math.PI / 180;

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
              Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    if (bearing < 0) {
      bearing = 360 + bearing;
    }
    return bearing;
  };

  const bearing = calculateBearing();
  const rotation = bearing - magnetometer;

  return (
    <View style={styles.container}>
      <View style={styles.compass}>
        <Image
          source={require('@/assets/images/compass.png')}
          style={[
            styles.arrow,
            { transform: [{ rotate: `${rotation}deg` }] }
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compass: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 80,
  },
  arrow: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});