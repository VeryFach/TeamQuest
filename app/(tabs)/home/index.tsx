import HomeActionMenu from "@/components/home/HomeActionMenu"; // Import komponen baru
import ProjectCard from "@/components/home/ProjectCard";
import TaskItem from "@/components/home/TaskItem";
import { auth } from "@/firebaseConfig";
import { GroupService } from "@/services/group.service";
import { ProjectService } from "@/services/project.service";
import { Task, TaskService } from "@/services/task.service"; // Pastikan ProjectService diimport
import { Group } from "@/types/group";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]); // Sesuaikan tipe Project
  const [projectCards, setProjectCards] = useState<any[]>([]);

  const [taskGroupNames, setTaskGroupNames] = useState<{
    [taskId: string]: string | null;
  }>({});

  // 1. Cek Login & Ambil User ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchData(user.uid);
      } else {
        router.replace("/auth/login");
      }
    });
    console.log(myProjects);
    return unsubscribe;
  }, []);

  // 2. Fungsi Fetch Data dari Firebase

  const fetchData = async (uid: string) => {
    try {
      setLoading(true);
      const userTasks = await TaskService.getUserTasks(uid);
      const userGroups = await GroupService.getUserGroups(uid);

      const userProjects = await ProjectService.getUserProjects(uid);
      console.log(userProjects);
      setTasks(userTasks);
      setMyGroups(userGroups);
      setMyProjects(userProjects);

      // Ambil data group name dan stats untuk setiap project
      const cards = await Promise.all(
        userProjects.map(async (project) => {
          const group = await GroupService.getGroup(project.groupId);
          const projectTasks = userTasks.filter(
            (t) => t.projectId === project.projectId
          );
          const tasks_total = projectTasks.length;
          const tasks_completed = projectTasks.filter((t) => t.isDone).length;

          return {
            id: project.projectId,
            group_name: group ? group.name : "-",
            reward: project.reward.name,
            reward_emot: project.reward.icon,
            tasks_total,
            tasks_completed,
          };
        })
      );
      setProjectCards(cards);

      // Ambil group name untuk setiap task (hanya untuk task yang akan ditampilkan)
      const shownTasks = userTasks.slice(0, 5);
      const groupNameMap: { [taskId: string]: string | null } = {};
      await Promise.all(
        shownTasks.map(async (task) => {
          const groupName = await TaskService.getGroupNameByTaskId(task.id);
          groupNameMap[task.id] = groupName;
        })
      );
      setTaskGroupNames(groupNameMap);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper: Hitung jumlah task selesai dan total task per project
  const getProjectTaskStats = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId);
    const tasks_total = projectTasks.length;
    const tasks_completed = projectTasks.filter((t) => t.isDone).length;
    return { tasks_total, tasks_completed };
  };

  const onRefresh = () => {
    if (userId) {
      setRefreshing(true);
      fetchData(userId);
    }
  };

  // 3. Logic Toggle Task
  const toggleTaskCompletion = async (
    taskId: string,
    currentStatus: boolean
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isDone: !currentStatus } : t))
    );

    try {
      await TaskService.updateTask(taskId, { isDone: !currentStatus });
    } catch (error) {
      console.error("Failed to update task", error);
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, isDone: currentStatus } : t))
      );
    }
  };

  // Sorting Task
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.isDone === b.isDone) return 0;
      return a.isDone ? 1 : -1;
    });
  }, [tasks]);

  // --- RENDER ---

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#C8733B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.teamText}>TEAM</Text>
        <Text style={styles.questText}>QUEST</Text>
      </View>

      <View style={styles.card}>
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1, // agar konten bisa full tinggi parent
            padding: 20,
            gap: 24,
            paddingBottom: 0, // hilangkan jarak bawah
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Section My Tasks Today */}
          <View>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Tasks</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/todo")}>
                <Text style={styles.viewMore}>view more</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 8 }}>
              {sortedTasks.length > 0 ? (
                sortedTasks.slice(0, 5).map((task) => (
                  <TaskItem
                    key={task.id}
                    task={{
                      id: Number(task.id),
                      name: task.taskName,
                      group: taskGroupNames[task.id] || "-", // Tampilkan nama group
                      completed: task.isDone,
                      projectId: task.projectId,
                    }}
                    onToggleComplete={() =>
                      toggleTaskCompletion(task.id, task.isDone)
                    }
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No tasks yet.</Text>
                  {/* Note: Karena logika FAB sudah dipindah, CTA ini bisa diarahkan ke route lain atau dihapus */}
                </View>
              )}
            </View>
          </View>

          <View>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Projects</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/group")}>
                <Text style={styles.viewMore}>view more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 8, gap: 10, marginBottom: 150 }}>
              {projectCards.length > 0 ? (
                projectCards.map((card) => (
                  <ProjectCard key={card.id} data={card} />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No projects found.</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>

      <HomeActionMenu myGroups={myGroups} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 32, // Lebih kecil agar tidak terlalu jauh di desktop
    gap: 16,
    paddingHorizontal: 0, // default, akan diatur di card
  },
  header: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  teamText: {
    color: "#A2B06E",
    fontSize: 32,
    fontWeight: "800",
  },
  questText: {
    color: "#C8733B",
    fontSize: 32,
    fontWeight: "800",
  },
  card: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    minHeight: "100%", // agar card full tinggi layar
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 18,
  },
  viewMore: {
    color: "#C8733B",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    // padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
});
