# GLA Help Desk - AI Chatbot Assistant

STEP 1 = run npm dev  (IN TERMINAL)
STEP 2 =http://127.0.0.1:5179/ (IN BROWSER COPY PASTE )



A modern, intelligent chatbot application for GLA University students and staff, built with React frontend and Flask NLP backend.

## 🚀 Features

- **Intelligent NLP Chatbot**: Uses TF-IDF vectorization and cosine similarity for accurate question matching
- **Real-time Responses**: Instant answers to university-related queries
- **Modern UI**: Beautiful, responsive interface with dark mode support
- **Multi-category Support**: Handles admissions, fees, exams, timetable, and general queries
- **Voice Input**: Speech-to-text functionality for accessibility
- **Chat History**: Persistent conversation sessions
- **File Upload**: Support for document analysis (simulated)
- **Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack & Architecture

### Frontend (React + Vite)
- **React 19**: Latest React with modern hooks and concurrent features
- **Vite**: Lightning-fast build tool with HMR (Hot Module Replacement)
- **TypeScript**: Type-safe development for better code quality
- **Tailwind CSS v4**: Utility-first CSS framework for rapid styling
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, consistent icons
- **React Markdown**: Rich text rendering for responses

### Backend (Flask + NLP)
- **Flask**: Lightweight Python web framework for API development
- **Flask-CORS**: Cross-origin resource sharing for frontend integration
- **Pandas**: Data manipulation and CSV processing
- **Scikit-learn**: Machine learning library for TF-IDF and similarity calculations
- **NLTK**: Natural Language Toolkit for text preprocessing
  - Stopword removal
  - Lemmatization
  - Tokenization

### Why These Technologies?

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 19** | Frontend framework | Latest features, excellent performance, large ecosystem |
| **Vite** | Build tool | 10-100x faster than alternatives, native ES modules |
| **TypeScript** | Type safety | Prevents runtime errors, better IDE support |
| **Tailwind CSS** | Styling | Rapid development, consistent design system |
| **Flask** | Backend API | Lightweight, Python-native, easy to deploy |
| **Scikit-learn** | NLP/ML | Industry-standard, comprehensive algorithms |
| **NLTK** | Text processing | Specialized NLP tools for preprocessing |
| **TF-IDF + Cosine Similarity** | Text matching | Proven algorithm for semantic similarity |

## 📁 Project Structure

```
GLA_HELP_DESK/
├── public/                          # Static assets
│   ├── vite.svg
│   └── ...
├── src/                             # Frontend React application
│   ├── components/                  # React components
│   │   ├── ChatInterface.tsx       # Main chat UI component
│   │   ├── ConfirmationModal.tsx   # Modal dialogs
│   │   ├── Dashboard.tsx          # Dashboard view
│   │   └── Login.tsx              # Authentication component
│   ├── lib/                        # Utility libraries
│   │   └── utils.ts               # Helper functions
│   ├── services/                   # API and business logic
│   │   ├── gemini.ts              # API client for backend
│   │   └── hybrid.ts              # Chat logic (now calls NLP backend)
│   ├── App.css                    # Global styles
│   ├── App.tsx                    # Main application component
│   ├── index.css                  # Base styles
│   └── main.tsx                   # Application entry point
├── backend/                        # Flask NLP backend
│   ├── data/                      # Dataset storage
│   │   └── ai_chatbot_dataset.csv # Q&A dataset (50+ entries)
│   ├── app.py                     # Flask application
│   ├── nlp.py                     # NLP processing logic
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Backend environment variables
├── dist/                          # Built frontend (generated)
├── node_modules/                  # Frontend dependencies
├── .env                           # Frontend environment variables
├── package.json                   # Frontend dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── eslint.config.js               # ESLint configuration
└── README.md                      # This file
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Git**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GLA_HELP_DESK
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Start the backend server**
   ```bash
   npm run backend
   ```
   Backend will run on `http://localhost:5000`

5. **Start the frontend server** (in a new terminal)
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5179`

6. **Open your browser**
   ```
   http://localhost:5179
   ```

## 💡 Usage

### For Students/Staff
1. **Login** (optional) - Click "Student Login"
2. **Ask Questions** - Type or speak your queries
3. **Get Instant Answers** - AI matches your questions with university information
4. **Browse Suggestions** - Click on suggested questions for quick access

### Sample Questions
- "How do I pay my semester fees?"
- "What is the admission process for B.Tech?"
- "Where can I check my class timetable?"
- "What are the library timings?"
- "How do I apply for scholarships?"

## 🔧 API Documentation

### Backend API

#### POST `/api/chat`
Get chatbot response for a user message.

**Request:**
```json
{
  "message": "How do I pay my semester fees?"
}
```

**Response:**
```json
{
  "response": "Fees can be paid online through ERP using UPI, net banking, or cards."
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

### Frontend Architecture

#### Key Components
- **App.tsx**: Main application with routing and state management
- **ChatInterface.tsx**: Chat UI with message display and input handling
- **Login.tsx**: Authentication interface
- **Dashboard.tsx**: User dashboard with chat history

#### Key Services
- **gemini.ts**: API client for backend communication
- **hybrid.ts**: Chat logic coordinator
- **utils.ts**: Utility functions for styling and formatting

## 🎯 NLP Implementation Details

### Text Preprocessing Pipeline
1. **Lowercasing**: Convert all text to lowercase
2. **Punctuation Removal**: Remove special characters and punctuation
3. **Tokenization**: Split text into individual words
4. **Stopword Removal**: Remove common words (the, a, is, etc.)
5. **Lemmatization**: Reduce words to their base form (running → run)

### Matching Algorithm
1. **TF-IDF Vectorization**: Convert questions to numerical vectors
2. **Cosine Similarity**: Calculate similarity between user query and dataset
3. **Threshold Filtering**: Only return answers above 0.3 similarity score
4. **Fallback Response**: Default message for unmatched queries

### Dataset Structure
- **50+ Q&A pairs** covering university information
- **Categories**: Admissions, Fees, Exams, Timetable, General
- **CSV Format**: Question, Answer, Category, Intent columns

## 🔒 Security & Best Practices

- **Environment Variables**: Sensitive data stored in .env files
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Sanitized user inputs
- **Error Handling**: Graceful error responses
- **Type Safety**: TypeScript for frontend reliability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new frontend code
- Follow ESLint configuration
- Write descriptive commit messages
- Test API endpoints thoroughly
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **GLA University** for the inspiration and dataset
- **Open source community** for the amazing libraries and tools
- **React & Flask communities** for excellent documentation

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact the development team
- Check the troubleshooting section below

## 🔧 Troubleshooting

### Common Issues

**Frontend not loading:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend API errors:**
```bash
# Check if backend is running
curl http://localhost:5000/api/chat -X POST -H "Content-Type: application/json" -d '{"message":"test"}'
```

**NLP not responding:**
- Ensure `ai_chatbot_dataset.csv` is in `backend/data/`
- Check Python dependencies are installed
- Verify NLTK data is downloaded

**Port conflicts:**
- Frontend: Change port in `vite.config.ts`
- Backend: Change port in `backend/app.py`

---

**Built with ❤️ for GLA University Community**
