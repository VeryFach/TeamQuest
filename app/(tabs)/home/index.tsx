import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const [task, setTask] = useState([
    {
      name: "KOMGRAF",
      group: "Private",
      completed: false,
    },
    {
      name: "PAPB",
      group: "Tim Ragnarok",
      completed: true,
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.teamText}>TEAM</Text>
        <Text style={styles.questText}>QUEST</Text>
      </View>

      <View style={styles.card}>
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />

        <View style={styles.cardInner}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Tasks Today</Text>
            <TouchableOpacity>
              <Text style={styles.viewMore}>view more</Text>
            </TouchableOpacity>
          </View>

          <View>
            {/* ini ganti semua div jadi View + return di map */}
            {task.map((t, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <View
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
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "90%",
                  }}
                >
                  <Text>{t.name}</Text>
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
      </View>
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
    fontWeight: "bold",
  },
  questText: {
    color: "#C8733B",
    fontSize: 32,
    fontWeight: "bold",
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
