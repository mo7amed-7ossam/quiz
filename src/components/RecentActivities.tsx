import React from 'react';
import { ActivityItem } from '../types';
import { BookOpen, UserCheck, HelpCircle, Globe2 } from 'lucide-react';

interface RecentActivitiesProps {
  activities: ActivityItem[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem['iconType']) => {
    switch (type) {
      case 'lesson':
        return (
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
        );
      case 'user':
        return (
          <div className="w-6 h-6 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
        );
      case 'question':
        return (
          <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
        );
      case 'country':
        return (
          <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Globe2 className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <div
      id="recent-activities-card"
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg">
          أحدث النشاطات
        </h3>
      </div>

      <div className="space-y-3.5">
        {activities.slice(0, 4).map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between gap-3 text-xs sm:text-[13px] py-1 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 rounded-lg px-1.5 transition-colors"
          >
            {/* Title & Icon on Right */}
            <div className="flex items-center gap-2.5 overflow-hidden">
              {getIcon(activity.iconType)}
              <span className="font-medium text-slate-700 truncate">
                {activity.title}
              </span>
            </div>

            {/* Time on Left */}
            <span className="text-slate-400 font-medium whitespace-nowrap text-xs">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
