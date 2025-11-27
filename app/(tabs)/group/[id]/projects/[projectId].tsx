import { PROJECTS_DATA } from '@/constants/projectsData';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ProjectHeader from "@/components/project/Project_Id/ProjectHeader";
import TaskList from "@/components/project/Project_Id/TaskList";
import ProjectErrorView from "@/components/project/Project_Id/ProjectErrorView";

import type { Project, Task } from "@/constants/projectsData";

export default function ProjectDetailScreen() {
    const { id, projectId } = useLocalSearchParams<{ id: string; projectId: string }>();
    const router = useRouter();

    console.log("=== Project Detail Params ===", { id, projectId });

    // 1️⃣ Cari project berdasarkan projectId (karena data sudah flat, bukan array per group)
    const project: Project | undefined = PROJECTS_DATA.find(
        (p) => p.id === projectId
    );

    console.log(`Project lookup:`, project ? `Found ${project.title}` : "Not found");

    // 2️⃣ Filter project lain yang memiliki group sama → untuk error view fallback
    const relatedProjects = project?.group
        ? PROJECTS_DATA.filter((p) => p.group === project.group)
        : [];

    // 3️⃣ State untuk tasks
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (project?.tasks) setTasks(project.tasks);
    }, [project]);

    const toggleTaskCompletion = (taskId: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const totalCount = tasks.length;

    // 4️⃣ Jika project tidak ditemukan → tampilkan error view
    if (!project) {
        return (
            <ProjectErrorView
                groupId={id}
                projectId={projectId}
                availableProjects={relatedProjects}
                onBackPress={() => router.push(`/(tabs)/group/${id}`)}
            />
        );
    }

    // 5️⃣ Jika project ditemukan → tampilkan siap
    return (
        <View style={styles.container}>
            <ProjectHeader
                projectName={project.title}
                projectSubtitle={project.subtitle}
                projectEmoji={project.emoji}
                projectColor={project.bgColor}
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
