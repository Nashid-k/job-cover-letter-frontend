import { motion } from 'framer-motion';
import { memo, useCallback } from 'react';
import { Mail, Send } from 'lucide-react';
import { personalInfo } from '../data';

const Contact = memo(() => {
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
    }, []);

    return (
        <section id="contact" className="py-24 relative">
            <div className="max-w-2xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center space-y-4 mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">Get In Touch</h2>
                    <p className="text-neutral-400 text-lg">
                        Have a project in mind or want to collaborate? I'd love to hear from you.
                    </p>
                    <div className="pt-2">
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className="text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 underline underline-offset-4 decoration-neutral-300 dark:decoration-white/30 hover:decoration-neutral-900 dark:hover:decoration-white transition-colors text-lg"
                        >
                            {personalInfo.email}
                        </a>
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="space-y-6"
                    onSubmit={handleSubmit}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                        >
                            <label htmlFor="name" className="text-sm font-medium text-neutral-400 ml-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Your name"
                                aria-required="true"
                                className="w-full bg-white/50 dark:bg-[#1C1C1E]/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-5 py-4 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/20 focus:border-transparent transition-all"
                            />
                        </motion.div>

                        <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                        >
                            <label htmlFor="email" className="text-sm font-medium text-neutral-400 ml-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your@email.com"
                                aria-required="true"
                                className="w-full bg-white/50 dark:bg-[#1C1C1E]/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-5 py-4 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/20 focus:border-transparent transition-all"
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        className="space-y-2"
                        whileFocus={{ scale: 1.01 }}
                    >
                        <label htmlFor="message" className="text-sm font-medium text-neutral-400 ml-1">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={6}
                            placeholder="Tell me about your project..."
                            aria-required="true"
                            className="w-full bg-white/50 dark:bg-[#1C1C1E]/50 border border-neutral-200 dark:border-white/10 rounded-2xl px-5 py-4 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/20 focus:border-transparent transition-all resize-none"
                        />
                    </motion.div>

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(255,255,255,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-xl glass-button ripple fluid-hover"
                    >
                        Send Message
                        <Send size={18} />
                    </motion.button>
                </motion.form>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 pt-8 border-t border-white/5 text-center"
                >
                    <p className="text-xs text-neutral-600">© 2025 {personalInfo.name}. All rights reserved.</p>
                </motion.div>
            </div>
        </section>
    );
});

Contact.displayName = 'Contact';

export default Contact;
