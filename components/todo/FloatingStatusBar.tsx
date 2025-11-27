import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

// 1. Definisikan tipe data props yang diterima
interface FloatingStatusBarProps {
  activeTab: 'group' | 'private';
  onTabChange: (tab: 'group' | 'private') => void;
}

export default function FloatingStatusBar({ activeTab, onTabChange }: FloatingStatusBarProps) {
  return (
    <View style={styles.floatingBarContainer}>
      <View style={styles.unfinishedBadge}>
        <Text style={styles.unfinishedText}>! 5 Unfinished</Text>
      </View>
      
      {/* Container Toggle */}
      <View style={styles.filterGroup}>
        
        {/* Tombol GROUP */}
        <TouchableOpacity 
          style={[
            styles.baseBtn, 
            activeTab === 'group' ? styles.activeBtn : styles.inactiveBtn
          ]}
          onPress={() => onTabChange('group')}
        >
          <Text style={[
            styles.baseText,
            activeTab === 'group' ? styles.activeText : styles.inactiveText
          ]}>
            Group
          </Text>
        </TouchableOpacity>

        {/* Tombol PRIVATE */}
        <TouchableOpacity 
          style={[
            styles.baseBtn, 
            activeTab === 'private' ? styles.activeBtn : styles.inactiveBtn
          ]}
          onPress={() => onTabChange('private')}
        >
          <Text style={[
            styles.baseText,
            activeTab === 'private' ? styles.activeText : styles.inactiveText
          ]}>
            Private
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginTop: 20, 
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 1,
  },
  unfinishedBadge: {
    backgroundColor: '#f87171',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width:0, height:2}
  },
  unfinishedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  
  // --- Style Toggle Group/Private ---
  filterGroup: {
    backgroundColor: '#f3f4f6', // Warna background abu-abu muda (track)
    flexDirection: 'row',
    padding: 4,
    borderRadius: 25,
    elevation: 2, // Sedikit bayangan di container utama
  },
  baseBtn: {
    paddingHorizontal: 20, // Lebar tombol
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeBtn: {
    backgroundColor: 'white', // Tombol aktif warna putih
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inactiveBtn: {
    backgroundColor: 'transparent', // Tombol tidak aktif transparan
  },
  baseText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#374151', // Teks aktif (gelap)
  },
  inactiveText: {
    color: '#9ca3af', // Teks tidak aktif (abu-abu)
  }
});