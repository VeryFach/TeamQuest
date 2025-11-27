import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
export default function TodoListScreen() {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [viewDate, setViewDate] = useState(new Date()); 

  // --- LOGIKA KALENDER ---
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Fungsi ganti bulan (Maju/Mundur)
  const changeMonth = (increment: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setViewDate(newDate);
  };

  // Helper untuk format tampilan tanggal di Header
  const getHeaderDateLabel = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today";
    }
    return selectedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Helper untuk generate grid tanggal sesuai bulan asli
  const renderCalendarGrid = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = [];

    // 1. Kotak kosong untuk hari sebelum tanggal 1
    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // 2. Render tanggal 1 sampai selesai
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;

      grid.push(
        <TouchableOpacity 
          key={day} 
          style={[styles.calendarDay, isSelected && styles.calendarDaySelected]}
          onPress={() => {
            const newDate = new Date(year, month, day);
            setSelectedDate(newDate);
            setCalendarVisible(false);
          }}
        >
          <Text style={[styles.calendarDayText, isSelected && styles.calendarDayTextSelected]}>{day}</Text>
        </TouchableOpacity>
      );
    }
    return grid;
  };

  return (
    <View style={styles.container}>
      {/* --- HEADER SECTION --- */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            {/* Tombol Judul Tanggal */}
            <TouchableOpacity 
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                setCalendarVisible(!isCalendarVisible);
                if(!isCalendarVisible) setViewDate(selectedDate);
              }}
            >
               <Text style={styles.headerTitle}>{getHeaderDateLabel()}</Text>
               <Ionicons 
                  name={isCalendarVisible ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="white" 
                  style={{marginLeft: 5}} 
               />
            </TouchableOpacity>
            
            <Text style={styles.headerSubtitle}>3 Unfinished Tasks</Text>
          </View>
        </View>

        {/* --- CUSTOM CALENDAR POPUP --- */}
        {isCalendarVisible && (
          <LinearGradient
            colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }}   
            style={styles.calendarContainer} 
          >
            {/* Calendar Header (Navigasi Bulan) */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Ionicons name="chevron-back" size={20} color="#78350f" />
              </TouchableOpacity>
              
              <View style={styles.calendarMonthSelector}>
                <Text style={styles.calendarMonthText}>{monthNames[viewDate.getMonth()]}</Text>
                {/* <Ionicons name="chevron-down" size={14} color="#78350f" /> */}
                <Text style={styles.calendarMonthText}> {viewDate.getFullYear()}</Text>
                {/* <Ionicons name="chevron-down" size={14} color="#78350f" /> */}
              </View>
              
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Ionicons name="chevron-forward" size={20} color="#78350f" />
              </TouchableOpacity>
            </View>

            {/* Days Name Row */}
            <View style={styles.weekRow}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <Text key={day} style={styles.weekText}>{day}</Text>
              ))}
            </View>

            {/* Dates Grid */}
            <View style={styles.daysGrid}>
              {renderCalendarGrid()}
            </View>
          </LinearGradient>
        )}
        
        {/* --- PROGRESS BAR SECTION --- */}
        <View style={styles.progressContainer}>
          {!isCalendarVisible && (
            <View style={{ width: '100%' }}>
                {/* 1. Teks Angka */}
                <View style={{ alignItems: 'flex-end', marginBottom: 5 }}>
                    <Text style={styles.percentageText}>68<Text style={styles.percentSymbol}>%</Text></Text>
                </View>
                
                {/* 2. Garis Bar (Track Gelap) */}
                <View style={{ height: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, width: '100%' }}>
                    {/* 3. Garis Isi (Fill Putih) - width diatur sesuai persen */}
                    <View style={{ height: '100%', backgroundColor: 'white', borderRadius: 4, width: '68%' }} />
                </View>
            </View>
          )}
        </View>

        {/* Decorative Circle Background */}
        <View style={styles.decorativeCircle} />
      </View>

      {/* --- FLOATING STATUS BAR --- */}
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

      <ScrollView 
        style={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* --- HORIZONTAL CARDS (Today's Focus) --- */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {/* Add Task Button */}
          <TouchableOpacity style={styles.addCard}>
            <View style={styles.addIconCircle}>
              <Ionicons name="add" size={30} color="#000000" />
            </View>
            <Text style={styles.addCardText}>Add Task</Text>
          </TouchableOpacity>

          {/* Active Task Card */}
          <View style={styles.activeCard}>
            <View>
              <Text style={styles.activeCardTitle}>Daily design exercise</Text>
              <Text style={styles.activeCardSubtitle}>Sprint 14 : Design Checkout</Text>
              <Text style={styles.activeCardMeta}>Tim Produktif • Today</Text>
            </View>
            <Text style={styles.cardEmoji}>🍕</Text>
          </View>
        </ScrollView>

        {/* --- COMPLETED SECTION --- */}
        <View style={styles.completedHeaderContainer}> 
          <Text style={styles.sectionTitle}>Completed</Text>
          <Text style={styles.sectionCount}>04</Text>
        </View>

        <View style={styles.listContainer}>
          {['Design exercise animations', 'Wireframe User Flow', 'Mockup Design', 'Design exercise animations'].map((item, index) => (
            <View key={index} style={styles.listItem}>
               <View style={styles.bulletPoint} />
               <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* --- PROJECTS SECTION --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projects Uncompleted</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
           {/* Add Project */}
           <TouchableOpacity style={[styles.addCard, { height: 140, marginRight: 15 }]}>
            <View style={styles.addIconCircle}>
              <Ionicons name="add" size={30} color="#000000ff" />
            </View>
            <Text style={styles.addCardText}>Add Project</Text>
          </TouchableOpacity>

          {/* Project Card (Pizza Party) */}
            <TouchableOpacity style={styles.projectCard}>
            
            {/* --- BAGIAN ATAS (ICON + TEKS SEBARIS) --- */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ marginRight: 12 }}>
                  <Text style={{ fontSize: 35 }}>🍕</Text>
                </View>
                <View style={{ flex: 1 }}> 
                  <Text style={styles.projectTitle}>Sprint 14: Design Checkout</Text>
                  <Text style={styles.projectSubtitle}>Pizza Party!</Text>
                </View>
            </View>

            {/* --- BAGIAN BAWAH (PROGRESS BAR) --- */}
            <View style={{ marginTop: 5 }}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5}}>
                    <Text style={{color: '#fde68a', fontSize: 10}}>5/8 Tasks</Text>
                </View>
                <View style={{height: 6, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 3}}>
                    <View style={{width: '60%', height: 6, backgroundColor: 'white', borderRadius: 3}} />
                </View>
                </View>
            </TouchableOpacity>

            {/* Project Card (Purple) */}
            <TouchableOpacity style={[styles.projectCard, { backgroundColor: 'purple' }]}>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ marginRight: 12 }}>
                  <Text style={{ fontSize: 35 }}>🎮</Text>
                </View>
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

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  header: {
    backgroundColor: '#d97706',
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingHorizontal: 25,
    paddingBottom: 30,
    // borderBottomLeftRadius: 40,
    // borderBottomRightRadius: 40,
    position: 'relative',
    overflow: 'visible', 
    zIndex: 10, 
  },
  decorativeCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: -1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    color: '#fde68a',
    marginTop: 5,
  },
  
  // --- STYLES UNTUK KALENDER ---
  calendarContainer: {
    marginTop: 15,
    borderRadius: 20,
    padding: 15,
    // Style Border Kaca
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    // Style Bayangan (Shadow) yang lebih lembut
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10
  },
  calendarMonthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5
  },
  calendarMonthText: {
    fontWeight: 'bold',
    color: '#78350f',
    fontSize: 16
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 5,
  },
  weekText: {
    color: '#78350f',
    fontWeight: '600',
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  calendarDaySelected: {
    backgroundColor: '#fb923c', // Orange terpilih
    borderRadius: 20,
  },
  calendarDayText: {
    color: '#451a03',
    fontWeight: '500',
  },
  calendarDayTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
    zIndex: -1, 
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 80,
    fontWeight: '800',
    color: 'white',
  },
  percentSymbol: {
    fontSize: 14,
    fontWeight: '600',
  },
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
  filterGroup: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 4,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width:0, height:2}
  },
  filterBtnActive: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  filterBtn: {
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  filterTextActive: {
    fontWeight: 'bold',
    color: '#4b5563',
    fontSize: 12,
  },
  filterText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    zIndex: 0,
  },
  horizontalScroll: {
    paddingLeft: 25,
    paddingVertical: 10,
    marginBottom: 10,
  },
  addCard: {
    width: 110,
    height: 110,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addIconCircle: {
    backgroundColor: '#fef3c7',
    padding: 8,
    borderRadius: 50,
    marginBottom: 8,
  },
  addCardText: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 12,
  },
  activeCard: {
    backgroundColor: 'white',
    width: 240,
    height: 110,
    padding: 15,
    borderRadius: 20,
    marginRight: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  activeCardTitle: {
    fontWeight: 'bold',
    color: '#1f2937',
    fontSize: 14,
    width: 140,
  },
  activeCardSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  activeCardMeta: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 8,
  },
  cardEmoji: {
    fontSize: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#78350f', 
  },
  sectionCount: {
    fontWeight: 'bold',
    color: '#92400e',
  },
  listContainer: {
    paddingHorizontal: 25,
  },
  listItem: {
    backgroundColor: 'white',
    paddingVertical: 12,      
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#fff7ed',
  },
  bulletPoint: {
    width: 12,
    height: 12,
    backgroundColor: '#d97706',
    borderRadius: 6,
    marginRight: 15,
  },
  listItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  projectCard: {
    backgroundColor: '#b45309', 
    width: 250,
    height: 140,
    borderRadius: 20,
    padding: 20,
    marginRight: 25,
    justifyContent: 'space-between'
  },
  projectTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  projectSubtitle: {
    color: '#fde68a',
    fontSize: 12,
  },
  completedHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,      
    paddingHorizontal: 25,    
    backgroundColor: 'rgba(251, 146, 60, 0.2)', 
    marginBottom: 10,
    marginTop: 10,
  }
});