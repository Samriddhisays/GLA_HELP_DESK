import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Facebook, 
  Linkedin, 
  Twitter, 
  RefreshCw, 
  X, 
  ChevronRight,
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface LoginProps {
  onLogin: (rollNo: string) => void;
  onCancel?: () => void;
}

export function Login({ onLogin, onCancel }: LoginProps) {
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rollNo && password) {
      onLogin(rollNo);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      {/* Abstract Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-[#1a365d] blur-[100px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-[#f37021] blur-[100px] rounded-full" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[500px]"
      >
        {/* Left Panel: Welcome */}
        <div className="w-full md:w-[40%] bg-cyan-500 p-10 flex flex-col justify-between text-white relative">
          <div>
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-4"
            >Hello...</motion.h2>
            <p className="text-sm opacity-90 leading-relaxed mb-8">
              Don't have an account? Create your account. It takes less than a minute
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 mt-8">
              {[
                { label: 'Mobile App', icon: '📱' },
                { label: 'Voice Assistant', icon: '🎙️' },
                { label: 'Bilingual Support', icon: '🌐' },
                { label: 'ERP Sync', icon: '🔄' },
              ].map((f) => (
                <div key={f.label} className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tight">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Login with social media</h3>
              <button className="w-full flex items-center gap-4 bg-indigo-800/40 hover:bg-indigo-800/60 p-3 rounded-lg transition-all border border-white/10 group mb-2">
                <Facebook size={20} fill="white" />
                <span className="text-sm">Facebook</span>
                <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
              <button className="w-full flex items-center gap-4 bg-orange-600 p-3 rounded-lg hover:bg-orange-700 transition-all border border-white/10 group mb-2">
                <Linkedin size={20} fill="white" />
                <span className="text-sm">LinkedIn</span>
                <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="flex-1 p-10 md:p-14 bg-white relative">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Login</h2>
            {onCancel && (
              <button 
                onClick={onCancel}
                className="hidden md:block p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-300 hover:text-slate-500 transition-colors" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <input 
                type="text" 
                placeholder="Roll No / Registration No." 
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-cyan-500 focus:bg-white transition-all text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-cyan-500 focus:bg-white transition-all text-sm"
                required
              />
            </div>

            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Enter Captcha" 
                className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-lg outline-none focus:border-cyan-500 focus:bg-white transition-all text-sm"
              />
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg px-4">
                 <span className="font-mono font-bold text-xl tracking-widest text-slate-400 select-none">14ZL</span>
                 <button type="button" className="text-slate-400 hover:text-cyan-500 transition-colors"><RefreshCw size={18} /></button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button type="button" className="text-xs text-slate-400 hover:text-cyan-500 transition-colors">Forgot password</button>
              <button 
                type="submit"
                className="bg-rose-500 text-white px-10 py-3 rounded-lg font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
              >Login</button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
             <div className="w-12 h-12 bg-slate-100 rounded-xl mx-auto flex items-center justify-center text-slate-300">
                <GraduationCap size={24} />
             </div>
             <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300 mt-2">GLA University Infrastructure</p>
             <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-sky-50 rounded-full border border-sky-100">
               <Sparkles size={10} className="text-sky-500" />
               <span className="text-[10px] font-bold text-sky-600 uppercase tracking-tighter">Future Scope: Full ERP Integration active</span>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
