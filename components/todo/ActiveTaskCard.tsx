import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import TaskActionModal from "./TaskActionModal";

interface ActiveTask {
  id: string;
  taskName: string;
  projectId: string;
  projectName: string;
  groupName: string;
  emoji: string;
  assignedTo: string;
  isDone: boolean;
  createdAt: any;
}

interface ActiveTaskCardProps {
  userId?: string;
  type?: "group" | "private";
  tasks?: ActiveTask[];
  onAddPress?: () => void;
  onTaskPress?: (task: ActiveTask) => void;
  onEditTask?: (task: ActiveTask) => void;
  onDeleteTask?: (task: ActiveTask) => void;
  onCompleteTask?: (task: ActiveTask) => void;
}

// Helper untuk format tanggal relatif
const getRelativeDate = (date: any): string => {
  if (!date) return "";

  const today = new Date();
  let taskDate: Date;

  // Handle Firestore Timestamp
  if (date?.toDate) {
    taskDate = date.toDate();
  } else if (date?.seconds) {
    taskDate = new Date(date.seconds * 1000);
  } else {
    taskDate = new Date(date);
  }

  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - taskDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return diffDays + " days ago";
  return taskDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
};

const ActiveTaskCard: React.FC<ActiveTaskCardProps> = ({
  type = "group",
  tasks = [],
  onAddPress,
  onTaskPress,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  // State untuk modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ActiveTask | null>(null);

  // State untuk edit modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTaskName, setEditTaskName] = useState("");

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  }, [type]);

  const handleTaskPress = (task: ActiveTask) => {
    setSelectedTask(task);
    setModalVisible(true);

    // Tetap panggil callback jika ada
    onTaskPress?.(task);
  };

  const handleEdit = () => {
    if (selectedTask) {
      setEditTaskName(selectedTask.taskName);
      setModalVisible(false);
      setEditModalVisible(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedTask && onEditTask) {
      onEditTask({ ...selectedTask, taskName: editTaskName });
    }
    setEditModalVisible(false);
    setSelectedTask(null);
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditTaskName("");
  };

  const handleDelete = () => {
    if (selectedTask && onDeleteTask) {
      onDeleteTask(selectedTask);
    }
    setModalVisible(false);
  };

  const handleComplete = () => {
    if (selectedTask && onCompleteTask) {
      onCompleteTask(selectedTask);
    }
    setModalVisible(false);
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={{ alignItems: "center", paddingRight: 25 }}
      >
        {/* Tombol Add Task - Style Dashed */}
        <TouchableOpacity style={styles.addCard} onPress={onAddPress}>
          <View style={styles.addIconCircle}>
            <Ionicons name="add" size={30} color="#000000" />
          </View>
          <Text style={styles.addCardText}>Add Task</Text>
        </TouchableOpacity>

        {/* Render Active Tasks */}
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.activeCard}
            onPress={() => handleTaskPress(task)}
            activeOpacity={0.9}
          >
            {/* Bagian Kiri: Teks */}
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.activeCardTitle} numberOfLines={3}>
                  {task.taskName}
                </Text>
                <Text style={styles.activeCardSubtitle} numberOfLines={1}>
                  {task.projectName}
                </Text>
              </View>

              <Text style={styles.activeCardMeta}>
                {task.groupName} • {getRelativeDate(task.createdAt)}
              </Text>
            </View>

            {/* Bagian Kanan: Emoji Besar */}
            <View style={styles.emojiContainer}>
              <Text style={styles.cardEmoji}>{task.emoji}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {tasks.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No active tasks 🎉</Text>
            <Text style={styles.emptySubtext}>You are all caught up!</Text>
          </View>
        )}
      </ScrollView>

      {/* Task Action Modal */}
      <TaskActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        taskTitle={selectedTask?.taskName}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />

      {/* Edit Task Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.editModalOverlay}>
          <View style={styles.editModalContainer}>
            <Text style={styles.editModalTitle}>Edit Task</Text>

            <Text style={styles.editInputLabel}>Task Name</Text>
            <TextInput
              style={styles.editInput}
              value={editTaskName}
              onChangeText={setEditTaskName}
              placeholder="Enter task name"
              placeholderTextColor="#999"
              autoFocus
            />

            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={styles.editCancelButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.editCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editSaveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.editSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  horizontalScroll: {
    paddingLeft: 25,
    paddingVertical: 15,
    marginBottom: 5,
  },
  addCardText: { fontWeight: "bold", color: "#000000", fontSize: 12 },
  // --- ADD BUTTON STYLE ---
  addCard: {
    width: 110,
    height: 140,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 2,
    borderColor: "#000000",
    borderStyle: "dashed",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  addIconCircle: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },

  // --- MAIN CARD STYLE (Seperti Desain) ---
  activeCard: {
    backgroundColor: "white",
    width: 290, // Lebar agar muat teks panjang
    height: 140, // Tinggi agar tidak sempit
    padding: 20,
    borderRadius: 12,
    marginRight: 15,

    // Shadow halus
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,

    flexDirection: "row",
    alignItems: "flex-start", // Top align
  },

  // Layout Konten Teks
  cardContent: {
    flex: 1,
    height: "100%",
    justifyContent: "space-between", // Title di atas, Meta di bawah
    paddingRight: 10,
  },

  // Typografi Judul (Besar & Tebal)
  activeCardTitle: {
    fontFamily: "System", // Atau font custom kamu
    fontWeight: "800", // Extra Bold
    color: "#1A1A1A",
    fontSize: 22,
    lineHeight: 22,
    letterSpacing: -0.5,
  },

  // Subtitle (Sprint name)
  activeCardSubtitle: {
    fontSize: 13,
    color: "#555555",
    fontWeight: "500",
    marginBottom: 4,
  },

  // Footer (Tim & Tanggal)
  activeCardMeta: {
    fontSize: 12,
    color: "#888888",
    fontWeight: "500",
  },

  // Layout Emoji
  emojiContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  cardEmoji: {
    fontSize: 65, // Ukuran emoji sangat besar
  },

  // --- EMPTY STATE ---
  emptyCard: {
    backgroundColor: "white",
    width: 280,
    height: 140,
    padding: 20,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 25,
    borderWidth: 1,
    borderColor: "#eee",
  },
  emptyText: {
    fontWeight: "bold",
    color: "#1f2937",
    fontSize: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#9ca3af",
    marginTop: 4,
  },

  // --- EDIT MODAL STYLES ---
  editModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  editModalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 20,
    textAlign: "center",
  },
  editInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#1A1A1A",
    backgroundColor: "#F9F9F9",
    marginBottom: 20,
  },
  editModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  editCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  editCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  editSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#000",
    alignItems: "center",
  },
  editSaveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default ActiveTaskCard;
