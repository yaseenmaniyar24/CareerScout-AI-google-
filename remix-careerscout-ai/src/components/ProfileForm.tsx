import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UserProfile } from '../types';
import {
  User,
  Briefcase,
  Code,
  Cpu,
  Wrench,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ChevronDown,
  Plus,
  Search,
} from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

interface RoleStackConfig {
  role: string;
  category: string;
  skills: string[];
  programming_languages: string[];
  frameworks: string[];
  tools: string[];
}

const ROLE_CATALOG: RoleStackConfig[] = [
  {
    role: 'AI/ML Engineer',
    category: 'AI & Data',
    skills: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Feature Engineering', 'Model Deployment', 'Data Structures', 'Algorithms'],
    programming_languages: ['Python', 'C++', 'SQL', 'R'],
    frameworks: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Keras', 'FastAPI', 'Hugging Face'],
    tools: ['Docker', 'Git', 'Linux', 'Jupyter', 'MLflow', 'Weights & Biases', 'AWS'],
  },
  {
    role: 'GenAI & LLM Engineer',
    category: 'AI & Data',
    skills: ['Generative AI', 'LLM Fine-Tuning', 'RAG Pipelines', 'Prompt Engineering', 'NLP', 'Vector Databases', 'Deep Learning', 'REST APIs'],
    programming_languages: ['Python', 'TypeScript', 'SQL'],
    frameworks: ['LangChain', 'LlamaIndex', 'PyTorch', 'Hugging Face', 'FastAPI', 'Streamlit'],
    tools: ['Docker', 'ChromaDB', 'Pinecone', 'Qdrant', 'Git', 'Postman', 'GCP'],
  },
  {
    role: 'Computer Vision & Robotics Engineer',
    category: 'Robotics & Edge AI',
    skills: ['Computer Vision', 'Robotics', 'SLAM', 'Sensor Fusion', 'Object Detection', 'Deep Learning', 'Path Planning', 'Image Processing'],
    programming_languages: ['Python', 'C++', 'C', 'MATLAB'],
    frameworks: ['ROS2', 'OpenCV', 'PyTorch', 'TensorRT', 'Ultralytics YOLO', 'TensorFlow'],
    tools: ['Gazebo', 'RViz', 'Linux', 'Docker', 'Git', 'NVIDIA Jetson'],
  },
  {
    role: 'Data Scientist / Data Analyst',
    category: 'AI & Data',
    skills: ['Data Analysis', 'Statistical Modeling', 'Machine Learning', 'Data Visualization', 'Hypothesis Testing', 'ETL Pipelines', 'Business Intelligence'],
    programming_languages: ['Python', 'SQL', 'R'],
    frameworks: ['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'SciPy'],
    tools: ['Power BI', 'Tableau', 'Excel', 'Jupyter', 'Git', 'BigQuery', 'Snowflake'],
  },
  {
    role: 'Data Engineer',
    category: 'AI & Data',
    skills: ['Data Engineering', 'ETL Pipelines', 'Data Warehousing', 'Distributed Systems', 'Stream Processing', 'Data Modeling', 'Cloud Architecture'],
    programming_languages: ['Python', 'SQL', 'Scala', 'Java'],
    frameworks: ['Apache Spark', 'PySpark', 'Apache Kafka', 'Apache Airflow', 'dbt'],
    tools: ['Snowflake', 'Databricks', 'AWS', 'GCP', 'Docker', 'Git', 'Terraform'],
  },
  {
    role: 'Full Stack Developer',
    category: 'Software Engineering',
    skills: ['Full Stack Development', 'REST APIs', 'Database Design', 'Authentication', 'Responsive Design', 'State Management', 'System Design', 'Data Structures'],
    programming_languages: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML/CSS'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Prisma'],
    tools: ['Git', 'PostgreSQL', 'MongoDB', 'Postman', 'Vercel', 'VS Code'],
  },
  {
    role: 'Web Developer',
    category: 'Web & UI Engineering',
    skills: ['Web Development', 'Responsive UI/UX', 'DOM Manipulation', 'REST APIs', 'Web Performance', 'Cross-Browser Compatibility', 'Accessibility (WCAG)', 'SEO Fundamentals'],
    programming_languages: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'SQL'],
    frameworks: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'Bootstrap'],
    tools: ['Git', 'GitHub', 'VS Code', 'Figma', 'Chrome DevTools', 'Vite', 'Postman', 'Vercel'],
  },
  {
    role: 'Frontend Developer (React / Next.js)',
    category: 'Software Engineering',
    skills: ['Frontend Development', 'Responsive UI/UX', 'State Management', 'Web Performance', 'Component Architecture', 'REST & GraphQL APIs', 'Accessibility'],
    programming_languages: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3'],
    frameworks: ['React', 'Next.js', 'Tailwind CSS', 'Redux Toolkit', 'Vue.js', 'Angular', 'Framer Motion'],
    tools: ['Git', 'Vite', 'Webpack', 'Figma', 'Jest', 'Cypress', 'Postman'],
  },
  {
    role: 'Backend Software Engineer',
    category: 'Software Engineering',
    skills: ['Backend Engineering', 'Microservices', 'REST APIs', 'GraphQL', 'System Design', 'Database Optimization', 'Caching', 'Concurrency'],
    programming_languages: ['Python', 'Java', 'Go', 'TypeScript', 'SQL'],
    frameworks: ['Node.js', 'Express.js', 'FastAPI', 'Spring Boot', 'Django', 'NestJS'],
    tools: ['Docker', 'PostgreSQL', 'Redis', 'MongoDB', 'Kafka', 'Git', 'Linux', 'AWS'],
  },
  {
    role: 'Java / Spring Boot Developer',
    category: 'Software Engineering',
    skills: ['Object-Oriented Programming', 'Microservices', 'RESTful Web Services', 'Multithreading', 'Database Design', 'Data Structures', 'Unit Testing'],
    programming_languages: ['Java', 'SQL', 'JavaScript', 'Kotlin'],
    frameworks: ['Spring Boot', 'Spring Security', 'Hibernate', 'JPA', 'JUnit', 'Mockito'],
    tools: ['Maven', 'Gradle', 'Docker', 'MySQL', 'PostgreSQL', 'Git', 'Jenkins', 'Postman'],
  },
  {
    role: 'DevOps & Cloud Engineer',
    category: 'Cloud & Infrastructure',
    skills: ['CI/CD Pipelines', 'Cloud Infrastructure', 'Container Orchestration', 'Infrastructure as Code', 'Monitoring & Logging', 'Network Security', 'Site Reliability'],
    programming_languages: ['Python', 'Bash', 'Go', 'YAML'],
    frameworks: ['Terraform', 'Ansible', 'Helm', 'Prometheus', 'Grafana'],
    tools: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Jenkins', 'GitHub Actions', 'Linux'],
  },
  {
    role: 'Mobile App Developer (Flutter / React Native)',
    category: 'Mobile Engineering',
    skills: ['Cross-Platform Mobile Development', 'Mobile UI/UX', 'State Management', 'Offline Storage', 'Push Notifications', 'REST API Integration'],
    programming_languages: ['Dart', 'TypeScript', 'JavaScript', 'Kotlin', 'Swift'],
    frameworks: ['Flutter', 'React Native', 'Expo', 'Firebase SDK'],
    tools: ['Android Studio', 'Xcode', 'Firebase', 'Git', 'Postman', 'Figma'],
  },
  {
    role: 'Cybersecurity Engineer / Analyst',
    category: 'Security',
    skills: ['Network Security', 'Vulnerability Assessment', 'Penetration Testing', 'OWASP Top 10', 'Incident Response', 'Cryptography', 'SIEM Monitoring'],
    programming_languages: ['Python', 'Bash', 'C', 'SQL', 'PowerShell'],
    frameworks: ['NIST Framework', 'MITRE ATT&CK', 'Metasploit', 'OWASP'],
    tools: ['Wireshark', 'Nmap', 'Burp Suite', 'Kali Linux', 'Splunk', 'Linux', 'Git'],
  },
  {
    role: 'Embedded Systems & IoT Engineer',
    category: 'Robotics & Edge AI',
    skills: ['Embedded Systems', 'Microcontroller Programming', 'RTOS', 'PCB & Hardware Interfacing', 'IoT Protocols (MQTT, I2C, SPI)', 'Digital Signal Processing'],
    programming_languages: ['C', 'C++', 'Python', 'Verilog'],
    frameworks: ['FreeRTOS', 'ESP-IDF', 'Arduino', 'Zephyr RTOS'],
    tools: ['STM32', 'ESP32', 'Raspberry Pi', 'Oscilloscope / Logic Analyzer', 'Linux', 'Git'],
  },
  {
    role: 'QA & Automation Test Engineer',
    category: 'Software Engineering',
    skills: ['Test Automation', 'API Testing', 'End-to-End Testing', 'Regression Testing', 'Performance Testing', 'Bug Tracking', 'CI/CD Testing'],
    programming_languages: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL'],
    frameworks: ['Selenium', 'Playwright', 'Cypress', 'Pytest', 'TestNG', 'JUnit'],
    tools: ['Postman', 'JMeter', 'Jira', 'Git', 'Jenkins', 'GitHub Actions'],
  },
];

