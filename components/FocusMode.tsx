
import React, { useState, useEffect } from 'react';
import { FocusTask } from '../types';
import { Play, Pause, RotateCcw, Plus, Check, X, Trash2, List, Edit2 } from 'lucide-react';

interface FocusModeProps {}

type TimerMode = 'focus' | 'short' | 'long' | 'custom';

const FocusMode: React.FC<FocusModeProps> = () => {
  // Timer State
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('25');

  // Task State - Lazy init to prevent overwriting localStorage on mount
  const [tasks, setTasks] = useState<FocusTask[]>(() => {
    try {
        const savedTasks = localStorage.getItem('pv_focus_tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
        return [];
    }
  });
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Save to local storage on change
  useEffect(() => {
    try {
        localStorage.setItem('pv_focus_tasks', JSON.stringify(tasks));
    } catch (e) { console.error('LocalStorage error', e); }
  }, [tasks]);

  // Timer Logic - Optimized
  useEffect(() => {
    let interval: number | undefined;
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                setIsActive(false);
                return 0;
            }
            return prev - 1;
        });
      }, 1000);
    } 
    return () => window.clearInterval(interval);
  }, [isActive, timeLeft]); 

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setIsEditing(false);
    setMode(newMode);
    let time = 25 * 60;
    if (newMode === 'short') time = 5 * 60;
    if (newMode === 'long') time = 15 * 60;
    if (newMode === 'custom') time = 45 * 60; 
    
    setTimeLeft(time);
    setInitialTime(time);
  };

  const toggleTimer = () => {
      if (isEditing) handleSaveEdit();
      setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsEditing(false);
    setTimeLeft(initialTime);
  };

  const startEditing = () => {
      if (isActive) return;
      setEditValue(Math.floor(timeLeft / 60).toString());
      setIsEditing(true);
  };

  const handleSaveEdit = () => {
      let minutes = parseInt(editValue);
      if (isNaN(minutes) || minutes < 1) minutes = 1;
      if (minutes > 240) minutes = 240; // Max 4 hours

      const newTime = minutes * 60;
      setTimeLeft(newTime);
      setInitialTime(newTime);
      setMode('custom');
      setIsEditing(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Progress Calculation
  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Task Logic
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: FocusTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(t => !t.completed));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
      {/* LEFT: TIMER DASHBOARD */}
      <div className="flex-1 bg-dark-card border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Animated Background Mesh */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-30' : 'opacity-10'}`}>
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-blue/20 via-transparent to-transparent animate-pulse" />
             {isActive && (
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 animate-spin-slow" />
             )}
        </div>

        {/* Mode Toggles */}
        <div className="flex gap-2 mb-8 relative z-10 bg-black/40 p-1 rounded-xl backdrop-blur-md border border-white/10">
          {[
            { id: 'focus', label: 'Deep Focus' },
            { id: 'short', label: 'Recharge' },
            { id: 'long', label: 'Sys Reset' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id as TimerMode)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                mode === m.id
                  ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(10,255,240,0.5)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Holographic Ring Timer */}
        <div className="relative w-80 h-80 flex items-center justify-center mb-8">
            {/* Outer Glow Ring */}
            <div className={`absolute inset-0 rounded-full border border-neon-cyan/20 ${isActive ? 'animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]' : ''}`} />
            
            <svg className="w-full h-full rotate-[-90deg] drop-shadow-[0_0_15px_rgba(10,255,240,0.3)] absolute z-0">
                {/* Track */}
                <circle
                    cx="50%" cy="50%" r={radius}
                    fill="transparent"
                    stroke="#1e1e38"
                    strokeWidth="8"
                />
                {/* Progress */}
                <circle
                    cx="50%" cy="50%" r={radius}
                    fill="transparent"
                    stroke={mode === 'focus' || mode === 'custom' ? '#0afff0' : '#bc13fe'}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                />
            </svg>

            {/* Time Display */}
            <div className="absolute z-10 flex flex-col items-center">
                {isEditing ? (
                    <div className="flex flex-col items-center animate-in zoom-in duration-200">
                        <div className="flex items-end gap-2 border-b-2 border-neon-cyan px-2 pb-1 mb-2">
                             <input 
                                autoFocus
                                type="number"
                                min="1"
                                max="240"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                onBlur={handleSaveEdit}
                                className="w-32 bg-transparent text-6xl font-display font-bold text-white text-center outline-none p-0 m-0 leading-none"
                             />
                             <span className="text-xl text-slate-400 font-bold mb-2">MIN</span>
                        </div>
                        <span className="text-[10px] text-neon-cyan uppercase tracking-widest">Press Enter to Set</span>
                    </div>
                ) : (
                    <div 
                        onClick={startEditing} 
                        className={`group flex flex-col items-center transition-all ${!isActive ? 'cursor-pointer hover:scale-105' : ''}`}
                        title={!isActive ? "Click to Edit Time" : ""}
                    >
                        <span className={`text-6xl font-display font-bold text-white tracking-widest relative ${isActive ? 'animate-pulse' : ''}`}>
                            {formatTime(timeLeft)}
                            {!isActive && (
                                <Edit2 size={16} className="absolute -right-8 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-neon-cyan transition-colors" />
                            )}
                        </span>
                        <span className="text-xs text-slate-400 uppercase tracking-[0.5em] mt-2 flex items-center gap-2">
                            {isActive ? (
                                <>System Active</>
                            ) : (
                                <span className="group-hover:text-neon-cyan transition-colors">
                                    {mode === 'custom' ? 'Custom Protocol' : 'Standby'}
                                </span>
                            )}
                        </span>
                    </div>
                )}
            </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 relative z-10">
           <button
             onClick={toggleTimer}
             className={`w-16 h-16 rounded-2xl flex items-center justify-center text-black font-bold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                 isActive 
                 ? 'bg-transparent border-2 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                 : 'bg-neon-blue shadow-[0_0_20px_rgba(10,255,240,0.5)]'
             }`}
           >
             {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
           </button>
           
           <button
             onClick={resetTimer}
             className="w-16 h-16 rounded-2xl bg-dark-surface border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all active:scale-95"
           >
             <RotateCcw size={24} />
           </button>
        </div>
      </div>

      {/* RIGHT: TACTICAL TASK LIST */}
      <div className="flex-1 bg-dark-card border border-white/5 rounded-3xl p-6 flex flex-col shadow-2xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <List className="text-neon-purple" /> Mission Objectives
            </h2>
            <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                {(['all', 'active', 'completed'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1 text-[10px] uppercase font-bold rounded transition-colors ${
                            filter === f ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-6">
            <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add new objective..."
                className="flex-1 bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple/50 transition-colors"
            />
            <button
                onClick={addTask}
                disabled={!newTaskTitle.trim()}
                className="px-4 bg-neon-purple/20 border border-neon-purple/50 rounded-xl text-neon-purple hover:bg-neon-purple hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Plus size={24} />
            </button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            {filteredTasks.length === 0 && (
                <div className="text-center py-10 opacity-30">
                    <p className="text-sm text-slate-400">No active objectives.</p>
                </div>
            )}
            
            {filteredTasks.map((task) => (
                <div
                    key={task.id}
                    className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 animate-in fade-in slide-in-from-right-4 ${
                        task.completed 
                        ? 'bg-black/20 border-white/5 opacity-60' 
                        : 'bg-dark-surface border-white/10 hover:border-neon-cyan/30 hover:bg-white/5'
                    }`}
                >
                    <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                            task.completed
                            ? 'bg-neon-green border-neon-green text-black'
                            : 'border-slate-600 hover:border-neon-cyan'
                        }`}
                    >
                        {task.completed && <Check size={14} strokeWidth={4} />}
                    </button>
                    
                    <span className={`flex-1 text-sm font-medium transition-all ${
                        task.completed ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-200'
                    }`}>
                        {task.title}
                    </span>

                    <button
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </div>

        {/* Footer */}
        {tasks.some(t => t.completed) && (
            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                <button
                    onClick={clearCompleted}
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center justify-center gap-2 w-full"
                >
                    <X size={12} /> Clear Completed
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default FocusMode;
