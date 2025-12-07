
import React from 'react';
import { ProgressEntry } from '../types';
import { TrendingUp, Calendar, PlayCircle } from 'lucide-react';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelineProps {
  entries: ProgressEntry[];
  onViewEntry: (entry: ProgressEntry) => void;
}

const Timeline: React.FC<TimelineProps> = ({ entries, onViewEntry }) => {
  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Data for graph
  const graphData = sortedEntries.map(e => ({
      date: new Date(e.date).toLocaleDateString(undefined, {weekday: 'short'}),
      score: e.aiAnalysis.score
  }));

  return (
    <div className="flex flex-col h-full overflow-hidden bg-dark-bg">
      {/* Upper Graph Section */}
      <div className="h-48 w-full bg-dark-surface/50 p-4 border-b border-white/5 relative">
         <h3 className="text-sm font-display font-bold text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={16} className="text-neon-green" /> Growth Curve
         </h3>
         <ResponsiveContainer width="100%" height="80%">
            <LineChart data={graphData}>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f0f1e', border: '1px solid #333' }}
                    itemStyle={{ color: '#0afff0' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#0afff0" 
                    strokeWidth={3}
                    dot={{ fill: '#050510', stroke: '#0afff0', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#bc13fe' }}
                    isAnimationActive={true}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                />
            </LineChart>
         </ResponsiveContainer>
         {/* Gradient Overlay */}
         <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-dark-bg to-transparent pointer-events-none" />
      </div>

      {/* Timeline Scroll */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="relative border-l border-white/10 ml-4 space-y-8">
            {sortedEntries.map((entry) => (
                <div key={entry.id} className="relative pl-8 group">
                    {/* Timeline Dot */}
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-neon-blue shadow-[0_0_10px_#00f3ff] group-hover:scale-150 transition-transform duration-300" />
                    
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-xs font-display text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <Calendar size={12} /> {new Date(entry.date).toDateString()}
                            </span>
                            <span className="text-xs font-bold text-neon-cyan border border-neon-cyan/30 px-2 py-0.5 rounded-full bg-neon-cyan/5">
                                Score: {entry.aiAnalysis.score}
                            </span>
                        </div>

                        {/* Card */}
                        <div 
                          onClick={() => onViewEntry(entry)}
                          className="bg-dark-card border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all shadow-md cursor-pointer hover:shadow-[0_0_15px_rgba(0,243,255,0.1)] active:scale-95"
                        >
                            <div className="relative h-32 w-full bg-slate-800">
                                {entry.mediaType === 'video' ? (
                                    <div className="w-full h-full flex items-center justify-center bg-black/50">
                                        {/* Use thumbnail or frame if available, else overlay */}
                                        <video src={entry.mediaUrl} className="w-full h-full object-cover opacity-60 pointer-events-none" muted />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <PlayCircle className="text-white drop-shadow-lg" size={40} />
                                        </div>
                                    </div>
                                ) : (
                                    <img src={entry.mediaUrl} alt="Progress" className="w-full h-full object-cover" />
                                )}
                                <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/90 to-transparent">
                                    <div className="flex gap-2">
                                        {entry.aiAnalysis.tags.map(tag => (
                                            <span key={tag} className="text-[10px] text-white bg-white/10 px-2 rounded backdrop-blur-sm">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-sm text-slate-300 leading-tight">
                                    <span className="text-neon-purple font-bold">AI:</span> "{entry.aiAnalysis.feedback}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
