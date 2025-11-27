export interface Task {
  id: string; // Diubah ke string agar konsisten dengan format database/UUID
  title: string;
  completed: boolean;
  createdAt: Date; // Field baru
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  bgColor: string;
  tasks: Task[];
  group?: string;
}

// Helper untuk membuat tanggal mundur (untuk simulasi data lama)
const getPastDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "1",
    title: "Sprint 14: Design Checkout",
    subtitle: "Pizza Party!",
    emoji: "🍕",
    bgColor: "#b45309",
    group: "Team Produktif",
    tasks: [
      {
        id: "t1",
        title: "Wireframe",
        completed: true,
        createdAt: getPastDate(5),
      },
      {
        id: "t2",
        title: "Prototype",
        completed: true,
        createdAt: getPastDate(4),
      },
      {
        id: "t3",
        title: "User Test",
        completed: true,
        createdAt: getPastDate(3),
      },
      {
        id: "t4",
        title: "Handoff",
        completed: true,
        createdAt: getPastDate(2),
      },
      {
        id: "t5",
        title: "Presentation",
        completed: true,
        createdAt: getPastDate(1),
      },
      {
        id: "t6",
        title: "Fix Bug",
        completed: true,
        createdAt: new Date(), // Hari ini
      },
      {
        id: "t7",
        title: "Documentation",
        completed: true,
        createdAt: new Date(),
      },
    ],
  },
  {
    id: "2",
    title: "Sprint 15: Design Base",
    subtitle: "Gaming Mania!",
    emoji: "🎮",
    bgColor: "#3A7D44",
    group: "Team Produktif",
    tasks: [
      {
        id: "t8",
        title: "Sketch",
        completed: true,
        createdAt: getPastDate(2),
      },
      {
        id: "t9",
        title: "Coloring",
        completed: true,
        createdAt: getPastDate(1),
      },
      {
        id: "t10",
        title: "Render",
        completed: true,
        createdAt: new Date(),
      },
      {
        id: "t11",
        title: "Publish",
        completed: false,
        createdAt: new Date(),
      },
      {
        id: "t12",
        title: "Review",
        completed: true,
        createdAt: new Date(),
      },
      {
        id: "t13",
        title: "Update",
        completed: false,
        createdAt: new Date(),
      },
      {
        id: "t14",
        title: "Fix",
        completed: false,
        createdAt: new Date(),
      },
      {
        id: "t15",
        title: "Final",
        completed: true,
        createdAt: new Date(),
      },
    ],
  },
  {
    id: "3",
    title: "Personal Goals",
    subtitle: "Self Improvement",
    emoji: "🚀",
    bgColor: "#1e40af", // Blue
    // Tidak ada group (Private)
    tasks: [
      {
        id: "t16",
        title: "Read 10 pages",
        completed: false,
        createdAt: new Date(),
      },
      {
        id: "t17",
        title: "Gym",
        completed: true,
        createdAt: getPastDate(1),
      },
    ],
  },
];
