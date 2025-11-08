import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../../components/BottomNavBar";
import { Colors } from "../../constants/theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const gradientColors =
    Colors[colorScheme === "dark" ? "dark" : "light"].gradientBackground;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={gradientColors as [string, string]}
        style={{ ...StyleSheet.absoluteFillObject, zIndex: -1 }}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
          sceneStyle: { backgroundColor: "transparent" },
        }}
      />
      <BottomNavBar />
    </SafeAreaView>
  );
}
