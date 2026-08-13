import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiExternalLink,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
  FiTarget,
  FiTrendingUp,
  FiXCircle,
} from "react-icons/fi";

interface JobMatchingProps {
  onBack: () => void;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  skills: string[];
  description: string;
  url: string;
}

interface MatchedJob extends Job {
  match: number;
  matchedSkills: string[];
  missingSkills: string[];
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Technology Company",
    location: "Bengaluru, India",
    type: "Full Time",
    salary: "₹5–10 LPA",
    skills: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
    ],
    description:
      "Build modern responsive web applications using React and TypeScript.",
    url: "https://www.linkedin.com/jobs/",
  },
  {
    id: 2,
    title: "AI/ML Engineer",
    company: "AI Technology Company",
    location: "Bengaluru, India",
    type: "Full Time",
    salary: "₹6–14 LPA",
    skills: [
      "Python",
      "Machine Learning",
      "AI",
      "TensorFlow",
      "SQL",
    ],
    description:
      "Develop machine learning models and AI-powered applications.",
    url: "https://www.linkedin.com/jobs/",
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Software Company",
    location: "Hyderabad, India",
    type: "Full Time",
    salary: "₹6–12 LPA",
    skills: [
      "React",
      "Node.js",
      "JavaScript",
      "MongoDB",
      "SQL",
    ],
    description:
      "Develop complete web applications across frontend and backend.",
    url: "https://www.linkedin.com/jobs/",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Analytics Company",
    location: "Pune, India",
    type: "Full Time",
    salary: "₹4–9 LPA",
    skills: [
      "Python",
      "SQL",
      "Excel",
      "Power BI",
      "Tableau",
    ],
    description:
      "Analyze business data and create dashboards and actionable insights.",
    url: "https://www.linkedin.com/jobs/",
  },
  {
    id: 5,
    title: "Python Developer",
    company: "Software Company",
    location: "Chennai, India",
    type: "Full Time",
    salary: "₹5–10 LPA",
    skills: [
      "Python",
      "FastAPI",
      "Flask",
      "SQL",
      "Git",
    ],
    description:
      "Build backend services and APIs using Python technologies.",
    url: "https://www.linkedin.com/jobs/",
  },
  {
    id: 6,
    title: "Machine Learning Intern",
    company: "AI Startup",
    location: "Remote",
    type: "Internship",
    salary: "₹15K–30K/month",
    skills: [
      "Python",
      "Machine Learning",
      "Pandas",
      "NumPy",
      "AI",
    ],
    description:
      "Work on practical machine learning and artificial intelligence projects.",
    url: "https://www.linkedin.com/jobs/",
  },
  {
    id: 7,
    title: "AI Software Developer",
    company: "AI Startup",
    location: "Remote",
    type: "Full Time",
    salary: "₹6–12 LPA",
    skills: [
      "Python",
      "AI",
      "Machine Learning",
      "FastAPI",
      "Git",
    ],
    description:
      "Develop AI-powered software products and backend services.",
    url: "https://www.linkedin.com/jobs/",
  },
  {
    id: 8,
    title: "Junior Data Scientist",
    company: "Analytics Technology Company",
    location: "Bengaluru, India",
    type: "Full Time",
    salary: "₹5–11 LPA",
    skills: [
      "Python",
      "Pandas",
      "NumPy",
      "Machine Learning",
      "SQL",
    ],
    description:
      "Analyze datasets and develop machine learning models for business problems.",
    url: "https://www.linkedin.com/jobs/",
  },
];

const skillAliases: Record<string, string[]> = {
  react: ["react", "reactjs", "react.js"],
  typescript: ["typescript", "ts"],
  javascript: ["javascript", "js"],
  python: ["python"],
  sql: ["sql", "mysql", "postgresql", "postgres"],
  mongodb: ["mongodb", "mongo"],
  nodejs: ["node.js", "nodejs", "node"],
  fastapi: ["fastapi"],
  flask: ["flask"],
  tensorflow: ["tensorflow"],
  machinelearning: [
    "machine learning",
    "machine-learning",
    "machinelearning",
    "ml",
  ],
  ai: [
    "artificial intelligence",
    "artificial-intelligence",
    "ai",
  ],
  pandas: ["pandas"],
  numpy: ["numpy"],
  excel: ["excel", "microsoft excel"],
  powerbi: ["power bi", "powerbi"],
  tableau: ["tableau"],
  html: ["html", "html5"],
  css: ["css", "css3"],
  git: ["git", "github"],
};

