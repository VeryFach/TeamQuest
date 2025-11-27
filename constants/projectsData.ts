export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  bgColor: string; 
  tasks: Task[];   
}

export const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    title: 'Sprint 14: Design Checkout',
    subtitle: 'Pizza Party!',
    emoji: '🍕',
    bgColor: '#b45309', 
    tasks: [
      { id: 1, title: 'Wireframe', completed: true },
      { id: 2, title: 'Prototype', completed: true },
      { id: 3, title: 'User Test', completed: true },
      { id: 4, title: 'Handoff', completed: true },
      { id: 5, title: 'Presentation', completed: true },
      { id: 6, title: 'Fix Bug', completed: true },
      { id: 7, title: 'Documentation', completed: true },
    ] 
  },
  {
    id: '2',
    title: 'Sprint 15: Design Base',
    subtitle: 'Gaming Mania!',
    emoji: '🎮',
    bgColor: '#3A7D44', 
    tasks: [
      { id: 1, title: 'Sketch', completed: true },
      { id: 2, title: 'Coloring', completed: true },
      { id: 3, title: 'Render', completed: true },
      { id: 4, title: 'Publish', completed: false }, 
      { id: 5, title: 'Review', completed: true },
      { id: 6, title: 'Update', completed: false }, 
      { id: 7, title: 'Fix', completed: false },    
      { id: 8, title: 'Final', completed: true },
    ]
  }
];