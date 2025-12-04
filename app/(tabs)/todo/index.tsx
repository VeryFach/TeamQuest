import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import Komponen
import ActiveTaskCard from "@/components/todo/ActiveTaskCard";
import CompletedList from "@/components/todo/CompletedList";
import CustomCalendar from "@/components/todo/CustomCalendar";
import DynamicSelectorModal from "@/components/todo/DynamicSelectorModal";
import FloatingStatusBar from "@/components/todo/FloatingStatusBar";
import Header from "@/components/todo/Header";
import ProjectList from "@/components/todo/ProjectList";

// Import Services
import { auth } from "@/firebaseConfig";
import { Group, GroupService } from "@/services/group.service";
import { ProjectService } from "@/services/project.service";
import { TaskService } from "@/services/task.service";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";

// Data Bulan
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate Tahun (misal: dari 2020 sampai 2030)
const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

// Interface untuk data yang sudah diproses
interface ProcessedProject {
  id: string;
  name: string;
  groupName: string;
  reward: string;
  rewardIcon: string;
  bgColor: string;
  tasks_total: number;
  tasks_completed: number;
  isPrivate: boolean;
}

interface ProcessedTask {
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

export default function TodoListScreen() {
  const router = useRouter();

  // Auth & Loading State
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data State
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupProjects, setGroupProjects] = useState<ProcessedProject[]>([]);
  const [privateProjects, setPrivateProjects] = useState<ProcessedProject[]>(
    []
  );
  const [groupTasks, setGroupTasks] = useState<ProcessedTask[]>([]);
  const [privateTasks, setPrivateTasks] = useState<ProcessedTask[]>([]);

  // Calendar State
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  // State untuk Modal/Dropdown
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const [isYearPickerVisible, setYearPickerVisible] = useState(false);

  const [activeTab, setActiveTab] = useState<"group" | "private">("group");
  const [modalVisible, setModalVisible] = useState(false);