const ALL_SKILLS = Array.from(new Set(ROLE_CATALOG.flatMap((r) => r.skills)));
const ALL_LANGUAGES = Array.from(new Set(ROLE_CATALOG.flatMap((r) => r.programming_languages)));
const ALL_FRAMEWORKS = Array.from(new Set(ROLE_CATALOG.flatMap((r) => r.frameworks)));
const ALL_TOOLS = Array.from(new Set(ROLE_CATALOG.flatMap((r) => r.tools)));

const DEGREE_OPTIONS = ['B.Tech', 'B.E.', 'M.Tech', 'BCA', 'MCA', 'B.Sc (CS/IT)', 'M.Sc (CS/AI)', 'Diploma'];
const BRANCH_OPTIONS = [
  'Computer Science & Engineering (CSE)',
  'AI & Machine Learning',
  'AI & Robotics',
  'Data Science & Engineering',
  'Information Science / IT',
  'Electronics & Communication (ECE)',
  'Electrical & Electronics (EEE)',
  'Mechanical / Mechatronics',
];
const LOCATION_OPTIONS = [
  'Bengaluru, India',
  'Hyderabad, India',
  'Pune, India',
  'Mumbai, India',
  'Chennai, India',
  'Delhi NCR / Noida / Gurugram',
  'Remote, India',
  'India (All Cities)',
];

