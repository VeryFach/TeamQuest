import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from "@expo/vector-icons";

interface TeamCardProps {
    title: string;
    bgColor: string;
    members: string[];
    projects: string[];
    onPress: () => void;
}

export default function TeamCard({ title, members, projects, onPress }: TeamCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <ImageBackground
                source={require('@/assets/images/background.png')}
                style={styles.cardBackground}
                imageStyle={styles.cardBackgroundImage}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'rgba(119,65,0,0.8)']}
                    locations={[0, 1]}
                    style={styles.cardGradient}
                >
                    <Text style={styles.cardTitle}>{title}</Text>

                    <View style={styles.cardInfo}>
                        <Text style={styles.cardLabel}>Projects:</Text>
                        <Text style={styles.cardProject}>
                            {projects.join(', ')}
                        </Text>

                        <View style={styles.membersRow}>
                            <Ionicons
                                    name="people"
                                    size={16}
                                    color="#ffffffff"
                            />
                            <Text style={styles.cardMembers}>{members.length} Members</Text>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        height: 210,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    cardBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    cardBackgroundImage: {
        borderRadius: 16,
    },
    // Make the gradient container relative so children can be absolutely positioned
    cardGradient: {
        flex: 1,
        padding: 20,
        position: 'relative',
    },
    // Position title at the top with explicit top offset
    cardTitle: {
        position: 'absolute',
        top: 80,
        left: 20,
        right: 20,
        fontSize: 26,
        fontWeight: '900',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    // Position info block at the bottom with explicit bottom offset
    cardInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        // keep small spacing between children; if gap isn't supported, use margins on children
        gap: 4,
    },
    cardLabel: {
        fontSize: 18,
        color: '#fff',
        opacity: 0.9,
        fontWeight: '500',
    },
    cardProject: {
        fontSize: 18,
        color: '#fff',
        opacity: 0.85,
    },
    membersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    memberIcon: {
        fontSize: 14,
    },
    cardMembers: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500',
    },
});