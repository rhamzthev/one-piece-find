// screens/LeaderboardScreen.tsx
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DailyLeaderboard from './DailyLeaderboard';
import AllTimeLeaderboard from './AllTimeLeaderboard';

const Tab = createMaterialTopTabNavigator();

export default function LeaderboardScreen() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: { backgroundColor: '#8B0000' },
                tabBarIndicatorStyle: { backgroundColor: '#FFD700' },
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: '#fff',
                tabBarLabelStyle: { fontWeight: 'bold' },
            }}
        >
            <Tab.Screen
                name="Daily"
                component={DailyLeaderboard}
                options={{ title: 'Daily' }}
            />
            <Tab.Screen
                name="AllTime"
                component={AllTimeLeaderboard}
                options={{ title: 'All Time' }}
            />
        </Tab.Navigator>
    );
}
