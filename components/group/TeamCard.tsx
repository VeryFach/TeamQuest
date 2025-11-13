import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

interface TeamCardProps {
    title: string;
    bgColor: string;
    members: string[];
    projects: string[];
    onPress?: () => void; // ← Tambahkan prop onPress
}

const TeamCard: React.FC<TeamCardProps> = ({
    title,
    bgColor,
    members,
    projects,
    onPress // ← Destructure onPress
}) => {
    return (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: bgColor }]}
            onPress={onPress} // ← Tambahkan onPress handler
            activeOpacity={0.8} // ← Efek saat ditekan
        >
            <Image
                source={{ uri: 'https://via.placeholder.com/80' }}
                style={styles.avatar}
            />
            <Text style={styles.teamTitle}>{title}</Text>

            <View style={styles.infoContainer}>
                <View style={styles.column}>
                    <Text style={styles.label}>Member</Text>
                    {members.map((member: string, index: number) => (
                        <Text key={index} style={styles.listItem}>• {member}</Text>
                    ))}
                </View>

                <View style={styles.column}>
                    <Text style={styles.label}>Projects</Text>
                    {projects.map((project: string, index: number) => (
                        <Text key={index} style={styles.listItem}>• {project}</Text>
                    ))}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    teamTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    column: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    listItem: {
        fontSize: 13,
        color: '#fff',
        marginBottom: 4,
    },
});

export default TeamCard;