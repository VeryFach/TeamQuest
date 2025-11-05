import React from "react";

import BottomNavBar from "@/components/BottomNavBar";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      {/* Konten app Anda */}
      {/* Konten utama di sini */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          // Tambahkan background dan padding jika perlu
        }}
      >
        <BottomNavBar />
      </View>
    </View>
  );
}
