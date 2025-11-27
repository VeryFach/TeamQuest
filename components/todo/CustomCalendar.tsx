import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface CustomCalendarProps {
  visible: boolean;
  viewDate: Date;
  selectedDate: Date;
  onChangeMonth: (increment: number) => void; // Fungsi menerima number
  onSelectDate: (date: Date) => void;         // Fungsi menerima Date
}
export default function CustomCalendar({ visible, viewDate, selectedDate, onChangeMonth, onSelectDate }: CustomCalendarProps) {
  if (!visible) return null;

  const renderCalendarGrid = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;

      grid.push(
        <TouchableOpacity 
          key={day} 
          style={[styles.calendarDay, isSelected && styles.calendarDaySelected]}
          onPress={() => onSelectDate(new Date(year, month, day))}
        >
          <Text style={[styles.calendarDayText, isSelected && styles.calendarDayTextSelected]}>{day}</Text>
        </TouchableOpacity>
      );
    }
    return grid;
  };

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)']} 
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }}   
      style={styles.calendarContainer} 
    >
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => onChangeMonth(-1)}>
          <Ionicons name="chevron-back" size={20} color="#78350f" />
        </TouchableOpacity>
        
        <View style={styles.calendarMonthSelector}>
          <Text style={styles.calendarMonthText}>{monthNames[viewDate.getMonth()]}</Text>
          <Text style={styles.calendarMonthText}> {viewDate.getFullYear()}</Text>
        </View>
        
        <TouchableOpacity onPress={() => onChangeMonth(1)}>
          <Ionicons name="chevron-forward" size={20} color="#78350f" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <Text key={day} style={styles.weekText}>{day}</Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {renderCalendarGrid()}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    marginTop: 15,
    borderRadius: 20,
    padding: 15,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    elevation: 5, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8,
  },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 },
  calendarMonthSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, gap: 5 },
  calendarMonthText: { fontWeight: 'bold', color: '#78350f', fontSize: 16 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, marginTop: 5 },
  weekText: { color: '#78350f', fontWeight: '600', width: '14.28%', textAlign: 'center', fontSize: 12 },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  calendarDay: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  calendarDaySelected: { backgroundColor: '#fb923c', borderRadius: 20 },
  calendarDayText: { color: '#451a03', fontWeight: '500' },
  calendarDayTextSelected: { color: 'white', fontWeight: 'bold' },
});