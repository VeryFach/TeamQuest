import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "./constants";

interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = "Raka",
  avatarUrl = "https://i.pravatar.cc/150?img=12",
}) => (
  <View style={styles.header}>
    <View style={styles.userInfo}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <View>
        <Text style={styles.greetingText}>Welcome back,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
    </View>
    <TouchableOpacity style={styles.iconContainer}>
      <Ionicons
        name="notifications-outline"
        size={24}
        color={COLORS.textDark}
      />
      <View style={styles.badge} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  greetingText: { fontSize: 13, color: COLORS.textLight, marginBottom: 2 },
  userName: { fontSize: 22, fontWeight: "bold", color: COLORS.textDark },
  iconContainer: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
