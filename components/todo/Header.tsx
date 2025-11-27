import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HeaderProps {
  dateLabel: string;
  isCalendarOpen: boolean;
  onToggleCalendar: () => void;
  children?: React.ReactNode;
  totalUncompletedTasks: number;
  totalAllTasks: number;
}

export default function Header({
  dateLabel,
  isCalendarOpen,
  onToggleCalendar,
  children,
  totalUncompletedTasks,
  totalAllTasks,
}: HeaderProps) {
  // Hitung persentase completed
  const completedTasks = totalAllTasks - totalUncompletedTasks;
  const progressPercentage =
    totalAllTasks > 0 ? Math.round((completedTasks / totalAllTasks) * 100) : 0;

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={onToggleCalendar}
          >
            <Text style={styles.headerTitle}>{dateLabel}</Text>
            <Ionicons
              name={isCalendarOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="white"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>
            {totalUncompletedTasks} Unfinished Tasks
          </Text>
        </View>
      </View>

      {/* Area untuk me-render Kalender jika visible */}
      {children}

      <View style={styles.progressContainer}>
        {!isCalendarOpen && (
          <View style={{ width: "100%" }}>
            <View style={{ alignItems: "flex-end", marginBottom: 5 }}>
              <Text style={styles.percentageText}>
                {progressPercentage}
                <Text style={styles.percentSymbol}>%</Text>
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 4,
                width: "100%",
              }}
            >
              <View
                style={{
                  height: "100%",
                  backgroundColor: "white",
                  borderRadius: 4,
                  width: `${progressPercentage}%`,
                }}
              />
            </View>
          </View>
        )}
      </View>
      <View style={styles.decorativeCircle} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#d97706",
    paddingTop: Platform.OS === "android" ? 50 : 60,
    paddingHorizontal: 25,
    paddingBottom: 30,
    position: "relative",
    overflow: "visible",
    zIndex: 10,
  },
  decorativeCircle: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.1)",
    zIndex: -1,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "white" },
  headerSubtitle: { color: "#fde68a", marginTop: 5 },
  progressContainer: {
    alignItems: "flex-end",
    marginTop: 10,
    zIndex: -1,
    justifyContent: "center",
  },
  percentageText: { fontSize: 80, fontWeight: "800", color: "white" },
  percentSymbol: { fontSize: 14, fontWeight: "600" },
});
