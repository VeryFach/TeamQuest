import CustomButton from "@/components/auth/CustomButton";
import CustomInput from "@/components/auth/CustomInput";
import { useGoogleAuth } from "@/hooks/googleAuth";
import { signIn } from "@/services/auth.service";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { handleGoogleSignIn, isLoading: googleLoading } = useGoogleAuth();

  const router = useRouter();
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
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
          {/* Logo Section */}
          <View style={styles.headerContainer}>
            {/* Ganti dengan logo lokal: require('../assets/logo.png') */}
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2921/2921226.png",
              }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue</Text>
          </View>

          {/* Form Inputs */}
          <CustomInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="designwithdesigners@gmail.com"
          />

          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            isPassword={true}
          />

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => console.log("Forgot Password Pressed")}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button (Primary) */}
          <CustomButton
            title="LOG IN"
            onPress={handleLogin}
            loading={loading}
          />

          {/* Divider Text (OR) */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Google Button */}
          <CustomButton
            title="Login with Google"
            variant="google"
            onPress={handleGoogle}
            loading={loading}
          />

          {/* Footer Text */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text style={styles.signupText}>Sign up now</Text>
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
    backgroundColor: "#FFFDE7", // Warna cream background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#6A1B9A", // Warna ungu
    fontWeight: "bold",
    fontSize: 14,
  },
  // Style untuk Divider (Garis OR)
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
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
    fontWeight: "bold",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#000",
  },
  signupText: {
    fontSize: 14,
    color: "#6A1B9A",
    fontWeight: "bold",
  },
});
