import type { Project, Projects } from "@/interfaces/Content";
import { getCollection, getEntry } from "astro:content";

export interface ProjectPathParams {
  params: {
    id: string;
    lang: string;
  };
}

/**
 * Retrieves all projects for a specific language.
 */
export async function loadProjects(lang: string): Promise<Projects> {
  const projects = await getCollection("projects");
  if (!projects) {
    throw new Error("Projects collection not found");
  }

  return projects
    .filter((project) => {
      const currentLang = project.id.split("/").pop();
      return currentLang === lang;
    })
    .map((project) => project.data);
}

/**
 * Loads a single project by its ID and language.
 */
export async function loadProject(projectId: string, lang: string): Promise<Project> {
  const project = await getEntry("projects", `${projectId}/${lang}`);
  if (!project) {
    throw new Error(`Project "${projectId}" with language "${lang}" not found`);
  }

  const { data } = project;
  if (!data) {
    throw new Error(`Project data for "${projectId}" (${lang}) not found`);
  }

  return data;
}

/**
 * Generates static paths for all projects and supported languages.
 */
export async function getProjectsStaticPaths(): Promise<ProjectPathParams[]> {
  const projects = await getCollection("projects");
  if (!projects) {
    throw new Error("Projects collection not found");
  }

  return projects.map((project) => {
    const lang = project.id.split("/").pop() || "en";
    return {
      params: {
        id: project.data.id,
        lang,
      },
    };
  });
}
