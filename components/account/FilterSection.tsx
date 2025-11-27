import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, FILTER_TYPES } from "./constants";

interface FilterSectionProps {
  currentFilter: string;
  setFilter: (filter: string) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  currentFilter,
  setFilter,
}) => (
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

const styles = StyleSheet.create({
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
});
