
import React, { useState } from 'react';
import { AppMode } from '../types';
import { Settings, Zap, Wind, Terminal, X } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, setMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const modes: { id: AppMode; label: string; icon: any; desc: string; color: string }[] = [
    { 
      id: 'neon', 
      label: 'Neon Core', 
      icon: Zap, 
      desc: 'Standard visual intensity. Max animations.',
      color: 'text-neon-cyan'
    },
    { 
      id: 'zen', 
      label: 'Zen Flow', 
      icon: Wind, 
      desc: 'Minimal distractions. Softer contrast.',
      color: 'text-indigo-300'
    },
    { 
      id: 'hyper', 
      label: 'Hyper Data', 
      icon: Terminal, 
      desc: 'High contrast. Matrix terminal aesthetics.',
      color: 'text-green-500'
    }
  ];

  return (
    <>
      {/* Floating Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-6 right-6 z-40 p-3 rounded-full backdrop-blur-md border transition-all duration-300 hover:rotate-90 shadow-lg ${
            currentMode === 'hyper' ? 'bg-black border-green-500 text-green-500' :
            currentMode === 'zen' ? 'bg-slate-800/50 border-white/10 text-slate-300' :
            'bg-dark-card/50 border-neon-cyan/30 text-neon-cyan shadow-[0_0_15px_rgba(10,255,240,0.2)]'
        }`}
      >
        <Settings size={20} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-dark-bg border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-bold text-white text-lg tracking-wider">SYSTEM INTERFACE</h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>

            <div className="space-y-3">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => {
                            setMode(mode.id);
                            setIsOpen(false);
                        }}
                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 group text-left ${
                            currentMode === mode.id 
                            ? `bg-white/10 border-white/30 ${mode.color}` 
                            : 'bg-transparent border-white/5 text-slate-500 hover:bg-white/5'
                        }`}
                    >
                        <div className={`p-3 rounded-full bg-black/30 ${currentMode === mode.id ? mode.color : 'text-slate-500 group-hover:text-white'}`}>
                            <mode.icon size={20} />
                        </div>
                        <div>
                            <p className={`font-bold text-sm ${currentMode === mode.id ? 'text-white' : 'text-slate-300'}`}>{mode.label}</p>
                            <p className="text-[10px] opacity-70">{mode.desc}</p>
                        </div>
                        {currentMode === mode.id && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                        )}
                    </button>
                ))}
            </div>
            
            <div className="mt-6 text-center">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">UI Version 3.1.0</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModeSelector;
