import { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ChatService, Message } from "@/services/chat.service";
import { UserService } from "@/services/user.service";
import { auth } from "@/firebaseConfig";
import { Timestamp } from "firebase/firestore";

export default function ChatTab() {
    // Ambil groupId dari route params (Material Top Tab)
    const route = useRoute();
    const routeParams = route.params as { groupId?: string } | undefined;
    
    // Fallback ke useLocalSearchParams jika tidak ada dari route
    const { id } = useLocalSearchParams<{ id: string }>();
    
    // Prioritaskan groupId dari Material Top Tab params
    const groupId = routeParams?.groupId || id;
    
    // Ambil user yang sedang login
    const currentUser = auth.currentUser;
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const scrollViewRef = useRef<ScrollView>(null);

    // Fetch user name dari database
    useEffect(() => {
        const fetchUserName = async () => {
            if (currentUser?.uid) {
                const user = await UserService.getUser(currentUser.uid);
                if (user) {
                    setUserName(user.displayName);
                } else {
                    setUserName(currentUser.email?.split('@')[0] || 'User');
                }
            }
        };
        fetchUserName();
    }, [currentUser?.uid]);

    // Subscribe to messages from Firebase
    useEffect(() => {
        if (!groupId || typeof groupId !== 'string') {
            console.error("Group ID is required:", groupId);
            setLoading(false);
            return;
        }

        console.log("Subscribing to messages for groupId:", groupId);

        const unsubscribe = ChatService.subscribeToMessages(
            groupId,
            (newMessages) => {
                console.log("Received messages:", newMessages.length);
                setMessages(newMessages);
                setLoading(false);
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        return () => unsubscribe();
    }, [groupId]);

    const handleSend = async () => {
        if (!inputText.trim() || !groupId || !currentUser?.uid || !userName) {
            return;
        }

        const messageText = inputText.trim();
        setInputText("");
        setSending(true);

        try {
            await ChatService.sendMessage({
                groupId: groupId as string,
                userId: currentUser.uid,
                userName: userName,
                text: messageText,
            });
        } catch (error) {
            console.error("Error sending message:", error);
            setInputText(messageText);
            alert("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp: Timestamp | null | undefined) => {
        if (!timestamp) return "";
        
        try {
            const date = timestamp.toDate();
            return date.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (error) {
            return "";
        }
    };

    const formatDate = (timestamp: Timestamp | null | undefined) => {
        if (!timestamp) return "Unknown";
        
        try {
            const date = timestamp.toDate();
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (date.toDateString() === today.toDateString()) {
                return "Today";
            } else if (date.toDateString() === yesterday.toDateString()) {
                return "Yesterday";
            } else {
                return date.toLocaleDateString('id-ID', { 
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            }
        } catch (error) {
            return "Unknown";
        }
    };

    const isMyMessage = (message: Message) => {
        return message.userId === currentUser?.uid;
    };

    // Group messages by date - dengan safety check
    const groupMessagesByDate = (msgs: Message[]) => {
        // Safety check: pastikan msgs adalah array
        if (!msgs || !Array.isArray(msgs) || msgs.length === 0) {
            return [];
        }

        const grouped: { date: string; messages: Message[] }[] = [];
        let currentDate = "";
        
        msgs.forEach((msg) => {
            if (!msg) return; // Skip jika msg undefined
            
            const msgDate = formatDate(msg.createdAt);
            if (msgDate !== currentDate) {
                currentDate = msgDate;
                grouped.push({ date: msgDate, messages: [msg] });
            } else if (grouped.length > 0) {
                grouped[grouped.length - 1].messages.push(msg);
            }
        });
        
        return grouped;
    };

    // Early return untuk user tidak login
    if (!currentUser) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Ionicons name="alert-circle-outline" size={64} color="#999" />
                <Text style={styles.errorText}>Please login to use chat</Text>
            </View>
        );
    }

    // Early return untuk loading
    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#C8733B" />
                <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
        );
    }

    // Early return jika groupId tidak ada
    if (!groupId) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Ionicons name="alert-circle-outline" size={64} color="#999" />
                <Text style={styles.errorText}>Group ID not found</Text>
            </View>
        );
    }

    // Hitung grouped messages setelah semua check selesai
    const groupedMessages = groupMessagesByDate(messages);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => 
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                }
            >
                {messages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>
                            No messages yet. Start the conversation!
                        </Text>
                    </View>
                ) : (
                    groupedMessages.map((group, groupIndex) => (
                        <View key={`group-${groupIndex}`}>
                            {/* Date Separator */}
                            <View style={styles.dateSeparator}>
                                <View style={styles.dateLine} />
                                <Text style={styles.dateText}>{group.date}</Text>
                                <View style={styles.dateLine} />
                            </View>
                            
                            {/* Messages */}
                            {group.messages.map((msg) => {
                                const isMine = isMyMessage(msg);
                                return (
                                    <View
                                        key={msg.messageId}
                                        style={[
                                            styles.messageItem,
                                            isMine ? styles.myMessage : styles.otherMessage,
                                        ]}
                                    >
                                        {!isMine && (
                                            <View style={styles.senderAvatar}>
                                                <Text style={styles.senderAvatarText}>
                                                    {msg.userName?.charAt(0)?.toUpperCase() || '?'}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={styles.messageContent}>
                                            {!isMine && (
                                                <Text style={styles.senderName}>
                                                    {msg.userName || 'Unknown'}
                                                </Text>
                                            )}
                                            <View
                                                style={[
                                                    styles.messageBubble,
                                                    isMine ? styles.myBubble : styles.otherBubble,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.messageText,
                                                        isMine ? styles.myMessageText : styles.otherMessageText,
                                                    ]}
                                                >
                                                    {msg.text}
                                                </Text>
                                            </View>
                                            <Text style={[
                                                styles.messageTime,
                                                isMine ? styles.myMessageTime : styles.otherMessageTime
                                            ]}>
                                                {formatTime(msg.createdAt)}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="add-circle-outline" size={28} color="#C8733B" />
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#999"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    maxLength={500}
                    editable={!sending}
                />

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!inputText.trim() || sending) && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!inputText.trim() || sending}
                >
                    {sending ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons
                            name="send"
                            size={20}
                            color={inputText.trim() ? "#fff" : "#ccc"}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

// ...existing styles...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4e4c1',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        marginTop: 12,
        fontSize: 16,
        color: '#999',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 20,
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    dateSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dateLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dateText: {
        marginHorizontal: 12,
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
    },
    messageItem: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    myMessage: {
        justifyContent: 'flex-end',
    },
    otherMessage: {
        justifyContent: 'flex-start',
    },
    senderAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#C8733B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        alignSelf: 'flex-end',
    },
    senderAvatarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    messageContent: {
        maxWidth: '75%',
    },
    senderName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        marginLeft: 4,
        fontWeight: '600',
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
    },
    myBubble: {
        backgroundColor: '#C8733B',
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#333',
    },
    messageTime: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    myMessageTime: {
        textAlign: 'right',
        marginRight: 4,
    },
    otherMessageTime: {
        textAlign: 'left',
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: 8,
    },
    attachButton: {
        padding: 4,
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#333',
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#C8733B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#f0f0f0',
    },
});