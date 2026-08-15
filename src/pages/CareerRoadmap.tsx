import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiCode,
  FiMap,
  FiRefreshCw,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

interface CareerRoadmapProps {
  onBack: () => void;
}

interface RoadmapStep {
  title: string;
  description: string;
  skills: string[];
  resources: string[];
}

interface CareerTrack {
  title: string;
  description: string;
  steps: RoadmapStep[];
}

const careerTracks: Record<string, CareerTrack> = {
  frontend: {
    title: "Frontend Developer",
    description:
      "Build modern, responsive and interactive web applications.",
    steps: [
      {
        title: "Master HTML, CSS & JavaScript",
        description:
          "Strengthen your web fundamentals before moving into advanced frameworks.",
        skills: ["HTML5", "CSS3", "JavaScript ES6+"],
        resources: [
          "Responsive Web Design",
          "JavaScript DOM",
          "Async JavaScript",
        ],
      },
      {
        title: "Master React",
        description:
          "Learn component architecture, hooks, state management and API integration.",
        skills: ["React", "React Hooks", "React Router"],
        resources: [
          "React Components",
          "React Hooks",
          "API Integration",
        ],
      },
      {
        title: "Learn TypeScript",
        description:
          "Use TypeScript to build safer and scalable React applications.",
        skills: ["TypeScript", "Interfaces", "Generics"],
        resources: [
          "TypeScript Fundamentals",
          "TypeScript with React",
          "Advanced Types",
        ],
      },
      {
        title: "Build Production Projects",
        description:
          "Create portfolio projects that demonstrate real-world development skills.",
        skills: [
          "Git",
          "REST APIs",
          "Authentication",
          "Deployment",
        ],
        resources: [
          "Build a SaaS Dashboard",
          "Build an E-commerce App",
          "Deploy with Vercel",
        ],
      },
    ],
  },

  aiml: {
    title: "AI / ML Engineer",
    description:
      "Build intelligent applications using machine learning and AI.",
    steps: [
      {
        title: "Strengthen Python",
        description:
          "Become comfortable with Python programming and data manipulation.",
        skills: ["Python", "Functions", "OOP", "Git"],
        resources: [
          "Python Fundamentals",
          "Object Oriented Programming",
          "Python Projects",
        ],
      },
      {
        title: "Learn Data Science",
        description:
          "Learn how to clean, analyze and visualize datasets.",
        skills: ["NumPy", "Pandas", "Matplotlib", "SQL"],
        resources: [
          "Data Cleaning",
          "Exploratory Data Analysis",
          "SQL for Data Science",
        ],
      },
      {
        title: "Machine Learning",
        description:
          "Understand supervised and unsupervised machine learning.",
        skills: [
          "Scikit-learn",
          "Regression",
          "Classification",
          "Clustering",
        ],
        resources: [
          "Machine Learning Fundamentals",
          "Model Evaluation",
          "Feature Engineering",
        ],
      },
      {
        title: "Deep Learning & GenAI",
        description:
          "Move into neural networks, LLMs and retrieval augmented generation.",
        skills: [
          "TensorFlow",
          "Neural Networks",
          "LLMs",
          "RAG",
        ],
        resources: [
          "Deep Learning",
          "Generative AI",
          "RAG Applications",
        ],
      },
    ],
  },

  fullstack: {
    title: "Full Stack Developer",
    description:
      "Develop complete applications across frontend and backend.",
    steps: [
      {
        title: "Frontend Development",
        description:
          "Build strong frontend fundamentals and React applications.",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        resources: [
          "React",
          "Responsive Design",
          "Frontend Projects",
        ],
      },
      {
        title: "Backend Development",
        description:
          "Learn APIs, authentication and backend architecture.",
        skills: ["Node.js", "FastAPI", "REST API"],
        resources: [
          "REST APIs",
          "Authentication",
          "Backend Architecture",
        ],
      },
      {
        title: "Databases",
        description:
          "Learn relational and NoSQL database design.",
        skills: ["SQL", "PostgreSQL", "MongoDB"],
        resources: [
          "SQL",
          "Database Design",
          "MongoDB",
        ],
      },
      {
        title: "Deployment",
        description:
          "Deploy complete applications and understand production environments.",
        skills: ["Git", "Docker", "Cloud", "CI/CD"],
        resources: [
          "Docker",
          "Cloud Deployment",
          "CI/CD",
        ],
      },
    ],
  },

  data: {
    title: "Data Analyst",
    description:
      "Turn raw data into meaningful insights and business decisions.",
    steps: [
      {
        title: "Excel & Data Cleaning",
        description:
          "Build strong spreadsheet and data-cleaning skills.",
        skills: ["Excel", "Data Cleaning", "Pivot Tables"],
        resources: [
          "Advanced Excel",
          "Data Cleaning",
          "Pivot Tables",
        ],
      },
      {
        title: "SQL",
        description:
          "Learn how to query and analyze relational databases.",
        skills: ["SQL", "Joins", "CTEs", "Window Functions"],
        resources: [
          "SQL Fundamentals",
          "Advanced SQL",
          "SQL Projects",
        ],
      },
      {
        title: "Power BI / Tableau",
        description:
          "Create interactive dashboards and business reports.",
        skills: ["Power BI", "DAX", "Tableau"],
        resources: [
          "Power BI",
          "DAX",
          "Dashboard Design",
        ],
      },
      {
        title: "Portfolio Projects",
        description:
          "Create data analytics projects using real datasets.",
        skills: [
          "Data Visualization",
          "Business Analysis",
          "Storytelling",
        ],
        resources: [
          "Sales Dashboard",
          "Customer Analytics",
          "Business Intelligence",
        ],
      },
    ],
  },
};

