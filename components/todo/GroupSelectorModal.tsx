import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
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

// Data Dummy (Banyak data untuk tes scroll)
const DUMMY_GROUPS: GroupData[] = [
  { id: '1', name: 'Tim Produktif' },
  { id: '2', name: 'Team Produk UI/UX' },
  { id: '3', name: 'ABC' },
  { id: '4', name: 'CDE' },
  { id: '5', name: 'Tim Produktif 2' },
  { id: '6', name: 'Team Produk UI/UX 2' },
  { id: '7', name: 'ABC 2' },
  { id: '8', name: 'CDE 2' },
];

export default function GroupSelectorModal({ visible, onClose, onSelectGroup }: GroupSelectorModalProps) {
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
            <Text style={styles.title}>SELECT GROUP</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* PERUBAHAN DI SINI: */}
          {/* 1. Ganti View jadi ScrollView */}
          {/* 2. Pindahkan gap ke contentContainerStyle */}
          <ScrollView 
            style={styles.listContainer} 
            contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
            showsVerticalScrollIndicator={true} // Menampilkan scrollbar
          >
            {DUMMY_GROUPS.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.groupButton}
                onPress={() => onSelectGroup(item)}
              >
                <Text style={styles.groupButtonText}>{item.name}</Text>
                <View style={styles.dotDecoration} />
              </TouchableOpacity>
            ))}
          </ScrollView>

        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
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
    maxHeight: 200, 
    width: '100%',
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
    right: 15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    display: 'none' 
  }
});