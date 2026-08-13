import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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

import {
  calculateJobMatches,
  getStoredResume,
} from "../services/careerService";

import type { Job } from "../types/career";

interface JobMatchingProps {
  onBack: () => void;
}

/*
 * =====================================================
 * JOB URL
 * =====================================================
 *
 * These are search pages for now.
 * Later we can connect real job APIs.
 */

function getJobSearchUrl(job: Job): string {
  const query = encodeURIComponent(
    `${job.title} ${job.location}`
  );

  return `https://www.linkedin.com/jobs/search/?keywords=${query}`;
}

/*
 * =====================================================
 * COMPONENT
 * =====================================================
 */

export default function JobMatching({
  onBack,
}: JobMatchingProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  /*
   * ===================================================
   * LOAD RESUME + CALCULATE MATCHES
   * ===================================================
   */

  const loadResume = useCallback(() => {
    setRefreshing(true);

    const resume = getStoredResume();

    if (resume) {
      const matches = calculateJobMatches(resume);

      setJobs(matches);
    } else {
      setJobs([]);
    }

    window.setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }, []);

  /*
   * ===================================================
   * INITIAL LOAD
   * ===================================================
   */

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

  /*
   * ===================================================
   * FILTER JOBS
   * ===================================================
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
          skill
            .toLowerCase()
            .includes(query)
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
        matchesSearch &&
        matchesFilter
      );
    });
  }, [jobs, search, filter]);

  /*
   * ===================================================
   * STATISTICS
   * ===================================================
   */

  const totalMatches = jobs.filter(
    (job) => job.match >= 50
  ).length;

  const topMatch = jobs[0];

  /*
   * ===================================================
   * STORED RESUME
   * ===================================================
   */

  const resume = getStoredResume();

  /*
   * ===================================================
   * NO RESUME
   * ===================================================
   */

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">

          <button
            type="button"
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
              Upload and analyze your resume
              first. CareerLens will then use
              your detected skills to calculate
              job compatibility.
            </p>

            <button
              type="button"
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

  /*
   * ===================================================
   * MAIN PAGE
   * ===================================================
   */

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div>

            <button
              type="button"
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
              Personalized opportunities based
              on your resume skills.
            </p>

          </div>

          <button
            type="button"
            onClick={loadResume}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <FiRefreshCw
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh Matches
          </button>

        </div>

        {/* STATS */}

        <div className="grid gap-4 md:grid-cols-3">

          {/* JOB MATCHES */}

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

          {/* SKILLS */}

          <div className="rounded-2xl bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <p className="text-sm text-slate-500">
                Skills Detected
              </p>

              <FiTrendingUp className="text-emerald-600" />

            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {new Set([
                ...(resume.skills || []),
                ...(resume.technicalSkills || []),
                ...(resume.softSkills || []),
              ]).size}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              From your resume
            </p>

          </div>

          {/* BEST MATCH */}

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

        {/* RESUME SKILLS */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="font-semibold text-slate-900">
            Skills Found in Your Resume
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">

            {[
              ...(resume.skills || []),
              ...(resume.technicalSkills || []),
              ...(resume.softSkills || []),
              ...(resume.interests || []),
            ]
              .filter(Boolean)
              .filter(
                (skill, index, array) =>
                  array.indexOf(skill) === index
              )
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                >
                  {skill}
                </span>
              ))}

          </div>

        </div>

        {/* SEARCH + FILTER */}

        <div className="mt-6 flex flex-col gap-3 md:flex-row">

          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">

            <FiSearch className="text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search jobs, companies or skills..."
              className="w-full bg-transparent text-sm outline-none"
            />

          </div>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option>All</option>
            <option>90%+</option>
            <option>80%+</option>
            <option>70%+</option>
          </select>

        </div>

        {/* JOB CARDS */}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">

          {filteredJobs.map((job) => (

            <div
              key={job.id}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* TITLE */}

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

                {/* MATCH */}

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

              {/* META */}

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">

                <span className="flex items-center gap-1">
                  <FiMapPin />
                  {job.location}
                </span>

                <span>•</span>

                <span>
                  {job.type}
                </span>

                <span>•</span>

                <span>
                  {job.salary}
                </span>

              </div>

              {/* DESCRIPTION */}

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {job.description}
              </p>

              {/* REQUIRED SKILLS */}

              <div className="mt-4">

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Required Skills
                </p>

                <div className="flex flex-wrap gap-2">

                  {job.skills.map(
                    (skill) => {

                      const matched =
                        job.matchedSkills.includes(
                          skill
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
                          {matched
                            ? "✓ "
                            : ""}
                          {skill}
                        </span>
                      );
                    }
                  )}

                </div>

              </div>

              {/* MISSING SKILLS */}

              {job.missingSkills.length >
                0 && (

                <div className="mt-4 rounded-xl bg-orange-50 p-3">

                  <p className="text-xs font-semibold text-orange-700">
                    Skills to improve
                  </p>

                  <p className="mt-1 text-xs text-orange-600">
                    {job.missingSkills.join(
                      ", "
                    )}
                  </p>

                </div>

              )}

              {/* SEARCH JOB */}

              <a
                href={getJobSearchUrl(job)}
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

        {/* NO RESULTS */}

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
              Try another search or match
              filter.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}