// Backward compatibility wrappers delegating to services
export {
  loadCollectionData as loadCollection,
  loadProfile,
  loadSkills,
  loadUI,
} from "@/services/content";

export {
  loadProjects,
  loadProject,
} from "@/services/projects";