import { Project } from "@/data/types";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProjectCardProps {
  project: Project;
  onPress: (projectId: number) => void;
}

const colorMap: { [key: string]: string } = {
  "🎮": "#3A7D44", // Hijau tua/militer untuk Gaming
  "🍕": "#CC5500", // Oranye tua/coklat untuk Pizza
  "🏆": "#FFD700", // Emas untuk Trofi
  "🥳": "#FF69B4", // Pink cerah untuk Pesta
  "🎯": "#8B0000", // Merah tua untuk Target
  "📱": "#4B0082", // Ungu untuk Mobile
  "💻": "#2F4F4F", // Hijau gelap untuk Komputer
  "🚀": "#191970", // Biru tua untuk Rocket
  // Tambahkan emoji dan warna lain sesuai kebutuhan
};

const getBackgroundColor = (emoji: string): string => {
  return colorMap[emoji] || "#607D8B"; // Warna default (abu-abu)
};

const getAccentColor = (emoji: string): string => {
  // Warna aksen bisa berupa variasi terang dari warna utama
  if (emoji === "🎮") return "#66BB6A";
  if (emoji === "🍕") return "#FF7043";
  if (emoji === "🏆") return "#FFE082";
  if (emoji === "🥳") return "#F06292";
  if (emoji === "🎯") return "#DC143C";
  if (emoji === "📱") return "#9370DB";
  if (emoji === "💻") return "#708090";
  if (emoji === "🚀") return "#4169E1";
  return "#90A4AE";
};

const { width } = Dimensions.get("window");

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  const { id, name, subtitle, emoji, tasks } = project;
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  
  const backgroundColor = getBackgroundColor(emoji);
  const accentColor = getAccentColor(emoji);
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { backgroundColor: backgroundColor }]}
      onPress={() => onPress(id)}
    >
      {/* Bagian Atas: Emot & Judul */}
      <View style={styles.header}>
        <Text style={styles.projectEmoji}>{emoji}</Text>
        <View style={styles.textGroup}>
          <Text style={styles.projectName}>{name}</Text>
          <Text style={styles.projectSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* Bar Progres */}
      <View style={styles.progressBarBackground}>
        {/* Progres yang sudah selesai */}
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: accentColor,
            },
          ]}
        />
        {/* Progres yang belum selesai */}
        <View
          style={[
            styles.progressBarRemaining,
            {
              width: `${(1 - progress) * 100}%`,
              backgroundColor: `${accentColor}50`, // Warna aksen dengan opasitas
            },
          ]}
        />
      </View>

      {/* Bagian Bawah: Jumlah Tugas */}
      <Text style={styles.tasksStatus}>
        {completedTasks}/{totalTasks} Tasks Completed
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.9, // 90% lebar layar
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: "5%", // Center the card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  projectEmoji: {
    fontSize: 50,
    marginRight: 15,
  },
  textGroup: {
    flex: 1,
  },
  projectName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  projectSubtitle: {
    fontSize: 16,
    color: "#E0E0E0",
    opacity: 0.8,
  },
  progressBarBackground: {
    marginVertical: 10,
    height: 5,
    borderRadius: 5,
    flexDirection: "row",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressBarRemaining: {
    height: "100%",
  },
  tasksStatus: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    marginTop: 5,
  },
});

export default ProjectCard;