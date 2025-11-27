// components/project/TaskCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Task } from "@/constants/projectsData";

type TaskCardProps = {
    task: Task;
    onToggleComplete: (taskId: string) => void;
};

export default function TaskCard({ task, onToggleComplete }: TaskCardProps) {
    // Format tanggal
    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <View style={styles.taskCard}>
            <TouchableOpacity
                style={styles.taskCheckbox}
                onPress={() => onToggleComplete(task.id)}
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
                    styles.taskTitle,
                    task.completed && styles.taskTitleCompleted
                ]}>
                    {task.title}
                </Text>

                <View style={styles.taskMeta}>
                    <View style={styles.taskMetaItem}>
                        <Ionicons name="calendar-outline" size={14} color="#999" />
                        <Text style={styles.taskMetaText}>
                            {formatDate(task.createdAt)}
                        </Text>
                    </View>

                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: task.completed ? '#66BB6A' : '#FFA726' }
                    ]}>
                        <Text style={styles.statusText}>
                            {task.completed ? 'Done' : 'Pending'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    taskTitleCompleted: {
        textDecorationLine: 'line-through',
        color: '#999',
    },
    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#fff',
    },
});