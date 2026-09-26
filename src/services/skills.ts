import type { FlatSkills, Project, Skills } from "@/interfaces/Content";
import { getCollection } from "astro:content";
import { loadSkills } from "./content";
import { loadProjects } from "./projects";

export interface SkillPathParams {
  params: {
    name: string;
    lang: string;
  };
}

/**
 * Flattens grouped skills into a dictionary of skill name to icon URL.
 */
export function flattenSkills(skills: Skills): FlatSkills {
  return Object.values(skills).reduce<FlatSkills>((acc, group) => {
    Object.entries(group).forEach(([skillName, iconUrl]) => {
      acc[skillName] = iconUrl;
    });
    return acc;
  }, {});
}

/**
 * Retrieves the icon URL for a specific skill in a given language.
 */
export async function loadSkillIcon(skillName: string, lang: string): Promise<string | undefined> {
  const skills = await loadSkills(lang);
  const flattened = flattenSkills(skills);
  return flattened[skillName];
}

/**
 * Retrieves all projects associated with a given skill and language.
 */
export async function loadProjectsBySkill(skillName: string, lang: string): Promise<Project[]> {
  const allProjects = await loadProjects(lang);
  return allProjects.filter((project) => project.skills.includes(skillName));
}

/**
 * Generates static paths for all skills across all supported languages.
 */
export async function getSkillsStaticPaths(): Promise<SkillPathParams[]> {
  const langSkills = await getCollection("skills");
  if (!langSkills) {
    throw new Error("Skills collection not found");
  }

  return langSkills.flatMap((skillEntry) => {
    const lang = skillEntry.id;
    return Object.values(skillEntry.data).flatMap((group) =>
      Object.keys(group).map((skillName) => ({
        params: { name: skillName, lang },
      }))
    );
  });
}
