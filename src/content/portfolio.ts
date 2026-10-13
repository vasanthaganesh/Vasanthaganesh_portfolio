// Single source of truth for all site copy.
// Sourced verbatim from portfolio_content_master.md + resume.

export type Stat = {
  k: string;
  v: string;
  c: string;
  highlight?: boolean;
};

export type Inspiration = {
  figure: string;
  source: string;
  quote: string;
};

export type Discipline = {
  g: string;
  t: string;
  d: string;
};

export type Project = {
  n: string;
  title: string;
  category: string;
  tags: string[];
  body: string;
  targetUsers: string;
  lifeImpact: string;
  repo?: string;
};

export type ArchiveItem = {
  title: string;
  stack: string;
  body: string;
};

export type JournalEntry = {
  date: string;
  title: string;
  body: string;
};

export type JournalTab = {
  id: string;
  label: string;
  entries: JournalEntry[];
};

export type ContactChannel = {
  k: string;
  v: string;
  href: string;
};

export const site = {
  name: "Vasanthaganesh R",
  short: "VG",
  url: "https://vasanthaganesh-portfolio-2026.vercel.app",
  handle: "@VasanthaganeshRaja",
  label: "Enterprise Backend & Distributed Systems",
  role: "Backend Java Engineer · Enterprise Microservices & Scalable Systems",
  year: 2026,
  resume: "/Vasanthaganesh_R_Resume.pdf",
  resumeFallback: "/Vasanthaganesh_R_Resume.docx",
};

export const nav = [
  { id: "about", label: "About", n: "01" },
  { id: "skills", label: "Stack", n: "02" },
  { id: "projects", label: "Work", n: "03" },
  { id: "diary", label: "Journal", n: "04" },
  { id: "contact", label: "Contact", n: "05" },
] as const;

export const hero = {
  eyebrow: "Puducherry, India — Backend Java Engineer",
  lines: ["VASANTHAGANESH"],
  cadence: "Resilient. Distributed. Precise.",
  tagline: "Backend Java Engineer · Enterprise Microservices & Scalable Systems",
  body: "Specializing in high-throughput Spring Boot microservices, ACID-compliant relational architectures, and distributed systems where reliability and zero data loss are non-negotiable.",
  ctaPrimary: { label: "See My Work", href: "#projects" },
  ctaGhost: { label: "Let's Talk", href: "#contact" },
};

export const about = {
  headline: "Engineered for scale. Crafted for resilience.",
  headlineLines: ["Engineered for scale.", "Crafted for resilience."],
  essays: [
    {
      title: "Mission-Critical Systems",
      body: "Enterprise banking doesn't allow for second chances. Every microservice, transactional boundary, and idempotent REST endpoint must be architected with absolute mathematical precision. I build distributed backends where zero data loss, strict ACID compliance, and sub-millisecond predictability aren't afterthoughts — they are the foundational contract.",
    },
    {
      title: "The Kojima Connection",
      body: "Hideo Kojima taught me that systems are the highest form of communication — total, interactive, and laden with meaning. Death Stranding isn't about parcel logistics; Metal Gear isn't about stealth. They are about the human burden and connection. That philosophy drives my software architecture: building resilient systems that quietly ease someone's day.",
    },
    {
      title: "AI as Force Multiplier",
      body: "I leverage AI workflows — from Claude API prompt engineering to automated code reviews — not as shortcuts, but as high-octane force multipliers. They enable an individual engineer to deliver with the architectural velocity and polish of a seasoned engineering squad, while keeping craft and engineering taste pristine.",
    },
  ],
  manifesto: [
    "craft resilient distributed systems",
    "transaction integrity over shortcuts",
    "every microservice is a contract",
    "learn from every failure and iterate",
    "ship clean code with fearless conviction",
  ],
  stats: [
    {
      k: "Flagship Certification",
      v: "ORACLE OCA JAVA",
      c: "Oracle Certified Associate (OCA), Java SE 8 Programmer · Core Java & Concurrency",
      highlight: true,
    },
    {
      k: "Enterprise Experience",
      v: "2+ YEARS",
      c: "Virtusa — Backend Java Developer (Citi Enterprise Banking Platform)",
    },
    {
      k: "AI Certification",
      v: "CLAUDE AI CERTIFIED",
      c: "Anthropic Prompt Engineering & Generative Workflows",
    },
    {
      k: "Hackathon Honors",
      v: "AI HACKATHONS",
      c: "3rd Prize AI-HACK, SCIMIT-23 3rd Prize, Smart India Hackathon, Jatayu",
    },
    {
      k: "Degree & Academics",
      v: "B.TECH IT",
      c: "Manakula Vinayagar Institute of Technology (CGPA: 8.32, 2023)",
    },
    {
      k: "Availability",
      v: "IMMEDIATE",
      c: "Available immediately · Open to relocation",
    },
  ] as Stat[],
  inspirations: [
    {
      figure: "Monkey D. Luffy",
      source: "One Piece",
      quote: "Hope and freedom to do things my way with fearless conviction.",
    },
    {
      figure: "Subaru Natsuki",
      source: "Re:Zero",
      quote: "Never giving up, learning from every mistake, and iterating to do better.",
    },
    {
      figure: "Hideo Kojima",
      source: "Director (MGS / Death Stranding)",
      quote: "Brilliance to think out of the world and make interactive systems meaningful.",
    },
    {
      figure: "Red Dead Redemption 2",
      source: "Rockstar Games",
      quote: "Living, organic systems — and doing good deeds to become a better person.",
    },
    {
      figure: "Thalapathy Vijay",
      source: "Leader & Actor",
      quote: "Grounded leadership, discipline, and dedication to serving people.",
    },
  ] as Inspiration[],
  timeline: [
    {
      when: "Oct 2025 — Present",
      role: "Independent Backend & Systems Engineer",
      org: "Self-Employed · Remote",
      body: "Architecting resilient distributed backends, AI conversational agents with persistent context memory, and industrial mobile inspection apps for enterprise clients.",
    },
    {
      when: "Aug 2023 — Sep 2025",
      role: "Associate Engineer — Backend Java",
      org: "Virtusa · Client: Citi",
      body: "Engineered high-concurrency Spring Boot microservices, REST APIs, and transactional workflows for Citi's global enterprise banking platform. Enforced ACID compliance, automated test coverage, and strict BFSI security standards.",
    },
    {
      when: "2022",
      role: "Technical Internships",
      org: "VEI Technology · Askan Technology",
      body: "Built IoT sensor telemetry-to-cloud data ingestion pipelines and completed in-plant engineering in cross-platform mobile frameworks.",
    },
  ],
};

