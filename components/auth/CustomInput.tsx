import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isPassword?: boolean; // Untuk mengaktifkan fitur hide/show password
  leftIconName?: keyof typeof Ionicons.glyphMap; // Ikon opsional di kiri
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword = false,
  leftIconName,
}) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {/* Ikon Kiri (misal: amplop email) */}
        {leftIconName && (
          <Ionicons
            name={leftIconName}
            size={24}
            color="black"
            style={styles.iconLeft}
          />
        )}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={isSecure}
          autoCapitalize="none"
        />

        {/* Toggle Password (Mata) */}
        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
              style={styles.iconRight}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1A1A1A",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    height: 50,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingHorizontal: 8,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
});

export default CustomInput;
