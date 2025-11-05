import { Ionicons } from "@expo/vector-icons";
import { House } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const BottomNavBar = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = [
    { name: "Home", icon: "house", activeIcon: "house" },
    { name: "Group", icon: "people-outline", activeIcon: "people-outline" },
    {
      name: "To do list",
      icon: "checkmark-done-outline",
      activeIcon: "checkmark-done-outline",
    },
    { name: "Account", icon: "person-outline", activeIcon: "person-outline" },
  ] as const;

  return (
    <View style={styles.navWrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.name)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              {tab.name === "Home" ? (
                activeTab === tab.name ? (
                  <>
                    <View style={styles.waveBackground}>
                      <Svg
                        width="95"
                        height="24"
                        viewBox="0 0 66 15"
                        fill="#ffff"
                      >
                        <Path d="M33 0.5C16.5 0.5 13.5 14.5 0 14.5H66C52.5 14.5 49.5 0.5 33 0.5Z" />
                      </Svg>
                    </View>
                    <View style={styles.activeCircleAbsolute}>
                      <House size={24} color="#000000ff" />
                    </View>
                  </>
                ) : (
                  <House size={24} color="#999" />
                )
              ) : activeTab === tab.name ? (
                <>
                  <View style={styles.waveBackground}>
                    <Svg
                      width="95"
                      height="24"
                      viewBox="0 0 66 15"
                      fill="#ffff"
                    >
                      <Path d="M33 0.5C16.5 0.5 13.5 14.5 0 14.5H66C52.5 14.5 49.5 0.5 33 0.5Z" />
                    </Svg>
                  </View>
                  <View style={styles.activeCircleAbsolute}>
                    <Ionicons
                      name={tab.activeIcon}
                      size={24}
                      color="#000000ff"
                    />
                  </View>
                </>
              ) : (
                <Ionicons name={tab.icon} size={24} color="#999" />
              )}
            </View>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.name && styles.activeTabText,
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navWrapper: {
    backgroundColor: "white",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingVertical: 5,
    paddingHorizontal: 8,
    // Hapus elevation dari sini
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  // INI MENGGANTIKAN unionCircle
  waveBackground: {
    position: "absolute",
    top: -33, // Sesuaikan ini untuk menaik/turunkan gelombang
    zIndex: 0,
  },
  iconWrapper: {
    height: 25,
    width: 44, // Lebar ini harus cukup untuk icon
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  activeCircleAbsolute: {
    backgroundColor: "#F3E4BD",
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -25, // naik ke atas
    zIndex: 1, // Pastikan di atas gelombang putih
  },
  tabText: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },
  activeTabText: {
    color: "#000000ff",
    fontWeight: "500",
  },
});
export default BottomNavBar;
