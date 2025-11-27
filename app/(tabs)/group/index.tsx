// app/(tabs)/group/index.tsx
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TeamCard from "@/components/group/TeamCard";
import FAB from "@/components/common/FAB";
import { JSX } from "react/jsx-runtime";

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

      <FAB onPress={() => router.push("/group/create")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});