export const skills = {
  headline: "SYSTEMS & BACKEND STACK.",
  headlineLines: ["Systems &", "backend stack."],
  body: "Battle-tested enterprise Java, Spring microservices, and relational databases paired with modern client-facing applications and AI-augmented developer velocity. Zero bloat.",
  tags: [
    "Core Java (8/17)",
    "Spring Boot",
    "Hibernate/JPA",
    "REST APIs",
    "Microservices",
    "PostgreSQL",
    "MySQL",
    "React",
    "React Native",
    "TypeScript",
    "Git",
    "IntelliJ IDEA",
    "Maven",
    "Python",
  ],
  disciplines: [
    {
      g: "⬡",
      t: "Enterprise Java & Microservices",
      d: "High-performance Spring Boot architectures, Java 8/17 concurrency, Hibernate/JPA object mapping, and distributed microservices with 99.99% availability.",
    },
    {
      g: "◈",
      t: "Relational & Transactional DBs",
      d: "Strict ACID compliance, PostgreSQL and MySQL schema design, query indexing and execution plan optimization, ensuring zero financial data loss.",
    },
    {
      g: "◭",
      t: "REST APIs & Systems Integration",
      d: "Contract-first RESTful microservices, API gateway routing, resilient fault tolerance, and secure BFSI banking compliance.",
    },
    {
      g: "⬙",
      t: "AI-Augmented Engineering",
      d: "Claude AI Certified workflows, Anthropic prompt engineering, LLM-assisted prototyping, and automated developer velocity.",
    },
    {
      g: "◎",
      t: "Full-Stack Client Applications",
      d: "Production-grade React and React Native web and mobile interfaces built with TypeScript, delivering responsive, frictionless client experiences.",
    },
    {
      g: "◉",
      t: "Engineering Tooling & DevOps",
      d: "Maven build automation, Git version control, IntelliJ IDEA profiling, and clean CI/CD hygiene across enterprise environments.",
    },
  ] as Discipline[],
};

