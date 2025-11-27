// app/(tabs)/group/[id]/projects/project-detail.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PROJECTS_DATA } from '@/data/projects';
import { useState } from "react";

export default function ProjectDetailScreen() {
    const { id, projectId } = useLocalSearchParams();
    const router = useRouter();
    type Task = {
        id: number;
        name: string;
        assignee?: string;
        dueDate?: string;
        priority?: string;
        completed?: boolean;
    };

    const [tasks, setTasks] = useState<Task[]>(() => {
        const projects = PROJECTS_DATA[Number(id)] || [];
        const project = projects.find(p => p.id === Number(projectId));
        return (project?.tasks as Task[]) || [];
    });

    const projects = PROJECTS_DATA[Number(id)] || [];
    const project = projects.find(p => p.id === Number(projectId));

    if (!project) {
        return (
            <View style={styles.container}>
                <Text>Project not found</Text>
            </View>
        );
    }

    const toggleTaskCompletion = (taskId: number) => {
        setTasks(prevTasks =>
            prevTasks.map((task: Task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#FF5252';
            case 'medium': return '#FFA726';
            case 'low': return '#66BB6A';
            default: return '#999';
        }
    };

    const getPriorityLabel = (priority: string) => {
        return priority.charAt(0).toUpperCase() + priority.slice(1);
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

                <View style={styles.projectHeader}>
                    <Text style={styles.emoji}>{project.emoji}</Text>
                    <Text style={styles.projectTitle}>{project.name}</Text>
                    <Text style={styles.projectSubtitle}>{project.subtitle}</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressText}>
                            {completedCount} of {totalCount} tasks completed
                        </Text>
                        <Text style={styles.progressPercentage}>
                            {Math.round(progressPercentage)}%
                        </Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill, 
                                { width: `${progressPercentage}%` }
                            ]} 
                        />
                    </View>
                </View>
            </View>

            {/* Task List */}
            <ScrollView 
                style={styles.taskList}
                contentContainerStyle={styles.taskListContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Tasks</Text>

                {tasks.map((task: any) => (
                    <View key={task.id} style={styles.taskCard}>
                        <TouchableOpacity
                            style={styles.taskCheckbox}
                            onPress={() => toggleTaskCompletion(task.id)}
                        >
                            <View style={[
                                styles.checkbox,
                                task.completed && styles.checkboxCompleted
                            ]}>
                                {task.completed && (
                                    <Ionicons name="checkmark" size={18} color="#fff" />
                                )}
                            </View>
                        </TouchableOpacity>

                        <View style={styles.taskContent}>
                            <Text style={[
                                styles.taskName,
                                task.completed && styles.taskNameCompleted
                            ]}>
                                {task.name}
                            </Text>

                            <View style={styles.taskMeta}>
                                <View style={styles.taskMetaItem}>
                                    <Ionicons name="person-outline" size={14} color="#999" />
                                    <Text style={styles.taskMetaText}>{task.assignee}</Text>
                                </View>

                                <View style={styles.taskMetaItem}>
                                    <Ionicons name="calendar-outline" size={14} color="#999" />
                                    <Text style={styles.taskMetaText}>
                                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                </View>

                                <View style={[
                                    styles.priorityBadge,
                                    { backgroundColor: getPriorityColor(task.priority) }
                                ]}>
                                    <Text style={styles.priorityText}>
                                        {getPriorityLabel(task.priority)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                {tasks.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkbox-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No tasks yet</Text>
                    </View>
                )}
            </ScrollView>
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
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    projectHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 12,
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 4,
    },
    projectSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    progressContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    progressPercentage: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    taskList: {
        flex: 1,
    },
    taskListContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    taskCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    taskCheckbox: {
        marginRight: 12,
        paddingTop: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: '#66BB6A',
        borderColor: '#66BB6A',
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
    },
    taskMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    taskMetaText: {
        fontSize: 13,
        color: '#999',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        marginLeft: 'auto',
    },
    priorityText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#fff',
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
});