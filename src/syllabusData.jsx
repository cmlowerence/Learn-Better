import { 
  FlaskConical, 
  Atom, 
  Calculator, 
  GraduationCap, 
  Globe 
} from 'lucide-react';

export const syllabusData = {
  chemistry: {
    title: "Chemistry",
    // We now use the imported component directly instead of a string name
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
          "HP General Knowledge",
          "Current Affairs",
          "Everyday Science",
          "Logical Reasoning",
          "Social Science",
          "General English",
          "General Hindi"
        ]
      }
    ]
  }
};
