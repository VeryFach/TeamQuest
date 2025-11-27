import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import Komponen yang sudah dipisah
import Header from '../../../components/todo/Header';
import CustomCalendar from '../../../components/todo/CustomCalendar';
import FloatingStatusBar from '../../../components/todo/FloatingStatusBar';
import CompletedList from '../../../components/todo/CompletedList';
import ProjectList from '../../../components/todo/ProjectList';
import GroupSelectorModal from '../../../components/todo/GroupSelectorModal';

export default function TodoListScreen() {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [viewDate, setViewDate] = useState(new Date()); 
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);

  const changeMonth = (increment: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setViewDate(newDate);
  };

  const getHeaderDateLabel = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) return "Today";
    return selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleSelectGroup = (group: any) => {
    console.log("Grup dipilih:", group.name);
    setGroupModalVisible(false);
  };

  return (
    <View style={styles.container}>
      
      {/* 1. Header & Calendar */}
      <Header 
        dateLabel={getHeaderDateLabel()} 
        isCalendarOpen={isCalendarVisible} 
        onToggleCalendar={() => {
          setCalendarVisible(!isCalendarVisible);
          if(!isCalendarVisible) setViewDate(selectedDate);
        }}
      >
        <CustomCalendar 
          visible={isCalendarVisible}
          viewDate={viewDate}
          selectedDate={selectedDate}
          onChangeMonth={changeMonth}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setCalendarVisible(false);
          }}
        />
      </Header>

      {/* 2. Floating Bar */}
      <FloatingStatusBar />

      <ScrollView 
        style={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        
        {/* 3. Horizontal Focus Cards (Bisa dipisah juga kalau mau, tapi ini contoh inline sedikit) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <TouchableOpacity style={styles.addCard}
            onPress={() => setGroupModalVisible(true)}>
            <View style={styles.addIconCircle}>
              <Ionicons name="add" size={30} color="#000000" />
            </View>
            <Text style={styles.addCardText}>Add Task</Text>
          </TouchableOpacity>

          <View style={styles.activeCard}>
            <View>
              <Text style={styles.activeCardTitle}>Daily design exercise</Text>
              <Text style={styles.activeCardSubtitle}>Sprint 14 : Design Checkout</Text>
              <Text style={styles.activeCardMeta}>Tim Produktif • Today</Text>
            </View>
            <Text style={styles.cardEmoji}>🍕</Text>
          </View>
        </ScrollView>

        {/* 4. Completed Section */}
        <CompletedList />

        {/* 5. Projects Section */}
        <ProjectList onAddPress={() => setGroupModalVisible(true)}/>

      </ScrollView>
      <GroupSelectorModal 
        visible={isGroupModalVisible}
        onClose={() => setGroupModalVisible(false)}
        onSelectGroup={handleSelectGroup}
      />
    </View>
  );
}

// Style global yang tersisa hanya container & card kecil di ScrollView
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFBEB' },
  contentContainer: { flex: 1, paddingTop: 10, zIndex: 0 },
  horizontalScroll: { paddingLeft: 25, paddingVertical: 10, marginBottom: 10 },
  addCard: { width: 110, height: 110, backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 2, borderColor: '#000000', borderStyle: 'dashed', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  addIconCircle: { backgroundColor: '#fef3c7', padding: 8, borderRadius: 50, marginBottom: 8 },
  addCardText: { fontWeight: 'bold', color: '#000000', fontSize: 12 },
  activeCard: { backgroundColor: 'white', width: 240, height: 110, padding: 15, borderRadius: 20, marginRight: 25, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, justifyContent: 'space-between', flexDirection: 'row' },
  activeCardTitle: { fontWeight: 'bold', color: '#1f2937', fontSize: 14, width: 140 },
  activeCardSubtitle: { fontSize: 10, color: '#6b7280', marginTop: 4 },
  activeCardMeta: { fontSize: 10, color: '#9ca3af', marginTop: 8 },
  cardEmoji: { fontSize: 24 },
});