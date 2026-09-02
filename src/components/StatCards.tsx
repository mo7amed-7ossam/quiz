import React from 'react';
import { StatItem } from '../types';

interface StatCardsProps {
  stats: StatItem[];
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4 sm:px-8">
      {stats.map((stat) => {
        const isIncrease = stat.changeType === 'increase';

        return (
          <div
            key={stat.id}
            id={`stat-card-${stat.id}`}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[128px] group"
          >
            {/* Top Stat Value & Title */}
            <div>
              <div className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight leading-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1">
                {stat.title}
              </div>
            </div>

            {/* Bottom Change Pill */}
            <div className="mt-3 flex items-center justify-start">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight ${
                  isIncrease
                    ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20'
                    : 'bg-rose-50 text-rose-600 ring-1 ring-rose-500/20'
                }`}
              >
                <span className="text-[10px] leading-none">
                  {isIncrease ? '▲' : '▼'}
                </span>
                <span dir="ltr" className="text-xs font-bold">
                  {stat.change}
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
