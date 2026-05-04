import React, { useState } from 'react';
import { 
  LogOut,
  Sparkles,
  LayoutDashboard,
  Bell,
  MoreVertical,
  Sun,
  Moon,
  Globe,
  MessageSquare,
  Trash2,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from './lib/utils';
import { getHybridResponse, SourceType } from './services/hybrid';
import { ChatMessage as GeminiChatMessage } from './services/gemini';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { ConfirmationModal } from './components/ConfirmationModal';

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

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const TRANSLATIONS = {
  en: {
    status: 'GLA Assistant Online',
    settings: 'Settings',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    chatHistory: 'Chat History',
    currentSession: 'Current Session',
    export: 'Export Chat',
    clear: 'Clear History',
    welcome: 'Welcome back, Scholar!',
    welcomeSub: 'I\'m GLA-Mate, your personal university companion. How can I assist you today?',
    officialBadge: 'Official GLA Dataset',
    aiBadge: 'AI Generated Response',
    computing: 'Computing Hybrid Intelligence...',
    botTyping: 'Bot is typing...',
    inputPlaceholder: 'Type your question here...',
    securityNote: 'Authenticated Session • GLA University Secure Portal',
    clearConfirm: 'Clear all messages?',
    dashboard: 'Dashboard',
    support: 'AI Support',
    faqs: 'Quick FAQs',
    newChat: 'New Chat',
    pastSessions: 'Past Sessions',
    stopGenerating: 'Stop Generating',
    deepResearch: 'Deep Research',
    thinking: 'Thinking...',
    createImage: 'Create Image',
    camera: 'Camera',
    fileTypeNotSupported: 'This file type is not directly readable, but I can see its metadata.',
    universityHighlights: 'Institution Highlights',
    excellenceTitle: 'A Legacy of Excellence',
    excellenceDesc: "At GLA University, we don't just provide degrees; we craft futures. Being the first private university in Uttar Pradesh to be awarded NAAC 'A+' Grade, we stand as a beacon of academic brilliance.",
    naacBadge: "NAAC 'A+' Accredited",
    naacLabel: 'Highest Honor',
    feelDifference: 'Feel The Difference With Us',
    leadingUni: "INDIA'S LEADING PRIVATE UNIVERSITY",
    studentStrength: 'Student Strength',
    hostelers: 'Hostelers',
    courses: 'Courses',
    studentClubs: 'Student Clubs',
    popularClubs: 'Popular Student Clubs',
    clubDesc: 'There are several clubs that students can be a member of, take membership in order to be part of the cultural landscape of the University.',
    examAcademics: 'Exam, Academics and Updates',
    examUpdates: 'EXAMINATION UPDATES',
    photoGallery: 'PHOTO GALLERY',
    researchUpdates: 'RESEARCH UPDATES',
    upcomingActivities: 'Upcoming Activities',
    placementActivity: 'Placement Activity',
    upcomingClubEvents: 'Upcoming Club Events',
    viewAll: 'View All',
    universityCoursesOffered: 'UNIVERSITY COURSES OFFERED',
    findPrograms: 'Find the list of various program running in GLA University.',
    viewCourses: 'View Courses',
    statsVibrantCampus: 'Vibrant Campus',
    statsCampusDesc: 'State-of-the-art green campus in Mathura.',
    statsStudentCommunity: 'Student Community',
    statsStudentDesc: 'Diverse and driven scholars from across India.',
    statsExpertFaculty: 'Expert Faculty',
    statsFacultyDesc: '300+ PhD holders leading academic research.',
    statsPlacements: 'Placements 2025',
    statsPlacementsDesc: 'Job offers at top global firms like Amazon & Microsoft.',
  },
  hi: {
    status: 'जीएलए सहायक ऑनलाइन',
    settings: 'सेटिंग्स',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    chatHistory: 'चैट इतिहास',
    currentSession: 'वर्तमान सत्र',
    export: 'चैट निर्यात करें',
    clear: 'इतिहास साफ करें',
    welcome: 'स्वागत है, छात्र!',
    welcomeSub: 'मेरा नाम जीएलए-मेट है, आपका व्यक्तिगत विश्वविद्यालय साथी। आज मैं आपकी कैसे मदद कर सकता हूँ?',
    officialBadge: 'आधिकारिक जीएलए डेटासेट',
    aiBadge: 'एआई जनित प्रतिक्रिया',
    computing: 'हाइब्रिड इंटेलिजेंस की गणना कर रहा है...',
    botTyping: 'बॉट टाइप कर रहा है...',
    inputPlaceholder: 'अपना प्रश्न यहाँ लिखें...',
    securityNote: 'प्रमाणित सत्र • जीएलए विश्वविद्यालय सुरक्षित पोर्टल',
    clearConfirm: 'सभी संदेश साफ़ करें?',
    dashboard: 'डैशबोर्ड',
    support: 'एआई सहायता',
    faqs: 'त्वरित प्रश्न',
    newChat: 'नया चैट',
    pastSessions: 'पिछले सत्र',
    stopGenerating: 'प्रतिक्रिया रोकें',
    deepResearch: 'गहन शोध',
    thinking: 'सोच रहे हैं...',
    createImage: 'छवि बनाएं',
    camera: 'कैमरा',
    fileTypeNotSupported: 'यह फ़ाइल प्रकार सीधे पढ़ने योग्य नहीं है, लेकिन मैं इसका मेटाडेटा देख सकता हूँ।',
    universityHighlights: 'संस्थान की मुख्य विशेषताएं',
    excellenceTitle: 'उत्कृष्टता की विरासत',
    excellenceDesc: "जीएलए विश्वविद्यालय में, हम केवल डिग्री प्रदान नहीं करते हैं; हम भविष्य गढ़ते हैं। उत्तर प्रदेश में एनएएसी 'ए+' ग्रेड से सम्मानित होने वाला पहला निजी विश्वविद्यालय होने के नाते, हम शैक्षणिक प्रतिभा के प्रतीक के रूप में खड़े हैं।",
    naacBadge: "एनएएसी 'ए+' मान्यता प्राप्त",
    naacLabel: 'सर्वोच्च सम्मान',
    feelDifference: 'हमारे साथ अंतर महसूस करें',
    leadingUni: "भारत का अग्रणी निजी विश्वविद्यालय",
    studentStrength: 'छात्र शक्ति',
    hostelers: 'छात्रावास के छात्र',
    courses: 'कोर्स',
    studentClubs: 'छात्र क्लब',
    popularClubs: 'लोकप्रिय छात्र क्लब',
    clubDesc: 'विश्वविद्यालय के सांस्कृतिक परिदृश्य का हिस्सा बनने के लिए छात्र कई क्लबों के सदस्य बन सकते हैं।',
    examAcademics: 'परीक्षा, अकादमिक और अपडेट',
    examUpdates: 'परीक्षा अपडेट',
    photoGallery: 'फोटो गैलरी',
    researchUpdates: 'अनुसंधान अपडेट',
    upcomingActivities: 'आगामी गतिविधियाँ',
    placementActivity: 'प्लेसमेंट गतिविधि',
    upcomingClubEvents: 'आगामी क्लब कार्यक्रम',
    viewAll: 'सभी देखें',
    universityCoursesOffered: 'विश्वविद्यालय द्वारा पेश किए गए पाठ्यक्रम',
    findPrograms: 'जीएलए विश्वविद्यालय में चल रहे विभिन्न कार्यक्रमों की सूची खोजें।',
    viewCourses: 'कोर्स देखें',
    statsVibrantCampus: 'जीवंत परिसर',
    statsCampusDesc: 'मथुरा में अत्याधुनिक हरित परिसर।',
    statsStudentCommunity: 'छात्र समुदाय',
    statsStudentDesc: 'पूरे भारत से विविध और प्रेरित विद्वान।',
    statsExpertFaculty: 'विशेषज्ञ संकाय',
    statsFacultyDesc: 'शैक्षणिक अनुसंधान का नेतृत्व करने वाले 300+ पीएचडी धारक।',
    statsPlacements: 'प्लेसमेंट 2025',
    statsPlacementsDesc: 'अमेज़न और माइक्रोसॉफ्ट जैसी शीर्ष वैश्विक फर्मों में नौकरी के प्रस्ताव।',
  }
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [rollNo, setRollNo] = useState('');
  const [activeView, setActiveView] = useState<'dashboard' | 'chat'>('chat');
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'initial', title: 'New Conversation', messages: [], timestamp: new Date() }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('initial');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  
  const t = TRANSLATIONS[language];
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;

  // Load chat history from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('gla_chat_sessions');
    const savedActiveId = localStorage.getItem('gla_active_session_id');
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed.map((s: any) => ({
          ...s,
          timestamp: new Date(s.timestamp),
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        })));
        
        if (savedActiveId && parsed.find((s: any) => s.id === savedActiveId)) {
          setActiveSessionId(savedActiveId);
        } else if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        }
      } catch (e) {
        console.error("Error loading chat history:", e);
      }
    }
  }, []);

  // Save chat history to localStorage
  React.useEffect(() => {
    localStorage.setItem('gla_chat_sessions', JSON.stringify(sessions));
    localStorage.setItem('gla_active_session_id', activeSessionId);
  }, [sessions, activeSessionId]);

  // Helper to update current session messages
  const setMessages = (updater: Message[] | ((prev: Message[]) => Message[])) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const nextMessages = typeof updater === 'function' ? updater(s.messages) : updater;
        // Auto-update title based on first user message
        let nextTitle = s.title;
        if (s.title === 'New Conversation' || s.title === 'नया चैट') {
          const firstUserMsg = nextMessages.find(m => m.role === 'user');
          if (firstUserMsg) {
            nextTitle = firstUserMsg.text.substring(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
          }
        }
        return { ...s, messages: nextMessages, title: nextTitle, timestamp: new Date() };
      }
      return s;
    }));
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setSessions(prev => [
      { id: newId, title: language === 'en' ? 'New Conversation' : 'नया चैट', messages: [], timestamp: new Date() },
      ...prev
    ]);
    setActiveSessionId(newId);
    setActiveView('chat');
  };

  const handleLogin = (roll: string) => {
    setRollNo(roll);
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRollNo('');
    setActiveView('chat');
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSend = async (text: string = input, attachment?: GeminiChatMessage['parts'][0]) => {
    if (!text.trim() && !attachment) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text || (attachment ? `[Sent an attachment]` : ''),
      role: 'user',
      timestamp: new Date(),
      imageUrl: attachment?.inlineData ? `data:${attachment.inlineData.mimeType};base64,${attachment.inlineData.data}` : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    const history: GeminiChatMessage[] = messages.map(m => {
      const parts: GeminiChatMessage['parts'] = [{ text: m.text }];
      if (m.imageUrl && m.imageUrl.startsWith('data:')) {
        const [meta, data] = m.imageUrl.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        parts.push({ inlineData: { mimeType, data } });
      }
      return {
        role: m.role === 'user' ? 'user' : 'model',
        parts
      };
    });

    try {
      const response = await getHybridResponse(text, history, {
        signal: abortControllerRef.current.signal,
        attachment
      });
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        role: 'bot',
        timestamp: new Date(),
        source: response.source,
        feedback: null,
        imageUrl: response.imageData || undefined,
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Generation stopped by user');
      } else {
        console.error("Error getting response:", error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'hi-IN';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, feedback: m.feedback === type ? null : type } : m
    ));
  };

  const exportChat = () => {
    const chatContent = messages.map(m => 
      `[${format(m.timestamp, 'HH:mm')}] ${m.role.toUpperCase()}: ${m.text}`
    ).join('\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gla_chat_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
  };

  if (showLogin) {
    return <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} />;
  }

  return (
    <div className={cn(
      "flex h-screen w-full transition-colors duration-300",
      isDarkMode ? "bg-zinc-950 text-zinc-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className={cn(
          "h-full border-r overflow-hidden relative flex flex-col",
          isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-[#1a365d] text-white border-[#1a365d]"
        )}
      >
        <div className={cn(
          "p-6 border-b flex items-center gap-3",
          isDarkMode ? "border-zinc-800" : "border-white/10"
        )}>
          <div className="w-10 h-10 rounded-xl bg-[#f37021] flex items-center justify-center text-white font-bold shadow-lg shadow-[#f37021]/20">
            GLA
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">GLA-Mate</h1>
            <p className={cn("text-xs", isDarkMode ? "opacity-50" : "text-white/60")}>v2.0 Scholar AI</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
          <div className="space-y-1">
            <label className={cn("text-[10px] uppercase tracking-wider font-semibold mb-2 block", isDarkMode ? "opacity-40" : "text-white/40")}>Navigation</label>
            <button 
              onClick={() => setActiveView('dashboard')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                activeView === 'dashboard' 
                  ? "bg-[#f37021] text-white shadow-lg shadow-[#f37021]/20" 
                  : isDarkMode ? "hover:bg-zinc-800" : "hover:bg-white/10"
              )}
            >
              <LayoutDashboard size={18} /> {t.dashboard}
            </button>
            <button 
              onClick={() => setActiveView('chat')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                activeView === 'chat' 
                  ? "bg-[#f37021] text-white shadow-lg shadow-[#f37021]/20" 
                  : isDarkMode ? "hover:bg-zinc-800" : "hover:bg-white/10"
              )}
            >
              <Sparkles size={18} /> {t.support}
            </button>
          </div>

          <div>
            <label className={cn("text-[10px] uppercase tracking-wider font-semibold mb-3 block", isDarkMode ? "opacity-40" : "text-white/40")}>{t.settings}</label>
            <div className="space-y-2">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm", isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-white/10")}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                {isDarkMode ? t.lightMode : t.darkMode}
              </button>
              <div className={cn("flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm group", isDarkMode ? "hover:bg-zinc-800/50" : "hover:bg-white/10")}>
                <Globe size={18} />
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                  className="bg-transparent outline-none flex-1 cursor-pointer dark:text-inherit text-white"
                >
                  <option value="en" className="text-black text-sm">English</option>
                  <option value="hi" className="text-black text-sm">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>
          </div>

          {activeView === 'chat' && (
            <div className="space-y-4">
              <button 
                onClick={handleNewChat}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold border-2 border-dashed",
                  isDarkMode 
                    ? "border-zinc-800 hover:border-[#f37021] hover:bg-[#f37021]/5 text-zinc-400 hover:text-white" 
                    : "border-white/20 hover:border-white hover:bg-white/10 text-white/70 hover:text-white"
                )}
              >
                <Plus size={20} /> {t.newChat}
              </button>

              <div className="space-y-4">
                <div>
                  <label className={cn("text-[10px] uppercase tracking-wider font-semibold mb-3 block", isDarkMode ? "opacity-40" : "text-white/40")}>{t.pastSessions}</label>
                  <div className="space-y-1 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                    {sessions.map((session) => (
                      <div key={session.id} className="group relative">
                        <button 
                          onClick={() => {
                            setActiveSessionId(session.id);
                            setActiveView('chat');
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-lg font-medium text-xs flex items-center gap-3 transition-all truncate pr-10 relative group-hover:translate-x-1",
                            activeSessionId === session.id
                              ? isDarkMode 
                                ? "bg-[#f37021]/20 text-[#f37021] shadow-[inset_0_0_0_1px_rgba(243,112,33,0.3)]" 
                                : "bg-white/20 text-white shadow-inner"
                              : isDarkMode 
                                ? "text-zinc-500 hover:bg-zinc-900" 
                                : "text-white/60 hover:bg-white/10"
                          )}
                        >
                          {activeSessionId === session.id && (
                            <motion.div 
                              layoutId="activeSessionIndicator"
                              className="absolute left-0 w-1 h-5 bg-[#f37021] rounded-r-full"
                            />
                          )}
                          <MessageSquare size={14} className={cn("flex-none shrink-0", activeSessionId === session.id ? "text-[#f37021]" : "opacity-40")} /> 
                          <span className={cn("flex-1 truncate", activeSessionId === session.id && "font-bold")}>{session.title}</span>
                        </button>
                        
                        {sessions.length > 1 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSessions(prev => {
                                const next = prev.filter(s => s.id !== session.id);
                                if (activeSessionId === session.id) setActiveSessionId(next[0].id);
                                return next;
                              });
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-40 hover:opacity-100 hover:text-rose-500 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {messages.length > 0 && (
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-rose-300 hover:bg-rose-500/10",
                    isDarkMode && "text-rose-500"
                  )}
                >
                  <Trash2 size={18} /> {t.clear}
                </button>
              )}
            </div>
          )}
        </div>

        <div className={cn("p-4 border-t space-y-2", isDarkMode ? "border-zinc-800" : "border-white/10")}>
          {isAuthenticated ? (
            <button 
              onClick={handleLogout}
              className={cn("w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-colors text-sm font-medium", isDarkMode ? "text-rose-500 hover:bg-rose-500/10" : "text-rose-300 hover:bg-white/10")}
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className={cn("w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all text-sm font-bold bg-[#f37021] text-white hover:bg-[#d65f1a] shadow-lg shadow-[#f37021]/20")}
            >
              <LogOut size={16} className="rotate-180" /> Student Login
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Top Navbar */}
        <header className={cn(
          "h-16 border-b flex items-center justify-between px-6 backdrop-blur-md sticky top-0 z-20",
          isDarkMode ? "border-zinc-800 bg-zinc-950/50" : "border-zinc-200 bg-white/70"
        )}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <MoreVertical size={20} className="rotate-90" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-[#1a365d] dark:text-zinc-400 md:block hidden tracking-wide uppercase">{t.status}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 relative">
               <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors relative"
               >
                 <Bell size={20} className="text-[#1a365d] dark:text-zinc-400" />
                 <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-950" />
               </button>

               <AnimatePresence>
                 {showNotifications && (
                   <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={cn(
                      "absolute top-full right-0 mt-2 w-80 rounded-2xl shadow-2xl border p-4 z-50",
                      isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
                    )}
                   >
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="font-bold text-sm">Notifications</h3>
                       <button onClick={() => setShowNotifications(false)} className="text-[10px] uppercase font-bold opacity-40 hover:opacity-100">Clear</button>
                     </div>
                     <div className="space-y-3">
                       {[
                         { title: 'New Event', msg: 'Cultural Fest registrations are open!', time: '2m ago', icon: '🎨' },
                         { title: 'Exam Update', msg: 'Mid-Sem schedule has been uploaded.', time: '1h ago', icon: '📝' },
                         { title: 'Fee Reminder', msg: 'Last date for bus fee is tomorrow.', time: '3h ago', icon: '💰' }
                       ].map((n, i) => (
                         <div key={i} className="flex gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                           <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">{n.icon}</div>
                           <div className="flex-1">
                             <p className="text-xs font-bold leading-none mb-1">{n.title}</p>
                             <p className="text-[10px] opacity-60 leading-tight">{n.msg}</p>
                             <p className="text-[8px] opacity-30 mt-1 uppercase font-bold">{n.time}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="w-8 h-8 rounded-full bg-[#1a365d] text-white flex items-center justify-center text-xs font-bold border border-white/20">
                 {rollNo.substring(0, 2).toUpperCase() || 'SK'}
               </div>
             </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === 'dashboard' ? (
            <Dashboard 
              isAuthenticated={isAuthenticated}
              onLoginClick={() => setShowLogin(true)}
              rollNo={rollNo} 
              isDarkMode={isDarkMode} 
              onStartChat={(suggestion) => {
                setActiveView('chat');
                if (suggestion) setTimeout(() => handleSend(suggestion), 500);
              }}
              translations={t}
            />
          ) : (
            <ChatInterface 
              messages={messages}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              isLoading={isLoading}
              isDarkMode={isDarkMode}
              isListening={isListening}
              handleStop={handleStop}
              handleFeedback={handleFeedback}
              handleVoiceInput={handleVoiceInput}
              exportChat={exportChat}
              translations={t}
            />
          )}
        </AnimatePresence>

        <ConfirmationModal 
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={handleClearChat}
          title={t.clearConfirm}
          message="This will permanently delete all messages in the current session. This action cannot be undone."
          confirmText="Clear All"
          cancelText="Keep Chat"
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
}
