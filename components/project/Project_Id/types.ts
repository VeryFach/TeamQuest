// components/project/types.ts
// File ini optional, untuk berbagi type definitions antar komponen

export type Task = {
    id: number;
    name: string;
    assignee: string;
    dueDate: string;
    priority: string;
    completed: boolean;
};

export type Project = {
    id: number;
    name: string;
    subtitle: string;
    color: string;
    emoji: string;
    tasks: Task[];
};