  // Computed values
  const currentTasks = activeTab === "group" ? groupTasks : privateTasks;
  const currentProjects =
    activeTab === "group" ? groupProjects : privateProjects;
  const completedTasks = currentTasks.filter((t) => t.isDone);
  const incompleteTasks = currentTasks.filter((t) => !t.isDone);
  const totalUncompletedTasks = incompleteTasks.length;
  const totalAllTasks = currentTasks.length;
  // 1. Cek Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchAllData(user.uid);
      } else {
        router.replace("/auth/login");
      }
    });
    return unsubscribe;
  }, []);

  // 2. Fetch All Data
  const fetchAllData = async (uid: string) => {
    try {
      setLoading(true);

      // Fetch groups user
      const userGroups = await GroupService.getUserGroups(uid);
      setGroups(userGroups);

      // Fetch group projects & tasks
      await fetchGroupData(uid, userGroups);

      // Fetch private projects & tasks
      await fetchPrivateData(uid);
    } catch (error) {
      console.error("Error fetching todo data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 3. Fetch Group Projects & Tasks
  const fetchGroupData = async (uid: string, userGroups: Group[]) => {
    const allGroupProjects: ProcessedProject[] = [];
    const allGroupTasks: ProcessedTask[] = [];

    for (const group of userGroups) {
      // Fetch projects per group
      const projects = await ProjectService.getGroupProjects(group.id);

      for (const project of projects) {
        // Get task stats
        const stats = await ProjectService.getProjectTaskStats(
          project.projectId
        );

        allGroupProjects.push({
          id: project.projectId,
          name: project.name,
          groupName: group.name,
          reward: project.reward.name,
          rewardIcon: project.reward.icon,
          bgColor: project.bgColor,
          tasks_total: stats.tasks_total,
          tasks_completed: stats.tasks_completed,
          isPrivate: false,
        });

        // Fetch tasks per project (yang di-assign ke user)
        const tasks = await TaskService.getTasks(project.projectId);
        const userTasks = tasks.filter((t) => t.assignedTo === uid);

        for (const task of userTasks) {
          allGroupTasks.push({
            id: task.id,
            taskName: task.taskName,
            projectId: task.projectId,
            projectName: project.name,
            groupName: group.name,
            emoji: project.reward.icon,
            assignedTo: task.assignedTo,
            isDone: task.isDone,
            createdAt: task.createdAt,
          });
        }
      }
    }

    setGroupProjects(allGroupProjects);
    setGroupTasks(allGroupTasks);
  };

  // 4. Fetch Private Projects & Tasks
  const fetchPrivateData = async (uid: string) => {
    const allPrivateProjects: ProcessedProject[] = [];
    const allPrivateTasks: ProcessedTask[] = [];

    // Fetch private projects
    const projects = await ProjectService.getUserPrivateProjects(uid);

    for (const project of projects) {
      // Get task stats
      const stats = await ProjectService.getProjectTaskStats(project.projectId);

      allPrivateProjects.push({
        id: project.projectId,
        name: project.name,
        groupName: "Personal",
        reward: project.reward.name,
        rewardIcon: project.reward.icon,
        bgColor: project.bgColor,
        tasks_total: stats.tasks_total,
        tasks_completed: stats.tasks_completed,
        isPrivate: true,
      });

      // Fetch tasks per project
      const tasks = await TaskService.getTasks(project.projectId);

      for (const task of tasks) {
        allPrivateTasks.push({
          id: task.id,
          taskName: task.taskName,
          projectId: task.projectId,
          projectName: project.name,
          groupName: "Personal",
          emoji: project.reward.icon,
          assignedTo: task.assignedTo,
          isDone: task.isDone,
          createdAt: task.createdAt,
        });
      }
    }

    setPrivateProjects(allPrivateProjects);
    setPrivateTasks(allPrivateTasks);
  };

  // 5. Toggle Task Completion
  const toggleTaskCompletion = async (
    taskId: string,
    currentStatus: boolean
  ) => {
    try {
      await TaskService.updateTask(taskId, { isDone: !currentStatus });

      // Update local state
      if (activeTab === "group") {
        setGroupTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, isDone: !currentStatus } : t
          )
        );
      } else {
        setPrivateTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, isDone: !currentStatus } : t
          )
        );
      }

      // Refresh project stats
      if (userId) {
        if (activeTab === "group") {
          await fetchGroupData(userId, groups);
        } else {
          await fetchPrivateData(userId);
        }
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Refresh handler
  const onRefresh = () => {
    if (userId) {
      setRefreshing(true);
      fetchAllData(userId);
    }
  };

  // --- Logic Ganti Bulan/Tahun ---
  const changeMonth = (increment: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setViewDate(newDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    setViewDate(newDate);
    setMonthPickerVisible(false);
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
    setYearPickerVisible(false);
  };

  const getHeaderDateLabel = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) return "Today";
    return selectedDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSelectGroup = (group: Group) => {
    setModalVisible(false);
    router.push(`/(tabs)/group/${group.id}`);
  };

  // Loading State
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>Loading your tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F97316"]}
          />
        }
      >
        <Header
          dateLabel={getHeaderDateLabel()}
          isCalendarOpen={isCalendarVisible}
          onToggleCalendar={() => {
            setCalendarVisible(!isCalendarVisible);
            if (!isCalendarVisible) setViewDate(selectedDate);
          }}
          totalUncompletedTasks={totalUncompletedTasks}
          totalAllTasks={totalAllTasks}
        >
          <CustomCalendar
            visible={isCalendarVisible}
            viewDate={viewDate}
            selectedDate={selectedDate}
            onChangeMonth={changeMonth}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setCalendarVisible(false);
            }}
            onPressMonth={() => setMonthPickerVisible(true)}
            onPressYear={() => setYearPickerVisible(true)}
          />
        </Header>

        <FloatingStatusBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Active Tasks */}
        <ActiveTaskCard
          type={activeTab}
          tasks={incompleteTasks}
          onAddPress={() => setModalVisible(true)}
          onTaskPress={(task) => {
            if (activeTab === "group") {
              const project = groupProjects.find(
                (p) => p.id === task.projectId
              );
              if (project) {
                const group = groups.find((g) => g.name === project.groupName);
                if (group) {
                  router.push({
                    pathname: "/(tabs)/group/[id]/projects/[projectId]",
                    params: { id: group.id, projectId: task.projectId },
                  });
                }
              }
            } else {
              router.push({
                pathname: "/(tabs)/todo/personal-project/[projectId]",
                params: { projectId: task.projectId },
              });
            }
          }}
          onCompleteTask={(task) => toggleTaskCompletion(task.id, task.isDone)}
        />

        {/* Completed Tasks */}
        <CompletedList
          completedTasks={completedTasks.map((t) => ({
            id: t.id,
            title: t.taskName,
          }))}
        />

        {/* Projects */}
        <ProjectList
          type={activeTab}
          projects={currentProjects.map((p) => {
            // Debug: log setiap project
            console.log("Project data:", p);
            console.log("Mapped project:", {
              id: p.id,
              group_name: p.groupName,
              title: p.name,
              reward: p.reward,
              reward_emot: p.rewardIcon,
              tasks_total: p.tasks_total,
              tasks_completed: p.tasks_completed,
              bgColor: p.bgColor,
            });

            return {
              id: p.id,
              group_name: p.groupName,
              title: p.name,
              reward: p.reward,
              reward_emot: p.rewardIcon,
              tasks_total: p.tasks_total,
              tasks_completed: p.tasks_completed,
              bgColor: p.bgColor,
            };
          })}
          onAddPress={() => setModalVisible(true)}
          onProjectPress={(project) => {
            if (activeTab === "group") {
              const proj = groupProjects.find((p) => p.id === project.id);
              if (proj) {
                const group = groups.find((g) => g.name === proj.groupName);
                if (group) {
                  router.push({
                    pathname: "/(tabs)/group/[id]/projects/[projectId]",
                    params: { id: group.id, projectId: project.id },
                  });
                }
              }
            } else {
              router.push({
                pathname: "/(tabs)/todo/personal-project/[projectId]",
                params: { projectId: project.id },
              });
            }
          }}
        />
      </ScrollView>

      {/* Group Selector Modal */}
      <DynamicSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Select Group"
        data={groups}
        displayKey="name"
        onSelect={handleSelectGroup}
      />

      {/* ================= MODAL PEMILIH BULAN ================= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMonthPickerVisible}
        onRequestClose={() => setMonthPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthPickerVisible(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerHeader}>Select Month</Text>
            <View style={styles.monthsGrid}>
              {monthNames.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthItem,
                    viewDate.getMonth() === index && styles.selectedItem,
                  ]}
                  onPress={() => handleMonthSelect(index)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      viewDate.getMonth() === index && styles.selectedItemText,
                    ]}
                  >
                    {month.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= MODAL PEMILIH TAHUN ================= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isYearPickerVisible}
        onRequestClose={() => setYearPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setYearPickerVisible(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerHeader}>Select Year</Text>
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              style={{ maxHeight: 300, width: "100%" }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearItem,
                    viewDate.getFullYear() === item && styles.selectedItem,
                  ]}
                  onPress={() => handleYearSelect(item)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      viewDate.getFullYear() === item &&
                        styles.selectedItemText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBEB" },
  contentContainer: { flex: 1, zIndex: 0 },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#78350f",
  },

  /* --- STYLE UNTUK MODAL PICKER --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#78350f",
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  monthItem: {
    width: "30%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFF7ED",
  },
  yearItem: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#FFF7ED",
  },
  selectedItem: {
    backgroundColor: "#F97316", // Orange saat dipilih
  },
  pickerItemText: {
    fontSize: 16,
    color: "#431407",
  },
  selectedItemText: {
    color: "white",
    fontWeight: "bold",
  },
});
