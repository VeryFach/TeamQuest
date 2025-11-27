import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  dateLabel: string;
  isCalendarOpen: boolean;
  onToggleCalendar: () => void;
  children?: React.ReactNode; // Tanda ? artinya opsional
}

export default function Header({ dateLabel, isCalendarOpen, onToggleCalendar, children }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <TouchableOpacity 
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={onToggleCalendar}
          >
             <Text style={styles.headerTitle}>{dateLabel}</Text>
             <Ionicons 
                name={isCalendarOpen ? "chevron-up" : "chevron-down"} 
                size={20} color="white" style={{marginLeft: 5}} 
             />
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>3 Unfinished Tasks</Text>
        </View>
      </View>

      {/* Area untuk me-render Kalender jika visible */}
      {children}

      <View style={styles.progressContainer}>
        {!isCalendarOpen && (
          <View style={{ width: '100%' }}>
              <View style={{ alignItems: 'flex-end', marginBottom: 5 }}>
                  <Text style={styles.percentageText}>68<Text style={styles.percentSymbol}>%</Text></Text>
              </View>
              <View style={{ height: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4, width: '100%' }}>
                  <View style={{ height: '100%', backgroundColor: 'white', borderRadius: 4, width: '68%' }} />
              </View>
          </View>
        )}
      </View>
      <View style={styles.decorativeCircle} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#d97706',
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingHorizontal: 25,
    paddingBottom: 30,
    position: 'relative',
    overflow: 'visible', 
    zIndex: 10, 
  },
  decorativeCircle: { position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)', zIndex: -1 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { color: '#fde68a', marginTop: 5 },
  progressContainer: { alignItems: 'flex-end', marginTop: 10, zIndex: -1, justifyContent: 'center' },
  percentageText: { fontSize: 80, fontWeight: '800', color: 'white' },
  percentSymbol: { fontSize: 14, fontWeight: '600' },
});