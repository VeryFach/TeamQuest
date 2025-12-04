import CustomButton from "@/components/auth/CustomButton";
import CustomInput from "@/components/auth/CustomInput";
import { useGoogleAuth } from "@/hooks/googleAuth";
import { signUp } from "@/services/auth.service";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState, useMemo } from "react";
import {
  Alert,
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { handleGoogleSignIn, isLoading: googleLoading } = useGoogleAuth();

  // ====== VALIDASI EMAIL ======
  const emailValidation = useMemo(() => {
    if (!email) return { isValid: false, message: "" };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    return {
      isValid,
      message: isValid ? "✓ Email valid" : "✗ Format email tidak valid",
    };
  }, [email]);

  // ====== PASSWORD STRENGTH CHECKER ======
  const passwordStrength = useMemo(() => {
    if (!password) return { strength: 0, label: "", color: "#CCC", criteria: [] };

    let strength = 0;
    const criteria = [];

    // Minimal 8 karakter
    if (password.length >= 8) {
      strength += 20;
      criteria.push({ met: true, text: "Minimal 8 karakter" });
    } else {
      criteria.push({ met: false, text: "Minimal 8 karakter" });
    }

    // Mengandung huruf besar
    if (/[A-Z]/.test(password)) {
      strength += 20;
      criteria.push({ met: true, text: "Huruf besar (A-Z)" });
    } else {
      criteria.push({ met: false, text: "Huruf besar (A-Z)" });
    }

    // Mengandung huruf kecil
    if (/[a-z]/.test(password)) {
      strength += 20;
      criteria.push({ met: true, text: "Huruf kecil (a-z)" });
    } else {
      criteria.push({ met: false, text: "Huruf kecil (a-z)" });
    }

    // Mengandung angka
    if (/[0-9]/.test(password)) {
      strength += 20;
      criteria.push({ met: true, text: "Angka (0-9)" });
    } else {
      criteria.push({ met: false, text: "Angka (0-9)" });
    }

    // Mengandung karakter spesial
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength += 20;
      criteria.push({ met: true, text: "Karakter spesial (!@#$...)" });
    } else {
      criteria.push({ met: false, text: "Karakter spesial (!@#$...)" });
    }

    let label = "";
    let color = "#CCC";

    if (strength <= 40) {
      label = "Lemah";
      color = "#F44336";
    } else if (strength <= 60) {
      label = "Sedang";
      color = "#FF9800";
    } else if (strength <= 80) {
      label = "Kuat";
      color = "#4CAF50";
    } else {
      label = "Sangat Kuat";
      color = "#2196F3";
    }

    return { strength, label, color, criteria };
  }, [password]);

  // ====== VALIDASI PASSWORD MATCH ======
  const passwordMatch = useMemo(() => {
    if (!confirmPassword) return { isValid: false, message: "" };
    const isValid = password === confirmPassword;
    return {
      isValid,
      message: isValid ? "✓ Password cocok" : "✗ Password tidak cocok",
    };
  }, [password, confirmPassword]);

  const handleRegister = async () => {
    // Validasi lengkap sebelum submit
    if (!name.trim()) {
      Alert.alert("Error", "Nama tidak boleh kosong");
      return;
    }

    if (!emailValidation.isValid) {
      Alert.alert("Error", "Email tidak valid");
      return;
    }

    if (passwordStrength.strength < 60) {
      Alert.alert(
        "Password Terlalu Lemah", 
        "Gunakan password yang lebih kuat dengan kombinasi huruf besar, kecil, angka, dan karakter spesial."
      );
      return;
    }

    if (!passwordMatch.isValid) {
      Alert.alert("Error", "Password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Register Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await handleGoogleSignIn();
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Google Login Failed", error.message);
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.title}>Create An Account</Text>

          {/* Name Input */}
          <CustomInput
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Design Withdesigners"
          />

          {/* Email Input dengan Validasi */}
          <View>
            <CustomInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="designwithdesigners@gmail.com"
              leftIconName="mail-outline"
            />
            {email && (
              <Text
                style={[
                  styles.validationText,
                  { color: emailValidation.isValid ? "#4CAF50" : "#F44336" },
                ]}
              >
                {emailValidation.message}
              </Text>
            )}
          </View>

          {/* Password Input dengan Strength Indicator */}
          <View>
            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              isPassword={true}
            />

            {/* Password Strength Bar */}
            {password && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarBackground}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                  Kekuatan Password: {passwordStrength.label}
                </Text>
              </View>
            )}

            {/* Password Criteria Checklist */}
            {password && (
              <View style={styles.criteriaContainer}>
                <Text style={styles.criteriaTitle}>Password harus mengandung:</Text>
                {passwordStrength.criteria.map((criterion, index) => (
                  <View key={index} style={styles.criteriaItem}>
                    <Text
                      style={[
                        styles.criteriaIcon,
                        { color: criterion.met ? "#4CAF50" : "#999" },
                      ]}
                    >
                      {criterion.met ? "✓" : "○"}
                    </Text>
                    <Text
                      style={[
                        styles.criteriaText,
                        { color: criterion.met ? "#4CAF50" : "#666" },
                      ]}
                    >
                      {criterion.text}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Confirm Password Input */}
          <View>
            <CustomInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              isPassword={true}
            />
            {confirmPassword && (
              <Text
                style={[
                  styles.validationText,
                  { color: passwordMatch.isValid ? "#4CAF50" : "#F44336" },
                ]}
              >
                {passwordMatch.message}
              </Text>
            )}
          </View>

          <View style={{ height: 20 }} />

          {/* Sign Up Button */}
          <CustomButton title="SIGN UP" onPress={handleRegister} loading={loading} />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Google Button */}
          <CustomButton
            title="Sign up with Google"
            variant="google"
            onPress={handleGoogle}
            loading={loading}
          />

          {/* Footer */}
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
    backgroundColor: "#FFFDE7",
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
  
  // ====== VALIDATION STYLES ======
  validationText: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    fontWeight: "500",
  },
  
  // ====== PASSWORD STRENGTH STYLES ======
  strengthContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  strengthBarBackground: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  
  // ====== CRITERIA CHECKLIST STYLES ======
  criteriaContainer: {
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  criteriaTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  criteriaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  criteriaIcon: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: "bold",
  },
  criteriaText: {
    fontSize: 12,
    fontWeight: "500",
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
    color: "#6A1B9A",
    fontWeight: "bold",
  },
});