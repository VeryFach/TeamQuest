import { Project } from "@/components/home/ProjectCard";
import { PROJECTS_DATA } from "@/constants/projectsData";
import { useMemo } from "react";

const convertToProjectCardFormat = (
  project: (typeof PROJECTS_DATA)[0]
): Project => {
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.completed).length;

  return {
    id: project.id,
    group_name: project.group || "Private",
    reward: project.subtitle,
    reward_emot: project.emoji,
    tasks_total: totalTasks,
    tasks_completed: completedTasks,
    bgColor: project.bgColor,
  } as any;
};

export const useProjectFilter = (type: string = "group") => {
  // 1. Filter Data Project (Group vs Private)
  const filteredProjects = useMemo(() => {
    return type === "group"
      ? PROJECTS_DATA.filter((p) => !!p.group)
      : PROJECTS_DATA.filter((p) => !p.group);
  }, [type]);

  // ----------------------------------------------------------------
  // HITUNGAN 1: Jumlah PROJECT yang belum selesai (Restore request kamu)
  // Dipakai di: ProjectList Header ("Projects Uncompleted (3)")
  // ----------------------------------------------------------------
  const uncompletedProjectsCount = useMemo(() => {
    return filteredProjects.filter((project) =>
      project.tasks.some((t) => !t.completed)
    ).length;
  }, [filteredProjects]);

  // ----------------------------------------------------------------
  // HITUNGAN 2: Jumlah TASK yang belum selesai
  // Dipakai di: Badge FloatingStatusBar ("! 12 Unfinished")
  // ----------------------------------------------------------------
  const totalUncompletedTasks = useMemo(() => {
    return filteredProjects.reduce((acc, project) => {
      const uncompletedInProject = project.tasks.filter(
        (t) => !t.completed
      ).length;
      return acc + uncompletedInProject;
    }, 0);
  }, [filteredProjects]);

  // ----------------------------------------------------------------
  // HITUNGAN 3: Jumlah SEMUA TASK (Completed + Uncompleted)
  // Dipakai di: Disimpan saja (Backup)
  // ----------------------------------------------------------------
  const totalAllTasks = useMemo(() => {
    return filteredProjects.reduce((acc, curr) => acc + curr.tasks.length, 0);
  }, [filteredProjects]);

  // ----------------------------------------------------------------
  // HITUNGAN 4: Daftar TASK yang sudah selesai (Completed)
  // Dipakai di: CompletedList
  // ----------------------------------------------------------------
  const completedTasks = useMemo(() => {
    return filteredProjects.flatMap((project) =>
      project.tasks
        .filter((t) => t.completed)
        .map((t) => ({
          id: t.id,
          title: t.title,
        }))
    );
  }, [filteredProjects]);

  // 4. Format Data untuk Card UI
  const formattedProjects = useMemo(() => {
    return filteredProjects.map(convertToProjectCardFormat);
  }, [filteredProjects]);

  return {
    projects: formattedProjects,
    uncompletedProjectsCount, // ✅ Jumlah Project
    totalUncompletedTasks, // ✅ Jumlah Task Uncompleted
    totalAllTasks, // ✅ Jumlah Total Task (Simpanan)
    completedTasks, // ✅ Daftar Task Completed
  };
};
