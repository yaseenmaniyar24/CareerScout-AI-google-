import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config({ path: ['.env', '.env.example'] });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const serpApiKey = process.env.SERPAPI_API_KEY || '';
const demoModeEnv = (process.env.DEMO_MODE || 'false').toLowerCase() === 'true';

let aiClient: GoogleGenAI | null = null;
if (geminiApiKey && !geminiApiKey.startsWith('your_') && !geminiApiKey.startsWith('MY_')) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Curated realistic demo jobs for Indian college students & fresh graduates
const SAMPLE_INDIAN_TECH_JOBS = [
  {
    title: 'AI/ML Engineer Intern',
    company_name: 'Sarvam AI',
    location: 'Bengaluru, Karnataka, India',
    description: 'Sarvam AI is developing sovereign foundational AI models tailored for Indian languages. We are seeking an ambitious AI/ML Intern to join our core research engineering squad. Key requirements: Solid foundation in Python, PyTorch, Transformer architectures, and Deep Learning fundamentals. Experience training or fine-tuning open-source LLMs (Llama, Gemma, Mistral) or Indic NLP datasets is a strong plus. Hands-on exposure to CUDA and distributed training frameworks is desirable. You will work directly with our senior research scientists on high-throughput model training, tokenization pipelines, and benchmark evaluations.',
    detected_extensions: {
      posted_at: '1 day ago',
      schedule_type: 'Internship (6 Months)',
      salary: '₹45,000 - ₹65,000 / month',
    },
    apply_options: [
      { title: 'Sarvam AI Careers', link: 'https://www.sarvam.ai/careers' },
    ],
    via: 'LinkedIn Jobs via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&h=120&fit=crop',
  },
  {
    title: 'Computer Vision & Robotics Intern',
    company_name: 'Addverb Technologies',
    location: 'Noida / Pune (Hybrid), India',
    description: 'Addverb Technologies builds state-of-the-art warehouse automation robots and autonomous mobile robots (AMRs). Responsibilities: Implement real-time 3D perception algorithms, SLAM (Simultaneous Localization and Mapping), and object detection using YOLOv8/v10 and OpenCV. Qualifications: B.Tech/M.Tech in AI, Robotics, Mechatronics, or CSE. Good proficiency in C++, Python, ROS/ROS2, Gazebo simulation, and Linux environments. Understanding of Kalman filters and path planning (A*, Dijkstra) is beneficial.',
    detected_extensions: {
      posted_at: '2 days ago',
      schedule_type: 'Internship / Trainee',
      salary: '₹35,000 - ₹50,000 / month',
    },
    apply_options: [
      { title: 'Addverb Portal', link: 'https://addverb.com/careers/' },
    ],
    via: 'Naukri.com via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&h=120&fit=crop',
  },
  {
    title: 'Junior Machine Learning Engineer',
    company_name: 'Krutrim SI Designs',
    location: 'Bengaluru, Karnataka, India',
    description: 'Join Krutrim AI Labs building sovereign AI computing stack and cloud models for India. We are seeking fresh engineering graduates and final year students with strong analytical and programming skills. Key requirements: Python, TensorFlow or PyTorch, Scikit-learn, Vector databases (Pinecone, Milvus), FastAPI for microservices, and Docker. Candidates should possess strong computer science fundamentals, data structures, and algorithmic optimization. Prior academic projects in generative AI or computer vision are highly regarded.',
    detected_extensions: {
      posted_at: 'Just now',
      schedule_type: 'Full-time (Entry Level)',
      salary: '₹8.5 - ₹12.0 LPA',
    },
    apply_options: [
      { title: 'Krutrim Careers', link: 'https://krutrim.ai/careers' },
    ],
    via: 'Foundit via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&h=120&fit=crop',
  },
  {
    title: 'Robotics Software Engineer Intern (ROS2 / Simulation)',
    company_name: 'Ati Motors',
    location: 'Bengaluru, Karnataka, India',
    description: 'Ati Motors manufactures autonomous electric vehicles for industrial haulage and factory logistics. We are looking for bright robotics students with hands-on experience in autonomous navigation. Required skills: Strong C++ and Python skills. Solid experience with ROS2, Gazebo, RViz, and TF coordinate transforms. Exposure to sensor fusion (LiDAR, IMU, Wheel Odometry) and point cloud processing (PCL). Passion for real-world hardware deployment and field diagnostics.',
    detected_extensions: {
      posted_at: '4 days ago',
      schedule_type: 'Internship (6 Months)',
      salary: '₹40,000 - ₹55,000 / month',
    },
    apply_options: [
      { title: 'Ati Motors Careers', link: 'https://www.atimotors.com/careers' },
    ],
    via: 'Instahyre via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=120&h=120&fit=crop',
  },
  {
    title: 'Data Science & GenAI Intern',
    company_name: 'Fractal Analytics',
    location: 'Gurugram / Mumbai / Remote, India',
    description: 'Fractal is a premier global AI partner to Fortune 500 companies. As an intern, you will build data pipelines, analyze multivariate datasets, and evaluate generative AI agent workflows using LangChain and Gemini models. Tech stack: Python, Pandas, NumPy, Scikit-Learn, SQL, LangChain/LlamaIndex, Streamlit/FastAPI. Excellent communication and statistical reasoning skills required. Open to B.Tech/B.E./M.Sc (2025/2026 batches).',
    detected_extensions: {
      posted_at: '2 days ago',
      schedule_type: 'Internship to PPO',
      salary: '₹40,000 / month',
    },
    apply_options: [
      { title: 'Fractal Careers', link: 'https://fractal.ai/careers/' },
    ],
    via: 'LinkedIn Jobs via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=120&fit=crop',
  },
  {
    title: 'Entry-Level Deep Learning Research Associate',
    company_name: 'Wadhwani AI',
    location: 'Bengaluru / Mumbai, India',
    description: 'Wadhwani AI is an independent non-profit institute developing AI solutions for social good in agriculture, healthcare, and education. We invite graduating seniors with strong foundations in PyTorch, Computer Vision (segmentation, classification), and Python. You will assist in deploying lightweight deep learning models on edge devices and smartphones for low-connectivity rural settings.',
    detected_extensions: {
      posted_at: '5 days ago',
      schedule_type: 'Full-time (Fresh Graduate)',
      salary: '₹9.0 - ₹11.5 LPA',
    },
    apply_options: [
      { title: 'Wadhwani AI Openings', link: 'https://wadhwaniai.org/careers' },
    ],
    via: 'Google Jobs via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=120&h=120&fit=crop',
  },
  {
    title: 'Autonomous Systems & Perception Intern',
    company_name: 'Tonbo Imaging',
    location: 'Bengaluru, Karnataka, India',
    description: 'Tonbo Imaging designs cutting-edge electro-optics and autonomous vision systems. We seek an intern specializing in infrared perception, camera calibration, embedded C++, and OpenCV. Opportunity to experiment with NVIDIA Jetson Xavier/Orin, TensorRT inference optimization, and deep learning model pruning.',
    detected_extensions: {
      posted_at: '1 week ago',
      schedule_type: 'Internship',
      salary: '₹35,000 - ₹45,000 / month',
    },
    apply_options: [
      { title: 'Tonbo Careers', link: 'https://tonboimaging.com/careers' },
    ],
    via: 'Indeed via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=120&h=120&fit=crop',
  },
  {
    title: 'Software Engineer Intern - Backend & AI Integration',
    company_name: 'Postman India',
    location: 'Bengaluru / Remote, India',
    description: 'Postman is looking for aspiring software engineering interns who love APIs, scalable backend systems, and AI tooling. Required: Strong problem solving in Python, TypeScript, or Go. Experience building RESTful APIs, Git workflows, PostgreSQL, and unit testing. Familiarity with AI developer tools and LLM integrations is a great advantage.',
    detected_extensions: {
      posted_at: '3 days ago',
      schedule_type: 'Internship (Summer / 6 Months)',
      salary: '₹75,000 / month',
    },
    apply_options: [
      { title: 'Postman Careers', link: 'https://www.postman.com/company/careers/' },
    ],
    via: 'LinkedIn Jobs via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&h=120&fit=crop',
  },
  {
    title: 'Web Developer Intern (React / Next.js)',
    company_name: 'Razorpay',
    location: 'Bengaluru, Karnataka, India',
    description: 'Razorpay is seeking a Web Developer Intern to build responsive, high-performance web experiences and payment checkout dashboards. Key requirements: Strong proficiency in HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Next.js, and Tailwind CSS. Experience with REST API integration, state management, responsive UI design, Chrome DevTools, and Git. Focus on Core Web Vitals, accessibility (WCAG), and cross-browser compatibility.',
    detected_extensions: {
      posted_at: '1 day ago',
      schedule_type: 'Internship (6 Months)',
      salary: '₹50,000 - ₹65,000 / month',
    },
    apply_options: [
      { title: 'Razorpay Careers', link: 'https://razorpay.com/jobs/' },
    ],
    via: 'LinkedIn Jobs via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=120&h=120&fit=crop',
  },
  {
    title: 'Frontend Web Developer (Entry Level)',
    company_name: 'Zerodha',
    location: 'Bengaluru / Remote, India',
    description: 'Join Zerodha tech team to build lightning-fast financial web applications and trading dashboards. Requirements: Solid command of JavaScript, TypeScript, React.js or Vue.js, HTML5, CSS3, and Tailwind CSS. Deep understanding of DOM manipulation, browser rendering performance, REST APIs, WebSockets, and Git. Passion for clean, minimal UI engineering and web performance optimization.',
    detected_extensions: {
      posted_at: '2 days ago',
      schedule_type: 'Full-time (Fresh Graduate)',
      salary: '₹10.0 - ₹14.0 LPA',
    },
    apply_options: [
      { title: 'Zerodha Careers', link: 'https://zerodha.com/careers/' },
    ],
    via: 'Instahyre via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&h=120&fit=crop',
  },
  {
    title: 'Full Stack Web Developer Intern',
    company_name: 'Cred',
    location: 'Bengaluru, Karnataka, India',
    description: 'CRED is hiring Full Stack Web Developer Interns to craft high-trust web portals and internal product tools. Tech stack: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Node.js, Express.js, PostgreSQL, and REST APIs. Candidates should demonstrate strong frontend UI sensibility, responsive web design, authentication flows, and Git version control.',
    detected_extensions: {
      posted_at: '2 days ago',
      schedule_type: 'Internship to PPO',
      salary: '₹60,000 / month',
    },
    apply_options: [
      { title: 'CRED Careers', link: 'https://careers.cred.club/' },
    ],
    via: 'LinkedIn Jobs via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&h=120&fit=crop',
  },
  {
    title: 'Junior Web & UI Developer',
    company_name: 'Zoho Corporation',
    location: 'Chennai / Tenkasi, Tamil Nadu, India',
    description: 'Zoho invites fresh engineering graduates and final-year students for the Web Developer role. Responsibilities: Develop interactive enterprise web applications using HTML5, CSS3, JavaScript, TypeScript, and React. Optimize client-side performance, build reusable UI components, integrate RESTful web services, and ensure seamless mobile/desktop responsiveness.',
    detected_extensions: {
      posted_at: '3 days ago',
      schedule_type: 'Full-time (Entry Level)',
      salary: '₹8.0 - ₹10.5 LPA',
    },
    apply_options: [
      { title: 'Zoho Careers', link: 'https://www.zoho.com/careers/' },
    ],
    via: 'Naukri.com via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&h=120&fit=crop',
  },
  {
    title: 'Backend Software Engineer Intern (Java / Node.js)',
    company_name: 'Swiggy',
    location: 'Bengaluru / Remote, India',
    description: 'Swiggy Engineering is looking for Backend Interns to work on high-concurrency logistics and order management microservices. Requirements: Strong foundation in Java (Spring Boot) or Node.js/TypeScript, SQL (PostgreSQL/MySQL), Redis caching, REST APIs, Data Structures & Algorithms, and Git.',
    detected_extensions: {
      posted_at: '1 day ago',
      schedule_type: 'Internship (6 Months)',
      salary: '₹55,000 / month',
    },
    apply_options: [
      { title: 'Swiggy Careers', link: 'https://careers.swiggy.com/' },
    ],
    via: 'LinkedIn Jobs via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&h=120&fit=crop',
  },
  {
    title: 'Data Analyst & Business Intelligence Intern',
    company_name: 'Flipkart',
    location: 'Bengaluru, Karnataka, India',
    description: 'Join Flipkart Analytics team to drive e-commerce supply chain and customer funnel insights. Key skills: Advanced SQL, Python (Pandas, NumPy), Power BI / Tableau, Excel, exploratory data analysis, A/B testing, and statistical modeling.',
    detected_extensions: {
      posted_at: '3 days ago',
      schedule_type: 'Internship',
      salary: '₹45,000 / month',
    },
    apply_options: [
      { title: 'Flipkart Careers', link: 'https://www.flipkartcareers.com/' },
    ],
    via: 'Google Jobs via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=120&fit=crop',
  },
  {
    title: 'Mobile App Developer Intern (Flutter / React Native)',
    company_name: 'PhonePe',
    location: 'Bengaluru / Pune, India',
    description: 'PhonePe is seeking Mobile Engineering Interns to build smooth 60fps cross-platform mobile experiences. Required: Flutter (Dart) or React Native (TypeScript), mobile UI/UX architecture, REST API integration, state management, offline SQLite storage, and Git.',
    detected_extensions: {
      posted_at: '4 days ago',
      schedule_type: 'Internship (6 Months)',
      salary: '₹50,000 / month',
    },
    apply_options: [
      { title: 'PhonePe Careers', link: 'https://www.phonepe.com/careers/' },
    ],
    via: 'LinkedIn Jobs via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=120&h=120&fit=crop',
  },
  {
    title: 'QA & SDET Automation Engineer Intern',
    company_name: 'Freshworks',
    location: 'Chennai / Bengaluru, India',
    description: 'Freshworks is hiring SDET Interns to build automated end-to-end and API testing suites. Key skills: Playwright, Selenium, Cypress, Python or Java/TypeScript, Postman API testing, Git, and CI/CD test pipelines.',
    detected_extensions: {
      posted_at: '2 days ago',
      schedule_type: 'Internship to Full-time',
      salary: '₹40,000 / month',
    },
    apply_options: [
      { title: 'Freshworks Careers', link: 'https://www.freshworks.com/company/careers/' },
    ],
    via: 'Foundit via SerpApi',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&h=120&fit=crop',
  },
];

