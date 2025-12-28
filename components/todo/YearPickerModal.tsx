import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface YearPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (year: number) => void;
  currentYear: number;
}

// Generate Tahun (misal: dari 2020 sampai 2030)
const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

export default function YearPickerModal({
  visible,
  onClose,
  onSelect,
  currentYear,
}: YearPickerModalProps) {
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
          <Text style={styles.pickerHeader}>Select Year</Text>
          <FlatList
            data={years}
            keyExtractor={(item) => item.toString()}
            style={{ maxHeight: 300, width: "100%" }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.yearItem,
                  currentYear === item && styles.selectedItem,
                ]}
                onPress={() => onSelect(item)}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    currentYear === item && styles.selectedItemText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
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
  yearItem: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 5,
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
