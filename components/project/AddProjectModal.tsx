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
  ActivityIndicator,
} from "react-native";
import { User } from "@/services/user.service";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  members: User[]; // Members dari grup
  isLoading?: boolean;
}

export interface ProjectFormData {
  projectName: string;
  projectReward: string;
  iconReward: string;
  bgColor: string;
  tasks: { name: string; assigneeId: string }[];
}

const COLORS = [
  "#3A7D44", "#CC5500", "#5C3D7A", "#C8733B", "#5c3d2e",
  "#2196F3", "#E91E63", "#9C27B0", "#FF9800", "#607D8B"
];

export default function AddProjectModal({
  visible,
  onClose,
  onSubmit,
  members,
  isLoading = false,
}: Props) {
  const [projectName, setProjectName] = useState("");
  const [projectReward, setProjectReward] = useState("");
  const [iconReward, setIconReward] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [tasks, setTasks] = useState<{ name: string; assigneeId: string }[]>([
    { name: "", assigneeId: members[0]?.id || "" }
  ]);
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);

  const addTask = () => {
    setTasks([...tasks, { name: "", assigneeId: members[0]?.id || "" }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTaskName = (index: number, text: string) => {
    const newTasks = [...tasks];
    newTasks[index].name = text;
    setTasks(newTasks);
  };

  const updateTaskAssignee = (index: number, assigneeId: string) => {
    const newTasks = [...tasks];
    newTasks[index].assigneeId = assigneeId;
    setTasks(newTasks);
    setDropdownVisible(null);
  };

  const toggleDropdown = (index: number) => {
    setDropdownVisible(dropdownVisible === index ? null : index);
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.displayName || "Select";
  };

  const getShortName = (memberId: string) => {
    const name = getMemberName(memberId);
    return name.length > 6 ? name.charAt(0).toUpperCase() + "..." : name;
  };

  const handleSubmit = () => {
    if (!projectName.trim()) return;
    
    onSubmit({
      projectName: projectName.trim(),
      projectReward: projectReward.trim(),
      iconReward: iconReward.trim() || "🎯",
      bgColor: selectedColor,
      tasks: tasks.filter(t => t.name.trim() !== ""),
    });

    // Reset form
    setProjectName("");
    setProjectReward("");
    setIconReward("");
    setSelectedColor(COLORS[0]);
    setTasks([{ name: "", assigneeId: members[0]?.id || "" }]);
  };

  const handleClose = () => {
    setProjectName("");
    setProjectReward("");
    setIconReward("");
    setSelectedColor(COLORS[0]);
    setTasks([{ name: "", assigneeId: members[0]?.id || "" }]);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>ADD PROJECT</Text>
            <TouchableOpacity
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={28} color="#C8733B" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
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

            {/* Background Color */}
            <Text style={styles.label}>Background Color</Text>
            <View style={styles.colorContainer}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Rewards Row */}
            <View style={styles.rewardsRow}>
              <View style={styles.rewardColumn}>
                <Text style={styles.label}>Project Reward</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Pizza Party"
                  placeholderTextColor="#999"
                  value={projectReward}
                  onChangeText={setProjectReward}
                />
              </View>

              <View style={styles.rewardColumn}>
                <Text style={styles.label}>Icon Reward</Text>
                <TextInput
                  style={styles.input}
                  placeholder="🎯"
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
                Assign to
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
                </View>

                <View style={styles.assigneeContainer}>
                  <TouchableOpacity
                    style={styles.assigneeButton}
                    onPress={() => toggleDropdown(index)}
                  >
                    <Text style={styles.assigneeText} numberOfLines={1}>
                      {getShortName(task.assigneeId)}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#666" />
                  </TouchableOpacity>

                  {/* Dropdown */}
                  {dropdownVisible === index && (
                    <View style={styles.dropdown}>
                      {members.map((member) => (
                        <TouchableOpacity
                          key={member.id}
                          style={[
                            styles.dropdownItem,
                            task.assigneeId === member.id && styles.dropdownItemActive,
                          ]}
                          onPress={() => updateTaskAssignee(index, member.id)}
                        >
                          <View>
                            <Text
                              style={[
                                styles.dropdownItemText,
                                task.assigneeId === member.id && styles.dropdownItemTextActive,
                              ]}
                            >
                              {member.displayName}
                            </Text>
                            <Text style={styles.dropdownItemEmail}>
                              {member.email}
                            </Text>
                          </View>
                          {task.assigneeId === member.id && (
                            <Ionicons name="checkmark" size={18} color="#C8733B" />
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
            style={[
              styles.submitButton,
              (!projectName.trim() || isLoading) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={!projectName.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Create Project</Text>
            )}
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
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
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
    zIndex: 1,
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
  assigneeContainer: {
    position: "relative",
    width: 90,
    zIndex: 1000,
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
    left: -50,
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
    minWidth: 180,
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
  dropdownItemEmail: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
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
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});