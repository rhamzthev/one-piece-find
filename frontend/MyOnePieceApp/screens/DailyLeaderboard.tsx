// screens/DailyLeaderboard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface LeaderboardItem {
    username: string;
    dailySteps: number;
}

export default function DailyLeaderboard() {
    const [data, setData] = useState<LeaderboardItem[]>([]);

    useEffect(() => {
        // Example: fetch from your server, or mock it:
        const mockData: LeaderboardItem[] = [
            { username: 'Luffy', dailySteps: 1200 },
            { username: 'Zoro', dailySteps: 1150 },
            { username: 'Nami', dailySteps: 900 },
            { username: 'Sanji', dailySteps: 800 },
        ];
        setData(mockData);
    }, []);

    const renderItem = ({ item }: { item: LeaderboardItem }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.steps}>{item.dailySteps} berries</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Daily Leaderboard</Text>
            <FlatList
                data={data}
                keyExtractor={(item) => item.username}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#8B0000', // One Piece style color
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#FAF0E6', // light parchment color
        borderRadius: 8,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    steps: {
        fontSize: 16,
        color: '#333',
    },
});
