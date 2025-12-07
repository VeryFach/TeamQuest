import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface Group {
  id: string;
  name: string;
  bgColor: string;
  leaderId: string;
  members: string[];
}

export const GroupService = {
  async createGroup(data: Omit<Group, "id">) {
    const ref = doc(collection(db, "groups"));
    const newData: Group = {
      id: ref.id,
      ...data,
    };
    await setDoc(ref, newData);
    return newData;
  },

  async getGroup(groupId: string) {
    const ref = doc(db, "groups", groupId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Group) : null;
  },

  async getUserGroups(userId: string) {
    const q = query(
      collection(db, "groups"),
      where("members", "array-contains", userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Group);
  },

  async getLeaderGroups(leaderId: string) {
    const q = query(
      collection(db, "groups"),
      where("leaderId", "==", leaderId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Group);
  },

  async updateGroup(groupId: string, data: Partial<Group>) {
    const ref = doc(db, "groups", groupId);
    await updateDoc(ref, data);
  },

  async addMember(groupId: string, userId: string) {
    const ref = doc(db, "groups", groupId);
    await updateDoc(ref, {
      members: arrayUnion(userId),
    });
  },

  async removeMember(groupId: string, userId: string) {
    const ref = doc(db, "groups", groupId);
    await updateDoc(ref, {
      members: arrayRemove(userId),
    });
  },

  async deleteGroup(groupId: string) {
    const ref = doc(db, "groups", groupId);
    await deleteDoc(ref);
  },

  // Realtime listener untuk user groups
  subscribeToUserGroups(
    userId: string,
    callback: (groups: Group[]) => void
  ): Unsubscribe {
    const q = query(
      collection(db, "groups"),
      where("members", "array-contains", userId)
    );
    return onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map((d) => d.data() as Group);
      callback(groups);
    });
  },
};
