import React, { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import Komponen
import ActiveTaskCard from "@/components/todo/ActiveTaskCard";
import CompletedList from "@/components/todo/CompletedList";
import CustomCalendar from "@/components/todo/CustomCalendar";
import DynamicSelectorModal from "@/components/todo/DynamicSelectorModal";
import FloatingStatusBar from "@/components/todo/FloatingStatusBar";
import Header from "@/components/todo/Header";
import ProjectList from "@/components/todo/ProjectList";
import { PROJECTS_DATA } from "@/constants/projectsData";
import { useProjectFilter } from "@/hooks/useProjectFilter";

// Data Bulan
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Generate Tahun (misal: dari 2020 sampai 2030)
const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

export default function TodoListScreen() {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const { totalUncompletedTasks, totalAllTasks } = useProjectFilter("group");

  // State untuk Modal/Dropdown
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const [isYearPickerVisible, setYearPickerVisible] = useState(false);

  const [activeTab, setActiveTab] = useState<"group" | "private">("group");
  const [modalVisible, setModalVisible] = useState(false);
  // --- Logic Ganti Bulan/Tahun ---
  const { completedTasks } = useProjectFilter(activeTab);

  const changeMonth = (increment: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setViewDate(newDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    setViewDate(newDate);
    setMonthPickerVisible(false); // Tutup modal
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
    setYearPickerVisible(false); // Tutup modal
  };
  // -------------------------------

  const getHeaderDateLabel = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) return "Today";
    return selectedDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSelectGroup = (group: any) => {
    console.log("Grup dipilih:", group.name);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Header
          dateLabel={getHeaderDateLabel()}
          isCalendarOpen={isCalendarVisible}
          onToggleCalendar={() => {
            setCalendarVisible(!isCalendarVisible);
            if (!isCalendarVisible) setViewDate(selectedDate);
          }}
          totalUncompletedTasks={totalUncompletedTasks}
          totalAllTasks={totalAllTasks}
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
            // --- BUKA MODAL DI SINI ---
            onPressMonth={() => setMonthPickerVisible(true)}
            onPressYear={() => setYearPickerVisible(true)}
          />
        </Header>

        <FloatingStatusBar activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "group" ? (
          <>
            <ActiveTaskCard
              type="group"
              onAddPress={() => setModalVisible(true)}
              onTaskPress={(task) => {
                console.log("Task pressed:", task);
                // Navigate to task detail or project
              }}
            />
            <CompletedList completedTasks={completedTasks} />
            <ProjectList onAddPress={() => setModalVisible(true)} />
          </>
        ) : (
          <>
            <ActiveTaskCard
              type="private"
              onAddPress={() => setModalVisible(true)}
              onTaskPress={(task) => {
                console.log("Task pressed:", task);
              }}
            />
            <CompletedList completedTasks={completedTasks} />
            <ProjectList
              onAddPress={() => setModalVisible(true)}
              type="private"
            />
          </>
        )}
      </ScrollView>

      <DynamicSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Select Group"
        // 1. Masukkan Data
        data={PROJECTS_DATA}
        // 2. Tentukan field mana yang mau ditampilkan (di PROJECTS_DATA fieldnya 'group')
        displayKey="group"
        // 3. Tentukan mau navigasi ke mana (otomatis replace [id])
        routePath="/group/[id]"
      />

      {/* ================= MODAL PEMILIH BULAN ================= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isMonthPickerVisible}
        onRequestClose={() => setMonthPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthPickerVisible(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerHeader}>Select Month</Text>
            <View style={styles.monthsGrid}>
              {monthNames.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthItem,
                    viewDate.getMonth() === index && styles.selectedItem,
                  ]}
                  onPress={() => handleMonthSelect(index)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      viewDate.getMonth() === index && styles.selectedItemText,
                    ]}
                  >
                    {month.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================= MODAL PEMILIH TAHUN ================= */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isYearPickerVisible}
        onRequestClose={() => setYearPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setYearPickerVisible(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerHeader}>Select Year</Text>
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              style={{ maxHeight: 300, width: "100%" }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.yearItem,
                    viewDate.getFullYear() === item && styles.selectedItem,
                  ]}
                  onPress={() => handleYearSelect(item)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      viewDate.getFullYear() === item &&
                        styles.selectedItemText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBEB" },
  contentContainer: { flex: 1, zIndex: 0 },

  /* --- STYLE UNTUK MODAL PICKER --- */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#78350f",
  },
  monthsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  monthItem: {
    width: "30%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFF7ED",
  },
  yearItem: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "#FFF7ED",
  },
  selectedItem: {
    backgroundColor: "#F97316", // Orange saat dipilih
  },
  pickerItemText: {
    fontSize: 16,
    color: "#431407",
  },
  selectedItemText: {
    color: "white",
    fontWeight: "bold",
  },
});
