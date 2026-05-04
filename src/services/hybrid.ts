import { getGeminiResponse, ChatMessage, ChatMessagePart } from './gemini';

export type SourceType = 'official' | 'ai';

export interface BotResponse {
  text: string;
  source: SourceType;
  imageData?: string | null;
  suggestions?: string[];
}

interface KnowledgeItem {
  question: string;
  answer: string;
  category: string;
  keywords: string[];
}

// Official GLA University Dataset
const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // Admissions
  {
    question: "What is the admission process for B.Tech?",
    answer: "Admission to B.Tech is based on the GLAET score or CUET/JEE Main ranks followed by counseling.",
    category: "Admissions",
    keywords: ["admission", "process", "b.tech", "btech", "counseling", "glaet", "cuet", "jee"]
  },
  {
    question: "How can I apply for admission?",
    answer: "You can apply online through the official university website by filling the form and paying the application fee.",
    category: "Admissions",
    keywords: ["apply", "admission", "online", "application", "form"]
  },
  {
    question: "What is the eligibility criteria for B.Tech?",
    answer: "Candidates must have passed 10+2 with Physics and Mathematics and at least 50% marks.",
    category: "Admissions",
    keywords: ["eligibility", "criteria", "b.tech", "btech", "marks", "12th"]
  },
  {
    question: "Are there any scholarships available?",
    answer: "Yes, scholarships are based on merit, entrance scores, and category.",
    category: "Admissions",
    keywords: ["scholarship", "merit", "financial", "aid"]
  },
  {
    question: "Can I get direct admission in the second year?",
    answer: "Yes, lateral entry is available for diploma or BSc students.",
    category: "Admissions",
    keywords: ["direct", "admission", "second year", "lateral", "diploma", "bsc"]
  },
  {
    question: "What documents are required during admission?",
    answer: "You need mark sheets, transfer certificate, Aadhaar card, photos, and entrance scorecard.",
    category: "Admissions",
    keywords: ["documents", "required", "marksheets", "aadhaar", "tc"]
  },
  {
    question: "Is there a hostel facility for first-year students?",
    answer: "Yes, separate hostels are available for students.",
    category: "Admissions",
    keywords: ["hostel", "facility", "first year", "stay", "accommodation"]
  },
  {
    question: "What is the last date to apply for admission?",
    answer: "Admission deadlines vary; please check the official website.",
    category: "Admissions",
    keywords: ["last date", "apply", "deadline"]
  },
  {
    question: "Can I cancel my admission and get a refund?",
    answer: "Yes, refunds are processed as per UGC policy.",
    category: "Admissions",
    keywords: ["cancel", "refund", "money back", "withdrawal"]
  },
  {
    question: "Where is the admission cell located?",
    answer: "It is in the main administrative block.",
    category: "Admissions",
    keywords: ["admission cell", "location", "administrative", "office"]
  },
  // Fees
  {
    question: "How do I pay my semester fees?",
    answer: "Fees can be paid online through ERP using UPI, net banking, or cards.",
    category: "Fees",
    keywords: ["pay", "fees", "semester", "online", "erp", "upi"]
  },
  {
    question: "What is the deadline for fee payment?",
    answer: "Fees must be paid before the semester starts.",
    category: "Fees",
    keywords: ["deadline", "payment", "fees", "last date"]
  },
  {
    question: "Is there a fine for late fee payment?",
    answer: "Yes, a late fine is charged per day.",
    category: "Fees",
    keywords: ["fine", "late", "fees", "charges"]
  },
  {
    question: "Can I pay my tuition fees in installments?",
    answer: "Installments are allowed only with special approval.",
    category: "Fees",
    keywords: ["installments", "tuition", "divide", "parts"]
  },
  {
    question: "How can I download my fee receipt?",
    answer: "You can download it from the ERP dashboard.",
    category: "Fees",
    keywords: ["download", "receipt", "fees", "erp"]
  },
  {
    question: "What is the hostel and mess fee structure?",
    answer: "Fees depend on room type and facilities.",
    category: "Fees",
    keywords: ["hostel", "mess", "fees", "structure"]
  },
  {
    question: "Does the college provide documents for an education loan?",
    answer: "Yes, documents like fee letters and bonafide certificates are provided.",
    category: "Fees",
    keywords: ["education loan", "loan", "documents", "bank"]
  },
  {
    question: "Are there any extra charges for bus facilities?",
    answer: "Yes, transport fees are separate.",
    category: "Fees",
    keywords: ["bus", "transport", "charges", "fees"]
  },
  {
    question: "What should I do if my fee payment fails but money is deducted?",
    answer: "Wait 24 hours, then contact finance with proof.",
    category: "Fees",
    keywords: ["payment fails", "failed", "deducted", "issue"]
  },
  {
    question: "Is the caution money refundable?",
    answer: "Yes, it is refundable after course completion.",
    category: "Fees",
    keywords: ["caution money", "refundable", "security"]
  },
  // Exams
  {
    question: "When will the mid-semester exams begin?",
    answer: "Mid-semester exams are usually in the 8th week of the semester.",
    category: "Exams",
    keywords: ["mid-semester", "exam", "begin", "start", "schedule"]
  },
  {
    question: "Where can I download my exam admit card?",
    answer: "The admit card is available on ERP before exams.",
    category: "Exams",
    keywords: ["admit card", "download", "exam", "hall ticket"]
  },
  {
    question: "What is the minimum passing marks criteria?",
    answer: "Minimum 30 percent in the exam and 40 percent overall.",
    category: "Exams",
    keywords: ["passing marks", "criteria", "minimum", "percentage"]
  },
  {
    question: "What happens if I fail an exam?",
    answer: "You will have a backlog and must reappear.",
    category: "Exams",
    keywords: ["fail", "backlog", "reappear", "exam"]
  },
  {
    question: "How do I apply for re-evaluation of my answer sheet?",
    answer: "Apply through ERP with the required fee.",
    category: "Exams",
    keywords: ["re-evaluation", "answer sheet", "check", "marks"]
  },
  {
    question: "Can I miss my internal exams due to medical reasons?",
    answer: "Submit medical proof to the HOD.",
    category: "Exams",
    keywords: ["miss", "internal", "medical", "absent"]
  },
  {
    question: "Where can I find the syllabus for my branch?",
    answer: "Available on the website and LMS.",
    category: "Exams",
    keywords: ["syllabus", "branch", "subjects", "course"]
  },
  {
    question: "When will the final semester results be declared?",
    answer: "Results usually come within 30 to 45 days after the last exam.",
    category: "Exams",
    keywords: ["final semester", "results", "declared", "when"]
  },
  {
    question: "How is my CGPA calculated?",
    answer: "It is based on the credit weighted average of all your grades.",
    category: "Exams",
    keywords: ["cgpa", "calculate", "gpa", "marks"]
  },
  {
    question: "Are calculators allowed in the examination hall?",
    answer: "Non-programmable calculators are allowed.",
    category: "Exams",
    keywords: ["calculators", "allowed", "exam hall"]
  },
  // Timetable & Campus
  {
    question: "Where can I check my class timetable?",
    answer: "The timetable is available on ERP and department notice boards.",
    category: "Timetable",
    keywords: ["timetable", "check", "class", "erp"]
  },
  {
    question: "What are the regular college timings?",
    answer: "College runs in two shifts: from 8:00 AM to 4:00 PM and 10:00 AM to 6:00 PM.",
    category: "Timetable",
    keywords: ["timings", "hours", "college", "shifts"]
  },
  {
    question: "What is the minimum attendance requirement?",
    answer: "Minimum 75 percent attendance is required to appear in exams.",
    category: "Timetable",
    keywords: ["attendance", "requirement", "minimum", "75%"]
  },
  {
    question: "Where can I get the list of college holidays?",
    answer: "It is available in the academic calendar on the university website.",
    category: "Timetable",
    keywords: ["holidays", "list", "calendar", "leave"]
  },
  {
    question: "What are the library timings?",
    answer: "The library is open from 8:00 AM to 8:00 PM.",
    category: "Timetable",
    keywords: ["library", "timings", "hours", "open"]
  },
  {
    question: "Can I change my branch after the first year?",
    answer: "Branch changes depend on CGPA merit and availability of seats.",
    category: "Timetable",
    keywords: ["change", "branch", "first year", "seats"]
  },
  {
    question: "How do I contact my Head of Department (HOD)?",
    answer: "Contact via email or visit during official office hours.",
    category: "Timetable",
    keywords: ["contact", "hod", "department", "meet"]
  },
  {
    question: "I forgot my ERP password; how do I reset it?",
    answer: "Use the 'Forgot Password' option on the ERP login page and verify with OTP.",
    category: "Timetable",
    keywords: ["erp", "password", "reset", "forgot"]
  },
  {
    question: "How do I access the college WiFi?",
    answer: "Login using your Student ID and the password provided on the portal.",
    category: "Timetable",
    keywords: ["wifi", "access", "internet", "login"]
  },
  {
    question: "Are there any extra classes for weak students?",
    answer: "Yes, remedial classes are provided for students requiring extra support.",
    category: "Timetable",
    keywords: ["extra classes", "remedial", "weak", "tutoring"]
  },
  // General
  {
    question: "Where is the college located?",
    answer: "The college is located in Mathura, Uttar Pradesh.",
    category: "General",
    keywords: ["location", "located", "where", "mathura"]
  },
  {
    question: "What is the dress code or uniform policy?",
    answer: "Uniform is required on specific days; please refer to your department guidelines.",
    category: "General",
    keywords: ["dress code", "uniform", "policy", "wear"]
  },
  {
    question: "Does the college have a medical dispensary?",
    answer: "Yes, a 24/7 medical dispensary facility is available on campus.",
    category: "General",
    keywords: ["medical", "dispensary", "doctor", "health"]
  },
  {
    question: "How are the placement records of the college?",
    answer: "The college consistently has very strong placement records with leading MNCs and Fortune 500 companies.",
    category: "General",
    keywords: ["placement", "records", "jobs", "hiring"]
  },
  {
    question: "How can I join student clubs and societies?",
    answer: "You can join through recruitment drives conducted during the start of the semester.",
    category: "General",
    keywords: ["clubs", "societies", "join", "groups"]
  },
  {
    question: "What are the sports facilities available?",
    answer: "Multiple sports facilities including cricket, football, basketball, and indoor games are available.",
    category: "General",
    keywords: ["sports", "facilities", "games", "gym"]
  },
  {
    question: "How do I report an incident of ragging?",
    answer: "Report it immediately to the Anti-Ragging committee or hostal warden. GLA has a zero-tolerance policy.",
    category: "General",
    keywords: ["ragging", "report", "anti-ragging", "safety"]
  },
  {
    question: "I lost my ID card; how do I get a new one?",
    answer: "Apply for a duplicate ID card at the registrar's office after filing a loss report.",
    category: "General",
    keywords: ["lost", "id card", "new", "duplicate"]
  },
  {
    question: "Where is the student grievance cell?",
    answer: "The Student Grievance Cell is located at the DSW (Dean Students Welfare) office.",
    category: "General",
    keywords: ["grievance", "cell", "complaint", "dsw"]
  },
  {
    question: "Can I bring my personal vehicle to campus?",
    answer: "Yes, parking is available for day scholars and staff. Students must follow campus traffic rules.",
    category: "General",
    keywords: ["vehicle", "car", "bike", "parking"]
  }
];

