import { getCollection } from "astro:content";

export async function getProjectsParams() {
  const projects = await getCollection('projects');
  if (!projects) throw new Error(`Projects collection not found`);

  return projects.map(project => {
    const lang = project.id.split('/').pop();
    return { params: { id: project.data.id, lang } };
  });
}

export async function getSkillsParams() {
  const langSkills = await getCollection('skills');
  if (!langSkills) throw new Error(`Skills collection not found`);

  return langSkills.map(skill => {
    const lang = skill.id;
    return Object.values(skill.data).map(category => {
      return Object.keys(category).map(skillName => ({ params: { name: skillName, lang } }));
    })
  }).flat(2);
}