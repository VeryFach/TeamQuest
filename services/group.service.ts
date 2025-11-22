import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface Group {
  id: string;
  name: string;
  leaderId: string;
  members: string[]; // userId list
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
    return snap.exists() ? snap.data() : null;
  },

  async getAllGroups() {
    const snap = await getDocs(collection(db, "groups"));
    return snap.docs.map((d) => d.data());
  },

  async addMember(groupId: string, userId: string) {
    const ref = doc(db, "groups", groupId);
    const groupSnap = await getDoc(ref);
    if (!groupSnap.exists()) return;

    const current = groupSnap.data().members || [];

    await updateDoc(ref, {
      members: [...new Set([...current, userId])],
    });
  },

  async removeMember(groupId: string, userId: string) {
    const ref = doc(db, "groups", groupId);
    const groupSnap = await getDoc(ref);
    if (!groupSnap.exists()) return;

    const filtered = groupSnap
      .data()
      .members.filter((m: string) => m !== userId);

    await updateDoc(ref, {
      members: filtered,
    });
  },
};
