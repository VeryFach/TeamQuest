import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { CHART_CONFIG, COLORS, screenWidth } from "./constants";

interface ProductivityChartProps {
  data: number[];
  labels: string[];
}

export const ProductivityChart: React.FC<ProductivityChartProps> = ({
  data,
  labels,
}) => (
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
  chart: {
    borderRadius: 16,
    alignSelf: "center",
  },
});