function getRoleFilteredDemoJobs(preferredRole: string) {
  const r = (preferredRole || '').toLowerCase().trim();
  if (!r) return SAMPLE_INDIAN_TECH_JOBS;

  let filtered = SAMPLE_INDIAN_TECH_JOBS;
  if (r.includes('web') || r.includes('front') || r.includes('react') || r.includes('ui') || r.includes('full stack') || r.includes('fullstack') || r.includes('mern') || r.includes('next')) {
    filtered = SAMPLE_INDIAN_TECH_JOBS.filter((j) =>
      /web|frontend|full stack|ui|react|postman/i.test(`${j.title} ${j.description}`)
    );
  } else if (r.includes('back') || r.includes('java') || r.includes('spring') || r.includes('node') || r.includes('api') || r.includes('software') || r.includes('sde')) {
    filtered = SAMPLE_INDIAN_TECH_JOBS.filter((j) =>
      /backend|software|full stack|java|node|api/i.test(`${j.title} ${j.description}`)
    );
  } else if (r.includes('data') || r.includes('analy') || r.includes('bi') || r.includes('sql')) {
    filtered = SAMPLE_INDIAN_TECH_JOBS.filter((j) =>
      /data|analyst|analytics|bi/i.test(`${j.title} ${j.description}`)
    );
  } else if (r.includes('mobile') || r.includes('flutter') || r.includes('android') || r.includes('ios') || r.includes('react native')) {
    filtered = SAMPLE_INDIAN_TECH_JOBS.filter((j) =>
      /mobile|flutter|react native|android|ios|frontend|web/i.test(`${j.title} ${j.description}`)
    );
  } else if (r.includes('qa') || r.includes('test') || r.includes('sdet')) {
    filtered = SAMPLE_INDIAN_TECH_JOBS.filter((j) =>
      /qa|sdet|test|automation|software/i.test(`${j.title} ${j.description}`)
    );
  } else if (r.includes('robot') || r.includes('vision') || r.includes('embedded') || r.includes('iot')) {
    filtered = SAMPLE_INDIAN_TECH_JOBS.filter((j) =>
      /robot|vision|autonomous|embedded/i.test(`${j.title} ${j.description}`)
    );
  } else if (r.includes('ai') || r.includes('ml') || r.includes('machine learning') || r.includes('deep learning') || r.includes('genai') || r.includes('llm')) {
    filtered = SAMPLE_INDIAN_TECH_JOBS.filter((j) =>
      /ai|ml|machine learning|deep learning|genai|data science/i.test(`${j.title} ${j.description}`)
    );
  }

  return filtered.length > 0 ? filtered : SAMPLE_INDIAN_TECH_JOBS;
}

const TECH_KEYWORDS_MAP: Record<string, string[]> = {
  python: ['python', 'py', 'python3'],
  javascript: ['javascript', 'js', 'es6', 'ecmascript'],
  typescript: ['typescript', 'ts'],
  java: ['java', 'core java', 'j2ee', 'jvm'],
  'c++': ['c++', 'cpp'],
  c: ['c language', 'ansi c', 'embedded c'],
  'c#': ['c#', 'csharp', '.net', 'dotnet'],
  golang: ['golang', 'go language'],
  rust: ['rust'],
  kotlin: ['kotlin'],
  swift: ['swift', 'ios'],
  php: ['php', 'laravel'],
  ruby: ['ruby', 'ruby on rails', 'rails'],
  sql: ['sql', 'postgresql', 'postgres', 'mysql', 'sqlite', 'pl/sql', 't-sql'],
  nosql: ['nosql', 'mongodb', 'mongoose', 'dynamodb', 'cassandra', 'couchdb'],
  redis: ['redis', 'memcached'],
  react: ['react', 'reactjs', 'react.js', 'react native'],
  'next.js': ['next.js', 'nextjs'],
  angular: ['angular', 'angularjs'],
  'vue.js': ['vue', 'vuejs', 'vue.js', 'nuxt'],
  'html/css': ['html', 'html5', 'css', 'css3', 'sass', 'scss'],
  'tailwind css': ['tailwind', 'tailwindcss'],
  'node.js': ['node.js', 'nodejs', 'express', 'express.js', 'nestjs'],
  'spring boot': ['spring boot', 'spring', 'hibernate', 'microservices'],
  django: ['django'],
  flask: ['flask'],
  fastapi: ['fastapi'],
  'rest api': ['rest api', 'restful', 'apis', 'graphql', 'grpc', 'postman'],
  'machine learning': ['machine learning', 'ml', 'statistical learning', 'predictive modeling'],
  'deep learning': ['deep learning', 'dl', 'neural networks', 'cnn', 'rnn', 'lstm'],
  tensorflow: ['tensorflow', 'tf', 'keras'],
  pytorch: ['pytorch', 'torch'],
  'scikit-learn': ['scikit-learn', 'sklearn'],
  'computer vision': ['computer vision', 'cv', 'opencv', 'yolo', 'image processing', 'tensorrt'],
  nlp: ['nlp', 'natural language processing', 'llm', 'llms', 'transformers', 'huggingface', 'bert', 'gpt', 'genai', 'generative ai', 'langchain', 'rag'],
  robotics: ['robotics', 'ros', 'ros2', 'slam', 'kinematics', 'gazebo', 'rviz', 'mechatronics', 'autonomous'],
  'data science': ['data science', 'data analysis', 'data analytics', 'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn'],
  'bi & analytics': ['tableau', 'power bi', 'powerbi', 'excel', 'looker', 'data visualization'],
  'big data': ['spark', 'pyspark', 'hadoop', 'kafka', 'airflow', 'etl', 'data engineering', 'snowflake', 'databricks'],
  docker: ['docker', 'container', 'containers', 'docker-compose', 'containerization'],
  kubernetes: ['kubernetes', 'k8s', 'helm'],
  aws: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'sagemaker'],
  gcp: ['gcp', 'google cloud', 'bigquery', 'vertex ai', 'cloud run'],
  azure: ['azure', 'microsoft azure'],
  'ci/cd & devops': ['ci/cd', 'jenkins', 'github actions', 'gitlab ci', 'terraform', 'ansible', 'devops'],
  linux: ['linux', 'ubuntu', 'unix', 'bash', 'shell scripting'],
  git: ['git', 'github', 'gitlab', 'version control'],
  testing: ['pytest', 'jest', 'junit', 'selenium', 'cypress', 'unit testing', 'automation testing', 'qa'],
  flutter: ['flutter', 'dart'],
  android: ['android', 'android sdk'],
  cybersecurity: ['cybersecurity', 'network security', 'penetration testing', 'owasp', 'cryptography', 'soc'],
  'embedded systems': ['embedded', 'microcontroller', 'arduino', 'raspberry pi', 'stm32', 'rtos', 'fpga', 'verilog', 'vhdl', 'iot'],
  'system design': ['system design', 'distributed systems', 'scalability', 'low latency', 'oop', 'object oriented'],
  dsa: ['data structures', 'algorithms', 'dsa', 'problem solving', 'leetcode'],
};

function normalizeText(text: string): string {
  return (text || '').toLowerCase().replace(/[-_]/g, ' ').trim();
}

function formatSkillName(raw: string): string {
  const specialMap: Record<string, string> = {
    'c++': 'C++',
    'c#': 'C#',
    sql: 'SQL',
    nosql: 'NoSQL',
    'html/css': 'HTML/CSS',
    'tailwind css': 'Tailwind CSS',
    'node.js': 'Node.js',
    'next.js': 'Next.js',
    'vue.js': 'Vue.js',
    'rest api': 'REST API',
    nlp: 'NLP',
    aws: 'AWS',
    gcp: 'GCP',
    'ci/cd & devops': 'CI/CD & DevOps',
    'bi & analytics': 'BI & Analytics',
    dsa: 'DSA',
  };
  const lower = raw.toLowerCase();
  if (specialMap[lower]) return specialMap[lower];
  return raw
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function classifySkills(
  candidateSkills: string[],
  jobDescription: string,
  jobTitle: string
) {
  const descClean = normalizeText(`${jobDescription} ${jobTitle}`);
  const candSkillsRaw = candidateSkills.map((s) => s.trim()).filter(Boolean);
  const candSkillsClean = candSkillsRaw.map(normalizeText).filter(Boolean);

  const jobRequiredDetected: string[] = [];

  // 1. Detect skills from TECH_KEYWORDS_MAP present in the job listing
  for (const [canonical, aliases] of Object.entries(TECH_KEYWORDS_MAP)) {
    for (const alias of aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'i');
      if (regex.test(descClean)) {
        if (!jobRequiredDetected.includes(canonical)) {
          jobRequiredDetected.push(canonical);
        }
        break;
      }
    }
  }

  // 2. Also check any custom skills the candidate entered directly against the job listing
  for (const candSkill of candSkillsClean) {
    if (candSkill.length < 2) continue;
    const alreadyCovered = jobRequiredDetected.some((req) => {
      const aliases = TECH_KEYWORDS_MAP[req] || [req];
      return req === candSkill || aliases.includes(candSkill);
    });
    if (!alreadyCovered) {
      const escaped = candSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'i');
      if (regex.test(descClean)) {
        jobRequiredDetected.push(candSkill);
      }
    }
  }

  // 3. Role-intelligent fallback only if job description is very brief and < 2 skills were detected
  if (jobRequiredDetected.length < 2) {
    if (/frontend|react|ui|web|angular|vue/i.test(descClean)) {
      jobRequiredDetected.push('javascript', 'react', 'html/css', 'typescript', 'git');
    } else if (/backend|node|java|spring|api|Django/i.test(descClean)) {
      jobRequiredDetected.push('rest api', 'sql', 'git', 'docker', 'system design');
    } else if (/data|analyst|analytics|bi/i.test(descClean)) {
      jobRequiredDetected.push('sql', 'python', 'data science', 'bi & analytics');
    } else if (/robotics|robot|ros|embedded/i.test(descClean)) {
      jobRequiredDetected.push('robotics', 'python', 'c++', 'linux');
    } else if (/machine learning|ml|ai|deep learning|vision|nlp/i.test(descClean)) {
      jobRequiredDetected.push('python', 'machine learning', 'deep learning', 'pytorch');
    } else {
      jobRequiredDetected.push('dsa', 'git', 'sql');
    }
  }

  const uniqueRequired = Array.from(new Set(jobRequiredDetected));
  const matched: string[] = [];
  const partial: string[] = [];
  const missing: string[] = [];
  const breakdown: any[] = [];

  for (const req of uniqueRequired) {
    const reqAliases = TECH_KEYWORDS_MAP[req] || [req];
    let isExact = false;
    let isPartial = false;

    for (const cand of candSkillsClean) {
      for (const alias of reqAliases) {
        if (cand === alias || cand === req) {
          isExact = true;
          break;
        } else if (
          (cand.length >= 3 && alias.includes(cand)) ||
          (alias.length >= 3 && cand.includes(alias))
        ) {
          isPartial = true;
        }
      }
      if (isExact) break;
    }

    const displaySkill = formatSkillName(req);

    if (isExact) {
      matched.push(displaySkill);
      breakdown.push({
        skill: displaySkill,
        user_level: 90,
        required_level: 80,
        status: 'MATCHED',
        importance: 'CRITICAL',
      });
    } else if (isPartial) {
      partial.push(displaySkill);
      breakdown.push({
        skill: displaySkill,
        user_level: 55,
        required_level: 75,
        status: 'PARTIAL',
        importance: 'IMPORTANT',
      });
    } else {
      missing.push(displaySkill);
      breakdown.push({
        skill: displaySkill,
        user_level: 15,
        required_level: 75,
        status: 'MISSING',
        importance: 'IMPORTANT',
      });
    }
  }

  return { matched, partial, missing, breakdown };
}

