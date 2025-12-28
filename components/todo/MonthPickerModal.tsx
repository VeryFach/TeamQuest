import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MonthPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (monthIndex: number) => void;
  currentMonthIndex: number;
}

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

export default function MonthPickerModal({
  visible,
  onClose,
  onSelect,
  currentMonthIndex,
}: MonthPickerModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerHeader}>Select Month</Text>
          <View style={styles.monthsGrid}>
            {monthNames.map((month, index) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthItem,
                  currentMonthIndex === index && styles.selectedItem,
                ]}
                onPress={() => onSelect(index)}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    currentMonthIndex === index && styles.selectedItemText,
                  ]}
                >
                  {month.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  pickerHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#78350f",
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  monthItem: {
    width: "30%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFF7ED",
  },
  selectedItem: {
    backgroundColor: "#F97316",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#431407",
  },
  selectedItemText: {
    color: "white",
    fontWeight: "bold",
  },
});
