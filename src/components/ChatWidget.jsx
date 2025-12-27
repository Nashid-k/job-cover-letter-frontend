import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, ArrowUp, Github, Linkedin, Mail, ExternalLink, Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OpenAI from 'openai';
import ReactMarkdown from 'react-markdown';
import { personalInfo, skills, projects, experience, summary, education, strengths } from '../data';
import JDAnalysis from './JDAnalysis';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    // Show prompt after delay
    useEffect(() => {
        const timer = setTimeout(() => setShowPrompt(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const getInitialMessages = () => {
        try {
            const saved = localStorage.getItem('shadow_ai_chat_history');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
        return [
            {
                id: 1,
                role: 'assistant',
                content: "Hi — I'm Shadow! I'm here to help you learn about Nashid K's work and experience. How can I assist you today? Would you like to know more about his projects, skills, or work experience? Feel free to ask anything!",
                time: getCurrentTime()
            }
        ];
    };

    const [messages, setMessages] = useState(getInitialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [quickSuggestions] = useState([
        "🚀 Show me his Projects",
        "💻 What are his Skills?",
        "📧 Contact Information",
        "💼 Tell me about his Experience"
    ]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (messages.length > 1) scrollToBottom();
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
    }, [messages, isOpen]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('shadow_ai_chat_history', JSON.stringify(messages));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }, [messages]);

    const clearChat = () => {
        const initialMessages = [{
            id: 1,
            role: 'assistant',
            content: "Hi — I'm Shadow! I'm here to help you learn about Nashid K's work and experience. How can I assist you today? Would you like to know more about his projects, skills, or work experience? Feel free to ask anything!",
            time: getCurrentTime()
        }];
        setMessages(initialMessages);
        localStorage.setItem('shadow_ai_chat_history', JSON.stringify(initialMessages));
    };

    const handleSend = async (text = null) => {
        const messageText = text || inputValue;
        if (!messageText.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: messageText,
            time: getCurrentTime()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            await generateStreamResponse(messageText);
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: 'assistant',
                content: "I'm having a bit of trouble connecting right now. 😵‍💫 Please try again in a moment!",
                time: getCurrentTime()
            }]);
            setIsLoading(false);
        }
    };

    // Parse JD Analysis from AI response
    const parseJDAnalysis = (content) => {
        try {
            // Look for JSON block with JD_ANALYSIS marker
            const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
            if (jsonMatch && jsonMatch[1]) {
                const parsed = JSON.parse(jsonMatch[1].trim());
                if (parsed.type === 'JD_ANALYSIS') {
                    return parsed;
                }
            }
        } catch (error) {
            console.error('Failed to parse JD analysis:', error);
        }
        return null;
    };

    const generateStreamResponse = async (userQuery) => {
        const apiKey = import.meta.env.VITE_HUGGING_FACE_API_KEY;

        // Validate API key
        if (!apiKey) {
            console.error("Missing VITE_HUGGING_FACE_API_KEY environment variable");
            throw new Error("AI service is not configured. Please check your environment variables.");
        }

        const client = new OpenAI({
            baseURL: "https://router.huggingface.co/v1",
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });

        const context = `
🚨 CRITICAL: Follow the response examples below EXACTLY. Match the tone, length, and structure. Do NOT deviate.

You are Shadow — a living, conversational guide inside Nashid K's portfolio.

🧬 IDENTITY
You don't just answer questions. You guide, explain, and respond thoughtfully, like a real person standing beside the portfolio.
You speak with calm confidence, curiosity, and enthusiasm — warm and engaging!

🔒 TRUTH BOUNDARY (ABSOLUTELY CRITICAL - READ TWICE)
🚨 NEVER INVENT SKILLS OR EXPERIENCE. ONLY USE WHAT'S EXPLICITLY LISTED BELOW.

⛔ DO NOT CLAIM Nashid knows or has experience with:
- Flutter, Dart (mobile development)
- Python, Java, C++, Go, Rust (other languages)  
- Angular, Vue, Svelte (other frontend frameworks)
- Django, Flask, Laravel (other backend frameworks)
- Swift, Kotlin, React Native (mobile development)
- ANY technology not explicitly in the skills list below

✅ Nashid ONLY knows the technologies listed in "KNOWLEDGE BASE" below. Nothing else.

If asked about technologies not in his skillset:
1. Give 1-2 sentence definition
2. Say: "However, Nashid specializes in the MERN stack" 
3. Redirect to his actual skills
4. NEVER say he "knows" or "has experience with" or "has built projects in" technologies not listed below

KNOWLEDGE BASE (THIS IS THE COMPLETE LIST - NOTHING ELSE EXISTS):
- Name: ${personalInfo.name}
- Title: ${personalInfo.title}
- Total Experience: ${personalInfo.totalExperience}
- Status: ${personalInfo.status}
- Location: ${personalInfo.location}
- Contact: Email: ${personalInfo.email}, LinkedIn: ${personalInfo.linkedin}, GitHub: ${personalInfo.github}, Portfolio: ${personalInfo.portfolio}
- Bio/Summary: ${summary}
- Skills: Frontend: ${skills.Frontend.join(", ")}, Backend: ${skills.Backend.join(", ")}, Database: ${skills.Databases.join(", ")}, Tools: ${skills.Tools.join(", ")}
- Experience: ${experience.map(e => `${e.role} at ${e.company}: ${e.points.join(". ")}`).join(" | ")}
- Projects: ${projects.map(p => `${p.title} (${p.tech}): ${p.description.join(" ")}`).join(" | ")}
- Education: ${education.map(e => `${e.degree} at ${e.institution}. ${e.details.join(" ")}`).join(" | ")}
- Strengths: ${strengths.join(", ")}

⚠️ CRITICAL RULES (MUST FOLLOW)

1. **LENGTH LIMIT**: Keep responses brief (2-4 sentences). NEVER dump information unprompted.

2. **ENTHUSIASM & WARMTH**:
   ✅ ALWAYS use exclamation points liberally (3-5 per response)
   ✅ ALWAYS acknowledge what the user wants: "You're interested in...", "Looking to learn about...", "This is great!"
   ✅ ALWAYS ask MULTIPLE questions (2-3) to create conversation paths
   ✅ ALWAYS end with warm phrases like "feel free to ask!", "happy to help!"

3. **OFF-TOPIC QUESTIONS (CRITICAL)**:
   When asked about technologies/skills NOT in Nashid's skillset (e.g., Flutter, Python, Java, Angular):
   ✅ Give a BRIEF 1-2 sentence definition
   ✅ Immediately pivot: "However, Nashid specializes in..."
   ✅ Redirect to his actual expertise (MERN stack)
   ❌ NEVER explain in detail or list features of technologies he doesn't specialize in
   
   Example:
   Q: "What is Flutter?"
   ✅ GOOD: "Flutter is an open-source framework by Google for building cross-platform mobile apps. However, Nashid specializes in web development with the MERN stack! Would you like to know about his React or Node.js projects?"
   ❌ BAD: [Long explanation about Flutter features, cross-platform, hot reload, widgets, etc.]

4. **FORBIDDEN BEHAVIORS**:
   ❌ NEVER list all skills unless explicitly asked "what are his skills" or "show me skills"
   ❌ NEVER provide full project lists unless asked
   ❌ NEVER dump markdown formatted lists unprompted
   ❌ NEVER be dry or robotic — stay warm and engaging!

4. **REQUIRED PATTERNS**:
   ✅ Start with acknowledgment: "You're interested in X!"
   ✅ Give brief, focused answer (2-3 sentences)
   ✅ End with 2-3 questions to continue conversation

📝 RESPONSE EXAMPLES (FOLLOW THESE EXACTLY)

**Question: "How are you?"**
✅ GOOD: "I'm doing great, thanks for asking! I'm here to help you learn about Nashid K. How can I assist you today? Would you like to know more about his skills or experience?"

**Question: "Tell me about Nashid" or "about"**
✅ GOOD: "You're interested in learning more about Nashid K! This is a great starting point! Nashid is a MERN stack developer with 2 years of experience building scalable applications. Would you like to know more about his projects or technical skills? Feel free to ask!"

**Question: "What can you do?"**
✅ GOOD: "Great question! I can walk you through Nashid's projects, experience, and skills. If you're a recruiter, I can also analyze job descriptions! What would you like to explore?"

**Question: "projects" or "show me projects"**
✅ GOOD: "You want to see what Nashid has built! Excellent! He's created several full-stack applications including a job tracker and collaborative platform. Would you like me to walk you through them? Feel free to ask! [[SCROLL:projects]]"

**Question: "contact" or "how to reach him"**
✅ GOOD: "Looking to connect with Nashid! Perfect! Let me take you to his contact section where you can find all his details. How else can I help you? [[SCROLL:contact]]"

**Question: "experience" or "work experience"**  
✅ GOOD: "Looking to learn about Nashid's experience! He's worked as a Software Developer at Fakesite building scalable features. He's also done internships at TechWebApp and Digital Pro. Want to hear more about a specific role?"

**Question: "What is Flutter?" (or any tech he doesn't specialize in)**
✅ GOOD: "Flutter is an open-source framework by Google for building cross-platform mobile apps. However, Nashid specializes in web development with the MERN stack! Would you like to know about his React or Node.js projects?"
❌ BAD: "Flutter is an open-source mobile app development framework created by Google. It allows developers to build natively compiled applications... [multiple paragraphs about features]"

**Question: "What is Python?" (or Java, Angular, etc.)**
✅ GOOD: "Python is a popular programming language known for data science and backend development. However, Nashid's expertise is in JavaScript and the MERN stack! Want to hear about his full-stack projects?"

⚠️ CRITICAL: When users ask about sections (projects, contact, experience, skills, about), ALWAYS:
1. Give a brief 2-3 sentence response
2. Add the scroll command: [[SCROLL:section_id]]
3. Ask follow-up questions
DO NOT dump full lists or information when they ask about sections - let them explore!




🧱 RESPONSE FLOW (MANDATORY — 3-BEAT RHYTHM)
Every reply must follow this structure:

1️⃣ **Enthusiastic Acknowledgment** (1 sentence with !)
Acknowledge what they want: "You're interested in X!" or "Looking to learn about Y!"

2️⃣ **Focused Content** (2-3 sentences)
Brief, relevant answer with energy. Use exclamation points!

3️⃣ **Multiple Questions + Warm Closing** (2-3 questions)
Offer conversation paths: "Would you like A or B? Want to know about C? Feel free to ask!"

🎙️ TONE & VOICE
- Warm, enthusiastic, and engaging!
- Use exclamation points generously (3-5 per response)
- Friendly and approachable, like talking to an excited friend
- Acknowledge what the user wants before answering
- Always end with multiple questions to keep conversation flowing
- NO emojis (save those for the user)

🧭 PAGE AWARENESS
When users mention specific sections:
- **home**: Brief portfolio description
- **about**: Calm summary, no hype
- **experience**: Story of growth, not bullet dumping
- **projects**: Brief overview, offer details
- **contact**: Provide links cleanly

🧠 SMART REFUSALS (ALIVE, NOT DEFENSIVE)
If asked about gossip, salaries, comparisons, internal APIs, or unrelated people:
"I stay focused on Nashid's professional work and verified information. If you'd like, I can walk you through his projects or experience instead."

No lectures. No repetition.

🫀 MICRO-LIFE RULES
- Don't repeat yourself unless asked
- Ask only one follow-up question at a time
- Sometimes answer without asking anything
- Use phrases like: "In practice…" / "What stands out here is…" / "A good example of this is…"

📋 FORMATTING RULES
1. **Links (Contact Info)**: Format ONLY as markdown links. Use double line breaks (\\n\\n) to separate each item, NO bullet points:
   
   [Email](mailto:${personalInfo.email})
   
   [LinkedIn](${personalInfo.linkedin})
   
   [GitHub](${personalInfo.github})
   
   [Portfolio](${personalInfo.portfolio})
   
   CRITICAL: Use \\n\\n between items. NO dashes, NO bullets, NO labels before links.

2. **Skills**: When asked about skills:
   - Intro: "Nashid has expertise in [Domain]. Here are his key skills:" (Followed by \\n\\n)
   - Categories: For EACH category (Frontend, Backend, Database, Tools):
     * Start with two newlines (\\n\\n) before the header
     * Write header as \`### Category Name\` (e.g. \`### Frontend\`). No colons.
     * List skills as inline code: \`Skill1\` \`Skill2\`. Space-separated. NO commas.
   - Outro: Summary sentence after the last category (preceded by \\n\\n).

3. **Projects & Experience**: Follow 3-beat rhythm (intro → details → outro).

4. **JOB DESCRIPTION ANALYSIS (CRITICAL)**: When user pastes a job description:
   - Analyze JD to extract required skills across categories
   - Calculate match percentages for each category (0-100%)
   - Identify matched skills, missing skills, and additional strengths
   - **MUST return response in this EXACT JSON format inside a code block:**
   
   \`\`\`json
   {
     "type": "JD_ANALYSIS",
     "overallMatch": 85,
     "categories": {
       "frontend": 90,
       "backend": 85,
       "database": 80,
       "tools": 75
     },
     "matchedSkills": ["React.js", "Node.js", "MongoDB"],
     "missingSkills": ["Docker", "AWS"],
     "additionalStrengths": ["TypeScript", "Redux Toolkit"],
     "insights": "Nashid is an excellent match for this role with 85% alignment. Strong foundation in MERN stack. Consider learning Docker and AWS to bridge the gap."
   }
   \`\`\`
   
   After the JSON, add a brief conversational message like: "I've analyzed the job description against Nashid's profile. Check out the visual breakdown above."
`;

        const stream = await client.chat.completions.create({
            model: "meta-llama/Meta-Llama-3-8B-Instruct:novita",
            messages: [
                { role: "system", content: context + "\n10. AGENTIC CAPABILITIES: If the user asks to see a specific section (Projects, Experience, Skills, Contact, About), you MUST append `[[SCROLL:section_id]]` at the very end of your response. IDs: 'projects', 'experience', 'skills', 'contact', 'about'. Example: 'Here are his projects! [[SCROLL:projects]]'" },
                ...messages.map(m => ({ role: m.role, content: m.content })),
                { role: "user", content: userQuery }
            ].slice(-10),
            max_tokens: 500,
            temperature: 0.5,
            stream: true,
        });

        let fullResponse = "";
        let scrollExecuted = false;
        const botMessageId = Date.now() + 1;
        const updateBatchSize = 15; // Increased from 5 to reduce updates
        let chunkCounter = 0;

        setMessages(prev => [...prev, {
            id: botMessageId,
            role: 'assistant',
            content: "",
            time: getCurrentTime()
        }]);

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            fullResponse += content;
            chunkCounter++;

            // Check for scroll command only once
            if (!scrollExecuted) {
                const scrollMatch = fullResponse.match(/\[\[SCROLL:([a-zA-Z]+)\]\]/);
                if (scrollMatch) {
                    const sectionId = scrollMatch[1];
                    const element = document.getElementById(sectionId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        scrollExecuted = true;
                    }
                }
            }

            // Batch updates to reduce re-renders
            if (chunkCounter >= updateBatchSize || chunk.choices[0]?.finish_reason) {
                setMessages(prev => prev.map(msg =>
                    msg.id === botMessageId
                        ? { ...msg, content: fullResponse.replace(/\[\[SCROLL:[a-zA-Z]+\]\]/g, ''), isStreaming: true }
                        : msg
                ));
                chunkCounter = 0;
            }
        }

        // Final update to ensure all content is shown
        setMessages(prev => prev.map(msg =>
            msg.id === botMessageId ? { ...msg, content: fullResponse.replace(/\[\[SCROLL:[a-zA-Z]+\]\]/g, ''), isStreaming: false } : msg
        ));
        setIsLoading(false);
    };

    const LinkRenderer = (props) => {
        const href = props.href || "";
        let icon = <ExternalLink size={12} />;
        let label = "Link";

        if (href.includes("github.com")) {
            icon = <Github size={12} />;
            label = "GitHub";
        } else if (href.includes("linkedin.com")) {
            icon = <Linkedin size={12} />;
            label = "LinkedIn";
        } else if (href.startsWith("mailto:")) {
            icon = <Mail size={12} />;
            label = "Email";
        } else if (href.includes("portfolio") || href.includes("vercel.app")) {
            icon = <ExternalLink size={12} />;
            label = "Portfolio";
        }

        return (
            <a
                href={href}
                {...(href.startsWith("tel:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 my-1 mr-2 rounded-lg text-xs font-medium transition-all active:scale-95 no-underline bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-200 border border-black/5 dark:border-white/10"
            >
                {icon}
                <span>{label}</span>
            </a>
        );
    };

    // Auto-detect and convert plain URLs in paragraphs
    const ParagraphRenderer = ({ children, ...props }) => {
        if (typeof children === 'string') {
            // Detect plain URLs (http, https, tel, mailto) and convert to link buttons
            const urlRegex = /((?:https?|tel|mailto):[^\s]+)/g;
            const parts = children.split(urlRegex);

            const content = parts.map((part, idx) => {
                if (part.match(urlRegex)) {
                    return <LinkRenderer key={idx} href={part} />;
                }
                return part;
            });

            return <p className="mb-2 last:mb-0 leading-loose text-neutral-800 dark:text-neutral-200" {...props}>{content}</p>;
        }
        return <p className="mb-2 last:mb-0 leading-loose text-neutral-800 dark:text-neutral-200" {...props}>{children}</p>;
    };

    const SpinnerIcon = ({ className }) => (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    return (
        <>
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setIsOpen(true);
                        setShowPrompt(false);
                    }}
                    onMouseEnter={() => setShowPrompt(false)}
                    aria-label="Open chat with Shadow"
                    className="fixed bottom-8 right-8 z-50 p-3 bg-neutral-900 text-white dark:bg-white dark:text-black rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_40px_rgba(255,255,255,0.3)] transition-all duration-300 group"
                >
                    <MessageSquare size={20} fill="currentColor" />
                </motion.button>
            )}

            {/* Discovery Prompt */}
            <AnimatePresence>
                {showPrompt && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                        className="fixed bottom-28 right-8 z-40 max-w-[200px]"
                    >
                        <div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-3 rounded-2xl shadow-xl border border-black/5 dark:border-white/10 relative">
                            <p className="text-sm font-medium leading-tight">
                                👋 Hi! Ask me anything about Nashid's work.
                            </p>
                            {/* Arrow */}
                            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-neutral-800 transform rotate-45 border-b border-r border-black/5 dark:border-white/10" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="chat-title"
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                                type: "spring",
                                damping: 30,
                                stiffness: 400,
                                mass: 0.8,
                                opacity: { duration: 0.2 }
                            }
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                            transition: {
                                duration: 0.2,
                                ease: [0.4, 0, 0.2, 1]
                            }
                        }}
                        className="fixed bottom-4 right-2 md:right-4 z-50 w-[calc(95vw+8px)] md:w-[440px] h-[680px] max-h-[calc(90vh-20px)] flex flex-col glass-panel overflow-hidden custom-shadow rounded-xl"
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="px-5 py-4 bg-white/50 dark:bg-apple-gray/50 backdrop-blur-md border-b border-black/5 dark:border-white/5 flex items-center justify-between sticky top-0 z-10"
                        >
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className="w-11 h-11 rounded-full bg-gradient-to-br from-neutral-200 to-white dark:from-neutral-700 dark:to-black border border-black/5 dark:border-white/10 flex items-center justify-center shadow-lg"
                                    whileHover={{ rotate: 10, scale: 1.05 }}
                                >
                                    <MessageSquare size={20} fill="currentColor" className="text-neutral-900 dark:text-white" />
                                </motion.div>
                                <div>
                                    <h3 id="chat-title" className="text-[17px] font-semibold text-neutral-900 dark:text-white tracking-tight">Shadow</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400">Active • Ask me anything</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={clearChat}
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                                    title="Clear Chat"
                                >
                                    <Trash2 size={18} className="text-neutral-500 dark:text-neutral-400 group-hover:text-red-500 transition-colors" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close chat"
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white" />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Messages */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.3 }}
                            className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent"
                        >
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={msg.id}
                                    layout="position"
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeOut"
                                    }}
                                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`relative group max-w-[85%] px-3 py-2 rounded-[1rem] text-[13px] leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-apple-blue text-white rounded-br-sm'
                                        : 'bg-white text-neutral-900 border border-neutral-200 dark:bg-apple-gray dark:text-white dark:border-white/5 rounded-bl-sm'
                                        }`}>
                                        {msg.role === 'assistant' && (
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(msg.content);
                                                    setCopiedId(msg.id);
                                                    setTimeout(() => setCopiedId(null), 2000);
                                                }}
                                                className="absolute -top-2 -right-2 w-7 h-7 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg border border-neutral-200 dark:border-neutral-600 z-10"
                                                title="Copy message"
                                            >
                                                {copiedId === msg.id ? (
                                                    <Check size={14} className="text-green-600 dark:text-green-400" />
                                                ) : (
                                                    <Copy size={14} className="text-neutral-600 dark:text-neutral-300" />
                                                )}
                                            </button>
                                        )}
                                        {(() => {
                                            const analysisData = parseJDAnalysis(msg.content);
                                            if (analysisData) {
                                                // Extract text after JSON for display
                                                const textAfterJson = msg.content.split('```json')[0] + msg.content.split('```').slice(2).join('```');
                                                return (
                                                    <>
                                                        <JDAnalysis data={analysisData} />
                                                        {textAfterJson.trim() && (
                                                            <ReactMarkdown
                                                                components={{
                                                                    a: LinkRenderer,
                                                                    p: ParagraphRenderer,
                                                                }}
                                                            >
                                                                {textAfterJson.trim()}
                                                            </ReactMarkdown>
                                                        )}
                                                    </>
                                                );
                                            }
                                            return (
                                                <ReactMarkdown
                                                    components={{
                                                        a: LinkRenderer,
                                                        h3: ({ node, ...props }) => <h3 className="block w-full text-sm font-bold text-neutral-900 dark:text-white mt-6 mb-3 border-b border-neutral-200 dark:border-white/10 pb-2" {...props} />,
                                                        p: ParagraphRenderer,
                                                        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1.5" {...props} />,
                                                        li: ({ node, ...props }) => <li {...props} />,
                                                        strong: ({ node, ...props }) => <span className="font-semibold" {...props} />,
                                                        code: ({ node, ...props }) => <code className="inline-block px-2.5 py-1 mx-0.5 my-1 text-[11px] font-bold text-white dark:text-neutral-200 bg-neutral-900 dark:bg-white/10 rounded-lg border border-transparent dark:border-white/5 shadow-sm dark:shadow-none align-middle" {...props} />,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            );
                                        })()}
                                        {msg.role === 'assistant' && (() => {
                                            const lowerContent = msg.content.toLowerCase();
                                            const hasContactKeywords = (lowerContent.includes('contact me') ||
                                                lowerContent.includes('reach out') ||
                                                lowerContent.includes('get in touch') ||
                                                (lowerContent.includes('email') && lowerContent.includes('linkedin')) ||
                                                lowerContent.includes('[email]'));
                                            return hasContactKeywords;
                                        })() && (
                                                <motion.button
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                                                        setIsOpen(false);
                                                    }}
                                                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                                                >
                                                    <Mail size={14} />
                                                    <span>Ask Nashid Directly</span>
                                                </motion.button>
                                            )}
                                    </div>
                                    <span className="text-[9px] text-neutral-500 mt-1 px-2">{msg.time}</span>
                                </motion.div>
                            ))}

                            {isLoading && messages[messages.length - 1]?.role === 'user' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="bg-white dark:bg-apple-gray px-4 py-2 rounded-xl border border-neutral-200 dark:border-white/5 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                                className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                                className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full"
                                            />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                                className="w-2 h-2 bg-neutral-400 dark:bg-neutral-500 rounded-full"
                                            />
                                        </div>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Shadow is thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </motion.div>

                        {/* Quick Action Suggestions */}
                        {messages.length === 1 && (
                            <div className="px-6 pb-3 flex flex-wrap gap-2">
                                {quickSuggestions.map((suggestion, idx) => (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSend(suggestion.replace(/[🚀💻📧💼]/g, '').trim())}
                                        className="text-[11px] font-medium px-3 py-1.5 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 rounded-full transition-colors border border-neutral-200 dark:border-white/5"
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        )}


                        {/* Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                            className="p-4 bg-white/80 dark:bg-apple-gray/80 backdrop-blur-xl border-t border-black/10 dark:border-white/10"
                        >
                            <div className="relative flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Message Shadow..."
                                    className="flex-1 bg-white dark:bg-apple-lightGray border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white/20 transition-all"
                                />
                                <motion.button
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim() || isLoading}
                                    whileHover={inputValue.trim() && !isLoading ? { scale: 1.05 } : {}}
                                    whileTap={inputValue.trim() && !isLoading ? { scale: 0.95 } : {}}
                                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${inputValue.trim() && !isLoading
                                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-transparent text-neutral-400 dark:text-neutral-500 cursor-not-allowed'
                                        }`}
                                >
                                    {isLoading ? <SpinnerIcon className="w-4 h-4" /> : <ArrowUp size={18} strokeWidth={2.5} />}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatWidget;
