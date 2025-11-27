import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
const screenWidth = Dimensions.get("window").width;

// --- 1. KONFIGURASI & KONSTANTA ---
const COLORS = {
  background: "#FFFBF5",
  primary: "#FF8C66",
  primaryLight: "#FFF0EB",
  secondary: "#FFDAB9",
  textDark: "#2D3436",
  textLight: "#8D99AE",
  white: "#FFFFFF",
  charts: ["#FF6B6B", "#4ECDC4", "#FFE66D"],
  gray: "#F0F0F0",
  danger: "#FF4757", // Warna untuk tombol logout/auth
};

const FILTER_TYPES = ["Week", "Month", "Year"];

const CHART_CONFIG = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  color: (opacity = 1) => `rgba(255, 140, 102, ${opacity})`,
  labelColor: (opacity = 1) => COLORS.textLight,
  strokeWidth: 3,
  decimalPlaces: 0,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#fff",
  },
  propsForBackgroundLines: {
    strokeDasharray: "",
    stroke: "#F3F3F3",
  },
};

// --- 2. SUB-COMPONENTS (KOMPONEN TERPISAH) ---

const Header = () => (
  <View style={styles.header}>
    <View style={styles.userInfo}>
      <Image
        source={{ uri: "https://i.pravatar.cc/150?img=12" }}
        style={styles.avatar}
      />
      <View>
        <Text style={styles.greetingText}>Welcome back,</Text>
        <Text style={styles.userName}>Raka</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.iconContainer}>
      <Ionicons
        name="notifications-outline"
        size={24}
        color={COLORS.textDark}
      />
      <View style={styles.badge} />
    </TouchableOpacity>
  </View>
);

