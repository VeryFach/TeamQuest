// components/project/TaskList.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import TaskCard from "./TaskCard";

type Task = {
    id: number;
    name: string;
    assignee: string;
    dueDate: string;
    priority: string;
    completed: boolean;
};

type TaskListProps = {
    tasks: Task[];
    onToggleTaskComplete: (taskId: number) => void;
};

export default function TaskList({ tasks, onToggleTaskComplete }: TaskListProps) {
    return (
        <ScrollView 
            style={styles.taskList}
            contentContainerStyle={styles.taskListContent}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.sectionTitle}>Tasks</Text>

            {tasks.map((task: Task) => (
                <TaskCard 
                    key={task.id} 
                    task={task} 
                    onToggleComplete={onToggleTaskComplete}
                />
            ))}

            {tasks.length === 0 && (
                <View style={styles.emptyState}>
                    <Ionicons name="checkbox-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No tasks yet</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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