const PRESET_PROFILES: { label: string; desc: string; profile: Partial<UserProfile> }[] = [
  {
    label: 'AI & Robotics',
    desc: 'AI & Robotics template targeting autonomous systems',
    profile: {
      education: 'B.Tech',
      degree: 'B.Tech',
      branch: 'AI & Robotics',
      year: '3rd Year',
      graduation_year: '2026',
      preferred_role: 'Computer Vision & Robotics Engineer',
      preferred_location: 'Bengaluru, India',
      preferred_work_mode: 'Hybrid',
      experience_level: 'Student',
      skills: ['Python', 'C++', 'Machine Learning', 'Deep Learning', 'Robotics', 'ROS2', 'Computer Vision', 'SLAM'],
      programming_languages: ['Python', 'C++', 'C'],
      frameworks: ['PyTorch', 'ROS2', 'OpenCV', 'Ultralytics YOLO'],
      tools: ['Git', 'Linux', 'Gazebo', 'Docker', 'RViz'],
      projects: 'Autonomous mobile robot simulation with SLAM and LiDAR sensor fusion. Real-time object detection with YOLO and OpenCV.',
      resume_text: 'Engineering undergraduate specializing in AI & Robotics. Proficient in Python, C++, ROS2, and neural networks with hands-on projects in autonomous robotic navigation.',
    },
  },
  {
    label: 'GenAI & Data Science',
    desc: 'CSE template targeting LLMs and data science',
    profile: {
      education: 'B.Tech',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering (CSE)',
      year: 'Final Year',
      graduation_year: '2026',
      preferred_role: 'GenAI & LLM Engineer',
      preferred_location: 'Bengaluru, India',
      preferred_work_mode: 'Hybrid',
      experience_level: 'Fresh Graduate',
      skills: ['Generative AI', 'NLP', 'RAG Pipelines', 'Machine Learning', 'Vector Databases', 'Deep Learning', 'REST APIs'],
      programming_languages: ['Python', 'SQL', 'TypeScript'],
      frameworks: ['PyTorch', 'Hugging Face', 'FastAPI', 'LangChain', 'Scikit-learn'],
      tools: ['Git', 'Docker', 'ChromaDB', 'Postman'],
      projects: 'Retrieval Augmented Generation (RAG) assistant indexing Indian legal judgments. Sentiment analysis pipeline using fine-tuned BERT models.',
      resume_text: 'Computer Science student passionate about Generative AI architectures, vector databases, and scalable inference APIs.',
    },
  },
  {
    label: 'Full Stack Developer',
    desc: 'Modern Web Full-Stack template (React, Node.js, TypeScript)',
    profile: {
      education: 'B.Tech',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering (CSE)',
      year: 'Final Year',
      graduation_year: '2026',
      preferred_role: 'Full Stack Developer',
      preferred_location: 'Bengaluru, India',
      preferred_work_mode: 'Hybrid',
      experience_level: 'Fresh Graduate',
      skills: ['Full Stack Development', 'REST APIs', 'Database Design', 'Authentication', 'Responsive Design', 'State Management'],
      programming_languages: ['TypeScript', 'JavaScript', 'Python', 'SQL'],
      frameworks: ['React', 'Next.js', 'Node.js', 'Express.js', 'Tailwind CSS'],
      tools: ['Git', 'Docker', 'PostgreSQL', 'MongoDB', 'Postman'],
      projects: 'Real-time collaborative project management platform with role-based access control, REST APIs, and PostgreSQL.',
      resume_text: 'Full-stack developer experienced in building responsive React/Next.js web applications and scalable Node.js backend services.',
    },
  },
];

