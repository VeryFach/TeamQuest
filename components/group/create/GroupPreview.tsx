import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

interface GroupPreviewProps {
    groupName: string;
    members: string[];
    selectedColor: string;
    selectedColorType: 'solid' | 'image';
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
    return (
        <View style={styles.section}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Preview</Text>
                <Ionicons name="eye-outline" size={20} color="#5c3d2e" />
            </View>

            <View style={styles.previewCard}>
                {/* Background */}
                {selectedColorType === 'image' && selectedBackground ? (
                    <>
                        <Image
                            source={selectedBackground.source}
                            style={styles.previewBackgroundImage}
                        />
                        <View style={styles.imageOverlay} />
                    </>
                ) : (
                    <View
                        style={[
                            styles.previewBackgroundColor,
                            { backgroundColor: selectedColor }
                        ]}
                    />
                )}

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                    style={styles.gradientOverlay}
                />

                {/* Content */}
                <View style={styles.previewContent}>
                    <View style={styles.previewHeader}>
                        <View style={styles.groupIcon}>
                            <Ionicons name="people" size={24} color="#fff" />
                        </View>
                        <View style={styles.headerText}>
                            <Text style={styles.previewTitle}>
                                {groupName || "Group Name"}
                            </Text>
                            <Text style={styles.previewSubtitle}>
                                {members.length} {members.length === 1 ? 'member' : 'members'}
                            </Text>
                        </View>
                    </View>

                    {members.length > 0 && (
                        <View style={styles.previewInfo}>
                            <View style={styles.membersHeader}>
                                <Ionicons name="people-outline" size={16} color="#fff" />
                                <Text style={styles.previewLabel}>Members</Text>
                            </View>
                            <View style={styles.memberTags}>
                                {members.slice(0, 3).map((m, i) => (
                                    <View key={i} style={styles.memberTag}>
                                        <View style={styles.miniAvatar}>
                                            <Text style={styles.miniAvatarText}>
                                                {m.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                        <Text style={styles.memberTagText}>{m}</Text>
                                    </View>
                                ))}
                                {members.length > 3 && (
                                    <View style={[styles.memberTag, styles.moreTag]}>
                                        <Ionicons name="add" size={14} color="#fff" />
                                        <Text style={styles.memberTagText}>
                                            {members.length - 3} more
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

                    {members.length === 0 && (
                        <View style={styles.emptyMembers}>
                            <Ionicons name="person-add-outline" size={20} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.emptyMembersText}>
                                Add members to see them here
                            </Text>
                        </View>
                    )}
                </View>
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
    previewCard: {
        borderRadius: 20,
        position: "relative",
        overflow: "hidden",
        minHeight: 220,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
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
    imageOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    previewBackgroundColor: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    gradientOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    previewContent: {
        padding: 20,
        position: "relative",
        zIndex: 1,
    },
    previewHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },
    groupIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.3)",
    },
    headerText: {
        flex: 1,
    },
    previewTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 2,
    },
    previewSubtitle: {
        fontSize: 13,
        color: "rgba(255,255,255,0.8)",
        fontWeight: "500",
    },
    previewInfo: {
        width: "100%",
    },
    membersHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10,
    },
    previewLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#fff",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    memberTags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    memberTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 16,
        gap: 6,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
    },
    moreTag: {
        backgroundColor: "rgba(200, 115, 59, 0.8)",
    },
    miniAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    miniAvatarText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold",
    },
    memberTagText: {
        fontSize: 12,
        color: "#fff",
        fontWeight: "600",
    },
    emptyMembers: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 16,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        borderStyle: "dashed",
    },
    emptyMembersText: {
        fontSize: 13,
        color: "rgba(255,255,255,0.7)",
        fontStyle: "italic",
    },
});