const FilterSection = ({ currentFilter, setFilter }) => (
  <View style={styles.filterContainer}>
    <View style={styles.segmentControl}>
      {FILTER_TYPES.map((type) => (
        <TouchableOpacity
          key={type}
          onPress={() => setFilter(type)}
          style={[
            styles.segmentButton,
            currentFilter === type && styles.segmentButtonActive,
          ]}
        >
          <Text
            style={[
              styles.segmentText,
              currentFilter === type && styles.segmentTextActive,
            ]}
          >
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const DateNavigator = ({ title, onPrev, onNext }) => (
  <View style={styles.dateNavContainer}>
    <TouchableOpacity onPress={onPrev} style={styles.navBtn}>
      <Ionicons name="chevron-back" size={20} color={COLORS.textDark} />
    </TouchableOpacity>
    <Text style={styles.dateNavTitle}>{title}</Text>
    <TouchableOpacity onPress={onNext} style={styles.navBtn}>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textDark} />
    </TouchableOpacity>
  </View>
);

const StatsOverview = ({ completed, pending }) => (
  <View style={styles.statsContainer}>
    {/* Card Completed */}
    <LinearGradient
      colors={[COLORS.primary, "#FF9F7C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCard}
    >
      <View style={styles.statIconBg}>
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={24}
          color={COLORS.primary}
        />
      </View>
      <View>
        <Text style={styles.statNumber}>{completed}</Text>
        <Text style={styles.statLabel}>Completed</Text>
      </View>
    </LinearGradient>

    {/* Card Pending */}
    <View style={[styles.statCard, styles.statCardWhite]}>
      <View
        style={[styles.statIconBg, { backgroundColor: COLORS.primaryLight }]}
      >
        <MaterialCommunityIcons
          name="timer-sand"
          size={24}
          color={COLORS.primary}
        />
      </View>
      <View>
        <Text style={[styles.statNumber, { color: COLORS.textDark }]}>
          {pending}
        </Text>
        <Text style={[styles.statLabel, { color: COLORS.textLight }]}>
          Pending
        </Text>
      </View>
    </View>
  </View>
);

const ProductivityChart = ({ data, labels }) => (
  <View style={styles.chartCard}>
    <View style={styles.cardHeaderRow}>
      <Text style={styles.cardTitle}>Productivity Trend</Text>
    </View>
    <LineChart
      data={{
        labels: labels,
        datasets: [{ data: data }],
      }}
      width={screenWidth}
      height={220}
      yAxisLabel=""
      yAxisSuffix=""
      chartConfig={CHART_CONFIG}
      bezier
      withDots={true}
      withShadow={true}
      withInnerLines={false}
      withOuterLines={false}
      style={styles.chart}
    />
  </View>
);

const GoalsChart = ({ pieData, total }) => (
  <View style={styles.chartCard}>
    <View style={styles.cardHeaderRow}>
      <Text style={styles.cardTitle}>Goals Achieved</Text>
      <MaterialCommunityIcons
        name="dots-horizontal"
        size={24}
        color="#B0B0B0"
      />
    </View>

    <View style={styles.donutContainer}>
      <View style={styles.chartWrapper}>
        <PieChart
          data={pieData}
          width={180}
          height={180}
          chartConfig={CHART_CONFIG}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"45"}
          center={[0, 0]}
          absolute={false}
          hasLegend={false}
        />
        <View style={styles.donutCenterText}>
          <Text style={styles.donutNumber}>{total}</Text>
          <Text style={styles.donutLabel}>Total</Text>
        </View>
      </View>

      {/* Manual Legend */}
      <View style={styles.legendContainer}>
        {pieData.map((item, index) => (
          <View key={index} style={styles.legendRow}>
            <View style={styles.legendLeft}>
              <View
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.name}</Text>
            </View>
            <Text style={styles.legendValue}>{item.population}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

// --- KOMPONEN BARU: TOMBOL AUTH ---
const AuthButton = ({ onPress }) => (
  <TouchableOpacity style={styles.authButton} onPress={onPress}>
    <MaterialCommunityIcons name="logout" size={20} color={COLORS.danger} />
    <Text style={styles.authButtonText}>Log Out / Go to Login</Text>
  </TouchableOpacity>
);

// --- 3. MAIN COMPONENT ---
export default function App() {
  const router = useRouter();

  const [filterType, setFilterType] = useState("Week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- LOGIKA DATA DINAMIS ---
  const dashboardData = useMemo(() => {
    if (filterType === "Week") {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay() || 7;
      if (day !== 1) startOfWeek.setHours(-24 * (day - 1));

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const options = { day: "numeric", month: "short" };
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

  const handleNavigation = (direction) => {
    const newDate = new Date(currentDate);
    if (filterType === "Week")
      newDate.setDate(newDate.getDate() + direction * 7);
    else if (filterType === "Month")
      newDate.setMonth(newDate.getMonth() + direction);
    else if (filterType === "Year")
      newDate.setFullYear(newDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const handleAuthAction = () => {
    // Navigasi ke halaman Login disini
    console.log("Navigating to Login Screen...");
    alert("Navigating to Auth/Login");
    router.push("/auth/login");
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

        {/* --- TOMBOL AUTH DI BAWAH --- */}
        <AuthButton onPress={handleAuthAction} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 50,
  },
  // --- Header ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  greetingText: { fontSize: 13, color: COLORS.textLight, marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: "bold", color: COLORS.textDark },
  iconContainer: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  // --- Filter ---
  filterContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  segmentControl: {
    flexDirection: "row",
    backgroundColor: "#EFEFEF",
    borderRadius: 12,
    padding: 4,
    width: "100%",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  segmentTextActive: {
    color: COLORS.textDark,
    fontWeight: "700",
  },

  // --- Date Navigator ---
  dateNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dateNavTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  navBtn: {
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },

  // --- Stats Cards ---
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    gap: 15,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    flexDirection: "column",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    height: 140,
  },
  statCardWhite: {
    backgroundColor: COLORS.white,
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statNumber: { fontSize: 28, fontWeight: "bold", color: COLORS.white },
  statLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },

  // --- Charts Common ---
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    overflow: "hidden",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  chart: {
    borderRadius: 16,
    alignSelf: "center",
  },

  // --- Donut Chart ---
  donutContainer: { alignItems: "center" },
  chartWrapper: {
    position: "relative",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  donutCenterText: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: "42%",
    left: "25%",
  },
  donutNumber: { fontSize: 26, fontWeight: "bold", color: COLORS.textDark },
  donutLabel: { fontSize: 12, color: COLORS.textLight },
  legendContainer: { width: "100%", paddingHorizontal: 10 },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  legendLeft: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  legendText: { fontSize: 14, color: COLORS.textDark, fontWeight: "500" },
  legendValue: { fontSize: 14, color: COLORS.textDark, fontWeight: "bold" },

  // --- NEW AUTH BUTTON STYLES ---
  authButton: {
    flexDirection: "row",
    backgroundColor: "#FFE5E7", // Light Red Background
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FFD1D6",
  },
  authButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});
