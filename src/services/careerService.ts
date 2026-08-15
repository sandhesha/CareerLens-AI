import type {
  CareerRoadmap,
  Job,
  ResumeProfile,
} from "../types/career";

const JOB_DATABASE: Omit<
  Job,
  "match" | "matchedSkills" | "missingSkills"
>[] = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova",
    location: "Bangalore, India",
    type: "Internship",
    experience: "0–1 years",
    salary: "₹15K–₹25K/month",
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Git",
    ],
    description:
      "Build responsive web applications and reusable frontend components.",
  },

  {
    id: 2,
    title: "AI/ML Engineer Intern",
    company: "NeuralWorks",
    location: "Bangalore, India",
    type: "Internship",
    experience: "0–1 years",
    salary: "₹20K–₹30K/month",
    skills: [
      "Python",
      "Machine Learning",
      "NumPy",
      "Pandas",
      "TensorFlow",
      "SQL",
    ],
    description:
      "Work on machine learning models, data preprocessing and AI applications.",
  },

  {
    id: 3,
    title: "Full Stack Developer Intern",
    company: "CodeCraft",
    location: "Remote",
    type: "Remote",
    experience: "0–1 years",
    salary: "₹18K–₹28K/month",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Git",
    ],
    description:
      "Develop modern full-stack applications using React and Node.js.",
  },

  {
    id: 4,
    title: "Data Analyst Intern",
    company: "DataSphere",
    location: "Hyderabad, India",
    type: "Internship",
    experience: "0–1 years",
    salary: "₹15K–₹25K/month",
    skills: [
      "Python",
      "SQL",
      "Excel",
      "Power BI",
      "Tableau",
      "Pandas",
    ],
    description:
      "Analyze business data and build dashboards for data-driven decisions.",
  },

  {
    id: 5,
    title: "AI Application Developer",
    company: "FutureAI",
    location: "Remote",
    type: "Remote",
    experience: "0–2 years",
    salary: "₹25K–₹40K/month",
    skills: [
      "Python",
      "React",
      "Generative AI",
      "APIs",
      "FastAPI",
      "Machine Learning",
    ],
    description:
      "Build AI-powered applications using modern LLM and web technologies.",
  },

  {
    id: 6,
    title: "Python Developer Intern",
    company: "PyTech",
    location: "Mangalore, India",
    type: "Internship",
    experience: "0–1 years",
    salary: "₹12K–₹22K/month",
    skills: [
      "Python",
      "FastAPI",
      "Flask",
      "SQL",
      "Git",
      "REST API",
    ],
    description:
      "Develop backend APIs and Python-based web applications.",
  },

  {
    id: 7,
    title: "Machine Learning Engineer",
    company: "VisionLabs",
    location: "Pune, India",
    type: "Full-time",
    experience: "0–2 years",
    salary: "₹5–8 LPA",
    skills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "SQL",
    ],
    description:
      "Develop and deploy machine learning and deep learning solutions.",
  },

  {
    id: 8,
    title: "Software Engineer",
    company: "InnovateX",
    location: "Bangalore, India",
    type: "Full-time",
    experience: "0–2 years",
    salary: "₹6–10 LPA",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Python",
      "SQL",
      "Git",
    ],
    description:
      "Build scalable software applications and collaborate with engineering teams.",
  },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getResumeSkills(resume: ResumeProfile): string[] {
  return [
    ...(resume.skills || []),
    ...(resume.technicalSkills || []),
    ...(resume.softSkills || []),
    ...(resume.interests || []),
    ...(resume.projects || []).flatMap(
      (project) => project.technologies || []
    ),
  ]
    .map(normalize)
    .filter(Boolean);
}

export function calculateJobMatches(
  resume: ResumeProfile
): Job[] {
  const resumeSkills = getResumeSkills(resume);

  return JOB_DATABASE.map((job) => {
    const matchedSkills = job.skills.filter((skill) => {
      const normalizedJobSkill = normalize(skill);

      return resumeSkills.some(
        (resumeSkill) =>
          resumeSkill === normalizedJobSkill ||
          resumeSkill.includes(normalizedJobSkill) ||
          normalizedJobSkill.includes(resumeSkill)
      );
    });

    const missingSkills = job.skills.filter(
      (skill) => !matchedSkills.includes(skill)
    );

    const match = Math.round(
      (matchedSkills.length / job.skills.length) * 100
    );

    return {
      ...job,
      match,
      matchedSkills,
      missingSkills,
    };
  }).sort((a, b) => b.match - a.match);
}

