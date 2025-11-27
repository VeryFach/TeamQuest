import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Interface untuk data Group
interface GroupData {
  id: string;
  name: string;
}

interface GroupSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGroup: (group: GroupData) => void;
}

// Data Dummy
const DUMMY_GROUPS: GroupData[] = [
  { id: '1', name: 'Tim Produktif' },
  { id: '2', name: 'Team Produk UI/UX' },
  { id: '3', name: 'ABC' },
  { id: '4', name: 'CDE' },
];

export default function GroupSelectorModal({ visible, onClose, onSelectGroup }: GroupSelectorModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* 2. GANTI View BIASA MENJADI BlurView */}
      <BlurView intensity={50} tint="light" style={styles.overlay}>
        
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>SELECT GROUP</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* List Group */}
          <View style={styles.listContainer}>
            {DUMMY_GROUPS.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.groupButton}
                onPress={() => onSelectGroup(item)}
              >
                <Text style={styles.groupButtonText}>{item.name}</Text>
                {/* Dekorasi titik putih kecil di kanan */}
                <View style={styles.dotDecoration} />
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', <--- HAPUS INI (Warna gelap sudah dari tint="dark")
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    // Tambahkan shadow agar modal terlihat melayang di atas blur
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    textAlign: 'center',
    marginLeft: 24, 
  },
  listContainer: {
    gap: 10, 
  },
  groupButton: {
    backgroundColor: '#cc7038', 
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  groupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dotDecoration: {
    position: 'absolute',
    right: 15, // Saya atur posisinya biar terlihat
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    display: 'none' // Ubah jadi 'flex' jika ingin titik putihnya muncul
  }
});