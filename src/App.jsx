import React, { useState, useMemo, useEffect } from 'react';
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
  Globe
} from 'lucide-react';

// Import SVG logo as React component via vite-plugin-svgr (?react)
import Brand from './icons/brand.svg?react';

// Helper: safely clone icon elements and merge className
const cloneIconWith = (elem, className) => {
  if (!React.isValidElement(elem)) return elem;
  const existing = (elem.props && elem.props.className) || '';
  const merged = `${existing} ${className}`.trim();
  return React.cloneElement(elem, { className: merged, 'aria-hidden': true });
};

// --- Syllabus Data Structure ---
const syllabusData = {
  chemistry: {
    title: 'Chemistry',
    icon: <FlaskConical className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    sections: [
      {
        id: 'chem_1',
        title: 'Basic & General Chemistry',
        topics: [
          'Structure of Atom',
          'Classification of Elements & Periodicity',
          'Chemical Bonding & Molecular Structure',
          'Redox Reactions',
          'Coordination Compounds',
          'd- and f- Block Elements',
          'Biomolecules'
        ]
      },
      {
        id: 'chem_2',
        title: 'Physical Chemistry',
        topics: [
          'States of Matter (Gaseous, Liquid, Solid)',
          'Chemical Thermodynamics',
          'Chemical and Phase Equilibria',
          'Solutions and Colligative Properties',
          'Electrochemistry & Electrochemical Cells',
          'Chemical Kinetics & Enzyme Catalysis',
          'Adsorption and Colloidal Solutions',
          'Molecular Spectroscopy'
        ]
      },
      {
        id: 'chem_3',
        title: 'Organic Chemistry',
        topics: [
          'Stereochemistry & Conformational Analysis',
          'Reaction Mechanisms (Nucleophilic, Electrophilic, Elimination)',
          'Name Reactions and Rearrangements',
          'Organic Spectroscopy (UV-Visible, IR, NMR)',
          'Hydrocarbons, Haloalkanes, Haloarenes',
          'Alcohols, Phenols, Ethers',
          'Aldehydes, Carboxylic Acids, Amines',
          'Heterocyclic Chemistry & Polymers'
        ]
      },
      {
        id: 'chem_4',
        title: 'Inorganic Chemistry',
        topics: [
          'Periodic Table and Properties',
          'Extraction of Metals and Metallurgy',
          'VSEPR and Molecular Orbital Theory',
          'Main Group Elements (s and p-blocks)',
          'Transition & Inner-transition Elements',
          'Bioinorganic Chemistry',
          'Nuclear Chemistry',
          'Analytical Chemistry'
        ]
      }
    ]
  },
  physics: {
    title: 'Physics',
    icon: <Atom className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    sections: [
      {
        id: 'phy_1',
        title: 'Mechanics & Properties of Matter',
        topics: [
          'Laws of Motion, Work, Energy and Power',
          'System of Particles and Rotational Motion',
          'Gravitation',
          'Mechanical Properties of Solids & Fluids',
          'Thermal Properties of Matter',
          'Thermodynamics & Kinetic Theory of Gases',
          'Oscillations & Waves'
        ]
      },
      {
        id: 'phy_2',
        title: 'Electricity & Magnetism',
        topics: [
          'Electrostatics & Electrostatic Potential',
          "Current Electricity & Ohm's Law",
          'Magnetic Effect of Current & Magnetism',
          'Electromagnetic Induction & Alternating Currents',
          "Maxwell's Equations & EM Waves"
        ]
      },
      {
        id: 'phy_3',
        title: 'Optics',
        topics: [
          'Ray Optics and Optical Instruments',
          'Wave Optics (Interference, Diffraction, Polarization)',
          'Interference in Thin Films',
          'Lasers and Holography (Basic Concepts)'
        ]
      },
      {
        id: 'phy_4',
        title: 'Modern Physics & Quantum Mechanics',
        topics: [
          'Dual Nature of Radiation and Matter',
          'Photo-electric Effect & Compton Scattering',
          'Heisenberg Uncertainty Principle',
          'Schrodinger Equation (Time Dependent/Independent)',
          'Zeeman Effect & Stern-Gerlach Experiment',
          'Atomic Models & Spin Orbit Coupling'
        ]
      },
      {
        id: 'phy_5',
        title: 'Solid State & Electronics',
        topics: [
          'Crystal Structure & Brillouin Zones',
          'Band Theory of Solids',
          'Superconductivity (BCS Theory)',
          'Semiconductor Electronics (Diodes, Transistors)',
          'Digital Electronics (Logic Gates)'
        ]
      },
      {
        id: 'phy_6',
        title: 'Nuclear & Particle Physics',
        topics: [
          'Nuclear Models & Radioactivity',
          'Nuclear Reactions, Detectors & Accelerators',
          'Elementary Particles & Quarks Model',
          'Conservation Laws'
        ]
      }
    ]
  },
  maths: {
    title: 'Mathematics',
    icon: <Calculator className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    sections: [
      {
        id: 'math_1',
        title: 'Algebra & Number Theory',
        topics: [
          'Sets, Relations, Functions',
          'Complex Numbers & Quadratic Equations',
          'Permutations, Combinations & Binomial Theorem',
          'Sequence & Series (AP, GP, HP)',
          'Matrices & Determinants',
          'Groups, Rings, Fields (Abstract Algebra)',
          'Vector Spaces & Linear Transformations'
        ]
      },
      {
        id: 'math_2',
        title: 'Calculus & Analysis',
        topics: [
          'Limits, Continuity, Differentiability',
          'Applications of Derivatives (Maxima/Minima)',
          'Integration (Definite & Indefinite)',
          'Differential Equations (ODE & PDE)',
          'Real Analysis (Sequences & Series of Functions)',
          'Complex Analysis (Analytic Functions)'
        ]
      },
      {
        id: 'math_3',
        title: 'Geometry & Vectors',
        topics: [
          'Co-ordinate Geometry (2D & 3D)',
          'Conic Sections',
          'Vector Algebra',
          'Vector Calculus (Gradient, Divergence, Curl)'
        ]
      },
      {
        id: 'math_4',
        title: 'Applied Mathematics',
        topics: [
          'Statistics (Mean, Variance, Deviation)',
          "Probability & Bayes' Theorem",
          'Numerical Methods (Root Finding, Integration)',
          'Linear Programming Problems (LPP)'
        ]
      }
    ]
  },
  bed: {
    title: 'B.Ed & Pedagogy',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    sections: [
      {
        id: 'bed_1',
        title: 'B.Ed Core Subjects',
        topics: [
          'Childhood and Development Years',
          'Contemporary India and Education',
          'Language Across the Curriculum',
          'Understanding Disciplines and Subjects',
          'Learning and Teaching',
          'Assessment for Learning',
          'Teaching of Physical Science & Mathematics',
          'Inclusive School & Gender School Society'
        ]
      }
    ]
  },
  gk: {
    title: 'General Knowledge',
    icon: <Globe className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    sections: [
      {
        id: 'gk_1',
        title: 'General Awareness',
        topics: [
          'HP General Knowledge',
          'Current Affairs',
          'Everyday Science',
          'Logical Reasoning',
          'Social Science',
          'General English',
          'General Hindi'
        ]
      }
    ]
  }
};

