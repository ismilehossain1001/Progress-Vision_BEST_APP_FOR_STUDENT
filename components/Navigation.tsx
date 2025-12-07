
import React from 'react';
import { Home, BarChart2, Video, Target, CalendarDays, NotebookPen } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'calendar', icon: CalendarDays, label: 'Plan' },
    { id: 'upload', icon: Video, label: 'Log' },
    { id: 'notes', icon: NotebookPen, label: 'Notes' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'timeline', icon: BarChart2, label: 'Stats' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 px-4 pb-4">
      <nav className="relative bg-dark-card/80 backdrop-blur-xl border border-white/10 rounded-2xl h-16 flex items-center justify-around shadow-lg shadow-black/50 overflow-x-auto scrollbar-hide px-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[3rem] w-12 h-12 transition-all duration-300 ${
                isActive ? 'text-neon-cyan -translate-y-2' : 'text-slate-400'
              }`}
            >
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 bg-neon-cyan rounded-full shadow-[0_0_8px_#0afff0]" />
              )}
              <item.icon
                size={24}
                className={`transition-all duration-300 ${
                  isActive ? 'drop-shadow-[0_0_5px_rgba(10,255,240,0.8)]' : ''
                }`}
              />
              <span className={`text-[10px] mt-1 font-display tracking-wider ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navigation;