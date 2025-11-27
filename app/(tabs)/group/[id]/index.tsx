// app/(tabs)/group/[id]/index.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProjectScreen from './projects/index';
import ChatScreen from './chat/chat';

const Tab = createMaterialTopTabNavigator();

const TEAMS_DATA = [
    {
        id: 1,
        title: 'Team Produk UI/UX',
        bgColor: '#63703D',
        members: ['Raka', 'Very', 'Farras'],
    },
    {
        id: 2,
        title: 'Team Produktif',
        bgColor: '#603620',
        members: ['Dono', 'Makima', 'Rimuru'],
    },
    {
        id: 3,
        title: 'Team Produktif',
        bgColor: '#EEAA52',
        members: ['Raka', 'Very', 'Farras'],
    }
];

export default function GroupDetailLayout() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const team = TEAMS_DATA.find(t => t.id === Number(id));

    if (!team) {
        return (
            <View style={styles.container}>
                <Text>Team not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with Team Info */}
            <View style={[styles.header, { backgroundColor: team.bgColor }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.push('/group')}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.teamInfo}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/80' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.teamTitle}>{team.title}</Text>
                    <Text style={styles.memberCount}>{team.members.length} Members</Text>
                </View>
            </View>

            {/* Material Top Tabs */}
            <Tab.Navigator
                screenOptions={{
                    tabBarStyle: styles.tabBar,
                    tabBarActiveTintColor: '#C8733B',
                    tabBarInactiveTintColor: '#999',
                    tabBarLabelStyle: styles.tabBarLabel,
                    tabBarIndicatorStyle: styles.tabBarIndicator,
                    tabBarShowIcon: true,
                }}
            >
                <Tab.Screen
                    name="Projects"
                    component={ProjectScreen}
                    initialParams={{ groupId: id }}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="folder-outline" size={20} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Chat"
                    component={ChatScreen}
                    initialParams={{ groupId: id }}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="chatbubble-outline" size={20} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4e4c1',
    },
    header: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    teamInfo: {
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    teamTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    memberCount: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    tabBar: {
        backgroundColor: '#fff',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tabBarLabel: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'none',
    },
    tabBarIndicator: {
        backgroundColor: '#C8733B',
        height: 3,
    },
});