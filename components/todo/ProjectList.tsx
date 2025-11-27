import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import Komponen dan Hook baru
import ProjectCard from "@/components/home/ProjectCard";
import { useProjectFilter } from "@/hooks/useProjectFilter"; // Sesuaikan path

interface ProjectListProps {
  onAddPress: () => void;
  type?: string;
}

export default function ProjectList({
  onAddPress,
  type = "group",
}: ProjectListProps) {
  const router = useRouter();

  // 🔥 Panggil Hook di sini (Clean banget!)
  const { projects, uncompletedProjectsCount } = useProjectFilter(type);
  const scrollRef = useRef<ScrollView>(null);

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
        {projects.map((project: any, idx) => (
          <View
            key={project.id}
            style={{
              marginRight: idx === projects.length - 1 ? 40 : 15,
              height: 140,
              justifyContent: "center",
            }}
          >
            <ProjectCard
              data={project} // Data sudah diformat di dalam hook
              customBgColor={project.bgColor} // Pastikan hook mengembalikan ini atau ambil dari raw
              scale={80}
              onPress={() => router.push("/todo/detail")}
            />
          </View>
        ))}
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
});
