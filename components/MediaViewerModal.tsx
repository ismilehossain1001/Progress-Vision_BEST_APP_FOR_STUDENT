
import React, { useRef, useState } from 'react';
import { X, Play, Maximize2, Activity, Tag, Calendar, Gauge } from 'lucide-react';
import { ProgressEntry } from '../types';

interface MediaViewerModalProps {
  entry: ProgressEntry | null;
  onClose: () => void;
}

const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ entry, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);

  if (!entry) return null;

  const isVideo = entry.mediaType === 'video';

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="absolute inset-0 z-0" onClick={onClose}>
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row bg-dark-card/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-neon-cyan/20 rounded-full text-white hover:text-neon-cyan transition-colors"
        >
          <X size={24} />
        </button>

        {/* Media Section */}
        <div className="flex-1 bg-black flex items-center justify-center relative overflow-hidden group">
          {isVideo ? (
            <>
                <video 
                  ref={videoRef}
                  src={entry.mediaUrl} 
                  controls 
                  autoPlay 
                  className="max-w-full max-h-[60vh] md:max-h-full object-contain" 
                />
                
                {/* Speed Controls Overlay */}
                <div className="absolute top-6 left-6 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Gauge size={16} className="text-neon-cyan" />
                    </div>
                    <div className="flex gap-1 pr-2">
                        {[0.5, 1, 1.5, 2].map((rate) => (
                            <button
                                key={rate}
                                onClick={() => handleSpeedChange(rate)}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
                                    playbackRate === rate 
                                    ? 'bg-neon-cyan text-black shadow-[0_0_10px_rgba(10,255,240,0.5)]' 
                                    : 'text-slate-300 hover:bg-white/10'
                                }`}
                            >
                                {rate}x
                            </button>
                        ))}
                    </div>
                </div>
            </>
          ) : (
            <img 
              src={entry.mediaUrl} 
              alt="Progress Detail" 
              className="max-w-full max-h-[60vh] md:max-h-full object-contain" 
            />
          )}
          
          {/* Decorative Corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-neon-cyan/50 rounded-tl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-neon-cyan/50 rounded-br-lg pointer-events-none" />
        </div>

        {/* Info Sidebar */}
        <div className="w-full md:w-80 border-l border-white/10 flex flex-col bg-dark-surface/90 backdrop-blur-md">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-6">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-2 mb-2">
                    <Calendar size={12} /> Recorded On
                </span>
                <h3 className="text-xl font-display font-bold text-white">
                    {new Date(entry.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                    {new Date(entry.date).toLocaleTimeString()}
                </p>
            </div>

            <div className="space-y-6">
                {/* Score Card */}
                <div className="bg-dark-bg border border-white/5 rounded-2xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Activity size={48} className="text-neon-cyan" />
                    </div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">AI Performance Score</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold font-display text-neon-cyan">{entry.aiAnalysis.score}</span>
                        <span className="text-sm text-slate-500">/ 100</span>
                    </div>
                </div>

                {/* Emotion & Feedback */}
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Analysis</p>
                    <div className="bg-white/5 rounded-xl p-4 border-l-2 border-neon-purple">
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                             <span className="font-bold text-neon-purple text-sm uppercase">{entry.aiAnalysis.emotion}</span>
                        </div>
                        <p className="text-sm text-slate-300 italic leading-relaxed">
                            "{entry.aiAnalysis.feedback}"
                        </p>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Tag size={12} /> Detected Attributes
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {entry.aiAnalysis.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full text-xs text-neon-blue font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-white/10">
            <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white text-black font-bold font-display hover:bg-slate-200 transition-colors"
            >
                CLOSE VIEWER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaViewerModal;
