import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "./constants";

interface AuthButtonProps {
  onPress: () => void;
  loading: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ onPress, loading }) => (
  <TouchableOpacity style={styles.authButton} onPress={onPress}>
    <MaterialCommunityIcons name="logout" size={20} color={COLORS.danger} />
    <Text style={styles.authButtonText}>
      {loading ? "Loading..." : "Log Out"}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  authButton: {
    flexDirection: "row",
    backgroundColor: "#FFE5E7",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FFD1D6",
  },
  authButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});
