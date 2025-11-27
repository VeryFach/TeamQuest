import { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "@/firebaseConfig";

import GroupHeader from "@/components/group/create/GroupHeader";
import GroupNameInput from "@/components/group/create/GroupNameInput";
import BackgroundStylePicker from "@/components/group/create/BackgroundStylePicker";
import MemberDropdown from "@/components/group/create/MemberDropdown"; // Ganti MembersManager
import GroupPreview from "@/components/group/create/GroupPreview";
import { GroupService } from "@/services/group.service";

export default function CreateGroupScreen() {
    const router = useRouter();
    const user = auth.currentUser;

    const [groupName, setGroupName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#5d6d4e");
    const [selectedColorType, setSelectedColorType] = useState<'solid' | 'image'>('solid');
    const [members, setMembers] = useState<string[]>([]); // Sekarang berisi user IDs
    const [colors, setColors] = useState(["#C8733B", "#5C3D2E", "#9A6D3A"]);
    const [isLoading, setIsLoading] = useState(false);

    // ...existing code untuk defaultColors dan defaultImages...

    const defaultColors = [
        "#5d6d4e", "#5c3d2e", "#d4a574", "#8b7355", "#a0826d",
        "#6B8E23", "#CD853F", "#8B4513", "#A0522D", "#B8860B",
    ];

    const defaultImages = [
        {
            id: 'pattern1',
            source: { uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
            name: 'Nature'
        },
        {
            id: 'pattern2',
            source: require('@/assets/images/background.png'),
            name: 'Default'
        },
        {
            id: 'pattern3',
            source: { uri: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400' },
            name: 'Modern'
        },
        {
            id: 'pattern4',
            source: { uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400' },
            name: 'Gradient'
        },
    ];

    const [backgroundImages, setBackgroundImages] = useState(defaultImages);
    const selectedBackground = backgroundImages.find(img => img.id === selectedColor);

    // Handler untuk member dropdown
    const handleMemberSelect = (userId: string) => {
        setMembers([...members, userId]);
    };

    const handleMemberRemove = (userId: string) => {
        setMembers(members.filter(id => id !== userId));
    };

    const handleCreate = async () => {
        if (!groupName.trim()) {
            Alert.alert("Error", "Please enter a group name");
            return;
        }
        if (members.length === 0) {
            Alert.alert("Error", "Please add at least one member");
            return;
        }
        if (!user?.uid) {
            Alert.alert("Error", "You must be logged in to create a group");
            return;
        }

        setIsLoading(true);

        try {
            const groupData = {
                name: groupName.trim(),
                bgColor: selectedColorType === 'solid' 
                    ? selectedColor 
                    : selectedBackground?.source?.uri || selectedColor,
                leaderId: user.uid,
                members: [user.uid, ...members], // Leader + selected members
            };

            const newGroup = await GroupService.createGroup(groupData);
            console.log("Group created:", newGroup);

            Alert.alert(
                "Success! 🎉",
                `Group "${groupName}" has been created with ${members.length} member${members.length > 1 ? 's' : ''}.`,
                [
                    { 
                        text: "OK", 
                        onPress: () => router.push('/(tabs)/group') 
                    }
                ]
            );
        } catch (error) {
            console.error("Error creating group:", error);
            Alert.alert("Error", "Failed to create group. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <GroupHeader onBack={() => router.push('/(tabs)/group')} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <GroupNameInput
                    value={groupName}
                    onChangeText={setGroupName}
                />
                
                <BackgroundStylePicker
                    selectedColor={selectedColor}
                    selectedColorType={selectedColorType}
                    onColorSelect={setSelectedColor}
                    onColorTypeSelect={setSelectedColorType}
                    colors={[...defaultColors, ...colors]}
                    backgroundImages={backgroundImages}
                    onAddColor={(c) => setColors([...colors, c])}
                    onAddImage={(img) => setBackgroundImages([...backgroundImages, img])}
                />

                {/* Ganti MembersManager dengan MemberDropdown */}
                <MemberDropdown
                    selectedMembers={members}
                    onMemberSelect={handleMemberSelect}
                    onMemberRemove={handleMemberRemove}
                    currentUserId={user?.uid || ""}
                />

                <GroupPreview
                    groupName={groupName}
                    members={members}
                    selectedColor={selectedColor}
                    selectedColorType={selectedColorType}
                    selectedBackground={selectedBackground}
                />

                <TouchableOpacity 
                    style={[
                        styles.createButton,
                        (!groupName.trim() || members.length === 0 || isLoading) && styles.createButtonDisabled
                    ]} 
                    onPress={handleCreate}
                    disabled={!groupName.trim() || members.length === 0 || isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle" size={24} color="#fff" />
                            <Text style={styles.createButtonText}>Create Group</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
}

// ...existing styles...
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    createButton: {
        backgroundColor: "#C8733B",
        padding: 18,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        shadowColor: "#C8733B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    createButtonDisabled: {
        backgroundColor: "#B56B37",
        shadowOpacity: 0,
        elevation: 0,
    },
    createButtonText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "bold",
    },
    bottomSpacing: {
        height: 40,
    },
});