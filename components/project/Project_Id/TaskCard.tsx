// components/project/TaskCard.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Task = {
    id: number;
    name: string;
    assignee: string;
    dueDate: string;
    priority: string;
    completed: boolean;
};

type TaskCardProps = {
    task: Task;
    onToggleComplete: (taskId: number) => void;
};

export default function TaskCard({ task, onToggleComplete }: TaskCardProps) {
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
});