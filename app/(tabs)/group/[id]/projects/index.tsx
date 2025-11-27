// app/(tabs)/group/[id]/projects/index.tsx
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { PROJECTS_DATA } from "@/data/projects";

import ProjectList from "./project";
import ProjectDetail from "./project-detail";

export default function ProjectScreen() {
    const { id } = useLocalSearchParams();
    const projects = PROJECTS_DATA[id] || [];

    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    if (selectedProjectId !== null) {
        const project = projects.find(p => p.id === selectedProjectId);
        return (
            <ProjectDetail
                project={project}
                onBack={() => setSelectedProjectId(null)}
            />
        );
    }

    return (
        <ProjectList
            projects={projects}
            onSelectProject={setSelectedProjectId}
        />
    );
}