function detectTrack(text: string) {
  const value = text.toLowerCase();

  let frontend = 0;
  let aiml = 0;
  let fullstack = 0;
  let data = 0;

  // Frontend
  if (value.includes("react")) frontend += 3;
  if (value.includes("typescript")) frontend += 2;
  if (value.includes("javascript")) frontend += 2;
  if (value.includes("html")) frontend += 1;
  if (value.includes("css")) frontend += 1;

  // AI / ML
  if (value.includes("python")) aiml += 2;
  if (value.includes("machine learning")) aiml += 4;
  if (value.includes("tensorflow")) aiml += 3;
  if (value.includes("artificial intelligence")) aiml += 3;
  if (value.includes(" ai ")) aiml += 2;
  if (value.includes("pandas")) aiml += 2;
  if (value.includes("numpy")) aiml += 2;

  // Full Stack
  if (value.includes("node")) fullstack += 2;
  if (value.includes("express")) fullstack += 2;
  if (value.includes("mongodb")) fullstack += 2;
  if (value.includes("backend")) fullstack += 2;
  if (value.includes("api")) fullstack += 1;
  if (value.includes("full stack")) fullstack += 4;

  // Data
  if (value.includes("sql")) data += 2;
  if (value.includes("excel")) data += 2;
  if (value.includes("power bi")) data += 3;
  if (value.includes("tableau")) data += 3;
  if (value.includes("data analyst")) data += 4;
  if (value.includes("data analysis")) data += 3;

  // Explicitly typed mutable array
  const scores: Array<[string, number]> = [
    ["frontend", frontend],
    ["aiml", aiml],
    ["fullstack", fullstack],
    ["data", data],
  ];

  scores.sort((a: [string, number], b: [string, number]) => {
    return b[1] - a[1];
  });

  return scores[0][1] > 0 ? scores[0][0] : "frontend";
}

function extractSkills(text: string): string[] {
  const skills = [
    "React",
    "TypeScript",
    "JavaScript",
    "Python",
    "SQL",
    "MongoDB",
    "Node.js",
    "FastAPI",
    "Flask",
    "TensorFlow",
    "Machine Learning",
    "AI",
    "Pandas",
    "NumPy",
    "Excel",
    "Power BI",
    "Tableau",
    "HTML",
    "CSS",
    "Git",
  ];

  const lower = text.toLowerCase();

  return skills.filter((skill) =>
    lower.includes(skill.toLowerCase())
  );
}

