import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Mock data projects
const PROJECTS_DATA: Record<number, any[]> = {
    1: [
        { id: 1, name: 'PAPB', progress: 75, tasks: 12, completed: 9 },
        { id: 2, name: 'Frontend App', progress: 60, tasks: 8, completed: 5 },
    ],
    2: [
        { id: 1, name: 'Network', progress: 80, tasks: 10, completed: 8 },
        { id: 2, name: 'UI/UX Design', progress: 45, tasks: 15, completed: 7 },
    ],
    3: [
        { id: 1, name: 'PAPB', progress: 90, tasks: 5, completed: 5 },
        { id: 2, name: 'Ga tau', progress: 20, tasks: 6, completed: 1 },
    ],
};

export default function ProjectTab() {
    const { id } = useLocalSearchParams();
    const projects = PROJECTS_DATA[Number(id)] || [];

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {projects.map((project) => (
                    <TouchableOpacity key={project.id} style={styles.projectCard}>
                        <View style={styles.projectHeader}>
                            <View style={styles.projectIcon}>
                                <Ionicons name="folder" size={24} color="#C8733B" />
                            </View>
                            <View style={styles.projectInfo}>
                                <Text style={styles.projectName}>{project.name}</Text>
                                <Text style={styles.projectTasks}>
                                    {project.completed}/{project.tasks} tasks completed
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${project.progress}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.progressText}>{project.progress}%</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {projects.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="folder-open-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No projects yet</Text>
                    </View>
                )}
            </ScrollView>

            {/* Add Project Button */}
            <TouchableOpacity style={styles.fab}>
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4e4c1',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    projectCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    projectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    projectIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#f4e4c1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    projectInfo: {
        flex: 1,
    },
    projectName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    projectTasks: {
        fontSize: 14,
        color: '#666',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        width: 45,
        textAlign: 'right',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#C8733B',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});