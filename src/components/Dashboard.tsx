import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  HelpCircle, 
  Search,
  ChevronRight,
  Sparkles,
  Trophy,
  Users,
  Map,
  Award,
  Image as ImageIcon,
  ExternalLink,
  Star,
  Users2,
  Clock,
  ArrowRight,
  Monitor,
  Phone,
  FileText,
  Zap,
  Filter,
  Tag
} from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  isAuthenticated: boolean;
  onLoginClick?: () => void;
  rollNo?: string;
  isDarkMode: boolean;
  onStartChat: (suggestion?: string) => void;
  translations: any;
}

const FAQS = [
  { q: "How to apply for an ID card?", a: "Visit the Registrar's office in Block 1 with your admission slip." },
  { q: "Where is the library located?", a: "The Central Library is in the heart of the campus near the main canteen." },
  { q: "How to check my attendance?", a: "Login to the Student Portal to view your real-time attendance across all subjects." },
  { q: "What is the scholarship process?", a: "General merit scholarships are listed on the official website. For personal eligibility, please login." }
];

const SUGGESTIONS = [
  { label: 'Examination', icon: '📝' },
  { label: 'Fees', icon: '💰' },
  { label: 'Timetable', icon: '📅' },
  { label: 'Admissions', icon: '🎓' },
];

const CAMPUS_IMAGES = [
  { 
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2066&auto=format&fit=crop', 
    title: 'Academic Excellence',
    desc: 'State-of-the-art lecture halls and research labs.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1541339907198-e08759dfc3f0?q=80&w=2070&auto=format&fit=crop', 
    title: 'Vibrant Campus Life',
    desc: '110+ acres of lush green campus in Mathura.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1498243639359-2830a6796a11?q=80&w=2070&auto=format&fit=crop', 
    title: 'Central Library',
    desc: 'Wealth of knowledge with over 150,000+ books.'
  },
  { 
    url: 'https://images.unsplash.com/photo-1523050335456-c38a7047d28c?q=80&w=2070&auto=format&fit=crop', 
    title: 'Innovation Hub',
    desc: 'Nurturing the next generation of entrepreneurs.'
  }
];

const STUDENT_CLUBS = [
  { 
    name: 'CHESS CLUB', 
    icon: '♟️', 
    rating: 4.2, 
    desc: 'The Chess club aims to sharpen intellect and concentration through the timeless strategy game.',
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop'
  },
  { 
    name: 'ENTREPRENEURSHIP CELL', 
    icon: '💡', 
    rating: 4.2, 
    desc: 'The Entrepreneurship Cell (E-Cell) at GLA University, under the GENIE initiative, is driving innovation.',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop'
  },
  { 
    name: 'ATHLETICS CLUB', 
    icon: '🏃', 
    rating: 4.2, 
    desc: 'The Athletics Club of GLA University is dedicated to promoting physical excellence and discipline.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop'
  }
];

const EXAM_UPDATES = [
  { date: '04', month: 'MAY, 2025', title: 'PG END TERM EXAM.', type: 'Upcoming', desc: 'PG Exam Schedule: 04.05.2025-13.05.2025' },
  { date: '07', month: 'MAY, 2025', title: 'UG END TERM EXAM.', type: 'Upcoming', desc: 'UG End Term Examination 2024-25' },
  { date: '07', month: 'MAY, 2025', title: 'END TERM EXAMINATION.', type: 'Upcoming', desc: 'End Term Examinations, All Course-First Semester' }
];

const UNIVERSITY_EVENTS = [
  { id: 1, date: '2025-05-10', title: 'Tech Mahindra Recruitment Drive', category: 'Placement', venue: 'Block 1', time: '10:00 AM' },
  { id: 2, date: '2025-05-12', title: 'Chess Tournament Final', category: 'Sports', venue: 'Auditorium', time: '02:00 PM' },
  { id: 3, date: '2025-05-15', title: 'Workshop on Generative AI', category: 'Workshop', venue: 'Virtual', time: '11:00 AM' },
  { id: 4, date: '2025-05-20', title: 'Cultural Fest: Spandan', category: 'Cultural', venue: 'Main Ground', time: '05:00 PM' },
  { id: 5, date: '2025-05-25', title: 'Entrepreneurship Summit', category: 'Club', venue: 'Seminar Hall 3', time: '09:30 AM' },
  { id: 6, date: '2025-06-05', title: 'Yoga Day Celebration', category: 'Cultural', venue: 'Lawn Area', time: '06:00 AM' },
  { id: 7, date: '2025-06-10', title: 'Annual Alumni Meet', category: 'Alumni', venue: 'Convocational Hall', time: '10:00 AM' },
  { id: 8, date: '2025-05-28', title: 'Coding Hackathon 2025', category: 'Workshop', venue: 'C-Block Lab', time: '09:00 AM' },
];

