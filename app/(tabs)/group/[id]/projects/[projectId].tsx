// app/(tabs)/group/[id]/projects/[projectId].tsx
import { TaskInput } from "@/components/project/Project_Id";
import ProjectErrorView from "@/components/project/Project_Id/ProjectErrorView";
import ProjectHeader from "@/components/project/Project_Id/ProjectHeader";
import TaskList from "@/components/project/Project_Id/TaskList";
import { db } from "@/firebaseConfig";
import { GroupService } from "@/services/group.service";
import { Project } from "@/services/project.service";
import { Task, TaskService } from "@/services/task.service";
import { UserService } from "@/services/user.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot, Unsubscribe } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

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

  // State untuk project, tasks, dan members
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Refs untuk menyimpan unsubscribe functions
  const unsubscribeRefs = useRef<Unsubscribe[]>([]);

  // Cleanup function
  const cleanupSubscriptions = () => {
    unsubscribeRefs.current.forEach((unsub) => unsub());
    unsubscribeRefs.current = [];
  };

  // Setup realtime listeners
  useEffect(() => {
    if (!projectId || !id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    cleanupSubscriptions();

    // Subscribe ke project document
    const projectUnsub = onSnapshot(
      doc(db, "projects", projectId),
      (snapshot) => {
        if (snapshot.exists()) {
          setProject(snapshot.data() as Project);
        } else {
          setProject(null);
        }
      },
      (error) => {
        console.error("Error listening to project:", error);
      }
    );
    unsubscribeRefs.current.push(projectUnsub);

    // Subscribe ke project tasks
    const taskUnsub = TaskService.subscribeToProjectTasks(
      projectId,
      (fetchedTasks) => {
        setTasks(fetchedTasks);
        setLoading(false);
      }
    );
    unsubscribeRefs.current.push(taskUnsub);

    // Fetch members (tidak perlu realtime)
    const fetchMembers = async () => {
      try {
        const group = await GroupService.getGroup(id);
        if (group && group.members) {
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
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();

    // Cleanup subscriptions saat unmount
    return () => {
      cleanupSubscriptions();
    };
  }, [projectId, id]);

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, isDone: !t.isDone } : t
        )
      );

      try {
        await TaskService.updateTask(taskId, { isDone: !task.isDone });
        // Tidak perlu update state - realtime listener akan handle
      } catch (error) {
        console.error("Error toggling task:", error);
        // Rollback on error
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId ? { ...t, isDone: task.isDone } : t
          )
        );
      }
    }
  };

  const handleSaveTask = async (newText: string, assignedTo: string) => {
    if (!projectId) return;

    try {
      await TaskService.createTask({
        projectId: projectId,
        taskName: newText,
        assignedTo: assignedTo,
        isDone: false,
      });
      // Tidak perlu update state - realtime listener akan handle
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
      // Tidak perlu update state - realtime listener akan handle
    } catch (error) {
      console.error("Error updating task assignment:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await TaskService.deleteTask(taskId);
      // Tidak perlu update state - realtime listener akan handle
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const completedCount = tasks.filter((t) => t.isDone).length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  // Jika project tidak ditemukan
  if (!project) {
    return (
      <ProjectErrorView
        groupId={id}
        projectId={projectId}
        onBackPress={() => router.push(`/(tabs)/group/${id}`)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ProjectHeader
        projectName={project.name}
        projectEmoji={project.reward.icon}
        projectColor={project.bgColor}
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