// --- Components ---

const Header = ({ toggleSidebar }) => (
  <header className="bg-white shadow-sm border-b sticky top-0 z-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6 text-gray-600" aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2">
              <Brand className="w-6 h-6 text-white" aria-hidden="true" />
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">TGT Explorer</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://ncert.nic.in/textbook.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hidden sm:flex items-center gap-1"
          >
            NCERT Books <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
          <div className="text-xs text-gray-400 font-mono border px-2 py-1 rounded">v1.1</div>
        </div>
      </div>
    </div>
  </header>
);

const SubjectCard = ({ subjectKey, subject, isActive, onClick }) => (
  <button
    onClick={() => onClick(subjectKey)}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 mb-2 ${
      isActive ? 'bg-white shadow-md border-l-4 border-indigo-500 text-gray-900' : 'hover:bg-gray-100 text-gray-600 hover:pl-4'
    }`}
  >
    <div className={`p-2 rounded-lg ${isActive ? subject.bgColor + ' ' + subject.color : 'bg-gray-200 text-gray-500'}`}>
      {cloneIconWith(subject.icon, 'w-5 h-5')}
    </div>
    <span className="font-semibold">{subject.title}</span>
  </button>
);

const ResourceButton = ({ type, topic }) => {
  let url = '';
  let icon = null;
  let label = '';
  let colorClass = '';

  if (type === 'youtube') {
    const q = encodeURIComponent(`TGT Non Medical ${topic}`);
    url = `https://www.youtube.com/results?search_query=${q}`;
    icon = <Youtube className="w-4 h-4" aria-hidden="true" />;
    label = 'Watch';
    colorClass = 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200';
  } else if (type === 'google') {
    const q = encodeURIComponent(`TGT Non Medical ${topic} study material pdf`);
    url = `https://www.google.com/search?q=${q}`;
    icon = <Search className="w-4 h-4" aria-hidden="true" />;
    label = 'Explore';
    colorClass = 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200';
  } else if (type === 'notes') {
    const q = encodeURIComponent(`${topic} filetype:pdf`);
    url = `https:/www.google.com/search?q=${q}`;
    icon = <FileText className="w-4 h-4" aria-hidden="true" />;
    label = 'PDF';
    colorClass = 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200';
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${colorClass}`}
      title={`Find ${label} resources for ${topic}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
};