export const projects: Project[] = [
  {
    n: "01",
    title: "Citi Enterprise Banking Platform (Virtusa)",
    category: "BFSI Enterprise Microservices / Core Banking",
    tags: ["Java 8/17", "Spring Boot", "Microservices", "REST APIs", "Oracle DB"],
    body: "Core enterprise banking microservices developed at Virtusa for Citi. Engineered high-throughput transaction processing pipelines, secure REST endpoints, and resilient database transactions under strict BFSI regulatory and compliance standards.",
    targetUsers: "Millions of retail and institutional banking customers.",
    lifeImpact: "Absolute transaction integrity, zero data loss, strict compliance, and 99.99% availability for financial transactions.",
  },
  {
    n: "02",
    title: "Precision Tools QC & Report Manager",
    category: "Industrial Mobile App / Shop Floor Operations",
    tags: ["React Native", "TypeScript", "Mobile", "Manufacturing", "Automated PDF"],
    body: "A specialized mobile quality-control system engineered for a precision tools manufacturing plant. Replaced error-prone manual paper inspections with an automated 20-second digital verification and reporting workflow.",
    targetUsers: "Factory floor machinists, QC inspectors, and manufacturing plant supervisors.",
    lifeImpact: "Replaces tedious paper logs with a 20-second frictionless mobile workflow, eliminating end-of-shift reporting fatigue and defective shipments.",
  },
  {
    n: "03",
    title: "AI Reflection Journal",
    category: "AI Mental Health & Introspective Technology",
    tags: ["React", "TypeScript", "AI Prompts", "Mental Wellness", "Privacy"],
    body: "An introspective digital sanctuary designed for individuals who struggle to vocalize thoughts out loud. Provides guided prompts, private reflections, and thoughtful cognitive restructuring without judgment.",
    targetUsers: "Introverts, overthinkers, and individuals navigating emotional stress, anxiety, or loneliness who struggle to express thoughts aloud.",
    lifeImpact: "Judgment-free, private digital sanctuary to untangle chaotic thoughts, transforming silent overwhelm into gentle self-discovery through guided prompts.",
    repo: "https://github.com/vasanthaganesh/AI-Reflection-Journal",
  },
  {
    n: "04",
    title: "AI Companion",
    category: "Context-Aware Conversational AI / Social Isolation Support",
    tags: ["Python", "LLM Workflows", "Context Memory", "Conversational AI", "TypeScript"],
    body: "An empathetic conversational partner engineered with persistent contextual memory to combat social isolation. Retains conversational nuances over time, offering a supportive and attentive presence.",
    targetUsers: "Introverts, people coping with social isolation or loneliness, and anyone needing a safe, attentive sounding board.",
    lifeImpact: "Attentive, empathetic presence with persistent contextual memory, bridging emotional isolation with judgment-free conversation.",
    repo: "https://github.com/vasanthaganesh/AI_Companion",
  },
  {
    n: "05",
    title: "Daily Vegetable Price Tracker",
    category: "Hyper-Local Community Utility / Market Transparency",
    tags: ["React Native", "Mobile", "Community", "Live Rates", "Puducherry"],
    body: "A community utility publishing verified daily morning vegetable rates across markets in Puducherry. Eliminates middlemen price gouging and equips daily-wage earners and families with honest market data.",
    targetUsers: "Local families, daily-wage workers, and street vendors across Puducherry.",
    lifeImpact: "Protects household budgets with real-time morning market vegetable rates, preventing price exploitation by middlemen.",
  },
];

export const archive: ArchiveItem[] = [
  {
    title: "Precision Tools Company Website",
    stack: "React · TypeScript · Web",
    body: "Clean, performant B2B showcase for precision manufacturing client with optimized asset loading.",
  },
  {
    title: "AppverseApplication",
    stack: "Android · Java · Firebase",
    body: "Students ↔ professors: assignment submissions, announcements and real-time notifications.",
  },
  {
    title: "AudioBookApplication",
    stack: "Android · Accessibility",
    body: "Text-to-speech, adjustable playback and offline support for learning-disabled and second-language learners.",
  },
  {
    title: "Abstraction Based Text Summarization",
    stack: "Python · NLP · Web App",
    body: "Abstractive NLP summarization helping investigation officers read large volumes of articles faster.",
  },
];

