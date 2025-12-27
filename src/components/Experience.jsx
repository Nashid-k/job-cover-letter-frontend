import { motion } from 'framer-motion';
import { memo } from 'react';
import { experience } from '../data';
import { Briefcase, MapPin } from 'lucide-react';

const Experience = memo(() => {
    return (
        <section id="experience" className="relative py-12">
            <div className="space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">Experience</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl">
                        My professional journey and the impact I've delivered in each role.
                    </p>
                </motion.div>

                <div className="relative space-y-12">
                    {experience.map((job, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
                            whileHover={{ x: 6 }}
                            className="group relative p-8 glass-panel hover:bg-white/5 transition-all duration-500"
                        >
                            {/* Timeline dot */}
                            <div className="absolute -left-[41px] top-10 w-3 h-3 rounded-full bg-neutral-900 dark:bg-white group-hover:scale-150 transition-transform duration-300 ring-4 ring-neutral-50 dark:ring-black" />
                            <div className="absolute -left-[38px] top-0 bottom-0 w-0.5 bg-white/10" />

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white group-hover:text-apple-blue transition-colors">
                                        {job.role}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-apple-text font-medium">
                                        <span className="flex items-center gap-2">
                                            <Briefcase size={16} />
                                            {job.company}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            {job.location}
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-4">
                                    {job.points.map((point, i) => (
                                        <motion.li
                                            key={i}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.15 + i * 0.1 }}
                                            className="flex items-start gap-3 text-neutral-600 dark:text-neutral-300 leading-relaxed"
                                        >
                                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-white/50 flex-shrink-0" />
                                            <span className="text-base">{point}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* Hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-700 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

Experience.displayName = 'Experience';

export default Experience;
