import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface Message {
  messageId: string;
  groupId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Timestamp;
}

export interface SendMessageParams {
  groupId: string;
  userId: string;
  userName: string;
  text: string;
}

export class ChatService {
  /**
   * Mengirim pesan ke grup
   */
  static async sendMessage(params: SendMessageParams): Promise<void> {
    const { groupId, userId, userName, text } = params;

    await addDoc(collection(db, "messages"), {
      groupId,
      userId,
      userName,
      text,
      createdAt: serverTimestamp(),
    });
  }

  /**
   * Subscribe ke pesan grup secara real-time
   * @param groupId - ID grup
   * @param callback - Fungsi callback yang menerima array pesan
   * @returns Unsubscribe function
   */
  static subscribeToMessages(
    groupId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    const q = query(
      collection(db, "messages"),
      where("groupId", "==", groupId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push({
          messageId: doc.id,
          ...doc.data(),
        } as Message);
      });
      callback(messages);
    });

    return unsubscribe;
  }
}
