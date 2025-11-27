import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MembersManagerProps {
    members: string[];
    memberInput: string;
    onMemberInputChange: (val: string) => void;
    onAddMember: () => void;
    onRemoveMember: (index: number) => void;
}

export default function MembersManager({
    members,
    memberInput,
    onMemberInputChange,
    onAddMember,
    onRemoveMember
}: MembersManagerProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.label}>Members</Text>

            {/* Input Row */}
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter member name"
                    value={memberInput}
                    onChangeText={onMemberInputChange}
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.addButton} onPress={onAddMember}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Members List */}
            <View style={styles.membersList}>
                {members.map((m, index) => (
                    <View key={index} style={styles.memberItem}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {m.charAt(0).toUpperCase()}
                            </Text>
                        </View>

                        <Text style={styles.memberName}>{m}</Text>

                        <TouchableOpacity onPress={() => onRemoveMember(index)}>
                            <Ionicons name="close-circle" size={22} color="#C8733B" />
                        </TouchableOpacity>
                    </View>
                ))}

                {members.length === 0 && (
                    <Text style={styles.emptyText}>No members added yet.</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#5c3d2e",
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    input: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 15,
    },
    addButton: {
        backgroundColor: "#C8733B",
        padding: 14,
        borderRadius: 12,
    },
    membersList: { marginTop: 16, gap: 10 },
    memberItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        gap: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#C8733B",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { color: "#fff", fontWeight: "bold" },
    memberName: { fontSize: 15, flex: 1, color: "#333" },
    emptyText: {
        fontStyle: "italic",
        fontSize: 13,
        color: "#777",
        marginTop: 5,
    },
});
