
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import VideoUploader from './components/VideoUploader';
import Timeline from './components/Timeline';
import GoalTracker from './components/GoalTracker';
import AIChat from './components/AIChat';
import Login from './components/Login';
import CalendarView from './components/CalendarView';
import RewardModal from './components/RewardModal';
import RewardsGallery from './components/RewardsGallery';
import MediaViewerModal from './components/MediaViewerModal';
import DailyNotes from './components/DailyNotes';
import ModeSelector from './components/ModeSelector';
import { UserProfile, ProgressEntry, Goal, Reward, Note, AppMode } from './types';

// Mock Data
const INITIAL_USER: UserProfile = {
  name: "Alex",
  level: 7,
  xp: 750,
  xpToNextLevel: 1000,
  streak: 12,
  rewards: [
    { id: 'r1', title: 'Early Adopter', rarity: 'rare', xpBonus: 100, icon: '🚀', unlockedAt: '2023-01-15' },
    { id: 'r2', title: '7 Day Streak', rarity: 'common', xpBonus: 50, icon: '🔥', unlockedAt: '2023-03-20' },
    { id: 'r3', title: 'Goal Crusher', rarity: 'legendary', xpBonus: 500, icon: '🏆', unlockedAt: '2023-05-10' },
    { id: 'r4', title: 'First Upload', rarity: 'common', xpBonus: 25, icon: '📹', unlockedAt: '2023-01-02' },
  ]
};

const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Hold Handstand',
    targetDate: '2023-12-31',
    progress: 65,
    milestones: [
      { title: 'Hold against wall 30s', completed: true },
      { title: 'Kick up freely', completed: true },
      { title: 'Free hold 10s', completed: false },
    ]
  },
  {
    id: '2',
    title: 'Read 10 Books',
    targetDate: '2023-11-15',
    progress: 40,
    milestones: [
      { title: 'Book 1-4', completed: true },
      { title: 'Book 5', completed: false },
    ]
  }
];

const INITIAL_ENTRIES: ProgressEntry[] = [
  {
      id: 'old-1',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      type: 'fitness',
      mediaType: 'image',
      mediaUrl: 'https://picsum.photos/400/600?random=1',
      aiAnalysis: {
          score: 65,
          emotion: 'Determined',
          feedback: 'Form is improving, but core looks loose.',
          tags: ['Handstand', 'Drill']
      }
  },
  {
    id: 'old-2',
    date: new Date(Date.now() - 86400000).toISOString(),
    type: 'fitness',
    mediaType: 'image',
    mediaUrl: 'https://picsum.photos/400/600?random=2',
    aiAnalysis: {
        score: 72,
        emotion: 'Confident',
        feedback: 'Much better alignment today. Good job.',
        tags: ['Handstand', 'Balance']
    }
}
];