const skillLabels: Record<string, string> = {
  react: "React",
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  sql: "SQL",
  mongodb: "MongoDB",
  nodejs: "Node.js",
  fastapi: "FastAPI",
  flask: "Flask",
  tensorflow: "TensorFlow",
  machinelearning: "Machine Learning",
  ai: "AI",
  pandas: "Pandas",
  numpy: "NumPy",
  excel: "Excel",
  powerbi: "Power BI",
  tableau: "Tableau",
  html: "HTML",
  css: "CSS",
  git: "Git/GitHub",
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s.+#-]/g, " ");
}

function extractResumeSkills(text: string) {
  const normalized = normalize(text);

  const found = new Set<string>();

  Object.entries(skillAliases).forEach(
    ([skill, aliases]) => {
      const matched = aliases.some((alias) =>
        normalized.includes(normalize(alias))
      );

      if (matched) {
        found.add(skill);
      }
    }
  );

  return found;
}

function getSkillKey(skill: string) {
  const normalized = normalize(skill);

  if (normalized.includes("react")) return "react";
  if (normalized.includes("typescript")) return "typescript";
  if (normalized.includes("javascript")) return "javascript";
  if (normalized === "python") return "python";
  if (normalized.includes("sql")) return "sql";
  if (normalized.includes("mongodb")) return "mongodb";
  if (normalized.includes("node")) return "nodejs";
  if (normalized.includes("fastapi")) return "fastapi";
  if (normalized.includes("flask")) return "flask";
  if (normalized.includes("tensorflow")) return "tensorflow";
  if (normalized.includes("machine")) {
    return "machinelearning";
  }
  if (normalized === "ai") return "ai";
  if (normalized.includes("pandas")) return "pandas";
  if (normalized.includes("numpy")) return "numpy";
  if (normalized.includes("excel")) return "excel";
  if (normalized.includes("power bi")) return "powerbi";
  if (normalized.includes("tableau")) return "tableau";
  if (normalized.includes("html")) return "html";
  if (normalized.includes("css")) return "css";
  if (normalized.includes("git")) return "git";

  return normalized;
}

function calculateJobMatch(
  job: Job,
  resumeSkills: Set<string>
): MatchedJob {
  const matchedSkills = job.skills.filter((skill) =>
    resumeSkills.has(getSkillKey(skill))
  );

  const missingSkills = job.skills.filter(
    (skill) => !resumeSkills.has(getSkillKey(skill))
  );

  const match =
    job.skills.length === 0
      ? 0
      : Math.round(
          (matchedSkills.length / job.skills.length) * 100
        );

  return {
    ...job,
    match,
    matchedSkills,
    missingSkills,
  };
}

