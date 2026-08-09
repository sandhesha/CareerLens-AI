import CareerRoadmap from "./pages/CareerRoadmap";
import Interview from "./pages/Interview";
import JobMatching from "./pages/JobMatching";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import { useState } from "react";
import {
  FiHome,
  FiFileText,
  FiBriefcase,
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

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (activePage === "Resume Analyzer") {
  return <ResumeAnalyzer onBack={() => setActivePage("Dashboard")} />;
}
if (activePage === "Job Matching") {
  return (
    <JobMatching
      onBack={() => setActivePage("Dashboard")}
    />
  );
}
if (activePage === "AI Interview") {
  return (
    <Interview
      onBack={() => setActivePage("Dashboard")}
    />
  );
}
if (activePage === "Career Roadmap") {
  return (
    <CareerRoadmap
      onBack={() => setActivePage("Dashboard")}
    />
  );
}
  const navigation = [
    { name: "Dashboard", icon: FiHome },
    { name: "Resume Analyzer", icon: FiFileText },
    { name: "Job Matching", icon: FiTarget },
    { name: "AI Interview", icon: FiMic },
    { name: "Career Roadmap", icon: FiMap },
  ];

  const stats = [
    {
      title: "Resume Score",
      value: "82%",
      description: "Good profile strength",
      icon: FiFileText,
      trend: "+8%",
    },
    {
      title: "Job Matches",
      value: "24",
      description: "Suitable positions",
      icon: FiTarget,
      trend: "+12",
    },
    {
      title: "Interview Score",
      value: "76%",
      description: "Last practice",
      icon: FiMic,
      trend: "+6%",
    },
    {
      title: "Skills Matched",
      value: "18",
      description: "Skills identified",
      icon: FiTrendingUp,
      trend: "+4",
    },
  ];

  const jobs = [
    {
      role: "Frontend Developer",
      company: "TechNova",
      match: 94,
      skills: ["React", "TypeScript", "CSS"],
      salary: "₹6–10 LPA",
    },
    {
      role: "AI/ML Engineer",
      company: "DataSphere",
      match: 87,
      skills: ["Python", "Machine Learning", "SQL"],
      salary: "₹7–12 LPA",
    },
    {
      role: "Full Stack Developer",
      company: "CloudWorks",
      match: 81,
      skills: ["React", "Node.js", "MongoDB"],
      salary: "₹5–9 LPA",
    },
  ];

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
if (activePage === "Resume Analyzer") {
  return <ResumeAnalyzer onBack={() => setActivePage("Dashboard")} />;
}
  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
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
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActivePage(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <FiSettings size={19} />
            Settings
          </button>
        </div>

        {/* Upgrade card */}
        <div className="p-4">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-5 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              ✦
            </div>

            <h3 className="font-semibold">Unlock CareerLens Pro</h3>

            <p className="mt-1 text-xs leading-5 text-blue-100">
              Get unlimited resume analysis, interviews and job matching.
            </p>

            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-blue-600">
              Upgrade
              <FiArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <FiMenu size={22} />
            </button>

            <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 md:flex">
              <FiSearch className="text-slate-400" size={18} />
              <input
                placeholder="Search jobs, skills..."
                className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="md:hidden">
              <h1 className="font-bold">CareerLens</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
              <FiBell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            <div className="hidden h-7 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
                S
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold">Sandhesha</p>
                <p className="text-xs text-slate-400">CSE • AI/ML</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-[1500px] p-5 md:p-8">
          {/* Welcome banner */}
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
                  Your career journey is moving forward. Analyze your resume,
                  discover matching jobs and practice interviews with AI.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActivePage("Resume Analyzer")}
                    className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-600 shadow-lg transition hover:-translate-y-0.5"
                  >
                    <FiUploadCloud size={17} />
                    Analyze Resume
                  </button>

                  <button
                    onClick={() => setActivePage("AI Interview")}
                    className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <FiMic size={17} />
                    Start Interview
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 lg:min-w-[360px]">
                <div>
                  <p className="text-3xl font-bold">82%</p>
                  <p className="mt-1 text-xs text-blue-100">Resume Score</p>
                </div>

                <div>
                  <p className="text-3xl font-bold">24</p>
                  <p className="mt-1 text-xs text-blue-100">Job Matches</p>
                </div>

                <div>
                  <p className="text-3xl font-bold">76%</p>
                  <p className="mt-1 text-xs text-blue-100">Interview Score</p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
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

                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                      <FiTrendingUp size={12} />
                      {stat.trend}
                    </span>
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

          {/* Main grid */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Resume card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Resume Intelligence</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your latest resume analysis
                  </p>
                </div>

                <button
                  onClick={() => setActivePage("Resume Analyzer")}
                  className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View analysis
                  <FiChevronRight size={16} />
                </button>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr]">
                {/* Score circle */}
                <div className="flex items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0_82%,#e2e8f0_82%_100%)]">
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-4xl font-bold">82</span>
                      <span className="text-xs text-slate-400">out of 100</span>
                    </div>
                  </div>
                </div>

                {/* Analysis */}
                <div>
                  <div className="mb-5">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-medium">Profile Strength</span>
                      <span className="font-semibold text-blue-600">
                        Strong
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
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
                          {index === 1 ? "78%" : index === 3 ? "74%" : "88%"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-3">
                    <span className="mt-0.5">💡</span>
                    <p className="text-xs leading-5 text-amber-800">
                      Add more measurable achievements to your project
                      descriptions to improve your score.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Recent Activity</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your latest actions
                  </p>
                </div>

                <FiClock className="text-slate-400" size={20} />
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

          {/* Job matches */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-bold">Top Job Matches</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Jobs that match your resume and skills
                </p>
              </div>

              <button
                onClick={() => setActivePage("Job Matching")}
                className="flex items-center gap-1 text-sm font-semibold text-blue-600"
              >
                Explore all jobs
                <FiArrowUpRight size={16} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {jobs.map((job) => (
                <div
                  key={job.role}
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

                  <h4 className="mt-5 font-bold">{job.role}</h4>

                  <p className="mt-1 text-sm text-slate-500">{job.company}</p>

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

                    <button className="flex items-center gap-1 text-xs font-bold text-blue-600 opacity-100 transition group-hover:gap-2">
                      View Job
                      <FiChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <button
              onClick={() => setActivePage("Resume Analyzer")}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiUploadCloud size={22} />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold">Upload Resume</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Get an instant AI analysis
                </p>
              </div>

              <FiChevronRight
                className="text-slate-400 transition group-hover:translate-x-1"
                size={18}
              />
            </button>

            <button
              onClick={() => setActivePage("AI Interview")}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FiMic size={22} />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold">Practice Interview</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Practice with your AI interviewer
                </p>
              </div>

              <FiChevronRight
                className="text-slate-400 transition group-hover:translate-x-1"
                size={18}
              />
            </button>

            <button
              onClick={() => setActivePage("Career Roadmap")}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiMap size={22} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">Career Roadmap</h4>
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
        </main>
      </div>
    </div>
  );
}

export default App;