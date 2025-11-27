import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface GroupHeaderProps {
    onBack: () => void;
}

export default function GroupHeader({ onBack }: GroupHeaderProps) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#C8733B" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create New Group</Text>
            <View style={{ width: 24 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e8d4a8",
    },
    backButton: {
        padding: 4,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#C8733B",
    },
});