export default function CareerRoadmap({
  onBack,
}: CareerRoadmapProps) {
  const [resumeText, setResumeText] = useState<string>("");
  const [expanded, setExpanded] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadResume = () => {
    setRefreshing(true);

    const text = localStorage.getItem("resumeText") || "";

    setResumeText(text);

    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  };

  useEffect(() => {
  loadResume();

  const handleUpdate = () => {
    loadResume();
  };

  const handleSessionReset = () => {
    setResumeText("");
    setExpanded(0);
    setRefreshing(false);
  };

  window.addEventListener(
    "careerlens-dashboard-update",
    handleUpdate
  );

  window.addEventListener(
    "careerlens-session-reset",
    handleSessionReset
  );

  return () => {
    window.removeEventListener(
      "careerlens-dashboard-update",
      handleUpdate
    );

    window.removeEventListener(
      "careerlens-session-reset",
      handleSessionReset
    );
  };
}, []);

  const track = useMemo(
    () => detectTrack(resumeText),
    [resumeText]
  );

  const career = careerTracks[track];

  const currentSkills = useMemo(
    () => extractSkills(resumeText),
    [resumeText]
  );

  const roadmapProgress = Math.min(
    95,
    Math.max(
      10,
      Math.round(
        (currentSkills.length /
          Math.max(career.steps.length * 3, 1)) *
          100
      )
    )
  );

  if (!resumeText.trim()) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiMap size={30} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Career Roadmap
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-slate-500">
              Upload and analyze your resume first. CareerLens will
              create a roadmap based on your current skills.
            </p>

            <button
              onClick={onBack}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Go to Resume Analyzer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={onBack}
              className="mb-3 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
            >
              <FiArrowLeft />
              Dashboard
            </button>

            <h1 className="text-3xl font-bold text-slate-900">
              Career Roadmap
            </h1>

            <p className="mt-1 text-slate-500">
              A personalized career path generated from your resume.
            </p>
          </div>

          <button
            onClick={loadResume}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <FiRefreshCw
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh Roadmap
          </button>
        </div>

        {/* CAREER HERO */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
                <FiTarget />
                Recommended Career
              </div>

              <h2 className="text-3xl font-bold">
                {career.title}
              </h2>

              <p className="mt-2 max-w-2xl text-blue-100">
                {career.description}
              </p>
            </div>

            <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl bg-white/15">
              <span className="text-3xl font-bold">
                {roadmapProgress}%
              </span>

              <span className="text-xs text-blue-100">
                Progress
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs text-blue-100">
              <span>Career readiness</span>
              <span>{roadmapProgress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{
                  width: `${roadmapProgress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* CURRENT SKILLS */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <FiCheckCircle />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Your Current Skills
              </h2>

              <p className="text-sm text-slate-500">
                Detected from your uploaded resume
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {currentSkills.length > 0 ? (
              currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"
                >
                  ✓ {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No predefined skills detected. Add more technical
                skills to your resume.
              </p>
            )}
          </div>
        </div>

        {/* ROADMAP */}
        <div className="mt-6">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Your Learning Roadmap
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Follow these steps to become job-ready.
            </p>
          </div>

          <div className="space-y-4">
            {career.steps.map((step, index) => {
              const isOpen = expanded === index;

              return (
                <div
                  key={step.title}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <button
                    onClick={() =>
                      setExpanded(isOpen ? -1 : index)
                    }
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {step.description}
                      </p>
                    </div>

                    {isOpen ? (
                      <FiChevronUp className="text-slate-400" />
                    ) : (
                      <FiChevronDown className="text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 px-5 pb-6 pt-5">
                      <div className="grid gap-5 md:grid-cols-2">

                        {/* SKILLS */}
                        <div>
                          <div className="mb-3 flex items-center gap-2">
                            <FiCode className="text-blue-600" />

                            <h4 className="font-semibold text-slate-900">
                              Skills to Learn
                            </h4>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {step.skills.map((skill) => {
                              const alreadyHave =
                                currentSkills.some(
                                  (item) =>
                                    item.toLowerCase() ===
                                    skill.toLowerCase()
                                );

                              return (
                                <span
                                  key={skill}
                                  className={`rounded-lg px-3 py-2 text-xs font-medium ${
                                    alreadyHave
                                      ? "bg-green-50 text-green-700"
                                      : "bg-blue-50 text-blue-700"
                                  }`}
                                >
                                  {alreadyHave ? "✓ " : ""}
                                  {skill}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* RESOURCES */}
                        <div>
                          <div className="mb-3 flex items-center gap-2">
                            <FiBookOpen className="text-purple-600" />

                            <h4 className="font-semibold text-slate-900">
                              Recommended Learning
                            </h4>
                          </div>

                          <div className="space-y-2">
                            {step.resources.map((resource) => (
                              <div
                                key={resource}
                                className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
                              >
                                {resource}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                Keep improving your profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add missing skills, build projects and practice
                interviews to improve your job match score.
              </p>
            </div>

            <div className="flex items-center gap-2 text-blue-600">
              <FiTrendingUp />

              <span className="text-sm font-semibold">
                Keep growing
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}