export interface GeminiOptions {
  createImage?: boolean;
  signal?: AbortSignal;
  attachment?: ChatMessagePart;
}

export async function getHybridResponse(
  query: string, 
  history: ChatMessage[], 
  options: GeminiOptions = {}
): Promise<BotResponse> {
  const lowerQuery = query.toLowerCase();
  
  // 1. Check Personal Knowledge Base with better matching
  let bestMatch: KnowledgeItem | null = null;
  let maxScore = 0;

  for (const item of KNOWLEDGE_BASE) {
    let score = 0;
    if (lowerQuery.includes(item.question.toLowerCase())) score += 10;
    const matchCount = item.keywords.filter(k => lowerQuery.includes(k.toLowerCase())).length;
    score += matchCount;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }
  
  // Threshold for "official" match
  if (bestMatch && maxScore >= 2) {
    // Artificial delay to simulate processing
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 600);
      options.signal?.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
    return {
      text: bestMatch.answer,
      source: 'official'
    };
  }

  // 2. Fallback to Gemini AI for conversational or complex queries
  // Note: Gemini SDK doesn't natively support AbortSignal in generateContent easily
  // We wrap it to respect the signal in the app logic
  const aiPromise = getGeminiResponse(query, history, options);
  
  const aiResult = await Promise.race([
    aiPromise,
    new Promise<any>((_, reject) => {
      options.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    })
  ]);

  return {
    text: typeof aiResult === 'string' ? aiResult : aiResult.text,
    source: 'ai',
    imageData: typeof aiResult === 'string' ? undefined : aiResult.imageData,
    suggestions: typeof aiResult === 'string' ? undefined : aiResult.suggestions
  };
}
