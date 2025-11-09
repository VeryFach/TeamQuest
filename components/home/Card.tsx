import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
// Asumsikan Anda mengimpor fungsi warna dari file di atas
// import { TaskRewardCardData } from './types'; // Jika menggunakan TypeScript

interface TaskRewardCardData {
  group_name: string;
  reward: string;
  reward_emot: string; // Emoji
  tasks_total: number;
  tasks_completed: number;
}

const colorMap: { [key: string]: string } = {
  "🎮": "#3A7D44", // Hijau tua/militer untuk Gaming
  "🍕": "#CC5500", // Oranye tua/coklat untuk Pizza
  "🏆": "#FFD700", // Emas untuk Trofi
  "🥳": "#FF69B4", // Pink cerah untuk Pesta
  // Tambahkan emoji dan warna lain sesuai kebutuhan
};
const getBackgroundColor = (emot: string): string => {
  return colorMap[emot] || "#607D8B"; // Warna default (abu-abu)
};

const getAccentColor = (emot: string): string => {
  // Warna aksen bisa berupa variasi terang dari warna utama
  if (emot === "🎮") return "#66BB6A";
  if (emot === "🍕") return "#FF7043";
  if (emot === "🏆") return "#FFE082";
  if (emot === "🥳") return "#F06292";
  return "#90A4AE";
};

const { width } = Dimensions.get("window");

// Data contoh dari permintaan Anda
const sampleData = {
  group_name: "Private",
  reward: "Gaming!",
  reward_emot: "🎮",
  tasks_total: 4,
  tasks_completed: 2,
};

const RewardCard = ({ data = sampleData }) => {
  const { group_name, reward, reward_emot, tasks_total, tasks_completed } =
    data;

  const backgroundColor = getBackgroundColor(reward_emot);
  const accentColor = getAccentColor(reward_emot);
  const progress = tasks_completed / tasks_total;

  return (
    <View style={[styles.cardContainer, { backgroundColor: backgroundColor }]}>
      {/* Bagian Atas: Emot & Judul */}
      <View style={styles.header}>
        <Text style={styles.rewardEmot}>{reward_emot}</Text>
        <View style={styles.textGroup}>
          <Text style={styles.rewardText}>{reward}</Text>
          <Text style={styles.groupText}>Group: {group_name}</Text>
        </View>
      </View>

      {/* Bar Progres */}
      <View style={styles.progressBarBackground}>
        {/* Progres yang sudah selesai */}
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${progress * 100}%`,
              backgroundColor: accentColor,
            },
          ]}
        />
        {/* Progres yang belum selesai (untuk efek gradien/warna latar belakang) */}
        <View
          style={[
            styles.progressBarRemaining,
            {
              width: `${(1 - progress) * 100}%`,
              backgroundColor: `${accentColor}50`, // Warna aksen dengan opasitas
            },
          ]}
        />
      </View>

      {/* Bagian Bawah: Jumlah Tugas */}
      <Text style={styles.tasksStatus}>
        {tasks_completed}/{tasks_total} Tasks Completed
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.9, // 90% lebar layar
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rewardEmot: {
    fontSize: 50,
    marginRight: 15,
    // Perlu diperhatikan bahwa emoji mungkin tidak terlihat dengan baik di latar belakang gelap.
    // Anda mungkin perlu menambahkan shadow/stroke pada emoji jika latar belakangnya sangat gelap.
  },
  textGroup: {
    flex: 1,
  },
  rewardText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white", // Teks putih untuk kontras dengan latar belakang gelap
  },
  groupText: {
    fontSize: 16,
    color: "#E0E0E0", // Teks abu-abu terang
    opacity: 0.8,
  },
  progressBarBackground: {
    marginVertical: 10,
    height: 5,
    borderRadius: 5,
    flexDirection: "row",
    overflow: "hidden", // Penting untuk memastikan fill tidak melebihi batas
    // marginBottom: 10,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressBarRemaining: {
    height: "100%",
  },
  tasksStatus: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    marginTop: 5,
  },
});

export default RewardCard;
