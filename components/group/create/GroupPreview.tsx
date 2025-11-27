import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface GroupPreviewProps {
    groupName: string;
    members: string[];
    selectedColor: string;
    selectedColorType: "solid" | "image";
    selectedBackground?: {
        id: string;
        source: any;
        name: string;
    };
}

export default function GroupPreview({
    groupName,
    members,
    selectedColor,
    selectedColorType,
    selectedBackground,
}: GroupPreviewProps) {
    const bgImage =
        selectedColorType === "image" && selectedBackground
            ? selectedBackground.source
            : null;

    return (
        <View style={styles.section}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Preview</Text>
                <Ionicons name="eye-outline" size={20} color="#5c3d2e" />
            </View>

            <View style={styles.card}>
                <ImageBackground
                    source={bgImage || undefined}
                    style={[styles.cardBackground, !bgImage && { backgroundColor: selectedColor }]}
                    imageStyle={styles.cardBackgroundImage}
                >
                    {/* Gradient sama seperti TeamCard */}
                    <LinearGradient
                        colors={["rgba(0,0,0,0.4)", "rgba(119,65,0,0.8)"]}
                        locations={[0, 1]}
                        style={styles.cardGradient}
                    >
                        {/* Title (Group Name) – diletakkan absolute top */}
                        <Text style={styles.cardTitle}>
                            {groupName || "Group Name"}
                        </Text>

                        {/* Info di bagian bawah */}
                        <View style={styles.cardInfo}>
                            <View style={styles.membersRow}>
                                <Ionicons name="people" size={16} color="#fff" />
                                <Text style={styles.cardMembers}>
                                    {members.length} {members.length === 1 ? "Member" : "Members"}
                                </Text>
                            </View>

                            {/* List member hanya 3 pertama, sisanya “+X more” */}
                            {members.length > 0 && (
                                <Text style={styles.memberList}>
                                    {members.slice(0, 3).join(", ")}
                                    {members.length > 3 &&
                                        ` +${members.length - 3} more`}
                                </Text>
                            )}

                            {members.length === 0 && (
                                <Text style={styles.emptyText}>
                                    Add members to see them here
                                </Text>
                            )}
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    labelContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#5c3d2e",
    },

    /* --- CARD STYLE MIRIP TeamCard --- */
    card: {
        height: 210,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    cardBackground: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    cardBackgroundImage: {
        borderRadius: 16,
    },
    cardGradient: {
        flex: 1,
        padding: 20,
        position: "relative",
    },

    /* Title di atas */
    cardTitle: {
        position: "absolute",
        top: 80,
        left: 20,
        right: 20,
        fontSize: 26,
        fontWeight: "900",
        color: "#fff",
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },

    /* Info di bawah */
    cardInfo: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        gap: 6,
    },

    membersRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    cardMembers: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },

    memberList: {
        fontSize: 15,
        color: "#fff",
        opacity: 0.9,
    },

    emptyText: {
        fontSize: 14,
        color: "rgba(255,255,255,0.8)",
        fontStyle: "italic",
    },
});
