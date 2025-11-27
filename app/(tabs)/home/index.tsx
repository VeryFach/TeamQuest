import FAB from "@/components/common/FAB";
import RewardCard from "@/components/home/Card";
import { Ionicons } from "@expo/vector-icons";
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
  const [task, setTask] = useState([
    {
      id: 1,
      name: "KOMGRAF",
      group: "Private",
      completed: false,
    },
    {
      id: 2,
      name: "PAPB",
      group: "Tim Ragnarok",
      completed: true,
    },
    {
      id: 3,
      name: "Machine Learning Assignment",
      group: "AI Squad",
      completed: false,
    },
    {
      id: 4,
      name: "Database Design",
      group: "Private",
      completed: false,
    },
    {
      id: 5,
      name: "UI/UX Prototype",
      group: "Design Team",
      completed: true,
    },
    {
      id: 6,
      name: "Backend API Development",
      group: "Dev Team",
      completed: false,
    },
    {
      id: 7,
      name: "Testing & Debugging",
      group: "QA Team",
      completed: false,
    },
  ]);

  const [project, setProject] = useState([
    {
      group_name: "Team Produktif",
      reward: "Pizza Party!",
      reward_emot: "🍕",
      tasks_total: 20,
      tasks_completed: 15,
    },
    {
      group_name: "Keluarnya Hebat",
      reward: "Movie Night!",
      reward_emot: "🎥",
      tasks_total: 4,
      tasks_completed: 2,
    },
    {
      group_name: "Private",
      reward: "Gaming!",
      reward_emot: "🎮",
      tasks_total: 4,
      tasks_completed: 2,
    },
  ]);

  // Toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    setTask((prevTasks) =>
      prevTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Sort tasks: incomplete first, then completed
  const sortedTasks = useMemo(() => {
    return [...task].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1; // completed tasks go to bottom
    });
  }, [task]);

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
          contentContainerStyle={{ padding: 20, gap: 24 }}
        >
          {/* Section My Tasks Today */}
          <View>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>My Tasks Today</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/todo")}>
                <Text style={styles.viewMore}>view more</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 12 }}>
              {sortedTasks.map((t) => (
                <View
                  key={t.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    opacity: t.completed ? 0.6 : 1, // Fade completed tasks
                  }}
                >
                  <TouchableOpacity
                    onPress={() => toggleTaskCompletion(t.id)}
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 20,
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      borderColor: "#000",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                    }}
                  >
                    {t.completed ? (
                      <Ionicons
                        name="checkmark-sharp"
                        size={15}
                        color="#09ff00ff"
                      />
                    ) : null}
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "90%",
                    }}
                  >
                    <Text
                      style={{
                        textDecorationLine: t.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {t.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Ionicons
                        name={t.group === "Private" ? "person" : "people"}
                        size={18}
                        color="#000"
                      />
                      <Text>{t.group}</Text>
                    </View>
                  </View>
                </View>
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
            <View style={{ marginTop: 12 }}>
              {project.map((t, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <RewardCard data={t} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      {/* Tombol Plus - Floating Action Button */}
      <FAB onPress={() => console.log("Plus button pressed")} />
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
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#F3E4BD",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 8,
  },
});
