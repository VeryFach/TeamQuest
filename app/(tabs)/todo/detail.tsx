import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'; // Tambah TextInput
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Header from '../../../components/todo/Header';
import CustomCalendar from '../../../components/todo/CustomCalendar';

export default function DetailProjectScreen() {
  const router = useRouter();

  // --- STATE HEADER ---
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [viewDate, setViewDate] = useState(new Date()); 

  // --- STATE UNTUK ADD TASK BARU ---
  const [isAdding, setIsAdding] = useState(false); // Saklar tampilan
  const [newTaskText, setNewTaskText] = useState(''); // Menyimpan teks input

  const changeMonth = (increment: number) => { const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setViewDate(newDate); };
  const getHeaderDateLabel = () => { const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) return "Today";
    return selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); };

  // Data Tasks
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Wireframe User Flow', completed: true },
    { id: 2, title: 'Create Interactive Prototype', completed: true },
    { id: 3, title: 'User Test Round 1', completed: true },
    { id: 4, title: 'Handoff to Dev', completed: true },
    { id: 5, title: 'Presentation to customer', completed: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // --- FUNGSI MENAMBAH TASK ---
  const handleSaveTask = () => {
    if (newTaskText.trim() === '') return; // Jangan simpan kalau kosong

    const newTask = {
      id: Date.now(), // ID unik pakai waktu sekarang
      title: newTaskText,
      completed: false
    };

    setTasks([...tasks, newTask]); // Masukkan ke list
    setNewTaskText(''); // Kosongkan input
    setIsAdding(false); // Tutup form
  };

  // Hitung Progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <View style={styles.container}>
      
      <Header 
        dateLabel={getHeaderDateLabel()} 
        isCalendarOpen={isCalendarVisible} 
        onToggleCalendar={() => setCalendarVisible(!isCalendarVisible)}
      >
        <CustomCalendar 
          visible={isCalendarVisible}
          viewDate={viewDate}
          selectedDate={selectedDate}
          // @ts-ignore
          onChangeMonth={changeMonth}
          // @ts-ignore
          onSelectDate={(date) => { setSelectedDate(date); setCalendarVisible(false); }}
        />
      </Header>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => router.navigate('/todo')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>Sprint 14 : Design Checkout Flow</Text>

        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.iconContainer}><Text style={{fontSize: 40}}>🍕</Text></View>
            <View style={{flex: 1}}>
              <Text style={styles.heroTitle}>Pizza Party!</Text>
              <View style={styles.progressSection}>
                 <View style={styles.progressBarTrack}>
                    <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                 </View>
                 <Text style={styles.progressText}>{completedTasks}/{totalTasks} Tasks</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.taskListContainer}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true} style={{ width: '100%' }}>
              <View style={{ gap: 15, paddingBottom: 10 }}> 
                {tasks.map((task) => (
                  <TouchableOpacity key={task.id} style={styles.taskItem} onPress={() => toggleTask(task.id)}>
                    <Ionicons name={task.completed ? "checkbox" : "square-outline"} size={24} color={task.completed ? "#374151" : "#9ca3af"} />
                    <Text style={[styles.taskText, task.completed && styles.taskTextCompleted]}>{task.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
        </View>

        {/* --- BAGIAN LOGIKA ADD TASK (BERUBAH) --- */}
        {isAdding ? (
          // TAMPILAN FORM INPUT (Putih)
          <View style={styles.inputCard}>
            <TextInput 
              style={styles.textInput}
              placeholder="Create task"
              placeholderTextColor="#9ca3af"
              value={newTaskText}
              onChangeText={setNewTaskText}
              autoFocus={true} // Otomatis keyboard muncul
            />
            <View style={styles.actionButtons}>
              {/* Tombol DONE (Hijau) */}
              <TouchableOpacity style={styles.doneButton} onPress={handleSaveTask}>
                <Text style={styles.doneButtonText}>Done</Text>
                <Ionicons name="checkmark" size={16} color="white" />
              </TouchableOpacity>
              
              {/* Tombol CANCEL (X Merah) */}
              <TouchableOpacity onPress={() => setIsAdding(false)} style={{ marginLeft: 10 }}>
                <Ionicons name="close" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // TAMPILAN TOMBOL KUNING BIASA
          <TouchableOpacity style={styles.addTaskButton} onPress={() => setIsAdding(true)}>
             <Text style={styles.addTaskButtonText}>Add Task +</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (Styles lain tetap sama, copy dari file sebelumnya) ...
  container: { flex: 1, backgroundColor: '#FFFBEB' },
  scrollContent: { padding: 25, paddingBottom: 50 },
  navRow: { marginBottom: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, fontWeight: 'bold', marginLeft: 5, color: '#1f2937' },
  pageTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  heroCard: { backgroundColor: '#a95325', borderRadius: 20, padding: 20, marginBottom: 25, shadowColor: '#a95325', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  heroContent: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: { marginRight: 15 },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 15 },
  progressSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBarTrack: { flex: 1, height: 6, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 3 },
  progressBarFill: { height: '100%', backgroundColor: 'white', borderRadius: 3 },
  progressText: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
  taskListContainer: { maxHeight: 320, marginBottom: 25 },
  taskItem: { backgroundColor: 'white', padding: 15, borderRadius: 15, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginHorizontal: 2 },
  taskText: { fontSize: 14, color: '#374151', marginLeft: 12, fontWeight: '500' },
  taskTextCompleted: { color: '#374151' },
  
  // --- STYLE UNTUK TOMBOL ADD TASK (Kuning) ---
  addTaskButton: {
    backgroundColor: '#fcd34d',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  addTaskButtonText: {
    fontWeight: 'bold',
    color: '#1f2937',
    fontSize: 16,
  },

  // --- STYLE BARU UNTUK INPUT FORM ---
  inputCard: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6'
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doneButton: {
    backgroundColor: '#22c55e', // Hijau terang
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 5,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginRight: 4,
  }
});