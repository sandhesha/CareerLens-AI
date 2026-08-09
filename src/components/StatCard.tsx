import type { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: IconType;
  iconBg: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-4 text-3xl font-bold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-sm font-medium text-emerald-500">
            ↑ {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={iconColor} size={21} />
        </div>
      </div>
    </div>
  );
}

export default StatCard;