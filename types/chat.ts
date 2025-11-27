export interface ChatMessage {
  // Perhatikan: Di sini createdAt berupa string format tanggal,
  // berbeda dengan Project yang menggunakan number (timestamp).
  createdAt: string;
  groupId: string;
  text: string;
  userId: string;
  userName: string;
}
