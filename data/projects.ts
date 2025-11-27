import { ProjectsData } from './types';

export const PROJECTS_DATA: Record<number, any[]> = {
    1: [
        {
            id: 1,
            name: 'Sprint 14 : Design Checkout Flow',
            subtitle: 'Pizza Party!',
            color: '#C8733B',
            emoji: '🍕',
            tasks: [
                {
                    id: 1,
                    name: 'Design wireframe',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'Create prototype',
                    assignee: 'Very',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-16'
                },
                {
                    id: 3,
                    name: 'User testing',
                    assignee: 'Farras',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-18'
                },
                {
                    id: 4,
                    name: 'Final revision',
                    assignee: 'Raka',
                    completed: false,
                    priority: 'low',
                    dueDate: '2024-01-20'
                },
                {
                    id: 5,
                    name: 'Deploy to production',
                    assignee: 'Very',
                    completed: false,
                    priority: 'high',
                    dueDate: '2024-01-22'
                },
                {
                    id: 6,
                    name: 'Write documentation',
                    assignee: 'Farras',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-23'
                },
                {
                    id: 7,
                    name: 'Code review',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-17'
                },
                {
                    id: 8,
                    name: 'Bug fixing',
                    assignee: 'Very',
                    completed: true,
                    priority: 'medium',
                    dueDate: '2024-01-19'
                }
            ]
        },
        {
            id: 2,
            name: 'Mobile App Redesign',
            subtitle: 'Fresh Look!',
            color: '#8BC34A',
            emoji: '📱',
            tasks: [
                {
                    id: 1,
                    name: 'Research competitors',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-10'
                },
                {
                    id: 2,
                    name: 'Create moodboard',
                    assignee: 'Very',
                    completed: true,
                    priority: 'medium',
                    dueDate: '2024-01-12'
                },
                {
                    id: 3,
                    name: 'Design system update',
                    assignee: 'Farras',
                    completed: false,
                    priority: 'high',
                    dueDate: '2024-01-25'
                },
                {
                    id: 4,
                    name: 'Prototype animations',
                    assignee: 'Raka',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-28'
                }
            ]
        },
        {
            id: 3,
            name: 'API Documentation',
            subtitle: 'Dev Resources',
            color: '#64B5F6',
            emoji: '📚',
            tasks: [
                {
                    id: 1,
                    name: 'Write endpoint docs',
                    assignee: 'Very',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-08'
                },
                {
                    id: 2,
                    name: 'Add code examples',
                    assignee: 'Farras',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-24'
                }
            ]
        },
    ],
    2: [
        {
            id: 1,
            name: 'Network Infrastructure',
            subtitle: 'Server Migration',
            color: '#C8733B',
            emoji: '🌐',
            tasks: [
                {
                    id: 1,
                    name: 'Setup new servers',
                    assignee: 'Dono',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-05'
                },
                {
                    id: 2,
                    name: 'Migrate databases',
                    assignee: 'Makima',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-08'
                },
                {
                    id: 3,
                    name: 'Configure load balancer',
                    assignee: 'Rimuru',
                    completed: false,
                    priority: 'medium',
                    dueDate: '2024-01-26'
                }
            ]
        },
    ],
    3: [
        {
            id: 1,
            name: 'PAPB Final Project',
            subtitle: 'Mobile Development',
            color: '#8BC34A',
            emoji: '📱',
            tasks: [
                {
                    id: 1,
                    name: 'Setup React Native',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-01'
                },
                {
                    id: 2,
                    name: 'Design UI/UX',
                    assignee: 'Very',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-05'
                },
                {
                    id: 3,
                    name: 'Implement features',
                    assignee: 'Farras',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-12'
                },
                {
                    id: 4,
                    name: 'Testing & debugging',
                    assignee: 'Raka',
                    completed: true,
                    priority: 'medium',
                    dueDate: '2024-01-15'
                },
                {
                    id: 5,
                    name: 'Final presentation',
                    assignee: 'Very',
                    completed: true,
                    priority: 'high',
                    dueDate: '2024-01-18'
                }
            ]
        },
    ],
};