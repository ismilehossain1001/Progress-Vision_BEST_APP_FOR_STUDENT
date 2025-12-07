
import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../types';
import { Pin, Trash2, Edit3 } from 'lucide-react';

interface DailyNotesProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const DailyNotes: React.FC<DailyNotesProps> = ({ notes, onAddNote, onUpdateNote, onDeleteNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const inputRef = useRef<HTMLDivElement>(null);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        if (!newTitle && !newContent) {
           setIsExpanded(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [newTitle, newContent]);

  const handleAdd = () => {
    if (!newContent.trim() && !newTitle.trim()) {
        setIsExpanded(false);
        return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      createdAt: Date.now(),
      isPinned: false,
      color: 'blue' // Default
    };

    onAddNote(note);
    setNewTitle('');
    setNewContent('');
    setIsExpanded(false);
  };

  const togglePin = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    onUpdateNote({ ...note, isPinned: !note.isPinned });
  };

  const handleSaveEdit = () => {
      if (editingNote) {
          onUpdateNote(editingNote);
          setEditingNote(null);
      }
  };

  const pinnedNotes = notes.filter(n => n.isPinned).sort((a, b) => b.createdAt - a.createdAt);
  const otherNotes = notes.filter(n => !n.isPinned).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="p-6 pb-24 h-full flex flex-col overflow-y-auto">
      <h2 className="text-2xl font-display font-bold text-white mb-6">Neural Logs</h2>

      {/* Input Area */}
      <div 
        ref={inputRef}
        className={`bg-dark-card border border-white/10 rounded-2xl shadow-lg transition-all duration-300 mb-8 overflow-hidden ${isExpanded ? 'p-4 border-neon-cyan/50 shadow-[0_0_15px_rgba(10,255,240,0.1)]' : 'p-3 hover:border-white/30'}`}
      >
        {isExpanded && (
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-transparent text-white font-bold placeholder-slate-500 outline-none mb-3 text-lg"
          />
        )}
        <textarea
          placeholder="Take a note..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onClick={() => setIsExpanded(true)}
          className={`w-full bg-transparent text-slate-300 placeholder-slate-500 outline-none resize-none font-sans ${isExpanded ? 'h-32' : 'h-6'}`}
        />
        {isExpanded && (
          <div className="flex justify-end mt-2 pt-2 border-t border-white/5 gap-2">
             <button 
                onClick={() => {
                    setNewTitle('');
                    setNewContent('');
                    setIsExpanded(false);
                }}
                className="px-4 py-2 text-slate-400 text-xs hover:text-white transition-colors"
            >
                Close
            </button>
            <button 
                onClick={handleAdd}
                className="px-6 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/50 rounded-lg text-xs font-bold hover:bg-neon-cyan hover:text-black transition-all"
            >
                Save Log
            </button>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div className="space-y-6">
        {pinnedNotes.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-widest text-neon-purple font-bold mb-3 flex items-center gap-2">
                <Pin size={12} /> Priority Data
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {pinnedNotes.map(note => (
                <NoteCard key={note.id} note={note} onTogglePin={(e) => togglePin(e, note)} onClick={() => setEditingNote(note)} onDelete={(e) => { e.stopPropagation(); onDeleteNote(note.id); }} />
              ))}
            </div>
          </div>
        )}

        {otherNotes.length > 0 && (
          <div>
            {pinnedNotes.length > 0 && (
                <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3 mt-2">Other Entries</h3>
            )}
            <div className="grid grid-cols-2 gap-3">
              {otherNotes.map(note => (
                <NoteCard key={note.id} note={note} onTogglePin={(e) => togglePin(e, note)} onClick={() => setEditingNote(note)} onDelete={(e) => { e.stopPropagation(); onDeleteNote(note.id); }} />
              ))}
            </div>
          </div>
        )}
        
        {notes.length === 0 && !isExpanded && (
            <div className="flex flex-col items-center justify-center py-10 opacity-50">
                <div className="w-16 h-16 border-2 border-dashed border-slate-600 rounded-xl mb-4 flex items-center justify-center">
                    <Edit3 className="text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm">Memory Banks Empty</p>
            </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-dark-card w-full max-w-sm rounded-2xl border border-white/20 shadow-2xl p-4 flex flex-col max-h-[80vh]">
                <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                    placeholder="Title"
                    className="bg-transparent text-xl font-bold text-white outline-none mb-4 placeholder-slate-600"
                />
                <textarea
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                    placeholder="Note content"
                    className="bg-transparent text-slate-300 outline-none resize-none flex-1 min-h-[200px] mb-4 font-sans leading-relaxed"
                />
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <button 
                        onClick={() => onDeleteNote(editingNote.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setEditingNote(null)}
                            className="px-4 py-2 text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveEdit}
                            className="px-6 py-2 bg-neon-cyan text-black font-bold rounded-lg hover:bg-white transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const NoteCard: React.FC<{ 
    note: Note; 
    onClick: () => void; 
    onTogglePin: (e: React.MouseEvent) => void;
    onDelete: (e: React.MouseEvent) => void;
}> = ({ note, onClick, onTogglePin, onDelete }) => (
    <div 
        onClick={onClick}
        className="group relative bg-dark-card border border-white/5 rounded-xl p-3 hover:border-white/20 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-95 flex flex-col h-auto break-inside-avoid"
    >
        <div className="flex justify-between items-start mb-2">
            {note.title && <h4 className="font-bold text-slate-200 text-sm line-clamp-2">{note.title}</h4>}
            <button 
                onClick={onTogglePin}
                className={`p-1 rounded-full transition-colors ${note.isPinned ? 'text-neon-cyan bg-neon-cyan/10' : 'text-slate-600 opacity-0 group-hover:opacity-100 hover:bg-white/10'}`}
            >
                <Pin size={12} className={note.isPinned ? 'fill-neon-cyan' : ''} />
            </button>
        </div>
        <p className="text-xs text-slate-400 line-clamp-4 leading-relaxed whitespace-pre-wrap">{note.content}</p>
        
        {/* Hover Actions */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
           <button 
                onClick={onDelete} 
                className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
           >
               <Trash2 size={12} />
           </button>
        </div>
    </div>
);

export default DailyNotes;
