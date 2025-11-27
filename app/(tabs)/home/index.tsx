import FAB from "@/components/common/FAB";
import ProjectCard from "@/components/home/ProjectCard";
import TaskItem from "@/components/home/TaskItem";
// Import data dummy yang baru
import { PROJECTS_DATA } from "@/constants/projectsData";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    // Parameter 'user' di sini adalah object User dari Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);

      if (user) {
        // --- DI SINI CARA DAPAT ID-NYA ---
        const userId = user.uid;
        console.log("User ID yang login:", userId);

        // Redirect ke home
        router.replace("/(tabs)/home");
      } else {
        router.replace("/auth/login");
      }
    });

    return unsubscribe;
  }, [router]);
  // 1. Mengambil semua task dari PROJECTS_DATA dan meratakannya (flatten)
  // serta mapping agar sesuai dengan props yang diharapkan TaskItem (misal: title -> name)
  const initialTasks = useMemo(() => {
    const allTasks: any[] = [];
    PROJECTS_DATA.forEach((project) => {
      project.tasks.forEach((task) => {
        allTasks.push({
          id: task.id, // Menggunakan string ID dari data baru
          name: task.title, // Map 'title' dari data baru ke 'name' (props lama)
          group: project.group || "Private",
          completed: task.completed,
          projectId: project.id,
        });
      });
    });
    return allTasks;
  }, []);

  const [tasks, setTasks] = useState(initialTasks);

  // 2. Mapping PROJECTS_DATA agar sesuai dengan props ProjectCard
  const initialProjects = useMemo(() => {
    return PROJECTS_DATA.map((project) => ({
      id: project.id,
      group_name: project.group || "Private",
      // Menggunakan subtitle sebagai 'reward' (keterangan singkat di kartu)
      reward: project.subtitle,
      reward_emot: project.emoji,
      tasks_total: project.tasks.length,
      tasks_completed: project.tasks.filter((t) => t.completed).length,
    }));
  }, []);

  const [projects, setProjects] = useState(initialProjects);

  // Toggle task completion (ID sekarang string)
  const toggleTaskCompletion = (taskId: string) => {
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
          showsVerticalScrollIndicator={false}
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
              {sortedTasks.length > 0 ? (
                sortedTasks.slice(0, 5).map(
                  (
                    task // Menampilkan max 5 task agar tidak terlalu panjang
                  ) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={() => toggleTaskCompletion(task.id)}
                    />
                  )
                )
              ) : (
                <Text
                  style={{ color: "#666", fontStyle: "italic", marginTop: 10 }}
                >
                  No tasks for today.
                </Text>
              )}
            </View>
          </View>

          {/* Section My Projects */}
          <View style={{ marginBottom: 20 }}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Projects</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/group")}>
                <Text style={styles.viewMore}>view more</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 8, gap: 10 }}>
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
    justifyContent: "space-between", // Memastikan 'view more' di kanan
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