interface MultiSelectDropdownProps {
  label: string;
  icon: React.ReactNode;
  selectedItems: string[];
  allOptions: string[];
  recommendedOptions: string[];
  onAdd: (item: string) => void;
  onAddMultiple: (items: string[]) => void;
  onRemove: (item: string) => void;
  placeholder: string;
  badgeColorClass: string;
  accentColor: 'blue' | 'indigo' | 'purple' | 'pink';
  roleName?: string;
}

const MultiSelectSkillDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  icon,
  selectedItems,
  allOptions,
  recommendedOptions,
  onAdd,
  onAddMultiple,
  onRemove,
  placeholder,
  badgeColorClass,
  accentColor,
  roleName,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Merge recommended options first, then remaining catalog options
  const orderedOptions = useMemo(() => {
    const recSet = new Set(recommendedOptions);
    const combined = [
      ...recommendedOptions,
      ...allOptions.filter((opt) => !recSet.has(opt)),
    ];
    return combined.filter((opt) => !selectedItems.includes(opt));
  }, [allOptions, recommendedOptions, selectedItems]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orderedOptions;
    return orderedOptions.filter((opt) => opt.toLowerCase().includes(q));
  }, [orderedOptions, query]);

  const unselectedRecommended = useMemo(
    () => recommendedOptions.filter((opt) => !selectedItems.includes(opt)),
    [recommendedOptions, selectedItems]
  );

  const handleSelectOption = (opt: string) => {
    onAdd(opt);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 relative">
      <div className="flex items-center justify-between gap-2 mb-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          {icon}
          <span>
            {label} ({selectedItems.length})
          </span>
        </label>
      </div>

      {/* Input + Dropdown Toggle */}
      <div className="relative mb-2.5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (query.trim()) {
                    const exactMatch = filteredOptions.find(
                      (o) => o.toLowerCase() === query.trim().toLowerCase()
                    );
                    handleSelectOption(exactMatch || query.trim());
                  } else if (filteredOptions.length > 0) {
                    handleSelectOption(filteredOptions[0]);
                  }
                } else if (e.key === 'Escape') {
                  setIsOpen(false);
                }
              }}
              className="w-full pl-3 pr-8 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="absolute inset-y-0 right-0 px-2.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
              title="Toggle dropdown options"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
            </button>
          </div>

          {query.trim() && (
            <button
              type="button"
              onClick={() => handleSelectOption(query.trim())}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-medium hover:bg-blue-600/30 transition-colors cursor-pointer shrink-0"
            >
              Add
            </button>
          )}
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-40 left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5">
            {roleName && !query.trim() && unselectedRecommended.length > 0 && (
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/5 border-b border-slate-800">
                Suggested for {roleName}
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isRec = recommendedOptions.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    className="w-full px-3 py-2 text-left text-xs text-slate-200 hover:bg-blue-600/20 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="font-medium">{opt}</span>
                    <div className="flex items-center gap-1.5">
                      {isRec && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/25">
                          Recommended
                        </span>
                      )}
                      <Plus className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })
            ) : query.trim() ? (
              <button
                type="button"
                onClick={() => handleSelectOption(query.trim())}
                className="w-full px-3 py-2 text-left text-xs text-blue-300 hover:bg-blue-600/20 flex items-center justify-between cursor-pointer"
              >
                <span>Add custom: &ldquo;{query.trim()}&rdquo;</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="px-3 py-2 text-xs text-slate-500">All options selected</div>
            )}
          </div>
        )}
      </div>

      {/* Quick one-click suggestion pills */}
      {unselectedRecommended.length > 0 && (
        <div className="mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-500 font-medium">Quick add:</span>
            {unselectedRecommended.slice(0, 6).map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onAdd(sug)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-2.5 h-2.5 text-blue-400" />
                <span>{sug}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Chips */}
      <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
        {selectedItems.length > 0 ? (
          selectedItems.map((item, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs ${badgeColorClass}`}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="hover:text-rose-400 ml-1 cursor-pointer font-bold"
                title={`Remove ${item}`}
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="text-[11px] text-slate-500 italic">
            Click the dropdown above or quick-add buttons to select {label.toLowerCase()}.
          </span>
        )}
      </div>
    </div>
  );
};

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  setProfile,
  onSubmit,
  isLoading,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [degreeDropdownOpen, setDegreeDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const roleContainerRef = useRef<HTMLDivElement>(null);
  const locationContainerRef = useRef<HTMLDivElement>(null);
  const degreeContainerRef = useRef<HTMLDivElement>(null);
  const branchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (roleContainerRef.current && !roleContainerRef.current.contains(target)) {
        setRoleDropdownOpen(false);
      }
      if (locationContainerRef.current && !locationContainerRef.current.contains(target)) {
        setLocationDropdownOpen(false);
      }
      if (degreeContainerRef.current && !degreeContainerRef.current.contains(target)) {
        setDegreeDropdownOpen(false);
      }
      if (branchContainerRef.current && !branchContainerRef.current.contains(target)) {
        setBranchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find matching role config for current preferred_role (or closest match)
  const activeRoleConfig = useMemo<RoleStackConfig>(() => {
    const current = (profile.preferred_role || '').toLowerCase().trim();
    if (!current) return ROLE_CATALOG[0];
    const exact = ROLE_CATALOG.find((r) => r.role.toLowerCase() === current);
    if (exact) return exact;
    if (current.includes('web')) {
      return ROLE_CATALOG.find((r) => r.role === 'Web Developer') || ROLE_CATALOG[0];
    }
    if (current.includes('front') || current.includes('ui') || current.includes('react')) {
      return ROLE_CATALOG.find((r) => r.role.startsWith('Frontend')) || ROLE_CATALOG[0];
    }
    if (current.includes('full stack') || current.includes('fullstack') || current.includes('mern')) {
      return ROLE_CATALOG.find((r) => r.role === 'Full Stack Developer') || ROLE_CATALOG[0];
    }
    if (current.includes('back') || current.includes('api') || current.includes('node')) {
      return ROLE_CATALOG.find((r) => r.role === 'Backend Software Engineer') || ROLE_CATALOG[0];
    }
    if (current.includes('java') || current.includes('spring')) {
      return ROLE_CATALOG.find((r) => r.role.startsWith('Java')) || ROLE_CATALOG[0];
    }
    if (current.includes('data sci') || current.includes('analyst')) {
      return ROLE_CATALOG.find((r) => r.role.startsWith('Data Scientist')) || ROLE_CATALOG[0];
    }
    if (current.includes('data eng')) {
      return ROLE_CATALOG.find((r) => r.role === 'Data Engineer') || ROLE_CATALOG[0];
    }
    if (current.includes('mobile') || current.includes('android') || current.includes('ios') || current.includes('flutter')) {
      return ROLE_CATALOG.find((r) => r.role.startsWith('Mobile')) || ROLE_CATALOG[0];
    }
    if (current.includes('cyber') || current.includes('security')) {
      return ROLE_CATALOG.find((r) => r.role.startsWith('Cybersecurity')) || ROLE_CATALOG[0];
    }
    if (current.includes('qa') || current.includes('test')) {
      return ROLE_CATALOG.find((r) => r.role.startsWith('QA')) || ROLE_CATALOG[0];
    }
    if (current.includes('embedded') || current.includes('iot')) {
      return ROLE_CATALOG.find((r) => r.role.startsWith('Embedded')) || ROLE_CATALOG[0];
    }
    if (current.includes('devops') || current.includes('cloud')) {
      return ROLE_CATALOG.find((r) => r.role.startsWith('DevOps')) || ROLE_CATALOG[0];
    }
    const partial = ROLE_CATALOG.find(
      (r) =>
        r.role.toLowerCase().includes(current) ||
        current.includes(r.role.toLowerCase().split(' ')[0])
    );
    return partial || ROLE_CATALOG[0];
  }, [profile.preferred_role]);

  // Filter roles as user types
  const filteredRoles = useMemo(() => {
    const q = (profile.preferred_role || '').trim().toLowerCase();
    if (!q) return ROLE_CATALOG;
    const matches = ROLE_CATALOG.filter(
      (r) =>
        r.role.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.skills.some((s) => s.toLowerCase().includes(q))
    );
    return matches.length > 0 ? matches : ROLE_CATALOG;
  }, [profile.preferred_role]);

  const handleSelectRole = (roleConfig: RoleStackConfig) => {
    setProfile({
      ...profile,
      preferred_role: roleConfig.role,
    });
    setRoleDropdownOpen(false);
  };

  const handleAddSkill = (
    val: string,
    field: 'skills' | 'programming_languages' | 'frameworks' | 'tools'
  ) => {
    const trimmed = val.trim();
    if (trimmed && !profile[field].includes(trimmed)) {
      setProfile({
        ...profile,
        [field]: [...profile[field], trimmed],
      });
    }
  };

  const handleAddMultipleSkills = (
    items: string[],
    field: 'skills' | 'programming_languages' | 'frameworks' | 'tools'
  ) => {
    const merged = Array.from(new Set([...profile[field], ...items.map((i) => i.trim()).filter(Boolean)]));
    setProfile({
      ...profile,
      [field]: merged,
    });
  };

  const handleRemoveSkill = (
    item: string,
    field: 'skills' | 'programming_languages' | 'frameworks' | 'tools'
  ) => {
    setProfile({
      ...profile,
      [field]: profile[field].filter((s) => s !== item),
    });
  };

  const loadPreset = (preset: Partial<UserProfile>) => {
    setProfile({
      ...profile,
      ...preset,
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Your Candidate Profile</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Select your Target Role and skills from the interactive dropdowns or start typing to filter related skills automatically.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Quick Fill Templates:
          </span>
          {PRESET_PROFILES.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p.profile)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title={p.desc}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() =>
              setProfile({
                name: '',
                education: '',
                college: '',
                degree: '',
                branch: '',
                year: '3rd Year',
                graduation_year: '',
                preferred_role: '',
                preferred_location: '',
                preferred_work_mode: 'Hybrid',
                experience_level: 'Student',
                skills: [],
                programming_languages: [],
                frameworks: [],
                tools: [],
                projects: '',
                resume_text: '',
              })
            }
            className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 transition-colors cursor-pointer"
            title="Clear all fields and skills"
          >
            Clear All
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-6"
      >
        {/* Row 1: Personal & College */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              College / University
            </label>
            <input
              type="text"
              value={profile.college}
              onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your college or university"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Degree &amp; Branch
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Degree Dropdown */}
              <div ref={degreeContainerRef} className="relative">
                <input
                  type="text"
                  value={profile.degree}
                  onFocus={() => setDegreeDropdownOpen(true)}
                  onChange={(e) => {
                    setProfile({ ...profile, degree: e.target.value, education: e.target.value });
                    setDegreeDropdownOpen(true);
                  }}
                  className="w-full pl-3 pr-7 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Degree (B.Tech)"
                />
                <button
                  type="button"
                  onClick={() => setDegreeDropdownOpen((p) => !p)}
                  className="absolute inset-y-0 right-0 px-2 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {degreeDropdownOpen && (
                  <div className="absolute z-40 left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1">
                    {DEGREE_OPTIONS.map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => {
                          setProfile({ ...profile, degree: deg, education: deg });
                          setDegreeDropdownOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-blue-600/20 hover:text-white cursor-pointer"
                      >
                        {deg}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Branch Dropdown */}
              <div ref={branchContainerRef} className="relative">
                <input
                  type="text"
                  value={profile.branch}
                  onFocus={() => setBranchDropdownOpen(true)}
                  onChange={(e) => {
                    setProfile({ ...profile, branch: e.target.value });
                    setBranchDropdownOpen(true);
                  }}
                  className="w-full pl-3 pr-7 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Branch (CSE / AI)"
                />
                <button
                  type="button"
                  onClick={() => setBranchDropdownOpen((p) => !p)}
                  className="absolute inset-y-0 right-0 px-2 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {branchDropdownOpen && (
                  <div className="absolute z-40 left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1 w-56">
                    {BRANCH_OPTIONS.map((br) => (
                      <button
                        key={br}
                        type="button"
                        onClick={() => {
                          setProfile({ ...profile, branch: br });
                          setBranchDropdownOpen(false);
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-blue-600/20 hover:text-white cursor-pointer"
                      >
                        {br}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Year, Target Role Dropdown, Location Dropdown, Work Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Current Year &amp; Grad
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={profile.year}
                onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                className="w-full px-2.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Fresh Graduate">Fresh Grad</option>
              </select>
              <select
                value={profile.graduation_year || '2026'}
                onChange={(e) => setProfile({ ...profile, graduation_year: e.target.value })}
                className="w-full px-2.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
              </select>
            </div>
          </div>

          {/* Target Role Dropdown with Auto-Skill Mapping */}
          <div ref={roleContainerRef} className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Role
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.preferred_role}
                onFocus={() => setRoleDropdownOpen(true)}
                onChange={(e) => {
                  setProfile({ ...profile, preferred_role: e.target.value });
                  setRoleDropdownOpen(true);
                }}
                className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Select or type target role..."
                required
              />
              <button
                type="button"
                onClick={() => setRoleDropdownOpen((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-2.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                title="Browse Target Roles"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${roleDropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
              </button>
            </div>

            {roleDropdownOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1.5 max-h-64 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1.5 min-w-[270px]">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Select a Role (Auto-suggests matching skills)
                </div>
                {filteredRoles.map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleSelectRole(item)}
                    className="w-full px-3.5 py-2 text-left hover:bg-blue-600/20 transition-colors flex flex-col gap-0.5 border-b border-slate-800/40 last:border-none cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{item.role}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-blue-300">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate">
                      Suggested: {item.skills.slice(0, 4).join(', ')}...
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Location Dropdown */}
          <div ref={locationContainerRef} className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Preferred Location
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.preferred_location}
                onFocus={() => setLocationDropdownOpen(true)}
                onChange={(e) => {
                  setProfile({ ...profile, preferred_location: e.target.value });
                  setLocationDropdownOpen(true);
                }}
                className="w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Select or type location..."
              />
              <button
                type="button"
                onClick={() => setLocationDropdownOpen((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-2.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${locationDropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
              </button>
            </div>

            {locationDropdownOpen && (
              <div className="absolute z-40 left-0 right-0 mt-1.5 max-h-52 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1">
                {LOCATION_OPTIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setProfile({ ...profile, preferred_location: loc });
                      setLocationDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-blue-600/20 hover:text-white transition-colors cursor-pointer"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Work Mode &amp; Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={profile.preferred_work_mode}
                onChange={(e) => setProfile({ ...profile, preferred_work_mode: e.target.value })}
                className="w-full px-2 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Any">Any</option>
              </select>
              <select
                value={profile.experience_level}
                onChange={(e) => setProfile({ ...profile, experience_level: e.target.value })}
                className="w-full px-2 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="Student">Student</option>
                <option value="Internship">Internship</option>
                <option value="Fresh Graduate">Fresh Grad</option>
                <option value="0-1 Years">0-1 Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Role-Based Suggestions Notice */}
        {profile.preferred_role.trim() && (
          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-slate-300">
            <span className="font-semibold text-blue-300">
              Suggestions updated for {activeRoleConfig.role}:
            </span>{' '}
            Open any dropdown below or click the suggested options to pick only the skills, languages, frameworks, and tools you know.
          </div>
        )}

        {/* Row 3: Interactive Autocomplete & Dropdowns for Skills, Languages, Frameworks, Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MultiSelectSkillDropdown
            label="Core Technical Skills"
            icon={<Cpu className="w-3.5 h-3.5 text-blue-400" />}
            selectedItems={profile.skills}
            allOptions={ALL_SKILLS}
            recommendedOptions={activeRoleConfig.skills}
            onAdd={(item) => handleAddSkill(item, 'skills')}
            onAddMultiple={(items) => handleAddMultipleSkills(items, 'skills')}
            onRemove={(item) => handleRemoveSkill(item, 'skills')}
            placeholder="Select from dropdown or start typing skill..."
            badgeColorClass="bg-blue-500/10 text-blue-300 border-blue-500/20"
            accentColor="blue"
            roleName={profile.preferred_role.trim() ? activeRoleConfig.role : undefined}
          />

          <MultiSelectSkillDropdown
            label="Programming Languages"
            icon={<Code className="w-3.5 h-3.5 text-indigo-400" />}
            selectedItems={profile.programming_languages}
            allOptions={ALL_LANGUAGES}
            recommendedOptions={activeRoleConfig.programming_languages}
            onAdd={(item) => handleAddSkill(item, 'programming_languages')}
            onAddMultiple={(items) => handleAddMultipleSkills(items, 'programming_languages')}
            onRemove={(item) => handleRemoveSkill(item, 'programming_languages')}
            placeholder="Select from dropdown or type language (e.g. Python)..."
            badgeColorClass="bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
            accentColor="indigo"
            roleName={profile.preferred_role.trim() ? activeRoleConfig.role : undefined}
          />

          <MultiSelectSkillDropdown
            label="Frameworks & Libraries"
            icon={<Cpu className="w-3.5 h-3.5 text-purple-400" />}
            selectedItems={profile.frameworks}
            allOptions={ALL_FRAMEWORKS}
            recommendedOptions={activeRoleConfig.frameworks}
            onAdd={(item) => handleAddSkill(item, 'frameworks')}
            onAddMultiple={(items) => handleAddMultipleSkills(items, 'frameworks')}
            onRemove={(item) => handleRemoveSkill(item, 'frameworks')}
            placeholder="Select from dropdown or type framework (e.g. React, PyTorch)..."
            badgeColorClass="bg-purple-500/10 text-purple-300 border-purple-500/20"
            accentColor="purple"
            roleName={profile.preferred_role.trim() ? activeRoleConfig.role : undefined}
          />

          <MultiSelectSkillDropdown
            label="Developer Tools & Systems"
            icon={<Wrench className="w-3.5 h-3.5 text-pink-400" />}
            selectedItems={profile.tools}
            allOptions={ALL_TOOLS}
            recommendedOptions={activeRoleConfig.tools}
            onAdd={(item) => handleAddSkill(item, 'tools')}
            onAddMultiple={(items) => handleAddMultipleSkills(items, 'tools')}
            onRemove={(item) => handleRemoveSkill(item, 'tools')}
            placeholder="Select from dropdown or type tool (e.g. Docker, Git)..."
            badgeColorClass="bg-pink-500/10 text-pink-300 border-pink-500/20"
            accentColor="pink"
            roleName={profile.preferred_role.trim() ? activeRoleConfig.role : undefined}
          />
        </div>

        {/* Row 4: Projects & Resume Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Key Academic / Capstone Projects
            </label>
            <textarea
              rows={3}
              value={profile.projects}
              onChange={(e) => setProfile({ ...profile, projects: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
              placeholder="Describe your 1-2 major projects (optional, boosts match precision)..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Resume Text / Summary
            </label>
            <textarea
              rows={3}
              value={profile.resume_text}
              onChange={(e) => setProfile({ ...profile, resume_text: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
              placeholder="Paste your resume summary or objective statement (optional)..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile stored locally during session. Zero credentials logged.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running Agent Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Find My Opportunities</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
