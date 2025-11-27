import FAB from "@/components/common/FAB";
import ProjectCard, { Project } from "@/components/home/ProjectCard";
import TaskItem, { Task } from "@/components/home/TaskItem";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: "KOMGRAF",
      group: "Private",
      completed: false,
      projectId: "project-3",
    },
    {
      id: 2,
      name: "PAPB",
      group: "Tim Ragnarok",
      completed: true,
      projectId: "project-1",
    },
    {
      id: 3,
      name: "Machine Learning Assignment",
      group: "AI Squad",
      completed: false,
      projectId: "project-2",
    },
    {
      id: 4,
      name: "Database Design",
      group: "Private",
      completed: false,
      projectId: "project-3",
    },
    {
      id: 5,
      name: "UI/UX Prototype",
      group: "Design Team",
      completed: true,
      projectId: "project-1",
    },
    {
      id: 6,
      name: "Backend API Development",
      group: "Dev Team",
      completed: false,
      projectId: "project-2",
    },
    {
      id: 7,
      name: "Testing & Debugging",
      group: "QA Team",
      completed: false,
      projectId: "project-1",
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "project-1",
      group_name: "Team Produktif",
      reward: "Pizza Party!",
      reward_emot: "🍕",
      tasks_total: 20,
      tasks_completed: 15,
    },
    {
      id: "project-2",
      group_name: "Keluarnya Hebat",
      reward: "Movie Night!",
      reward_emot: "🎥",
      tasks_total: 4,
      tasks_completed: 2,
    },
    {
      id: "project-3",
      group_name: "Private",
      reward: "Gaming!",
      reward_emot: "🎮",
      tasks_total: 4,
      tasks_completed: 2,
    },
  ]);

  // Toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Sort tasks: incomplete first, then completed
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1; // completed tasks go to bottom
    });
  }, [tasks]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.teamText}>TEAM</Text>
        <Text style={styles.questText}>QUEST</Text>
      </View>

      <View style={styles.card}>
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />

        {/* SCROLLVIEW DI SINI - bungkus semua konten */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 100 }}
        >
          {/* Section My Tasks Today */}
          <View>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Tasks Today</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/todo")}>
                <Text style={styles.viewMore}>view more</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 8 }}>
              {sortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskCompletion}
                />
              ))}
            </View>
          </View>

          {/* Section My Projects - jarak diatur oleh gap: 24 di contentContainerStyle */}
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Projects</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/group")}>
                <Text style={styles.viewMore}>view more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 8 }}>
              {projects.map((project) => (
                <ProjectCard key={project.id} data={project} />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      {/* Tombol Plus - Floating Action Button */}
      <FAB />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 48,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    gap: 8,
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
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  cardInner: {
    flex: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
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
});
