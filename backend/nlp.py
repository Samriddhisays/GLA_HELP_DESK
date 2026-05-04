import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download NLTK data if not present
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

class NLPMatcher:
    def __init__(self, csv_path):
        self.df = pd.read_csv(csv_path, quotechar='"')
        self.questions = self.df['Question'].tolist()
        self.answers = self.df['Answer'].tolist()
        
        # Preprocess questions
        self.processed_questions = [self.preprocess_text(q) for q in self.questions]
        
        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = self.vectorizer.fit_transform(self.processed_questions)
    
    def preprocess_text(self, text):
        # Lowercase
        text = text.lower()
        # Remove punctuation
        text = re.sub(r'[^\w\s]', '', text)
        # Tokenize
        tokens = nltk.word_tokenize(text)
        # Remove stopwords
        stop_words = set(stopwords.words('english'))
        tokens = [t for t in tokens if t not in stop_words]
        # Lemmatize
        lemmatizer = WordNetLemmatizer()
        tokens = [lemmatizer.lemmatize(t) for t in tokens]
        return ' '.join(tokens)
    
    def find_best_match(self, user_query, threshold=0.3):
        # Preprocess user query
        processed_query = self.preprocess_text(user_query)
        
        # Vectorize query
        query_vector = self.vectorizer.transform([processed_query])
        
        # Calculate similarities
        similarities = cosine_similarity(query_vector, self.tfidf_matrix).flatten()
        
        # Find best match
        best_idx = similarities.argmax()
        best_score = similarities[best_idx]
        
        if best_score >= threshold:
            return self.answers[best_idx]
        else:
            return "I'm sorry, I couldn't find a relevant answer to your question. Please contact GLA University support for more assistance."

# Initialize matcher
matcher = NLPMatcher('data/ai_chatbot_dataset.csv')

def get_response(user_query):
    return matcher.find_best_match(user_query)