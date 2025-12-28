import { useRouter } from "expo-router";
import React, { useMemo } from "react";
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
  scale?: number; // Persentase, misal 100 (normal), 80 (kecil)
  customWidth?: number;
  customBgColor?: string;
}

const { width } = Dimensions.get("window");

// Helper function to darken a hex color
const darkenColor = (hex: string, amount: number = 30): string => {
  // Remove # if present
  const color = hex.replace("#", "");

  // Parse RGB values
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  // Subtract amount (darken), ensuring we don't go below 0
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  data,
  onPress,
  scale = 100, // Default 100%
  customWidth,
  customBgColor,
}) => {
  const router = useRouter();
  const { id, group_name, reward, reward_emot, tasks_total, tasks_completed } =
    data;

  const backgroundColor = customBgColor;
  const accentColor = customBgColor
    ? darkenColor(customBgColor, 30)
    : "#333333";
  const progress = tasks_total > 0 ? tasks_completed / tasks_total : 0;

  // 1. Hitung Faktor Skala (0.8, 1.0, 1.2, dll)
  const scaleFactor = scale / 100;

  // 2. Helper function untuk mengalikan ukuran
  const s = (size: number) => size * scaleFactor;

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    } else {
      console.log(id);
      router.push({
        pathname: "/group/[id]",
        params: { id },
      } as any);
    }
  };

  // Kita gunakan useMemo agar style tidak dihitung ulang setiap render kecuali scale berubah
  const dynamicStyles = useMemo(() => {
    const baseWidth = customWidth || width * 0.9;

    return StyleSheet.create({
      cardContainer: {
        width: baseWidth * scaleFactor, // Width ikut mengecil
        borderRadius: s(15),
        padding: s(20),
        marginVertical: s(6),
        // Shadow juga perlu disesuaikan sedikit agar tidak terlalu tebal saat kecil
        shadowOffset: { width: 0, height: s(4) },
        shadowRadius: s(5),
      },
      header: {
        marginBottom: s(15),
      },
      rewardEmot: {
        fontSize: s(50), // Font ikut mengecil
        marginRight: s(15),
      },
      rewardText: {
        fontSize: s(24),
        marginBottom: s(2), // Sedikit jarak antar text
      },
      groupText: {
        fontSize: s(16),
      },
      progressBarBackground: {
        marginVertical: s(10),
        height: s(5),
        borderRadius: s(5),
      },
      tasksStatus: {
        fontSize: s(14),
        marginTop: s(5),
      },
    });
  }, [scaleFactor, customWidth]);

  return (
    <TouchableOpacity
      style={[
        baseStyles.cardBase, // Style statis (warna, flex, shadow color)
        dynamicStyles.cardContainer, // Style dinamis (ukuran)
        { backgroundColor: backgroundColor },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Header: Emot & Title */}
      <View style={[baseStyles.headerBase, dynamicStyles.header]}>
        <Text style={dynamicStyles.rewardEmot}>{reward_emot}</Text>
        <View style={baseStyles.textGroup}>
          <Text style={[baseStyles.textWhiteBold, dynamicStyles.rewardText]}>
            {reward}
          </Text>
          <Text style={[baseStyles.textGroupBase, dynamicStyles.groupText]}>
            {group_name && "Group: "}
            {group_name}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={[
          dynamicStyles.progressBarBackground,
          baseStyles.progressOverflow,
        ]}
      >
        <View
          style={[
            baseStyles.progressBarFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: accentColor,
            },
          ]}
        />
        <View
          style={[
            baseStyles.progressBarRemaining,
            {
              width: `${(1 - progress) * 100}%`,
              backgroundColor: `${accentColor}50`,
            },
          ]}
        />
      </View>

      {/* Footer: Task Count */}
      <Text style={[baseStyles.textWhiteBold, dynamicStyles.tasksStatus]}>
        {tasks_completed}/{tasks_total} Tasks Completed
      </Text>
    </TouchableOpacity>
  );
};

// Style Statis (Yang tidak berhubungan dengan ukuran angka)
const baseStyles = StyleSheet.create({
  cardBase: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    elevation: 8,
  },
  headerBase: {
    flexDirection: "row",
    alignItems: "center",
  },
  textGroup: {
    flex: 1,
  },
  textWhiteBold: {
    fontWeight: "bold",
    color: "white",
  },
  textGroupBase: {
    color: "#E0E0E0",
    opacity: 0.8,
  },
  progressOverflow: {
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.1)", // Optional background track
  },
  progressBarFill: {
    height: "100%",
  },
  progressBarRemaining: {
    height: "100%",
  },
});

export default ProjectCard;
