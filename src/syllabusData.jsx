import { 
  FlaskConical, 
  Atom, 
  Calculator, 
  GraduationCap, 
  Globe,
  // EMRS Specific Icons
  Brain,       // Reasoning
  Monitor,     // ICT
  Shield,      // POCSO
  Users,       // Admin Aptitude
  Languages,   // Language Competency
  BookOpen,     // General Awareness
  FileText,     // Acts/Rules
  Plane,
  Book,
  Activity,
  Puzzle,
  Cpu
} from 'lucide-react';

export const syllabusData = {
  // ============================================
  // TAB 1: HP TGT NON-MEDICAL (Existing Data)
  // ============================================
  tgt_non_medical: {
    label: "HP TGT Non-Medical",
    subjects: {
      chemistry: {
        title: "Chemistry",
        icon: FlaskConical, 
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        sections: [
          {
            id: "chem_1",
            title: "Physical Chemistry",
            topics: [
              "Atomic and Molecular Structure",
              "States of Matter (Gaseous, Liquid, Solid)",
              "Chemical Thermodynamics & Equilibrium",
              "Chemical and Phase Equilibria",
              "Solutions and Colligative Properties",
              "Electrochemistry and Electrochemical Cells",
              "Chemical Kinetics and Enzyme Catalysis",
              "Adsorption and Colloidal Solutions",
              "Molecular Spectroscopy"
            ]
          },
          {
            id: "chem_2",
            title: "Organic Chemistry",
            topics: [
              "Stereochemistry & Conformational Analysis",
              "Reaction Mechanisms (Nucleophilic, Electrophilic)",
              "Elimination Reactions & Rearrangements",
              "Name Reactions",
              "Qualitative Organic Analysis",
              "Organic Spectroscopy (UV-Visible, IR, NMR)",
              "Hydrocarbons, Haloalkanes, Haloarenes",
              "Alcohols, Phenols, Ethers, Aldehydes, Carboxylic Acids, Amines",
              "Heterocyclic Chemistry & Polymer Chemistry",
              "Natural Products & Biochemistry"
            ]
          },
          {
            id: "chem_3",
            title: "Inorganic Chemistry",
            topics: [
              "Periodic Table and Periodic Properties",
              "Extraction of Metals and Metallurgy",
              "Chemical Bonding (VSEPR and MO Theory)",
              "Main Group Elements (s and p-blocks)",
              "Transition (d-block) & Inner-transition (f-block) Elements",
              "Coordination Chemistry",
              "Bioinorganic Chemistry",
              "Nuclear Chemistry & Analytical Chemistry"
            ]
          }
        ]
      },
      physics: {
        title: "Physics",
        icon: Atom,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        sections: [
          {
            id: "phy_1",
            title: "Mechanics, Relativity & Properties of Matter",
            topics: [
              "Laws of Motion, Work, Energy and Power",
              "System of Particles and Rotational Motion",
              "Gravitation",
              "Mechanical Properties of Solids & Fluids",
              "Coriolis Force & Inertial/Non-inertial Frames",
              "Special Theory of Relativity (Lorentz, Time Dilation, Mass-Energy)",
              "Michelson-Morley Experiment"
            ]
          },
          {
            id: "phy_2",
            title: "Thermal & Statistical Physics",
            topics: [
              "Thermodynamics & Kinetic Theory of Gases",
              "Statistical Physics (M-B, B-E, F-D Statistics)",
              "Entropy & Thermodynamic Potentials",
              "Maxwell's Thermodynamic Relations"
            ]
          },
          {
            id: "phy_3",
            title: "Electricity & Magnetism",
            topics: [
              "Electrostatics, Potential, Poisson & Laplace Equations",
              "Current Electricity, Microscopic Ohm's Law & Hall Effect",
              "Magnetism, Diamagnetism, Paramagnetism, Ferromagnetism",
              "Electromagnetic Induction & AC",
              "Maxwell's Equations & Poynting Vector",
              "Dielectrics & Polarization"
            ]
          },
          {
            id: "phy_4",
            title: "Optics & Waves",
            topics: [
              "Oscillations (Damped, Forced, Coupled)",
              "Interference (Young's Double Slit, Newton's Rings, Thin Films)",
              "Diffraction (Fraunhofer, Fresnel, Zone Plate)",
              "Polarization (Malus's Law, Double Refraction, Brewster Law)",
              "Lasers and Holography"
            ]
          },
          {
            id: "phy_5",
            title: "Quantum Mechanics",
            topics: [
              "Photo-electric Effect & Compton Scattering",
              "Heisenberg Uncertainty & Wave-Particle Duality",
              "Schrodinger Equation (Time Dependent/Independent)",
              "Zeeman Effect & Stern-Gerlach Experiment",
              "Spin Orbit Coupling & L-S, J-J Couplings"
            ]
          },
          {
            id: "phy_6",
            title: "Solid State & Electronics",
            topics: [
              "Crystal Structure, Miller Indices, Brillouin Zones",
              "Band Theory, Fermi Gas & Specific Heat",
              "Superconductivity (BCS Theory, Meissner Effect)",
              "Semiconductors (Diodes, Zener, LED, Solar Cell)",
              "Transistors (BJT, FET, MOSFET) & Amplifiers",
              "Digital Electronics & Logic Gates"
            ]
          },
          {
            id: "phy_7",
            title: "Nuclear Physics",
            topics: [
              "Nuclear Models & Radioactivity",
              "Nuclear Reactions, Detectors & Accelerators",
              "Elementary Particles & Quarks Model",
              "Conservation Laws & Particle Symmetries"
            ]
          }
        ]
      },
      maths: {
        title: "Mathematics",
        icon: Calculator,
        color: "text-red-600",
        bgColor: "bg-red-100",
        sections: [
          {
            id: "math_1",
            title: "Algebra & Linear Algebra",
            topics: [
              "Sets, Relations, Functions",
              "Complex Numbers & Quadratic Equations",
              "Permutations, Combinations & Binomial Theorem",
              "Sequence & Series (AP, GP, HP)",
              "Matrices, Determinants & System of Linear Equations",
              "Groups, Rings, Fields (Abstract Algebra)",
              "Vector Spaces, Linear Transformations & Eigen Values"
            ]
          },
          {
            id: "math_2",
            title: "Calculus & Analysis",
            topics: [
              "Limits, Continuity, Differentiability",
              "Applications of Derivatives (Maxima/Minima, Mean Value Theorems)",
              "Integration (Definite/Indefinite) & Area Under Curves",
              "Partial Differentiation & Jacobians",
              "Real Analysis (Sequences, Series, Power Series)",
              "Complex Analysis (Analytic Functions, Cauchy-Riemann)"
            ]
          },
          {
            id: "math_3",
            title: "Differential Equations",
            topics: [
              "ODEs (Homogenous, Linear, Exact)",
              "Equations of First Order & Higher Degree (Clairaut's Form)",
              "Linear Equations with Constant/Variable Coefficients",
              "Partial Differential Equations (Classification)"
            ]
          },
          {
            id: "math_4",
            title: "Geometry & Vectors",
            topics: [
              "Co-ordinate Geometry (2D Conics & 3D Lines/Planes)",
              "Vector Algebra",
              "Vector Calculus (Gradient, Divergence, Curl)"
            ]
          },
          {
            id: "math_5",
            title: "Numerical Methods & Applied Math",
            topics: [
              "Numerical Analysis (Newton's Method, Simpson's Rule, Euler's Method)",
              "Statistics (Mean, Variance, Deviation)",
              "Probability & Bayes' Theorem",
              "Linear Programming Problems (LPP)"
            ]
          }
        ]
      },
      bed: {
        title: "B.Ed & Pedagogy",
        icon: GraduationCap,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        sections: [
          {
            id: "bed_1",
            title: "B.Ed Core Subjects",
            topics: [
              "Childhood and Development Years",
              "Contemporary India and Education",
              "Language Across the Curriculum",
              "Understanding Disciplines and Subjects",
              "Learning and Teaching",
              "Assessment for Learning",
              "Teaching of Physical Science & Mathematics",
              "Inclusive School, Gender & Society",
              "ICT in Teaching-Learning Process"
            ]
          }
        ]
      },
      gk: {
        title: "General Knowledge",
        icon: Globe,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        sections: [
          {
            id: "gk_1",
            title: "General Awareness",
            topics: [
              "HP General Knowledge (Moderate)",
              "Current Affairs (Last 1 year)",
              "Everyday Science (10th level)",
              "Logical Reasoning",
              "Social Science",
              "General English (10th level)",
              "General Hindi (10th level)"
            ]
          }
        ]
      }
    }
  },

  // ============================================
  // TAB 2: EMRS HOSTEL WARDEN (Official Detailed Syllabus)
  // ============================================
  emrs_hostel_warden: {
    label: "EMRS Hostel Warden",
    subjects: {
      ga: {
        title: "General Awareness",
        icon: BookOpen,
        color: "text-indigo-600",
        bgColor: "bg-indigo-100",
        sections: [
          {
            id: "emrs_ga_1",
            title: "Education & Current Affairs",
            topics: [
              "General Knowledge with special emphasis in the field of education",
              "Current Affairs (National & International)",
              "Important Educational Policies (NEP 2020)",
              "Educational Schemes & Initiatives by Govt. of India"
            ]
          }
        ]
      },
      reasoning: {
        title: "Reasoning Ability",
        icon: Brain,
        color: "text-pink-600",
        bgColor: "bg-pink-100",
        sections: [
          {
            id: "emrs_res_1",
            title: "Verbal & Non-Verbal Reasoning",
            topics: [
              "Puzzles & Seating Arrangement (Linear, Circular, Square)",
              "Data Sufficiency",
              "Statement based questions (Verbal Reasoning)",
              "Inequality",
              "Blood Relations",
              "Sequences and Series (Number & Alphabet)",
              "Direction Test",
              "Assertion and Reason",
              "Venn Diagrams",
              "Syllogisms",
              "Coding-Decoding"
            ]
          }
        ]
      },
      ict: {
        title: "Knowledge of ICT",
        icon: Monitor,
        color: "text-cyan-600",
        bgColor: "bg-cyan-100",
        sections: [
          {
            id: "emrs_ict_1",
            title: "Computer Fundamentals & Office",
            topics: [
              "Fundamentals of Computer System",
              "Basics of Operating System (Windows, Linux, etc.)",
              "MS Office (MS Word, MS Excel, MS PowerPoint)",
              "Keyboard Shortcuts and their uses",
              "File Formats and Extensions"
            ]
          },
          {
            id: "emrs_ict_2",
            title: "Network & Security",
            topics: [
              "Important Computer Terms and Abbreviations",
              "Computer Networks (LAN, WAN, MAN)",
              "Cyber Security & Antivirus",
              "Internet & Web Browsers",
              "Input/Output Devices",
              "Computer Memory & Storage"
            ]
          }
        ]
      },
      pocso: {
        title: "POCSO & Child Safety Acts",
        icon: Shield,
        color: "text-rose-600",
        bgColor: "bg-rose-100",
        sections: [
          {
            id: "emrs_pocso_1",
            title: "Major Acts",
            topics: [
              "The Prohibition of Child Marriage Act (2006)",
              "The Protection of Children from Sexual Offences Act (2012)",
              "The Protection of Children from Sexual Offences Rules (2020)",
              "The Child Labour (Prohibition and Regulation) Act (1986)"
            ]
          },
          {
            id: "emrs_pocso_2",
            title: "Related Acts & Policies",
            topics: [
              "The Immoral Traffic (Prevention) Act (1956)",
              "The Commission for Protection of Child Rights Act (2005)",
              "The Right of Children to Free and Compulsory Education Act (2009) (RTE)",
              "The Criminal Law Amendment Act (2013)",
              "Child Policy",
              "National Charter of Children",
              "Child Mortality Rate",
              "Gender Ratio"
            ]
          }
        ]
      },
      admin_aptitude: {
        title: "Administrative Aptitude",
        icon: Users,
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        sections: [
          {
            id: "emrs_admin_1",
            title: "Student Management",
            topics: [
              "Handling of large number of students",
              "Ensuring segregation of male and female students",
              "Ensuring safety and security of children",
              "Conflict Resolution among students",
              "Managing student discipline and behavior"
            ]
          },
          {
            id: "emrs_admin_2",
            title: "Hostel Management",
            topics: [
              "Managing the consumables and inventories of Hostel",
              "Ensuring cleanliness and hygiene of Hostel premises",
              "Record keeping of children (Attendance, Health records)",
              "Inventory Management (Bedding, Furniture, etc.)",
              "Mess Management basics"
            ]
          }
        ]
      },
      language: {
        title: "Language Competency",
        icon: Languages,
        color: "text-teal-600",
        bgColor: "bg-teal-100",
        sections: [
          {
            id: "emrs_lang_1",
            title: "General English",
            topics: [
              "Verb, Tenses, Voice",
              "Subject-Verb Agreement",
              "Articles",
              "Comprehension",
              "Fill in the Blanks",
              "Adverb",
              "Error Correction",
              "Sentence Rearrangement",
              "Unseen Passages",
              "Vocabulary, Antonyms, Synonyms",
              "Grammar, Idioms & Phrases"
            ]
          },
          {
            id: "emrs_lang_2",
            title: "General Hindi (सामान्य हिंदी)",
            topics: [
              "संधि (Sandhi)",
              "समास (Samas)",
              "विलोम शब्द (Antonyms)",
              "पर्यायवाची शब्द (Synonyms)",
              "सामान्य अशुद्धियाँ (Common Errors)",
              "वा वाक्यांशों के लिए एक शब्द (One Word Substitution)",
              "मुहावरे और लोकोक्तियाँ (Idioms & Proverbs)",
              "अपठित गद्यांश (Unseen Passage)"
            ]
          }
        ]
      }
    }
  },
  // ============================================
  // TAB 3: AFCAT 2026 (Air Force Common Admission Test)
  // ============================================
  afcat_2026: {
    label: "AFCAT 2026",
    subjects: {
      overview: {
        title: "AFCAT Exam Overview",
        icon: Plane,
        color: "text-sky-600",
        bgColor: "bg-sky-100",
        sections: [
          {
            id: "afcat_overview_1",
            title: "Exam Structure",
            topics: [
              "Online Objective Type Examination",
              "Total Questions: 100",
              "Total Marks: 300",
              "Time Duration: 2 Hours",
              "Negative Marking: -1 for each incorrect answer",
              "Sections: General Awareness, English, Numerical Ability, Reasoning & Military Aptitude",
              "EKT applicable only for Technical Branch candidates"
            ]
          }
        ]
      },

      general_awareness: {
        title: "General Awareness",
        icon: Globe,
        color: "text-indigo-600",
        bgColor: "bg-indigo-100",
        sections: [
          {
            id: "afcat_ga_1",
            title: "Static General Knowledge",
            topics: [
              "Indian History (Ancient, Medieval, Modern)",
              "Indian Geography (Physical, Economic, Political)",
              "Indian Polity & Constitution",
              "Indian Economy (Basic Concepts)",
              "Environment & Ecology",
              "Science & Technology (General Awareness level)",
              "Defence Terminology & Indian Armed Forces",
              "Space, Nuclear & Missile Programs of India"
            ]
          },
          {
            id: "afcat_ga_2",
            title: "Current Affairs",
            topics: [
              "National & International Current Affairs",
              "Sports, Awards & Honors",
              "Defence Exercises & Military Operations",
              "Important Appointments",
              "Government Schemes & Policies"
            ]
          }
        ]
      },

      english: {
        title: "Verbal Ability in English",
        icon: Book,
        color: "text-emerald-600",
        bgColor: "bg-emerald-100",
        sections: [
          {
            id: "afcat_eng_1",
            title: "Grammar & Usage",
            topics: [
              "Spotting Errors",
              "Sentence Improvement",
              "Subject-Verb Agreement",
              "Tenses & Voice",
              "Articles & Prepositions",
              "Vocabulary Usage"
            ]
          },
          {
            id: "afcat_eng_2",
            title: "Comprehension & Vocabulary",
            topics: [
              "Reading Comprehension",
              "Synonyms & Antonyms",
              "Idioms & Phrases",
              "One Word Substitution",
              "Sentence Completion",
              "Para Jumbles"
            ]
          }
        ]
      },

      numerical_ability: {
        title: "Numerical Ability",
        icon: Activity,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        sections: [
          {
            id: "afcat_math_1",
            title: "Arithmetic Fundamentals",
            topics: [
              "Number System",
              "Decimal & Fractions",
              "LCM & HCF",
              "Ratio & Proportion",
              "Percentages",
              "Average"
            ]
          },
          {
            id: "afcat_math_2",
            title: "Applied Mathematics",
            topics: [
              "Time & Work",
              "Time, Speed & Distance",
              "Profit & Loss",
              "Simple & Compound Interest",
              "Mensuration (2D & 3D)",
              "Data Interpretation (Tables & Charts)"
            ]
          }
        ]
      },

      reasoning: {
        title: "Reasoning & Military Aptitude",
        icon: Puzzle,
        color: "text-pink-600",
        bgColor: "bg-pink-100",
        sections: [
          {
            id: "afcat_res_1",
            title: "Verbal Reasoning",
            topics: [
              "Analogies",
              "Classification",
              "Series Completion",
              "Blood Relations",
              "Direction Sense",
              "Coding-Decoding",
              "Logical Venn Diagrams"
            ]
          },
          {
            id: "afcat_res_2",
            title: "Non-Verbal & Spatial Ability",
            topics: [
              "Mirror & Water Images",
              "Paper Folding & Cutting",
              "Embedded Figures",
              "Figure Matrix",
              "Cube & Dice Problems"
            ]
          }
        ]
      },

      ekt: {
        title: "Engineering Knowledge Test (EKT)",
        icon: Cpu,
        color: "text-red-600",
        bgColor: "bg-red-100",
        sections: [
          {
            id: "afcat_ekt_1",
            title: "Mechanical Engineering",
            topics: [
              "Engineering Mechanics",
              "Thermodynamics",
              "Strength of Materials",
              "Theory of Machines",
              "Production Engineering"
            ]
          },
          {
            id: "afcat_ekt_2",
            title: "Electrical & Electronics Engineering",
            topics: [
              "Electrical Circuits & Networks",
              "Electrical Machines",
              "Power Systems",
              "Control Systems",
              "Analog & Digital Electronics"
            ]
          },
          {
            id: "afcat_ekt_3",
            title: "Computer Science Engineering",
            topics: [
              "Data Structures",
              "Algorithms",
              "Operating Systems",
              "Computer Networks",
              "Database Management Systems",
              "Software Engineering"
            ]
          },
          {
            id: "afcat_ekt_4",
            title: "Electronics & Communication Engineering",
            topics: [
              "Signals & Systems",
              "Analog Communication",
              "Digital Communication",
              "Microprocessors & Microcontrollers",
              "Electromagnetic Theory"
            ]
          }
        ]
      }
    }
}
};