const TopicItem = ({ topic }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow gap-3">
    <div className="flex items-start gap-3">
      <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-indigo-400" aria-hidden="true" />
      <span className="text-gray-700 font-medium leading-relaxed">{topic}</span>
    </div>

    <div className="flex items-center gap-2 pl-4 sm:pl-0">
      <ResourceButton type="youtube" topic={topic} />
      <ResourceButton type="notes" topic={topic} />
      <ResourceButton type="google" topic={topic} />
    </div>
  </div>
);

const SectionAccordion = ({ section, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Sync with parent-driven defaultOpen (useful when search toggles)
  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  const regionId = `section-panel-${section.id}`;

  return (
    <div className="mb-4 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={regionId}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
        {isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" aria-hidden="true" /> : <ChevronRight className="w-5 h-5 text-gray-400" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div id={regionId} role="region" className="p-4 space-y-3 border-t border-gray-100">
          {section.topics.map((topic) => (
            <TopicItem key={`${section.id}-${topic}`} topic={topic} />
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
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  // Close sidebar on Esc
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const displayedContent = useMemo(() => {
    if (debouncedQuery && debouncedQuery.length > 0) {
      const results = [];
      const q = debouncedQuery.toLowerCase();
      Object.entries(syllabusData).forEach(([key, subject]) => {
        subject.sections.forEach((section) => {
          const matchingTopics = section.topics.filter((t) => t.toLowerCase().includes(q));
          if (matchingTopics.length > 0) {
            results.push({
              ...section,
              title: `${subject.title}: ${section.title}`,
              topics: matchingTopics
            });
          }
        });
      });
      return results;
    }

    return syllabusData[activeSubject].sections;
  }, [activeSubject, debouncedQuery]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header toggleSidebar={toggleSidebar} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <nav
            className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:w-64 lg:block z-30 bg-gray-50 transition-transform duration-200 ease-in-out ${
              isSidebarOpen ? 'bg-white shadow-2xl p-4 w-72' : ''
            }`}
            aria-label="Subject navigation"
          >
            <div className="flex justify-between items-center lg:hidden mb-6">
              <span className="font-bold text-lg">Subjects</span>
              <button onClick={toggleSidebar} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Close navigation">
                <X className="w-6 h-6 text-gray-500" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-1">
              {Object.entries(syllabusData).map(([key, data]) => (
                <SubjectCard
                  key={key}
                  subjectKey={key}
                  subject={data}
                  isActive={activeSubject === key && debouncedQuery === ''}
                  onClick={(k) => {
                    setActiveSubject(k);
                    setSearchQuery('');
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                />
              ))}
            </div>

            <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <h4 className="text-indigo-900 font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" aria-hidden="true" /> Exam Tip
              </h4>
              <p className="text-xs text-indigo-700 leading-relaxed">
                Focus on Class 11 & 12 NCERT concepts for Physics & Chemistry. For Math, practice shortcut methods for calculus and vectors.
              </p>
            </div>
          </nav>

          {/* Mobile overlay */}
          {isSidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

          {/* Main */}
          <main className="flex-1">
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-shadow hover:shadow-md"
                placeholder="Search for any topic (e.g., 'Thermodynamics', 'Matrices')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search topics"
              />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{debouncedQuery ? `Search Results for \"${debouncedQuery}\"` : syllabusData[activeSubject].title}</h2>
                <p className="text-sm text-gray-500 mt-1">{debouncedQuery ? 'Showing topics across all subjects' : 'Select a section below to explore topics & resources'}</p>
              </div>
              {!debouncedQuery && (
                <div className={`hidden sm:block p-2 rounded-full ${syllabusData[activeSubject].bgColor}`}>
                  <div className={syllabusData[activeSubject].color}>{cloneIconWith(syllabusData[activeSubject].icon, 'w-8 h-8')}</div>
                </div>
              )}
            </div>

            <div className="space-y-4 pb-20">
              {displayedContent.length > 0 ? (
                displayedContent.map((section, idx) => <SectionAccordion key={`${section.id}-${idx}`} section={section} defaultOpen={debouncedQuery !== '' || idx === 0} />)
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                  <div className="mx-auto h-12 w-12 text-gray-300 mb-3">
                    <Search className="w-full h-full" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No topics found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search query.</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
