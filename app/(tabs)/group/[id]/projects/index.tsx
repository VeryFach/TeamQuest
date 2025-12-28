// app/(tabs)/group/[id]/projects/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FAB from "@/components/common/FAB";
import AddProjectModal, {
  ProjectFormData,
} from "@/components/project/AddProjectModal";
import { auth } from "@/firebaseConfig";
import { GroupService } from "@/services/group.service";
import { Project, ProjectService } from "@/services/project.service";
import { User, UserService } from "@/services/user.service";
import { Unsubscribe } from "firebase/firestore";

export default function ProjectScreen() {
  const { id, groupId: paramGroupId } = useLocalSearchParams();
  const router = useRouter();
  const user = auth.currentUser;

  // Ambil group ID dari params
  const groupId = paramGroupId
    ? Array.isArray(paramGroupId)
      ? paramGroupId[0]
      : paramGroupId
    : Array.isArray(id)
    ? id[0]
    : (id as string);

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // State untuk filter
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [filterByReward, setFilterByReward] = useState<string | null>(null);

  // Ref untuk menyimpan unsubscribe function
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // Setup realtime listener untuk projects
  useEffect(() => {
    if (!groupId) {
      setIsLoading(false);
      return;
    }

    // Subscribe ke group projects - akan auto update saat ada perubahan
    unsubscribeRef.current = ProjectService.subscribeToGroupProjects(
      groupId,
      async (groupProjects) => {
        setProjects(groupProjects);
        setIsLoading(false);
      }
    );

    // Fetch members data (tidak perlu realtime untuk members)
    const fetchMembers = async () => {
      try {
        const groupData = await GroupService.getGroup(groupId);
        if (groupData) {
          const membersData = await UserService.getUsersByIds(
            groupData.members
          );
          setMembers(membersData);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };
    fetchMembers();

    // Cleanup subscription saat unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [groupId]);

  // Handle create project
  const handleSubmitProject = async (formData: ProjectFormData) => {
    if (!user?.uid || !groupId) {
      Alert.alert("Error", "You must be logged in to create a project");
      return;
    }

    setIsSubmitting(true);

    try {
      const projectData = {
        name: formData.projectName,
        bgColor: formData.bgColor,
        groupId: groupId,
        isPrivate: false,
        projectLeader: user.uid,
        reward: {
          icon: formData.iconReward,
          name: formData.projectReward,
        },
      };

      const newProject = await ProjectService.createProject(projectData);
      console.log("Project created:", newProject);

      // Tidak perlu refresh data - realtime listener akan otomatis update

      Alert.alert(
        "Success! 🎉",
        `Project "${formData.projectName}" has been created.`,
        [{ text: "OK" }]
      );

      setModalVisible(false);
    } catch (error) {
      console.error("Error creating project:", error);
      Alert.alert("Error", "Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectPress = (projectId: string) => {
    router.push(`/(tabs)/group/${groupId}/projects/${projectId}`);
  };

  // Get unique rewards for filter
  const uniqueRewards = useMemo(() => {
    const rewards = projects.map((p) => p.reward.name).filter(Boolean);
    return [...new Set(rewards)];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by reward
      if (filterByReward && project.reward.name !== filterByReward) {
        return false;
      }
      return true;
    });
  }, [projects, filterByReward]);

  const handleClearFilters = () => {
    setFilterCompleted(false);
    setFilterByReward(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C8733B" />
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {uniqueRewards.map((reward) => (
            <TouchableOpacity
              key={reward}
              style={[
                styles.filterChip,
                filterByReward === reward && styles.filterChipActive,
              ]}
              onPress={() =>
                setFilterByReward(filterByReward === reward ? null : reward)
              }
            >
              <Text
                style={[
                  styles.filterText,
                  filterByReward === reward && styles.filterTextActive,
                ]}
              >
                {reward}
              </Text>
              {filterByReward === reward && (
                <Ionicons name="close-circle" size={16} color="#C8733B" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filterByReward && (
          <TouchableOpacity
            style={styles.clearFilters}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Project List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredProjects.map((project) => (
          <TouchableOpacity
            key={project.projectId}
            style={[styles.projectCard, { backgroundColor: project.bgColor }]}
            onPress={() => handleProjectPress(project.projectId)}
            activeOpacity={0.8}
          >
            <View style={styles.projectHeader}>
              <Text style={styles.projectIcon}>{project.reward.icon}</Text>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectReward}>{project.reward.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredProjects.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No projects found</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to create a new project
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB Button */}
      <FAB onPress={() => setModalVisible(true)} />

      {/* Add Project Modal */}
      <AddProjectModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitProject}
        members={members}
        isLoading={isSubmitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4e4c1",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4e4c1",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterScroll: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: "#f4e4c1",
    borderWidth: 1,
    borderColor: "#C8733B",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  filterTextActive: {
    color: "#C8733B",
    fontWeight: "600",
  },
  clearFilters: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#999",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },
  projectCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  projectIcon: {
    fontSize: 48,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  projectReward: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
  },
});
