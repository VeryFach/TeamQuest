import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StatusBar, StyleSheet, View } from "react-native";

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
import { signOutUser } from "@/services/auth.service";

// --- MAIN COMPONENT ---
export default function AccountScreen() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // --- LOGIKA DATA DINAMIS ---
  const dashboardData = useMemo(() => {
    if (filterType === "Week") {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay() || 7;
      if (day !== 1) startOfWeek.setHours(-24 * (day - 1));

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
      };
      const label = `${startOfWeek.toLocaleDateString(
        "en-US",
        options
      )} - ${endOfWeek.toLocaleDateString("en-US", options)}`;

      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [1, 3, 2, 6, 4, 8, 5],
        completed: 29,
        pending: 4,
        labelTitle: label,
      };
    } else if (filterType === "Month") {
      return {
        labels: ["W1", "W2", "W3", "W4"],
        data: [15, 25, 20, 35],
        completed: 95,
        pending: 12,
        labelTitle: currentDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
      };
    } else {
      return {
        labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
        data: [40, 55, 60, 45, 80, 95],
        completed: 375,
        pending: 24,
        labelTitle: currentDate.getFullYear().toString(),
      };
    }
  }, [filterType, currentDate]);

  const handleNavigation = (direction: number) => {
    const newDate = new Date(currentDate);
    if (filterType === "Week")
      newDate.setDate(newDate.getDate() + direction * 7);
    else if (filterType === "Month")
      newDate.setMonth(newDate.getMonth() + direction);
    else if (filterType === "Year")
      newDate.setFullYear(newDate.getFullYear() + direction);
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

        <ProductivityChart
          data={dashboardData.data}
          labels={dashboardData.labels}
        />

        <GoalsChart pieData={pieData} total={totalGoals} />

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
    paddingBottom: 50,
  },
});
