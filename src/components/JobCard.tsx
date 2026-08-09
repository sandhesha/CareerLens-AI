import { FiArrowUpRight, FiMapPin } from "react-icons/fi";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  match: number;
  skills: string[];
}

function JobCard({
  title,
  company,
  location,
  match,
  skills,
}: JobCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md">

      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {company}
          </p>

          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
            <FiMapPin size={13} />
            {location}
          </div>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-600">
          {match}%
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
        View Job
        <FiArrowUpRight size={16} />
      </button>
    </div>
  );
}

export default JobCard;