export function generateCareerRoadmap(
  resume: ResumeProfile
): CareerRoadmap {
  const skills = getResumeSkills(resume);

  const frontendSkills = [
    "react",
    "typescript",
    "javascript",
    "html",
    "css",
  ];

  const aiSkills = [
    "python",
    "machine learning",
    "tensorflow",
    "pytorch",
    "generative ai",
    "numpy",
    "pandas",
  ];

  const backendSkills = [
    "fastapi",
    "flask",
    "node.js",
    "express",
    "rest api",
    "sql",
  ];

  const frontendScore = frontendSkills.filter((skill) =>
    skills.some((item) => item.includes(skill))
  ).length;

  const aiScore = aiSkills.filter((skill) =>
    skills.some((item) => item.includes(skill))
  ).length;

  const backendScore = backendSkills.filter((skill) =>
    skills.some((item) => item.includes(skill))
  ).length;

  let targetRole = "Software Engineer";

  if (aiScore >= frontendScore && aiScore >= backendScore) {
    targetRole = "AI/ML Engineer";
  } else if (frontendScore >= backendScore) {
    targetRole = "Frontend Developer";
  } else {
    targetRole = "Full Stack Developer";
  }

  const roadmapSkills =
    targetRole === "AI/ML Engineer"
      ? [
          "Python",
          "NumPy",
          "Pandas",
          "Machine Learning",
          "Deep Learning",
          "TensorFlow",
          "Generative AI",
          "FastAPI",
        ]
      : targetRole === "Frontend Developer"
      ? [
          "HTML",
          "CSS",
          "JavaScript",
          "TypeScript",
          "React",
          "API Integration",
          "Testing",
          "Deployment",
        ]
      : [
          "JavaScript",
          "TypeScript",
          "React",
          "Node.js",
          "REST API",
          "SQL",
          "Authentication",
          "Deployment",
        ];

  const steps = roadmapSkills.map((skill, index) => {
    const alreadyKnown = skills.some(
      (item) =>
        item === normalize(skill) ||
        item.includes(normalize(skill)) ||
        normalize(skill).includes(item)
    );

    let status: "completed" | "current" | "upcoming";

    if (alreadyKnown) {
      status = "completed";
    } else if (
      index ===
      roadmapSkills.findIndex(
        (item) =>
          !skills.some(
            (known) =>
              known === normalize(item) ||
              known.includes(normalize(item)) ||
              normalize(item).includes(known)
          )
      )
    ) {
      status = "current";
    } else {
      status = "upcoming";
    }

    return {
      id: index + 1,
      title: `Master ${skill}`,
      description: alreadyKnown
        ? `Your resume already demonstrates experience with ${skill}. Strengthen it through projects and practical work.`
        : `Build practical knowledge in ${skill} and add a project demonstrating this skill.`,
      skills: [skill],
      duration: index < 3 ? "2–3 weeks" : "3–4 weeks",
      status,
    };
  });

  const completed = steps.filter(
    (step) => step.status === "completed"
  ).length;

  const match = Math.round(
    (completed / Math.max(steps.length, 1)) * 100
  );

  return {
    targetRole,
    match,
    summary: `Based on the skills, projects and experience detected in your resume, ${targetRole} is currently your strongest career direction.`,
    steps,
  };
}

export function getStoredResume(): ResumeProfile | null {
  try {
    const stored = localStorage.getItem(
      "careerlens_resume"
    );

    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as ResumeProfile;
  } catch {
    return null;
  }
}

export function saveResume(
  resume: ResumeProfile
): void {
  localStorage.setItem(
    "careerlens_resume",
    JSON.stringify(resume)
  );
}
export interface ResumeAnalysisRecord {
  id: string;
  filename: string;
  score: number;
  skills: number;
  jobMatches: number;
  analyzedAt: string;
  resume: ResumeProfile;
}

const RESUME_HISTORY_KEY =
  "careerlens_resume_history";

export function getResumeHistory(): ResumeAnalysisRecord[] {
  try {
    const stored = localStorage.getItem(
      RESUME_HISTORY_KEY
    );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export function saveResumeAnalysis(
  record: ResumeAnalysisRecord
): void {
  const history = getResumeHistory();

  localStorage.setItem(
    RESUME_HISTORY_KEY,
    JSON.stringify([
      record,
      ...history,
    ])
  );

  // Keep the latest resume available
  // for Job Matching, Interview and Roadmap.
  localStorage.setItem(
    "careerlens_resume",
    JSON.stringify(record.resume)
  );
}

export function clearResumeHistory(): void {
  localStorage.removeItem(
    RESUME_HISTORY_KEY
  );
}
export function clearCurrentAnalysis(): void {
  localStorage.removeItem("resumeScore");
  localStorage.removeItem("interviewScore");
  localStorage.removeItem("jobMatches");
  localStorage.removeItem("skillsMatched");
}