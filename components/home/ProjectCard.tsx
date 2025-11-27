import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Project {
  id: string;
  group_name: string;
  reward: string;
  reward_emot: string;
  tasks_total: number;
  tasks_completed: number;
}

interface ProjectCardProps {
  data: Project;
  onPress?: (projectId: string) => void;
}

const colorMap: { [key: string]: string } = {
  "🎮": "#3A7D44",
  "🍕": "#CC5500",
  "🏆": "#FFD700",
  "🥳": "#FF69B4",
  "🎥": "#5C3D7A",
};

const getBackgroundColor = (emot: string): string => {
  return colorMap[emot] || "#607D8B";
};

const getAccentColor = (emot: string): string => {
  if (emot === "🎮") return "#66BB6A";
  if (emot === "🍕") return "#FF7043";
  if (emot === "🏆") return "#FFE082";
  if (emot === "🥳") return "#F06292";
  if (emot === "🎥") return "#9575CD";
  return "#90A4AE";
};

const { width } = Dimensions.get("window");

const ProjectCard: React.FC<ProjectCardProps> = ({ data, onPress }) => {
  const router = useRouter();
  const { id, group_name, reward, reward_emot, tasks_total, tasks_completed } =
    data;

  const backgroundColor = getBackgroundColor(reward_emot);
  const accentColor = getAccentColor(reward_emot);
  const progress = tasks_total > 0 ? tasks_completed / tasks_total : 0;

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    } else {
      router.push({
        pathname: "/group/[id]",
        params: { id },
      } as any);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { backgroundColor: backgroundColor }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Header: Emot & Title */}
      <View style={styles.header}>
        <Text style={styles.rewardEmot}>{reward_emot}</Text>
        <View style={styles.textGroup}>
          <Text style={styles.rewardText}>{reward}</Text>
          <Text style={styles.groupText}>Group: {group_name}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: accentColor,
            },
          ]}
        />
        <View
          style={[
            styles.progressBarRemaining,
            {
              width: `${(1 - progress) * 100}%`,
              backgroundColor: `${accentColor}50`,
            },
          ]}
        />
      </View>

      {/* Footer: Task Count */}
      <Text style={styles.tasksStatus}>
        {tasks_completed}/{tasks_total} Tasks Completed
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.9,
    borderRadius: 15,
    padding: 20,
    marginVertical: 6,
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
  rewardEmot: {
    fontSize: 50,
    marginRight: 15,
  },
  textGroup: {
    flex: 1,
  },
  rewardText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  groupText: {
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
