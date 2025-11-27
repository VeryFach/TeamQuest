import { View, Text, TextInput, StyleSheet } from "react-native";

interface GroupNameInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

export default function GroupNameInput({ value, onChangeText }: GroupNameInputProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter group name"
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#999"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#5c3d2e",
        marginBottom: 10,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
});