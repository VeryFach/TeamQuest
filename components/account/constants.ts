import { Dimensions } from "react-native";

export const screenWidth = Dimensions.get("window").width;

export const COLORS = {
  background: "#FFFBF5",
  primary: "#FF8C66",
  primaryLight: "#FFF0EB",
  secondary: "#FFDAB9",
  textDark: "#2D3436",
  textLight: "#8D99AE",
  white: "#FFFFFF",
  charts: ["#FF6B6B", "#4ECDC4", "#FFE66D"],
  gray: "#F0F0F0",
  danger: "#FF4757",
};

export const FILTER_TYPES = ["Week", "Month", "Year"];

export const CHART_CONFIG = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  color: (opacity = 1) => `rgba(255, 140, 102, ${opacity})`,
  labelColor: (opacity = 1) => COLORS.textLight,
  strokeWidth: 3,
  decimalPlaces: 0,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#fff",
  },
  propsForBackgroundLines: {
    strokeDasharray: "",
    stroke: "#F3F3F3",
  },
};
