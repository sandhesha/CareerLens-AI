export interface ResumeProfile {
  name: string;
  email?: string;
  phone?: string;

  summary?: string;

  skills: string[];
  technicalSkills: string[];
  softSkills: string[];

  education: {
    degree: string;
    institution: string;
    year?: string;
  }[];

  experience: {
    role: string;
    company: string;
    duration?: string;
    description?: string;
  }[];

  projects: {
    name: string;
    description?: string;
    technologies?: string[];
  }[];

  certifications?: string[];

  interests?: string[];
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Internship" | "Full-time" | "Remote";
  experience: string;
  salary: string;

  skills: string[];
  description: string;

  match: number;
  matchedSkills: string[];
  missingSkills: string[];

  color?: string;
}

export interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  status: "completed" | "current" | "upcoming";
}

export interface CareerRoadmap {
  targetRole: string;
  match: number;
  summary: string;
  steps: RoadmapStep[];
}