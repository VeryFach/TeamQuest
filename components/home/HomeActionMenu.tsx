import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Pastikan path import ini sesuai dengan struktur project Anda
import FAB from "@/components/common/FAB";
import DynamicSelectorModal from "@/components/todo/DynamicSelectorModal";
import { Group } from "@/services/group.service";

interface HomeActionMenuProps {
  myGroups: Group[];
}

export default function HomeActionMenu({ myGroups }: HomeActionMenuProps) {
  const router = useRouter();

  // Modal States
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isTypeSelectorVisible, setIsTypeSelectorVisible] = useState(false);
  const [isGroupSelectorVisible, setIsGroupSelectorVisible] = useState(false);

  // Context state
  const [actionContext, setActionContext] = useState<"task" | "project" | null>(
    null
  );

  // --- LOGIC NAVIGASI ---

  const handleMenuSelect = (action: "group" | "project" | "task") => {
    setIsMenuVisible(false);

    if (action === "group") {
      router.push("/(tabs)/group/create");
    } else {
      setActionContext(action);
      setTimeout(() => setIsTypeSelectorVisible(true), 300);
    }
  };

  const handleTypeSelect = (type: "personal" | "group") => {
    setIsTypeSelectorVisible(false);

    if (type === "personal") {
      if (actionContext === "task") {
        router.push("/(tabs)/todo");
      } else if (actionContext === "project") {
        router.push({
          pathname: "/(tabs)/todo/project/create",
          params: { type: "private" },
        });
      }
    } else {
      setTimeout(() => setIsGroupSelectorVisible(true), 300);
    }
  };

  const handleGroupSelected = (group: Group) => {
    setIsGroupSelectorVisible(false);

    if (actionContext === "task") {
      router.push({
        pathname: "/(tabs)/group/[id]/tasks/create",
        params: { id: group.id },
      });
    } else if (actionContext === "project") {
      router.push({
        pathname: "/(tabs)/group/[id]/projects/create",
        params: { id: group.id },
      });
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        zIndex: 999,
      }}
    >
      <TouchableOpacity>
        <FAB onPress={() => setIsMenuVisible(true)} />
      </TouchableOpacity>
      {/* 1. Main Action Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Create New</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuSelect("group")}
            >
              <Ionicons name="people" size={24} color="#C8733B" />
              <Text style={styles.menuText}>New Group (Squad)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuSelect("project")}
            >
              <Ionicons name="briefcase" size={24} color="#C8733B" />
              <Text style={styles.menuText}>New Project</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuSelect("task")}
            >
              <Ionicons name="checkbox" size={24} color="#C8733B" />
              <Text style={styles.menuText}>New Task</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 2. Type Selector Modal (Personal vs Group) */}
      <Modal
        visible={isTypeSelectorVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsTypeSelectorVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsTypeSelectorVisible(false)}
        >
          <View style={styles.typeSelectorContainer}>
            <Text style={styles.menuTitle}>Who is this for?</Text>

            <TouchableOpacity
              style={[styles.typeButton, { backgroundColor: "#A2B06E" }]}
              onPress={() => handleTypeSelect("personal")}
            >
              <Ionicons name="person" size={24} color="white" />
              <Text style={styles.typeButtonText}>For Myself (Personal)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, { backgroundColor: "#C8733B" }]}
              onPress={() => handleTypeSelect("group")}
            >
              <Ionicons name="people" size={24} color="white" />
              <Text style={styles.typeButtonText}>For a Team</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 3. Group Selector Modal */}
      <DynamicSelectorModal
        visible={isGroupSelectorVisible}
        onClose={() => setIsGroupSelectorVisible(false)}
        title="Select Team"
        data={myGroups}
        displayKey="name"
        onSelect={handleGroupSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    paddingBottom: 40,
    gap: 15,
    marginHorizontal: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    gap: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  typeSelectorContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
    padding: 20,
    gap: 15,
    alignSelf: "center",
    width: "80%",
    elevation: 5,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  typeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
