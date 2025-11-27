import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
}

export const UserService = {
  async createUser(data: Omit<User, "createdAt">) {
    const ref = doc(db, "users", data.id);
    const newData: User = {
      ...data,
      createdAt: Date.now(),
    };
    await setDoc(ref, newData);
    return newData;
  },

  async getUser(userId: string) {
    const ref = doc(db, "users", userId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as User) : null;
  },

  async getUsersByIds(userIds: string[]) {
    if (userIds.length === 0) return [];

    // Request semua data secara bersamaan (Parallel)
    const promises = userIds.map((id) => UserService.getUser(id));
    const results = await Promise.all(promises);

    // Filter hasil yang null (jika user tidak ditemukan)
    return results.filter((user): user is User => user !== null);
  },

  async updateUser(userId: string, data: Partial<User>) {
    const ref = doc(db, "users", userId);
    await updateDoc(ref, data);
  },
};
