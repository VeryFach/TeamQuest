// components/project/ProjectHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ProjectHeaderProps = {
    projectName: string;
    projectSubtitle: string;
    projectEmoji: string;
    projectColor: string;
    completedCount: number;
    totalCount: number;
    onBackPress: () => void;
};

export default function ProjectHeader({
    projectName,
    projectSubtitle,
    projectEmoji,
    projectColor,
    completedCount,
    totalCount,
    onBackPress,
}: ProjectHeaderProps) {
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <View style={[styles.header, { backgroundColor: projectColor }]}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={onBackPress}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.projectHeader}>
                <Text style={styles.emoji}>{projectEmoji}</Text>
                <Text style={styles.projectTitle}>{projectName}</Text>
                <Text style={styles.projectSubtitle}>{projectSubtitle}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                        {completedCount} of {totalCount} tasks completed
                    </Text>
                    <Text style={styles.progressPercentage}>
                        {Math.round(progressPercentage)}%
                    </Text>
                </View>
                <View style={styles.progressBar}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { width: `${progressPercentage}%` }
                        ]} 
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 20,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    projectHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 12,
    },
    projectTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 4,
    },
    projectSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    progressContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    progressPercentage: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
});