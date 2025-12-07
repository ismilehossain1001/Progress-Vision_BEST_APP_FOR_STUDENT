
import React from 'react';
import { UserProfile, ProgressEntry } from '../types';
import { Flame, Trophy, TrendingUp, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  latestEntry: ProgressEntry | null;
  onNavigate: (view: string) => void;
  onViewEntry: (entry: ProgressEntry) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, latestEntry, onNavigate, onViewEntry }) => {
  const levelProgressData = [
    { name: 'Progress', value: user.xp },
    { name: 'Remaining', value: user.xpToNextLevel - user.xp },
  ];

  return (
    <div className="p-6 pb-24 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-400 text-sm font-display uppercase tracking-widest">Welcome back</p>
          <h1 className="text-3xl font-bold text-white font-sans">{user.name}</h1>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-neon-green">
             <Flame size={18} className="animate-pulse" />
             <span className="font-bold font-display text-lg">{user.streak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Level Card */}
      <div className="relative bg-gradient-to-br from-indigo-900/40 to-black border border-white/10 rounded-3xl p-6 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-neon-purple/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-center relative z-10">
            <div>
                <span className="text-neon-cyan font-bold text-sm tracking-wider">CURRENT LEVEL</span>
                <div className="text-5xl font-display font-bold text-white mt-1">{user.level}</div>
                <p className="text-slate-400 text-xs mt-2">{user.xpToNextLevel - user.xp} XP to Level {user.level + 1}</p>
            </div>
            <div className="w-20 h-20 relative">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={levelProgressData}
                        innerRadius={28}
                        outerRadius={35}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="#bc13fe" />
                        <Cell fill="#1e1e38" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy size={16} className="text-white" />
                  </div>
            </div>
        </div>
      </div>

      {/* Today's Status */}
      <div>
        <h2 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <Zap size={18} className="text-neon-cyan" /> Latest Scan
        </h2>
        
        {latestEntry ? (
            <div 
                onClick={() => onViewEntry(latestEntry)}
                className="bg-dark-card border border-white/5 rounded-2xl p-4 flex gap-4 items-center cursor-pointer hover:bg-white/5 transition-colors group"
            >
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 relative border border-white/10 group-hover:border-neon-cyan/50 transition-colors">
                    {latestEntry.mediaType === 'video' ? (
                       <video src={latestEntry.mediaUrl} className="w-full h-full object-cover" />
                    ) : (
                       <img src={latestEntry.mediaUrl} alt="Latest" className="w-full h-full object-cover" />
                    )}
                </div>
                <div>
                    <div className="flex gap-2 mb-1">
                        <span className="text-neon-cyan font-bold text-lg">{latestEntry.aiAnalysis.score} pts</span>
                        <span className="text-xs text-slate-500 self-center uppercase">{latestEntry.aiAnalysis.emotion}</span>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-1">"{latestEntry.aiAnalysis.feedback}"</p>
                </div>
            </div>
        ) : (
            <button 
                onClick={() => onNavigate('upload')}
                className="w-full h-24 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-neon-cyan hover:text-neon-cyan transition-colors bg-white/5"
            >
                <span className="text-sm font-bold">Log Today's Progress</span>
                <span className="text-xs mt-1">+50 XP</span>
            </button>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-surface rounded-2xl p-4 border border-white/5">
              <TrendingUp className="text-neon-green mb-2" size={20} />
              <div className="text-2xl font-bold text-white">+12%</div>
              <div className="text-xs text-slate-500">Weekly Growth</div>
          </div>
          <button 
            onClick={() => onNavigate('rewards')}
            className="bg-dark-surface rounded-2xl p-4 border border-white/5 text-left hover:bg-white/5 transition-colors group"
          >
              <Trophy className="text-neon-purple mb-2 group-hover:scale-110 transition-transform" size={20} />
              <div className="text-2xl font-bold text-white">{user.rewards.length}</div>
              <div className="text-xs text-slate-500">Badges Earned</div>
          </button>
      </div>
    </div>
  );
};

export default Dashboard;
