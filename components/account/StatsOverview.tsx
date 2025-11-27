import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "./constants";

interface StatsOverviewProps {
  completed: number;
  pending: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  completed,
  pending,
}) => (
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

const styles = StyleSheet.create({
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
});
