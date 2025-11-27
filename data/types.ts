export interface Task {
    id: number;
    name: string;
    assignee: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
}

export interface Project {
    id: number;
    name: string;
    subtitle: string;
    color: string;
    emoji: string;
    tasks: Task[];
}

export type ProjectsData = Record<number, Project[]>;