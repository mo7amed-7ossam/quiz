import React, { useState } from 'react';
import { ChartDataPoint } from '../types';

interface UsageChartProps {
  data: ChartDataPoint[];
}

export const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  const [activeSegment, setActiveSegment] = useState<'students' | 'parents'>('students');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Maximum value for scaling bar heights
  const maxValue = 110;

  return (
    <div
      id="usage-chart-card"
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between"
    >
      {/* Header with Title and Tabs */}
      <div className="flex items-center justify-between gap-2 mb-6">
        <h3 className="font-bold text-slate-900 text-base sm:text-lg">
          الاستخدام خلال 30 يوم
        </h3>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full text-xs font-semibold">
          <button
            id="tab-students-btn"
            onClick={() => setActiveSegment('students')}
            className={`px-3.5 py-1 rounded-full transition-all duration-200 ${
              activeSegment === 'students'
                ? 'bg-[#437d74] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            طلاب
          </button>
          <button
            id="tab-parents-btn"
            onClick={() => setActiveSegment('parents')}
            className={`px-3.5 py-1 rounded-full transition-all duration-200 ${
              activeSegment === 'parents'
                ? 'bg-[#437d74] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            أولياء أمور
          </button>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative h-44 sm:h-48 pt-4 pb-1 flex items-end justify-between gap-1.5 sm:gap-2 px-1">
        {data.map((item, index) => {
          const val = activeSegment === 'students' ? item.students : item.parents;
          const heightPercent = Math.min(100, Math.round((val / maxValue) * 100));
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={item.day}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-9 z-20 bg-slate-900 text-white text-[11px] font-bold px-2 py-1 rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                  <span>{val} ألف مستخدم</span>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                </div>
              )}

              {/* Bar Element matching the sage/teal rounded style */}
              <div className="w-full max-w-[28px] h-full flex items-end">
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md rounded-b-md transition-all duration-300 ${
                    isHovered
                      ? 'bg-[#35655d] scale-y-105'
                      : 'bg-[#55988b] hover:bg-[#48877b]'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
