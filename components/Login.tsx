
import React, { useState } from 'react';
import { User, Lock, ArrowRight, Sparkles, Scan, Fingerprint, UserPlus, Mail, ChevronLeft } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingType, setLoadingType] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    setLoadingType('LOGIN');
    
    // Simulate boot sequence
    const steps = [
      "Authenticating Identity...",
      "Connecting to Neural Network...",
      "Syncing Progress Metrics...",
      "System Online."
    ];
    runLoadingSequence(steps, onLogin);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;

    setIsLoading(true);
    setLoadingType('REGISTER');

    const steps = [
      "Allocating Neural Space...",
      "Encrypting Biometrics...",
      "Generating Unique ID...",
      "Identity Created Successfully."
    ];
    
    runLoadingSequence(steps, () => {
        setIsLoading(false);
        setView('login');
        setUsername(regEmail.split('@')[0]); // Pre-fill login for UX
        // Reset registration form
        setRegName('');
        setRegEmail('');
        setRegPassword('');
    });
  };

  const runLoadingSequence = (steps: string[], onComplete: () => void) => {
    let currentStep = 0;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep(currentStep);
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
            onComplete();
        }, 800);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Background & Animations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_transparent_0%,_#050510_70%)] z-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,243,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 animate-[pulse_4s_ease-in-out_infinite]" />
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo Section */}
        <div className={`text-center mb-8 relative group transition-all duration-500 ${isLoading ? 'scale-75 opacity-80' : 'scale-100'}`}>
          <div className="w-20 h-20 mx-auto mb-4 relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue to-neon-purple rounded-full blur-xl opacity-50 animate-pulse-fast" />
             <div className="relative w-full h-full bg-dark-surface border border-white/10 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                <Sparkles size={32} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
             </div>
             <div className="absolute inset-[-5px] border border-neon-blue/30 rounded-full border-t-transparent animate-[spin_3s_linear_infinite]" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-wider mb-1 drop-shadow-lg">
            PROGRESS<span className="text-neon-cyan">VISION</span>
          </h1>
          <p className="text-neon-purple/80 text-[10px] tracking-[0.3em] font-medium uppercase">
            {view === 'login' ? 'System Access' : 'New User Protocol'}
          </p>
        </div>

        {/* Dynamic Form Container */}
        <div className="relative min-h-[400px]">
            {isLoading ? (
                 <LoadingState loadingStep={loadingStep} type={loadingType} />
            ) : (
                <>
                    {view === 'login' && (
                        <LoginForm 
                            username={username} 
                            setUsername={setUsername} 
                            password={password} 
                            setPassword={setPassword} 
                            onSubmit={handleLogin}
                            onSwitch={() => setView('register')}
                        />
                    )}
                    {view === 'register' && (
                        <RegisterForm 
                            name={regName}
                            setName={setRegName}
                            email={regEmail}
                            setEmail={setRegEmail}
                            password={regPassword}
                            setPassword={setRegPassword}
                            onSubmit={handleRegister}
                            onSwitch={() => setView('login')}
                        />
                    )}
                </>
            )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center z-10">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">
            {view === 'login' ? 'Secure Connection' : 'Encrypted Registration'} // v2.0.45
        </p>
      </div>
    </div>
  );
};

/* --- Sub Components --- */

const LoadingState = ({ loadingStep, type }: { loadingStep: number, type: 'LOGIN' | 'REGISTER' }) => {
    const loginSteps = ["Authenticating...", "Decrypting User Data...", "Loading Neural Model...", "Welcome User."];
    const regSteps = ["Allocating Neural Space...", "Encrypting Biometrics...", "Generating Unique ID...", "Identity Created."];
    const steps = type === 'LOGIN' ? loginSteps : regSteps;

    return (
        <div className="absolute inset-0 bg-dark-card/50 backdrop-blur-xl border border-neon-blue/30 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="relative w-24 h-24 mb-8">
                 <div className="absolute inset-0 border-4 border-neon-blue/20 rounded-full"></div>
                 <div className="absolute inset-0 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
                 <Scan size={40} className="absolute inset-0 m-auto text-neon-purple animate-pulse" />
            </div>
            <h3 className="text-white font-display text-lg font-bold mb-4 tracking-wider">
                {type === 'LOGIN' ? 'ACCESSING MAINFRAME' : 'INITIALIZING IDENTITY'}
            </h3>
            <div className="h-8 flex items-center justify-center w-full">
                 <p className="text-neon-cyan text-sm animate-pulse font-mono">
                   {">"} {steps[loadingStep] || "Processing..."}
                 </p>
            </div>
        </div>
    );
};

