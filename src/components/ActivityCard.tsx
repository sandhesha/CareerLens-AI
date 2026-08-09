import {
  FiCheckCircle,
  FiFileText,
  FiTarget,
  FiMessageCircle,
} from "react-icons/fi";

const activities = [
  {
    text: "Resume analyzed successfully",
    time: "2 minutes ago",
    icon: FiFileText,
    color: "text-blue-500",
  },
  {
    text: "AI interview completed",
    time: "15 minutes ago",
    icon: FiMessageCircle,
    color: "text-purple-500",
  },
  {
    text: "14 new jobs matched",
    time: "30 minutes ago",
    icon: FiTarget,
    color: "text-orange-500",
  },
  {
    text: "Skill gap identified",
    time: "1 hour ago",
    icon: FiCheckCircle,
    color: "text-emerald-500",
  },
];

function ActivityCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <FiTarget className="text-blue-600" size={20} />
        <h2 className="text-lg font-bold text-slate-900">
          Recent Activity
        </h2>
      </div>

      <div className="mt-4 space-y-5">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.text}
              className="flex items-center gap-3"
            >
              <Icon
                className={activity.color}
                size={18}
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">
                  {activity.text}
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
  );
}

export default ActivityCard;