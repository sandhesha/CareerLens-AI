import { useEffect, useState } from "react";
import {
  FiHome,
  FiFileText,
  FiTarget,
  FiMic,
  FiMap,
  FiSettings,
  FiBell,
  FiSearch,
  FiUploadCloud,
  FiArrowUpRight,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiMenu,
  FiX,
} from "react-icons/fi";

import CareerRoadmap from "./pages/CareerRoadmap";
import Interview from "./pages/Interview";
import JobMatching from "./pages/JobMatching";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Settings from "./pages/Settings";
import Notification from "./components/Notification";

import type { Job } from "./types/career";

function App() {
  // =========================================================
  // STATE
  // =========================================================

  const [activePage, setActivePage] =
    useState<string>("Dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState<boolean>(false);

  const [resumeScore, setResumeScore] =
    useState<number>(0);

  const [jobMatches, setJobMatches] =
    useState<number>(0);

  const [interviewScore, setInterviewScore] =
    useState<number>(0);

  const [skillsMatched, setSkillsMatched] =
    useState<number>(0);

  const [dashboardJobs, setDashboardJobs] =
    useState<Job[]>([]);

  const [clientNotification, setClientNotification] =
    useState<{
      type: "success" | "error" | "info" | "warning";
      message: string;
    } | null>(null);
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
  return localStorage.getItem("careerlens-dark-mode") === "true";
});
  useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("careerlens-dark-mode", "true");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("careerlens-dark-mode", "false");
  }
}, [darkMode]);
  // =========================================================
  // INITIAL SESSION RESET
  // =========================================================

  useEffect(() => {
    localStorage.removeItem("resumeScore");
    localStorage.removeItem("interviewScore");
    localStorage.removeItem("jobMatches");
    localStorage.removeItem("skillsMatched");
    localStorage.removeItem("resumeText");
    localStorage.removeItem("careerlens_resume");
    localStorage.removeItem("careerlens_resume_history");

    setResumeScore(0);
    setJobMatches(0);
    setInterviewScore(0);
    setSkillsMatched(0);
    setDashboardJobs([]);

    window.dispatchEvent(
      new Event("careerlens-session-reset")
    );
  }, []);

  // =========================================================
  // DASHBOARD UPDATE LISTENER
  // =========================================================

  useEffect(() => {
    const handleDashboardUpdate = (event: Event) => {
      const customEvent =
        event as CustomEvent<{
          score?: number;
          skills?: number;
          jobMatches?: number;
          jobs?: Job[];
        }>;

      const detail = customEvent.detail;

      if (!detail) {
        return;
      }

      setResumeScore(detail.score ?? 0);
      setSkillsMatched(detail.skills ?? 0);
      setJobMatches(detail.jobMatches ?? 0);
      setDashboardJobs(detail.jobs ?? []);
    };

    window.addEventListener(
      "careerlens-dashboard-update",
      handleDashboardUpdate
    );

    return () => {
      window.removeEventListener(
        "careerlens-dashboard-update",
        handleDashboardUpdate
      );
    };
  }, []);

  // =========================================================
  // CLIENT NOTIFICATION LISTENER
  // =========================================================

  useEffect(() => {
    const handleClientNotification = (event: Event) => {
      const customEvent =
        event as CustomEvent<{
          message?: string;
          type?:
            | "success"
            | "error"
            | "info"
            | "warning";
        }>;

      const message =
        customEvent.detail?.message;

      if (!message) {
        return;
      }

      setClientNotification({
        type:
          customEvent.detail?.type ||
          "success",
        message,
      });
    };

    window.addEventListener(
      "careerlens-client-notification",
      handleClientNotification
    );

    return () => {
      window.removeEventListener(
        "careerlens-client-notification",
        handleClientNotification
      );
    };
  }, []);

  // =========================================================
  // START INTERVIEW EVENT
  // =========================================================

  useEffect(() => {
    const startInterview = () => {
      setActivePage("AI Interview");
      setSidebarOpen(false);
    };

    window.addEventListener(
      "start-careerlens-interview",
      startInterview
    );

    return () => {
      window.removeEventListener(
        "start-careerlens-interview",
        startInterview
      );
    };
  }, []);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const navigation = [
    {
      name: "Dashboard",
      icon: FiHome,
    },
    {
      name: "Resume Analyzer",
      icon: FiFileText,
    },
    {
      name: "Job Matching",
      icon: FiTarget,
    },
    {
      name: "AI Interview",
      icon: FiMic,
    },
    {
      name: "Career Roadmap",
      icon: FiMap,
    },
  ];

  // =========================================================
  // NAVIGATION HANDLER
  // =========================================================

  const navigateTo = (page: string) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  // =========================================================
  // RESUME ANALYSIS COMPLETE
  // =========================================================

  const handleAnalysisComplete = (
    score: number,
    skills: number,
    jobs: number
  ) => {
    setResumeScore(score);
    setSkillsMatched(skills);
    setJobMatches(jobs);

    window.dispatchEvent(
      new CustomEvent(
        "careerlens-dashboard-update",
        {
          detail: {
            score,
            skills,
            jobMatches: jobs,
          },
        }
      )
    );
  };

  // =========================================================
  // INTERVIEW COMPLETE
  // =========================================================

  const handleInterviewComplete = (
    score: number
  ) => {
    setInterviewScore(score);

    window.dispatchEvent(
      new CustomEvent(
        "careerlens-dashboard-update",
        {
          detail: {
            interviewScore: score,
          },
        }
      )
    );
  };

  // =========================================================
  // DASHBOARD STATS
  // =========================================================

  const stats = [
    {
      title: "Resume Score",
      value: `${resumeScore}%`,
      description:
        resumeScore > 0
          ? "Good profile strength"
          : "Upload your resume",
      icon: FiFileText,
      trend:
        resumeScore > 0 ? "+8%" : "",
    },
    {
      title: "Job Matches",
      value: jobMatches.toString(),
      description: "Suitable positions",
      icon: FiTarget,
      trend:
        jobMatches > 0 ? "+12" : "",
    },
    {
      title: "Interview Score",
      value: `${interviewScore}%`,
      description:
        interviewScore > 0
          ? "Last practice"
          : "No interview yet",
      icon: FiMic,
      trend:
        interviewScore > 0 ? "+6%" : "",
    },
    {
      title: "Skills Matched",
      value: skillsMatched.toString(),
      description:
        skillsMatched > 0
          ? "Skills identified"
          : "Upload your resume",
      icon: FiTrendingUp,
      trend:
        skillsMatched > 0 ? "+4" : "",
    },
  ];

  // =========================================================
  // RECENT ACTIVITIES
  // =========================================================

  const activities = [
    {
      title: "Resume analyzed",
      time: "Today, 10:42 AM",
      icon: FiCheckCircle,
    },
    {
      title: "12 new jobs matched",
      time: "Today, 9:18 AM",
      icon: FiTarget,
    },
    {
      title: "Interview practice completed",
      time: "Yesterday, 6:30 PM",
      icon: FiMic,
    },
    {
      title: "Career roadmap updated",
      time: "Yesterday, 4:12 PM",
      icon: FiMap,
    },
  ];

  // =========================================================
  // PAGE CONTENT
  // =========================================================

  let pageContent: React.ReactNode;

  // ---------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------

  if (activePage === "Dashboard") {
    pageContent = (
      <>
        {/* =================================================
            WELCOME SECTION
        ================================================= */}

        <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-blue-500/10 md:p-8">

          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/10" />

          <div className="absolute -bottom-40 right-40 h-80 w-80 rounded-full bg-white/5" />

          <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur">

                <span className="h-2 w-2 rounded-full bg-emerald-300" />

                AI Career Assistant

              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                Welcome back, Sandhesha 👋
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                Your career journey is moving forward.
                Analyze your resume, discover matching
                jobs and practice interviews with AI.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    navigateTo("Resume Analyzer")
                  }
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-600 shadow-lg transition hover:-translate-y-0.5"
                >
                  <FiUploadCloud size={17} />
                  Analyze Resume
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigateTo("AI Interview")
                  }
                  className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <FiMic size={17} />
                  Start Interview
                </button>

              </div>

            </div>

            <div className="grid grid-cols-3 gap-6 lg:min-w-[360px]">

              <div>
                <p className="text-3xl font-bold">
                  {resumeScore}%
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Resume Score
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">
                  {jobMatches}
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Job Matches
                </p>
              </div>

              <div>
                <p className="text-3xl font-bold">
                  {interviewScore}%
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Interview Score
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  {stat.trend && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                      <FiTrendingUp size={12} />
                      {stat.trend}
                    </span>
                  )}

                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {stat.description}
                </p>

              </div>
            );
          })}

        </section>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* RESUME INTELLIGENCE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bold">
                  Resume Intelligence
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest resume analysis
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigateTo("Resume Analyzer")
                }
                className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View analysis
                <FiChevronRight size={16} />
              </button>

            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr]">

              <div className="flex items-center justify-center">

                <div
                  className="relative flex h-40 w-40 items-center justify-center rounded-full"
                  style={{
                    background:
                      `conic-gradient(#2563eb 0 ${resumeScore}%, #e2e8f0 ${resumeScore}% 100%)`,
                  }}
                >

                  <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">

                    <span className="text-4xl font-bold">
                      {resumeScore}
                    </span>

                    <span className="text-xs text-slate-400">
                      out of 100
                    </span>

                  </div>

                </div>

              </div>

              <div>

                <div className="mb-5">

                  <div className="mb-2 flex justify-between text-sm">

                    <span className="font-medium">
                      Profile Strength
                    </span>

                    <span className="font-semibold text-blue-600">
                      {resumeScore >= 80
                        ? "Strong"
                        : resumeScore >= 60
                        ? "Good"
                        : "Needs Improvement"}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                      style={{
                        width: `${resumeScore}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  {[
                    "Technical Skills",
                    "Experience",
                    "Projects",
                    "Keywords",
                  ].map((item, index) => (

                    <div
                      key={item}
                      className="rounded-xl bg-slate-50 p-3"
                    >

                      <div className="flex items-center justify-between">

                        <span className="text-xs text-slate-500">
                          {item}
                        </span>

                        <FiCheckCircle
                          className="text-emerald-500"
                          size={15}
                        />

                      </div>

                      <p className="mt-1 text-sm font-bold">

                        {resumeScore > 0
                          ? index === 1
                            ? "78%"
                            : index === 3
                            ? "74%"
                            : "88%"
                          : "—"}

                      </p>

                    </div>

                  ))}

                </div>

                <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-3">

                  <span className="mt-0.5">
                    💡
                  </span>

                  <p className="text-xs leading-5 text-amber-800">

                    {resumeScore > 0
                      ? "Add more measurable achievements to your project descriptions to improve your score."
                      : "Upload your resume to get personalized AI analysis."}

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RECENT ACTIVITY */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-bold">
                  Recent Activity
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest actions
                </p>

              </div>

              <FiClock
                className="text-slate-400"
                size={20}
              />

            </div>

            <div className="mt-6 space-y-5">

              {activities.map((activity) => {

                const Icon = activity.icon;

                return (
                  <div
                    key={activity.title}
                    className="flex items-start gap-3"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                      <Icon size={16} />
                    </div>

                    <div>

                      <p className="text-sm font-medium">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {activity.time}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </section>

        {/* =================================================
            JOB MATCHES
        ================================================= */}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>

              <h3 className="text-lg font-bold">
                Top Job Matches
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Jobs that match your resume and skills
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigateTo("Job Matching")
              }
              className="flex items-center gap-1 text-sm font-semibold text-blue-600"
            >
              Explore all jobs
              <FiArrowUpRight size={16} />
            </button>

          </div>

          {dashboardJobs.length === 0 ? (

            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">

              <FiTarget
                className="mx-auto text-slate-400"
                size={32}
              />

              <p className="mt-3 font-semibold text-slate-700">
                No job matches yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Upload and analyze your resume to find suitable jobs.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigateTo("Resume Analyzer")
                }
                className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Analyze Resume
              </button>

            </div>

          ) : (

            <div className="mt-6 grid gap-4 lg:grid-cols-3">

              {dashboardJobs.map((job) => (

                <div
                  key={job.title}
                  className="group rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-md"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
                      {job.company.charAt(0)}
                    </div>

                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                      {job.match}% Match
                    </div>

                  </div>

                  <h4 className="mt-5 font-bold">
                    {job.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {job.company}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {job.skills.map((skill) => (

                      <span
                        key={skill}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>

                    ))}

                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-xs font-medium text-slate-500">
                      {job.salary}
                    </span>

                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 transition group-hover:gap-2"
                    >
                      View Job
                      <FiChevronRight size={14} />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* RESUME */}

          <button
            type="button"
            onClick={() =>
              navigateTo("Resume Analyzer")
            }
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FiUploadCloud size={22} />
            </div>

            <div className="flex-1">

              <h4 className="font-semibold">
                Upload Resume
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Get an instant AI analysis
              </p>

            </div>

            <FiChevronRight
              className="text-slate-400 transition group-hover:translate-x-1"
              size={18}
            />

          </button>

          {/* INTERVIEW */}

          <button
            type="button"
            onClick={() =>
              navigateTo("AI Interview")
            }
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <FiMic size={22} />
            </div>

            <div className="flex-1">

              <h4 className="font-semibold">
                Practice Interview
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Practice with your AI interviewer
              </p>

            </div>

            <FiChevronRight
              className="text-slate-400 transition group-hover:translate-x-1"
              size={18}
            />

          </button>

          {/* ROADMAP */}

          <button
            type="button"
            onClick={() =>
              navigateTo("Career Roadmap")
            }
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FiMap size={22} />
            </div>

            <div className="flex-1">

              <h4 className="font-semibold">
                Career Roadmap
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                Discover your next career steps
              </p>

            </div>

            <FiChevronRight
              className="text-slate-400 transition group-hover:translate-x-1"
              size={18}
            />

          </button>

        </section>
      </>
    );

  // ---------------------------------------------------------
  // RESUME ANALYZER
  // ---------------------------------------------------------

  } else if (activePage === "Resume Analyzer") {

    pageContent = (
      <ResumeAnalyzer
        onBack={() =>
          navigateTo("Dashboard")
        }
        onAnalysisComplete={
          handleAnalysisComplete
        }
      />
    );

  // ---------------------------------------------------------
  // JOB MATCHING
  // ---------------------------------------------------------

  } else if (activePage === "Job Matching") {

    pageContent = (
      <JobMatching
        onBack={() =>
          navigateTo("Dashboard")
        }
      />
    );

  // ---------------------------------------------------------
  // AI INTERVIEW
  // ---------------------------------------------------------

  } else if (activePage === "AI Interview") {

    pageContent = (
      <Interview
        onBack={() =>
          navigateTo("Dashboard")
        }
        onInterviewComplete={
          handleInterviewComplete
        }
      />
    );

  // ---------------------------------------------------------
  // CAREER ROADMAP
  // ---------------------------------------------------------

  } else if (activePage === "Career Roadmap") {

    pageContent = (
      <CareerRoadmap
        onBack={() =>
          navigateTo("Dashboard")
        }
      />
    );

  // ---------------------------------------------------------
  // SETTINGS
  // ---------------------------------------------------------

  } else if (activePage === "Settings") {

    pageContent = (
      <Settings
        onBack={() =>
          navigateTo("Dashboard")
        }
      />
    );

  } else {

    pageContent = null;
  }

  // =========================================================
  // MAIN APP LAYOUT
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* ===================================================
          NOTIFICATION
      =================================================== */}

      {clientNotification && (
        <Notification
          type={clientNotification.type}
          message={clientNotification.message}
          onClose={() =>
            setClientNotification(null)
          }
          duration={4000}
        />
      )}

      {/* ===================================================
          MOBILE SIDEBAR OVERLAY
      =================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0`}
      >

        {/* LOGO */}

        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
              C
            </div>

            <div>

              <h1 className="text-lg font-bold tracking-tight">
                CareerLens
              </h1>

              <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-600">
                AI Career Assistant
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">

            {navigation.map((item) => {

              const Icon = item.icon;

              const active =
                activePage === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    navigateTo(item.name)
                  }
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >

                  <Icon size={19} />

                  <span>
                    {item.name}
                  </span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                  )}

                </button>
              );

            })}

          </nav>

          {/* ACCOUNT */}

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <button
            type="button"
            onClick={() =>
              navigateTo("Settings")
            }
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
              activePage === "Settings"
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >

            <FiSettings size={19} />

            <span>
              Settings
            </span>

            {activePage === "Settings" && (
              <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
            )}

          </button>

        </div>

        {/* UPGRADE CARD */}

        <div className="p-4">

          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-5 text-white">

            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              ✦
            </div>

            <h3 className="font-semibold">
              Unlock CareerLens Pro
            </h3>

            <p className="mt-1 text-xs leading-5 text-blue-100">
              Get unlimited resume analysis,
              interviews and job matching.
            </p>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-blue-600"
            >
              Upgrade
              <FiArrowUpRight size={15} />
            </button>

          </div>

        </div>

      </aside>

      {/* ===================================================
          MAIN AREA
      =================================================== */}

      <div className="lg:ml-64">

        {/* =================================================
            HEADER / NAVBAR
        ================================================= */}

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8">

          {/* LEFT */}

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <FiMenu size={22} />
            </button>

            <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 md:flex">

              <FiSearch
                className="text-slate-400"
                size={18}
              />

              <input
                placeholder="Search jobs, skills..."
                className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

            </div>

            <div className="md:hidden">

              <h1 className="font-bold">
                CareerLens
              </h1>

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"
            >

              <FiBell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />

            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
                S
              </div>

              <div className="hidden sm:block">

                <p className="text-sm font-semibold">
                  Sandhesha
                </p>

                <p className="text-xs text-slate-400">
                  CSE • AI/ML
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="mx-auto max-w-[1500px] p-5 md:p-8">

          {pageContent}

        </main>

      </div>

    </div>
  );
}

export default App;