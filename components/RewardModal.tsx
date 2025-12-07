
import React, { useEffect, useState } from 'react';
import { Reward } from '../types';
import { Sparkles, Hexagon, X, Trophy } from 'lucide-react';

interface RewardModalProps {
  reward: Reward | null;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ reward, onClose }) => {
  const [stage, setStage] = useState<'hidden' | 'opening' | 'revealed'>('hidden');

  useEffect(() => {
    if (reward) {
      setStage('opening');
      const timer = setTimeout(() => {
        setStage('revealed');
      }, 1500); // 1.5s opening animation
      return () => clearTimeout(timer);
    } else {
      setStage('hidden');
    }
  }, [reward]);

  if (!reward) return null;

  const rarityColor = {
    common: 'text-slate-300 border-slate-500 shadow-slate-500',
    rare: 'text-neon-blue border-neon-blue shadow-neon-blue',
    legendary: 'text-neon-purple border-neon-purple shadow-neon-purple',
    mythic: 'text-yellow-400 border-yellow-400 shadow-yellow-400',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      {/* Background Particles (Simplified) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative w-full max-w-sm p-8 text-center">
        
        {stage === 'opening' && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
             <div className="relative w-40 h-40">
                <div className="absolute inset-0 border-4 border-neon-cyan/30 rounded-full animate-[spin_3s_linear_infinite]" />
                <div className="absolute inset-4 border-4 border-neon-purple/50 rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Hexagon size={64} className="text-white fill-white/10 animate-bounce" />
                </div>
             </div>
             <h2 className="text-2xl font-display font-bold text-white tracking-[0.2em] animate-pulse">
               DECRYPTING REWARD...
             </h2>
          </div>
        )}

        {stage === 'revealed' && (
          <div className="relative bg-dark-card border border-white/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-50 spring-duration-1000">
            {/* Glow Effect based on rarity */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] opacity-40 ${
                reward.rarity === 'legendary' ? 'bg-neon-purple' : 'bg-neon-blue'
            }`} />

            <div className="relative z-10 flex flex-col items-center">
               <div className={`w-24 h-24 rounded-2xl bg-black border-2 flex items-center justify-center mb-6 shadow-[0_0_20px] ${rarityColor[reward.rarity]}`}>
                  <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{reward.icon}</span>
               </div>
               
               <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-widest text-slate-400 mb-2">
                 {reward.rarity} Item
               </div>

               <h2 className="text-2xl font-bold text-white font-display mb-2">{reward.title}</h2>
               <p className="text-slate-400 text-sm mb-6">Achievement Unlocked</p>

               <div className="flex items-center gap-2 text-neon-green font-bold text-lg mb-8 bg-neon-green/10 px-4 py-2 rounded-lg border border-neon-green/20">
                  <Sparkles size={18} />
                  +{reward.xpBonus} XP
               </div>

               <button 
                onClick={onClose}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-neon-cyan transition-colors shadow-lg active:scale-95"
               >
                 CLAIM REWARD
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardModal;
