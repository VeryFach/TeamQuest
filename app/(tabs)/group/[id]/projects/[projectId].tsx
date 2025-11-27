// app/(tabs)/group/[id]/projects/[projectId].tsx
import { PROJECTS_DATA } from '@/data/projects';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ProjectHeader from "@/components/project/Project_Id/ProjectHeader";
import TaskList from "@/components/project/Project_Id/TaskList";
import ProjectErrorView from "@/components/project/Project_Id/ProjectErrorView";

type Task = {
    id: number;
    name: string;
    assignee: string;
    dueDate: string;
    priority: string;
    completed: boolean;
};

type Project = {
    id: number;
    name: string;
    subtitle: string;
    color: string;
    emoji: string;
    tasks: Task[];
};

export default function ProjectDetailScreen() {
    // Params dari dynamic route: [id] dan [projectId]
    const { id, projectId } = useLocalSearchParams<{ id: string; projectId: string }>();
    const router = useRouter();
    
    // Debug
    console.log("=== Project Detail Params ===");
    console.log("Group ID (id):", id);
    console.log("Project ID (projectId):", projectId);
    
    // Ambil data projects berdasarkan groupId
    const projects: Project[] = PROJECTS_DATA[Number(id)] || [];
    console.log(`Projects for group ${id}:`, projects.length, "projects found");
    
    // Cari project berdasarkan projectId
    const project: Project | undefined = projects.find(p => p.id === Number(projectId));
    console.log(`Looking for project ${projectId}:`, project ? `Found: ${project.name}` : "Not found");
    
    // State untuk tasks
    const [tasks, setTasks] = useState<Task[]>([]);

    // Update tasks ketika project ditemukan
    useEffect(() => {
        if (project?.tasks) {
            setTasks(project.tasks);
        }
    }, [project]);

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

    // Jika project tidak ditemukan
    if (!project) {
        return (
            <ProjectErrorView
                groupId={id}
                projectId={projectId}
                availableProjects={projects}
                onBackPress={() => router.push(`/(tabs)/group/${id}`)}
            />
        );
    }

    return (
        <View style={styles.container}>
            <ProjectHeader
                projectName={project.name}
                projectSubtitle={project.subtitle}
                projectEmoji={project.emoji}
                projectColor={project.color}
                completedCount={completedCount}
                totalCount={totalCount}
                onBackPress={() => router.push(`/(tabs)/group/${id}`)}
            />

            <TaskList
                tasks={tasks}
                onToggleTaskComplete={toggleTaskCompletion}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4e4c1',
    },
});