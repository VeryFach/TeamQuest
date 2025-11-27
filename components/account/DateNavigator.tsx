import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "./constants";

interface DateNavigatorProps {
  title: string;
  onPrev: () => void;
  onNext: () => void;
}

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  title,
  onPrev,
  onNext,
}) => (
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

const styles = StyleSheet.create({
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
});
