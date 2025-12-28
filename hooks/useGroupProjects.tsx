import { auth } from "@/firebaseConfig";
import { GroupService } from "@/services/group.service";
import { Project, ProjectService } from "@/services/project.service";
import { User, UserService } from "@/services/user.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

export function useGroupProjects(groupId?: string) {
  const user = auth.currentUser;

  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter state
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [filterByReward, setFilterByReward] = useState<string | null>(null);

  // Fetch data dari Firebase
  const fetchData = useCallback(async () => {
    if (!groupId) {
      setIsLoading(false);
      return;
    }
    try {
      const groupProjects = await ProjectService.getGroupProjects(groupId);
      setProjects(groupProjects);

      const groupData = await GroupService.getGroup(groupId);
      if (groupData) {
        const membersData = await UserService.getUsersByIds(groupData.members);
        setMembers(membersData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle create project
  const handleSubmitProject = async (formData: any) => {
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
      await fetchData();
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

  // Unique rewards for filter
  const uniqueRewards = useMemo(() => {
    const rewards = projects.map((p) => p.reward.name).filter(Boolean);
    return [...new Set(rewards)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
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

  return {
    projects,
    members,
    isLoading,
    isSubmitting,
    modalVisible,
    setModalVisible,
    handleSubmitProject,
    uniqueRewards,
    filterByReward,
    setFilterByReward,
    filteredProjects,
    handleClearFilters,
  };
}
