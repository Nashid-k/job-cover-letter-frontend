import { motion } from 'framer-motion';
import { memo } from 'react';
import { summary } from '../data';

const About = memo(() => {
    return (
        <section id="about" className="py-20 relative">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-8"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
                        About Me
                    </h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl font-light leading-relaxed text-apple-text max-w-3xl mx-auto"
                    >
                        {summary}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="pt-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-500"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></span>
                        <span>Ready to collaborate and build something amazing</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
});

About.displayName = 'About';

export default About;
