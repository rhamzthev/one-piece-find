// screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Placeholder function to "fetch" user data from MongoDB
async function fetchUserDataFromDB() {
    // e.g. call your backend: await axios.get('https://yourserver.com/api/user')
    return {
        username: 'MonkeyD_Luffy',
        totalBerries: 5000,
        dailySteps: 1234,
    };
}

export default function ProfileScreen() {
    const [username, setUsername] = useState('');
    const [totalBerries, setTotalBerries] = useState(0);
    const [dailySteps, setDailySteps] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchUserDataFromDB();
                setUsername(data.username);
                setTotalBerries(data.totalBerries);
                setDailySteps(data.dailySteps);
            } catch (err) {
                console.log('Error fetching user data', err);
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Profile</Text>
            <Text style={styles.label}>Username: {username}</Text>
            <Text style={styles.label}>Total Berries: {totalBerries}</Text>
            <Text style={styles.label}>Daily Steps: {dailySteps}</Text>
            <Text style={styles.info}>
                (In a real app, these stats would come from your MongoDB database!)
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF0E6', // light "parchment" color
        padding: 20,
    },
    header: {
        fontSize: 26,
        color: '#8B0000',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    info: {
        fontSize: 14,
        marginTop: 20,
        fontStyle: 'italic',
        color: '#555',
    },
});
