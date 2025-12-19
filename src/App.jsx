import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; 
import { syllabusData } from './syllabusData'; 
import QuizPage from './QuizPage';
import MistakesPage from './pages/MistakesPage';
import FlashcardPage from './pages/FlashcardPage'; 
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LeaderboardPage from './pages/LeaderboardPage';
import HistoryPage from './pages/HistoryPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import SEO from './components/SEO'; 
import { 
  BookOpen, Search, Youtube, FileText, ChevronDown, 
  BrainCircuit, Github, X, RefreshCcw, AlertOctagon, LayoutGrid, User
} from 'lucide-react';

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    h1, h2, h3, h4, h5, h6, .font-heading {
      font-family: 'Outfit', sans-serif;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1; 
    }
    ::-webkit-scrollbar-thumb {
      background: #c7c7c7; 
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8; 
    }
  `}</style>
);

// --- SECURITY COMPONENT ---
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  // Show nothing or a spinner while checking auth status
  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-600 font-bold">Loading user data...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// --- HELPER COMPONENTS ---
// (ResourceButton, SubjectCard, TopicItem, SectionAccordion remain unchanged from before)
const ResourceButton = ({ type, topic, compact = false }) => {
  const navigate = useNavigate();
  const searchQuery = `${topic} study material`; 

  let url = "";
  let IconComp = null;
  let label = "";
  let colorClass = "";
  let ariaLabel = "";

  if (type === "youtube") {
    url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery + " lectures")}`;
    IconComp = Youtube;
    label = "Watch";
    colorClass = "text-red-600 bg-red-50 hover:bg-red-100 border-red-200";
  } else if (type === "google") {
    url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + " notes pdf")}`;
    IconComp = Search;
    label = "Search";
    colorClass = "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200";
  } else if (type === "notes") {
    url = `https://www.google.com/search?q=${encodeURIComponent(topic + " formula sheet filetype:pdf")}`;
    IconComp = FileText;
    label = "PDF";
    colorClass = "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200";
  } else if (type === "quiz") {
    IconComp = BrainCircuit;
    label = "Quiz";
    colorClass = "text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200";
  } else if (type === "flashcard") {
    IconComp = LayoutGrid;
    label = "Flashcards";
    colorClass = "text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-200";
  }

  const handleClick = (e) => {
    e.stopPropagation();
    if (type === 'quiz') navigate(`/quiz/${encodeURIComponent(topic)}`);
    if (type === 'flashcard') navigate(`/flashcards/${encodeURIComponent(topic)}`);
  };

  if (compact) {
    if (type === 'quiz' || type === 'flashcard') {
      return <button onClick={handleClick} className={`p-2 rounded-xl transition-all hover:scale-110 ${colorClass.replace('bg-', 'hover:bg-').split(' ')[0]} hover:bg-opacity-10`}><IconComp className="w-4 h-4" /></button>
    }
    return <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`p-2 rounded-xl transition-all hover:scale-110 ${colorClass.replace('bg-', 'hover:bg-').split(' ')[0]} hover:bg-opacity-10`}><IconComp className="w-4 h-4" /></a>;
  }

  if (type === "quiz" || type === "flashcard") {
    return <button onClick={handleClick} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-sm ${colorClass}`}><IconComp className="w-4 h-4" /><span className="hidden sm:inline">{label}</span></button>;
  }

  return <a href={url} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-sm ${colorClass}`}><IconComp className="w-4 h-4" /><span className="hidden sm:inline">{label}</span></a>;
};

