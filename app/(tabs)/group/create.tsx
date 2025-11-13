import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CreateGroupScreen() {
    const router = useRouter();

    const [groupName, setGroupName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#5d6d4e");
    const [members, setMembers] = useState<string[]>([]);
    const [memberInput, setMemberInput] = useState("");

    const colors = ["#5d6d4e", "#5c3d2e", "#d4a574", "#8b7355", "#a0826d"];

    const addMember = () => {
        if (memberInput.trim()) {
            setMembers([...members, memberInput.trim()]);
            setMemberInput("");
        }
    };

    const removeMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const handleCreate = () => {
        if (!groupName.trim()) {
            Alert.alert("Error", "Please enter group name");
            return;
        }
        if (members.length === 0) {
            Alert.alert("Error", "Please add at least one member");
            return;
        }

        // TODO: Save data (bisa pakai context, redux, atau backend)
        Alert.alert("Success", "Group created successfully!", [
            {
                text: "OK",
                onPress: () => router.back(),
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#C8733B" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Create New Group</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Group Name */}
                <View style={styles.section}>
                    <Text style={styles.label}>Group Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter group name"
                        value={groupName}
                        onChangeText={setGroupName}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Color Picker */}
                <View style={styles.section}>
                    <Text style={styles.label}>Choose Color</Text>
                    <View style={styles.colorContainer}>
                        {colors.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    selectedColor === color && styles.selectedColor,
                                ]}
                                onPress={() => setSelectedColor(color)}
                            >
                                {selectedColor === color && (
                                    <Ionicons name="checkmark" size={24} color="#fff" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Add Members */}
                <View style={styles.section}>
                    <Text style={styles.label}>Add Members</Text>
                    <View style={styles.memberInputContainer}>
                        <TextInput
                            style={styles.memberInput}
                            placeholder="Enter member name"
                            value={memberInput}
                            onChangeText={setMemberInput}
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addMember}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Members List */}
                    <View style={styles.membersList}>
                        {members.map((member, index) => (
                            <View key={index} style={styles.memberItem}>
                                <Text style={styles.memberText}>{member}</Text>
                                <TouchableOpacity onPress={() => removeMember(index)}>
                                    <Ionicons name="close-circle" size={20} color="#C8733B" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Preview */}
                <View style={styles.section}>
                    <Text style={styles.label}>Preview</Text>
                    <View style={[styles.previewCard, { backgroundColor: selectedColor }]}>
                        <View style={styles.avatar} />
                        <Text style={styles.previewTitle}>
                            {groupName || "Group Name"}
                        </Text>
                        <View style={styles.previewInfo}>
                            <View>
                                <Text style={styles.previewLabel}>Members</Text>
                                {members.slice(0, 3).map((member, i) => (
                                    <Text key={i} style={styles.previewText}>
                                        • {member}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Create Button */}
                <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                    <Text style={styles.createButtonText}>Create Group</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4e4c1",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#C8733B",
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#5c3d2e",
        marginBottom: 8,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    colorContainer: {
        flexDirection: "row",
        gap: 12,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedColor: {
        borderColor: "#C8733B",
        borderWidth: 3,
    },
    memberInputContainer: {
        flexDirection: "row",
        gap: 8,
    },
    memberInput: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    addButton: {
        backgroundColor: "#C8733B",
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    membersList: {
        marginTop: 12,
        gap: 8,
    },
    memberItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
    },
    memberText: {
        fontSize: 14,
        color: "#333",
    },
    previewCard: {
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "#fff",
        marginBottom: 15,
    },
    previewTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    previewInfo: {
        width: "100%",
    },
    previewLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 8,
    },
    previewText: {
        fontSize: 13,
        color: "#fff",
        marginBottom: 4,
    },
    createButton: {
        backgroundColor: "#C8733B",
        padding: 18,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12,
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});