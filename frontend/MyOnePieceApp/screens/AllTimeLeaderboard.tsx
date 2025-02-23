// screens/AllTimeLeaderboard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface LeaderboardItem {
    username: string;
    totalBerries: number;
}

export default function AllTimeLeaderboard() {
    const [data, setData] = useState<LeaderboardItem[]>([]);

    useEffect(() => {
        // Example: fetch from your server, or mock it:
        const mockData: LeaderboardItem[] = [
            { username: 'Luffy', totalBerries: 50000 },
            { username: 'Zoro', totalBerries: 30000 },
            { username: 'Nami', totalBerries: 28000 },
            { username: 'Usopp', totalBerries: 15000 },
        ];
        setData(mockData);
    }, []);

    const renderItem = ({ item }: { item: LeaderboardItem }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.berries}>{item.totalBerries} Berries</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>All-Time Leaderboard</Text>
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
        color: '#8B0000',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#FAF0E6',
        borderRadius: 8,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    berries: {
        fontSize: 16,
        color: '#333',
    },
});