function calculateDeterministicMatchScore(profile: any, job: any) {
  const title = (job.title || '').toLowerCase();
  const desc = (job.description || '').toLowerCase();
  const loc = (job.location || '').toLowerCase();
  const applyUrl = job.apply_url || '';

  const candSkills = profile.skills || [];
  const candLangs = profile.programming_languages || [];
  const candFrameworks = profile.frameworks || [];
  const candTools = profile.tools || [];
  const allCandSkills = Array.from(
    new Set([...candSkills, ...candLangs, ...candFrameworks, ...candTools].filter(Boolean))
  );

  // Also include keywords from candidate's projects & resume for richer matching
  const projectAndResumeText = normalizeText(`${profile.projects || ''} ${profile.resume_text || ''}`);

  const prefRole = (profile.preferred_role || '').toLowerCase().trim();
  const prefLoc = (profile.preferred_location || 'india').toLowerCase().trim();
  const expLevel = (profile.experience_level || 'student').toLowerCase().trim();

  // 1. Skill Match (35%)
  const { matched, partial, missing, breakdown } = classifySkills(allCandSkills, desc, title);
  // Check if any missing skills are actually mentioned in the candidate's projects/resume
  const promotedFromResume: string[] = [];
  for (let i = missing.length - 1; i >= 0; i--) {
    const mLower = normalizeText(missing[i]);
    if (mLower.length >= 3 && projectAndResumeText.includes(mLower)) {
      promotedFromResume.push(missing[i]);
      partial.push(missing[i]);
      missing.splice(i, 1);
    }
  }

  const totalReq = Math.max(matched.length + partial.length + missing.length, 1);
  const skillScoreVal = ((matched.length * 1.0 + partial.length * 0.55) / totalReq) * 100;
  const skillScore = allCandSkills.length === 0 ? 15 : Math.min(Math.max(Math.round(skillScoreVal), 15), 100);

  // 2. Role Relevance (25%)
  const roleTokens = prefRole
    .replace(/[&/,-]/g, ' ')
    .split(/\s+/)
    .filter((t: string) => t.length > 1 && !['and', 'the', 'for', 'with'].includes(t));
  let titleHits = 0;
  let descHits = 0;
  for (const token of roleTokens) {
    if (title.includes(token)) titleHits += 1;
    else if (desc.includes(token)) descHits += 0.5;
  }
  const rawRoleRatio = roleTokens.length > 0 ? (titleHits + descHits) / roleTokens.length : 0.5;
  let roleScore = Math.round(Math.min(rawRoleRatio, 1) * 75 + 25);
  if (prefRole && title.includes(prefRole)) {
    roleScore = Math.min(roleScore + 15, 100);
  }

  // 3. Experience Fit (15%)
  let expScore = 75;
  const isEntryOrIntern = /(intern|internship|trainee|fresher|junior|entry|graduate|associate|0-1|0-2|1 year)/i.test(
    `${title} ${desc}`
  );
  const isSenior = /(5\+|6\+|7\+|8\+|senior|lead|staff|principal|architect|manager|director)/i.test(
    `${title} ${desc}`
  );
  if (expLevel.includes('student') || expLevel.includes('intern') || expLevel.includes('fresh')) {
    if (isEntryOrIntern) expScore = 96;
    else if (isSenior) expScore = 35;
    else expScore = 72;
  } else {
    expScore = isSenior ? 55 : 88;
  }

  // 4. Technology & Tooling Match (15%)
  let techHits = 0;
  for (const tech of allCandSkills) {
    const tClean = normalizeText(tech);
    if (tClean && (desc.includes(tClean) || title.includes(tClean))) {
      techHits++;
    }
  }
  const techDenominator = Math.min(Math.max(allCandSkills.length, 1), 6);
  const techScore =
    allCandSkills.length === 0
      ? 15
      : Math.min(Math.max(Math.round((techHits / techDenominator) * 100), 20), 100);

  // 5. Location Fit (5%)
  let locationScore = 75;
  const prefLocTokens = prefLoc.split(/[,/\s]+/).filter((t: string) => t.length > 2);
  if (/remote|anywhere|work from home|wfh/i.test(`${loc} ${desc}`)) {
    locationScore = 98;
  } else if (prefLocTokens.some((tok: string) => loc.includes(tok))) {
    locationScore = 98;
  } else if (loc.includes('india')) {
    locationScore = 88;
  } else {
    locationScore = 60;
  }

  // 6. Job Quality (5%)
  let jobQualityScore = 60;
  if (applyUrl && applyUrl.startsWith('http')) jobQualityScore += 20;
  if (desc.length > 300) jobQualityScore += 15;
  if (job.salary && job.salary !== 'Competitive Stipend') jobQualityScore += 5;
  jobQualityScore = Math.min(jobQualityScore, 100);

  // Weighted Total:
  const overallScore = Math.max(
    Math.min(
      Math.round(
        skillScore * 0.35 +
          roleScore * 0.25 +
          expScore * 0.15 +
          techScore * 0.15 +
          locationScore * 0.05 +
          jobQualityScore * 0.05
      ),
      99
    ),
    20
  );

  let recommendation: 'Strongly Recommended' | 'Recommended' | 'Consider with Upskilling' | 'Reach Opportunity' =
    'Reach Opportunity';
  if (overallScore >= 80) recommendation = 'Strongly Recommended';
  else if (overallScore >= 68) recommendation = 'Recommended';
  else if (overallScore >= 52) recommendation = 'Consider with Upskilling';

  const explanation = {
    overall: `${overallScore}% deterministic match across 6 weighted dimensions.`,
    skill_factor: `${skillScore}% - Matched ${matched.length} key competencies, ${partial.length} partial, ${missing.length} missing.`,
    role_factor: `${roleScore}% - Target alignment with ${profile.preferred_role || 'preferred role'}.`,
    experience_factor: `${expScore}% - Alignment with ${expLevel} profile level.`,
    tech_factor: `${techScore}% - Primary language & framework overlap.`,
    location_factor: `${locationScore}% - Location suitability (${job.location || 'India'}).`,
    quality_factor: `${jobQualityScore}% - Direct application link & verified listing completeness.`,
  };

  return {
    overall_score: overallScore,
    skill_score: skillScore,
    role_score: roleScore,
    experience_score: expScore,
    technology_score: techScore,
    location_score: locationScore,
    job_quality_score: jobQualityScore,
    matched_skills: matched,
    partial_skills: partial,
    missing_skills: missing,
    recommendation,
    explanation,
    skill_breakdown: breakdown,
  };
}

function normalizeRawJob(rawJob: any, index: number) {
  const title = rawJob.title || 'Engineering Opportunity';
  const company = rawJob.company_name || rawJob.company || 'Tech Organization';
  const location = rawJob.location || 'India (Hybrid/Remote)';
  const description = (rawJob.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const extensions = rawJob.detected_extensions || {};
  const postedAt = extensions.posted_at || rawJob.posted_at || 'Recently posted';
  const scheduleType = extensions.schedule_type || 'Full-time / Internship';
  const salary = extensions.salary || 'Competitive Stipend';

  let applyUrl = '';
  if (Array.isArray(rawJob.apply_options) && rawJob.apply_options.length > 0) {
    applyUrl = rawJob.apply_options[0]?.link || '';
  }
  if (!applyUrl && rawJob.job_id) {
    applyUrl = `https://www.google.com/search?q=${encodeURIComponent(title)}&ibp=htl;jobs#fpstate=tldetail&htidocid=${rawJob.job_id}`;
  }
  if (!applyUrl) {
    applyUrl = rawJob.link || 'https://www.google.com/search?q=jobs';
  }

  // Compute a deterministic, collision-free hash across title, company, location, and index
  const rawKey = `${title}__${company}__${location}__${rawJob.job_id || index}`;
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < rawKey.length; i++) {
    const ch = rawKey.charCodeAt(i);
    hash1 = (hash1 * 33) ^ ch;
    hash2 = (hash2 * 33) ^ ch;
  }
  const id = `job_${(hash1 >>> 0).toString(16)}_${(hash2 >>> 0).toString(16)}_${index}`;

  return {
    id,
    title,
    company,
    location,
    description: description.slice(0, 1400) || `${title} at ${company} in ${location}.`,
    apply_url: applyUrl,
    posted_at: postedAt,
    salary,
    job_type: scheduleType,
    source: rawJob.via || 'Google Jobs via SerpApi',
    thumbnail: rawJob.thumbnail || undefined,
    is_demo: false,
  };
}

async function fetchSerpApiJobs(query: string, location: string = 'India') {
  if (!serpApiKey || serpApiKey.startsWith('your_')) {
    return {
      source: 'no_key' as const,
      jobs: [] as any[],
    };
  }

  // Include location inside q and pass gl=in&hl=en so SerpApi never rejects compound locations like "Pune / Bengaluru" or "Remote"
  const fullQuery = query.toLowerCase().includes(location.toLowerCase())
    ? query
    : `${query} ${location}`.trim();

  const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(
    fullQuery
  )}&hl=en&gl=in&api_key=${serpApiKey}`;

  try {
    console.log(`[SerpApi Live] Fetching Google Jobs for q="${fullQuery}"`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data: any = await res.json();
      const rawJobs = data.jobs_results || [];
      console.log(`[SerpApi Live] Received ${rawJobs.length} live jobs from SerpApi`);
      if (rawJobs.length > 0) {
        const normalized = rawJobs.slice(0, 10).map((j: any, idx: number) => normalizeRawJob(j, idx));
        return { source: 'serpapi_live' as const, jobs: normalized };
      }
      return { source: 'empty' as const, jobs: [] as any[] };
    } else {
      const errText = await res.text().catch(() => '');
      console.warn(`[SerpApi Live] Response status ${res.status}: ${errText}`);
    }
  } catch (err) {
    console.warn('Error contacting SerpApi live API:', err);
  }

  return {
    source: 'error' as const,
    jobs: [] as any[],
  };
}

// ---------------- REST API ROUTES ----------------

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'CareerScout AI',
    serpapi_configured: Boolean(serpApiKey && !serpApiKey.startsWith('your_')),
    gemini_configured: Boolean(geminiApiKey && !geminiApiKey.startsWith('your_')),
    demo_mode: demoModeEnv || !serpApiKey,
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/demo', (req: Request, res: Response) => {
  res.json({
    message: 'CareerScout AI Sample Indian Tech Jobs Dataset',
    sample_count: SAMPLE_INDIAN_TECH_JOBS.length,
    target_audience: 'Indian College Students & Fresh Graduates',
    sample_jobs: SAMPLE_INDIAN_TECH_JOBS.slice(0, 4),
  });
});

app.post('/api/profile/analyze', async (req: Request, res: Response) => {
  const profile = req.body || {};
  const candSkills = [...(profile.skills || []), ...(profile.programming_languages || []), ...(profile.frameworks || [])];
  
  let queries = [
    `${profile.preferred_role || 'AI/ML'} intern ${profile.preferred_location || 'India'}`,
    `entry level ${profile.preferred_role || 'Software Engineer'} ${profile.preferred_location || 'India'}`,
    `${candSkills.slice(0, 2).join(' ')} internship India`,
  ];

  if (aiClient) {
    try {
      const prompt = `Student Profile: Role: ${profile.preferred_role}, Location: ${profile.preferred_location}, Skills: ${candSkills.join(', ')}. Return a JSON array of 3 realistic Google Jobs search queries for Indian college students. Return ONLY JSON array of strings.`;
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      const text = response.text || '';
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed) && parsed.length > 0) {
        queries = parsed.slice(0, 3);
      }
    } catch (e) {
      // Use fallback queries
    }
  }

  res.json({
    status: 'success',
    candidate_name: profile.name || 'Candidate',
    target_role: profile.preferred_role || 'AI/ML Engineer',
    total_skills_identified: candSkills.length,
    generated_search_queries: queries,
    readiness_indicator: candSkills.length >= 5 ? 'Strong Candidate' : 'Developing Candidate',
  });
});

app.post('/api/jobs/search', async (req: Request, res: Response) => {
  try {
    const { profile, custom_role, custom_location, force_demo } = req.body;
    const prof = { ...profile };
    if (custom_role) prof.preferred_role = custom_role;
    if (custom_location) prof.preferred_location = custom_location;

    const location = (prof.preferred_location || 'India').replace(/[/]/g, ' ').trim();
    const candSkills = [
      ...(prof.skills || []),
      ...(prof.programming_languages || []),
      ...(prof.frameworks || []),
    ].filter(Boolean);

    // Generate intelligent queries based on actual user role, experience level, and skills
    const cleanRole = (prof.preferred_role || 'Software Engineer').replace(/[&/]/g, ' ').replace(/\s+/g, ' ').trim();
    const isInternOrStudent = /student|intern/i.test(prof.experience_level || '');
    const primaryQuery = isInternOrStudent
      ? `${cleanRole} intern ${location}`
      : `${cleanRole} ${location}`;
    const secondaryQuery =
      candSkills.length > 0
        ? `${cleanRole} ${candSkills.slice(0, 2).join(' ')} ${location}`
        : `${cleanRole} entry level ${location}`;

    let executionSource: 'serpapi_live' | 'demo_mode' = 'serpapi_live';
    const allRawJobs: any[] = [];

    if (force_demo) {
      executionSource = 'demo_mode';
      const demoPool = getRoleFilteredDemoJobs(cleanRole);
      allRawJobs.push(...demoPool.map((j, i) => ({ ...normalizeRawJob(j, i), is_demo: true })));
    } else {
      const searchRes1 = await fetchSerpApiJobs(primaryQuery, location);
      allRawJobs.push(...searchRes1.jobs);

      if (allRawJobs.length < 5 && searchRes1.source !== 'no_key') {
        const searchRes2 = await fetchSerpApiJobs(secondaryQuery, location);
        allRawJobs.push(...searchRes2.jobs);
      }

      if (allRawJobs.length === 0) {
        executionSource = 'demo_mode';
        const demoPool = getRoleFilteredDemoJobs(cleanRole);
        allRawJobs.push(...demoPool.map((j, i) => ({ ...normalizeRawJob(j, i), is_demo: true })));
      } else {
        executionSource = 'serpapi_live';
      }
    }

    // Deduplicate jobs by company and title and guarantee unique IDs
    const seen = new Set<string>();
    const usedIds = new Set<string>();
    const deduped: any[] = [];
    for (let idx = 0; idx < allRawJobs.length; idx++) {
      const job = allRawJobs[idx];
      const key = `${(job.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')}_${(job.company || '').toLowerCase().replace(/[^a-z0-9]/g, '')}`;
      if (!seen.has(key)) {
        seen.add(key);
        let uniqueId = job.id || `job_${idx}`;
        if (usedIds.has(uniqueId)) {
          uniqueId = `${uniqueId}_${idx}`;
        }
        usedIds.add(uniqueId);
        deduped.push({ ...job, id: uniqueId });
      }
    }

    // Deterministic scoring on all opportunities
    const opportunities = deduped.map((job) => {
      const scoreData = calculateDeterministicMatchScore(prof, job);
      return {
        ...job,
        match_score: scoreData.overall_score,
        skill_score: scoreData.skill_score,
        role_score: scoreData.role_score,
        experience_score: scoreData.experience_score,
        technology_score: scoreData.technology_score,
        location_score: scoreData.location_score,
        job_quality_score: scoreData.job_quality_score,
        matched_skills: scoreData.matched_skills,
        partial_skills: scoreData.partial_skills,
        missing_skills: scoreData.missing_skills,
        recommendation: scoreData.recommendation,
        strengths: scoreData.matched_skills.slice(0, 3).map((s: string) => `Strong match in ${s}`),
        gap_summary: scoreData.missing_skills.length
          ? `Priority skill gaps: ${scoreData.missing_skills.slice(0, 2).join(', ')}`
          : 'High compatibility across core technical stack.',
      };
    });

    opportunities.sort((a, b) => b.match_score - a.match_score);

    const totalFound = opportunities.length;
    const strongMatches = opportunities.filter((j) => j.match_score >= 78).length;
    const averageMatch = Math.round(
      opportunities.reduce((acc, curr) => acc + curr.match_score, 0) / Math.max(totalFound, 1)
    );

    const uniqueMissing = new Set<string>();
    for (const j of opportunities.slice(0, 5)) {
      for (const m of j.missing_skills || []) {
        uniqueMissing.add(m);
      }
    }

    res.json({
      opportunities,
      total_found: totalFound,
      queries_executed: [primaryQuery, secondaryQuery],
      execution_source: executionSource,
      stats: {
        total_opportunities: totalFound,
        strong_matches: strongMatches,
        average_match: averageMatch,
        critical_skill_gaps: uniqueMissing.size,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: `Search execution failed: ${err.message}` });
  }
});

