import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface Message {
    id: number;
    sender: string;
    message: string;
    time: string;
    isMe: boolean;
}

export default function ChatTab() {
    const { id } = useLocalSearchParams();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: "Raka",
            message: "Hey guys, jangan lupa meeting jam 2 siang!",
            time: "10:30",
            isMe: false,
        },
        {
            id: 2,
            sender: "You",
            message: "Oke siap, di ruangan mana?",
            time: "10:32",
            isMe: true,
        },
        {
            id: 3,
            sender: "Very",
            message: "Ruang meeting lantai 3",
            time: "10:33",
            isMe: false,
        },
    ]);

    const [inputText, setInputText] = useState("");

    const handleSend = () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                sender: "You",
                message: inputText,
                time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                isMe: true,
            };
            setMessages([...messages, newMessage]);
            setInputText("");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <ScrollView
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        style={[
                            styles.messageItem,
                            msg.isMe ? styles.myMessage : styles.otherMessage,
                        ]}
                    >
                        {!msg.isMe && (
                            <Text style={styles.senderName}>{msg.sender}</Text>
                        )}
                        <View
                            style={[
                                styles.messageBubble,
                                msg.isMe ? styles.myBubble : styles.otherBubble,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    msg.isMe ? styles.myMessageText : styles.otherMessageText,
                                ]}
                            >
                                {msg.message}
                            </Text>
                        </View>
                        <Text style={styles.messageTime}>{msg.time}</Text>
                    </View>
                ))}
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
                />

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        !inputText.trim() && styles.sendButtonDisabled,
                    ]}
                    onPress={handleSend}
                    disabled={!inputText.trim()}
                >
                    <Ionicons
                        name="send"
                        size={20}
                        color={inputText.trim() ? "#fff" : "#ccc"}
                    />
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
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 20,
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