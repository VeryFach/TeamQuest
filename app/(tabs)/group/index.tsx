import FAB from "@/components/common/FAB";
import TeamCard from "@/components/group/TeamCard";
import { auth } from "@/firebaseConfig";
import { GroupService } from "@/services/group.service";
import { User, UserService } from "@/services/user.service";
import { Group } from "@/types/group";
import { useRouter } from "expo-router";
import { Unsubscribe } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function GroupScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const [groups, setGroups] = useState<Group[]>([]);
  const [membersData, setMembersData] = useState<{ [groupId: string]: User[] }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  // Ref untuk menyimpan unsubscribe function
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // Setup realtime listener
  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Subscribe ke user groups - akan auto update saat ada perubahan
    unsubscribeRef.current = GroupService.subscribeToUserGroups(
      user.uid,
      async (userGroups) => {
        setGroups(userGroups);

        // Ambil data members untuk setiap grup
        const membersMap: { [groupId: string]: User[] } = {};

        for (const group of userGroups) {
          const members = await UserService.getUsersByIds(group.members);
          membersMap[group.id] = members;
        }

        setMembersData(membersMap);
        setIsLoading(false);
      }
    );

    // Cleanup subscription saat unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user?.uid]);

  const handleCardPress = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  // Helper untuk mendapatkan nama members
  const getMemberNames = (groupId: string): string[] => {
    const members = membersData[groupId] || [];
    return members.map((member) => member.displayName);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>GROUP</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C8733B" />
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      </View>
    );
  }

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
        {groups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Groups Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create a new group or join an existing one to get started!
            </Text>
          </View>
        ) : (
          groups.map((group: Group) => (
            <TeamCard
              key={group.id}
              title={group.name}
              bgColor={group.bgColor}
              members={getMemberNames(group.id)}
              projects={[]} // Bisa ditambahkan nanti jika ada data projects
              onPress={() => handleCardPress(group.id)}
            />
          ))
        )}
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
    alignItems: "center",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5c3d2e",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
