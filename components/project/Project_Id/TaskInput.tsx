import { Member } from "@/app/(tabs)/group/[id]/projects/[projectId]";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TaskInputProps {
  onSave: (taskName: string, assignedTo: string) => void;
  members: Member[];
}

export default function TaskInput({ onSave, members }: TaskInputProps) {
  const [taskName, setTaskName] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSave = () => {
    if (taskName.trim()) {
      onSave(taskName.trim(), selectedMember?.id || "");
      setTaskName("");
      setSelectedMember(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Tambah task baru..."
          placeholderTextColor="#999"
          value={taskName}
          onChangeText={setTaskName}
        />

        {/* Member Dropdown Button */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDropdown(true)}
        >
          <Ionicons name="person" size={20} color="#8B4513" />
          <Text style={styles.dropdownButtonText} numberOfLines={1}>
            {selectedMember ? selectedMember.name : "Assign"}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#8B4513" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Member Selection Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Member</Text>
            <ScrollView style={styles.memberList}>
              {/* Option untuk tidak assign */}
              <TouchableOpacity
                style={[
                  styles.memberItem,
                  !selectedMember && styles.memberItemSelected,
                ]}
                onPress={() => {
                  setSelectedMember(null);
                  setShowDropdown(false);
                }}
              >
                <Ionicons name="person-outline" size={20} color="#666" />
                <Text style={styles.memberName}>Tidak di-assign</Text>
              </TouchableOpacity>

              {members.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberItem,
                    selectedMember?.id === member.id &&
                      styles.memberItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedMember(member);
                    setShowDropdown(false);
                  }}
                >
                  <Ionicons name="person" size={20} color="#8B4513" />
                  <Text style={styles.memberName}>{member.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4e4c1",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    maxWidth: 120,
    gap: 4,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "#8B4513",
    maxWidth: 60,
  },
  saveButton: {
    backgroundColor: "#8B4513",
    borderRadius: 8,
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 12,
    textAlign: "center",
  },
  memberList: {
    maxHeight: 300,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  memberItemSelected: {
    backgroundColor: "#f4e4c1",
  },
  memberName: {
    fontSize: 16,
    color: "#333",
  },
});
