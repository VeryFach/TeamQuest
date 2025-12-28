import { useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  AuthButton,
  COLORS,
  DateNavigator,
  FilterSection,
  GoalsChart,
  Header,
  ProductivityChart,
  StatsOverview,
} from "@/components/account";
import { auth } from "@/firebaseConfig";
import { signOutUser } from "@/services/auth.service";
import { Project, ProjectService } from "@/services/project.service";
import { Task, TaskService } from "@/services/task.service";
import { onAuthStateChanged } from "firebase/auth";
import { Unsubscribe } from "firebase/firestore";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper: Get Monday of the week for a given date
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Helper: Get Sunday of the week for a given date
function getSunday(d: Date): Date {
  const monday = getMonday(d);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return sunday;
}

// Helper: Format date to DD-EEE
function formatDateKey(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  return `${day}-${weekday}`;
}

// Helper: Parse task date
function getTaskDate(task: Task): Date {
  return task.createdAt.seconds
    ? new Date(task.createdAt.seconds * 1000)
    : new Date(task.createdAt);
}

// Helper: Parse project date
function getProjectDate(project: Project): Date {
  return new Date(project.createdAt);
}

// --- MAIN COMPONENT ---
export default function AccountScreen() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [dashboardTasks, setDashboardTasks] = useState<Task[]>([]);
  const [dashboardProjects, setDashboardProjects] = useState<Project[]>([]);
  const [prodStructure, setProdStructure] = useState<
    Record<string, any> | undefined
  >();

  // Refs untuk menyimpan unsubscribe functions
  const unsubscribeRefs = useRef<Unsubscribe[]>([]);

  // Cleanup function
  const cleanupSubscriptions = useCallback(() => {
    unsubscribeRefs.current.forEach((unsub) => unsub());
    unsubscribeRefs.current = [];
  }, []);

  // Setup realtime listeners
  const setupRealtimeListeners = useCallback(
    (uid: string) => {
      cleanupSubscriptions();

      // Subscribe ke user tasks
      const taskUnsub = TaskService.subscribeToUserTasks(uid, (userTasks) => {
        setDashboardTasks(userTasks);
        const prodStruct = getFullProductivityStructure(userTasks);
        setProdStructure(prodStruct);
        setLoading(false);
      });
      unsubscribeRefs.current.push(taskUnsub);

      // Fetch projects (untuk pie chart) - bisa juga di-subscribe jika perlu realtime
      const fetchProjects = async () => {
        try {
          const userProjects = await ProjectService.getUserProjects(uid);
          setDashboardProjects(userProjects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
      fetchProjects();

      // Subscribe ke private projects untuk update pie chart
      const projectUnsub = ProjectService.subscribeToUserPrivateProjects(
        uid,
        async () => {
          // Refetch all projects when private projects change
          const userProjects = await ProjectService.getUserProjects(uid);
          setDashboardProjects(userProjects);
        }
      );
      unsubscribeRefs.current.push(projectUnsub);
    },
    [cleanupSubscriptions]
  );

  // 1. Cek Login & Setup Realtime Listeners
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setLoading(true);
        setupRealtimeListeners(user.uid);
      } else {
        cleanupSubscriptions();
        router.replace("/auth/login");
      }
    });

    return () => {
      unsubscribe();
      cleanupSubscriptions();
    };
  }, [setupRealtimeListeners, cleanupSubscriptions]);

  function getFullProductivityStructure(tasks: Task[]) {
    const doneTasks = tasks.filter((t) => t.isDone);
    if (doneTasks.length === 0) return {};

    const result: Record<string, Record<string, Record<string, number>>> = {};

    doneTasks.forEach((t) => {
      const rawDate = getTaskDate(t);
      const year = rawDate.getFullYear().toString();
      const month = rawDate.toLocaleDateString("en-US", { month: "short" });
      const dateKey = formatDateKey(rawDate);

      if (!result[year]) result[year] = {};
      if (!result[year][month]) result[year][month] = {};
      if (!result[year][month][dateKey]) result[year][month][dateKey] = 0;

      result[year][month][dateKey] += 1;
    });

    return result;
  }

  function getWeeklyProductivity(tasks: Task[], selectedDate: Date) {
    const doneTasks = tasks.filter((t) => t.isDone);
    const monday = getMonday(selectedDate);
    const sunday = getSunday(selectedDate);

    // Filter tasks within the selected week
    const weekTasks = doneTasks.filter((t) => {
      const taskDate = getTaskDate(t);
      return taskDate >= monday && taskDate <= sunday;
    });

    // Build all 7 days of the week
    const labels: string[] = [];
    const data: number[] = [];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const dayName = dayDate.toLocaleDateString("en-US", { weekday: "short" });

      labels.push(dayName);
      data.push(
        weekTasks.filter((t) => {
          const td = getTaskDate(t);
          return td.toDateString() === dayDate.toDateString();
        }).length
      );
    }

    // Format label title: "Nov 30 - Dec 6, 2025"
    const startMonth = monday.toLocaleDateString("en-US", { month: "short" });
    const endMonth = sunday.toLocaleDateString("en-US", { month: "short" });
    const startDay = monday.getDate();
    const endDay = sunday.getDate();
    const year = sunday.getFullYear();

    const labelTitle =
      startMonth === endMonth
        ? `${startMonth} ${startDay} - ${endDay}, ${year}`
        : `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;

    return { labels, data, labelTitle };
  }

  function getMonthlyProductivity(tasks: Task[], selectedDate: Date) {
    const doneTasks = tasks.filter((t) => t.isDone);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // Get first and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    // Filter tasks within the selected month
    const monthTasks = doneTasks.filter((t) => {
      const taskDate = getTaskDate(t);
      return taskDate.getFullYear() === year && taskDate.getMonth() === month;
    });

    // Create 5 evenly spaced points
    const pointDays = [
      1,
      Math.ceil(totalDays * 0.25),
      Math.ceil(totalDays * 0.5),
      Math.ceil(totalDays * 0.75),
      totalDays,
    ];
    const uniquePointDays = [...new Set(pointDays)].sort((a, b) => a - b);

    const labels: string[] = [];
    const data: number[] = [];

    uniquePointDays.forEach((day, index) => {
      const prevDay = index === 0 ? 1 : uniquePointDays[index - 1] + 1;
      const currentDay = day;

      // Label format: MM/DD
      labels.push(`${month + 1}/${day}`);

      // Count tasks from prevDay to currentDay (inclusive)
      const count = monthTasks.filter((t) => {
        const td = getTaskDate(t);
        const taskDay = td.getDate();
        return taskDay >= prevDay && taskDay <= currentDay;
      }).length;

      data.push(count);
    });

    // Label title: "Nov 2025"
    const monthName = selectedDate.toLocaleDateString("en-US", {
      month: "short",
    });
    const labelTitle = `${monthName} ${year}`;

    return { labels, data, labelTitle };
  }

  function getYearlyProductivity(tasks: Task[], selectedDate: Date) {
    const doneTasks = tasks.filter((t) => t.isDone);
    const currentYear = new Date().getFullYear();
    let year = selectedDate.getFullYear();

    // Year cannot exceed current year
    if (year > currentYear) {
      year = currentYear;
    }

    // Filter tasks for the selected year only
    const yearTasks = doneTasks.filter((t) => {
      const taskDate = getTaskDate(t);
      return taskDate.getFullYear() === year;
    });

    const labels = MONTHS;
    const data = MONTHS.map((_, monthIndex) => {
      return yearTasks.filter((t) => {
        const td = getTaskDate(t);
        return td.getMonth() === monthIndex;
      }).length;
    });

    const labelTitle = year.toString();

    return { labels, data, labelTitle };
  }

  // --- LOGIKA DATA DINAMIS ---
  const dashboardData = useMemo(() => {
    let filteredTasks: Task[] = [];

    if (filterType === "Week") {
      const monday = getMonday(currentDate);
      const sunday = getSunday(currentDate);
      filteredTasks = dashboardTasks.filter((t) => {
        const taskDate = getTaskDate(t);
        return taskDate >= monday && taskDate <= sunday;
      });
      const { labels, data, labelTitle } = getWeeklyProductivity(
        dashboardTasks,
        currentDate
      );
      const completed = filteredTasks.filter((t) => t.isDone).length;
      const pending = filteredTasks.filter((t) => !t.isDone).length;
      return { labels, data, completed, pending, labelTitle };
    } else if (filterType === "Month") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      filteredTasks = dashboardTasks.filter((t) => {
        const taskDate = getTaskDate(t);
        return taskDate.getFullYear() === year && taskDate.getMonth() === month;
      });
      const { labels, data, labelTitle } = getMonthlyProductivity(
        dashboardTasks,
        currentDate
      );
      const completed = filteredTasks.filter((t) => t.isDone).length;
      const pending = filteredTasks.filter((t) => !t.isDone).length;
      return { labels, data, completed, pending, labelTitle };
    } else {
      const currentYear = new Date().getFullYear();
      let year = currentDate.getFullYear();
      if (year > currentYear) year = currentYear;
      filteredTasks = dashboardTasks.filter((t) => {
        const taskDate = getTaskDate(t);
        return taskDate.getFullYear() === year;
      });
      const { labels, data, labelTitle } = getYearlyProductivity(
        dashboardTasks,
        currentDate
      );
      const completed = filteredTasks.filter((t) => t.isDone).length;
      const pending = filteredTasks.filter((t) => !t.isDone).length;
      return { labels, data, completed, pending, labelTitle };
    }
  }, [dashboardTasks, filterType, currentDate]);

  // --- COMPLETED PROJECTS DATA ---
  const completedProjectsData = useMemo(() => {
    // Filter only completed projects
    const doneProjects = dashboardProjects.filter((p) => p.isDone);

    let filteredProjects: Project[] = [];

    if (filterType === "Week") {
      const monday = getMonday(currentDate);
      const sunday = getSunday(currentDate);
      filteredProjects = doneProjects.filter((p) => {
        const projectDate = getProjectDate(p);
        return projectDate >= monday && projectDate <= sunday;
      });
    } else if (filterType === "Month") {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      filteredProjects = doneProjects.filter((p) => {
        const projectDate = getProjectDate(p);
        return (
          projectDate.getFullYear() === year && projectDate.getMonth() === month
        );
      });
    } else {
      const currentYear = new Date().getFullYear();
      let year = currentDate.getFullYear();
      if (year > currentYear) year = currentYear;
      filteredProjects = doneProjects.filter((p) => {
        const projectDate = getProjectDate(p);
        return projectDate.getFullYear() === year;
      });
    }

    // Generate colors for pie chart
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFE66D",
      "#95E1D3",
      "#F38181",
      "#AA96DA",
      "#FCBAD3",
      "#A8D8EA",
      "#FF9A8B",
      "#88D8B0",
    ];

    const pieData = filteredProjects.map((project, index) => ({
      name: project.name,
      population: 1, // Each project counts as 1
      color: colors[index % colors.length],
      projectId: project.projectId,
    }));

    const total = filteredProjects.length;

    return { pieData, total };
  }, [dashboardProjects, filterType, currentDate]);

  const handleNavigation = (direction: number) => {
    const newDate = new Date(currentDate);
    const today = new Date();

    if (filterType === "Week") {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else if (filterType === "Month") {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (filterType === "Year") {
      const newYear = newDate.getFullYear() + direction;
      // Prevent navigating beyond current year
      if (newYear > today.getFullYear()) return;
      newDate.setFullYear(newYear);
    }

    setCurrentDate(newDate);
  };

  const handleAuthAction = async () => {
    setLoading(true);
    try {
      const { success, message } = await signOutUser();
      console.log(success);
      if (!success) {
        Alert.alert("Log Out Failed", message);
        return;
      }
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Log Out Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Donut Data
  const pieData = [
    { name: "Pizza Party", population: 8, color: "#FF6B6B" },
    { name: "Gaming Night", population: 12, color: "#4ECDC4" },
    { name: "Movie Night", population: 5, color: "#FFE66D" },
  ];
  const totalGoals = pieData.reduce((acc, curr) => acc + curr.population, 0);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#C8733B" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />

        <FilterSection currentFilter={filterType} setFilter={setFilterType} />

        <DateNavigator
          title={dashboardData.labelTitle}
          onPrev={() => handleNavigation(-1)}
          onNext={() => handleNavigation(1)}
        />

        <StatsOverview
          completed={dashboardData.completed}
          pending={dashboardData.pending}
        />
        {dashboardData.labels.length === 0 ? (
          <View style={{ alignItems: "center", marginVertical: 16 }}>
            <Text style={{ color: "#C8733B", fontStyle: "italic" }}>
              {`You Haven't Completed Any Tasks This ${
                filterType === "Week"
                  ? "Week"
                  : filterType === "Month"
                  ? "Month"
                  : "Year"
              }`}
            </Text>
          </View>
        ) : (
          <ProductivityChart
            data={dashboardData.data.map((v) =>
              typeof v === "number" && isFinite(v) ? v : 0
            )}
            labels={dashboardData.labels}
          />
        )}

        <GoalsChart
          pieData={completedProjectsData.pieData}
          total={completedProjectsData.total}
        />

        <AuthButton onPress={handleAuthAction} loading={loading} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
});
