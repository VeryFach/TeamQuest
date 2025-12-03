import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Import Komponen UI
import ActiveTaskCard from "@/components/todo/ActiveTaskCard";
import CompletedList from "@/components/todo/CompletedList";
import CustomCalendar from "@/components/todo/CustomCalendar";
import DynamicSelectorModal from "@/components/todo/DynamicSelectorModal";
import FloatingStatusBar from "@/components/todo/FloatingStatusBar";
import Header from "@/components/todo/Header";
import ProjectList from "@/components/todo/ProjectList";

// Import Modals Baru
import MonthPickerModal from "@/components/todo/MonthPickerModal";
import YearPickerModal from "@/components/todo/YearPickerModal";

// Import Services & Config
import { auth } from "@/firebaseConfig";
import { Group, GroupService } from "@/services/group.service";
import { ProjectService } from "@/services/project.service";
import { TaskService } from "@/services/task.service";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

// Interfaces
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

  // Modal Visibility State
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const [isYearPickerVisible, setYearPickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [activeTab, setActiveTab] = useState<"group" | "private">("group");

  // Computed values
  const currentTasks = activeTab === "group" ? groupTasks : privateTasks;
  const currentProjects =
    activeTab === "group" ? groupProjects : privateProjects;
  const completedTasks = currentTasks.filter((t) => t.isDone);
  const incompleteTasks = currentTasks.filter((t) => !t.isDone);
  const totalUncompletedTasks = incompleteTasks.length;
  const totalAllTasks = currentTasks.length;

  // --- 1. Effects & Fetching Logic (Tetap sama, hanya diringkas untuk brevity) ---
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

  const fetchAllData = async (uid: string) => {
    try {
      setLoading(true);
      const userGroups = await GroupService.getUserGroups(uid);
      setGroups(userGroups);
      await fetchGroupData(uid, userGroups);
      await fetchPrivateData(uid);
    } catch (error) {
      console.error("Error fetching todo data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchGroupData = async (uid: string, userGroups: Group[]) => {
    const allGroupProjects: ProcessedProject[] = [];
    const allGroupTasks: ProcessedTask[] = [];

    for (const group of userGroups) {
      const projects = await ProjectService.getGroupProjects(group.id);
      for (const project of projects) {
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

        const tasks = await TaskService.getTasks(project.projectId);
        const userTasks = tasks.filter((t) => t.assignedTo === uid);
        userTasks.forEach((task) => {
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
        });
      }
    }
    setGroupProjects(allGroupProjects);
    setGroupTasks(allGroupTasks);
  };

  const fetchPrivateData = async (uid: string) => {
    const allPrivateProjects: ProcessedProject[] = [];
    const allPrivateTasks: ProcessedTask[] = [];

    const projects = await ProjectService.getUserPrivateProjects(uid);
    for (const project of projects) {
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

      const tasks = await TaskService.getTasks(project.projectId);
      tasks.forEach((task) => {
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
      });
    }
    setPrivateProjects(allPrivateProjects);
    setPrivateTasks(allPrivateTasks);
  };

  const toggleTaskCompletion = async (
    taskId: string,
    currentStatus: boolean
  ) => {
    try {
      await TaskService.updateTask(taskId, { isDone: !currentStatus });

      // Update local state optimistically or re-fetch
      const updateList = (list: ProcessedTask[]) =>
        list.map((t) =>
          t.id === taskId ? { ...t, isDone: !currentStatus } : t
        );

      if (activeTab === "group") setGroupTasks((prev) => updateList(prev));
      else setPrivateTasks((prev) => updateList(prev));

      if (userId) {
        if (activeTab === "group") await fetchGroupData(userId, groups);
        else await fetchPrivateData(userId);
      }
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const onRefresh = () => {
    if (userId) {
      setRefreshing(true);
      fetchAllData(userId);
    }
  };

  // --- Handlers ---
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

  const handleSelectGroup = (group: Group) => {
    setModalVisible(false);
    router.push(`/(tabs)/group/${group.id}`);
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
            // Logic navigasi tetap sama
            if (activeTab === "group") {
              const project = groupProjects.find(
                (p) => p.id === task.projectId
              );
              if (project) {
                const group = groups.find((g) => g.name === project.groupName);
                if (group)
                  router.push({
                    pathname: "/(tabs)/group/[id]/projects/[projectId]",
                    params: { id: group.id, projectId: task.projectId },
                  });
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
          projects={currentProjects}
          onAddPress={() => setModalVisible(true)}
          onProjectPress={(project) => {
            // Logic navigasi tetap sama
            if (activeTab === "group") {
              const proj = groupProjects.find((p) => p.id === project.id);
              if (proj) {
                const group = groups.find((g) => g.name === proj.groupName);
                if (group)
                  router.push({
                    pathname: "/(tabs)/group/[id]/projects/[projectId]",
                    params: { id: group.id, projectId: project.id },
                  });
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

      {/* --- MODALS SECTION YANG SUDAH BERSIH --- */}

      <DynamicSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Select Group"
        data={groups}
        displayKey="name"
        onSelect={handleSelectGroup}
      />

      <MonthPickerModal
        visible={isMonthPickerVisible}
        onClose={() => setMonthPickerVisible(false)}
        onSelect={handleMonthSelect}
        currentMonthIndex={viewDate.getMonth()}
      />

      <YearPickerModal
        visible={isYearPickerVisible}
        onClose={() => setYearPickerVisible(false)}
        onSelect={handleYearSelect}
        currentYear={viewDate.getFullYear()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBEB" },
  contentContainer: { flex: 1, zIndex: 0 },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#78350f" },
});
