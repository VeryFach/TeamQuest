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
  id: string;
  taskName: string;
  projectId: string;
  assignedTo: string;
  isDone: boolean;
  createdAt: any;
}

export const TaskService = {
  async createTask(data: Omit<Task, "id" | "createdAt">) {
    const ref = doc(collection(db, "tasks"));
    const newData: Task = {
      id: ref.id,
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
    return snap.docs.map((d) => d.data() as Task);
  },

  async getUserTasks(userId: string) {
    const q = query(collection(db, "tasks"), where("assignedTo", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Task);
  },

  async getIncompleteTasks(projectId: string) {
    const q = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId),
      where("isDone", "==", false)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Task);
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
