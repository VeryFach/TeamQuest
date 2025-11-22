import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
    import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

export default function CreateGroupScreen() {
    const router = useRouter();

    const [groupName, setGroupName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#5d6d4e");
    const [selectedColorType, setSelectedColorType] = useState<'solid' | 'image'>('solid');
    const [members, setMembers] = useState<string[]>([]);
    const [memberInput, setMemberInput] = useState("");
    const [avatarUri, setAvatarUri] = useState<string | null>(null);

    const colors = ["#5d6d4e", "#5c3d2e", "#d4a574", "#8b7355", "#a0826d"];

    const backgroundImages = [
        {
            id: 'pattern1',
            source: { uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
            name: 'Nature Pattern'
        },
        {
            id: 'pattern2',
            source: require('@/assets/images/background.png'),
            name: 'Abstract Blue'
        },
        {
            id: 'pattern5',
            source: { uri: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400' },
            name: 'Modern'
        },
    ];

    const selectedBackground = backgroundImages.find(img => img.id === selectedColor);

    // Avatar picker
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permission Denied');

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) setAvatarUri(result.assets[0].uri);
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permission Denied');

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) setAvatarUri(result.assets[0].uri);
    };

    const handleAvatarPress = () => {
        Alert.alert("Choose Avatar", "Select an option", [
            { text: "Take Photo", onPress: takePhoto },
            { text: "Choose from Gallery", onPress: pickImage },
            { text: "Remove Photo", onPress: () => setAvatarUri(null), style: "destructive" },
            { text: "Cancel", style: "cancel" },
        ]);
    };

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
        if (!groupName.trim()) return Alert.alert("Error", "Please enter group name");
        if (members.length === 0) return Alert.alert("Error", "Please add at least one member");

        const groupData = {
            name: groupName,
            color: selectedColor,
            colorType: selectedColorType,
            backgroundImage: selectedBackground?.source || null,
            avatar: avatarUri,
            members: members,
        };

        Alert.alert("Success", "Group created successfully!", [
            { text: "OK", onPress: () => router.back() }
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

                {/* Background Style Picker */}
                <View style={styles.section}>
                    <Text style={styles.label}>Choose Background Style</Text>

                    {/* Toggle */}
                    <View style={styles.styleToggle}>
                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                selectedColorType === 'solid' && styles.activeToggle
                            ]}
                            onPress={() => setSelectedColorType('solid')}
                        >
                            <Text style={[
                                styles.toggleText,
                                selectedColorType === 'solid' && styles.activeToggleText
                            ]}>Solid Colors</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.toggleButton,
                                selectedColorType === 'image' && styles.activeToggle
                            ]}
                            onPress={() => setSelectedColorType('image')}
                        >
                            <Text style={[
                                styles.toggleText,
                                selectedColorType === 'image' && styles.activeToggleText
                            ]}>Image Patterns</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Solid Colors */}
                    {selectedColorType === 'solid' && (
                        <View style={styles.colorContainer}>
                            {colors.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColor
                                    ]}
                                    onPress={() => setSelectedColor(color)}
                                >
                                    {selectedColor === color && (
                                        <Ionicons name="checkmark" size={24} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Image Patterns */}
                    {selectedColorType === 'image' && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.imageContainer}>
                                {backgroundImages.map((bg) => (
                                    <TouchableOpacity
                                        key={bg.id}
                                        style={[
                                            styles.imageOption,
                                            selectedColor === bg.id && styles.selectedImage
                                        ]}
                                        onPress={() => setSelectedColor(bg.id)}
                                    >
                                        <Image source={bg.source} style={styles.backgroundImage} />
                                        {selectedColor === bg.id && (
                                            <View style={styles.imageCheckOverlay}>
                                                <Ionicons name="checkmark" size={20} color="#fff" />
                                            </View>
                                        )}
                                        <Text style={styles.imageOptionText}>{bg.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    )}
                </View>

                {/* Members */}
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

                    <View style={styles.previewCard}>
                        {selectedColorType === 'image' && selectedBackground ? (
                            <Image
                                source={selectedBackground.source}
                                style={styles.previewBackgroundImage}
                            />
                        ) : (
                            <View
                                style={[
                                    styles.previewBackgroundColor,
                                    { backgroundColor: selectedColor }
                                ]}
                            />
                        )}

                        <View style={styles.previewContent}>
                            <Text style={styles.previewTitle}>
                                {groupName || "Group Name"}
                            </Text>

                            <View style={styles.previewInfo}>
                                <Text style={styles.previewLabel}>Members</Text>
                                {members.slice(0, 3).map((m, i) => (
                                    <Text key={i} style={styles.previewText}>• {m}</Text>
                                ))}
                                {members.length > 3 && (
                                    <Text style={styles.previewText}>
                                        • +{members.length - 3} more
                                    </Text>
                                )}
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
    container: { flex: 1, backgroundColor: "#f4e4c1" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerText: { fontSize: 20, fontWeight: "bold", color: "#C8733B" },
    scrollView: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    section: { marginBottom: 24 },
    label: { fontSize: 16, fontWeight: "600", color: "#5c3d2e", marginBottom: 8 },
    input: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    /* Colors */
    styleToggle: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    toggleButton: { flex: 1, paddingVertical: 12, alignItems: "center", borderRadius: 8 },
    activeToggle: { backgroundColor: "#C8733B" },
    toggleText: { fontSize: 14, fontWeight: "600", color: "#666" },
    activeToggleText: { color: "#fff" },

    colorContainer: { flexDirection: "row", gap: 12 },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
    },
    selectedColor: { borderColor: "#C8733B", borderWidth: 3 },

    /* Image patterns */
    imageContainer: { flexDirection: "row", gap: 12, paddingVertical: 8 },
    imageOption: {
        width: 80,
        height: 80,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        borderWidth: 2,
    },
    selectedImage: { borderColor: "#C8733B", borderWidth: 3 },
    backgroundImage: { width: "100%", height: "100%" },
    imageCheckOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(200, 115, 59, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    imageOptionText: {
        fontSize: 10,
        color: "#666",
        textAlign: "center",
        marginTop: 4,
        fontWeight: "500",
    },

    /* Members */
    memberInputContainer: { flexDirection: "row", gap: 8 },
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
    membersList: { marginTop: 12, gap: 8 },
    memberItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
    },
    memberText: { fontSize: 14, color: "#333" },

    /* Preview */
    previewCard: {
        borderRadius: 20,
        position: "relative",
        overflow: "hidden",
        minHeight: 200,
    },
    previewBackgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
    },
    previewBackgroundColor: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    previewContent: {
        padding: 20,
        alignItems: "center",
        position: "relative",
        zIndex: 1,
    },
    previewTitle: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    previewInfo: { width: "100%" },
    previewLabel: { fontSize: 14, fontWeight: "600", color: "#fff", marginBottom: 8 },
    previewText: { fontSize: 13, color: "#fff", marginBottom: 4 },

    /* Create Button */
    createButton: {
        backgroundColor: "#C8733B",
        padding: 18,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12,
    },
    createButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