export const journal: JournalTab[] = [
  {
    id: "systems",
    label: "On Systems",
    entries: [
      {
        date: "March 2025",
        title: "The gravity of banking transactions & zero-loss systems",
        body: "In enterprise BFSI microservices, distributed transactions don't forgive ambiguity. When handling retail and commercial accounts, every ledger entry demands absolute idempotency, strict two-phase commit discipline, and deterministic rollback handlers. True engineering isn't about writing code that works on the happy path — it's about guaranteeing zero data loss when network partitions happen during peak clearing hours.",
      },
      {
        date: "January 2025",
        title: "Clean architecture: why boundaries save distributed systems",
        body: "A clean architectural boundary is an insurance policy against system entropy. By decoupling domain business logic from Spring Boot framework artifacts and persistence models via clean ports and adapters, your core financial invariants remain untouchable. When APIs change or databases are migrated, the business core doesn't flinch. Keep the domain pure, and the system survives.",
      },
      {
        date: "November 2024",
        title: "The craft of enterprise Java in modern systems",
        body: "Enterprise Java is often criticized for verbosity, but in high-throughput environments, predictable GC semantics, strong static typing, and mature concurrency models are unmatched superpowers. Moving from Java 8 idioms to modern Java 17 records, pattern matching, and virtual threads gives us the best of both worlds: expressive syntax backed by decades of battle-hardened JVM performance.",
      },
    ],
  },
  {
    id: "mindset",
    label: "On Games, Story & Mindset",
    entries: [
      {
        date: "February 2025",
        title: "Kojima's vision: software that carries human meaning",
        body: "Hideo Kojima proved that interactive software can be a deeply philosophical medium. Death Stranding turns the mechanical act of traversing hostile terrain and making deliveries into an essay on human connection and carrying weight for strangers. When building software, I channel that exact mindset: every interface and backend pipeline should quietly make someone's daily life less burdensome.",
      },
      {
        date: "October 2024",
        title: "RDR2 and living systems: the code of good deeds",
        body: "Red Dead Redemption 2's world feels alive because every system reacts organically to morality and intention. Arthur Morgan's journey reminds us that redemption isn't a grand speech — it's a relentless sequence of quiet, good deeds. In engineering, that means writing ethical code: respecting user privacy, refusing dark patterns, and building tools that genuinely protect everyday people.",
      },
      {
        date: "August 2024",
        title: "Subaru's resilience: iterating past failure",
        body: "Subaru Natsuki in Re:Zero faces terrifying odds and endless failures, yet he restarts every loop with greater insight and unwavering conviction. In complex systems engineering, stack traces and deployment setbacks aren't failures — they are deterministic clues. The true discipline is learning from every mistake, iterating without fear, and persevering until the architecture is unbreakable.",
      },
    ],
  },
  {
    id: "ai",
    label: "On AI & Creation",
    entries: [
      {
        date: "April 2025",
        title: "Building for introverts: the AI Reflection Journal",
        body: "Traditional journaling can be intimidating when you're overwhelmed by noisy internal thoughts. Building the AI Reflection Journal was about creating a private, judgment-free digital sanctuary. Through compassionate, contextually-aware prompts, the app helps introverts and overthinkers untangle complex emotions and find gentle clarity in their own time.",
      },
      {
        date: "December 2024",
        title: "Contextual memory in AI Companion: empathy through continuity",
        body: "Most chatbots treat conversations as disposable tokens. With AI Companion, the objective was combating social isolation through persistent contextual memory. By maintaining continuity across conversations and remembering personal anecdotes, the agent becomes an attentive, safe sounding board that bridges the gap between isolation and empathetic presence.",
      },
      {
        date: "September 2024",
        title: "Claude workflows & Google Cloud hackathons: expanding velocity",
        body: "Winning 3rd prize at AI-HACK and SCIMIT-23 taught me the true leverage of prompt engineering and cloud-native AI pipelines. Claude AI certification isn't about asking an LLM to generate snippets; it's about orchestrating structured multi-step reasoning, prompt chaining, and evaluation loops to achieve 10x engineering velocity while maintaining strict code quality.",
      },
    ],
  },
];

export const contact = {
  headline: ["LET'S BUILD", "SOMETHING."],
  body: "Looking for a backend engineer who values transaction integrity, clean architecture, and systems that scale? Whether enterprise microservices, distributed backends, or collaborative engineering — let's connect.",
  email: "vasanthaganesh11@gmail.com",
  phone: "+91 7871029435",
  channels: [
    { k: "Portfolio", v: "vasanthaganesh-portfolio-2026.vercel.app", href: "https://vasanthaganesh-portfolio-2026.vercel.app" },
    { k: "Email", v: "vasanthaganesh11@gmail.com", href: "mailto:vasanthaganesh11@gmail.com" },
    { k: "Phone", v: "+91 7871029435", href: "tel:+917871029435" },
    { k: "LinkedIn", v: "vasanthaganesh-raja", href: "https://www.linkedin.com/in/vasanthaganesh-raja-085124231" },
    { k: "GitHub", v: "vasanthaganesh", href: "https://github.com/vasanthaganesh" },
    { k: "Telegram", v: "@VasanthaganeshRaja", href: "https://t.me/VasanthaganeshRaja" },
  ] as ContactChannel[],
  availability: "Available immediately · Open to relocation",
};

export const footer = {
  mark: `VG — ${site.year}`,
  colophon: "CRAFTED FOR SCALE. DEPLOYED WITH INTEGRITY.",
};
