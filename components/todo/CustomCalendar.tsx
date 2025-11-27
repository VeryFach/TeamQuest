import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface CustomCalendarProps {
  visible: boolean;
  viewDate: Date;
  selectedDate: Date;
  onChangeMonth: (increment: number) => void;
  onSelectDate: (date: Date) => void;
  // Menambahkan props baru untuk handle klik pada bulan & tahun
  onPressMonth?: () => void;
  onPressYear?: () => void;
}

export default function CustomCalendar({
  visible,
  viewDate,
  selectedDate,
  onChangeMonth,
  onSelectDate,
  onPressMonth, // Destructure props baru
  onPressYear, // Destructure props baru
}: CustomCalendarProps) {
  if (!visible) return null;

  const renderCalendarGrid = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = [];

    // 1. Render Empty Slots
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // 2. Render Days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;

      grid.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[styles.calendarDay, isSelected && styles.calendarDaySelected]}
          onPress={() => onSelectDate(new Date(year, month, day))}
        >
          <Text
            style={[
              styles.calendarDayText,
              isSelected && styles.calendarDayTextSelected,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    // 3. Render Next Month Days (Faded)
    const totalSlotsSoFar = firstDayOfMonth + daysInMonth;
    const remainingSlots = 7 - (totalSlotsSoFar % 7);

    if (remainingSlots < 7) {
      for (let nextDay = 1; nextDay <= remainingSlots; nextDay++) {
        grid.push(
          <View key={`next-${nextDay}`} style={styles.calendarDay}>
            <Text style={styles.calendarDayTextNextMonth}>{nextDay}</Text>
          </View>
        );
      }
    }

    return grid;
  };

  return (
    <LinearGradient
      colors={["#E09F7D", "#CD855F"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.calendarContainer}
    >
      <View style={styles.calendarHeader}>
        {/* Tombol Navigasi Kiri */}
        <TouchableOpacity
          onPress={() => onChangeMonth(-1)}
          style={styles.navArrow}
        >
          <Ionicons name="chevron-back" size={20} color="#3E2723" />
        </TouchableOpacity>

        <View style={styles.selectorsContainer}>
          {/* Tombol BULAN: Sekarang menggunakan TouchableOpacity */}
          <TouchableOpacity
            style={styles.selectorBox}
            onPress={onPressMonth}
            activeOpacity={0.7}
          >
            <Text style={styles.selectorText}>
              {monthNames[viewDate.getMonth()].substring(0, 3)}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#3E2723" />
          </TouchableOpacity>

          {/* Tombol TAHUN: Sekarang menggunakan TouchableOpacity */}
          <TouchableOpacity
            style={styles.selectorBox}
            onPress={onPressYear}
            activeOpacity={0.7}
          >
            <Text style={styles.selectorText}>{viewDate.getFullYear()}</Text>
            <Ionicons name="chevron-down" size={16} color="#3E2723" />
          </TouchableOpacity>
        </View>

        {/* Tombol Navigasi Kanan */}
        <TouchableOpacity
          onPress={() => onChangeMonth(1)}
          style={styles.navArrow}
        >
          <Ionicons name="chevron-forward" size={20} color="#3E2723" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <Text key={day} style={styles.weekText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>{renderCalendarGrid()}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    marginTop: 15,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navArrow: {
    padding: 5,
  },
  selectorsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  selectorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorText: {
    fontWeight: "600",
    color: "#3E2723",
    fontSize: 15,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  weekText: {
    color: "#3E2723",
    fontWeight: "600",
    width: "14.28%",
    textAlign: "center",
    fontSize: 14,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  calendarDaySelected: {
    backgroundColor: "#F4A261",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  calendarDayText: {
    color: "#3E2723",
    fontWeight: "500",
    fontSize: 15,
  },
  calendarDayTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  calendarDayTextNextMonth: {
    color: "rgba(62, 39, 35, 0.3)",
    fontWeight: "400",
    fontSize: 15,
  },
});
