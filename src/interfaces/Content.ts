export type GitAccount = { username: string; git: string };

export interface Config {
  gitProfile: GitAccount | boolean;
  gitProjects: GitAccount[] | boolean;
}

export interface Profile {
  title: string;
  description: string;
  avatar: string;
  social: {
    icon: string;
    label: string;
    url: string;
  }[];
}

export interface Skills {
  [group: string]: {
    [skill: string]: string;
  };
}

export interface FlatSkills {
  [skill: string]: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  github: {
    user: string;
    repository: string;
    branch: string;
  };
  skills: string[];
}

export type Projects = Project[];