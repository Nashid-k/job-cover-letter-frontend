import { motion } from 'framer-motion';
import { memo } from 'react';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { projects } from '../data';
import SpotlightCard from './ui/SpotlightCard';

const Projects = memo(() => {
    return (
        <section id="projects" className="py-12">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 space-y-4"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">My Projects</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
                        A selection of my recent work, featuring full-stack applications and complex system architectures.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, ease: "easeOut" }}
                            className="h-full"
                        >
                            <SpotlightCard className="group relative glass-panel overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                                {/* Placeholder Image Gradient */}
                                <div className={`h-48 w-full bg-gradient-to-br ${idx % 2 === 0 ? 'from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-black' : 'from-neutral-100 to-neutral-200 dark:from-apple-gray dark:to-black'
                                    } flex items-center justify-center relative overflow-hidden`}>
                                    <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className="text-6xl opacity-20 transform group-hover:scale-110 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
                                        {idx % 2 === 0 ? '🖥️' : '📱'}
                                    </span>
                                </div>

                                <div className="p-6 md:p-8 flex flex-col flex-grow space-y-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-apple-blue transition-colors">
                                            {project.title}
                                        </h3>
                                        <a href="#" className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white text-neutral-900 dark:text-white hover:text-black dark:hover:text-black transition-all duration-300">
                                            <ArrowUpRight size={18} />
                                        </a>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.split(',').map((t, i) => (
                                            <span key={i} className="text-[11px] font-medium px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-neutral-600 dark:text-apple-text border border-black/5 dark:border-white/5">
                                                {t.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    <ul className="space-y-2 pt-2 flex-grow">
                                        {project.description.slice(0, 2).map((desc, i) => (
                                            <li key={i} className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed flex gap-2">
                                                <span className="text-neutral-400 dark:text-white/20 mt-1">•</span>
                                                {desc}
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="pt-4 flex items-center gap-4 text-sm font-medium">
                                        <button className="flex items-center gap-2 text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                                            <Github size={16} />
                                            <span>Source</span>
                                        </button>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium transition-all group text-neutral-900 dark:text-white">
                        View More Projects
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </section >
    );
});

Projects.displayName = 'Projects';

export default Projects;
