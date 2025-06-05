import { file, glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const profile = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/profile" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    avatar: z.string(),
    social: z.array(
      z.object({
        icon: z.string(),
        label: z.string(),
        url: z.string().url(),
      })
    ),
  })
});

const skills = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/skills" }),
  schema: z.record(
    z.string(),
    z.record(
      z.string(),
      z.string()
    )
  )
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    github: z.object({
      user: z.string(),
      repository: z.string(),
      branch: z.string(),
    }),
    skills: z.array(z.string()),
  })
});

export const collections = { profile, skills, projects };