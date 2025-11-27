export interface Task {
  id: string;
  taskName: string;
  projectId: string;
  assignedTo: string;
  isDone: boolean;
  createdAt: any;
}
