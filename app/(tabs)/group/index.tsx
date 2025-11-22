import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TeamCard from "@/components/group/TeamCard";

interface Team {
  id: number;
  title: string;
  bgColor: string;
  members: string[];
  projects: string[];
}

export default function GroupScreen(): JSX.Element {
  const router = useRouter();

  const teams: Team[] = [
    {
      id: 1,
      title: 'Team Produk UI/UX',
      bgColor: '#5d6d4e',
      members: ['Raka', 'Very', 'Farras'],
      projects: ['PAPB', 'Ga tau']
    },
    {
      id: 2,
      title: 'Team Produk UI/UX',
      bgColor: '#5c3d2e',
      members: ['Dono', 'Makima', 'Rimuru'],
      projects: ['PAPB', 'Ga tau']
    },
    {
      id: 3,
      title: 'Team Produk UI/UX',
      bgColor: '#d4a574',
      members: ['Raka', 'Very', 'Farras'],
      projects: ['PAPB', 'Ga tau']
    }
  ];

  const handleCardPress = (teamId: number) => {
    router.push(`/group/${teamId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>GROUP</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {teams.map((team: Team) => (
          <TeamCard
            key={team.id}
            title={team.title}
            bgColor={team.bgColor}
            members={team.members}
            projects={team.projects}
            onPress={() => handleCardPress(team.id)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/group/create')}
      >
        <Ionicons name="add" size={32} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e4c1',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    letterSpacing: 2,
    color: "#C8733B",
    fontSize: 32,
    fontWeight: "800",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#F3E4BD",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
});