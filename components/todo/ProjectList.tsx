import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 1. Import Data yang tadi dibuat
import { PROJECTS_DATA } from '../../constants/projectsData';

interface ProjectListProps {
  onAddPress: () => void;
}

export default function ProjectList({ onAddPress }: ProjectListProps) {
  const router = useRouter();

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Projects Uncompleted</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
         
         {/* Tombol Add Project (Tetap Statis) */}
         <TouchableOpacity style={[styles.addCard, { height: 140, marginRight: 15 }]} onPress={onAddPress}>
          <View style={styles.addIconCircle}>
            <Ionicons name="add" size={30} color="#000000" />
          </View>
          <Text style={styles.addCardText}>Add Project</Text>
        </TouchableOpacity>

        {/* 2. RENDERING DINAMIS DARI DATA */}
        {PROJECTS_DATA.map((project) => {
          
          // --- LOGIKA MATEMATIKA (MENGGANTIKAN HARDCODE) ---
          const totalTasks = project.tasks.length;
          const completedTasks = project.tasks.filter(t => t.completed).length;
          // Hitung persen lebar bar (misal: 7/7 = 100%, 5/8 = 62.5%)
          const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

          return (
            <TouchableOpacity 
              key={project.id} 
              style={[styles.projectCard, { backgroundColor: project.bgColor }]} 
              // Kita bisa kirim ID project agar detail.tsx tahu project mana yang dibuka (opsional next step)
              onPress={() => router.push('/todo/detail')}
            >
              
              {/* Bagian Atas */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <View style={{ marginRight: 12 }}>
                    <Text style={{ fontSize: 35 }}>{project.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}> 
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    <Text style={styles.projectSubtitle}>{project.subtitle}</Text>
                  </View>
              </View>

              {/* Bagian Bawah (Progress Bar Otomatis) */}
              <View style={{ marginTop: 5 }}>
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5}}>
                      {/* Teks Angka Dinamis */}
                      <Text style={{color: '#fde68a', fontSize: 10}}>
                        {completedTasks}/{totalTasks} Tasks
                      </Text>
                  </View>
                  
                  {/* Track Bar (Gelap) */}
                  <View style={{height: 6, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 3}}>
                      {/* Isi Bar (Putih) - Lebar sesuai persen */}
                      <View 
                        style={{
                          width: `${progressPercent}%`, // <--- INI KUNCINYA
                          height: 6, 
                          backgroundColor: 'white', 
                          borderRadius: 3
                        }} 
                      />
                  </View>
              </View>
            </TouchableOpacity>
          );
        })}

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
  
  // Style ProjectCard tetap sama
  projectCard: { width: 250, height: 140, borderRadius: 20, padding: 20, marginRight: 25, justifyContent: 'space-between' },
  projectTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, marginTop: 5 },
  projectSubtitle: { color: '#fde68a', fontSize: 12 },
});