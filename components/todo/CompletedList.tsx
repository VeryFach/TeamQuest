import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CompletedTask {
  id: string;
  title: string;
}

interface CompletedListProps {
  completedTasks: CompletedTask[];
}

export default function CompletedList({ completedTasks }: CompletedListProps) {
  const completedCount = completedTasks.length.toString().padStart(2, "0");

  return (
    <View>
      <View style={styles.completedHeaderContainer}>
        <Text style={styles.sectionTitle}>Completed</Text>
        <Text style={styles.sectionCount}>{completedCount}</Text>
      </View>

      <View style={styles.listContainer}>
        {completedTasks.map((task) => (
          <View key={task.id} style={styles.listItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.listItemText}>{task.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  completedHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "rgba(251, 146, 60, 0.2)",
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#78350f" },
  sectionCount: { fontWeight: "bold", color: "#92400e" },
  listContainer: { paddingHorizontal: 25 },
  listItem: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#fff7ed",
    elevation: 1,
  },
  bulletPoint: {
    width: 12,
    height: 12,
    backgroundColor: "#d97706",
    borderRadius: 6,
    marginRight: 15,
  },
  listItemText: { fontSize: 14, fontWeight: "500", color: "#374151" },
});
