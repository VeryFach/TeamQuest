import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PROJECTS_DATA } from "../project";

export default function ProjectDetailScreen() {
    const { id, pid } = useLocalSearchParams();
    const router = useRouter();

    const project = PROJECTS_DATA[Number(id)]?.find(
        (p) => p.id === Number(pid)
    );

    // Handle jika project tidak ditemukan
    if (!project) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#999" />
                    <Text style={styles.errorText}>Project not found</Text>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    
    // Hitung progress dari tasks yang ada
    const completedTasks = project.tasks.filter((t: any) => t.completed).length;
    const totalTasks = project.tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#FF5252';
            case 'medium': return '#FFA726';
            case 'low': return '#66BB6A';
            default: return '#999';
        }
    };

    const toggleTaskCompletion = (taskId: number) => {
        // TODO: Implement dengan state management (Context/Zustand)
        console.log('Toggle task:', taskId);
        // Nanti bisa update seperti ini:
        // updateTaskStatus(groupId, projectId, taskId, !task.completed)
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: project.color }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.projectInfo}>
                    <Text style={styles.emoji}>{project.emoji}</Text>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectSubtitle}>{project.subtitle}</Text>
                    
                    {/* Progress Bar */}
                    <View style={styles.progressSection}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>
                            {completedTasks}/{totalTasks} Tasks Completed ({Math.round(progress)}%)
                        </Text>
                    </View>
                </View>
            </View>

            {/* Tasks List */}
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Tasks ({totalTasks})</Text>

                {project.tasks.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkbox-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No tasks yet</Text>
                    </View>
                ) : (
                    project.tasks.map((task: any) => (
                        <View key={task.id} style={styles.taskCard}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => toggleTaskCompletion(task.id)}
                            >
                                <Ionicons
                                    name={task.completed ? "checkmark-circle" : "ellipse-outline"}
                                    size={28}
                                    color={task.completed ? "#4CAF50" : "#ccc"}
                                />
                            </TouchableOpacity>

                            <View style={styles.taskContent}>
                                <Text style={[
                                    styles.taskName,
                                    task.completed && styles.taskNameCompleted
                                ]}>
                                    {task.name}
                                </Text>
                                
                                <View style={styles.taskMeta}>
                                    <View style={[
                                        styles.priorityBadge,
                                        { backgroundColor: getPriorityColor(task.priority) }
                                    ]}>
                                        <Text style={styles.priorityText}>
                                            {task.priority.toUpperCase()}
                                        </Text>
                                    </View>
                                    
                                    <View style={styles.assigneeInfo}>
                                        <Ionicons name="person-outline" size={14} color="#666" />
                                        <Text style={styles.assigneeText}>{task.assignee}</Text>
                                    </View>
                                    
                                    <View style={styles.dueDateInfo}>
                                        <Ionicons name="calendar-outline" size={14} color="#666" />
                                        <Text style={styles.dueDateText}>{task.dueDate}</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.taskOptions}>
                                <Ionicons name="ellipsis-horizontal" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Add Task Button */}
            <TouchableOpacity style={styles.addTaskButton}>
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.addTaskText}>Add Task</Text>
            </TouchableOpacity>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#999',
        marginTop: 16,
        marginBottom: 24,
    },
    backButton: {
        backgroundColor: '#C8733B',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    projectInfo: {
        alignItems: 'center',
    },
    emoji: {
        fontSize: 60,
        marginBottom: 12,
    },
    projectName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    projectSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 20,
    },
    progressSection: {
        width: '100%',
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
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
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    checkbox: {
        marginRight: 12,
    },
    taskContent: {
        flex: 1,
    },
    taskName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    taskNameCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    priorityText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    assigneeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    assigneeText: {
        fontSize: 12,
        color: '#666',
    },
    dueDateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dueDateText: {
        fontSize: 12,
        color: '#666',
    },
    taskOptions: {
        padding: 8,
    },
    addTaskButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C8733B',
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    addTaskText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});