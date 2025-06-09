import type { FlatSkills, Skills } from "@/interfaces/Content";

export default function flatSkills(skills: Skills): FlatSkills {
  return Object.values(skills).reduce((acc, catSkills) => {
    Object.entries(catSkills).forEach(([skillName, skillDescription]) => {
      acc[skillName] = skillDescription;
    });
    return acc;
  }, {} as FlatSkills)
}