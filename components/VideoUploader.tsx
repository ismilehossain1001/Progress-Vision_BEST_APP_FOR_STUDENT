
import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle, Loader2, Play, Pause, RefreshCw, Scan, Activity, Zap, Heart, Split, History, Minimize2, X } from 'lucide-react';
import { analyzeProgressMedia } from '../services/geminiService';
import { ProgressEntry } from '../types';

interface VideoUploaderProps {
  onUploadComplete: (entry: ProgressEntry) => void;
  history: ProgressEntry[];
}

type AnalysisMode = 'biometric' | 'emotional' | 'velocity';

const VideoUploader: React.FC<VideoUploaderProps> = ({ onUploadComplete, history }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProgressEntry['aiAnalysis'] | null>(null);
  const [mode, setMode] = useState<AnalysisMode>('biometric');
  
  // Comparison State
  const [comparisonEntry, setComparisonEntry] = useState<ProgressEntry | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  
  // Video Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const compareVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // HUD Animation State
  const [scanLinePos, setScanLinePos] = useState(0);

  useEffect(() => {
    if (preview && !analysisResult) {
        const interval = setInterval(() => {
            setScanLinePos(prev => (prev + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
    }
  }, [preview, analysisResult]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setAnalysisResult(null);
      // Reset video state
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Data(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setBase64Data(null);
    setAnalysisResult(null);
    setIsPlaying(false);
    setProgress(0);
    setComparisonEntry(null);
  };

  const togglePlay = () => {
    const mainVideo = videoRef.current;
    const refVideo = compareVideoRef.current;

    if (mainVideo) {
      if (isPlaying) {
        mainVideo.pause();
        if (refVideo) refVideo.pause();
      } else {
        mainVideo.play();
        if (refVideo) {
            refVideo.currentTime = 0; // Sync start
            refVideo.play();
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      if (total > 0) {
        setProgress((current / total) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const manualChange = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = (videoRef.current.duration / 100) * manualChange;
      setProgress(manualChange);
      
      // Sync seek
      if (compareVideoRef.current) {
         compareVideoRef.current.currentTime = (compareVideoRef.current.duration / 100) * manualChange;
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const processUpload = async () => {
    if (!file || !base64Data) return;

    setIsAnalyzing(true);
    // Auto-pause video during analysis
    if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
    }

    try {
      const apiData = base64Data.split(',')[1];
      
      // Customize prompt based on mode
      const contextMap = {
          biometric: "Focus strictly on physical form, posture, and technique.",
          emotional: "Focus on facial expressions, confidence, and mood.",
          velocity: "Focus on speed, intensity, and explosive power."
      };
      
      const comparisonContext = comparisonEntry 
        ? `Compare this new input against a previous entry which scored ${comparisonEntry.aiAnalysis.score}. Highlight specific improvements.` 
        : "";
        
      const analysis = await analyzeProgressMedia(
        apiData, 
        file.type, 
        `Daily progress check-in. Mode: ${mode}. ${contextMap[mode]} ${comparisonContext}`
      );
      
      // Simulate scanning delay for effect
      setTimeout(() => {
        setAnalysisResult(analysis);
        setIsAnalyzing(false);
        
        // Auto-save delay
        setTimeout(() => {
             const newEntry: ProgressEntry = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                type: 'fitness', // Could be dynamic
                mediaUrl: base64Data,
                mediaType: file.type.startsWith('video') ? 'video' : 'image',
                aiAnalysis: analysis
            };
            onUploadComplete(newEntry);
        }, 4000);
      }, 2000);

    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-y-auto relative">
      
      {/* Comparison Selector Overlay */}
      {showSelector && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-6 animate-in fade-in duration-200">
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                     <History className="text-neon-cyan" /> Select Baseline Data
                 </h2>
                 <button onClick={() => setShowSelector(false)} className="p-2 hover:bg-white/10 rounded-full text-white">
                     <X />
                 </button>
             </div>
             
             <div className="grid grid-cols-2 gap-4 overflow-y-auto">
                 {/* Safety check for file existence */}
                 {history.filter(e => file && e.mediaType === (file.type.startsWith('video') ? 'video' : 'image')).map(entry => (
                     <div 
                        key={entry.id} 
                        onClick={() => { setComparisonEntry(entry); setShowSelector(false); }}
                        className="bg-dark-card border border-white/10 rounded-xl p-3 cursor-pointer hover:border-neon-cyan/50 hover:bg-white/5 transition-all"
                     >
                         <div className="aspect-video bg-black mb-2 rounded-lg overflow-hidden relative">
                             {entry.mediaType === 'video' ? (
                                 <video src={entry.mediaUrl} className="w-full h-full object-cover" />
                             ) : (
                                 <img src={entry.mediaUrl} className="w-full h-full object-cover" />
                             )}
                             <div className="absolute top-1 right-1 bg-black/60 px-2 py-0.5 rounded text-[8px] text-neon-cyan border border-neon-cyan/30">
                                 Score: {entry.aiAnalysis.score}
                             </div>
                         </div>
                         <p className="text-xs text-slate-400 font-mono">{new Date(entry.date).toLocaleDateString()}</p>
                     </div>
                 ))}
                 {history.length === 0 && (
                     <p className="col-span-2 text-center text-slate-500 text-sm">No compatible archives found.</p>
                 )}
             </div>
          </div>
      )}

      {/* LEFT COLUMN: Controls & Input */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
           <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
             <Scan className="text-neon-cyan" /> Neural Link
           </h2>
           <p className="text-slate-400 text-sm">Upload media for deep-learning analysis.</p>
        </div>

        {/* Mode Selector */}
        {!analysisResult && (
            <div className="bg-dark-card border border-white/5 rounded-2xl p-4">
                <label className="text-xs uppercase tracking-widest text-slate-500 mb-3 block font-bold">Analysis Protocol</label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'biometric', icon: Activity, label: 'Form' },
                        { id: 'emotional', icon: Heart, label: 'Mood' },
                        { id: 'velocity', icon: Zap, label: 'Power' }
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id as AnalysisMode)}
                            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border transition-all ${
                                mode === m.id 
                                ? 'bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                                : 'bg-transparent border-white/10 text-slate-500 hover:bg-white/5'
                            }`}
                        >
                            <m.icon size={18} className={mode === m.id ? 'text-neon-cyan' : ''} />
                            <span className="text-[10px] uppercase font-bold">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Compare Toggle */}
        {preview && (
            <div className="bg-dark-card border border-white/5 rounded-2xl p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neon-purple/10 rounded-lg text-neon-purple">
                        <Split size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Delta Analysis</h4>
                        <p className="text-[10px] text-slate-400">{comparisonEntry ? "Baseline Active" : "Compare vs History"}</p>
                    </div>
                </div>
                {comparisonEntry ? (
                     <button onClick={() => setComparisonEntry(null)} className="text-xs text-red-400 hover:text-white px-3 py-1 rounded border border-red-500/30 hover:bg-red-500/10">
                        Clear
                     </button>
                ) : (
                    <button 
                        onClick={() => setShowSelector(true)} 
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-neon-cyan border border-neon-cyan/30"
                    >
                        Select Ref
                    </button>
                )}
            </div>
        )}

        {/* Upload/Action Area */}
        <div className="flex-1 flex flex-col">
            {!preview ? (
                <label className="flex-1 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-neon-blue hover:bg-neon-blue/5 transition-all group relative overflow-hidden min-h-[200px]">
                    <div className="w-20 h-20 bg-dark-surface rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10">
                        <UploadCloud className="text-neon-blue" size={32} />
                    </div>
                    <p className="text-lg font-medium text-slate-300">Initiate Upload</p>
                    <p className="text-sm text-slate-500 mt-2">MP4, MOV, JPG, PNG</p>
                    <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                </label>
            ) : (
                <div className="flex flex-col gap-4">
                     {/* Analysis Status */}
                     {isAnalyzing ? (
                        <div className="bg-dark-surface border border-neon-blue/30 rounded-2xl p-6 text-center animate-pulse">
                            <Loader2 className="animate-spin text-neon-cyan mx-auto mb-2" size={32} />
                            <h3 className="text-white font-bold font-display">Processing...</h3>
                            <p className="text-xs text-neon-blue mt-1">Extracting Vectors</p>
                        </div>
                     ) : analysisResult ? (
                         <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center animate-in zoom-in">
                            <CheckCircle className="text-green-400 mx-auto mb-2" size={32} />
                            <h3 className="text-white font-bold font-display text-xl">Analysis Complete</h3>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Score</p>
                                    <p className="text-2xl font-bold text-white">{analysisResult.score}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase">Detected</p>
                                    <p className="text-lg font-bold text-white">{analysisResult.emotion}</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-300 mt-4 italic border-t border-white/10 pt-4">"{analysisResult.feedback}"</p>
                            <p className="text-[10px] text-slate-500 mt-2">Saving to database...</p>
                         </div>
                     ) : (
                         <div className="space-y-3">
                             <div className="bg-dark-surface rounded-xl p-4 border border-white/5 flex justify-between items-center">
                                 <div>
                                     <p className="text-xs text-slate-400">File Selected</p>
                                     <p className="text-white font-bold text-sm">{file?.name.substring(0, 20)}...</p>
                                 </div>
                                 <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                                     <RefreshCw size={16} />
                                 </button>
                             </div>
                             <button
                                onClick={processUpload}
                                className="w-full py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold font-display tracking-wide rounded-xl shadow-[0_0_20px_rgba(188,19,254,0.4)] hover:shadow-[0_0_30px_rgba(188,19,254,0.6)] transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Zap size={18} /> RUN DIAGNOSTICS
                            </button>
                         </div>
                     )}
                </div>
            )}
        </div>
      </div>

      {/* RIGHT COLUMN: Video/Image Player HUD */}
      <div className={`flex-1 bg-black rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl min-h-[300px] flex items-center justify-center group ${comparisonEntry ? 'p-1' : ''}`}>
          
          {/* Grid Background if empty */}
          {!preview && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                  <div className="w-full h-[1px] bg-neon-cyan/20 absolute top-1/2"></div>
                  <div className="h-full w-[1px] bg-neon-cyan/20 absolute left-1/2"></div>
                  <div className="w-32 h-32 border border-dashed border-slate-600 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-slate-500">Signal Offline</p>
              </div>
          )}

          {preview && (
            <div className={`relative w-full h-full flex flex-col ${comparisonEntry ? 'gap-1' : ''}`}>
                
                {/* Media Container - Flex for split view */}
                <div className={`relative flex-1 flex ${comparisonEntry ? 'gap-1' : ''}`}>
                    
                    {/* COMPARISON VIDEO (Reference) */}
                    {comparisonEntry && (
                         <div className="flex-1 bg-black relative border-r border-neon-purple/30 overflow-hidden">
                             <div className="absolute top-2 left-2 z-10 bg-neon-purple/20 border border-neon-purple/50 px-2 rounded text-[8px] text-neon-purple font-bold uppercase">
                                 Baseline Data
                             </div>
                             {comparisonEntry.mediaType === 'video' ? (
                                 <video 
                                    ref={compareVideoRef}
                                    src={comparisonEntry.mediaUrl}
                                    className="w-full h-full object-cover opacity-60"
                                    muted
                                 />
                             ) : (
                                <img src={comparisonEntry.mediaUrl} className="w-full h-full object-cover opacity-60" />
                             )}
                         </div>
                    )}

                    {/* CURRENT VIDEO (Active) */}
                    <div className="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
                        {file?.type.startsWith('video') ? (
                            <>
                                <video 
                                    ref={videoRef}
                                    src={preview} 
                                    className="max-w-full max-h-full object-contain"
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onEnded={() => setIsPlaying(false)}
                                    onClick={togglePlay}
                                />
                                {!isPlaying && !isAnalyzing && (
                                    <div 
                                        className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer z-20"
                                        onClick={togglePlay}
                                    >
                                        <div className="w-16 h-16 rounded-full bg-neon-cyan/20 backdrop-blur-sm border border-neon-cyan/50 flex items-center justify-center shadow-[0_0_20px_rgba(10,255,240,0.3)] transition-transform hover:scale-110">
                                            <Play size={32} className="text-neon-cyan ml-1" />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                        )}

                        {/* HUD Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                            {/* Scanning Bar */}
                            {!analysisResult && isAnalyzing && (
                                <div 
                                    className="absolute left-0 w-full h-[2px] bg-neon-cyan shadow-[0_0_10px_#0afff0] transition-all duration-75 opacity-50"
                                    style={{ top: `${scanLinePos}%` }}
                                />
                            )}

                            {/* Corner Brackets */}
                            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-neon-cyan/50"></div>
                            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/50"></div>
                            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-neon-cyan/50"></div>
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-neon-cyan/50"></div>

                            {/* Data Readouts */}
                            <div className="absolute top-4 right-14 text-right">
                                <p className="text-[8px] text-neon-cyan font-mono">REC :: {mode.toUpperCase()}</p>
                                <p className="text-[8px] text-neon-cyan font-mono">{file?.type?.toUpperCase()}</p>
                            </div>

                            {/* Center Reticle */}
                            {!analysisResult && isAnalyzing && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-neon-purple/50 rounded-lg flex items-center justify-center">
                                    <div className="w-20 h-1 bg-neon-purple/20 absolute"></div>
                                    <div className="h-20 w-1 bg-neon-purple/20 absolute"></div>
                                    <span className="absolute -top-4 text-[8px] bg-neon-purple text-black px-1">TRACKING</span>
                                </div>
                            )}

                            {/* Analysis Result Overlay */}
                            {analysisResult && (
                                <div className="absolute bottom-20 left-8 bg-black/60 backdrop-blur-md border border-neon-green/50 p-2 rounded">
                                    <p className="text-neon-green text-xs font-bold flex items-center gap-1">
                                        <CheckCircle size={10} /> TARGET LOCK
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Video Controls Bar */}
                {file?.type.startsWith('video') && (
                    <div className="h-14 bg-dark-card border-t border-white/10 flex items-center px-4 gap-4 z-20">
                        <button 
                            onClick={togglePlay}
                            className="text-neon-cyan hover:text-white transition-colors flex items-center gap-2"
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            {comparisonEntry && <span className="text-[8px] font-bold uppercase tracking-wide">Sync Play</span>}
                        </button>
                        
                        <div className="flex-1 flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 font-mono w-8 text-right">{formatTime(currentTime)}</span>
                            <div className="relative flex-1 h-1 bg-white/20 rounded-full group">
                                <div 
                                    className="absolute left-0 top-0 h-full bg-neon-cyan rounded-full shadow-[0_0_10px_#0afff0]" 
                                    style={{ width: `${progress}%` }}
                                />
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={progress} 
                                    onChange={handleSeek}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono w-8">{formatTime(duration)}</span>
                        </div>
                    </div>
                )}
            </div>
          )}
      </div>
    </div>
  );
};

export default VideoUploader;
