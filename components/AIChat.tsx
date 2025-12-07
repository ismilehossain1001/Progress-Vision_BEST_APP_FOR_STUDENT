
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Mic, Sparkles, Volume2, VolumeX, MicOff } from 'lucide-react';
import { chatWithMentor } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, setIsOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Greetings. I am your Progress Vision AI. How can I assist your evolution today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Stop speaking when chat closes
  useEffect(() => {
    if (!isOpen) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      if (isListening) stopListening();
    }
  }, [isOpen]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      alert("Voice input not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    
    synthRef.current.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to select a futuristic/clean voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.pitch = 1.0;
    utterance.rate = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (isListening) stopListening();

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Format history for Gemini
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await chatWithMentor(history, userMsg.text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText || "System error.",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);

    // AI Speaks
    speakText(aiMsg.text);
  };

  // The Floating Orb Trigger
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-16 h-16 rounded-full bg-black border-2 border-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.4)] flex items-center justify-center animate-float hover:scale-110 transition-transform"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-blue/20 to-neon-purple/20 animate-pulse-fast" />
        <Sparkles className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" size={28} />
      </button>
    );
  }

  // The Chat Interface
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-dark-bg/95 backdrop-blur-md animate-in fade-in slide-in-from-bottom-10 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-dark-surface/50 relative overflow-hidden">
        {/* Audio Visualizer Background (Only when speaking) */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 pointer-events-none">
             {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-1 bg-neon-cyan animate-[pulse_0.5s_ease-in-out_infinite]"
                  style={{ 
                    height: `${Math.random() * 100}%`, 
                    animationDelay: `${Math.random() * 0.5}s` 
                  }} 
                />
             ))}
          </div>
        )}

        <div className="flex items-center gap-3 relative z-10">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_#bc13fe] transition-all duration-300 ${isSpeaking ? 'scale-110 shadow-[0_0_25px_#bc13fe]' : ''}`}>
             <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white tracking-wide">VISION AI</h3>
            <p className="text-xs text-neon-cyan uppercase tracking-widest flex items-center gap-2">
               {isSpeaking ? 'Transmitting Voice...' : 'Online // Mentor Mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
            <button 
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                if(voiceEnabled) synthRef.current.cancel();
              }}
              className={`p-2 rounded-full transition-colors ${voiceEnabled ? 'text-neon-cyan bg-neon-cyan/10' : 'text-slate-500 hover:bg-white/10'}`}
            >
                {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="text-slate-400" />
            </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-neon-blue/10 border border-neon-blue/30 text-slate-100 rounded-tr-none'
                  : 'bg-dark-card border border-white/10 text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="text-sm leading-relaxed font-sans">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-dark-card border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-2 items-center">
                <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-200" />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-dark-surface/50 border-t border-white/10 pb-8">
        <div className={`flex gap-2 items-center bg-dark-card border rounded-xl px-4 py-2 transition-all duration-300 ${isListening ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-white/10 focus-within:border-neon-blue/50'}`}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : "Type or speak..."}
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none font-sans"
          />
          
          <button 
            onClick={handleVoiceToggle}
            className={`p-2 rounded-lg transition-all ${
                isListening 
                ? 'text-red-500 bg-red-500/10 animate-pulse scale-110' 
                : 'text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/10'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="ml-2 p-2 bg-neon-blue/20 rounded-lg text-neon-blue hover:bg-neon-blue hover:text-black transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
        {isListening && (
            <p className="text-[10px] text-red-400 mt-2 text-center animate-pulse tracking-widest uppercase">
                • Live Recording Active •
            </p>
        )}
      </div>
    </div>
  );
};

export default AIChat;
