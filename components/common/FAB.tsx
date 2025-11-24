import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FAB({ onPress }: { onPress?: () => void }) {
    return (
        <TouchableOpacity style={styles.fab} onPress={onPress}>
            <Ionicons name="add" size={39} color="#000" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: "#F3E4BD",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 8,
    },
});