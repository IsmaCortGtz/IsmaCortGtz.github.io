import type { Project, Projects } from '@/interfaces/Content';
import { getEntry, getCollection } from 'astro:content';

export async function loadCollection<T>(collection: string, lang: string): Promise<T> {
  const collectionEntry = await getEntry(collection as never, lang);
  if (!collectionEntry) throw new Error(`Collection ${collection} entry not found`);

  const { data } = collectionEntry;
  if (!data) throw new Error(`Collection data ${collection} not found`);

  return (data as T);
}

export async function loadProjects(lang: string): Promise<Projects> {
  const projects = await getCollection('projects');
  if (!projects) throw new Error(`Projects collection not found`);

  const langProjects = projects.map(project => {
    const currentLang = project.id.split('/').pop();
    if (currentLang !== lang) return null;
    return project.data;
  });

  return langProjects.filter(project => project !== null);
}

export async function loadProject(projectId: string, lang: string): Promise<Project> {
  const project = await getEntry('projects', `${projectId}/${lang}`);
  if (!project) throw new Error(`Project ${projectId} with ${lang} lang not found`);

  const { data } = project;
  if (!data) throw new Error(`Project data ${projectId} not found`);
  return data;
}