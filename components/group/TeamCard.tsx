import { Text, View, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

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
                    colors={['rgba(0,0,0,0)', 'rgba(119,65,0,1)']}
                    locations={[0, 1]}
                    style={styles.cardGradient}
                >
                    <Text style={styles.cardTitle}>{title}</Text>

                    <View style={styles.cardInfo}>
                        <Text style={styles.cardLabel}>Projects:</Text>
                        {projects.map((project, index) => (
                            <Text key={index} style={styles.cardProject}>{project}</Text>
                        ))}

                        <View style={styles.membersRow}>
                            <Text style={styles.memberIcon}>👥</Text>
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
    cardGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    cardInfo: {
        gap: 4,
    },
    cardLabel: {
        fontSize: 13,
        color: '#fff',
        opacity: 0.9,
        fontWeight: '500',
    },
    cardProject: {
        fontSize: 13,
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
        fontSize: 13,
        color: '#fff',
        fontWeight: '500',
    },
});