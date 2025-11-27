import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface Task {
  taskId: string;
  projectId: string;
  taskName: string;
  assignedTo: string | null;
  isDone: boolean;
  createdAt: any; // bisa pakai Timestamp dari firebase/firestore jika ingin lebih spesifik
}

export const TaskService = {
  async createTask(data: Omit<Task, "taskId" | "createdAt">) {
    const ref = doc(collection(db, "tasks"));
    const newData: Task = {
      taskId: ref.id,
      ...data,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, newData);
    return newData;
  },

  async getTasks(projectId: string) {
    const q = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  },

  async updateTask(taskId: string, data: Partial<Task>) {
    const ref = doc(db, "tasks", taskId);
    await updateDoc(ref, data);
  },

  async deleteTask(taskId: string) {
    const ref = doc(db, "tasks", taskId);
    await deleteDoc(ref);
  },
};