export default function JobMatching({
  onBack,
}: JobMatchingProps) {
  const [resumeText, setResumeText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const loadResume = useCallback(() => {
    setRefreshing(true);

    const latestResume =
      localStorage.getItem("resumeText") || "";

    setResumeText(latestResume);

    window.setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }, []);

  useEffect(() => {
    loadResume();

    const handleResumeUpdate = () => {
      loadResume();
    };

    window.addEventListener(
      "careerlens-dashboard-update",
      handleResumeUpdate
    );

    window.addEventListener(
      "storage",
      handleResumeUpdate
    );

    return () => {
      window.removeEventListener(
        "careerlens-dashboard-update",
        handleResumeUpdate
      );

      window.removeEventListener(
        "storage",
        handleResumeUpdate
      );
    };
  }, [loadResume]);

  const resumeSkills = useMemo(
    () => extractResumeSkills(resumeText),
    [resumeText]
  );

  const matchedJobs = useMemo(() => {
    return jobs
      .map((job) =>
        calculateJobMatch(job, resumeSkills)
      )
      .sort((a, b) => b.match - a.match);
  }, [resumeSkills]);

  const filteredJobs = useMemo(() => {
    const query = search.toLowerCase().trim();

    return matchedJobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      const matchesFilter =
        filter === "All" ||
        (filter === "90%+" && job.match >= 90) ||
        (filter === "80%+" && job.match >= 80) ||
        (filter === "70%+" && job.match >= 70);

      return matchesSearch && matchesFilter;
    });
  }, [matchedJobs, search, filter]);

  const totalMatches = matchedJobs.filter(
    (job) => job.match >= 50
  ).length;

  const topMatch = matchedJobs[0];

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
              <FiTarget size={30} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Upload Your Resume First
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-slate-500">
              Upload a resume and CareerLens will identify your
              skills and match you with suitable career
              opportunities.
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
      <div className="mx-auto max-w-7xl">

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
              Job Matching
            </h1>

            <p className="mt-1 text-slate-500">
              Personalized jobs based on the skills detected
              from your resume.
            </p>
          </div>

          <button
            onClick={loadResume}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <FiRefreshCw
              className={
                refreshing ? "animate-spin" : ""
              }
            />
            Refresh Matches
          </button>
        </div>

        {/* STATS */}

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Job Matches
              </p>

              <FiTarget className="text-blue-600" />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {totalMatches}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              50%+ compatibility
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Skills Detected
              </p>

              <FiTrendingUp className="text-emerald-600" />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {resumeSkills.size}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              From your resume
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Best Match
              </p>

              <FiCheckCircle className="text-green-600" />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {topMatch?.match || 0}%
            </p>

            <p className="mt-1 truncate text-sm text-slate-500">
              {topMatch?.title || "No match"}
            </p>
          </div>

        </div>

        {/* SKILLS */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Skills Found in Your Resume
          </h2>

          {resumeSkills.size === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No supported technical skills were detected.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.from(resumeSkills).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                >
                  {skillLabels[skill] || skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SEARCH */}

        <div className="mt-6 flex flex-col gap-3 md:flex-row">

          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <FiSearch className="text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search jobs, companies or skills..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option>All</option>
            <option>90%+</option>
            <option>80%+</option>
            <option>70%+</option>
          </select>

        </div>

        {/* JOBS */}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">

          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-start justify-between gap-4">

                <div className="flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiBriefcase size={22} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      {job.title}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {job.company}
                    </p>
                  </div>

                </div>

                <div
                  className={`rounded-full px-3 py-1 text-sm font-bold ${
                    job.match >= 80
                      ? "bg-green-50 text-green-700"
                      : job.match >= 60
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                  }`}
                >
                  {job.match}%
                </div>

              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">

                <span className="flex items-center gap-1">
                  <FiMapPin />
                  {job.location}
                </span>

                <span>•</span>

                <span>{job.type}</span>

                <span>•</span>

                <span>{job.salary}</span>

              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {job.description}
              </p>

              <div className="mt-4">

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Required Skills
                </p>

                <div className="flex flex-wrap gap-2">

                  {job.skills.map((skill) => {

                    const matched =
                      resumeSkills.has(
                        getSkillKey(skill)
                      );

                    return (
                      <span
                        key={skill}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                          matched
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {matched ? "✓ " : ""}
                        {skill}
                      </span>
                    );
                  })}

                </div>
              </div>

              {job.missingSkills.length > 0 && (
                <div className="mt-4 rounded-xl bg-orange-50 p-3">

                  <p className="text-xs font-semibold text-orange-700">
                    Skills to improve
                  </p>

                  <p className="mt-1 text-xs text-orange-600">
                    {job.missingSkills.join(", ")}
                  </p>

                </div>
              )}

              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Search Jobs
                <FiExternalLink />
              </a>

            </div>
          ))}

        </div>

        {filteredJobs.length === 0 && (
          <div className="mt-6 rounded-2xl bg-white p-10 text-center">

            <FiXCircle
              size={35}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-3 font-semibold text-slate-900">
              No matching jobs found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search or match filter.
            </p>

          </div>
        )}

      </div>
    </div>
  );
}