const LoginForm = ({ ...props }) => (
    <form onSubmit={props.onSubmit} className="absolute inset-0 bg-dark-card/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-right-8 duration-500 flex flex-col">
        <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
             <Lock size={20} className="text-neon-cyan" /> LOGIN
        </h2>
        
        <div className="space-y-4 flex-1">
            <div className="space-y-1 group">
                <label className="text-[10px] text-slate-400 font-display tracking-widest uppercase ml-1">Identity</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-cyan transition-colors" size={18} />
                    <input 
                    type="text" 
                    value={props.username}
                    onChange={(e) => props.setUsername(e.target.value)}
                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(10,255,240,0.1)] transition-all font-sans text-sm"
                    placeholder="Username or Email"
                    />
                </div>
            </div>

            <div className="space-y-1 group">
                <label className="text-[10px] text-slate-400 font-display tracking-widest uppercase ml-1">Key</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-cyan transition-colors" size={18} />
                    <input 
                    type="password" 
                    value={props.password}
                    onChange={(e) => props.setPassword(e.target.value)}
                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(10,255,240,0.1)] transition-all font-sans text-sm"
                    placeholder="••••••••"
                    />
                </div>
            </div>
            
             <button 
                type="submit"
                className="w-full mt-4 relative group overflow-hidden bg-white text-black font-bold py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-blue translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-50" />
                <span className="relative flex items-center justify-center gap-2 font-display tracking-wide uppercase text-sm">
                    <Fingerprint size={18} /> Initialize
                </span>
            </button>
        </div>

        <div className="mt-auto pt-6 text-center border-t border-white/5">
             <p className="text-slate-400 text-xs mb-3">New to Progress Vision?</p>
             <button type="button" onClick={props.onSwitch} className="text-neon-cyan font-bold text-xs hover:text-white transition-colors uppercase tracking-wider flex items-center justify-center gap-1 w-full group p-2 rounded hover:bg-white/5">
                 Initialize Registration <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
        </div>
    </form>
);

const RegisterForm = ({ ...props }) => (
    <form onSubmit={props.onSubmit} className="absolute inset-0 bg-dark-card/60 backdrop-blur-md border border-neon-purple/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-left-8 duration-500 flex flex-col relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/10 blur-2xl rounded-full pointer-events-none -mr-16 -mt-16"></div>
        
        <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
             <UserPlus size={20} className="text-neon-purple" /> REGISTRATION
        </h2>
        
        <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-1 group">
                <label className="text-[10px] text-slate-400 font-display tracking-widest uppercase ml-1">Full Designation</label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-purple transition-colors" size={18} />
                    <input 
                    type="text" 
                    value={props.name}
                    onChange={(e) => props.setName(e.target.value)}
                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_15px_rgba(188,19,254,0.1)] transition-all font-sans text-sm"
                    placeholder="Your Name"
                    />
                </div>
            </div>

            <div className="space-y-1 group">
                <label className="text-[10px] text-slate-400 font-display tracking-widest uppercase ml-1">Comms Channel</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-purple transition-colors" size={18} />
                    <input 
                    type="email" 
                    value={props.email}
                    onChange={(e) => props.setEmail(e.target.value)}
                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_15px_rgba(188,19,254,0.1)] transition-all font-sans text-sm"
                    placeholder="email@domain.com"
                    />
                </div>
            </div>

            <div className="space-y-1 group">
                <label className="text-[10px] text-slate-400 font-display tracking-widest uppercase ml-1">Secure Key</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-neon-purple transition-colors" size={18} />
                    <input 
                    type="password" 
                    value={props.password}
                    onChange={(e) => props.setPassword(e.target.value)}
                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple/50 focus:shadow-[0_0_15px_rgba(188,19,254,0.1)] transition-all font-sans text-sm"
                    placeholder="Create Password"
                    />
                </div>
            </div>

             <button 
                type="submit"
                className="w-full mt-4 relative group overflow-hidden bg-white text-black font-bold py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(188,19,254,0.4)] active:scale-95"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-purple via-pink-500 to-neon-purple translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 opacity-50" />
                <span className="relative flex items-center justify-center gap-2 font-display tracking-wide uppercase text-sm">
                    <Scan size={18} /> Create Identity
                </span>
            </button>
        </div>

         <div className="mt-auto pt-6 text-center border-t border-white/5">
             <p className="text-slate-400 text-xs mb-3">Already have an Identity?</p>
             <button type="button" onClick={props.onSwitch} className="text-neon-purple font-bold text-xs hover:text-white transition-colors uppercase tracking-wider flex items-center justify-center gap-1 w-full group p-2 rounded hover:bg-white/5">
                 <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Access Login
             </button>
        </div>
    </form>
);

export default Login;
