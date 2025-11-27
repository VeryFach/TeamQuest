// components/project/ProjectErrorView.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Project } from "@/constants/projectsData";

type ProjectErrorViewProps = {
    groupId: string | undefined;
    projectId: string | undefined;
    availableProjects: Project[];
    onBackPress: () => void;
};

export default function ProjectErrorView({
    groupId,
    projectId,
    availableProjects,
    onBackPress,
}: ProjectErrorViewProps) {
    return (
        <View style={styles.container}>
            <View style={styles.errorContainer}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={onBackPress}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
                <Text style={styles.errorTitle}>Project not found</Text>
                <Text style={styles.errorText}>Group ID: {groupId || 'undefined'}</Text>
                <Text style={styles.errorText}>Project ID: {projectId || 'undefined'}</Text>
                <Text style={styles.errorText}>Available projects: {availableProjects.length}</Text>
                {availableProjects.length > 0 && (
                    <View style={styles.availableProjects}>
                        <Text style={styles.errorSubtitle}>Available project IDs:</Text>
                        {availableProjects.map(p => (
                            <Text key={p.id} style={styles.errorText}>
                                ID: {p.id} - {p.title}
                            </Text>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4e4c1',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 8,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    errorSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    availableProjects: {
        marginTop: 16,
        alignItems: 'center',
    },
});