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
import { Ionicons } from "@expo/vector-icons";
import { ChatService, Message } from "@/services/chat.service";
import { Timestamp } from "firebase/firestore";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ChatTab() {
    const { id: groupId, userId, userName } = useLocalSearchParams();
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    // Subscribe to messages from Firebase
    useEffect(() => {
        if (!groupId || typeof groupId !== 'string') {
            console.error("Group ID is required");
            setLoading(false);
            return;
        }

        const unsubscribe = ChatService.subscribeToMessages(
            groupId,
            (newMessages) => {
                setMessages(newMessages);
                setLoading(false);
                // Auto scroll to bottom when new message arrives
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [groupId]);

    const handleSend = async () => {
        if (!inputText.trim() || !groupId || !userId || !userName) {
            return;
        }

        const messageText = inputText.trim();
        setInputText("");
        setSending(true);

        try {
            await ChatService.sendMessage({
                groupId: groupId as string,
                userId: userId as string,
                userName: userName as string,
                text: messageText,
            });
        } catch (error) {
            console.error("Error sending message:", error);
            // Restore message on error
            setInputText(messageText);
            alert("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp: Timestamp | null) => {
        if (!timestamp) return "";
        
        const date = timestamp.toDate();
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const isMyMessage = (message: Message) => {
        return message.userId === userId;
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#C8733B" />
                <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
        );
    }

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
                    messages.map((msg) => {
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
                                    <Text style={styles.senderName}>
                                        {msg.userName}
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
                                <Text style={styles.messageTime}>
                                    {formatTime(msg.createdAt)}
                                </Text>
                            </View>
                        );
                    })
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
    messageItem: {
        marginBottom: 16,
    },
    myMessage: {
        alignItems: 'flex-end',
    },
    otherMessage: {
        alignItems: 'flex-start',
    },
    senderName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        marginLeft: 12,
        fontWeight: '600',
    },
    messageBubble: {
        maxWidth: '75%',
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
        marginHorizontal: 12,
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