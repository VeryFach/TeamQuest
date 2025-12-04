import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Group, GroupService } from "./group.service"; // pastikan path sesuai
import { Task, TaskService } from "./task.service"; // pastikan path sesuai

export interface ProjectReward {
  icon: string;
  name: string;
}

export interface Project {
  createdAt: number;
  groupId: string;
  bgColor: string;
  isPrivate: boolean;
  isDone: boolean;
  name: string;
  projectId: string;
  projectLeader: string;
  reward: ProjectReward;
}

export const ProjectService = {
  async createProject(
    data: Omit<Project, "projectId" | "createdAt" | "isDone">
  ) {
    const ref = doc(collection(db, "projects"));
    const newData: Project = {
      projectId: ref.id,
      createdAt: Date.now(),
      isDone: false,
      ...data,
    };
    await setDoc(ref, newData);
    return newData;
  },

  async getProject(projectId: string) {
    const ref = doc(db, "projects", projectId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Project) : null;
  },

  async getGroupByProject(projectId: string): Promise<Group | null> {
    const project = await ProjectService.getProject(projectId);
    if (!project) return null;
    return await GroupService.getGroup(project.groupId);
  },

  async getGroupProjects(groupId: string) {
    const q = query(
      collection(db, "projects"),
      where("groupId", "==", groupId)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Project);
  },

  async getUserPrivateProjects(userId: string) {
    const q = query(
      collection(db, "projects"),
      where("projectLeader", "==", userId),
      where("isPrivate", "==", true)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Project);
  },

  async getUserProjects(userId: string) {
    const privateProjects = await this.getUserPrivateProjects(userId);
    const userGroups = await GroupService.getUserGroups(userId);

    const groupProjectsPromises = userGroups.map((group) =>
      this.getGroupProjects(group.id)
    );
    const groupProjectsArrays = await Promise.all(groupProjectsPromises);
    const groupProjects = groupProjectsArrays.flat();

    return [...privateProjects, ...groupProjects];
  },

  async updateProject(projectId: string, data: Partial<Project>) {
    const ref = doc(db, "projects", projectId);
    await updateDoc(ref, data);
  },

  async deleteProject(projectId: string) {
    const ref = doc(db, "projects", projectId);
    await deleteDoc(ref);
  },

  async getProjectTaskStats(
    projectId: string
  ): Promise<{ tasks_total: number; tasks_completed: number }> {
    const tasks: Task[] = await TaskService.getTasks(projectId);
    const tasks_total = tasks.length;
    const tasks_completed = tasks.filter((t) => t.isDone).length;
    return { tasks_total, tasks_completed };
  },

  async checkAndUpdateProjectCompletion(projectId: string): Promise<boolean> {
    const tasks: Task[] = await TaskService.getTasks(projectId);

    // Project is done only if there are tasks and all are completed
    const isDone = tasks.length > 0 && tasks.every((t) => t.isDone);

    await this.updateProject(projectId, { isDone });
    return isDone;
  },

  async isProjectCompleted(projectId: string): Promise<boolean> {
    const tasks: Task[] = await TaskService.getTasks(projectId);
    return tasks.length > 0 && tasks.every((t) => t.isDone);
  },
};
