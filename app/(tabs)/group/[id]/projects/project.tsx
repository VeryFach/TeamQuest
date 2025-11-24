import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FAB from "@/components/common/FAB";
import { useState } from "react";

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
    const [tasks, setTasks] = useState<Array<{name: string, assignee: string}>>([
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

                <TouchableOpacity style={styles.clearFilters}>
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
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Add Project Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>ADD PROJECT</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#C8733B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Project Name */}
                            <Text style={styles.label}>Project Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter a project name"
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
                                        value={projectReward}
                                        onChangeText={setProjectReward}
                                    />
                                </View>
                                <View style={styles.rewardColumn}>
                                    <Text style={styles.label}>Icon Reward</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Icon only"
                                        value={iconReward}
                                        onChangeText={setIconReward}
                                    />
                                </View>
                            </View>

                            {/* Task Section */}
                            <View style={styles.taskHeader}>
                                <Text style={styles.label}>Task</Text>
                                <Text style={styles.label}>Appoint to</Text>
                            </View>

                            {tasks.map((task, index) => (
                                <View key={index} style={styles.taskRow}>
                                    <TextInput
                                        style={[styles.input, styles.taskInput]}
                                        placeholder="Enter a task name"
                                        value={task.name}
                                        onChangeText={(text) => {
                                            const newTasks = [...tasks];
                                            newTasks[index].name = text;
                                            setTasks(newTasks);
                                        }}
                                    />
                                    <TouchableOpacity style={styles.assigneeButton}>
                                        <Text style={styles.assigneeText}>{task.assignee}</Text>
                                        <Ionicons name="chevron-down" size={16} color="#666" />
                                    </TouchableOpacity>
                                    {index === 0 ? (
                                        <TouchableOpacity 
                                            style={styles.addTaskButton}
                                            onPress={addTask}
                                        >
                                            <Ionicons name="add" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity 
                                            style={styles.removeTaskButton}
                                            onPress={() => removeTask(index)}
                                        >
                                            <Ionicons name="close" size={20} color="#C8733B" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </ScrollView>

                        {/* Submit Button */}
                        <TouchableOpacity style={styles.submitButton}>
                            <Ionicons name="checkmark" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f4e4c1',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        borderWidth: 2,
        borderColor: '#333',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 14,
    },
    rewardsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    rewardColumn: {
        flex: 1,
    },
    taskHeader: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    taskInput: {
        flex: 1,
        marginBottom: 0,
    },
    assigneeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 4,
        minWidth: 80,
    },
    assigneeText: {
        fontSize: 14,
        color: '#333',
    },
    addTaskButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeTaskButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});