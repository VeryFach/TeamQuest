import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
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
      projects: ['PAPB', 'Frontend App']
    },
    {
      id: 2,
      title: 'Team Produktif',
      bgColor: '#5c3d2e',
      members: ['Dono', 'Makima', 'Rimuru'],
      projects: ['Network', 'UI/UX Design']
    },
    {
      id: 3,
      title: 'Team Produktif',
      bgColor: '#d4a574',
      members: ['Raka', 'Very', 'Farras'],
      projects: ['PAPB', 'Ga tau']
    }
  ];

  // ← Fungsi untuk handle klik card
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
            onPress={() => handleCardPress(team.id)} // ← Pass fungsi onPress
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/group/create')}
      >
        <Text style={styles.fabText}>+</Text>
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
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#d4c4a0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#5c3d2e',
    fontWeight: '300',
  },
});