interface RoleBlueprint {
  category: string;
  coreSkills: string[];
  stackTools: string[];
  apiOrArchitectureTopic: string;
  performanceTopic: string;
  dataOrStateTopic: string;
  testingTopic: string;
  deploymentTarget: string;
  capstoneTitle: string;
  capstoneDesc: string;
  capstoneStack: string[];
  secondaryProjectTitle: string;
  secondaryProjectDesc: string;
  secondaryProjectStack: string[];
  interviewTopics: string[];
  learningResources: {
    name: string;
    type: 'Free Course' | 'Documentation' | 'Video Series' | 'Paper/Blog';
    url_or_topic: string;
    estimated_time: string;
  }[];
  jobTypes: string[];
  marketInsight: string;
}

function getRoleBlueprint(roleInput: string): RoleBlueprint {
  const r = (roleInput || '').toLowerCase();

  // 1. Web Developer / Frontend Developer / Full Stack Developer
  if (
    r.includes('web') ||
    r.includes('front') ||
    r.includes('react') ||
    r.includes('ui') ||
    r.includes('full stack') ||
    r.includes('fullstack') ||
    r.includes('mern') ||
    r.includes('next')
  ) {
    return {
      category: 'Web & Full-Stack Engineering',
      coreSkills: ['React.js', 'TypeScript', 'JavaScript (ES6+)', 'Next.js', 'Tailwind CSS', 'REST APIs', 'Responsive UI/UX', 'State Management'],
      stackTools: ['Git & GitHub', 'Vite', 'Chrome DevTools', 'Vercel / Netlify', 'Figma', 'Postman'],
      apiOrArchitectureTopic: 'RESTful & GraphQL API Integration with Async Data Fetching',
      performanceTopic: 'Core Web Vitals, Code Splitting, Lazy Loading & Lighthouse Optimization',
      dataOrStateTopic: 'Client & Server State Management (React Context, Redux Toolkit / TanStack Query)',
      testingTopic: 'Component & End-to-End UI Testing with Vitest & Playwright',
      deploymentTarget: 'Vercel / Netlify Edge Network with CI/CD Preview Deployments',
      capstoneTitle: 'Full-Stack Real-Time Collaborative Web Platform',
      capstoneDesc:
        'Architect and deploy a responsive, accessible web application with authentication, dynamic dashboards, optimistic UI updates, and REST/WebSocket API integration.',
      capstoneStack: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
      secondaryProjectTitle: 'High-Performance E-Commerce Storefront & Design System',
      secondaryProjectDesc:
        'Build a reusable component library and storefront achieving 98+ Google Lighthouse scores across performance, accessibility (WCAG), and SEO.',
      secondaryProjectStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Playwright'],
      interviewTopics: [
        'JavaScript Event Loop, Closures, Promises, and Async/Await execution order',
        'React Rendering Lifecycle, Virtual DOM Reconciliation, Memoization & Custom Hooks',
        'CSS Grid/Flexbox Responsive Layouts, Web Accessibility (ARIA), and Cross-Browser Security (CORS, XSS, CSRF)',
        'Frontend System Design: State normalization, caching strategies, and bundle size optimization',
      ],
      learningResources: [
        {
          name: 'React Official Documentation (react.dev)',
          type: 'Documentation',
          url_or_topic: 'https://react.dev/learn',
          estimated_time: '15 hours',
        },
        {
          name: 'JavaScript.info - The Modern JavaScript Tutorial',
          type: 'Free Course',
          url_or_topic: 'https://javascript.info/',
          estimated_time: '20 hours',
        },
        {
          name: 'web.dev by Google - Learn Web Performance & Core Web Vitals',
          type: 'Documentation',
          url_or_topic: 'https://web.dev/learn',
          estimated_time: '10 hours',
        },
        {
          name: 'Full Stack Open - Modern Web Development',
          type: 'Free Course',
          url_or_topic: 'https://fullstackopen.com/en/',
          estimated_time: '25 hours',
        },
      ],
      jobTypes: [
        `${roleInput} Intern`,
        'Frontend Software Engineer (React / Next.js)',
        'Full Stack Web Developer',
        'UI Engineer Trainee',
      ],
      marketInsight:
        `Indian product startups and global capability centers (GCCs) show strong hiring demand for ${roleInput} candidates who pair modern React/TypeScript fundamentals with strong Core Web Vitals and clean component architecture.`,
    };
  }

  // 2. Backend / Java / API / Software Engineer
  if (
    r.includes('back') ||
    r.includes('java') ||
    r.includes('spring') ||
    r.includes('node') ||
    r.includes('api') ||
    r.includes('golang') ||
    r.includes('software') ||
    r.includes('sde')
  ) {
    const isJava = r.includes('java') || r.includes('spring');
    return {
      category: 'Backend & Distributed Systems Engineering',
      coreSkills: isJava
        ? ['Java', 'Spring Boot', 'RESTful Microservices', 'SQL & PostgreSQL', 'Hibernate / JPA', 'Multithreading', 'System Design', 'Redis Caching']
        : ['Node.js / Python', 'REST & GraphQL APIs', 'PostgreSQL & Database Indexing', 'System Design', 'Redis Caching', 'Authentication (JWT / OAuth2)', 'Message Queues', 'Concurrency'],
      stackTools: isJava
        ? ['Maven / Gradle', 'Git', 'PostgreSQL', 'Redis', 'Postman', 'JUnit & Mockito']
        : ['Git', 'PostgreSQL', 'Redis', 'Postman', 'Linux', 'Swagger / OpenAPI'],
      apiOrArchitectureTopic: isJava
        ? 'Spring Boot Microservices, Spring Security & DTO Validation'
        : 'High-Throughput REST API Architecture, Rate Limiting & JWT Security',
      performanceTopic: 'Database Query Indexing, Connection Pooling & Redis Caching Strategies',
      dataOrStateTopic: 'ACID Transactions, Schema Normalization & Asynchronous Job Queues',
      testingTopic: isJava
        ? 'Unit & Integration Testing with JUnit 5, Mockito & Testcontainers'
        : 'Automated API Integration Testing & Load Benchmarking',
      deploymentTarget: 'Cloud PaaS (Render / Railway / AWS) with Automated Health Checks',
      capstoneTitle: 'Scalable Distributed Order & Payment Processing Engine',
      capstoneDesc:
        'Build a fault-tolerant backend service featuring idempotent REST APIs, role-based access control, Redis caching, rate limiting, and transactional database persistence.',
      capstoneStack: isJava
        ? ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'JUnit']
        : ['Node.js', 'TypeScript', 'Express / FastAPI', 'PostgreSQL', 'Redis'],
      secondaryProjectTitle: 'High-Concurrency URL Shortener & Real-Time Analytics Service',
      secondaryProjectDesc:
        'Design a low-latency redirection and event aggregation service handling thousands of requests per second with sub-20ms response times.',
      secondaryProjectStack: isJava
        ? ['Java', 'Spring Boot', 'Redis', 'PostgreSQL']
        : ['TypeScript', 'Node.js', 'Redis', 'PostgreSQL'],
      interviewTopics: [
        'Database indexing (B-Trees), ACID isolation levels, and SQL query optimization',
        'REST API design principles, idempotency, pagination, and rate-limiting algorithms',
        'Concurrency control, thread safety, deadlocks, and asynchronous message queues',
        'High-level system design: Load balancing, consistent hashing, and caching layers',
      ],
      learningResources: [
        {
          name: 'System Design Primer (GitHub)',
          type: 'Documentation',
          url_or_topic: 'https://github.com/donnemartin/system-design-primer',
          estimated_time: '20 hours',
        },
        {
          name: isJava ? 'Spring Academy - Official Spring Boot Courses' : 'Roadmap.sh Backend Developer Guide',
          type: 'Free Course',
          url_or_topic: isJava ? 'https://spring.academy/' : 'https://roadmap.sh/backend',
          estimated_time: '18 hours',
        },
        {
          name: 'PostgreSQL Performance & Indexing Tutorial',
          type: 'Documentation',
          url_or_topic: 'https://use-the-index-luke.com/',
          estimated_time: '8 hours',
        },
        {
          name: 'NeetCode 150 - Data Structures & Algorithms',
          type: 'Free Course',
          url_or_topic: 'https://neetcode.io/practice',
          estimated_time: '25 hours',
        },
      ],
      jobTypes: [
        `${roleInput} Intern`,
        'Backend Software Development Engineer (SDE-1)',
        'API & Platform Engineer',
        'Graduate Software Engineer Trainee',
      ],
      marketInsight:
        `Indian fintech, SaaS, and enterprise engineering teams heavily prioritize ${roleInput} candidates who understand SQL query optimization, clean REST API contracts, and concurrency fundamentals.`,
    };
  }

  // 3. Data Scientist / Data Analyst / Data Engineer
  if (r.includes('data') || r.includes('analy') || r.includes('bi') || r.includes('sql')) {
    const isDataEng = r.includes('engineer');
    return {
      category: 'Data Science, Analytics & Engineering',
      coreSkills: isDataEng
        ? ['Python', 'SQL', 'ETL Pipelines', 'Apache Spark / PySpark', 'Data Warehousing', 'Apache Airflow', 'Data Modeling']
        : ['Python', 'SQL', 'Pandas & NumPy', 'Statistical Modeling', 'Data Visualization', 'Power BI / Tableau', 'Exploratory Data Analysis', 'Scikit-learn'],
      stackTools: ['Jupyter', 'Git', 'SQL Workbench', 'Power BI / Tableau', 'BigQuery / Snowflake', 'Excel'],
      apiOrArchitectureTopic: isDataEng
        ? 'Batch & Streaming ETL Pipelines with Automated Data Quality Checks'
        : 'End-to-End Analytical Pipelines, Hypothesis Testing & Feature Engineering',
      performanceTopic: 'Vectorized Data Processing in Pandas/Polars & Complex SQL Window Functions',
      dataOrStateTopic: 'Dimensional Data Modeling (Star/Snowflake Schema) & Anomaly Detection',
      testingTopic: 'Data Validation, Schema Assertions & Statistical Backtesting',
      deploymentTarget: 'Interactive Streamlit / BI Executive Dashboard with Live Data Refresh',
      capstoneTitle: isDataEng
        ? 'Automated End-to-End Lakehouse ETL & Analytics Pipeline'
        : 'Customer Churn Prediction & Interactive Executive BI Intelligence Suite',
      capstoneDesc: isDataEng
        ? 'Ingest, clean, and transform multi-source datasets using Python and SQL into a structured warehouse with automated scheduling.'
        : 'Analyze 500k+ transaction records using SQL and Python, build predictive models in Scikit-learn, and publish an interactive dashboard quantifying business revenue impact.',
      capstoneStack: isDataEng
        ? ['Python', 'SQL', 'PySpark', 'Airflow', 'Snowflake']
        : ['Python', 'SQL', 'Pandas', 'Scikit-learn', 'Power BI / Streamlit'],
      secondaryProjectTitle: 'Indian Market Retail Demand Forecasting & Cohort Analysis',
      secondaryProjectDesc:
        'Perform time-series forecasting, A/B test statistical evaluation, and cohort retention visualization on real-world e-commerce data.',
      secondaryProjectStack: ['Python', 'SQL', 'Pandas', 'Matplotlib', 'Tableau'],
      interviewTopics: [
        'Advanced SQL: Window functions (ROW_NUMBER, RANK, LAG), CTEs, and complex joins',
        'Probability, hypothesis testing (p-values, A/B testing), and bias-variance trade-off',
        'Handling missing data, class imbalance, outliers, and feature multicollinearity',
        'Translating technical model metrics (Precision/Recall, ROC-AUC, RMSE) into business KPIs',
      ],
      learningResources: [
        {
          name: 'Kaggle Learn - Python, SQL, Pandas & Machine Learning',
          type: 'Free Course',
          url_or_topic: 'https://www.kaggle.com/learn',
          estimated_time: '18 hours',
        },
        {
          name: 'Mode SQL Tutorial for Data Analysis',
          type: 'Documentation',
          url_or_topic: 'https://mode.com/sql-tutorial',
          estimated_time: '12 hours',
        },
        {
          name: 'StatQuest with Josh Starmer - Statistics & ML Fundamentals',
          type: 'Video Series',
          url_or_topic: 'https://statquest.org/',
          estimated_time: '15 hours',
        },
        {
          name: 'Scikit-Learn Official User Guide',
          type: 'Documentation',
          url_or_topic: 'https://scikit-learn.org/stable/user_guide.html',
          estimated_time: '10 hours',
        },
      ],
      jobTypes: [
        `${roleInput} Intern`,
        'Junior Data Analyst / Scientist',
        'Business Intelligence & Analytics Trainee',
        'Decision Science Associate',
      ],
      marketInsight:
        `Hiring managers for ${roleInput} roles in India test heavily on advanced SQL window functions, exploratory data storytelling, and business-metric problem solving.`,
    };
  }

  // 4. Mobile App Developer (Flutter / React Native / Android / iOS)
  if (r.includes('mobile') || r.includes('flutter') || r.includes('android') || r.includes('ios') || r.includes('react native')) {
    return {
      category: 'Mobile Application Engineering',
      coreSkills: ['Flutter / React Native', 'Dart / TypeScript', 'Mobile UI/UX Architecture', 'State Management (BLoC / Riverpod / Redux)', 'REST API Integration', 'Offline Local Storage (SQLite / Hive)', 'Push Notifications'],
      stackTools: ['Android Studio', 'Xcode', 'Firebase', 'Git', 'Figma', 'Postman'],
      apiOrArchitectureTopic: 'Clean Mobile Architecture, REST API Caching & Offline-First Sync',
      performanceTopic: '60/120 FPS UI Rendering, Memory Leak Profiling & App Bundle Size Optimization',
      dataOrStateTopic: 'Reactive State Management, Secure Token Storage & Deep Linking',
      testingTopic: 'Widget / Component Testing & Automated Device Integration Tests',
      deploymentTarget: 'Google Play Store Internal Track / Firebase App Distribution',
      capstoneTitle: 'Offline-First FinTech Expense & UPI Analytics Mobile App',
      capstoneDesc:
        'Build a polished cross-platform mobile app with biometric authentication, offline SQLite synchronization, interactive charts, and smooth custom animations.',
      capstoneStack: ['Flutter / React Native', 'Dart / TypeScript', 'Firebase', 'SQLite', 'REST APIs'],
      secondaryProjectTitle: 'Real-Time Hyperlocal Delivery & Live Tracking Mobile Client',
      secondaryProjectDesc:
        'Implement live geolocation tracking, push notifications, and resilient network retry states for patchy mobile networks.',
      secondaryProjectStack: ['Flutter / React Native', 'Google Maps SDK', 'WebSockets', 'Firebase'],
      interviewTopics: [
        'Mobile app lifecycle states, background execution limits, and memory management',
        'State management patterns (Riverpod/BLoC or Redux/Zustand) and avoiding unnecessary widget rebuilds',
        'Offline caching, optimistic UI updates, and handling intermittent network connectivity',
        'Securing API keys, JWT refresh tokens, and local storage on Android/iOS devices',
      ],
      learningResources: [
        {
          name: 'Flutter / React Native Official Documentation',
          type: 'Documentation',
          url_or_topic: 'https://docs.flutter.dev/',
          estimated_time: '16 hours',
        },
        {
          name: 'Firebase for Mobile Developers Pathway',
          type: 'Free Course',
          url_or_topic: 'https://firebase.google.com/docs',
          estimated_time: '10 hours',
        },
      ],
      jobTypes: [
        `${roleInput} Intern`,
        'Cross-Platform Mobile Engineer',
        'Android / iOS Application Developer',
        'Mobile Product Engineering Trainee',
      ],
      marketInsight:
        `Consumer tech startups across India actively recruit ${roleInput} candidates who can ship smooth 60fps cross-platform apps with reliable offline support.`,
    };
  }

  // 5. Cybersecurity / QA / Embedded / DevOps specialized checks
  if (r.includes('cyber') || r.includes('security')) {
    return {
      category: 'Cybersecurity & Application Security',
      coreSkills: ['Network Security', 'OWASP Top 10', 'Vulnerability Assessment', 'Penetration Testing', 'Linux & Bash', 'Python Scripting', 'SIEM & Log Analysis'],
      stackTools: ['Wireshark', 'Nmap', 'Burp Suite', 'Kali Linux', 'Git', 'Splunk'],
      apiOrArchitectureTopic: 'Web & API Penetration Testing (OWASP Top 10 & Broken Authentication)',
      performanceTopic: 'Network Packet Inspection, Firewall Rules & Intrusion Detection',
      dataOrStateTopic: 'Cryptography, TLS Handshakes, JWT Security & Identity Management',
      testingTopic: 'Automated Vulnerability Scanning, SAST/DAST & Security Audit Reporting',
      deploymentTarget: 'Hardened Cloud Environment with Automated Security Advisories',
      capstoneTitle: 'Automated Web Vulnerability Scanner & OWASP Audit Framework',
      capstoneDesc:
        'Develop a security auditing tool that detects SQLi, XSS, insecure headers, and misconfigurations with actionable remediation reports.',
      capstoneStack: ['Python', 'Burp Suite', 'OWASP ZAP', 'Linux', 'Bash'],
      secondaryProjectTitle: 'Real-Time Network Intrusion Detection & SIEM Alerting Pipeline',
      secondaryProjectDesc:
        'Analyze packet captures and server logs to flag brute-force attempts and anomalous traffic patterns.',
      secondaryProjectStack: ['Python', 'Wireshark', 'Splunk / ELK', 'Linux'],
      interviewTopics: [
        'OWASP Top 10 vulnerabilities (SQL Injection, XSS, CSRF, SSRF) and exact code-level mitigations',
        'TCP/IP 3-way handshake, DNS resolution, TLS/HTTPS encryption, and symmetric vs asymmetric crypto',
        'Incident response lifecycle, privilege escalation vectors, and Linux file permissions',
        'Securing REST APIs, OAuth2/OIDC flows, and rate limiting against DDoS attacks',
      ],
      learningResources: [
        {
          name: 'PortSwigger Web Security Academy',
          type: 'Free Course',
          url_or_topic: 'https://portswigger.net/web-security',
          estimated_time: '25 hours',
        },
        {
          name: 'OWASP Top 10 Official Guide',
          type: 'Documentation',
          url_or_topic: 'https://owasp.org/www-project-top-ten/',
          estimated_time: '10 hours',
        },
      ],
      jobTypes: [`${roleInput} Intern`, 'SOC Analyst Trainee', 'Application Security Engineer', 'VAPT Intern'],
      marketInsight:
        `Growing regulatory compliance across Indian banking and SaaS companies has created strong demand for hands-on ${roleInput} talent.`,
    };
  }

  if (r.includes('qa') || r.includes('test') || r.includes('sdet')) {
    return {
      category: 'Quality Assurance & Test Automation (SDET)',
      coreSkills: ['Test Automation', 'Selenium / Playwright', 'API Testing (Postman / RestAssured)', 'Python / Java / TypeScript', 'Regression & E2E Testing', 'CI/CD Test Pipelines', 'Performance Testing (JMeter)'],
      stackTools: ['Playwright', 'Selenium', 'Postman', 'JMeter', 'Git', 'Jira', 'GitHub Actions'],
      apiOrArchitectureTopic: 'Page Object Model (POM) E2E Automation Framework Architecture',
      performanceTopic: 'Load & Stress Testing APIs with JMeter / Locust',
      dataOrStateTopic: 'Data-Driven Testing, API Contract Validation & Mock Servers',
      testingTopic: 'Cross-Browser Parallel Execution & Flaky Test Elimination',
      deploymentTarget: 'GitHub Actions Automated CI Quality Gate with HTML Test Reports',
      capstoneTitle: 'Scalable Cross-Browser E2E & API Test Automation Framework',
      capstoneDesc:
        'Engineer a parallelized Playwright/Selenium automation suite with Page Object Model, API assertions, screenshot-on-failure, and CI integration.',
      capstoneStack: ['Playwright / Selenium', 'TypeScript / Python', 'Pytest / TestNG', 'GitHub Actions'],
      secondaryProjectTitle: 'Microservice API Contract & Load Benchmarking Suite',
      secondaryProjectDesc:
        'Automate 100+ REST endpoint test cases and simulate 500 concurrent users to identify latency bottlenecks.',
      secondaryProjectStack: ['Postman', 'JMeter', 'Python', 'Git'],
      interviewTopics: [
        'Page Object Model (POM) design pattern, dynamic waits vs hard sleeps, and handling shadow DOM/iframes',
        'API testing status codes, schema validation, idempotency, and authentication headers',
        'Test pyramid strategy: Unit vs Integration vs End-to-End test coverage balance',
        'Writing clean automation scripts and debugging flaky tests in CI pipelines',
      ],
      learningResources: [
        {
          name: 'Playwright Official Documentation & Best Practices',
          type: 'Documentation',
          url_or_topic: 'https://playwright.dev/docs/intro',
          estimated_time: '14 hours',
        },
        {
          name: 'Test Automation University (Applitools)',
          type: 'Free Course',
          url_or_topic: 'https://testautomationu.applitools.com/',
          estimated_time: '20 hours',
        },
      ],
      jobTypes: [`${roleInput} Intern`, 'SDET (Software Development Engineer in Test)', 'QA Automation Engineer', 'Quality Engineering Trainee'],
      marketInsight:
        `Engineering teams across India strongly prefer SDET and ${roleInput} candidates who write maintainable Playwright/Selenium code and automate API checks in CI.`,
    };
  }

  if (r.includes('devops') || r.includes('cloud') || r.includes('sre') || r.includes('infra') || r.includes('platform') || r.includes('kubernetes') || r.includes('aws')) {
    return {
      category: 'DevOps, Cloud Infrastructure & Site Reliability Engineering',
      coreSkills: ['CI/CD Pipelines (GitHub Actions / Jenkins)', 'Docker & Containerization', 'Kubernetes (K8s) & Helm', 'Terraform (Infrastructure as Code)', 'AWS / GCP / Azure Cloud', 'Linux & Bash Scripting', 'Prometheus & Grafana Monitoring'],
      stackTools: ['Docker', 'Kubernetes', 'Terraform', 'AWS / GCP', 'GitHub Actions', 'Prometheus & Grafana', 'Linux', 'Git'],
      apiOrArchitectureTopic: 'Automated CI/CD Deployment Pipelines & Zero-Downtime Rollouts',
      performanceTopic: 'Kubernetes Auto-Scaling (HPA), Resource Quotas & Cloud Cost Optimization',
      dataOrStateTopic: 'Infrastructure as Code (Terraform State Management) & Secret Vaults',
      testingTopic: 'Infrastructure Validation, Chaos Testing & Automated Health Probes',
      deploymentTarget: 'Multi-Stage Cloud Kubernetes Cluster with Live Grafana Telemetry',
      capstoneTitle: 'Production GitOps Cloud-Native Deployment & Observability Platform',
      capstoneDesc:
        'Provision cloud infrastructure using Terraform, deploy containerized microservices on Kubernetes with automated GitHub Actions CI/CD, and configure Prometheus/Grafana alerting.',
      capstoneStack: ['Terraform', 'Docker', 'Kubernetes', 'GitHub Actions', 'AWS / GCP', 'Prometheus'],
      secondaryProjectTitle: 'Automated Zero-Downtime Blue/Green Deployment Pipeline',
      secondaryProjectDesc:
        'Build an automated CI/CD release pipeline with container vulnerability scanning, health checks, and instant rollback.',
      secondaryProjectStack: ['Docker', 'GitHub Actions', 'Linux', 'Bash', 'Nginx'],
      interviewTopics: [
        'Docker multi-stage builds, Linux namespaces/cgroups, and container networking',
        'Kubernetes architecture (Pods, Deployments, Services, Ingress, ConfigMaps) and troubleshooting CrashLoopBackOff',
        'Terraform state management, drift detection, and designing highly available VPC architectures',
        'CI/CD pipeline security, blue/green vs canary deployments, and observability (logs, metrics, traces)',
      ],
      learningResources: [
        {
          name: 'Kubernetes Official Documentation & Interactive Tutorials',
          type: 'Documentation',
          url_or_topic: 'https://kubernetes.io/docs/tutorials/',
          estimated_time: '20 hours',
        },
        {
          name: 'HashiCorp Terraform AWS/GCP Get Started Tutorials',
          type: 'Free Course',
          url_or_topic: 'https://developer.hashicorp.com/terraform/tutorials',
          estimated_time: '14 hours',
        },
        {
          name: 'Roadmap.sh DevOps Engineer Interactive Guide',
          type: 'Documentation',
          url_or_topic: 'https://roadmap.sh/devops',
          estimated_time: '15 hours',
        },
      ],
      jobTypes: [
        `${roleInput} Intern`,
        'Junior DevOps & Cloud Engineer',
        'Site Reliability Engineer (SRE) Trainee',
        'Platform & Infrastructure Intern',
      ],
      marketInsight:
        `Cloud-native adoption across Indian SaaS and enterprise engineering hubs has driven high demand for ${roleInput} candidates skilled in Terraform, Kubernetes, and CI/CD automation.`,
    };
  }

  if (r.includes('embedded') || r.includes('iot') || r.includes('robotics') || r.includes('vision') || r.includes('hardware') || r.includes('vlsi') || r.includes('ece')) {
    return {
      category: 'Robotics, Computer Vision & Embedded Systems',
      coreSkills: ['C / C++', 'Python', 'ROS2 / FreeRTOS', 'OpenCV & Computer Vision', 'Sensor Fusion & SLAM', 'Microcontrollers (ESP32 / STM32)', 'Edge AI Optimization'],
      stackTools: ['Linux', 'Git', 'Gazebo / RViz', 'OpenCV', 'PyTorch / YOLO', 'Serial & Logic Analyzers'],
      apiOrArchitectureTopic: 'ROS2 Node Communication, Pub/Sub Topics & Real-Time Sensor Pipelines',
      performanceTopic: 'Low-Latency Edge Inference, C++ Memory Management & Frame Rate Optimization',
      dataOrStateTopic: 'Kalman Filtering, LiDAR/Camera Sensor Fusion & PID Control Loops',
      testingTopic: 'Hardware-in-the-Loop (HIL) & Gazebo Simulation Benchmarking',
      deploymentTarget: 'Edge Device / Simulation Package with Reproducible Launch Files',
      capstoneTitle: 'Autonomous Navigation & Real-Time Obstacle Avoidance System',
      capstoneDesc:
        'Implement SLAM mapping, path planning, and real-time object detection with telemetry benchmarks.',
      capstoneStack: ['C++', 'Python', 'ROS2', 'OpenCV', 'Gazebo'],
      secondaryProjectTitle: 'Edge Computer Vision Defect & Object Tracker',
      secondaryProjectDesc:
        'Deploy a quantized vision pipeline achieving 30+ FPS real-time detection and tracking.',
      secondaryProjectStack: ['Python', 'C++', 'OpenCV', 'Ultralytics YOLO'],
      interviewTopics: [
        'C/C++ pointers, memory allocation, volatile keyword, interrupts, and RTOS task scheduling',
        'Coordinate transformations, camera calibration, Kalman filters, and SLAM fundamentals',
        'Real-time latency optimization and sensor noise filtering',
        'Debugging embedded/robotics communication protocols (I2C, SPI, UART, ROS2 DDS)',
      ],
      learningResources: [
        {
          name: 'ROS2 Humble Official Tutorials',
          type: 'Documentation',
          url_or_topic: 'https://docs.ros.org/en/humble/Tutorials.html',
          estimated_time: '20 hours',
        },
        {
          name: 'OpenCV C++ & Python Computer Vision Guide',
          type: 'Documentation',
          url_or_topic: 'https://docs.opencv.org/',
          estimated_time: '15 hours',
        },
      ],
      jobTypes: [`${roleInput} Intern`, 'Robotics Software Engineer', 'Computer Vision Engineer', 'Embedded Firmware Trainee'],
      marketInsight:
        `India's deep-tech, robotics, and EV hardware ecosystem has strong demand for ${roleInput} engineers proficient in C++, Python, and real-time perception.`,
    };
  }

  // Only return AI/ML/TensorFlow/PyTorch blueprint if the role explicitly mentions AI, ML, Machine Learning, Deep Learning, NLP, GenAI, or LLM
  if (r.includes('ai') || r.includes('ml') || r.includes('machine learning') || r.includes('deep learning') || r.includes('genai') || r.includes('llm') || r.includes('nlp')) {
    return {
      category: 'AI, Machine Learning & GenAI Engineering',
      coreSkills: ['Python', 'PyTorch / TensorFlow', 'Machine Learning', 'Deep Learning', 'GenAI & RAG Pipelines', 'Scikit-learn', 'FastAPI', 'Vector Databases'],
      stackTools: ['Git', 'Jupyter', 'Hugging Face', 'ChromaDB / Qdrant', 'FastAPI', 'MLflow'],
      apiOrArchitectureTopic: 'FastAPI Model Serving & Asynchronous Inference Pipelines',
      performanceTopic: 'Model Quantization, Batch Inference & Latency Optimization',
      dataOrStateTopic: 'Vector Embeddings, Semantic Retrieval (RAG) & Feature Engineering',
      testingTopic: 'Model Evaluation Metrics, Hallucination Guards & Automated API Tests',
      deploymentTarget: 'Cloud API / Hugging Face Spaces with Live Interactive Demo',
      capstoneTitle: 'Production Multimodal RAG & Domain Intelligence Engine',
      capstoneDesc:
        'Build an end-to-end AI system with hybrid semantic search, citation grounding, evaluation metrics, and a FastAPI + React interface.',
      capstoneStack: ['Python', 'PyTorch', 'LangChain', 'Qdrant', 'FastAPI'],
      secondaryProjectTitle: 'End-to-End Predictive ML Pipeline with Automated Drift Monitoring',
      secondaryProjectDesc:
        'Train, tune, and serve a domain-specific machine learning model with experiment tracking and live inference endpoints.',
      secondaryProjectStack: ['Python', 'Scikit-learn', 'PyTorch', 'FastAPI', 'MLflow'],
      interviewTopics: [
        'Bias-variance trade-off, regularization, gradient descent, and evaluation metrics (Precision, Recall, F1, ROC-AUC)',
        'Transformer self-attention mechanism, embeddings, RAG chunking strategies, and fine-tuning (LoRA)',
        'Feature engineering, handling imbalanced datasets, and preventing data leakage',
        'Designing low-latency ML inference services and monitoring model drift in production',
      ],
      learningResources: [
        {
          name: 'Fast.ai Practical Deep Learning for Coders',
          type: 'Free Course',
          url_or_topic: 'https://course.fast.ai/',
          estimated_time: '25 hours',
        },
        {
          name: 'Hugging Face NLP & LLM Course',
          type: 'Free Course',
          url_or_topic: 'https://huggingface.co/learn',
          estimated_time: '18 hours',
        },
        {
          name: 'Full Stack Deep Learning',
          type: 'Free Course',
          url_or_topic: 'https://fullstackdeeplearning.com/',
          estimated_time: '20 hours',
        },
      ],
      jobTypes: [
        `${roleInput || 'AI/ML Engineer'} Intern`,
        'Applied Machine Learning Engineer',
        'GenAI & LLM Associate Engineer',
        'AI Research & Product Trainee',
      ],
      marketInsight:
        `The Indian tech market shows strong demand for ${roleInput || 'AI/ML Engineer'} candidates who combine solid modeling fundamentals with clean API integration and measurable evaluation benchmarks.`,
    };
  }

  // General Fallback for any other custom role (e.g. Developer, Programmer, Graduate Engineer, Product Engineer, etc.)
  return {
    category: `${roleInput} & Software Engineering`,
    coreSkills: ['Data Structures & Algorithms', 'JavaScript / TypeScript / Python', 'RESTful APIs', 'SQL & Relational Databases', 'Object-Oriented Design', 'System Architecture', 'Git Version Control', 'Automated Unit Testing'],
    stackTools: ['Git & GitHub', 'VS Code', 'PostgreSQL', 'Postman', 'Linux', 'Swagger'],
    apiOrArchitectureTopic: `Modular ${roleInput} Architecture, Clean APIs & Service Integration`,
    performanceTopic: 'Algorithmic Optimization, Query Indexing & Latency Reduction',
    dataOrStateTopic: 'Database Schema Design, State Management & Input Validation',
    testingTopic: 'Automated Unit & End-to-End Integration Testing',
    deploymentTarget: 'Cloud Platform (Vercel / Render / Railway) with Live HTTPS Demo',
    capstoneTitle: `Production-Grade ${roleInput} Capstone Application`,
    capstoneDesc:
      `Design, build, test, and deploy an end-to-end application tailored for ${roleInput} interviews with authentication, database persistence, and live analytics.`,
    capstoneStack: ['TypeScript / Python', 'React / Next.js', 'Node.js / FastAPI', 'PostgreSQL', 'Git'],
    secondaryProjectTitle: `High-Performance ${roleInput} Automation & API Service`,
    secondaryProjectDesc:
      'Build a modular service with comprehensive test coverage, rate limiting, and clean documentation.',
    secondaryProjectStack: ['TypeScript / Python', 'REST APIs', 'PostgreSQL', 'Postman'],
    interviewTopics: [
      'Data Structures & Algorithms: Arrays, HashMaps, Trees, Graphs, and Time/Space Complexity',
      'Object-Oriented Programming (SOLID principles), Modular Design Patterns, and Clean Code',
      'Relational Database Design (SQL Joins, Indexing, ACID Transactions) and REST API Contracts',
      `System Design & End-to-End Walkthrough of your ${roleInput} Capstone Project`,
    ],
    learningResources: [
      {
        name: 'NeetCode 150 - Data Structures & Algorithms Roadmap',
        type: 'Free Course',
        url_or_topic: 'https://neetcode.io/roadmap',
        estimated_time: '25 hours',
      },
      {
        name: 'Roadmap.sh Interactive Developer Guides',
        type: 'Documentation',
        url_or_topic: 'https://roadmap.sh/',
        estimated_time: '15 hours',
      },
      {
        name: 'System Design Primer (GitHub)',
        type: 'Documentation',
        url_or_topic: 'https://github.com/donnemartin/system-design-primer',
        estimated_time: '15 hours',
      },
    ],
    jobTypes: [
      `${roleInput} Intern`,
      `Junior ${roleInput}`,
      'Software Development Engineer (SDE-1)',
      'Graduate Engineer Trainee (GET)',
    ],
    marketInsight:
      `Recruiters hiring for ${roleInput} roles across India prioritize strong problem-solving (DSA), clean modular code, SQL/API fundamentals, and a deployed portfolio project.`,
  };
}

