import React from 'react';
import { Clock } from 'lucide-react';

export interface ActivityItem {
  id: string | number;
  action: string;
  time: string;
}

interface ActivityCardProps {
  activities: ActivityItem[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View all
        </button>
      </div>
      
      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4 relative">
            {/* Vertical Line Connector */}
            {index !== activities.length - 1 && (
              <div className="absolute top-6 left-2.5 bottom-[-24px] w-0.5 bg-slate-100"></div>
            )}
            
            {/* Timeline Dot */}
            <div className="relative z-10 w-5 h-5 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            </div>
            
            {/* Content block */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">{activity.action}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-sm text-slate-500 text-center py-4">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;