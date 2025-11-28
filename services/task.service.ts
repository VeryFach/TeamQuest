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
import { GroupService } from "./group.service";
import { ProjectService } from "./project.service";

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

  // Tambahkan dan pastikan method ini ada di dalam objek TaskService!
  async getGroupNameByTaskId(taskId: string): Promise<string | null> {
    // 1. Cari task
    const q = query(collection(db, "tasks"), where("id", "==", taskId));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const task = snap.docs[0].data() as Task;

    // 2. Cari project
    const project = await ProjectService.getProject(task.projectId);
    if (!project) return null;

    // 3. Cari group
    const group = await GroupService.getGroup(project.groupId);
    if (!group) return null;

    // 4. Return group name
    return group.name;
  },
};