app.post('/api/jobs/analyze', async (req: Request, res: Response) => {
  try {
    const { profile, opportunity } = req.body;
    const scoreData = calculateDeterministicMatchScore(profile, opportunity);
    const blueprint = getRoleBlueprint(opportunity?.title || profile?.preferred_role || 'Software Engineer');

    const fallbackStrengths = [
      `Demonstrated proficiency in ${profile.skills?.[0] || blueprint.coreSkills[0]} directly relevant to ${opportunity.title}.`,
      `Academic coursework in ${profile.branch || 'Engineering'} provides strong analytical problem-solving foundations.`,
      `Hands-on familiarity with ${profile.frameworks?.[0] || profile.programming_languages?.[0] || blueprint.coreSkills[1]} and modern development workflows.`,
    ];

    const fallbackRequirements =
      scoreData.missing_skills && scoreData.missing_skills.length > 0
        ? scoreData.missing_skills.slice(0, 3).map((s: string) => `Hands-on project implementation demonstrating ${s}.`)
        : [
            blueprint.apiOrArchitectureTopic,
            blueprint.performanceTopic,
            blueprint.testingTopic,
          ];

    let candidateStrengths = fallbackStrengths;
    let missingRequirements = fallbackRequirements;
    let roleInsights = `${opportunity.title} at ${opportunity.company} values strong ${blueprint.category} fundamentals paired with clean, well-tested code.`;
    let interviewFocusAreas = blueprint.interviewTopics.slice(0, 3);

    if (aiClient) {
      try {
        const prompt = `Candidate: Name: ${profile.name}, Target Role: ${profile.preferred_role}, Skills: ${(profile.skills || []).join(', ')}, Degree: ${profile.degree} ${profile.branch}.
Job: Title: ${opportunity.title}, Company: ${opportunity.company}, Description: ${opportunity.description?.slice(0, 800)}.
Provide JSON strictly tailored to ${opportunity.title} with:
1. candidate_strengths (array of 3 strings)
2. missing_requirements (array of 3 strings)
3. role_insights (string summary)
4. interview_focus_areas (array of 3 strings)
Return ONLY raw JSON.`;

        const geminiRes = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });
        const text = geminiRes.text || '';
        const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        if (parsed.candidate_strengths) candidateStrengths = parsed.candidate_strengths;
        if (parsed.missing_requirements) missingRequirements = parsed.missing_requirements;
        if (parsed.role_insights) roleInsights = parsed.role_insights;
        if (parsed.interview_focus_areas) interviewFocusAreas = parsed.interview_focus_areas;
      } catch (e) {
        // use role-aware fallback analysis
      }
    }

    res.json({
      opportunity_id: opportunity.id,
      title: opportunity.title,
      company: opportunity.company,
      match_score: scoreData.overall_score,
      matched_skills: scoreData.matched_skills,
      partial_skills: scoreData.partial_skills,
      missing_skills: scoreData.missing_skills,
      candidate_strengths: candidateStrengths,
      missing_requirements: missingRequirements,
      recommendation: scoreData.recommendation,
      role_insights: roleInsights,
      interview_focus_areas: interviewFocusAreas,
      skill_breakdown: scoreData.skill_breakdown,
      scoring_explanation: scoreData.explanation,
    });
  } catch (err: any) {
    res.status(500).json({ error: `Analysis failed: ${err.message}` });
  }
});

