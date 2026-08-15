import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";

import JobCard from "../components/JobCard";

interface JobMatchingProps {
  onBack?: () => void;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  skills: string[];
  description: string;
  match: number;
  matchedSkills: string[];
  missingSkills: string[];
}

/*
|--------------------------------------------------------------------------
| JOB DATABASE
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| NORMALIZE SKILL
|--------------------------------------------------------------------------
*/

function normalizeSkill(value: string): string {
  return value
    .toLowerCase()
    .replace(/node\.js/g, "nodejs")
    .replace(/machine learning/g, "machinelearning")
    .replace(/deep learning/g, "deeplearning")
    .replace(/generative ai/g, "generativeai")
    .replace(/rest api/g, "restapi")
    .replace(/[^a-z0-9+#]/g, "")
    .trim();
}

/*
|--------------------------------------------------------------------------
| EXTRACT SKILLS FROM RESUME
|--------------------------------------------------------------------------
*/

function extractResumeSkills(resume: string): string[] {
  const skills = [
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "MySQL",
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "NumPy",
    "Pandas",
    "Excel",
    "Power BI",
    "Tableau",
    "Git",
    "GitHub",
    "FastAPI",
    "Flask",
    "REST API",
    "Generative AI",
    "APIs",
    "Express",
  ];

  const normalizedResume = normalizeSkill(resume);

  return skills.filter((skill) =>
    normalizedResume.includes(normalizeSkill(skill))
  );
}

/*
|--------------------------------------------------------------------------
| CALCULATE MATCH
|--------------------------------------------------------------------------
*/

function calculateJobMatch(
  job: (typeof JOB_DATABASE)[number],
  resumeSkills: string[]
): Job {
  const matchedSkills = job.skills.filter((jobSkill) =>
    resumeSkills.some(
      (resumeSkill) =>
        normalizeSkill(resumeSkill) ===
        normalizeSkill(jobSkill)
    )
  );

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
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const JobMatching: React.FC<JobMatchingProps> = ({
  onBack,
}) => {
  const [resumeText, setResumeText] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isRefreshing, setIsRefreshing] =
    useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  /*
   * ------------------------------------------------------
   * LOAD RESUME + CALCULATE JOBS
   * ------------------------------------------------------
   */

  const fetchMatches = useCallback(() => {
    setIsRefreshing(true);
    setError(null);

    /*
     * Always read the latest resume.
     */

    const latestResume =
      localStorage.getItem("resumeText") || "";

    setResumeText(latestResume);

    /*
     * No resume
     */

    if (!latestResume.trim()) {
      setUserSkills([]);
      setJobs([]);
      setIsRefreshing(false);
      return;
    }

    try {
      /*
       * Extract current resume skills.
       */

      const detectedSkills =
        extractResumeSkills(latestResume);

      setUserSkills(detectedSkills);

      /*
       * Calculate matches.
       */

      const matches = JOB_DATABASE.map((job) =>
        calculateJobMatch(
          job,
          detectedSkills
        )
      ).sort((a, b) => b.match - a.match);

      setJobs(matches);

      /*
       * Save dashboard count.
       */

      const matchCount = matches.filter(
        (job) => job.match >= 50
      ).length;

      localStorage.setItem(
        "jobMatches",
        matchCount.toString()
      );

      /*
       * Notify dashboard.
       */

      window.dispatchEvent(
        new Event("careerlens-dashboard-update")
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to calculate job matches."
      );

      setJobs([]);
    }

    /*
     * Small loading effect.
     */

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  }, []);

  /*
   * ------------------------------------------------------
   * INITIAL LOAD
   * ------------------------------------------------------
   */

  useEffect(() => {
  fetchMatches();

  const handleUpdate = () => {
    fetchMatches();
  };

  const handleSessionReset = () => {
    setResumeText("");
    setJobs([]);
    setUserSkills([]);
    setSearch("");
    setFilter("All");
    setError(null);
    setIsRefreshing(false);
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
}, [fetchMatches]);

  /*
   * ------------------------------------------------------
   * FILTER JOBS
   * ------------------------------------------------------
   */

  const filteredJobs = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title
          .toLowerCase()
          .includes(query) ||
        job.company
          .toLowerCase()
          .includes(query) ||
        job.location
          .toLowerCase()
          .includes(query) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      const matchesFilter =
        filter === "All" ||
        (filter === "90%+" &&
          job.match >= 90) ||
        (filter === "80%+" &&
          job.match >= 80) ||
        (filter === "70%+" &&
          job.match >= 70);

      return (
        matchesSearch && matchesFilter
      );
    });
  }, [jobs, search, filter]);

  /*
   * ------------------------------------------------------
   * STATISTICS
   * ------------------------------------------------------
   */

  const totalMatches = jobs.filter(
    (job) => job.match >= 50
  ).length;

  const bestMatch =
    jobs.length > 0
      ? jobs[0].match
      : 0;

  /*
   * ------------------------------------------------------
   * NO RESUME
   * ------------------------------------------------------
   */

  if (!resumeText.trim()) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">

          {onBack && (
            <button
              onClick={onBack}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>
          )}

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Target size={30} />
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Upload Your Resume First
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-slate-500">
              Upload a resume in the Resume
              Analyzer. CareerLens will detect
              your skills and calculate suitable
              job matches.
            </p>

            {onBack && (
              <button
                onClick={onBack}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Go to Resume Analyzer
              </button>
            )}

          </div>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------
   * MAIN PAGE
   * ------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            {onBack && (
              <button
                onClick={onBack}
                className="mb-3 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft size={16} />
                Dashboard
              </button>
            )}

            <h1 className="text-3xl font-bold text-slate-900">
              Job Matching
            </h1>

            <p className="mt-1 text-slate-500">
              Personalized opportunities based
              on the skills detected from your
              resume.
            </p>

          </div>

          <button
            onClick={fetchMatches}
            disabled={isRefreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                isRefreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {isRefreshing
              ? "Refreshing..."
              : "Refresh Matches"}
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium">
              {error}
            </p>

          </div>
        )}

        {/* STATS */}

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Job Matches
              </p>

              <Target
                size={20}
                className="text-blue-600"
              />

            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {isRefreshing
                ? 0
                : totalMatches}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              50%+ compatibility
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Skills Detected
              </p>

              <TrendingUp
                size={20}
                className="text-emerald-600"
              />

            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {isRefreshing
                ? 0
                : userSkills.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              From your resume
            </p>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Best Match
              </p>

              <CheckCircle2
                size={20}
                className="text-green-600"
              />

            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {isRefreshing
                ? 0
                : bestMatch}
              %
            </p>

            <p className="mt-1 truncate text-sm text-slate-500">
              {jobs[0]?.title ||
                "No match"}
            </p>

          </div>

        </div>

        {/* SKILLS */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            Skills Found in Your Resume
          </h2>

          {userSkills.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No supported technical skills
              were detected.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">

              {userSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                >
                  {skill}
                </span>
              ))}

            </div>
          )}

        </div>

        {/* SEARCH */}

        <div className="mt-6 flex flex-col gap-3 md:flex-row">

          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">

            <Search
              size={18}
              className="text-slate-400"
            />

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

        {isRefreshing ? (

          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">

            <RefreshCw
              size={32}
              className="animate-spin text-blue-600"
            />

            <p className="mt-4 font-medium text-slate-600">
              Finding your best job matches...
            </p>

          </div>

        ) : filteredJobs.length > 0 ? (

          <div className="mt-6 grid gap-5 lg:grid-cols-2">

            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                type={job.type}
                salary={job.salary}
                match={job.match}
                description={job.description}
                skills={job.skills}
              />
            ))}

          </div>

        ) : (

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <Target
              size={40}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-4 font-semibold text-slate-900">
              No matching jobs found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or
              filter.
            </p>

          </div>

        )}

      </div>
    </div>
  );
};

export default JobMatching;