import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function FloatingStatusBar() {
  return (
    <View style={styles.floatingBarContainer}>
      <View style={styles.unfinishedBadge}>
        <Text style={styles.unfinishedText}>! 5 Unfinished</Text>
      </View>
      <View style={styles.filterGroup}>
        <TouchableOpacity style={styles.filterBtnActive}>
          <Text style={styles.filterTextActive}>Group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterText}>Private</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBarContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginTop: 20, alignItems: 'center', marginBottom: 10, zIndex: 1 },
  unfinishedBadge: { backgroundColor: '#f87171', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, elevation: 3 },
  unfinishedText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  filterGroup: { backgroundColor: 'white', flexDirection: 'row', padding: 4, borderRadius: 25, elevation: 3 },
  filterBtnActive: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  filterBtn: { paddingHorizontal: 15, paddingVertical: 6 },
  filterTextActive: { fontWeight: 'bold', color: '#4b5563', fontSize: 12 },
  filterText: { color: '#9ca3af', fontSize: 12 },
});