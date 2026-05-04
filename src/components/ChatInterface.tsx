import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { 
  Send, 
  Mic, 
  Paperclip, 
  ThumbsUp, 
  ThumbsDown, 
  Download,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Square,
  Search,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SourceType } from '../services/hybrid';
import { ChatMessagePart } from '../services/gemini';

interface Message {
  id: string;
  text: string;
  role: 'user' | 'bot';
  timestamp: Date;
  source?: SourceType;
  feedback?: 'up' | 'down' | null;
  imageUrl?: string;
  suggestions?: string[];
}

interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  setInput: (val: string) => void;
  handleSend: (text?: string, attachment?: ChatMessagePart) => void;
  isLoading: boolean;
  isDarkMode: boolean;
  isListening?: boolean;
  handleStop?: () => void;
  handleFeedback: (id: string, type: 'up' | 'down') => void;
  handleVoiceInput: () => void;
  exportChat: () => void;
  translations: any;
}

const SUGGESTIONS = [
  { label: 'Examination', icon: '📝' },
  { label: 'Fees', icon: '💰' },
  { label: 'Timetable', icon: '📅' },
  { label: 'Admissions', icon: '🎓' },
];

export function ChatInterface({
  messages,
  input,
  setInput,
  handleSend,
  isLoading,
  isDarkMode,
  isListening,
  handleStop,
  handleFeedback,
  handleVoiceInput,
  exportChat,
  translations: t
}: ChatInterfaceProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Suggestions Bar */}
      <div className={cn(
        "flex gap-2 p-4 overflow-x-auto no-scrollbar border-b sticky top-0 bg-inherit z-10",
        isDarkMode ? "bg-zinc-950/50 border-zinc-900" : "bg-white/80 backdrop-blur border-zinc-100"
      )}>
        {SUGGESTIONS.map((s) => (
          <button 
            key={s.label}
            onClick={() => handleSend(s.label)}
            className={cn(
              "flex-none flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all text-sm font-bold active:scale-95",
              isDarkMode 
                ? "bg-zinc-900 border-zinc-800 hover:border-[#f37021]/50 hover:bg-[#f37021]/5" 
                : "bg-white border-zinc-100 hover:border-[#1a365d] hover:bg-[#ebf1fa]"
            )}
          >
            <span className="scale-125">{s.icon}</span>
            <span className="text-[#1a365d] dark:text-inherit">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-12 py-10 px-4">
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-[#1a365d] to-[#f37021] flex items-center justify-center text-white shadow-2xl relative group"
            >
              <GraduationCap size={56} className="relative z-10" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-white rounded-[2.5rem] blur-2xl" 
              />
            </motion.div>
            
            <div className="space-y-4">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-black text-[#1a365d] dark:text-white tracking-tight"
              >
                {t.welcome}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm opacity-60 font-medium leading-relaxed max-w-sm mx-auto"
              >
                {t.welcomeSub}
              </motion.p>
            </div>

            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
            >
              {[
                { q: "What's the B.Tech fee structure?", icon: "💰" },
                { q: "When are the end-term exams?", icon: "📅" },
                { q: "How do I apply for scholarship?", icon: "🎓" },
                { q: "Tell me about placement stats.", icon: "📈" }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(item.q)}
                  className={cn(
                    "p-4 rounded-2xl border text-left flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group",
                    isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100 shadow-lg shadow-slate-200/50"
                  )}
                >
                  <span className="text-2xl group-hover:rotate-12 transition-transform">{item.icon}</span>
                  <span className="text-xs font-bold opacity-70 group-hover:opacity-100">{item.q}</span>
                </button>
              ))}
            </motion.div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                "flex flex-col max-w-[90%] md:max-w-[75%]",
                message.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "p-5 rounded-2xl shadow-sm border leading-relaxed",
                message.role === 'user' 
                  ? "bg-[#1a365d] text-white border-[#1a365d] rounded-tr-none shadow-xl shadow-[#1a365d]/10" 
                  : isDarkMode 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-100 rounded-tl-none" 
                    : "bg-white border-zinc-200 text-[#1a365d] rounded-tl-none shadow-xl shadow-slate-200/50"
              )}>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
                
                {message.source && (
                  <div className={cn(
                    "mt-4 flex items-center gap-2 pt-3 border-t",
                    isDarkMode ? "border-zinc-800" : "border-zinc-100"
                  )}>
                    {message.source === 'official' ? (
                      <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                        <CheckCircle2 size={12} /> {t.officialBadge}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] bg-[#f37021]/10 text-[#f37021] px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                        <Sparkles size={12} /> {t.aiBadge}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {message.imageUrl && (
                <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg">
                  <img src={message.imageUrl} alt="AI Generated" className="w-full h-auto object-cover max-h-[400px]" />
                </div>
              )}

              <div className="flex items-center gap-3 mt-2 px-1">
                <span className="text-[10px] opacity-40 font-mono">{format(message.timestamp, 'HH:mm')}</span>
                {message.role === 'bot' && (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleFeedback(message.id, 'up')}
                      className={cn("p-1.5 rounded-lg transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800", message.feedback === 'up' && "bg-[#f37021]/10 text-[#f37021]")}
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button 
                      onClick={() => handleFeedback(message.id, 'down')}
                      className={cn("p-1.5 rounded-lg transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800", message.feedback === 'down' && "bg-rose-500/10 text-rose-500")}
                    >
                      <ThumbsDown size={14} />
                    </button>
                    <button 
                      onClick={() => handleCopy(message.text, message.id)}
                      className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors opacity-30 hover:opacity-100"
                      title="Copy to clipboard"
                    >
                      {copiedId === message.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                    <button onClick={exportChat} className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors opacity-30 hover:opacity-100">
                       <Download size={14} />
                     </button>
                  </div>
                )}
              </div>

              {message.role === 'bot' && message.suggestions && message.suggestions.length > 0 && index === messages.length - 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion)}
                      className={cn(
                        "text-[11px] font-bold px-4 py-2 rounded-full border transition-all hover:scale-105 active:scale-95",
                        isDarkMode
                          ? "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-[#f37021]/50 hover:text-[#f37021]"
                          : "bg-[#ebf1fa]/50 border-zinc-100 text-[#1a365d] hover:border-[#f37021]/50 hover:text-[#f37021]"
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2 mr-auto"
            >
              <div className="flex items-center gap-4">
                <div className="p-5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-zinc-800">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1a365d] dark:bg-sky-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#1a365d] dark:bg-sky-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#1a365d] dark:bg-sky-500 animate-bounce" />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 transition-all">
                  <Sparkles size={12} className="text-[#f37021]" />
                  <span className="text-[10px] opacity-40 font-black uppercase tracking-tighter animate-pulse">
                    {t.computing}
                  </span>
                </div>
              </div>
              
              {handleStop && (
                <div className="flex items-center gap-2 pl-1">
                  <button 
                    onClick={handleStop}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all text-[10px] font-bold uppercase tracking-widest text-[#f37021]"
                  >
                    <Square size={10} fill="currentColor" /> {t.stopGenerating}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 pl-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f37021] animate-pulse" />
                <span className="text-[10px] font-bold text-[#f37021] uppercase tracking-widest">{t.botTyping}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-4 md:p-8 pt-0">
        <div className={cn(
          "max-w-4xl mx-auto rounded-[2rem] p-3 pl-8 shadow-2xl transition-all border",
          isDarkMode 
            ? "bg-zinc-900 border-zinc-800 focus-within:border-[#f37021]/50" 
            : "bg-white border-zinc-100 focus-within:border-[#1a365d]"
        )}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors opacity-50 hover:opacity-100"
            >
              <Paperclip size={20} />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*,.pdf,.txt,.md,.json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  
                  if (file.type.startsWith('image/')) {
                    reader.onload = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      handleSend(`[Image Uploaded: ${file.name}]`, {
                        inlineData: { mimeType: file.type, data: base64 }
                      });
                    };
                    reader.readAsDataURL(file);
                  } else if (file.type === 'application/pdf') {
                    // For PDF, we just send a notification and metadata for now 
                    // To keep it simple without heavy client libraries, we treat it as document context
                    reader.onload = () => {
                      // We don't parse PDF client side here to avoid dependencies, we just signify its presence
                      handleSend(`I've uploaded a PDF document named "${file.name}". Can you summarize it? (Simulated PDF Context)`);
                    };
                    reader.readAsArrayBuffer(file);
                  } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
                    reader.onload = () => {
                      const content = reader.result as string;
                      handleSend(`[File Context: ${file.name}]\n\n${content.substring(0, 5000)}`);
                    };
                    reader.readAsText(file);
                  } else {
                    handleSend(t.fileTypeNotSupported + ` (Name: ${file.name})`);
                  }
                  e.target.value = '';
                }}
              />
            </button>
            <button 
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors opacity-50 hover:opacity-100"
              title={t.createImage}
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon size={20} />
              <input 
                type="file" 
                ref={imageInputRef}
                className="hidden" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    handleSend(input || `[Image Uploaded: ${file.name}]`, {
                      inlineData: { mimeType: file.type, data: base64 }
                    });
                  };
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }}
              />
            </button>
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t.inputPlaceholder} 
              className="flex-1 bg-transparent py-4 outline-none resize-none text-sm font-medium leading-relaxed"
            />
            <div className="flex items-center gap-2 pr-1">
              <button 
                onClick={handleVoiceInput}
                className={cn(
                  "p-4 rounded-full transition-all relative overflow-hidden",
                  isListening 
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40" 
                    : isDarkMode 
                      ? "hover:bg-zinc-800 text-zinc-400" 
                      : "hover:bg-[#ebf1fa] text-[#1a365d]"
                )}
              >
                <AnimatePresence>
                  {isListening && (
                    <motion.span 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-white/30 rounded-full"
                    />
                  )}
                </AnimatePresence>
                <Mic size={20} className={cn("relative z-10", isListening && "animate-pulse")} />
              </button>
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-4 bg-[#1a365d] text-white rounded-2xl shadow-xl shadow-[#1a365d]/20 hover:bg-[#f37021] transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-center mt-5 opacity-40 uppercase tracking-[0.2em] font-black flex items-center justify-center gap-3">
          {t.securityNote}
        </p>
      </div>
    </motion.div>
  );
}
