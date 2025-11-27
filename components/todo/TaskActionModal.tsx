import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TaskActionModalProps {
  visible: boolean;
  onClose: () => void;
  taskTitle?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
}

export default function TaskActionModal({
  visible,
  onClose,
  taskTitle = "Task",
  onEdit,
  onDelete,
  onComplete,
}: TaskActionModalProps) {
  const handleAction = (action: () => void | undefined) => {
    onClose();
    if (action) {
      action();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={50} tint="dark" style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {taskTitle}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {/* Selesai */}
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleAction(onComplete!)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={28} color="white" />
              </View>
              <Text style={styles.actionText}>Selesai</Text>
            </TouchableOpacity>

            {/* Edit */}
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => handleAction(onEdit!)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="pencil" size={28} color="white" />
              </View>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>

            {/* Hapus */}
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleAction(onDelete!)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="trash" size={28} color="white" />
              </View>
              <Text style={styles.actionText}>Hapus</Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Batal</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingRight: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  completeButton: {
    backgroundColor: "#22c55e",
  },
  editButton: {
    backgroundColor: "#3b82f6",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  iconContainer: {
    marginBottom: 8,
  },
  actionText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 15,
  },
});
