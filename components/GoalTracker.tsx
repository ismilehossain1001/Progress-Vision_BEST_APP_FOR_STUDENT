
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Goal } from '../types';
import { Check, Plus, X, ListPlus, Calendar, AlertCircle } from 'lucide-react';

interface GoalTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onToggleMilestone: (goalId: string, milestoneIndex: number) => void;
  onAddTask: (goalId: string, taskTitle: string) => void;
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ goals, onAddGoal, onToggleMilestone, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newMilestones, setNewMilestones] = useState<string[]>(['']);
  const [error, setError] = useState('');

  // State for adding task to existing goal
  const [addingTaskToGoalId, setAddingTaskToGoalId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddMilestoneField = () => {
    setNewMilestones([...newMilestones, '']);
  };

  const handleMilestoneChange = (index: number, value: string) => {
    const updated = [...newMilestones];
    updated[index] = value;
    setNewMilestones(updated);
    if(error) setError('');
  };

  const handleRemoveMilestoneField = (index: number) => {
    if (newMilestones.length > 1) {
        setNewMilestones(newMilestones.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newTitle.trim() || !newDate) {
        setError('Please provide a title and target date.');
        return;
    }

    const validMilestones = newMilestones.filter(m => m.trim() !== '').map(m => ({
        title: m,
        completed: false
    }));

    if (validMilestones.length === 0) {
        setError('Please add at least one actionable milestone.');
        return;
    }

    const newGoal: Goal = {
        id: Date.now().toString(),
        title: newTitle,
        targetDate: newDate,
        progress: 0,
        milestones: validMilestones
    };

    onAddGoal(newGoal);
    setIsAdding(false);
    // Reset
    setNewTitle('');
    setNewDate('');
    setNewMilestones(['']);
    setError('');
  };

  const handleSubmitNewTask = (goalId: string) => {
      if (!newTaskTitle.trim()) {
          setAddingTaskToGoalId(null);
          return;
      }
      onAddTask(goalId, newTaskTitle);
      setNewTaskTitle('');
      setAddingTaskToGoalId(null);
  };

  return (
    <div className="p-6 pb-24 space-y-8 min-h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-white">Active Targets</h2>
        <button 
            onClick={() => setIsAdding(true)}
            className="p-2 bg-neon-blue/10 border border-neon-blue/50 rounded-full hover:bg-neon-blue/20 transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)]"
        >
          <Plus size={20} className="text-neon-cyan" />
        </button>
      </div>

      <div className="space-y-6">
        {goals.map((goal) => {
          const data = [
            { name: 'Completed', value: goal.progress },
            { name: 'Remaining', value: 100 - goal.progress },
          ];
          const COLORS = ['#0afff0', '#151525']; // Neon Cyan & Dark

          return (
            <div key={goal.id} className="bg-dark-card border border-white/5 rounded-3xl p-5 relative overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{goal.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">Due {new Date(goal.targetDate).toLocaleDateString()}</p>
                </div>
                <div className="h-16 w-16 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={22}
                        outerRadius={28}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-neon-cyan">{goal.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                {goal.milestones.map((milestone, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => onToggleMilestone(goal.id, idx)}
                    className="flex items-center gap-3 w-full text-left group hover:bg-white/5 p-1 rounded-lg transition-colors"
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      milestone.completed 
                        ? 'bg-neon-purple border-neon-purple shadow-[0_0_8px_#bc13fe]' 
                        : 'bg-transparent border-slate-600 group-hover:border-neon-cyan'
                    }`}>
                      {milestone.completed && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm transition-colors ${milestone.completed ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-300 group-hover:text-white'}`}>
                      {milestone.title}
                    </span>
                  </button>
                ))}

                {/* Inline Add Task for Existing Goal */}
                <div className="pt-2">
                    {addingTaskToGoalId === goal.id ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                             <input 
                                autoFocus
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmitNewTask(goal.id)}
                                placeholder="New task..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-neon-cyan"
                             />
                             <button 
                                onClick={() => handleSubmitNewTask(goal.id)}
                                className="p-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition-colors"
                             >
                                <Check size={16} />
                             </button>
                             <button 
                                onClick={() => setAddingTaskToGoalId(null)}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                             >
                                <X size={16} />
                             </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => {
                                setAddingTaskToGoalId(goal.id);
                                setNewTaskTitle('');
                            }}
                            className="text-xs text-neon-cyan hover:text-white flex items-center gap-2 transition-colors py-1 px-2 hover:bg-white/5 rounded"
                        >
                            <Plus size={14} /> Add Task
                        </button>
                    )}
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
            <div className="text-center p-8 border border-dashed border-white/10 rounded-3xl">
                <p className="text-slate-500 mb-4">No active targets initialized.</p>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-2 bg-white/5 rounded-lg text-neon-cyan text-sm border border-white/10 hover:bg-white/10"
                >
                    Initialize First Target
                </button>
            </div>
        )}
      </div>
      
      {/* AI Recommendation */}
      {goals.length > 0 && (
        <div className="bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-white/10 rounded-2xl p-5 flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center border border-white/20">
            <span className="text-xl">💡</span>
            </div>
            <div>
            <h4 className="font-bold text-white text-sm">AI Suggestion</h4>
            <p className="text-xs text-slate-300 mt-1">Consistency detected. Consider adding a stretch goal for {goals[0].title}.</p>
            </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <div className="bg-dark-card w-full max-w-sm rounded-3xl border border-neon-blue/30 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-dark-surface">
                      <h3 className="text-lg font-display font-bold text-white tracking-wide">NEW TARGET PROTOCOL</h3>
                      <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
                      {error && (
                          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                              <AlertCircle size={14} /> {error}
                          </div>
                      )}

                      <div className="space-y-1">
                          <label className="text-xs uppercase tracking-wider text-neon-cyan font-bold">Objective Title</label>
                          <input 
                              type="text"
                              value={newTitle}
                              onChange={(e) => { setNewTitle(e.target.value); setError(''); }}
                              placeholder="e.g. Master React Hooks"
                              className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan transition-colors"
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-xs uppercase tracking-wider text-neon-cyan font-bold flex items-center gap-2">
                              <Calendar size={12} /> Target Date
                          </label>
                          <input 
                              type="date"
                              value={newDate}
                              onChange={(e) => { setNewDate(e.target.value); setError(''); }}
                              className="w-full bg-dark-bg border border-white/10 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan transition-colors [color-scheme:dark]"
                          />
                      </div>

                      <div className="space-y-2">
                          <div className="flex justify-between items-center">
                              <label className="text-xs uppercase tracking-wider text-neon-purple font-bold flex items-center gap-2">
                                  <ListPlus size={12} /> Key Results (Milestones)
                              </label>
                              <button 
                                  type="button" 
                                  onClick={handleAddMilestoneField}
                                  className="text-[10px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-white border border-white/10 transition-colors"
                              >
                                  + Add Field
                              </button>
                          </div>
                          <div className="space-y-2">
                              {newMilestones.map((ms, idx) => (
                                  <div key={idx} className="flex gap-2">
                                      <input 
                                          type="text"
                                          value={ms}
                                          onChange={(e) => handleMilestoneChange(idx, e.target.value)}
                                          placeholder={`Step ${idx + 1}`}
                                          className="flex-1 bg-dark-bg border border-white/10 rounded-lg p-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple transition-colors"
                                      />
                                      {newMilestones.length > 1 && (
                                          <button 
                                            type="button" 
                                            onClick={() => handleRemoveMilestoneField(idx)}
                                            className="p-2 text-slate-500 hover:text-red-400"
                                          >
                                              <X size={16} />
                                          </button>
                                      )}
                                  </div>
                              ))}
                          </div>
                      </div>
                  </form>

                  {/* Footer */}
                  <div className="p-4 border-t border-white/10 bg-dark-surface">
                      <button 
                          onClick={handleSubmit}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold font-display tracking-wide shadow-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] active:scale-95 transition-all"
                      >
                          INITIATE TARGET
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default GoalTracker;
