import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCode,
  FiLock,
  FiPlayCircle,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

interface CareerRoadmapProps {
  onBack: () => void;
}

const roadmap = [
  {
    step: "01",
    title: "Strengthen JavaScript",
    description:
      "Improve your understanding of modern JavaScript concepts used in professional frontend development.",
    skills: ["ES6+", "Async/Await", "Promises", "DOM"],
    duration: "1–2 weeks",
    status: "completed",
  },
  {
    step: "02",
    title: "Master React & TypeScript",
    description:
      "Build scalable React applications using TypeScript, reusable components and modern patterns.",
    skills: ["React", "TypeScript", "Hooks", "State Management"],
    duration: "2–3 weeks",
    status: "current",
  },
  {
    step: "03",
    title: "Learn Next.js",
    description:
      "Move from React to a production-ready framework used by many modern companies.",
    skills: ["Next.js", "SSR", "Routing", "API Routes"],
    duration: "2 weeks",
    status: "locked",
  },
  {
    step: "04",
    title: "Build Production Projects",
    description:
      "Create portfolio projects that demonstrate real-world development and problem solving.",
    skills: ["REST APIs", "Authentication", "Deployment", "Git"],
    duration: "3–4 weeks",
    status: "locked",
  },
  {
    step: "05",
    title: "Prepare for Interviews",
    description:
      "Practice technical, behavioral and project-based questions for frontend developer roles.",
    skills: ["DSA", "System Design", "Behavioral", "Mock Interviews"],
    duration: "2–3 weeks",
    status: "locked",
  },
];

const skills = [
  { name: "JavaScript", level: 88 },
  { name: "React", level: 82 },
  { name: "TypeScript", level: 72 },
  { name: "Python", level: 78 },
  { name: "SQL", level: 70 },
  { name: "Next.js", level: 38 },
];

function CareerRoadmap({ onBack }: CareerRoadmapProps) {
  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-5 py-5 md:px-8">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
          >
            <FiArrowLeft size={19} />
          </button>

          <div>
            <h1 className="text-xl font-bold">Career Roadmap</h1>
            <p className="text-sm text-slate-500">
              Your personalized path to your target career.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-8 md:px-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-7 text-white md:p-10">
          <div className="max-w-3xl">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <FiTrendingUp size={24} />
            </div>

            <p className="text-sm font-medium text-emerald-100">
              YOUR TARGET ROLE
            </p>

            <h2 className="mt-2 text-3xl font-bold md:text-4xl">
              Frontend Developer
            </h2>

            <p className="mt-4 text-sm leading-6 text-emerald-100 md:text-base">
              CareerLens AI has created a learning path based on your current
              skills and the requirements of your target role.
            </p>
          </div>
        </section>

        {/* Progress */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-lg font-bold">Your career progress</h3>
              <p className="mt-1 text-sm text-slate-500">
                You are making good progress toward your target role.
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-3xl font-bold text-emerald-600">64%</p>
              <p className="text-xs text-slate-400">roadmap completed</p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
              style={{ width: "64%" }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              1 completed
            </span>

            <span className="flex items-center gap-2">
              <FiPlayCircle className="text-blue-500" />
              1 in progress
            </span>

            <span className="flex items-center gap-2">
              <FiLock className="text-slate-400" />
              3 upcoming
            </span>
          </div>
        </section>

        {/* Main content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Roadmap */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-7">
              <h3 className="text-xl font-bold">Your learning path</h3>
              <p className="mt-1 text-sm text-slate-500">
                Follow these steps to become job-ready.
              </p>
            </div>

            <div className="relative">
              <div className="absolute bottom-8 left-[23px] top-8 w-px bg-slate-200" />

              <div className="space-y-7">
                {roadmap.map((item) => (
                  <div
                    key={item.step}
                    className="relative flex gap-4"
                  >
                    {/* Step number */}
                    <div
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${
                        item.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : item.status === "current"
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.status === "completed" ? (
                        <FiCheckCircle size={20} />
                      ) : item.status === "locked" ? (
                        <FiLock size={17} />
                      ) : (
                        item.step
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 rounded-2xl border p-5 ${
                        item.status === "current"
                          ? "border-blue-200 bg-blue-50/40"
                          : "border-slate-100 bg-slate-50/40"
                      }`}
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold">{item.title}</h4>

                            {item.status === "current" && (
                              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase text-blue-600">
                                In Progress
                              </span>
                            )}

                            {item.status === "completed" && (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-600">
                                Completed
                              </span>
                            )}
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex h-fit shrink-0 items-center gap-1 text-xs text-slate-400">
                          <FiClock size={13} />
                          {item.duration}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {item.status === "current" && (
                        <button className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700">
                          Continue Learning
                          <FiChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Skills */}
          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FiCode size={20} />
                </div>

                <div>
                  <h3 className="font-bold">Skill Analysis</h3>
                  <p className="text-xs text-slate-500">
                    Based on your resume
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-medium">
                        {skill.name}
                      </span>

                      <span className="text-xs font-semibold text-slate-500">
                        {skill.level}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          skill.level >= 80
                            ? "bg-emerald-500"
                            : skill.level >= 60
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended resources */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <FiBookOpen size={20} />
                </div>

                <div>
                  <h3 className="font-bold">Recommended Learning</h3>
                  <p className="text-xs text-slate-500">
                    Improve your weak areas
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  {
                    title: "Next.js Fundamentals",
                    time: "4h 20m",
                  },
                  {
                    title: "Advanced TypeScript",
                    time: "3h 10m",
                  },
                  {
                    title: "React Performance",
                    time: "2h 45m",
                  },
                ].map((course) => (
                  <div
                    key={course.title}
                    className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <FiPlayCircle size={17} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {course.title}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {course.time}
                      </p>
                    </div>

                    <FiChevronRight
                      size={15}
                      className="text-slate-300 transition group-hover:text-blue-500"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* AI insight */}
            <section className="rounded-3xl bg-slate-950 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <FiTarget size={19} />
                </div>

                <h3 className="font-bold">AI Career Insight</h3>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                Your biggest opportunity right now is improving your Next.js
                skills. It could increase your Frontend Developer job-match
                score from <b className="text-white">94%</b> to around{" "}
                <b className="text-emerald-400">97%</b>.
              </p>

              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-slate-900 hover:bg-slate-100">
                View Skill Plan
                <FiChevronRight size={14} />
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default CareerRoadmap;