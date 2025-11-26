import FAB from "@/components/common/FAB";
import AddProjectModal from "@/components/project/AddProjectModal";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const PROJECTS_DATA: Record<number, any[]> = {
    1: [
        {
            id: 1,
            name: 'Sprint 14 : Design Checkout Flow',
            subtitle: 'Pizza Party!',
            color: '#C8733B',
            emoji: '🍕',
            tasks: [
                {
                    id: 1,
                    name: 'Design wireframe',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'Create prototype',
                    assignee: 'Very',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-16'
                },
                {
                    id: 3,
                    name: 'User testing',
                    assignee: 'Farras',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-18'
                },
                {
                    id: 4,
                    name: 'Final revision',
                    assignee: 'Raka',
                    completed: false,
                    priority: 'low',
                    dueDate: '2024-01-20'
                },
                {
                    id: 5,
                    name: 'Deploy to production',
                    assignee: 'Very',
                    completed: false,
                    priority: 'high',
                    dueDate: '2024-01-22'
                },
                {
                    id: 6,
                    name: 'Write documentation',
                    assignee: 'Farras',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-23'
                },
                {
                    id: 7,
                    name: 'Code review',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-17'
                },
                {
                    id: 8,
                    name: 'Bug fixing',
                    assignee: 'Very',
                    completed: true,
                    priority: 'medium',
                    dueDate: '2024-01-19'
                }
            ]
        },
        {
            id: 2,
            name: 'Mobile App Redesign',
            subtitle: 'Fresh Look!',
            color: '#8BC34A',
            emoji: '📱',
            tasks: [
                {
                    id: 1,
                    name: 'Research competitors',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-10'
                },
                {
                    id: 2,
                    name: 'Create moodboard',
                    assignee: 'Very',
                    completed: true,
                    priority: 'medium',
                    dueDate: '2024-01-12'
                },
                {
                    id: 3,
                    name: 'Design system update',
                    assignee: 'Farras',
                    completed: false,
                    priority: 'high',
                    dueDate: '2024-01-25'
                },
                {
                    id: 4,
                    name: 'Prototype animations',
                    assignee: 'Raka',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-28'
                }
            ]
        },
        {
            id: 3,
            name: 'API Documentation',
            subtitle: 'Dev Resources',
            color: '#64B5F6',
            emoji: '📚',
            tasks: [
                {
                    id: 1,
                    name: 'Write endpoint docs',
                    assignee: 'Very',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-08'
                },
                {
                    id: 2,
                    name: 'Add code examples',
                    assignee: 'Farras',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-24'
                }
            ]
        },
    ],
    2: [
        {
            id: 1,
            name: 'Network Infrastructure',
            subtitle: 'Server Migration',
            color: '#C8733B',
            emoji: '🌐',
            tasks: [
                {
                    id: 1,
                    name: 'Setup new servers',
                    assignee: 'Dono',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-05'
                },
                {
                    id: 2,
                    name: 'Migrate databases',
                    assignee: 'Makima',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-08'
                },
                {
                    id: 3,
                    name: 'Configure load balancer',
                    assignee: 'Rimuru',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-26'
                }
            ]
        },
    ],
    3: [
        {
            id: 1,
            name: 'PAPB Final Project',
            subtitle: 'Mobile Development',
            color: '#8BC34A',
            emoji: '📱',
            tasks: [
                {
                    id: 1,
                    name: 'Setup React Native',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-01'
                },
                {
                    id: 2,
                    name: 'Design UI/UX',
                    assignee: 'Very',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-05'
                },
                {
                    id: 3,
                    name: 'Implement features',
                    assignee: 'Farras',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-12'
                },
                {
                    id: 4,
                    name: 'Testing & debugging',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'medium',
                    dueDate: '2024-01-15'
                },
                {
                    id: 5,
                    name: 'Final presentation',
                    assignee: 'Very',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-18'
                }
            ]
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

    const handleProjectPress = (projectId: number) => {
        router.push(`/group/${id}/projects/${projectId}` as any);
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

    const getCompletedCount = (tasks: any[]) => {
        return tasks.filter(t => t.completed).length;
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
                {filteredProjects.map((project) => {
                    const completedCount = getCompletedCount(project.tasks);
                    const totalCount = project.tasks.length;
                    
                    return (
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
                                    <Text style={styles.tasksText}>
                                        {completedCount}/{totalCount} Tasks
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}

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