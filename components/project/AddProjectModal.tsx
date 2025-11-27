// components/project/AddProjectModal.tsx
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  projectName: string;
  setProjectName: (v: string) => void;
  projectReward: string;
  setProjectReward: (v: string) => void;
  iconReward: string;
  setIconReward: (v: string) => void;
  tasks: { name: string; assignee: string }[];
  setTasks: (tasks: { name: string; assignee: string }[]) => void;
}

const ASSIGNEE_OPTIONS = ["Raka", "Very", "Farras"];

export default function AddProjectModal({
  visible,
  onClose,
  onSubmit,
  projectName,
  setProjectName,
  projectReward,
  setProjectReward,
  iconReward,
  setIconReward,
  tasks,
  setTasks,
}: Props) {
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);

  const addTask = () => {
    setTasks([...tasks, { name: "", assignee: "Raka" }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTaskName = (index: number, text: string) => {
    const newTasks = [...tasks];
    newTasks[index].name = text;
    setTasks(newTasks);
  };

  const updateTaskAssignee = (index: number, assignee: string) => {
    const newTasks = [...tasks];
    newTasks[index].assignee = assignee;
    setTasks(newTasks);
    setDropdownVisible(null);
  };

  const toggleDropdown = (index: number) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const getShortName = (name: string) => {
    return name.charAt(0).toUpperCase() + "...";
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>ADD PROJECT</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={28} color="#C8733B" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Project Name */}
            <Text style={styles.label}>Project Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a project name"
              placeholderTextColor="#999"
              value={projectName}
              onChangeText={setProjectName}
            />

            {/* Rewards Row */}
            <View style={styles.rewardsRow}>
              <View style={styles.rewardColumn}>
                <Text style={styles.label}>Project Reward</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter a project name"
                  placeholderTextColor="#999"
                  value={projectReward}
                  onChangeText={setProjectReward}
                />
              </View>

              <View style={styles.rewardColumn}>
                <Text style={styles.label}>Icon Reward</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Icon only"
                  placeholderTextColor="#999"
                  value={iconReward}
                  onChangeText={setIconReward}
                />
              </View>
            </View>

            {/* Task Header */}
            <View style={styles.taskHeader}>
              <Text style={[styles.label, styles.taskHeaderLabel]}>Task</Text>
              <Text style={[styles.label, styles.appointHeaderLabel]}>
                Appoint to
              </Text>
            </View>

            {/* Task List */}
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskRow}>
                <View style={styles.taskInputContainer}>
                  <TextInput
                    style={styles.taskInput}
                    placeholder="Enter a task name"
                    placeholderTextColor="#999"
                    value={task.name}
                    onChangeText={(text) => updateTaskName(index, text)}
                  />
                  {task.name !== "" && (
                    <TouchableOpacity
                      style={styles.editIcon}
                      onPress={() => {}}
                    >
                      <Ionicons name="pencil" size={16} color="#666" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.assigneeContainer}>
                  <TouchableOpacity
                    style={styles.assigneeButton}
                    onPress={() => toggleDropdown(index)}
                  >
                    <Text style={styles.assigneeText} numberOfLines={1}>
                      {getShortName(task.assignee)}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#666" />
                  </TouchableOpacity>

                  {/* Dropdown */}
                  {dropdownVisible === index && (
                    <View style={styles.dropdown}>
                      {ASSIGNEE_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={[
                            styles.dropdownItem,
                            task.assignee === option &&
                              styles.dropdownItemActive,
                          ]}
                          onPress={() => updateTaskAssignee(index, option)}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              task.assignee === option &&
                                styles.dropdownItemTextActive,
                            ]}
                          >
                            {option}
                          </Text>
                          {task.assignee === option && (
                            <Ionicons
                              name="checkmark"
                              size={18}
                              color="#C8733B"
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {index === 0 ? (
                  <TouchableOpacity
                    style={styles.addTaskButton}
                    onPress={addTask}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.removeTaskButton}
                    onPress={() => removeTask(index)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={20} color="#C8733B" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {/* Spacer for submit button */}
            <View style={{ height: 80 }} />
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={onSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Create Project</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    backdropFilter: "blur(10px)",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    fontSize: 14,
    color: "#333",
  },
  rewardsRow: {
    flexDirection: "row",
    gap: 12,
  },
  rewardColumn: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: "row",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  taskHeaderLabel: {
    flex: 1,
    marginBottom: 0,
  },
  appointHeaderLabel: {
    width: 90,
    marginBottom: 0,
    textAlign: "center",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  taskInputContainer: {
    flex: 1,
    position: "relative",
  },
  taskInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    paddingRight: 40,
    fontSize: 14,
    color: "#333",
  },
  editIcon: {
    position: "absolute",
    right: 12,
    top: 14,
    padding: 4,
  },
  assigneeContainer: {
    position: "relative",
    width: 90,
  },
  assigneeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    width: "100%",
    gap: 4,
  },
  assigneeText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemActive: {
    backgroundColor: "#fff5f0",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#333",
  },
  dropdownItemTextActive: {
    color: "#C8733B",
    fontWeight: "600",
  },
  addTaskButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  removeTaskButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#C8733B",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
