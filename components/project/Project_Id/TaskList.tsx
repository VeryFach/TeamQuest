import { Member } from "@/app/(tabs)/group/[id]/projects/[projectId]";
import { Task } from "@/services/task.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TaskListProps {
  tasks: Task[];
  members: Member[];
  onToggleTaskComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateAssignment: (taskId: string, assignedTo: string) => void;
}

export default function TaskList({
  tasks,
  members,
  onToggleTaskComplete,
  onDeleteTask,
  onUpdateAssignment,
}: TaskListProps) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const getMemberName = (memberId: string) => {
    if (!memberId) return "Tidak di-assign";
    const member = members.find((m) => m.id === memberId);
    return member?.name || "Unknown";
  };

  const handleAssignPress = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowAssignModal(true);
  };

  const handleSelectMember = (memberId: string) => {
    if (selectedTaskId) {
      onUpdateAssignment(selectedTaskId, memberId);
    }
    setShowAssignModal(false);
    setSelectedTaskId(null);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggleTaskComplete(item.id)}
      >
        <Ionicons
          name={item.isDone ? "checkbox" : "square-outline"}
          size={24}
          color={item.isDone ? "#4CAF50" : "#8B4513"}
        />
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text style={[styles.taskName, item.isDone && styles.taskCompleted]}>
          {item.taskName}
        </Text>

        {/* Assignee Dropdown */}
        <TouchableOpacity
          style={styles.assigneeButton}
          onPress={() => handleAssignPress(item.id)}
        >
          <Ionicons name="person-outline" size={14} color="#666" />
          <Text style={styles.assigneeText}>
            {getMemberName(item.assignedTo)}
          </Text>
          <Ionicons name="chevron-down" size={12} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteTask(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada task</Text>
          </View>
        }
      />

      {/* Assignment Modal */}
      <Modal
        visible={showAssignModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAssignModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign ke Member</Text>
            <ScrollView style={styles.memberList}>
              {/* Option untuk tidak assign */}
              <TouchableOpacity
                style={styles.memberItem}
                onPress={() => handleSelectMember("")}
              >
                <Ionicons name="person-outline" size={20} color="#666" />
                <Text style={styles.memberName}>Tidak di-assign</Text>
              </TouchableOpacity>

              {members.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.memberItem}
                  onPress={() => handleSelectMember(member.id)}
                >
                  <Ionicons name="person" size={20} color="#8B4513" />
                  <Text style={styles.memberName}>{member.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  assigneeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  assigneeText: {
    fontSize: 12,
    color: "#666",
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 12,
    textAlign: "center",
  },
  memberList: {
    maxHeight: 300,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  memberName: {
    fontSize: 16,
    color: "#333",
  },
});
