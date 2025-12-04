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

const isHexColor = (color: string) => /^#([0-9A-F]{3}){1,2}$/i.test(color);

export default function TeamCard({ title, bgColor, members, projects, onPress }: TeamCardProps) {

    const renderBackground = () => {
        if (isHexColor(bgColor)) {
            return (
                <View style={[styles.cardBackground, { backgroundColor: bgColor }]}>
                    {renderGradientContent()}
                </View>
            );
        }

        return (
            <ImageBackground
                source={{ uri: bgColor }}
                style={styles.cardBackground}
                imageStyle={styles.cardBackgroundImage}
            >
                {renderGradientContent()}
            </ImageBackground>
        );
    };

    const renderGradientContent = () => (
        <LinearGradient
            colors={['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.85)']}
            style={styles.cardGradient}
        >
            <Text style={styles.cardTitle}>{title}</Text>

            <View style={styles.cardInfo}>
                <Text style={styles.cardLabel}>Projects:</Text>
                <Text style={styles.cardProject}>
                    {projects.join(', ')}
                </Text>

                <View style={styles.membersRow}>
                    <Ionicons name="people" size={16} color="#ffffff" />
                    <Text style={styles.cardMembers}>{members.length} Members</Text>
                </View>
            </View>
        </LinearGradient>
    );

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            {renderBackground()}
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
        position: 'relative',
    },
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
    cardInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
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
    cardMembers: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500',
    },
});
