// app/(tabs)/group/[id]/projects/[projectId].tsx
import { TaskInput } from "@/components/project/Project_Id";
import ProjectErrorView from "@/components/project/Project_Id/ProjectErrorView";
import ProjectHeader from "@/components/project/Project_Id/ProjectHeader";
import TaskList from "@/components/project/Project_Id/TaskList";
import { PROJECTS_DATA } from "@/data/projects";
import { GroupService } from "@/services/group.service";
import { Task, TaskService } from "@/services/task.service";
import { UserService } from "@/services/user.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type Project = {
  id: number;
  name: string;
  subtitle: string;
  color: string;
  emoji: string;
  tasks: Task[];
};

export interface Member {
  id: string;
  name: string;
}

export default function ProjectDetailScreen() {
  const { id, projectId } = useLocalSearchParams<{
    id: string;
    projectId: string;
  }>();
  const router = useRouter();

  // Ambil data projects berdasarkan groupId
  const projects: Project[] = PROJECTS_DATA[Number(id)] || [];

  // Cari project berdasarkan projectId
  const project: Project | undefined = projects.find(
    (p) => p.id === Number(projectId)
  );

  // State untuk tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks dan members dari Firebase
  useEffect(() => {
    const fetchData = async () => {
      if (projectId && id) {
        try {
          setLoading(true);

          // Fetch tasks
          const fetchedTasks = await TaskService.getTasks(projectId);
          setTasks(fetchedTasks as Task[]);

          // Fetch group untuk mendapatkan member IDs
          const group = await GroupService.getGroup(id);
          if (group && group.members) {
            // Fetch user details untuk setiap member
            const memberPromises = group.members.map(async (memberId) => {
              const user = await UserService.getUser(memberId);
              return user
                ? { id: user.id, name: user.displayName || user.email }
                : null;
            });

            const memberResults = await Promise.all(memberPromises);
            const validMembers = memberResults.filter(
              (m): m is Member => m !== null
            );
            setMembers(validMembers);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [projectId, id]);

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      try {
        await TaskService.updateTask(taskId, { isDone: !task.isDone });
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId ? { ...t, isDone: !t.isDone } : t
          )
        );
      } catch (error) {
        console.error("Error toggling task:", error);
      }
    }
  };

  const handleSaveTask = async (newText: string, assignedTo: string) => {
    if (!projectId) return;

    try {
      const newTask = await TaskService.createTask({
        projectId: projectId,
        taskName: newText,
        assignedTo: assignedTo,
        isDone: false,
      });
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTaskAssignment = async (
    taskId: string,
    assignedTo: string
  ) => {
    try {
      await TaskService.updateTask(taskId, { assignedTo });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? { ...t, assignedTo } : t))
      );
    } catch (error) {
      console.error("Error updating task assignment:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const completedCount = tasks.filter((t) => t.isDone).length;
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
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
        members={members}
        onToggleTaskComplete={toggleTaskCompletion}
        onDeleteTask={handleDeleteTask}
        onUpdateAssignment={handleUpdateTaskAssignment}
      />
      <TaskInput onSave={handleSaveTask} members={members} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4e4c1",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
