
import { Github, Linkedin, Mail, Globe } from 'lucide-react';

export const personalInfo = {
  name: "NASHID K",
  title: "Software Developer (MERN Stack)",
  location: "Kerala, India",
  email: "nashidk1999@gmail.com",
  linkedin: "https://www.linkedin.com/in/nashid-mern",
  github: "https://github.com/Nashid-k",
  portfolio: "https://portfolio-3py8.vercel.app",
  totalExperience: "2 Years (Jan 2023 - Dec 2025)",
  status: "Recently working as a Software Engineer, seeking a new role in the same field.",
  socials: [
    { icon: Mail, link: "mailto:nashidk1999@gmail.com", label: "Email" },
    { icon: Linkedin, link: "https://www.linkedin.com/in/nashid-mern", label: "LinkedIn" },
    { icon: Github, link: "https://github.com/Nashid-k", label: "GitHub" },
  ]
};

export const summary = "Software Developer with hands-on experience building and deploying full-stack web applications using the MERN stack and TypeScript. Skilled in developing responsive user interfaces, secure REST APIs, authentication systems, and production-ready features. Strong problem-solving ability with experience delivering end-to-end functionality in real-world development environments. Currently seeking a new opportunity to switch roles in the software engineering field.";

export const skills = {
  Frontend: ["React.js", "JavaScript", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Bootstrap"],
  Backend: ["Node.js", "Express.js", "REST APIs", "JWT Authentication"],
  Databases: ["MongoDB", "PostgreSQL"],
  Tools: ["Git", "GitHub", "Postman", "AWS EC2", "Vercel", "Render", "Linux"],
  Core: ["Full-Stack Development", "API Design", "Debugging", "Performance Optimization"]
};

export const experience = [
  {
    role: "Software Developer (Project-Based)",
    company: "Packapeer Pvt Ltd",
    location: "Kerala, India",
    points: [
      "Worked on multiple full-stack web applications using React, Node.js, Express, and MongoDB.",
      "Implemented RESTful APIs, authentication systems, and role-based access control.",
      "Delivered end-to-end features including frontend UI, backend logic, and database integration.",
      "Followed Git-based workflows, debugging practices, and deployment processes aligned with real engineering teams."
    ]
  },
  {
    role: "Technical System Specialist",
    company: "Hajee A. P. Bava & Co.",
    location: "Jharkhand, India",
    points: [
      "Automated internal workflows and reporting systems, improving operational efficiency.",
      "Supported and maintained IT systems across multiple facilities, ensuring high availability and reliability.",
      "Diagnosed and resolved system, hardware, and network issues in production environments.",
      "Strengthened documentation, analytical thinking, and structured problem-solving skills."
    ]
  }
];

export const projects = [
  {
    title: "Commerce Management Platform",
    tech: "MERN Stack",
    description: [
      "Designed and developed a full-stack commerce platform supporting user authentication, product catalog, cart, and order workflows.",
      "Implemented admin dashboard with role-based access control for inventory and order management.",
      "Integrated Razorpay payment gateway for secure online transactions.",
      "Built RESTful APIs using Node.js, Express, and MongoDB."
    ]
  },
  {
    title: "Content Publishing Platform",
    tech: "MERN Stack",
    description: [
      "Developed a multi-user content management system with JWT-based authentication and role-based permissions.",
      "Implemented CRUD operations for articles, comments, and user profiles.",
      "Optimized database queries to improve feed and search performance."
    ]
  },
  {
    title: "Marketplace Listing System",
    tech: "React, Node.js",
    description: [
        "Built a product listing application with authentication, image uploads, and CRUD functionality.",
        "Implemented form validation, protected routes, and responsive UI components."
    ]
  },
  {
    title: "Media Browsing Interface",
    tech: "React",
    description: [
        "Developed a responsive media browsing interface with dynamic routing and reusable UI components.",
        "Focused on layout consistency, performance, and mobile responsiveness."
    ]
  }
];

export const education = [
  {
    degree: "Self-Directed Full Stack Development",
    institution: "Self-Taught",
    details: [
      "Completed structured learning in MERN stack and TypeScript through hands-on projects and documentation.",
      "Solved 100+ JavaScript and DSA problems on LeetCode.",
      "HackerRank Certified in JavaScript (Basic)."
    ]
  }
];

export const strengths = [
  "Ownership of features from development through deployment",
  "Ability to work independently and within collaborative teams",
  "Strong debugging and analytical mindset",
  "Focus on clean, maintainable, and scalable code"
];
