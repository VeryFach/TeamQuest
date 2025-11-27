import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { CHART_CONFIG, COLORS } from "./constants";

interface PieDataItem {
  name: string;
  population: number;
  color: string;
}

interface GoalsChartProps {
  pieData: PieDataItem[];
  total: number;
}

export const GoalsChart: React.FC<GoalsChartProps> = ({ pieData, total }) => (
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

const styles = StyleSheet.create({
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
});
