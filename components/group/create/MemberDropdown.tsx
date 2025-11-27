import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { User } from "@/services/user.service";

interface MemberDropdownProps {
    selectedMembers: string[]; // Array of user IDs
    onMemberSelect: (userId: string) => void;
    onMemberRemove: (userId: string) => void;
    currentUserId: string; // Exclude current user from list
}

export default function MemberDropdown({ 
    selectedMembers, 
    onMemberSelect, 
    onMemberRemove,
    currentUserId 
}: MemberDropdownProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all users from database
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const usersRef = collection(db, "users");
                const snapshot = await getDocs(usersRef);
                const usersList = snapshot.docs
                    .map(doc => doc.data() as User)
                    .filter(user => user.id !== currentUserId); // Exclude current user
                setUsers(usersList);
                setFilteredUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [currentUserId]);

    // Filter users based on search query
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user => 
                user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    // Get selected user details
    const selectedUserDetails = users.filter(user => selectedMembers.includes(user.id));

    const handleSelectUser = (user: User) => {
        if (!selectedMembers.includes(user.id)) {
            onMemberSelect(user.id);
        }
        setSearchQuery("");
        setIsDropdownOpen(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Add Members</Text>
            
            {/* Search Input */}
            <TouchableOpacity 
                style={styles.inputContainer}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <Ionicons name="search" size={20} color="#999" />
                <TextInput
                    style={styles.input}
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholderTextColor="#999"
                />
                <Ionicons 
                    name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#999" 
                />
            </TouchableOpacity>

            {/* Dropdown List */}
            {isDropdownOpen && (
                <View style={styles.dropdown}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#C8733B" />
                            <Text style={styles.loadingText}>Loading users...</Text>
                        </View>
                    ) : filteredUsers.length === 0 ? (
                        <Text style={styles.emptyText}>No users found</Text>
                    ) : (
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item) => item.id}
                            style={styles.list}
                            nestedScrollEnabled
                            renderItem={({ item }) => {
                                const isSelected = selectedMembers.includes(item.id);
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.userItem,
                                            isSelected && styles.userItemSelected
                                        ]}
                                        onPress={() => handleSelectUser(item)}
                                        disabled={isSelected}
                                    >
                                        <View style={styles.avatar}>
                                            <Text style={styles.avatarText}>
                                                {item.displayName.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                        <View style={styles.userInfo}>
                                            <Text style={styles.userName}>{item.displayName}</Text>
                                            <Text style={styles.userEmail}>{item.email}</Text>
                                        </View>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={20} color="#C8733B" />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}
                </View>
            )}

            {/* Selected Members */}
            {selectedUserDetails.length > 0 && (
                <View style={styles.selectedContainer}>
                    <Text style={styles.selectedLabel}>
                        Selected ({selectedUserDetails.length})
                    </Text>
                    {selectedUserDetails.map((user) => (
                        <View key={user.id} style={styles.selectedMember}>
                            <View style={styles.selectedAvatar}>
                                <Text style={styles.selectedAvatarText}>
                                    {user.displayName.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.selectedInfo}>
                                <Text style={styles.selectedName}>{user.displayName}</Text>
                                <Text style={styles.selectedEmail}>{user.email}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => onMemberRemove(user.id)}
                            >
                                <Ionicons name="close-circle" size={22} color="#e74c3c" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#5c3d2e",
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        gap: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    dropdown: {
        backgroundColor: "#fff",
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        maxHeight: 250,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    list: {
        maxHeight: 240,
    },
    loadingContainer: {
        padding: 20,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },
    loadingText: {
        color: "#999",
        fontSize: 14,
    },
    emptyText: {
        padding: 20,
        textAlign: "center",
        color: "#999",
        fontSize: 14,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        gap: 12,
    },
    userItemSelected: {
        backgroundColor: "#FFF5EB",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#C8733B",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },
    userEmail: {
        fontSize: 13,
        color: "#777",
        marginTop: 2,
    },
    selectedContainer: {
        marginTop: 16,
    },
    selectedLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#5c3d2e",
        marginBottom: 8,
    },
    selectedMember: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF5EB",
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
        gap: 10,
    },
    selectedAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#C8733B",
        justifyContent: "center",
        alignItems: "center",
    },
    selectedAvatarText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    selectedInfo: {
        flex: 1,
    },
    selectedName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
    },
    selectedEmail: {
        fontSize: 12,
        color: "#777",
    },
    removeButton: {
        padding: 4,
    },
});