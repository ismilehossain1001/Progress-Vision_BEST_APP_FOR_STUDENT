
import React, { useState } from 'react';
import { Reward } from '../types';
import { ChevronLeft, Filter, Hexagon, Lock } from 'lucide-react';

interface RewardsGalleryProps {
  rewards: Reward[];
  onBack: () => void;
}

const RewardsGallery: React.FC<RewardsGalleryProps> = ({ rewards, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'common' | 'rare' | 'legendary'>('all');

  const filteredRewards = filter === 'all' 
    ? rewards 
    : rewards.filter(r => r.rarity === filter);

  const rarityStyles = {
    common: 'border-slate-600 bg-slate-800/50 shadow-none',
    rare: 'border-neon-blue bg-neon-blue/10 shadow-[0_0_15px_rgba(0,243,255,0.2)]',
    legendary: 'border-neon-purple bg-neon-purple/10 shadow-[0_0_20px_rgba(188,19,254,0.3)]',
    mythic: 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_25px_rgba(250,204,21,0.4)]',
  };

  const textColors = {
    common: 'text-slate-400',
    rare: 'text-neon-cyan',
    legendary: 'text-neon-purple',
    mythic: 'text-yellow-400',
  };

  // Mock locked slots to fill the grid
  const totalSlots = Math.max(filteredRewards.length + 3, 9);
  const lockedSlots = Array.from({ length: totalSlots - filteredRewards.length });

  return (
    <div className="flex flex-col h-full bg-dark-bg p-6 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="text-white" size={24} />
        </button>
        <h2 className="text-2xl font-display font-bold text-white tracking-wider">TROPHY CASE</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'common', 'rare', 'legendary'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              filter === f 
                ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredRewards.map((reward) => (
          <div 
            key={reward.id}
            className={`relative p-4 rounded-2xl border flex flex-col items-center text-center group transition-transform active:scale-95 ${rarityStyles[reward.rarity]}`}
          >
            {/* Rarity Badge */}
            <div className="absolute top-2 right-2 text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-white">
              {reward.rarity}
            </div>

            <div className="w-16 h-16 mb-3 flex items-center justify-center relative">
                <div className={`absolute inset-0 rounded-full blur-md opacity-50 ${
                    reward.rarity === 'legendary' ? 'bg-neon-purple' : reward.rarity === 'rare' ? 'bg-neon-blue' : 'bg-transparent'
                }`} />
                <span className="text-4xl relative z-10 drop-shadow-lg">{reward.icon}</span>
            </div>
            
            <h3 className="text-white font-bold font-display text-sm mb-1">{reward.title}</h3>
            <p className="text-xs text-slate-400 mb-2">Unlocked {reward.unlockedAt ? new Date(reward.unlockedAt).toLocaleDateString() : 'Recently'}</p>
            
            <div className="mt-auto pt-2 border-t border-white/5 w-full">
                <span className={`text-xs font-bold ${textColors[reward.rarity]}`}>+{reward.xpBonus} XP</span>
            </div>
          </div>
        ))}

        {/* Locked Slots */}
        {lockedSlots.map((_, idx) => (
           <div key={`locked-${idx}`} className="p-4 rounded-2xl border border-white/5 bg-white/2 flex flex-col items-center justify-center text-center aspect-square opacity-50">
               <Lock size={24} className="text-slate-600 mb-2" />
               <p className="text-[10px] text-slate-600 uppercase tracking-widest">Locked</p>
           </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsGallery;
