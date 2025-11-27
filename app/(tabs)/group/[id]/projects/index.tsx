// app/(tabs)/group/[id]/projects/index.tsx
import FAB from "@/components/common/FAB";
import AddProjectModal from "@/components/project/AddProjectModal";
import ProjectCard from "@/components/project/ProjectCard";
import { PROJECTS_DATA } from "@/data/projects";
import { Project } from "@/data/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProjectScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    
    const groupId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
    const projects: Project[] = PROJECTS_DATA[groupId] || [];
    
    // State untuk modal
    const [modalVisible, setModalVisible] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectReward, setProjectReward] = useState('');
    const [iconReward, setIconReward] = useState('');
    const [tasks, setTasks] = useState<Array<{ name: string, assignee: string }>>([
        { name: '', assignee: 'Raka' }
    ]);
    
    // State untuk filter
    const [filterCompleted, setFilterCompleted] = useState(false);
    const [filterPizzaParty, setFilterPizzaParty] = useState(false);

    const handleProjectPress = (projectId: number) => {
        console.log("=== Navigation Debug ===");
        console.log("Group ID:", groupId);
        console.log("Project ID:", projectId);
        
        // Navigasi ke [projectId].tsx
        router.push(`/(tabs)/group/${groupId}/projects/${projectId}`);
    };

    const filteredProjects = projects.filter(project => {
        if (filterCompleted && project.tasks.every((t: any) => t.completed)) return false;
        if (filterPizzaParty && !project.subtitle.includes('Pizza')) return false;
        return true;
    });

    const handleClearFilters = () => {
        setFilterCompleted(false);
        setFilterPizzaParty(false);
    };

    const handleSubmitProject = () => {
        console.log("Submit project:", {
            projectName,
            projectReward,
            iconReward,
            tasks
        });
        // Reset form
        setProjectName('');
        setProjectReward('');
        setIconReward('');
        setTasks([{ name: '', assignee: 'Raka' }]);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* Filter Section */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterChip, filterCompleted && styles.filterChipActive]}
                    onPress={() => setFilterCompleted(!filterCompleted)}
                >
                    <Text style={[styles.filterText, filterCompleted && styles.filterTextActive]}>
                        Uncompleted
                    </Text>
                    {filterCompleted && <Ionicons name="close-circle" size={16} color="#C8733B" />}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterChip, filterPizzaParty && styles.filterChipActive]}
                    onPress={() => setFilterPizzaParty(!filterPizzaParty)}
                >
                    <Text style={[styles.filterText, filterPizzaParty && styles.filterTextActive]}>
                        Pizza Party
                    </Text>
                    {filterPizzaParty && <Ionicons name="close-circle" size={16} color="#C8733B" />}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.clearFilters}
                    onPress={handleClearFilters}
                >
                    <Text style={styles.clearFiltersText}>Clear filters</Text>
                </TouchableOpacity>
            </View>

            {/* Project List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onPress={handleProjectPress}
                    />
                ))}

                {filteredProjects.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="folder-open-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No projects found</Text>
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
                projectName={projectName}
                setProjectName={setProjectName}
                projectReward={projectReward}
                setProjectReward={setProjectReward}
                iconReward={iconReward}
                setIconReward={setIconReward}
                tasks={tasks}
                setTasks={setTasks}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4e4c1',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        gap: 6,
    },
    filterChipActive: {
        backgroundColor: '#f4e4c1',
        borderWidth: 1,
        borderColor: '#C8733B',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
    },
    filterTextActive: {
        color: '#C8733B',
        fontWeight: '600',
    },
    clearFilters: {
        marginLeft: 'auto',
    },
    clearFiltersText: {
        fontSize: 14,
        color: '#999',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 20,
        paddingBottom: 100,
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 16,
    },
});