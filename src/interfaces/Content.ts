export type GitAccount = { username: string; git: string };

export interface Config {
  gitProfile: GitAccount | boolean;
  gitProjects: GitAccount[] | boolean;
}

export interface ProfileSocial {
  icon: string;
  label: string;
  url: string;
}

export interface Profile {
  title: string;
  description: string;
  avatar: string;
  social: ProfileSocial[];
}

export interface Skills {
  [group: string]: {
    [skill: string]: string;
  };
}

export interface FlatSkills {
  [skill: string]: string;
}

export interface ProjectGithub {
  user: string;
  repository: string;
  branch: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  status?: 'completed' | 'in_progress';
  github: ProjectGithub;
  skills: string[];
}

export type Projects = Project[];

export interface UIContent {
  projects: string;
  skills: string;
  go_back: string;
  view_github: string;
  status: {
    in_progress: string;
    completed: string;
  };
}