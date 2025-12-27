import { motion } from 'framer-motion';
import { memo } from 'react';
import { skills } from '../data';
import { Code2, Database, Layout, Settings, Server, Terminal, Cpu } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';

const Skills = memo(() => {
    const getIcon = (category) => {
        switch (category) {
            case 'Frontend': return <Layout size={24} />;
            case 'Backend': return <Server size={24} />;
            case 'Databases': return <Database size={24} />;
            case 'Tools': return <Terminal size={24} />;
            case 'Core': return <Cpu size={24} />;
            default: return <Code2 size={24} />;
        }
    };

    return (
        <section id="skills" className="relative py-12">
            <div className="space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">Technical Arsenal</h2>
                    <p className="text-neutral-400 text-lg max-w-2xl">
                        A curated stack of technologies I use to build scalable, high-performance applications.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(skills).map(([category, items], idx) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            whileHover={{
                                y: -4,
                                transition: { duration: 0.2 }
                            }}
                            className="h-full"
                        >
                            <SpotlightCard className="group relative p-8 glass-panel h-full hover:bg-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <motion.div
                                        className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-neutral-900 dark:text-white will-change-transform"
                                        whileHover={{
                                            rotate: [0, -10, 10, -10, 0],
                                            scale: 1.1,
                                        }}
                                        transition={{
                                            rotate: {
                                                duration: 0.5,
                                                ease: "easeInOut",
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            },
                                            scale: {
                                                duration: 0.2
                                            }
                                        }}
                                    >
                                        {getIcon(category)}
                                    </motion.div>
                                    <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white">{category}</h3>
                                </div>

                                <div className="flex flex-wrap gap-2.5">
                                    {items.map((skill, skillIdx) => (
                                        <motion.span
                                            key={skill}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: Math.min(idx * 0.1 + skillIdx * 0.05, 0.6), type: "spring", stiffness: 300, damping: 20 }}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            className="px-3 py-2 text-xs font-medium text-neutral-600 dark:text-apple-text bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white transition-all duration-300 cursor-default"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>

                                {/* Subtle glow effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-700 pointer-events-none" />
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section >
    );
});

Skills.displayName = 'Skills';

export default Skills;
