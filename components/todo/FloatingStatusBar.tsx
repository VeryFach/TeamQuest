import { useProjectFilter } from "@/hooks/useProjectFilter";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FloatingStatusBarProps {
  activeTab: "group" | "private";
  onTabChange: (tab: "group" | "private") => void;
}

export default function FloatingStatusBar({
  activeTab,
  onTabChange,
}: FloatingStatusBarProps) {
  // Ambil totalTasksCount dari hook yang sudah diupdate
  const { totalUncompletedTasks } = useProjectFilter(activeTab);

  return (
    <View style={styles.floatingBarContainer}>
      {/* Badge sekarang menampilkan Total Tasks */}
      <View style={styles.unfinishedBadge}>
        <Text style={styles.unfinishedText}>
          ! {totalUncompletedTasks} Uncompleted
        </Text>
      </View>

      {/* Container Toggle */}
      <View style={styles.filterGroup}>
        {/* Tombol GROUP */}
        <TouchableOpacity
          style={[
            styles.baseBtn,
            activeTab === "group" ? styles.activeBtn : styles.inactiveBtn,
          ]}
          onPress={() => onTabChange("group")}
        >
          <Text
            style={[
              styles.baseText,
              activeTab === "group" ? styles.activeText : styles.inactiveText,
            ]}
          >
            Group
          </Text>
        </TouchableOpacity>

        {/* Tombol PRIVATE */}
        <TouchableOpacity
          style={[
            styles.baseBtn,
            activeTab === "private" ? styles.activeBtn : styles.inactiveBtn,
          ]}
          onPress={() => onTabChange("private")}
        >
          <Text
            style={[
              styles.baseText,
              activeTab === "private" ? styles.activeText : styles.inactiveText,
            ]}
          >
            Private
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginTop: 20,
    alignItems: "center",
    marginBottom: 10,
    zIndex: 1,
  },
  unfinishedBadge: {
    backgroundColor: "#F16B4D",
    paddingHorizontal: 25, // Adjusted padding
    paddingVertical: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    right: 10,
  },
  unfinishedText: {
    color: "#6A1D0C",
    fontWeight: "900",
    fontSize: 15,
  },
  // --- Style Toggle Group/Private ---
  filterGroup: {
    backgroundColor: "#f3f4f6",
    flexDirection: "row",
    padding: 4,
    borderRadius: 25,
    elevation: 2,
  },
  baseBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeBtn: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inactiveBtn: {
    backgroundColor: "transparent",
  },
  baseText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  activeText: {
    color: "#374151",
  },
  inactiveText: {
    color: "#9ca3af",
  },
});
