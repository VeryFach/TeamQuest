import FAB from "@/components/common/FAB";
import AddProjectModal from "@/components/project/AddProjectModal";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Mock data projects dengan warna dan icon
const PROJECTS_DATA: Record<number, any[]> = {
    1: [
        {
            id: 1,
            name: 'Sprint 14 : Design Checkout Flow',
            subtitle: 'Pizza Party!',
            progress: 62.5,
            tasks: 8,
            completed: 5,
            color: '#C8733B',
            emoji: '🍕'
        },
        {
            id: 2,
            name: 'Sprint 14 : Design Checkout Flow',
            subtitle: 'Pizza Party!',
            progress: 62.5,
            tasks: 8,
            completed: 5,
            color: '#8BC34A',
            emoji: '🍕'
        },
        {
            id: 3,
            name: 'Sprint 14 : Design Checkout Flow',
            subtitle: 'Pizza Party!',
            progress: 62.5,
            tasks: 8,
            completed: 5,
            color: '#64B5F6',
            emoji: '🍕'
        },
    ],
    2: [
        {
            id: 1,
            name: 'Network Project',
            subtitle: 'Infrastructure',
            progress: 80,
            tasks: 10,
            completed: 8,
            color: '#C8733B',
            emoji: '🌐'
        },
    ],
    3: [
        {
            id: 1,
            name: 'PAPB Final',
            subtitle: 'Mobile Dev',
            progress: 100,
            tasks: 5,
            completed: 5,
            color: '#8BC34A',
            emoji: '📱'
        },
    ],
};

export default function ProjectTab() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const projects = PROJECTS_DATA[Number(id)] || [];
    const [modalVisible, setModalVisible] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectReward, setProjectReward] = useState('');
    const [iconReward, setIconReward] = useState('');
    const [tasks, setTasks] = useState<Array<{ name: string, assignee: string }>>([
        { name: '', assignee: 'Raka' }
    ]);
    const [filterCompleted, setFilterCompleted] = useState(false);
    const [filterPizzaParty, setFilterPizzaParty] = useState(false);

    const addTask = () => {
        setTasks([...tasks, { name: '', assignee: 'Raka' }]);
    };

    const removeTask = (index: number) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    const handleProjectPress = (projectId: number) => {
        router.push(`/group/${id}/projects/${projectId}/[projectId]` as any);
    };

    const filteredProjects = projects.filter(project => {
        if (filterCompleted && project.progress < 100) return false;
        if (filterPizzaParty && !project.subtitle.includes('Pizza')) return false;
        return true;
    });

    const handleClearFilters = () => {
        setFilterCompleted(false);
        setFilterPizzaParty(false);
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

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredProjects.map((project) => (
                    <TouchableOpacity
                        key={project.id}
                        style={[styles.projectCard, { backgroundColor: project.color }]}
                        onPress={() => handleProjectPress(project.id)}
                    >
                        <View style={styles.emojiContainer}>
                            <Text style={styles.emoji}>{project.emoji}</Text>
                        </View>

                        <View style={styles.projectContent}>
                            <Text style={styles.projectName}>{project.name}</Text>
                            <Text style={styles.projectSubtitle}>{project.subtitle}</Text>

                            <View style={styles.tasksInfo}>
                                <Text style={styles.tasksText}>{project.completed}/{project.tasks} Tasks</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {filteredProjects.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="folder-open-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No projects found</Text>
                    </View>
                )}
            </ScrollView>

            {/* Add Project Button */}
            <FAB onPress={() => setModalVisible(true)} />

            {/* Add Project Modal */}
            <AddProjectModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={() => {
                    console.log("Submit project!");
                    setModalVisible(false);
                }}
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
        padding: 20,
        paddingBottom: 100,
    },
    projectCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        minHeight: 160,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    emojiContainer: {
        marginBottom: 12,
    },
    emoji: {
        fontSize: 48,
    },
    projectContent: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    projectName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    projectSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 12,
    },
    tasksInfo: {
        alignSelf: 'flex-end',
    },
    tasksText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
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