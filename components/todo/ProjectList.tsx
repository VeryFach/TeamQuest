import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ProjectListProps {
  onAddPress: () => void; // Fungsi callback saat tombol Add ditekan
}

export default function ProjectList({ onAddPress }: ProjectListProps) {
  const router = useRouter();

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Projects Uncompleted</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
         <TouchableOpacity style={[styles.addCard, { height: 140, marginRight: 15 }]} onPress={onAddPress}>
          <View style={styles.addIconCircle}>
            <Ionicons name="add" size={30} color="#000000" />
          </View>
          <Text style={styles.addCardText}>Add Project</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.projectCard} onPress={() => router.push('/detail' as any)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ marginRight: 12 }}><Text style={{ fontSize: 35 }}>🍕</Text></View>
              <View style={{ flex: 1 }}> 
                <Text style={styles.projectTitle}>Sprint 14: Design Checkout</Text>
                <Text style={styles.projectSubtitle}>Pizza Party!</Text>
              </View>
          </View>
          <View style={{ marginTop: 5 }}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5}}>
                  <Text style={{color: '#fde68a', fontSize: 10}}>5/8 Tasks</Text>
              </View>
              <View style={{height: 6, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 3}}>
                  <View style={{width: '60%', height: 6, backgroundColor: 'white', borderRadius: 3}} />
              </View>
          </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.projectCard, { backgroundColor: 'purple' }]} onPress={() => router.push('/detail' as any)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ marginRight: 12 }}><Text style={{ fontSize: 35 }}>🎮</Text></View>
              <View style={{ flex: 1 }}> 
                <Text style={styles.projectTitle}>Sprint 15: Design Base</Text>
                <Text style={styles.projectSubtitle}>Gaming Mania!</Text>
              </View>
          </View>
          <View style={{ marginTop: 5 }}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5}}>
                  <Text style={{color: '#fde68a', fontSize: 10}}>5/8 Tasks</Text>
              </View>
              <View style={{height: 6, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 3}}>
                  <View style={{width: '60%', height: 6, backgroundColor: 'white', borderRadius: 3}} />
              </View>
          </View>
          </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginTop: 10, marginBottom: 10, alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#78350f' },
  horizontalScroll: { paddingLeft: 25, paddingVertical: 10, marginBottom: 10 },
  addCard: { width: 110, height: 110, backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 2, borderColor: '#000000', borderStyle: 'dashed', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  addIconCircle: { backgroundColor: '#fef3c7', padding: 8, borderRadius: 50, marginBottom: 8 },
  addCardText: { fontWeight: 'bold', color: '#000000', fontSize: 12 },
  projectCard: { backgroundColor: '#b45309', width: 250, height: 140, borderRadius: 20, padding: 20, marginRight: 25, justifyContent: 'space-between' },
  projectTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, marginTop: 5 },
  projectSubtitle: { color: '#fde68a', fontSize: 12 },
});