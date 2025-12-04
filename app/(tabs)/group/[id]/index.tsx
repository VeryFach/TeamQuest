import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProjectScreen from './projects/index';
import ChatScreen from './chat/chat';
import { GroupService } from "@/services/group.service";
import { UserService, User } from "@/services/user.service";
import { Group } from "@/types/group";

const Tab = createMaterialTopTabNavigator();

export default function GroupDetailLayout() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [group, setGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch group data dari Firebase
    useEffect(() => {
        const fetchGroupData = async () => {
            if (!id) {
                setIsLoading(false);
                return;
            }

            try {
                const groupData = await GroupService.getGroup(id);
                setGroup(groupData);

                if (groupData) {
                    const membersData = await UserService.getUsersByIds(groupData.members);
                    setMembers(membersData);
                }
            } catch (error) {
                console.error("Error fetching group:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroupData();
    }, [id]);

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#C8733B" />
                <Text style={styles.loadingText}>Loading group...</Text>
            </View>
        );
    }

    // Group not found
    if (!group) {
        return (
            <View style={styles.notFoundContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#999" />
                <Text style={styles.notFoundTitle}>Group Not Found</Text>
                <Text style={styles.notFoundSubtitle}>
                    The group you're looking for doesn't exist or has been deleted.
                </Text>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.push('/group')}
                >
                    <Text style={styles.backButtonText}>Back to Groups</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const getGroupInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <View style={styles.container}>
            {/* Header with Team Info */}
            <View style={[styles.header, { backgroundColor: group.bgColor }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.push('/group')}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.teamInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {getGroupInitials(group.name)}
                        </Text>
                    </View>
                    <Text style={styles.teamTitle}>{group.name}</Text>
                    <Text style={styles.memberCount}>
                        {members.length} {members.length === 1 ? 'Member' : 'Members'}
                    </Text>
                    
                    <View style={styles.memberAvatars}>
                        {members.slice(0, 5).map((member, index) => (
                            <View 
                                key={member.id} 
                                style={[
                                    styles.memberAvatar,
                                    { marginLeft: index > 0 ? -10 : 0 }
                                ]}
                            >
                                <Text style={styles.memberAvatarText}>
                                    {member.displayName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        ))}
                        {members.length > 5 && (
                            <View style={[styles.memberAvatar, styles.moreMembers, { marginLeft: -10 }]}>
                                <Text style={styles.moreMembersText}>
                                    +{members.length - 5}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Material Top Tabs - Pass groupId to screens */}
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
                options={{
                    tabBarIcon: ({ color }) => (
                    <Ionicons name="chatbubble-outline" size={20} color={color} />
                    ),
                }}
                >
                {() => <ChatScreen groupId={id} />}
                </Tab.Screen>
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4e4c1',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4e4c1',
        gap: 12,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4e4c1',
        padding: 40,
    },
    notFoundTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#5c3d2e',
        marginTop: 16,
        marginBottom: 8,
    },
    notFoundSubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    backButton: {
        backgroundColor: '#C8733B',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
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
        marginBottom: 12,
    },
    memberAvatars: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    memberAvatarText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5c3d2e',
    },
    moreMembers: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    moreMembersText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#fff',
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