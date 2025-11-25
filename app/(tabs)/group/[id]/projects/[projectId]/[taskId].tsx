import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PROJECT_DETAILS: Record<string, any> = {
    '1_1': {
        id: 1,
        name: 'Sprint 14 : Design Checkout Flow',
        subtitle: 'Pizza Party!',
        tasks: 8,
        completed: 5,
        color: '#C8733B',
        emoji: '🍕',
        taskList: [
            { id: 1, name: 'Wireframe User Flow', assignee: 'Raka', completed: true },
            { id: 2, name: 'Create Interactive Prototype', assignee: 'Very', completed: true },
            { id: 3, name: 'User Test Round 1', assignee: 'Very', completed: true },
            { id: 4, name: 'Handoff to Dev', assignee: 'Jonas', completed: true },
            { id: 5, name: 'Presentation to customer', assignee: 'Raka', completed: true },
            { id: 6, name: 'Final Review', assignee: 'Very', completed: false },
            { id: 7, name: 'Documentation', assignee: 'Jonas', completed: false },
            { id: 8, name: 'Deploy to Production', assignee: 'Raka', completed: false },
        ]
    },
    '1_2': {
        id: 2,
        name: 'Sprint 14 : Design Checkout Flow',
        subtitle: 'Pizza Party!',
        tasks: 8,
        completed: 5,
        color: '#8BC34A',
        emoji: '🍕',
        taskList: [
            { id: 1, name: 'Research Phase', assignee: 'Raka', completed: true },
            { id: 2, name: 'Design Mockups', assignee: 'Very', completed: true },
            { id: 3, name: 'Client Feedback', assignee: 'Jonas', completed: true },
            { id: 4, name: 'Revisions', assignee: 'Raka', completed: true },
            { id: 5, name: 'Final Approval', assignee: 'Very', completed: true },
        ]
    },
};

export default function ProjectDetails() {
    const params = useLocalSearchParams();
    const router = useRouter();
    
    console.log('[taskId].tsx - All params received:', params);
    const groupId = Array.isArray(params.id) ? params.id[0] : params.id;
    const projectId = Array.isArray(params.projectId) ? params.projectId[0] : params.projectId;
    const taskId = Array.isArray(params.taskId) ? params.taskId[0] : params.taskId;
    
    console.log('[taskId].tsx - Group ID:', groupId, 'Project ID:', projectId, 'Task ID:', taskId);
    
    // Untuk halaman individual task, kita masih gunakan project data
    // tapi bisa fokus pada task tertentu jika diperlukan
    const projectKey = `${groupId}_${projectId}`;
    const project = PROJECT_DETAILS[projectKey];

    const [tasks, setTasks] = useState(project?.taskList || []);

    const toggleTask = (taskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    if (!project) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Project not found</Text>
            </View>
        );
    }

    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Project Card */}
                <View style={[styles.projectCard, { backgroundColor: project.color }]}>
                    <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>{project.emoji}</Text>
                    </View>

                    <View style={styles.projectContent}>
                        <Text style={styles.projectName}>{project.name}</Text>
                        <Text style={styles.projectSubtitle}>{project.subtitle}</Text>

                        <View style={styles.tasksInfo}>
                            <Text style={styles.tasksText}>{completedCount}/{project.tasks} Tasks</Text>
                        </View>
                    </View>
                </View>

                {/* Task List */}
                <View style={styles.taskList}>
                    {tasks.map((task) => (
                        <TouchableOpacity
                            key={task.id}
                            style={styles.taskItem}
                            onPress={() => toggleTask(task.id)}
                        >
                            <View style={styles.taskLeft}>
                                <View style={[
                                    styles.checkbox,
                                    task.completed && styles.checkboxChecked
                                ]}>
                                    {task.completed && (
                                        <Ionicons name="checkmark" size={18} color="#fff" />
                                    )}
                                </View>
                                <Text style={[
                                    styles.taskName,
                                    task.completed && styles.taskNameCompleted
                                ]}>
                                    {task.name}
                                </Text>
                            </View>
                            <Text style={styles.assigneeName}>{task.assignee}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Add Task Button */}
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
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    projectCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        minHeight: 160,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    emojiContainer: {
        marginBottom: 12,
    },
    emoji: {
        fontSize: 48,
    },
    projectContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    projectName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    projectSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 12,
    },
    tasksInfo: {
        alignSelf: 'flex-end',
    },
    tasksText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    taskList: {
        gap: 12,
    },
    taskItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    taskLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#333',
        borderColor: '#333',
    },
    taskName: {
        fontSize: 15,
        color: '#333',
        flex: 1,
    },
    taskNameCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    assigneeName: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    errorText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 40,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f4e4c1',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderWidth: 2,
        borderColor: '#333',
    },
});