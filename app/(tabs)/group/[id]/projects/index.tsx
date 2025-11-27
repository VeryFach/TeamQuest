// app/(tabs)/group/[id]/projects/index.tsx
import { PROJECTS_DATA } from "@/data/projects";
import { Project } from "@/data/types";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

import ProjectList from "@/components/project/ProjectList";
import ProjectDetail from "./project-detail";

export default function ProjectScreen() {
    const { id } = useLocalSearchParams();
    const groupId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
    const projects: Project[] = PROJECTS_DATA[groupId] || [];

    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    if (selectedProjectId !== null) {
        // Navigate to project detail with project ID
        return <ProjectDetail />;
    }

    return (
        <ProjectList
            projects={projects}
            onSelectProject={setSelectedProjectId}
        />
    );
}
