import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Circle, G, Rect, Text as SvgText } from "react-native-svg";
import { CHART_CONFIG, COLORS, screenWidth } from "./constants";

interface ProductivityChartProps {
  data: number[];
  labels: string[];
}

const MONTH_MAP: Record<string, string> = {
  Jan: "1",
  Feb: "2",
  Mar: "3",
  Apr: "4",
  May: "5",
  Jun: "6",
  Jul: "7",
  Aug: "8",
  Sep: "9",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

export const ProductivityChart: React.FC<ProductivityChartProps> = ({
  data,
  labels,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Convert month names to numbers if applicable
  const processedLabels = labels.map((label) => MONTH_MAP[label] || label);

  // Fixed chart width based on screen
  const chartWidth = screenWidth - 28;

  // Calculate max value +1 so top points don't get cropped, and segment count (max 5)
  const maxValue = Math.max(...data, 1) + 1;
  const segmentCount = Math.min(5, maxValue);

  // Add a fake point to force Y-axis max
  const adjustedData = {
    labels: processedLabels,
    datasets: [
      { data: data },
      {
        data: [maxValue],
        withDots: false,
        strokeWidth: 0,
        color: () => "transparent",
      },
    ],
  };

  return (
    <View style={styles.chartCard}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Productivity Trend</Text>
      </View>
      <View style={styles.chartContainer}>
        <LineChart
          data={adjustedData}
          width={chartWidth}
          height={220}
          fromZero
          bezier
          withDots={true}
          withInnerLines={false}
          withOuterLines={false}
          segments={segmentCount}
          chartConfig={{
            ...CHART_CONFIG,
            propsForLabels: {
              fontSize: labels.length > 7 ? 9 : 12,
            },
          }}
          style={styles.chart}
          renderDotContent={({ x, y, index, indexData }) => {
            if (index >= data.length) return null; // Skip fake dataset
            const isSelected = selectedIndex === index;
            return (
              <G key={`dot-content-${index}`}>
                {/* Larger invisible touch area */}
                <Circle
                  cx={x}
                  cy={y}
                  r={20}
                  fill="transparent"
                  onPress={() => {
                    setSelectedIndex(isSelected ? null : index);
                  }}
                />
                {/* Tooltip */}
                {isSelected && (
                  <G>
                    <Rect
                      x={x - 20}
                      y={y - 35}
                      width={40}
                      height={24}
                      rx={6}
                      fill={COLORS.textDark}
                    />
                    <SvgText
                      x={x}
                      y={y - 18}
                      fill={COLORS.white}
                      fontSize={12}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {indexData}
                    </SvgText>
                  </G>
                )}
              </G>
            );
          }}
          getDotProps={(dataPoint, index) => ({
            r: selectedIndex === index ? 6 : 4,
            strokeWidth: selectedIndex === index ? 2 : 0,
            stroke: COLORS.white,
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 0,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    overflow: "hidden",
    paddingBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    padding: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textDark },
  chartContainer: {
    alignItems: "center",
    position: "relative",
    paddingRight: 20,
  },
  chart: {
    borderRadius: 16,
    marginHorizontal: 0,
  },
});