export function Dashboard({ isAuthenticated, onLoginClick, rollNo, isDarkMode, onStartChat, translations: t }: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  const categories = useMemo(() => ['All', ...new Set(UNIVERSITY_EVENTS.map(e => e.category))], []);
  const months = ['All', 'May', 'June'];

  const filteredEvents = useMemo(() => {
    return UNIVERSITY_EVENTS.filter(event => {
      const categoryMatch = selectedCategory === 'All' || event.category === selectedCategory;
      const eventDate = new Date(event.date);
      const eventMonth = eventDate.toLocaleString('default', { month: 'long' });
      const monthMatch = selectedMonth === 'All' || eventMonth.toLowerCase().includes(selectedMonth.toLowerCase());
      return categoryMatch && monthMatch;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedCategory, selectedMonth]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 no-scrollbar"
    >
      {/* Dashboard Hero */}
      <div className="relative rounded-[3rem] bg-[#1a365d] p-12 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-center gap-12 group min-h-[400px]">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1592280771190-3e2e4d581969?q=80&w=2050&auto=format&fit=crop" 
            alt="Campus Background" 
            className="w-full h-full object-cover opacity-20 scale-105 group-hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a365d] via-[#1a365d]/80 to-transparent" />
        </div>

        <div className="relative z-10 space-y-6 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f37021]/20 border border-[#f37021]/30 text-[#f37021] text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} /> {t.leadingUni}
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-black leading-[1.1] tracking-tight">Welcome to <span className="text-[#f37021]">GLA University</span></h2>
            <p className="text-xl font-bold opacity-90">{t.feelDifference}</p>
          </div>
          
          {/* Quick Stats Circles from website */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {[
              { val: '25K', label: t.studentStrength, color: 'border-sky-500/50' },
              { val: '6K+', label: t.hostelers, color: 'border-emerald-500/50' },
              { val: '153', label: t.courses, color: 'border-[#f37021]/50' },
              { val: '32', label: t.studentClubs, color: 'border-amber-500/50' }
            ].map((s, i) => (
              <div key={i} className={cn("flex flex-col items-center justify-center p-3 rounded-2xl border bg-white/5 backdrop-blur-md", s.color)}>
                <span className="text-xl font-black">{s.val}</span>
                <span className="text-[8px] font-bold uppercase tracking-tighter opacity-70">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
            <button 
              onClick={() => onStartChat()}
              className="bg-[#f37021] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#d95d10] transition-all shadow-xl shadow-[#f37021]/30 flex items-center gap-2"
            >
              Start AI Consultation <ChevronRight size={18} />
            </button>
            {!isAuthenticated && (
              <button 
                onClick={onLoginClick}
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-sm hover:bg-white/20 transition-all shadow-xl"
              >
                Sign In for Full Access
              </button>
            )}
          </div>
        </div>

        <div className="relative z-10 w-56 h-56 md:w-72 md:h-72 flex items-center justify-center">
           <div className="absolute inset-0 bg-white shadow-[0_0_50px_rgba(255,255,255,0.2)] rounded-full backdrop-blur-2xl border border-white/20 overflow-hidden">
             <img 
               src="https://www.gla.ac.in/images/gla-logo.png" 
               alt="GLA Logo" 
               className="w-full h-full object-contain p-6"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = "https://placehold.co/400?text=GLA+Logo";
               }}
             />
           </div>
           <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 border border-dashed border-white/10 rounded-full" 
           />
           <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-8 border border-white/5 rounded-full" 
           />
        </div>
      </div>

      {/* Institution Highlights (GLA Overview) */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b-4 border-[#f37021] pb-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-4xl font-black text-[#1a365d] dark:text-white uppercase tracking-tighter">
              {t.excellenceTitle.split(' ').slice(0, 3).join(' ')} <span className="text-[#f37021]">{t.excellenceTitle.split(' ').slice(3).join(' ')}</span>
            </h3>
            <p className="opacity-70 text-base font-bold max-w-2xl">{t.excellenceDesc}</p>
          </div>
          <div className="px-8 py-4 bg-[#f37021] text-white rounded-3xl flex items-center gap-4 shadow-2xl shadow-[#f37021]/40 transform hover:scale-105 transition-transform shrink-0">
             <Trophy className="text-white" size={32} />
             <div className="text-left">
               <p className="text-xs font-black uppercase tracking-widest opacity-80">{t.naacLabel}</p>
               <p className="text-xl font-black leading-none">{t.naacBadge}</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: t.statsVibrantCampus, 
              value: '110+ Acres', 
              desc: t.statsCampusDesc, 
              icon: Map, 
              color: 'text-emerald-500', 
              bg: 'bg-emerald-500/5' 
            },
            { 
              label: t.statsStudentCommunity, 
              value: '15,000+', 
              desc: t.statsStudentDesc, 
              icon: Users, 
              color: 'text-sky-500', 
              bg: 'bg-sky-500/5' 
            },
            { 
              label: t.statsExpertFaculty, 
              value: '800+', 
              desc: t.statsFacultyDesc, 
              icon: GraduationCap, 
              color: 'text-[#f37021]', 
              bg: 'bg-[#f37021]/5' 
            },
            { 
              label: t.statsPlacements, 
              value: '2500+', 
              desc: t.statsPlacementsDesc, 
              icon: Award, 
              color: 'text-amber-500', 
              bg: 'bg-amber-500/5' 
            }
          ].map((item) => (
            <div key={item.label} className={cn(
              "p-8 rounded-[2rem] border transition-all hover:shadow-2xl hover:-translate-y-1 overflow-hidden relative group",
              isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100 shadow-xl shadow-slate-200/40"
            )}>
              <div className={cn("p-4 rounded-2xl w-fit mb-6 transition-colors", item.bg)}>
                <item.icon size={28} className={item.color} />
              </div>
              <h4 className="text-2xl font-black mb-1">{item.value}</h4>
              <p className="text-xs font-bold text-[#1a365d] dark:text-sky-400 mb-3">{item.label}</p>
              <p className="text-[11px] opacity-50 leading-relaxed font-medium">{item.desc}</p>
              
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-transparent to-zinc-100 dark:to-zinc-800 opacity-50 rounded-full group-hover:scale-110 transition-transform" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative">
        {!isAuthenticated && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-transparent backdrop-blur-[2px] cursor-pointer group" onClick={onLoginClick}>
            <div className="bg-white/90 dark:bg-zinc-900/90 p-4 rounded-2xl shadow-2xl border border-white/20 group-hover:scale-105 transition-transform flex items-center gap-3">
              <span className="text-sm font-bold text-[#1a365d] dark:text-sky-400">Login to unlock your academic stats</span>
              <ChevronRight size={18} className="text-[#f37021]" />
            </div>
          </div>
        )}
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6", !isAuthenticated && "opacity-50 select-none grayscale-[0.5]")}>
          {[
            { label: 'Attendance', value: isAuthenticated ? '82%' : '--%', icon: CheckCircle2, color: 'text-emerald-500' },
            { label: 'CGPA', value: isAuthenticated ? '8.4' : '-.-', icon: GraduationCap, color: 'text-sky-500' },
            { label: 'Active Courses', value: isAuthenticated ? '12' : '0', icon: BookOpen, color: 'text-violet-500' },
            { label: 'Next Exam', value: isAuthenticated ? '12 May' : '--', icon: Calendar, color: 'text-amber-500' }
          ].map((stat) => (
            <div key={stat.label} className={cn(
              "p-6 rounded-3xl transition-all border group hover:scale-[1.02]",
              isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100 shadow-xl shadow-slate-200/50"
            )}>
              <stat.icon className={cn("mb-4", stat.color)} size={24} />
              <p className="text-xs opacity-50 font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Gallery */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <ImageIcon size={24} className="text-[#f37021]" /> Campus Life & Infrastructure
            </h3>
            <p className="text-sm opacity-50 font-medium">Experience the vibrant atmosphere at GLA Mathura.</p>
          </div>
          <button className="text-sm font-bold text-[#f37021] hover:underline flex items-center gap-1">
            View Official Gallery <ExternalLink size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAMPUS_IMAGES.map((img, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative h-72 rounded-[2rem] overflow-hidden border shadow-lg cursor-pointer",
                isDarkMode ? "border-zinc-800" : "border-zinc-100"
              )}
            >
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 opacity-70 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                <h4 className="font-black text-2xl mb-2 drop-shadow-lg">{img.title}</h4>
                <p className="text-xs opacity-90 font-bold leading-relaxed drop-shadow-md">{img.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Student Clubs */}
      <div className="space-y-8">
          <div className="space-y-2 text-center flex-1">
            <h3 className="text-4xl font-black text-[#1a365d] dark:text-sky-400 uppercase tracking-tighter">
              Popular <span className="text-[#f37021]">Student Clubs</span>
            </h3>
            <p className="max-w-2xl mx-auto text-sm text-zinc-600 dark:text-zinc-400 font-bold">
              {t.clubDesc}
            </p>
          </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STUDENT_CLUBS.map((club, idx) => (
            <div key={idx} className={cn(
              "flex flex-col rounded-[2.5rem] overflow-hidden border shadow-sm group transition-all hover:shadow-xl",
              isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100"
            )}>
              <div className="h-56 overflow-hidden relative">
                <img src={club.image} alt={club.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-amber-500 border border-zinc-100 dark:border-zinc-800">
                  <Star size={12} fill="currentColor" /> {club.rating}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <h4 className="font-black text-[#1a365d] dark:text-sky-400">{club.name}</h4>
                <p className="text-xs opacity-50 leading-relaxed min-h-[4rem]">
                  {club.desc}
                </p>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2 bg-[#f37021] text-white text-[10px] font-black uppercase rounded-xl hover:bg-[#d95d10] transition-colors">Details</button>
                  <button className="px-4 py-2 border border-zinc-100 dark:border-zinc-800 text-[10px] font-black uppercase rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Upcoming</button>
                  <button className="px-4 py-2 border border-zinc-100 dark:border-zinc-800 text-[10px] font-black uppercase rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">0 Events</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
            <button className="px-8 py-3 bg-[#1a365d] text-white rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                {t.viewAll} <ArrowRight size={18} />
            </button>
        </div>
      </div>

      {/* Event Calendar section */}
      <div className="space-y-8 bg-zinc-50/50 dark:bg-zinc-900/30 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-4xl font-black text-[#1a365d] dark:text-sky-400 uppercase tracking-tighter">
              Event <span className="text-[#f37021]">Calendar</span>
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-bold">Stay updated with university happenings and club feats.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:border-[#f37021] transition-colors">
                <Filter size={14} className="text-[#f37021]" />
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent border-none text-xs font-bold focus:ring-0 outline-none cursor-pointer text-zinc-900 dark:text-white [&>option]:text-black"
                >
                    {categories.map(cat => <option key={cat} value={cat} className="text-black">{cat} Category</option>)}
                </select>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm hover:border-sky-500 transition-colors">
                <Calendar size={14} className="text-sky-500" />
                <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-transparent border-none text-xs font-bold focus:ring-0 outline-none cursor-pointer text-zinc-900 dark:text-white [&>option]:text-black"
                >
                    {months.map(m => <option key={m} value={m} className="text-black">{m === 'All' ? 'Every' : m} Month</option>)}
                </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={event.id} 
                className={cn(
                  "p-6 rounded-[2rem] border transition-all hover:shadow-xl group relative overflow-hidden",
                  isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100 shadow-sm shadow-slate-200/50"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f37021]/10 flex flex-col items-center justify-center text-[#f37021]">
                    <span className="text-lg font-black leading-none">{event.date.split('-')[2]}</span>
                    <span className="text-[7px] font-black uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1a365d] dark:bg-[#f37021]/10 text-[8px] font-black uppercase tracking-widest flex items-center gap-1 text-white dark:text-[#f37021] border border-transparent dark:border-[#f37021]/20">
                    <Tag size={10} /> {event.category}
                  </span>
                </div>
                
                <h4 className="font-black text-sm mb-3 group-hover:text-[#f37021] transition-colors">{event.title}</h4>
                
                <div className="space-y-2 opacity-100">
                  <div className="flex items-center gap-2 text-[11px] font-black text-zinc-700 dark:text-zinc-300">
                    <Clock size={12} className="text-sky-500" /> {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-black text-zinc-700 dark:text-zinc-300">
                    <Map size={12} className="text-emerald-500" /> {event.venue}
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-16 h-16 bg-[#f37021]/5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto opacity-50">
                <Search size={32} />
              </div>
              <div>
                <p className="font-black text-lg">No events found</p>
                <p className="text-xs opacity-50 font-medium">Try adjusting your filters to see more university activities.</p>
              </div>
              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedMonth('All'); }}
                className="text-[#f37021] text-xs font-black uppercase hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Activities & Placement Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { title: t.upcomingActivities, color: 'bg-emerald-500', icon: Calendar },
            { title: t.placementActivity, color: 'bg-[#f37021]', icon: Award },
            { title: t.upcomingClubEvents, color: 'bg-sky-500', icon: Users2 }
        ].map((item, i) => (
            <div key={i} className={cn("p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden group border", isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100")}>
                <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-4 shadow-xl ring-4 ring-white dark:ring-zinc-800", item.color)}>
                    <item.icon size={36} />
                </div>
                <h4 className="font-extrabold text-base uppercase tracking-tight text-[#1a365d] dark:text-sky-300 mb-2 drop-shadow-sm">{item.title}</h4>
                <button className="text-xs font-black uppercase px-6 py-2 rounded-xl bg-[#f37021] text-white hover:bg-[#d95d10] transition-all shadow-lg shadow-[#f37021]/20">
                  {t.viewAll}
                </button>
                <div className={cn("absolute top-0 right-0 w-16 h-16 opacity-5 blur-xl rounded-full", item.color)} />
            </div>
        ))}
      </div>

      {/* Exam, Academics and Updates */}
      <div className="space-y-10">
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-black text-[#1a365d] dark:text-white uppercase tracking-tighter">
                {t.examAcademics.split(' ')[0]} <span className="text-[#f37021]">{t.examAcademics.split(' ').slice(1).join(' ')}</span>
            </h3>
            <p className="text-xs opacity-40 uppercase tracking-widest font-black">Latest updates related to various activities of examination / academics / research.</p>
          </div>

          <div className="grid grid-cols-1 gap-12">
              <div className="space-y-6 max-w-2xl mx-auto w-full">
                  <h4 className="font-black text-xs border-b-2 border-[#f37021] pb-2 w-fit uppercase tracking-widest flex items-center gap-2">
                      <FileText size={16} /> {t.examUpdates}
                  </h4>
                  <div className="space-y-4">
                      {EXAM_UPDATES.map((u, i) => (
                          <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                              <div className="flex-none w-14 h-14 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex flex-col items-center justify-center text-[#1a365d] dark:text-sky-400">
                                  <span className="text-lg font-black leading-none">{u.date}</span>
                                  <span className="text-[7px] font-black uppercase">{u.month.split(',')[0]}</span>
                              </div>
                              <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-black text-[10px] truncate">{u.title}</h5>
                                      <span className="flex-none px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[6px] font-black uppercase">{u.type}</span>
                                  </div>
                                  <p className="text-[9px] opacity-50 line-clamp-2 leading-tight">{u.desc}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* University Courses Banner */}
      <div className="rounded-[3rem] bg-gradient-to-r from-[#f37021] to-amber-500 p-12 text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-2 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <BookOpen size={24} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tighter uppercase">{t.universityCoursesOffered}</h3>
                  </div>
                  <p className="opacity-80 text-sm font-medium">{t.findPrograms}</p>
              </div>
              <button className="px-10 py-4 bg-white text-[#f37021] rounded-full font-black text-sm uppercase shadow-2xl hover:scale-105 transition-transform">
                  {t.viewCourses}
              </button>
          </div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute -right-20 -bottom-20 w-80 h-80 border-4 border-white/10 rounded-[4rem] pointer-events-none" />
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-zinc-100 dark:border-zinc-800 pt-10">
          <div className="space-y-4">
              <h4 className="font-black text-[#1a365d] dark:text-sky-400 uppercase tracking-widest text-xs">Get In Touch</h4>
              <div className="space-y-3">
                  <div className="flex gap-3 text-xs">
                      <Map className="text-[#f37021] flex-none" size={14} />
                      <p className="opacity-50 font-medium">17km Stone, NH-19, Mathura-Delhi Road, P.O. Chaumuhan, Mathura-281406 (U.P.)</p>
                  </div>
                  <div className="flex gap-3 text-xs">
                      <Phone className="text-[#f37021] flex-none" size={14} />
                      <p className="opacity-50 font-medium">+91-5662-250900</p>
                  </div>
                  <div className="flex gap-3 text-xs">
                      <Monitor className="text-[#f37021] flex-none" size={14} />
                      <p className="opacity-50 font-medium">admission@gla.ac.in</p>
                  </div>
              </div>
          </div>

          <div className="space-y-4">
              <h4 className="font-black text-[#1a365d] dark:text-sky-400 uppercase tracking-widest text-xs">Follow Us</h4>
              <div className="flex gap-4">
                  {[
                    { icon: ExternalLink, url: 'https://www.facebook.com/glauniversity/', label: 'Facebook' },
                    { icon: ExternalLink, url: 'https://twitter.com/gla_university', label: 'Twitter' },
                    { icon: ExternalLink, url: 'https://www.instagram.com/gla_university/', label: 'Instagram' },
                    { icon: ExternalLink, url: 'https://www.youtube.com/user/glauniversity', label: 'YouTube' },
                    { icon: ExternalLink, url: 'https://www.linkedin.com/school/gla-university/', label: 'LinkedIn' }
                  ].map((s, i) => (
                      <a 
                        key={i} 
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#f37021] hover:border-[#f37021] transition-all"
                      >
                          <s.icon size={18} />
                      </a>
                  ))}
              </div>
          </div>

          <div className="space-y-4 font-black">
              <h4 className="text-[#1a365d] dark:text-sky-400 uppercase tracking-widest text-xs">Mobile App</h4>
              <div className="flex gap-4 flex-wrap">
                  <div className="px-4 py-2 bg-black text-white rounded-xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
                      <Monitor size={16} />
                      <div className="text-[8px] leading-tight flex flex-col">
                          <span className="opacity-60 font-medium">Get it on</span>
                          <span className="font-bold">Play Store</span>
                      </div>
                  </div>
                  <div className="px-4 py-2 bg-black text-white rounded-xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
                      <Monitor size={16} />
                      <div className="text-[8px] leading-tight flex flex-col">
                          <span className="opacity-60 font-medium">Download on</span>
                          <span className="font-bold">App Store</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <Sparkles size={24} className="text-amber-500" /> Platform Prowess
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              title: 'Mobile Ready', 
              desc: 'Fully responsive PWA architecture for on-the-go access.', 
              icon: '📱', 
              status: 'Active',
              color: 'bg-emerald-50 text-emerald-600'
            },
            { 
              title: 'Voice AI', 
              desc: 'Hands-free assistance with real-time speech recognition.', 
              icon: '🎙️', 
              status: 'Active',
              color: 'bg-indigo-50 text-indigo-600'
            },
            { 
              title: 'Multilingual', 
              desc: 'Native support for English & Hindi queries.', 
              icon: '🌐', 
              status: 'Active',
              color: 'bg-rose-50 text-rose-600'
            },
          ].map((feat) => (
            <div key={feat.title} className={cn(
              "p-6 rounded-3xl border transition-all hover:shadow-lg",
              isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100"
            )}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">{feat.icon}</span>
                <span className={cn("text-[10px] font-black uppercase px-2 py-1 rounded-md", feat.color)}>
                  {feat.status}
                </span>
              </div>
              <h4 className="font-bold text-sm mb-1">{feat.title}</h4>
              <p className="text-xs opacity-50 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs & suggestions split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
           <h3 className="text-xl font-bold flex items-center gap-3">
             <HelpCircle size={24} className="text-[#f37021]" /> {t.faqs}
           </h3>
           <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <details key={idx} className={cn(
                  "group rounded-2xl border transition-all overflow-hidden",
                  isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100"
                )}>
                  <summary className="p-4 cursor-pointer flex justify-between items-center font-semibold text-sm">
                    {faq.q}
                    <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="p-4 pt-0 text-sm opacity-60 leading-relaxed border-t border-zinc-50 dark:border-zinc-800">
                     {faq.a}
                  </div>
              </details>
              ))}
           </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Search size={24} className="text-[#1a365d] dark:text-sky-400" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {SUGGESTIONS.map((s) => (
              <button 
                key={s.label}
                onClick={() => onStartChat(s.label)}
                className={cn(
                  "p-6 rounded-3xl border text-left space-y-2 transition-all hover:border-[#f37021] group",
                  isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100"
                )}
              >
                 <span className="text-2xl block group-hover:scale-110 transition-transform">{s.icon}</span>
                 <span className="text-sm font-bold block">{s.label} Request</span>
                 <p className="text-[10px] opacity-40 uppercase tracking-wider">Ask AI Now</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
