import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { syllabusData } from './syllabusData';
import QuizPage from './QuizPage'; // Import the new page
import NotFound from './pages/NotFound';
import { 
  BookOpen, 
  Search, 
  Youtube, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X, 
  ExternalLink, 
  Atom, 
  FlaskConical, 
  Calculator, 
  GraduationCap, 
  Globe,
  BrainCircuit,
  Github
} from 'lucide-react';

const IconMap = {
  FlaskConical,
  Atom,
  Calculator,
  GraduationCap,
  Globe
};

// --- NAVIGATION WRAPPER ---
// This is the new root component that sets up routing
const AppWrapper = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/quiz/:topic" element={<QuizPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// --- ORIGINAL APP COMPONENTS (Modified) ---

const Header = ({ toggleSidebar }) => (
  <header className="bg-white shadow-sm border-b sticky top-0 z-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100 lg:hidden">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              TGT Explorer
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:flex items-center gap-1">
             NCERT Books <ExternalLink className="w-3 h-3"/>
           </a>
        </div>
      </div>
    </div>
  </header>
);

const SubjectCard = ({ subjectKey, subject, isActive, onClick }) => {
  const IconComponent = IconMap[subject.iconName] || BookOpen;
  
  return (
    <button
      onClick={() => onClick(subjectKey)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 mb-2
        ${isActive 
          ? 'bg-white shadow-md border-l-4 border-indigo-500 text-gray-900' 
          : 'hover:bg-gray-100 text-gray-600 hover:pl-4'
        }`}
    >
      <div className={`p-2 rounded-lg ${isActive ? subject.bgColor + ' ' + subject.color : 'bg-gray-200 text-gray-500'}`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <span className="font-semibold">{subject.title}</span>
    </button>
  );
};

// Updated ResourceButton to handle Routing for Quiz
const ResourceButton = ({ type, topic, compact = false }) => {
  const navigate = useNavigate();
  let url = "";
  let IconComp = null;
  let label = "";
  let colorClass = "";
  
  const searchQuery = `TGT Non Medical ${topic}`;

  if (type === "youtube") {
    url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    IconComp = Youtube;
    label = "Watch";
    colorClass = "text-red-600 bg-red-50 hover:bg-red-100 border-red-200";
  } else if (type === "google") {
    url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + " study material pdf")}`;
    IconComp = Search;
    label = "Search";
    colorClass = "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200";
  } else if (type === "notes") {
    url = `https://nptel.ac.in/courses?search=${encodeURIComponent(topic)}`;
    IconComp = FileText;
    label = "NPTEL";
    colorClass = "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200";
  } else if (type === "quiz") {
    // QUIZ Logic
    IconComp = BrainCircuit;
    label = "Quiz";
    colorClass = "text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200";
  }

  // --- COMPACT MODE ---
  if (compact) {
    if (type === 'quiz') {
      return (
        <button 
          onClick={(e) => {
             e.stopPropagation();
             navigate(`/quiz/${encodeURIComponent(topic)}`);
          }} 
          className={`p-1.5 rounded-full transition-colors ${colorClass.replace('bg-', 'hover:bg-').split(' ')[0]} hover:bg-opacity-10`}
          title={`Take AI Quiz on ${topic}`}
        >
          <IconComp className="w-4 h-4" />
        </button>
      )
    }
    return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`p-1.5 rounded-full transition-colors ${colorClass.replace('bg-', 'hover:bg-').split(' ')[0]} hover:bg-opacity-10`}
          title={`Search ${topic} on ${label}`}
        >
          <IconComp className="w-4 h-4" />
        </a>
    );
  }

  // --- NORMAL MODE ---
  if (type === "quiz") {
    return (
      <button
        onClick={() => navigate(`/quiz/${encodeURIComponent(topic)}`)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${colorClass}`}
        title={`Take Practice Quiz for ${topic}`}
      >
        <IconComp className="w-4 h-4" />
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${colorClass}`}
      title={`Find ${label} resources for ${topic}`}
    >
      <IconComp className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
};

const TopicItem = ({ topic }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow gap-3">
    <div className="flex items-start gap-3">
       <div className="mt-2 min-w-[6px] h-[6px] rounded-full bg-indigo-400" />
       <span className="text-gray-700 font-medium leading-relaxed">{topic}</span>
    </div>
    
    <div className="flex items-center gap-2 pl-4 sm:pl-0">
      <ResourceButton type="youtube" topic={topic} />
      <ResourceButton type="notes" topic={topic} />
      <ResourceButton type="google" topic={topic} />
      <ResourceButton type="quiz" topic={topic} /> {/* Added Quiz Button */}
    </div>
  </div>
);

const SectionAccordion = ({ section, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
            <div className="flex items-center gap-1 ml-2 border-l pl-3">
                <ResourceButton type="youtube" topic={section.title} compact={true} />
                <ResourceButton type="google" topic={section.title} compact={true} />
                <ResourceButton type="quiz" topic={section.title} compact={true} /> {/* Added Compact Quiz Button */}
            </div>
        </div>
        
        {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
      </div>
      
      {isOpen && (
        <div className="p-4 space-y-3 border-t border-gray-100">
          {section.topics.map((topic, idx) => (
            <TopicItem key={idx} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [activeSubject, setActiveSubject] = useState('chemistry');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const displayedContent = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const results = [];
      Object.entries(syllabusData).forEach(([key, subject]) => {
        subject.sections.forEach(section => {
          const matchingTopics = section.topics.filter(t => 
            t.toLowerCase().includes(searchQuery.toLowerCase())
          );
          const titleMatch = section.title.toLowerCase().includes(searchQuery.toLowerCase());

          if (matchingTopics.length > 0 || titleMatch) {
            results.push({
              ...section,
              title: `${subject.title}: ${section.title}`,
              topics: titleMatch ? section.topics : matchingTopics
            });
          }
        });
      });
      return results;
    }
    return syllabusData[activeSubject].sections;
  }, [activeSubject, searchQuery]);

  const activeSubjectData = syllabusData[activeSubject];
  const ActiveIcon = IconMap[activeSubjectData.iconName] || BookOpen;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header toggleSidebar={toggleSidebar} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          <nav className={`
            fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:w-64 lg:block z-30 bg-gray-50 transition-transform duration-200 ease-in-out
            ${isSidebarOpen ? 'bg-white shadow-2xl p-4 w-72' : ''}
          `}>
            <div className="flex justify-between items-center lg:hidden mb-6">
               <span className="font-bold text-lg">Subjects</span>
               <button onClick={toggleSidebar}><X className="w-6 h-6 text-gray-500" /></button>
            </div>

            <div className="space-y-1">
              {Object.entries(syllabusData).map(([key, data]) => (
                <SubjectCard
                  key={key}
                  subjectKey={key}
                  subject={data}
                  isActive={activeSubject === key && searchQuery === ''}
                  onClick={(key) => {
                    setActiveSubject(key);
                    setSearchQuery('');
                    if(window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                />
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <h4 className="text-indigo-900 font-semibold mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4"/> Exam Tip
                </h4>
                <p className="text-xs text-indigo-700 leading-relaxed">
                    Focus on Class 11 & 12 NCERT concepts for Physics & Chemistry. For Math, practice shortcut methods.
                </p>
            </div>
          </nav>

          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="flex-1">
            <div className="relative mb-8">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-gray-400" />
               </div>
               <input
                 type="text"
                 className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-shadow hover:shadow-md"
                 placeholder="Search topics (e.g., 'Thermodynamics', 'Matrices')..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search Results for "${searchQuery}"` : activeSubjectData.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                   {searchQuery ? 'Showing topics across all subjects' : 'Select a section below to explore resources'}
                </p>
              </div>
              {!searchQuery && (
                  <div className={`hidden sm:block p-2 rounded-full ${activeSubjectData.bgColor}`}>
                      <div className={activeSubjectData.color}>
                        <ActiveIcon className="w-8 h-8" />
                      </div>
                  </div>
              )}
            </div>

            <div className="space-y-4 pb-20">
              {displayedContent.length > 0 ? (
                displayedContent.map((section, idx) => (
                  <SectionAccordion 
                    key={`${section.id}-${idx}`} 
                    section={section} 
                    defaultOpen={searchQuery !== '' || idx === 0}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
                    <Search className="w-full h-full" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No topics found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search query.</p>
                </div>
              )}
            </div>
            <div className="mt-auto py-8 border-t border-gray-200">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-sm text-gray-500">
                  Contribution made by <span className="font-semibold text-gray-800">Chudamani Lawrence</span>
                </p>
                
                <a 
                  href="https://github.com/cmlowerence" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200"
                >
                  <Github className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                  <span className="text-xs font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">
                    github.com/cmlowerence
                  </span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppWrapper;
