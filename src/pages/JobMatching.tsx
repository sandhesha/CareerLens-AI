import {
  FiArrowLeft,
  FiBriefcase,
  FiCheckCircle,
  FiChevronRight,
  FiMapPin,
  FiSearch,
  FiStar,
  FiXCircle,
} from "react-icons/fi";

interface JobMatchingProps {
  onBack: () => void;
}

const jobs = [
  {
    title: "Frontend Developer",
    company: "TechNova",
    location: "Bangalore",
    type: "Full-time",
    salary: "₹6–10 LPA",
    match: 94,
    skills: ["React", "TypeScript", "JavaScript", "CSS", "Git"],
    missing: ["Next.js"],
  },
  {
    title: "AI/ML Engineer",
    company: "DataSphere",
    location: "Hyderabad",
    type: "Full-time",
    salary: "₹7–12 LPA",
    match: 87,
    skills: ["Python", "Machine Learning", "SQL", "NumPy"],
    missing: ["PyTorch", "Docker"],
  },
  {
    title: "Full Stack Developer",
    company: "CloudWorks",
    location: "Bangalore",
    type: "Hybrid",
    salary: "₹5–9 LPA",
    match: 81,
    skills: ["React", "Node.js", "MongoDB"],
    missing: ["AWS", "Redis"],
  },
  {
    title: "Data Analyst",
    company: "Insight Labs",
    location: "Pune",
    type: "Full-time",
    salary: "₹4–7 LPA",
    match: 76,
    skills: ["Python", "SQL", "Power BI", "Excel"],
    missing: ["Statistics"],
  },
  {
    title: "Junior Software Engineer",
    company: "CodeBridge",
    location: "Mangalore",
    type: "Full-time",
    salary: "₹4–6 LPA",
    match: 72,
    skills: ["JavaScript", "Python", "Git"],
    missing: ["Java", "Spring Boot"],
  },
  {
    title: "Machine Learning Intern",
    company: "NeuralTech",
    location: "Remote",
    type: "Internship",
    salary: "₹20–35K/month",
    match: 69,
    skills: ["Python", "ML", "Pandas"],
    missing: ["TensorFlow", "Deep Learning"],
  },
];

function JobMatching({ onBack }: JobMatchingProps) {
  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1300px] items-center gap-4 px-5 py-5 md:px-8">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <FiArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Job Matching</h1>
            <p className="text-sm text-slate-500">
              Discover jobs that fit your profile.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1300px] px-5 py-8 md:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-7 text-white md:p-9">
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/10" />

          <div className="relative max-w-3xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <FiStar size={23} />
            </div>

            <h2 className="text-2xl font-bold md:text-3xl">
              Jobs matched to your skills.
            </h2>

            <p className="mt-3 text-sm leading-6 text-indigo-100 md:text-base">
              CareerLens AI compares your resume against job requirements and
              tells you exactly where you fit — and what you need to improve.
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <FiSearch className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Search job title, skill or company..."
              />
            </div>

            <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
              All Locations
            </button>

            <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
              All Job Types
            </button>

            <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white">
              Search Jobs
            </button>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Jobs Found</p>
            <p className="mt-2 text-3xl font-bold">24</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Strong Matches</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">8</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Average Match</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">81%</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Skills Matched</p>
            <p className="mt-2 text-3xl font-bold">18</p>
          </div>
        </section>

        {/* Jobs */}
        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Recommended for you</h3>
              <p className="mt-1 text-sm text-slate-500">
                Based on your uploaded resume
              </p>
            </div>

            <span className="text-sm text-slate-500">24 results</span>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={`${job.company}-${job.title}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md md:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  {/* Company */}
                  <div className="flex flex-1 items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
                      {job.company.charAt(0)}
                    </div>

                    <div>
                      <h4 className="text-lg font-bold">{job.title}</h4>

                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {job.company}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <FiMapPin size={13} />
                          {job.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <FiBriefcase size={13} />
                          {job.type}
                        </span>

                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </div>

                  {/* Match */}
                  <div className="flex items-center gap-4 lg:w-48">
                    <div className="flex-1">
                      <div className="mb-2 flex justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          AI Match
                        </span>

                        <span
                          className={`text-sm font-bold ${
                            job.match >= 85
                              ? "text-emerald-600"
                              : job.match >= 75
                              ? "text-blue-600"
                              : "text-amber-600"
                          }`}
                        >
                          {job.match}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            job.match >= 85
                              ? "bg-emerald-500"
                              : job.match >= 75
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${job.match}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                    View Match
                    <FiChevronRight size={16} />
                  </button>
                </div>

                {/* Skills */}
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        ✓ Your matching skills
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700"
                          >
                            <FiCheckCircle size={12} />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                        ! Skills to improve
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {job.missing.map((skill) => (
                          <span
                            key={skill}
                            className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700"
                          >
                            <FiXCircle size={12} />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI insight */}
        <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              ✦
            </div>

            <div>
              <h3 className="font-bold text-blue-900">
                CareerLens AI Insight
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-800">
                You currently have the strongest match with <b>Frontend
                Developer</b> roles. Learning <b>Next.js</b> could increase
                your compatibility with modern frontend positions.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default JobMatching;