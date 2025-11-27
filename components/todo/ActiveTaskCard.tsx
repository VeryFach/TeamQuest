import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { PROJECTS_DATA } from "@/constants/projectsData";
import TaskActionModal from "./TaskActionModal";

interface ActiveTask {
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectTitle: string;
  groupName: string;
  emoji: string;
  createdAt: Date;
}

interface ActiveTaskCardProps {
  userId?: string;
  type?: "group" | "private";
  onAddPress?: () => void;
  onTaskPress?: (task: ActiveTask) => void;
  onEditTask?: (task: ActiveTask) => void;
  onDeleteTask?: (task: ActiveTask) => void;
  onCompleteTask?: (task: ActiveTask) => void;
}

// Helper untuk format tanggal relatif
const getRelativeDate = (date: Date): string => {
  const today = new Date();
  const taskDate = new Date(date);

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

const getActiveTasks = (
  type: "group" | "private",
  userId?: string
): ActiveTask[] => {
  const activeTasks: ActiveTask[] = [];

  const filteredProjects =
    type === "group"
      ? PROJECTS_DATA.filter((p) => !!p.group)
      : PROJECTS_DATA.filter((p) => !p.group);

  filteredProjects.forEach((project) => {
    const incompleteTasks = project.tasks.filter((task) => !task.completed);
    incompleteTasks.forEach((task) => {
      activeTasks.push({
        taskId: task.id,
        taskTitle: task.title,
        projectId: project.id,
        projectTitle: project.title,
        groupName: project.group || "Private",
        emoji: project.emoji,
        createdAt: task.createdAt,
      });
    });
  });

  activeTasks.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return activeTasks;
};

const ActiveTaskCard: React.FC<ActiveTaskCardProps> = ({
  userId,
  type = "group",
  onAddPress,
  onTaskPress,
  onEditTask,
  onDeleteTask,
  onCompleteTask,
}) => {
  const activeTasks = getActiveTasks(type, userId);
  const scrollRef = useRef<ScrollView>(null);

  // State untuk modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ActiveTask | null>(null);

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
    if (selectedTask && onEditTask) {
      onEditTask(selectedTask);
    }
  };

  const handleDelete = () => {
    if (selectedTask && onDeleteTask) {
      onDeleteTask(selectedTask);
    }
  };

  const handleComplete = () => {
    if (selectedTask && onCompleteTask) {
      onCompleteTask(selectedTask);
    }
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
            <Ionicons name={"add"} size={32} color="#4A4A4A" />
          </View>
        </TouchableOpacity>

        {/* Render Active Tasks */}
        {activeTasks.map((task, idx) => (
          <TouchableOpacity
            key={task.taskId}
            style={styles.activeCard}
            onPress={() => handleTaskPress(task)}
            activeOpacity={0.9}
          >
            {/* Bagian Kiri: Teks */}
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.activeCardTitle} numberOfLines={3}>
                  {task.taskTitle}
                </Text>
                <Text style={styles.activeCardSubtitle} numberOfLines={1}>
                  {task.projectTitle}
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
        {activeTasks.length === 0 && (
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
        taskTitle={selectedTask?.taskTitle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  horizontalScroll: {
    paddingLeft: 25,
    paddingVertical: 15,
    marginBottom: 5,
  },
  // --- ADD BUTTON STYLE ---
  addCard: {
    width: 80, // Lebih kecil/ramping untuk tombol add
    height: 140, // Tinggi disamakan dengan card
    borderColor: "#A0A0A0",
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    backgroundColor: "transparent",
  },
  addIconCircle: {
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 50,
  },

  // --- MAIN CARD STYLE (Seperti Desain) ---
  activeCard: {
    backgroundColor: "white",
    width: 290, // Lebar agar muat teks panjang
    height: 140, // Tinggi agar tidak sempit
    padding: 20,
    borderRadius: 24, // Radius besar
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
    fontSize: 18,
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
});

export default ActiveTaskCard;
