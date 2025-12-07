
import React, { useState } from 'react';
import { ProgressEntry } from '../types';
import { ChevronLeft, ChevronRight, Zap, Brain, Activity, Target } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CalendarViewProps {
  entries: ProgressEntry[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ entries }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Check if a day has an entry
  const getEntryForDay = (day: number) => {
    return entries.find(e => {
        const d = new Date(e.date);
        return d.getDate() === day && 
               d.getMonth() === currentDate.getMonth() && 
               d.getFullYear() === currentDate.getFullYear();
    });
  };

  // Mock Data for Radar Chart (Neural Stats)
  const statsData = [
    { subject: 'Consistency', A: 85, fullMark: 100 },
    { subject: 'Focus', A: 70, fullMark: 100 },
    { subject: 'Quality', A: 90, fullMark: 100 },
    { subject: 'Mental', A: 65, fullMark: 100 },
    { subject: 'Physical', A: 80, fullMark: 100 },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 bg-dark-bg">
      {/* Neural Stats Section */}
      <div className="p-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
         
         <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                 <Brain className="text-neon-purple" /> Neural Stats
             </h2>
             <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-slate-400">Monthly Analysis</span>
         </div>

         <div className="h-48 w-full relative bg-dark-card/50 rounded-2xl border border-white/5">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={statsData}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="User"
                        dataKey="A"
                        stroke="#0afff0"
                        strokeWidth={2}
                        fill="#0afff0"
                        fillOpacity={0.2}
                    />
                </RadarChart>
            </ResponsiveContainer>
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-neon-cyan/50" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-neon-cyan/50" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-neon-cyan/50" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-neon-cyan/50" />
         </div>
      </div>

      {/* Advanced Calendar */}
      <div className="px-6 flex-1">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"><ChevronLeft size={16} /></button>
                <button onClick={nextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"><ChevronRight size={16} /></button>
            </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-center text-xs text-slate-500 font-bold">{d}</div>
            ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const entry = getEntryForDay(day);
                const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

                return (
                    <div 
                        key={day} 
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium relative overflow-hidden group transition-all duration-300 ${
                            entry 
                                ? 'bg-neon-blue/20 text-white border border-neon-blue/50 shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                                : 'bg-dark-surface text-slate-600 border border-white/5'
                        } ${isToday ? 'ring-2 ring-white' : ''}`}
                    >
                        {isToday && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
                        {entry && <div className="absolute inset-0 bg-neon-blue/10 animate-pulse-fast opacity-0 group-hover:opacity-100 transition-opacity" />}
                        
                        <span className="relative z-10">{day}</span>
                    </div>
                );
            })}
        </div>

        {/* Legend / Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="bg-dark-card border border-white/5 p-4 rounded-xl flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-neon-green/20 flex items-center justify-center text-neon-green">
                     <Target size={20} />
                 </div>
                 <div>
                     <p className="text-white font-bold">85%</p>
                     <p className="text-[10px] text-slate-500 uppercase">Goal Hit Rate</p>
                 </div>
             </div>
             <div className="bg-dark-card border border-white/5 p-4 rounded-xl flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple">
                     <Activity size={20} />
                 </div>
                 <div>
                     <p className="text-white font-bold">High</p>
                     <p className="text-[10px] text-slate-500 uppercase">Avg Intensity</p>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