const SubjectCard = ({ subjectKey, subject, isActive, onClick }) => {
  const IconComponent = subject.icon || BookOpen;
  return (
    <button onClick={() => onClick(subjectKey)} className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 mb-2 ${isActive ? 'bg-white shadow-lg shadow-indigo-100 ring-1 ring-indigo-50 text-gray-900 scale-[1.02]' : 'hover:bg-white hover:shadow-md text-gray-600 hover:text-gray-900'}`}>
      <div className={`p-2.5 rounded-xl transition-colors ${isActive ? subject.bgColor + ' ' + subject.color : 'bg-gray-100 text-gray-500'}`}><IconComponent className="w-5 h-5" /></div>
      <span className="font-bold text-sm tracking-wide text-left">{subject.title}</span>
    </button>
  );
};

const TopicItem = ({ topic }) => (
  <article className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-300 gap-4 group">
    <div className="flex items-start gap-4"><div className="mt-2.5 min-w-[8px] h-[8px] rounded-full bg-indigo-200 group-hover:bg-indigo-500 transition-colors" /><h4 className="text-gray-700 font-semibold leading-relaxed text-[15px] group-hover:text-gray-900">{topic}</h4></div>
    <div className="flex items-center gap-2 pl-6 sm:pl-0 opacity-80 group-hover:opacity-100 transition-opacity">
      <ResourceButton type="youtube" topic={topic} />
      <ResourceButton type="notes" topic={topic} />
      <ResourceButton type="google" topic={topic} />
      <ResourceButton type="flashcard" topic={topic} />
      <ResourceButton type="quiz" topic={topic} />
    </div>
  </article>
);

const SectionAccordion = ({ section, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <section className="mb-4 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-5 cursor-pointer bg-gradient-to-r from-transparent to-transparent hover:to-gray-50 transition-all">
        <div className="flex items-center gap-4"><h3 className="text-lg font-bold text-gray-800 tracking-tight">{section.title}</h3><div className="flex items-center gap-1 ml-2 border-l-2 border-gray-100 pl-4"><ResourceButton type="quiz" topic={section.title} compact={true} /></div></div>
        <div className={`p-2 rounded-full bg-gray-50 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'text-gray-400'}`}><ChevronDown className="w-5 h-5" /></div>
      </div>
      {isOpen && <div className="p-4 space-y-3 border-t border-gray-50 bg-gray-50/50">{section.topics.map((topic, idx) => <TopicItem key={idx} topic={topic} />)}</div>}
    </section>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const [activeExamKey, setActiveExamKey] = useState('tgt_non_medical');
  const [activeSubject, setActiveSubject] = useState(null); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth(); // Logout is now handled in Header, so we don't need it here
  const navigate = useNavigate(); 

  const currentExamData = syllabusData[activeExamKey];
  const currentSubjects = currentExamData?.subjects || {};
  
  useEffect(() => {
    const firstSubjectKey = Object.keys(currentSubjects)[0];
    if (firstSubjectKey) { setActiveSubject(firstSubjectKey); }
  }, [activeExamKey]);

  const validActiveSubject = (activeSubject && currentSubjects[activeSubject]) ? activeSubject : Object.keys(currentSubjects)[0];
  const activeSubjectData = currentSubjects[validActiveSubject] || { title: 'Loading...', icon: BookOpen, bgColor: 'bg-gray-100', color: 'text-gray-500', sections: [] };
  const ActiveIcon = activeSubjectData.icon || BookOpen;

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const displayedContent = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const results = [];
      Object.entries(currentSubjects).forEach(([key, subject]) => {
        subject.sections.forEach(section => {
          const matchingTopics = section.topics.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
          const titleMatch = section.title.toLowerCase().includes(searchQuery.toLowerCase());
          if (matchingTopics.length > 0 || titleMatch) { results.push({ ...section, title: `${subject.title}: ${section.title}`, topics: titleMatch ? section.topics : matchingTopics }); }
        });
      });
      return results;
    }
    return activeSubjectData.sections || [];
  }, [activeExamKey, validActiveSubject, searchQuery, currentSubjects]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900">
      <SEO title={searchQuery ? `Search: ${searchQuery}` : `${activeSubjectData.title} - ${currentExamData.label}`} description={`Syllabus for ${currentExamData.label}`} />
      
      {/* Pass toggleSidebar to Header */}
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR */}
          <nav className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-72 lg:block z-30 bg-[#F8FAFC] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'bg-white shadow-2xl p-6 w-80' : ''}`}>
            <div className="flex justify-between items-center lg:hidden mb-8">
               <span className="font-bold text-xl text-gray-900">Menu</span>
               <button onClick={toggleSidebar} className="p-2 bg-gray-100 rounded-full"><X className="w-6 h-6 text-gray-600" /></button>
            </div>

            <div className="mb-6 bg-gray-200 p-1 rounded-xl flex gap-1">
              {Object.entries(syllabusData).map(([key, data]) => (
                <button key={key} onClick={() => { setActiveExamKey(key); setSearchQuery(''); }} className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-200 ${activeExamKey === key ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}>
                  {data.label.replace('HP ', '').replace('EMRS ', '')}
                </button>
              ))}
            </div>

            <button onClick={() => { navigate('/mistakes'); if(window.innerWidth < 1024) setSidebarOpen(false); }} className="w-full mb-6 flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 hover:shadow-orange-300 transform hover:-translate-y-0.5 transition-all group">
              <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform"><AlertOctagon className="w-5 h-5 text-white" /></div>
              <div className="text-left"><span className="block text-xs font-medium text-orange-100 uppercase tracking-wide">Weak Areas</span><span className="block font-bold text-sm">Review Mistakes</span></div>
              <RefreshCcw className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-all" />
            </button>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Subjects</h3>
              {Object.entries(currentSubjects).map(([key, data]) => (
                <SubjectCard key={key} subjectKey={key} subject={data} isActive={validActiveSubject === key && searchQuery === ''} onClick={(key) => { setActiveSubject(key); setSearchQuery(''); if(window.innerWidth < 1024) setSidebarOpen(false); }} />
              ))}
            </div>
            
            {/* SIMPLIFIED SIDEBAR USER CARD (No Logout) */}
            {user ? (
              <div className="mt-8 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                    {user.username?.charAt(0).toUpperCase()}
                 </div>
                 <div>
                    <h4 className="font-bold text-sm text-gray-900">{user.username}</h4>
                    <p className="text-xs text-gray-500 capitalize">{user.role || 'Student'}</p>
                 </div>
              </div>
            ) : (
              <div className="mt-8">
                <button onClick={() => navigate('/login')} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-bold hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                  <User className="w-5 h-5" /> Log In to Save
                </button>
              </div>
            )}
          </nav>
          
          {isSidebarOpen && <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}
          
          <main className="flex-1 min-w-0">
            <div className="relative mb-10 group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" /></div>
               <input type="text" className="block w-full pl-12 pr-4 py-4 border-none rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:shadow-lg transition-all" placeholder={`Search inside ${currentExamData.label}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            <header className="mb-8 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2"><span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded border border-indigo-100 uppercase tracking-wider">{currentExamData.label}</span></div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{searchQuery ? `Results for "${searchQuery}"` : activeSubjectData.title}</h1>
                <p className="text-base text-gray-500 mt-2 font-medium">{searchQuery ? 'Showing matching topics' : 'Select a section below to explore resources'}</p>
              </div>
              {!searchQuery && <div className={`hidden sm:block p-4 rounded-2xl ${activeSubjectData.bgColor} bg-opacity-50`}><div className={activeSubjectData.color}><ActiveIcon className="w-10 h-10" /></div></div>}
            </header>

            <div className="space-y-6 pb-20">
              {displayedContent.length > 0 ? (
                displayedContent.map((section, idx) => <SectionAccordion key={`${section.title}-${idx}`} section={section} defaultOpen={searchQuery !== '' || idx === 0} />)
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
                  <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Search className="w-8 h-8 text-gray-400" /></div>
                  <h3 className="text-xl font-bold text-gray-900">No topics found</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your search query.</p>
                </div>
              )}
            </div>
            
            <footer className="mt-auto py-8 border-t border-gray-200">
              <div className="flex flex-col items-center justify-center gap-3">
                <p className="text-sm font-medium text-gray-500">Contribution made by <span className="font-bold text-gray-900">Chudamani Lawrence</span></p>
                <a href="https://github.com/cmlowerence" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300"><Github className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" /><span className="text-xs font-bold text-gray-600 group-hover:text-indigo-600 transition-colors">github.com/cmlowerence</span></a>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

// --- APP WRAPPER ---
const AppWrapper = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <GlobalStyles />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Dashboard is at root */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/quiz/:topic" element={<QuizPage />} />
            
            {/* Protected Routes */}
            <Route path="/mistakes" element={<ProtectedRoute><MistakesPage /></ProtectedRoute>} />
            <Route path="/flashcards/:topic" element={<ProtectedRoute><FlashcardPage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default AppWrapper;
