export interface ProjectReward {
  icon: string;
  name: string;
}

export interface Project {
  createdAt: number;
  groupId: string;
  bgColor: string;
  isPrivate: boolean;
  name: string;
  projectId: string;
  projectLeader: string;
  reward: ProjectReward;
}