const INITIAL_NOTES: Note[] = [
  { id: 'n1', title: 'Morning Routine', content: '1. Hydrate\n2. Stretch\n3. Deep Work', createdAt: Date.now(), isPinned: true },
  { id: 'n2', title: 'Idea', content: 'Use AI to generate workout plans based on fatigue.', createdAt: Date.now() - 10000, isPinned: false }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('neon');
  
  // Media Viewing State
  const [selectedEntry, setSelectedEntry] = useState<ProgressEntry | null>(null);

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [entries, setEntries] = useState<ProgressEntry[]>(INITIAL_ENTRIES);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);

  // Persistence: Load
  useEffect(() => {
    const savedUser = localStorage.getItem('pv_user');
    const savedEntries = localStorage.getItem('pv_entries');
    const savedGoals = localStorage.getItem('pv_goals');
    const savedNotes = localStorage.getItem('pv_notes');
    const savedMode = localStorage.getItem('pv_mode');
    
    if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) { console.error("Failed to parse user"); }
    }
    if (savedEntries) {
        try { setEntries(JSON.parse(savedEntries)); } catch (e) { console.error("Failed to parse entries"); }
    }
    if (savedGoals) {
        try { setGoals(JSON.parse(savedGoals)); } catch (e) { console.error("Failed to parse goals"); }
    }
    if (savedNotes) {
        try { setNotes(JSON.parse(savedNotes)); } catch (e) { console.error("Failed to parse notes"); }
    }
    if (savedMode) {
        setAppMode(savedMode as AppMode);
    }
  }, []);

  // Persistence: Save
  useEffect(() => { localStorage.setItem('pv_user', JSON.stringify(user)); }, [user]);
  useEffect(() => {
    try { localStorage.setItem('pv_entries', JSON.stringify(entries)); } catch (e) { console.warn("Storage Full"); }
  }, [entries]);
  useEffect(() => { localStorage.setItem('pv_goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('pv_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('pv_mode', appMode); }, [appMode]);


  const handleUploadComplete = (newEntry: ProgressEntry) => {
    setEntries(prev => [...prev, newEntry]);
    
    // Gamification Logic
    const xpGain = 50;
    const newXp = user.xp + xpGain;
    const leveledUp = newXp >= user.xpToNextLevel;

    // Trigger Reward (Simulator)
    let newReward: Reward | null = null;
    if (leveledUp || Math.random() > 0.5) {
       newReward = {
          id: Date.now().toString(),
          title: leveledUp ? "Level Up Bundle" : "Consistency Badge",
          rarity: leveledUp ? "legendary" : "common",
          xpBonus: leveledUp ? 500 : 50,
          icon: leveledUp ? "👑" : "🔥",
          unlockedAt: new Date().toISOString()
       };
       
       setTimeout(() => {
          setCurrentReward(newReward);
       }, 500);
    }

    setUser(prev => ({
        ...prev,
        xp: newXp,
        xpToNextLevel: leveledUp ? prev.xpToNextLevel + 1000 : prev.xpToNextLevel,
        level: leveledUp ? prev.level + 1 : prev.level,
        rewards: newReward ? [...prev.rewards, newReward] : prev.rewards
    }));

    setCurrentView('calendar');
  };

  const handleAddGoal = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleAddTask = (goalId: string, taskTitle: string) => {
    setGoals(prev => prev.map(g => {
        if (g.id !== goalId) return g;

        const newMilestones = [...g.milestones, { title: taskTitle, completed: false }];
        
        // Recalculate progress
        const completedCount = newMilestones.filter(m => m.completed).length;
        const newProgress = Math.round((completedCount / newMilestones.length) * 100);

        return { ...g, milestones: newMilestones, progress: newProgress };
    }));
  };

  const handleToggleMilestone = (goalId: string, milestoneIndex: number) => {
      setGoals(prev => prev.map(g => {
          if (g.id !== goalId) return g;
          
          const newMilestones = [...g.milestones];
          newMilestones[milestoneIndex].completed = !newMilestones[milestoneIndex].completed;
          
          // Recalculate progress
          const completedCount = newMilestones.filter(m => m.completed).length;
          const newProgress = Math.round((completedCount / newMilestones.length) * 100);

          return { ...g, milestones: newMilestones, progress: newProgress };
      }));
  };

  // Note Handlers
  const handleAddNote = (note: Note) => setNotes(prev => [note, ...prev]);
  const handleUpdateNote = (updatedNote: Note) => setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  const handleDeleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} latestEntry={entries[entries.length - 1] || null} onNavigate={setCurrentView} onViewEntry={setSelectedEntry} />;
      case 'upload':
        return <VideoUploader onUploadComplete={handleUploadComplete} history={entries} />;
      case 'timeline':
        return <Timeline entries={entries} onViewEntry={setSelectedEntry} />;
      case 'calendar':
        return <CalendarView entries={entries} />;
      case 'goals':
        return <GoalTracker goals={goals} onAddGoal={handleAddGoal} onToggleMilestone={handleToggleMilestone} onAddTask={handleAddTask} />;
      case 'notes':
        return <DailyNotes notes={notes} onAddNote={handleAddNote} onUpdateNote={handleUpdateNote} onDeleteNote={handleDeleteNote} />;
      case 'rewards':
        return <RewardsGallery rewards={user.rewards} onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard user={user} latestEntry={entries[entries.length - 1] || null} onNavigate={setCurrentView} onViewEntry={setSelectedEntry} />;
    }
  };

  // Theme styles based on mode
  const getModeStyles = () => {
      switch(appMode) {
          case 'zen': return 'grayscale-[0.5] contrast-[0.9] brightness-110 sepia-[0.2]';
          case 'hyper': return 'hue-rotate-[100deg] contrast-125 saturate-150';
          default: return ''; // Neon
      }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className={`min-h-screen bg-dark-bg text-slate-100 font-sans selection:bg-neon-cyan selection:text-black transition-all duration-700 ${getModeStyles()}`}>
      
      {/* Mode Selector */}
      <ModeSelector currentMode={appMode} setMode={setAppMode} />

      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
         <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
             appMode === 'hyper' ? 'from-green-900 via-black to-black' : 
             appMode === 'zen' ? 'from-slate-700 via-slate-900 to-black' : 
             'from-indigo-900 via-dark-bg to-dark-bg'
         }`}></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-md mx-auto min-h-screen bg-black/20 shadow-2xl overflow-hidden animate-in fade-in duration-700">
        {renderView()}
      </main>

      {/* Overlays */}
      <AIChat isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      <RewardModal reward={currentReward} onClose={() => setCurrentReward(null)} />
      <MediaViewerModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      
      {/* Navigation */}
      {currentView !== 'rewards' && (
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      )}
    </div>
  );
};

export default App;
