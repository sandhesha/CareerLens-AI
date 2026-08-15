import {
  FiFileText,
  FiMessageSquare,
  FiBriefcase,
  FiTarget,
  FiArrowRight,
  FiUploadCloud,
  FiPlay,
  FiSearch,
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import JobCard from "../components/JobCard";
import ActivityCard from "../components/ActivityCard";

// Added mock data to prevent TypeScript errors on ActivityCard
const mockActivities = [
  { id: 1, action: "Resume analyzed", time: "10:32 AM" },
  { id: 2, action: "12 new jobs matched", time: "10:45 AM" },
  { id: 3, action: "Career roadmap updated", time: "Yesterday" }
];

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      <Navbar />

      <main className="mx-auto max-w-[1450px] px-5 py-6 lg:px-8">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-7 text-white shadow-lg lg:p-9">

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            <div>
              <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                Welcome back, Sandhesha! 👋
              </h1>

              <p className="mt-2 text-sm text-blue-100 lg:text-base">
                Let's get you ready for your next opportunity.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 shadow-md transition hover:bg-blue-50">
                  <FiUploadCloud size={18} />
                  Upload Resume
                </button>

                <button className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25">
                  <FiPlay size={17} />
                  Start AI Interview
                </button>

                <button className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/25">
                  <FiSearch size={17} />
                  Find Jobs
                </button>

              </div>
            </div>

            {/* Hero stats */}
            <div className="grid grid-cols-3 gap-8 lg:mr-5">

              <div className="text-center">
                <p className="text-4xl font-bold">86%</p>
                <p className="mt-1 text-xs text-blue-100">
                  Resume Score
                </p>
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold">82%</p>
                <p className="mt-1 text-xs text-blue-100">
                  Interview Score
                </p>
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold">91%</p>
                <p className="mt-1 text-xs text-blue-100">
                  Best Match
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Resume Score"
            value="86%"
            subtitle="ATS ready"
            icon={FiFileText}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <StatCard
            title="Interview Score"
            value="82%"
            subtitle="12 questions completed"
            icon={FiMessageSquare}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

          <StatCard
            title="Job Matches"
            value="14"
            subtitle="New matches this week"
            icon={FiBriefcase}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            title="Best Match"
            value="91%"
            subtitle="AI/ML Engineer"
            icon={FiTarget}
            iconBg="bg-orange-50"
            iconColor="text-orange-500"
          />

        </section>

        {/* CONTENT */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">

          {/* JOB MATCHES */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 pb-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recommended Jobs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Jobs selected based on your resume and skills
                </p>
              </div>

              <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
                View All
                <FiArrowRight size={16} />
              </button>

            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <JobCard
                title="AI/ML Intern"
                company="Tech Innovations"
                location="Bangalore • Hybrid"
                match={94}
                skills={[
                  "Python",
                  "Machine Learning",
                  "SQL",
                ]}
              />

              <JobCard
                title="Frontend Developer"
                company="Digital Labs"
                location="Remote"
                match={89}
                skills={[
                  "React",
                  "TypeScript",
                  "Tailwind",
                ]}
              />

              <JobCard
                title="Data Analyst"
                company="Analytics Hub"
                location="Bangalore"
                match={84}
                skills={[
                  "Python",
                  "SQL",
                  "Power BI",
                ]}
              />

              <JobCard
                title="Software Engineer"
                company="Future Systems"
                location="Hyderabad"
                match={81}
                skills={[
                  "Python",
                  "React",
                  "Git",
                ]}
              />

            </div>
          </div>

          {/* ACTIVITY - Now passing the required props! */}
          <ActivityCard activities={mockActivities} />

        </section>

        {/* BOTTOM SECTION */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* INTERVIEW */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  AI Interview Progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep practicing to improve your interview score
                </p>
              </div>

              <div className="rounded-full bg-purple-50 px-4 py-2 text-sm font-bold text-purple-600">
                82%
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: "82%" }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-slate-500">
              <span>12 questions completed</span>
              <span>15 total</span>
            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-bold text-white transition hover:opacity-90">
              Continue Interview
              <FiArrowRight />
            </button>

          </div>

          {/* SKILL GAP */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Skill Gap
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Skills that can improve your job opportunities
              </p>
            </div>

            <div className="mt-5 space-y-4">

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    AWS
                  </span>
                  <span className="text-slate-400">
                    Beginner
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full w-[35%] rounded-full bg-orange-400" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    Docker
                  </span>
                  <span className="text-slate-400">
                    Beginner
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full w-[45%] rounded-full bg-blue-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    FastAPI
                  </span>
                  <span className="text-slate-400">
                    Intermediate
                  </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full w-[65%] rounded-full bg-purple-500" />
                </div>
              </div>

            </div>

            <button className="mt-6 flex items-center gap-2 text-sm font-bold text-blue-600">
              View Career Roadmap
              <FiArrowRight size={16} />
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;