import { Tabs } from "expo-router";
import { View } from "react-native";
import BottomNavBar from "../../components/BottomNavBar"; // sesuaikan path

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <BottomNavBar />
    </View>
  );
}