app.post('/api/roadmap/generate', async (req: Request, res: Response) => {
  try {
    const { profile, opportunity, target_role } = req.body;
    const role = (target_role || profile?.preferred_role || opportunity?.title || '').trim();
    if (!role) {
      return res.status(400).json({ error: 'Target role is required to generate a 30-day roadmap.' });
    }

    const blueprint = getRoleBlueprint(role);
    const allBlueprintItems = [...blueprint.coreSkills, ...blueprint.stackTools];

    const isRelevantToRole = (skill: string): boolean => {
      const s = skill.toLowerCase().trim();
      if (!s) return false;
      return allBlueprintItems.some(
        (b) =>
          b.toLowerCase() === s ||
          b.toLowerCase().includes(s) ||
          s.includes(b.toLowerCase().split(' ')[0].replace(/[^a-z0-9+#.]/g, ''))
      );
    };

    const rawUserSkills: string[] = [
      ...(profile?.skills || []),
      ...(profile?.programming_languages || []),
      ...(profile?.frameworks || []),
      ...(profile?.tools || []),
    ].filter(Boolean);

    // Filter user skills so leftover skills from a different domain (e.g. TensorFlow/PyTorch when role is Web Developer) never pollute the roadmap
    const relevantUserSkills = rawUserSkills.filter(isRelevantToRole);
    const userSkillsLower = new Set(relevantUserSkills.map((s) => s.toLowerCase()));

    const roleSpecificMissing = blueprint.coreSkills.filter(
      (cs) =>
        !relevantUserSkills.some(
          (u) =>
            u.toLowerCase() === cs.toLowerCase() ||
            cs.toLowerCase().includes(u.toLowerCase()) ||
            u.toLowerCase().includes(cs.toLowerCase().split(' ')[0])
        )
    );

    const primarySkill = relevantUserSkills[0] || blueprint.coreSkills[0];
    const secondarySkill = relevantUserSkills[1] || blueprint.coreSkills[1] || blueprint.coreSkills[0];

    const oppMissingRelevant = Array.isArray(opportunity?.missing_skills)
      ? opportunity.missing_skills.filter(isRelevantToRole)
      : [];

    const missing =
      oppMissingRelevant.length > 0
        ? oppMissingRelevant
        : roleSpecificMissing.length > 0
        ? roleSpecificMissing
        : blueprint.coreSkills;

    const gap1 = missing[0] || blueprint.coreSkills[0];
    const gap2 = missing[1] || blueprint.coreSkills[1] || secondarySkill;
    const gap3 = missing[2] || blueprint.coreSkills[2] || primarySkill;

    const fallbackRoadmap = {
      target_role: role,
      target_company: opportunity?.company || undefined,
      total_days: 30,
      summary: `Tailored 30-day execution plan for ${profile?.name || 'Candidate'} targeting ${role}${
        opportunity?.company ? ` at ${opportunity.company}` : ''
      }, focused on mastering ${gap1}, ${gap2}, ${gap3}, and shipping a production-grade ${role} portfolio project.`,
      weeks: [
        {
          week: 1,
          title: `Week 1: Core ${role} Foundations & ${gap1}`,
          theme: `Mastering ${primarySkill}, ${gap1}, and core ${role} engineering patterns`,
          days: [
            {
              day: 1,
              week: 1,
              goal: `${role} Architecture & Core Setup`,
              topic: `${gap1} Fundamentals`,
              task: `Set up a clean development workspace for ${role} and implement core ${gap1} modules from scratch.`,
              estimated_hours: 2,
              expected_outcome: `Solid command of ${gap1} fundamentals required for ${role}.`,
              resource_hint: blueprint.learningResources[0]?.name || `Official ${gap1} Documentation`,
            },
            {
              day: 2,
              week: 1,
              goal: `Modular Patterns in ${primarySkill}`,
              topic: `${primarySkill} Best Practices`,
              task: `Build reusable, maintainable components and utilities in ${primarySkill} following industry standards.`,
              estimated_hours: 2,
              expected_outcome: `Clean, production-quality code structure in ${primarySkill}.`,
              resource_hint: `${primarySkill} Official Documentation`,
            },
            {
              day: 3,
              week: 1,
              goal: `Problem Solving & Core Logic for ${role}`,
              topic: `Data Structures & ${secondarySkill}`,
              task: `Practice core problem-solving patterns and data transformations using ${secondarySkill}.`,
              estimated_hours: 2,
              expected_outcome: `Fast, bug-free implementation of ${role} logic.`,
              resource_hint: `Interactive ${secondarySkill} Exercises`,
            },
            {
              day: 4,
              week: 1,
              goal: `Applied ${gap1} Implementation`,
              topic: `${gap1} Practical Workflows`,
              task: `Build an end-to-end feature module using ${gap1} solving a real-world ${role} use case.`,
              estimated_hours: 3,
              expected_outcome: `Working ${gap1} prototype pushed to GitHub.`,
              resource_hint: `${gap1} Hands-on Guide`,
            },
            {
              day: 5,
              week: 1,
              goal: `State & Data Flow Architecture`,
              topic: blueprint.dataOrStateTopic,
              task: `Implement structured state management, input validation, and clean error handling across your ${role} module.`,
              estimated_hours: 3,
              expected_outcome: `Resilient application behavior across edge cases.`,
              resource_hint: blueprint.learningResources[1]?.name || `${role} Architecture Guide`,
            },
            {
              day: 6,
              week: 1,
              goal: `Code Quality & Debugging Workflows`,
              topic: `Profiling & Debugging with ${blueprint.stackTools[0] || 'DevTools'}`,
              task: `Audit your Week 1 code for edge-case bugs, type safety, and clean separation of concerns.`,
              estimated_hours: 2,
              expected_outcome: `Zero lint errors and well-documented module interfaces.`,
              resource_hint: `${role} Best Practices Checklist`,
            },
            {
              day: 7,
              week: 1,
              goal: 'Week 1 Synthesis & GitHub Milestone',
              topic: 'Clean Modular Repository',
              task: `Publish Week 1 ${role} code to GitHub with clear commit history and setup instructions.`,
              estimated_hours: 2,
              expected_outcome: 'Clean repository ready to showcase foundational competency.',
              resource_hint: 'Git & GitHub Portfolio Standards',
            },
          ],
        },
        {
          week: 2,
          title: `Week 2: Advanced ${gap2}, APIs & Performance`,
          theme: `${blueprint.apiOrArchitectureTopic} and ${gap2}`,
          days: [
            {
              day: 8,
              week: 2,
              goal: `Deep Dive into ${gap2}`,
              topic: `${gap2} Core Workflows`,
              task: `Implement core features using ${gap2} and integrate them into your ${role} project stack.`,
              estimated_hours: 2,
              expected_outcome: `Hands-on fluency in ${gap2} for technical assessments.`,
              resource_hint: `Official ${gap2} Documentation`,
            },
            {
              day: 9,
              week: 2,
              goal: `API Integration & Data Contracts`,
              topic: blueprint.apiOrArchitectureTopic,
              task: `Build and integrate structured API endpoints/clients with request validation, loading states, and error recovery.`,
              estimated_hours: 3,
              expected_outcome: `Seamless end-to-end data flow between interface and data layer.`,
              resource_hint: `${role} API Design Guide`,
            },
            {
              day: 10,
              week: 2,
              goal: `Performance & Optimization`,
              topic: blueprint.performanceTopic,
              task: `Profile runtime performance and apply ${role}-specific optimizations to reduce latency and resource usage.`,
              estimated_hours: 3,
              expected_outcome: `Measurable improvement in execution speed and responsiveness.`,
              resource_hint: blueprint.learningResources[2]?.name || 'Performance Optimization Docs',
            },
            {
              day: 11,
              week: 2,
              goal: `Mastering ${gap3}`,
              topic: `${gap3} Integration`,
              task: `Incorporate ${gap3} into your workflow to solve a realistic ${role} engineering challenge.`,
              estimated_hours: 2,
              expected_outcome: `Verified project capability in ${gap3}.`,
              resource_hint: `${gap3} Practical Tutorial`,
            },
            {
              day: 12,
              week: 2,
              goal: `Automated Testing & Quality Assurance`,
              topic: blueprint.testingTopic,
              task: `Write automated unit and integration tests covering critical user/data flows in your ${role} project.`,
              estimated_hours: 2,
              expected_outcome: `80%+ test coverage protecting core features against regressions.`,
              resource_hint: `${role} Testing Documentation`,
            },
            {
              day: 13,
              week: 2,
              goal: `Security & Authentication Best Practices`,
              topic: `Secure ${role} Engineering`,
              task: `Implement authentication, route/endpoint protection, input sanitization, and environment variable security.`,
              estimated_hours: 2,
              expected_outcome: `Production-grade security posture across your codebase.`,
              resource_hint: 'OWASP Developer Security Guide',
            },
            {
              day: 14,
              week: 2,
              goal: 'Week 2 Review & Refactoring',
              topic: 'End-to-End Stack Integration',
              task: `Connect ${gap1}, ${gap2}, and ${gap3} into a unified, well-tested application template.`,
              estimated_hours: 2,
              expected_outcome: 'Complete mid-point milestone with verified test suite.',
              resource_hint: 'Clean Code Architecture Principles',
            },
          ],
        },
        {
          week: 3,
          title: `Week 3: Standout ${role} Capstone Project`,
          theme: `Building and deploying: ${blueprint.capstoneTitle}`,
          days: [
            {
              day: 15,
              week: 3,
              goal: 'Capstone Scoping & System Design',
              topic: blueprint.capstoneTitle,
              task: `Design the architecture, data models, and feature specifications for your ${role} capstone (${blueprint.capstoneStack.join(', ')}).`,
              estimated_hours: 2,
              expected_outcome: 'Clear architecture diagram and project roadmap.',
              resource_hint: 'Excalidraw / Mermaid.js System Diagrams',
            },
            {
              day: 16,
              week: 3,
              goal: `Core Foundation & Data Layer`,
              topic: `${blueprint.capstoneStack[0] || primarySkill} & ${blueprint.capstoneStack[1] || gap1}`,
              task: `Scaffold the capstone repository and implement the core data/state layer using ${blueprint.capstoneStack.slice(0, 2).join(' and ')}.`,
              estimated_hours: 3,
              expected_outcome: 'Working core engine with clean modular structure.',
              resource_hint: `${blueprint.capstoneStack[0] || primarySkill} Documentation`,
            },
            {
              day: 17,
              week: 3,
              goal: `Primary Feature Implementation`,
              topic: `Building with ${gap1} & ${gap2}`,
              task: `Implement the flagship interactive features of "${blueprint.capstoneTitle}" demonstrating ${gap1} and ${gap2}.`,
              estimated_hours: 3,
              expected_outcome: 'Complete primary user/system workflow operating end-to-end.',
              resource_hint: `${role} Project Implementation Guide`,
            },
            {
              day: 18,
              week: 3,
              goal: 'Advanced Capabilities & Edge Cases',
              topic: blueprint.apiOrArchitectureTopic,
              task: `Add real-time feedback, search/filtering, pagination, or asynchronous processing to elevate project depth.`,
              estimated_hours: 3,
              expected_outcome: 'Feature-complete application matching industry standards.',
              resource_hint: `${role} Engineering Patterns`,
            },
            {
              day: 19,
              week: 3,
              goal: 'UI/UX Polish & Responsiveness',
              topic: `User Experience & ${blueprint.stackTools[2] || 'Accessibility'}`,
              task: `Refine the interface, visual hierarchy, error states, and responsive behavior for recruiter review.`,
              estimated_hours: 3,
              expected_outcome: 'Recruiter-ready, intuitive project presentation.',
              resource_hint: 'Modern UI/UX Polish Checklist',
            },
            {
              day: 20,
              week: 3,
              goal: 'Live Public Deployment',
              topic: blueprint.deploymentTarget,
              task: `Deploy your ${role} capstone live to ${blueprint.deploymentTarget} with a public HTTPS link.`,
              estimated_hours: 2,
              expected_outcome: 'Live working URL ready to add to your resume and LinkedIn.',
              resource_hint: `${blueprint.deploymentTarget} Deployment Docs`,
            },
            {
              day: 21,
              week: 3,
              goal: 'Performance Audit & Quantitative Benchmarks',
              topic: blueprint.performanceTopic,
              task: `Benchmark your deployed capstone and record concrete metrics (load speed, lighthouse score, or response time).`,
              estimated_hours: 2,
              expected_outcome: 'Quantitative performance metrics to cite in resume bullet points.',
              resource_hint: 'Performance Benchmarking Guide',
            },
            {
              day: 22,
              week: 3,
              goal: 'Demo Video & GitHub README Showcase',
              topic: 'Technical Documentation',
              task: 'Record a 90-second walkthrough video and write a comprehensive GitHub README with screenshots and architecture notes.',
              estimated_hours: 2,
              expected_outcome: 'Standout GitHub repository that immediately impresses hiring managers.',
              resource_hint: 'GitHub Portfolio README Template',
            },
          ],
        },
        {
          week: 4,
          title: `Week 4: ${role} Interviews & Strategic Outreach`,
          theme: `Cracking ${role} technical rounds, ATS resume optimization, and direct applications`,
          days: [
            {
              day: 23,
              week: 4,
              goal: `${role} Core Concepts Verbalization`,
              topic: blueprint.interviewTopics[0],
              task: `Practice clear, structured explanations and code examples for: ${blueprint.interviewTopics[0]}.`,
              estimated_hours: 2,
              expected_outcome: 'Articulate, confident answers in technical screening rounds.',
              resource_hint: `${role} Interview Preparation Guide`,
            },
            {
              day: 24,
              week: 4,
              goal: `${role} Architecture & Deep-Dive Drills`,
              topic: blueprint.interviewTopics[1],
              task: `Practice whiteboard/live-coding walkthroughs covering: ${blueprint.interviewTopics[1]}.`,
              estimated_hours: 2,
              expected_outcome: 'Strong command of framework and architecture trade-offs.',
              resource_hint: `${role} System Design Notes`,
            },
            {
              day: 25,
              week: 4,
              goal: 'Timed Coding & Machine Round Practice',
              topic: `Problem Solving in ${primarySkill}`,
              task: `Complete 3 timed coding or machine-coding challenges relevant to ${role} interviews.`,
              estimated_hours: 3,
              expected_outcome: 'Confidence writing clean, working code under interview time constraints.',
              resource_hint: 'FrontendMentor / LeetCode / NeetCode',
            },
            {
              day: 26,
              week: 4,
              goal: 'ATS Resume Tailoring (Impact Formula)',
              topic: `Resume Optimization for ${role}`,
              task: `Update your resume with ${primarySkill}, ${gap1}, ${gap2}, and your deployed "${blueprint.capstoneTitle}" metrics.`,
              estimated_hours: 2,
              expected_outcome: `ATS-optimized resume tailored specifically for ${role} openings.`,
              resource_hint: 'CareerScout Resume Optimization Guide',
            },
            {
              day: 27,
              week: 4,
              goal: 'Portfolio & LinkedIn Profile Alignment',
              topic: 'Recruiter Discoverability',
              task: `Pin your ${role} capstone on GitHub, update your LinkedIn headline to "${role}", and feature your live demo link.`,
              estimated_hours: 2,
              expected_outcome: 'High-converting profile for inbound recruiter searches.',
              resource_hint: 'LinkedIn Tech Portfolio Guide',
            },
            {
              day: 28,
              week: 4,
              goal: 'Full Mock Technical Interview',
              topic: blueprint.interviewTopics[2],
              task: `Conduct a 45-minute mock interview defending your capstone architecture and answering ${blueprint.interviewTopics[2]}.`,
              estimated_hours: 2,
              expected_outcome: 'Eliminates interview blind spots before real company rounds.',
              resource_hint: 'Pramp / Peer Mock Interview',
            },
            {
              day: 29,
              week: 4,
              goal: 'Targeted Engineer & Recruiter Outreach',
              topic: 'Referral & Cold Outreach',
              task: `Send 8 personalized notes to hiring managers and engineers for ${role} roles sharing your live project link.`,
              estimated_hours: 2,
              expected_outcome: 'Direct referral conversations bypassing standard resume queues.',
              resource_hint: 'CareerScout Outreach Templates',
            },
            {
              day: 30,
              week: 4,
              goal: 'Verified Opportunity Application Surge',
              topic: 'Direct Verified Submissions',
              task: `Apply to your top matched ${role} opportunities on the CareerScout Dashboard with your updated resume and portfolio.`,
              estimated_hours: 2,
              expected_outcome: `Active high-match applications for ${role} positions.`,
              resource_hint: 'CareerScout Opportunity Dashboard',
            },
          ],
        },
      ],
    };

    res.json(fallbackRoadmap);
  } catch (err: any) {
    res.status(500).json({ error: `Roadmap generation failed: ${err.message}` });
  }
});

app.post('/api/career/report', async (req: Request, res: Response) => {
  try {
    const { profile, selected_opportunities } = req.body;
    const skills: string[] = Array.isArray(profile?.skills) ? profile.skills : [];
    const langs: string[] = Array.isArray(profile?.programming_languages) ? profile.programming_languages : [];
    const frameworks: string[] = Array.isArray(profile?.frameworks) ? profile.frameworks : [];
    const tools: string[] = Array.isArray(profile?.tools) ? profile.tools : [];
    const role = (profile?.preferred_role || '').trim();
    if (!role) {
      return res.status(400).json({ error: 'Target role is required to generate a Career Report.' });
    }

    const blueprint = getRoleBlueprint(role);

    // Combine all unique candidate skills
    const allUserSkills = Array.from(
      new Set([...skills, ...langs, ...frameworks, ...tools].map((s) => s.trim()).filter(Boolean))
    );
    const userSkillsLower = new Set(allUserSkills.map((s) => s.toLowerCase()));

    // Compute role-specific matched and missing skills against the target role blueprint
    const blueprintMatched = [...blueprint.coreSkills, ...blueprint.stackTools].filter((item) =>
      allUserSkills.some(
        (u) =>
          u.toLowerCase() === item.toLowerCase() ||
          item.toLowerCase().includes(u.toLowerCase()) ||
          u.toLowerCase().includes(item.toLowerCase().split(' ')[0])
      )
    );

    const blueprintMissing = blueprint.coreSkills.filter(
      (item) =>
        !allUserSkills.some(
          (u) =>
            u.toLowerCase() === item.toLowerCase() ||
            item.toLowerCase().includes(u.toLowerCase()) ||
            u.toLowerCase().includes(item.toLowerCase().split(' ')[0])
        )
    );

    // Evaluate profile against target opportunities if user has searched for jobs
    const hasRelevantOpportunities =
      Array.isArray(selected_opportunities) && selected_opportunities.length > 0;

    let dynamicAvgJobMatch = 0;
    const jobMissingCounts: Record<string, number> = {};

    if (hasRelevantOpportunities) {
      const coreSkillEvalJobs = selected_opportunities.map((job: any) =>
        calculateDeterministicMatchScore(profile, job)
      );
      dynamicAvgJobMatch =
        coreSkillEvalJobs.reduce((acc: number, curr: any) => acc + curr.overall_score, 0) /
        Math.max(coreSkillEvalJobs.length, 1);

      for (const ev of coreSkillEvalJobs) {
        for (const miss of ev.missing_skills || []) {
          jobMissingCounts[miss] = (jobMissingCounts[miss] || 0) + 1;
        }
      }
    } else {
      // Score directly against the user's chosen Target Role blueprint
      const roleCoverageRatio =
        blueprintMatched.length / Math.max(blueprint.coreSkills.length, 1);
      dynamicAvgJobMatch = Math.min(Math.round(35 + roleCoverageRatio * 60), 96);
    }

    // Prioritize role-specific missing skills so unrelated skills (e.g. Docker/PyTorch for Web Dev) never leak in
    const sortedJobMissing = Object.entries(jobMissingCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k)
      .filter((k) =>
        blueprint.coreSkills.some((cs) => cs.toLowerCase().includes(k.toLowerCase())) ||
        blueprint.stackTools.some((st) => st.toLowerCase().includes(k.toLowerCase()))
      );

    const combinedMissing = Array.from(new Set([...sortedJobMissing, ...blueprintMissing]));
    const topMissingDisplay = combinedMissing.slice(0, 3);

    const coreSkillsScore = Math.min(skills.length * 9.5, 96);
    const stackSupportScore = Math.min((langs.length + frameworks.length + tools.length) * 5.5, 95);
    const hasProjects =
      (profile?.projects || '').trim().length > 30 ? 95 : (profile?.projects || '').trim().length > 0 ? 60 : 25;
    const hasResume =
      (profile?.resume_text || '').trim().length > 30 ? 95 : (profile?.resume_text || '').trim().length > 0 ? 60 : 25;
    const profileCompleteness = stackSupportScore * 0.5 + hasProjects * 0.3 + hasResume * 0.2;

    const computedReadiness = Math.round(
      coreSkillsScore * 0.45 + dynamicAvgJobMatch * 0.35 + profileCompleteness * 0.2
    );
    const readinessScore = Math.max(Math.min(computedReadiness, 98), 18);

    const relevantUserSkills = allUserSkills.filter((u) =>
      [...blueprint.coreSkills, ...blueprint.stackTools].some(
        (b) =>
          b.toLowerCase() === u.toLowerCase() ||
          b.toLowerCase().includes(u.toLowerCase()) ||
          u.toLowerCase().includes(b.toLowerCase().split(' ')[0].replace(/[^a-z0-9+#.]/g, ''))
      )
    );

    const topSkillsDisplay =
      relevantUserSkills.length > 0
        ? relevantUserSkills.slice(0, 4).join(', ')
        : skills.length > 0
        ? skills.slice(0, 4).join(', ')
        : blueprint.coreSkills.slice(0, 3).join(', ');

    const dynamicStrengths: string[] = [];
    if (relevantUserSkills.length > 0) {
      dynamicStrengths.push(
        `Verified competency across ${relevantUserSkills.length} role-aligned skills (${topSkillsDisplay}) for ${role}.`
      );
    } else if (allUserSkills.length > 0) {
      dynamicStrengths.push(
        `Foundational technical exposure in ${allUserSkills.slice(0, 3).join(', ')}, transitioning toward ${role} (${blueprint.coreSkills.slice(0, 3).join(', ')}).`
      );
    }
    const relevantStack = [...langs, ...frameworks].filter((item) =>
      [...blueprint.coreSkills, ...blueprint.stackTools].some(
        (b) => b.toLowerCase().includes(item.toLowerCase()) || item.toLowerCase().includes(b.toLowerCase().split(' ')[0])
      )
    );
    if (relevantStack.length > 0) {
      dynamicStrengths.push(
        `Hands-on stack coverage in ${relevantStack.slice(0, 4).join(', ')} aligned with ${blueprint.category}.`
      );
    }
    dynamicStrengths.push(
      `Academic foundation in ${profile?.branch || 'Engineering'} (${profile?.degree || 'B.Tech'}) supporting analytical problem-solving for ${role}.`
    );
    if ((profile?.projects || '').trim().length > 20) {
      dynamicStrengths.push(`Practical implementation experience demonstrated through domain projects.`);
    }

    const dynamicWeaknesses: string[] = [];
    if (topMissingDisplay.length > 0) {
      dynamicWeaknesses.push(
        `High-demand ${role} skills to add next: ${topMissingDisplay.join(', ')}.`
      );
    }
    dynamicWeaknesses.push(`Deepening mastery in: ${blueprint.apiOrArchitectureTopic}.`);
    dynamicWeaknesses.push(`Strengthening production quality via: ${blueprint.performanceTopic}.`);
    if (dynamicWeaknesses.length < 3) {
      dynamicWeaknesses.push(`Automated testing and live deployment (${blueprint.testingTopic}).`);
    }

    const tierDescription =
      readinessScore >= 85
        ? 'top 10% of applicants'
        : readinessScore >= 75
        ? 'top 20% of applicants'
        : readinessScore >= 60
        ? 'top 35% of applicants'
        : 'developing cohort of applicants';

    const recommendedTechList = Array.from(
      new Set([
        ...topMissingDisplay.map((m) => `${m} (Core requirement for ${role})`),
        ...blueprint.coreSkills
          .filter((cs) => !userSkillsLower.has(cs.toLowerCase()))
          .map((cs) => `${cs} (Recommended for ${role})`),
        ...blueprint.stackTools
          .filter((st) => !userSkillsLower.has(st.toLowerCase()))
          .map((st) => `${st} (${blueprint.category} Tooling)`),
        ...blueprint.coreSkills.map((cs) => `${cs} (Advanced ${role} Mastery)`),
      ])
    ).slice(0, 5);

    const report = {
      readiness_score: readinessScore,
      summary: `With ${allUserSkills.length} active technical skills (${topSkillsDisplay}), ${profile?.name || 'Candidate'} scores ${readinessScore}/100 for ${role} roles (${tierDescription} across India). ${
        topMissingDisplay.length > 0
          ? `Building hands-on proficiency in ${topMissingDisplay.join(', ')} will directly boost your match score for ${role} openings.`
          : `Strong coverage across core ${role} competencies; focus on shipping live deployed portfolio projects.`
      }`,
      top_strengths: dynamicStrengths.slice(0, 4),
      top_weaknesses: dynamicWeaknesses.slice(0, 3),
      recommended_technologies: recommendedTechList,
      recommended_projects: [
        {
          title: blueprint.capstoneTitle,
          description: blueprint.capstoneDesc,
          tech_stack: blueprint.capstoneStack,
          difficulty: 'Intermediate' as const,
          portfolio_value: `Directly proves end-to-end ${role} engineering capability to hiring managers.`,
        },
        {
          title: blueprint.secondaryProjectTitle,
          description: blueprint.secondaryProjectDesc,
          tech_stack: blueprint.secondaryProjectStack,
          difficulty: 'Advanced' as const,
          portfolio_value: `Demonstrates production optimization and real-world problem solving for ${role} teams.`,
        },
      ],
      recommended_learning_resources: blueprint.learningResources,
      recommended_job_types: blueprint.jobTypes,
      interview_preparation_topics: blueprint.interviewTopics,
      portfolio_recommendations: [
        `Host a live interactive demo (${blueprint.deploymentTarget}) for your flagship ${role} project.`,
        `Include architecture diagrams, setup steps, and quantitative performance benchmarks in your GitHub README.`,
        `Tailor your resume project bullets around ${blueprint.coreSkills.slice(0, 4).join(', ')} with measurable outcomes.`,
      ],
      market_insights: blueprint.marketInsight,
    };

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: `Career report generation failed: ${err.message}` });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 CareerScout AI server is running on http://0.0.0.0:${PORT}`);
    console.log(`   SerpApi Live Integration: ${serpApiKey ? 'ENABLED' : 'DEMO/FALLBACK MODE'}`);
    console.log(`   Google Gemini GenAI SDK: ${geminiApiKey ? 'ENABLED' : 'OFFLINE MODE'}\n`);
  });
}

startServer();
