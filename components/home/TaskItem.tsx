import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface Task {
  id: number;
  name: string;
  group: string;
  completed: boolean;
  projectId?: string;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: number) => void;
  onPress?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, task.completed && styles.completedContainer]}
      onPress={() => onToggleComplete(task.id)}
      activeOpacity={0.7}
    >
      <View style={styles.checkboxContainer}>
        <View
          style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        >
          {task.completed && (
            <Ionicons name="checkmark-sharp" size={15} color="#09ff00ff" />
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[styles.taskName, task.completed && styles.taskNameCompleted]}
          numberOfLines={1}
        >
          {task.name}
        </Text>
        <View style={styles.groupContainer}>
          <Ionicons
            name={task.group === "Private" ? "person" : "people"}
            size={16}
            color="#666"
          />
          <Text style={styles.groupText}>{task.group}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
    minHeight: 56,
  },
  completedContainer: {
    opacity: 0.6,
    backgroundColor: "rgba(200, 200, 200, 0.3)",
  },
  checkboxContainer: {
    marginRight: 12,
    padding: 4,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    borderColor: "#09ff00ff",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    flex: 1,
    marginRight: 8,
  },
  taskNameCompleted: {
    textDecorationLine: "line-through",
    color: "#666",
  },
  groupContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  groupText: {
    fontSize: 13,
    color: "#666",
  },
});

export default TaskItem;
