import { TaskService } from "@/services/task.service";
import { Unsubscribe } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FloatingStatusBarProps {
  activeTab: "group" | "private";
  onTabChange: (tab: "group" | "private") => void;
  userId: string;
}

export default function FloatingStatusBar({
  activeTab,
  onTabChange,
  userId,
}: FloatingStatusBarProps) {
  const [totalUncompletedTasks, setTotalUncompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  // Ref untuk menyimpan unsubscribe function
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Cleanup previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Subscribe ke user tasks - akan auto update saat ada perubahan
    unsubscribeRef.current = TaskService.subscribeToUserTasks(
      userId,
      (tasks) => {
        const uncompleted = tasks.filter((t) => !t.isDone).length;
        setTotalUncompletedTasks(uncompleted);
        setTotalTasks(tasks.length);
      }
    );

    // Cleanup subscription saat unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [userId]);

  const isAllCompleted = totalTasks > 0 && totalUncompletedTasks === 0;

  return (
    <View style={styles.floatingBarContainer}>
      {/* Badge sekarang menampilkan Total Tasks */}
      <View
        style={[
          styles.unfinishedBadge,
          isAllCompleted && styles.completedBadge,
        ]}
      >
        <Text
          style={[
            styles.unfinishedText,
            isAllCompleted && styles.completedText,
          ]}
        >
          {isAllCompleted
            ? "🎉 All Done!"
            : `! ${totalUncompletedTasks} Uncompleted`}
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
  completedBadge: {
    backgroundColor: "#4ADE80",
  },
  unfinishedText: {
    color: "#6A1D0C",
    fontWeight: "900",
    fontSize: 15,
  },
  completedText: {
    color: "#166534",
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
