import { motion } from 'framer-motion';
import { memo } from 'react';
import { education } from '../data';
import { GraduationCap, Award } from 'lucide-react';

const Education = memo(() => {
    return (
        <section id="education" className="relative py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <GraduationCap size={24} className="text-neutral-900 dark:text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">Education</h2>
                </div>

                <div className="space-y-6">
                    {education.map((edu, idx) => (
                        <motion.div
                            key={edu.degree}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="p-6 glass-panel hover:bg-white/5 transition-all duration-500 group"
                        >
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-apple-blue transition-colors">
                                    {edu.degree}
                                </h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">{edu.institution}</p>
                                <ul className="space-y-2">
                                    {edu.details.map((detail, i) => (
                                        <li key={i} className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                                            <Award size={14} className="mt-1 flex-shrink-0 text-neutral-400 dark:text-white/40" />
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
});

Education.displayName = 'Education';

export default Education;
