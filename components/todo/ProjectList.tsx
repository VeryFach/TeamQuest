import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import Komponen
import ProjectCard from "@/components/home/ProjectCard";

interface ProjectData {
  id: string;
  groupName: string;
  reward: string;
  rewardIcon: string;
  tasks_total: number;
  tasks_completed: number;
  bgColor?: string;
}

interface ProjectListProps {
  onAddPress: () => void;
  onProjectPress?: (project: ProjectData) => void;
  type?: string;
  projects?: ProjectData[];
}

export default function ProjectList({
  onAddPress,
  onProjectPress,
  type = "group",
  projects = [],
}: ProjectListProps) {
  const scrollRef = useRef<ScrollView>(null);

  // Filter uncompleted projects
  const uncompletedProjects = projects.filter(
    (p) => p.tasks_completed < p.tasks_total || p.tasks_total === 0
  );
  const uncompletedProjectsCount = uncompletedProjects.length;

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  }, [type]);

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Projects Uncompleted ({uncompletedProjectsCount})
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={{ alignItems: "center", minHeight: 160 }}
      >
        {/* Tombol Add Project */}
        <TouchableOpacity style={styles.addCard} onPress={onAddPress}>
          <View style={styles.addIconCircle}>
            <Ionicons name="add" size={30} color="#000000" />
          </View>
          <Text style={styles.addCardText}>Add Project</Text>
        </TouchableOpacity>

        {/* Rendering ProjectCard */}
        {uncompletedProjects.map((project, idx) => (
          <View
            key={project.id}
            style={{
              marginRight: idx === uncompletedProjects.length - 1 ? 40 : 15,
              height: 140,
              justifyContent: "center",
            }}
          >
            <ProjectCard
              data={{
                id: project.id,
                group_name: project.groupName,
                reward: project.reward,
                reward_emot: project.rewardIcon,
                tasks_total: project.tasks_total,
                tasks_completed: project.tasks_completed,
              }}
              customBgColor={project.bgColor}
              scale={80}
              onPress={() => onProjectPress?.(project)}
            />
          </View>
        ))}

        {/* Empty State */}
        {uncompletedProjects.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No projects yet</Text>
            <Text style={styles.emptySubtext}>Create your first project!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#78350f" },
  horizontalScroll: {
    paddingLeft: 25,
    paddingVertical: 10,
    marginBottom: 10,
    paddingRight: 100,
  },
  addCard: {
    width: 110,
    height: 140,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 2,
    borderColor: "#000000",
    borderStyle: "dashed",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  addIconCircle: {
    backgroundColor: "#fef3c7",
    padding: 8,
    borderRadius: 50,
    marginBottom: 8,
  },
  addCardText: { fontWeight: "bold", color: "#000000", fontSize: 12 },
  emptyCard: {
    width: 200,
    height: 140,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  emptyText: {
    fontWeight: "bold",
    color: "#1f2937",
    fontSize: 14,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
});
