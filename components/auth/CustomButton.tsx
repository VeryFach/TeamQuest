import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "google"; // Varian style tombol
  style?: ViewStyle;
  loading?: boolean;
}
const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  loading,
}) => {
  const isGoogle = variant === "google";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isGoogle ? styles.googleButton : styles.primaryButton,
        style,
      ]}
      disabled={loading}
    >
      {isGoogle && (
        <Ionicons
          name="logo-google"
          size={20}
          color="black"
          style={styles.icon}
        />
      )}
      <Text
        style={[styles.text, isGoogle ? styles.googleText : styles.primaryText]}
      >
        {loading ? "Loading..." : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    elevation: 2, // Shadow android
    shadowColor: "#000", // Shadow iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    backgroundColor: "#CD7542", // Warna Terracotta sesuai gambar
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  googleText: {
    color: "#333333",
  },
  icon: {
    marginRight: 10,
  },
});

export default CustomButton;
