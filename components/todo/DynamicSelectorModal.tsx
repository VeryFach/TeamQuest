import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Tipe generic untuk item data
interface DynamicSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;

  // Data dinamis
  data: any[];

  // Field apa yang mau ditampilkan sebagai teks? (misal: 'name', 'group', 'label')
  displayKey?: string;

  // Opsional: Jika ingin manual handling tanpa route otomatis
  onSelect?: (item: any) => void;

  // Opsional: Jika ingin otomatis pindah halaman (contoh: "/group/[id]")
  routePath?: string;
}

export default function DynamicSelectorModal({
  visible,
  onClose,
  title = "SELECT ITEM",
  data = [],
  displayKey = "name", // Default field yang dibaca
  onSelect,
  routePath,
}: DynamicSelectorModalProps) {
  const router = useRouter();

  const handlePress = (item: any) => {
    // 1. Tutup modal dulu
    onClose();

    // 2. Jika ada callback manual, jalankan
    if (onSelect) {
      onSelect(item);
    }

    // 3. Jika ada routePath, lakukan navigasi
    if (routePath) {
      // Asumsi: item selalu punya 'id' untuk parameter
      router.push({
        pathname: routePath,
        params: { id: item.id },
      } as any);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={50} tint="light" style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title.toUpperCase()}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.listContainer}
            contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
            showsVerticalScrollIndicator={true}
          >
            {data.map((item, index) => {
              // Ambil teks berdasarkan displayKey, fallback ke string kosong jika error
              const label = item[displayKey] || "Unknown";
              const itemId = item.id || index.toString();

              return (
                <TouchableOpacity
                  key={itemId}
                  style={styles.groupButton}
                  onPress={() => handlePress(item)}
                >
                  <Text style={styles.groupButtonText}>{label}</Text>

                  {/* Indikator panah kecil agar terlihat clickable */}
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="rgba(255,255,255,0.6)"
                  />
                </TouchableOpacity>
              );
            })}

            {/* Tampilkan pesan jika data kosong */}
            {data.length === 0 && (
              <Text style={styles.emptyText}>No options available</Text>
            )}
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    maxHeight: "60%", // Agar tidak terlalu panjang di layar kecil
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    flex: 1,
    textAlign: "center",
    marginLeft: 24,
  },
  listContainer: {
    width: "100%",
  },
  groupButton: {
    backgroundColor: "#cc7038",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between", // Teks kiri, panah kanan
    alignItems: "center",
  },
  groupButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
