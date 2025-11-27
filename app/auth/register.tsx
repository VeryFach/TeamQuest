import CustomButton from "@/components/auth/CustomButton";
import CustomInput from "@/components/auth/CustomInput";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  // State untuk form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleRegister = () => {
    console.log("Registering:", { name, email, password });
  };

  const handleGoogleRegister = () => {
    console.log("Google Sign In Clicked");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Title */}
          <Text style={styles.title}>Create An Account</Text>

          {/* Form Inputs */}
          <CustomInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Design Withdesigners"
          />

          <CustomInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="designwithdesigners@gmail.com"
            leftIconName="mail-outline" // Icon surat di kiri
          />

          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            isPassword={true} // Aktifkan toggle mata
          />

          <CustomInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            isPassword={true}
          />

          {/* Spacer */}
          <View style={{ height: 20 }} />

          {/* Primary Button */}
          <CustomButton title="SIGN UP" onPress={handleRegister} />

          {/* Divider Text */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Google Button */}
          <CustomButton
            title="Sign up with Google"
            variant="google"
            onPress={handleGoogleRegister}
          />

          {/* Footer Text */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Have an account already? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDE7", // Warna background kuning pucat (cream)
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#000",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#CCC",
  },
  orText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 12,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#000",
  },
  loginText: {
    fontSize: 14,
    color: "#6A1B9A", // Warna ungu sesuai gambar
    fontWeight: "bold",
  },
});
