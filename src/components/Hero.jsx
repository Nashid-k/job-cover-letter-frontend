import { motion } from 'framer-motion';
import { memo, useMemo } from 'react';
import { Mail, ChevronDown, Sparkle } from 'lucide-react';
import { personalInfo } from '../data';

const Hero = memo(() => {
    // Memoize animation variants to prevent recreation on each render
    const avatarTransition = useMemo(() => ({
        duration: 0.8,
        type: "spring",
        stiffness: 200,
        damping: 15
    }), []);

    const glowAnimation = useMemo(() => ({
        opacity: [0.3, 0.5, 0.3],
    }), []);

    const glowTransition = useMemo(() => ({
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
    }), []);

    const bounceAnimation = useMemo(() => ({
        y: [0, 8, 0]
    }), []);

    const bounceTransition = useMemo(() => ({
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
    }), []);

    return (
        <section id="home" className="min-h-screen flex items-center justify-center relative px-6">
            <div className="max-w-4xl mx-auto text-center space-y-10">

                {/* Avatar */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={avatarTransition}
                    className="relative w-40 h-40 mx-auto"
                >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-neutral-700 via-neutral-800 to-black border-4 border-white/5 flex items-center justify-center overflow-hidden shadow-2xl relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <img
                            src="/profile.img"
                            alt="Profile"
                            className="w-full h-full object-cover relative z-10"
                        />
                    </div>
                </motion.div>

                {/* Headline */}
                <div className="space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
                    >
                        Hi, I'm{' '}
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-400 dark:from-white dark:via-neutral-200 dark:to-neutral-500">
                                {personalInfo.name}
                            </span>
                            <motion.div
                                className="absolute -inset-1 bg-black/5 dark:bg-white/10 blur-2xl -z-10 will-change-opacity"
                                animate={glowAnimation}
                                transition={glowTransition}
                            />
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex items-center justify-center gap-2 text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 font-light"
                    >
                        <Sparkle size={20} className="text-neutral-500" />
                        <p>{personalInfo.title}</p>
                    </motion.div>
                </div>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <motion.a
                        href="#contact"
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 bg-neutral-900 text-white dark:bg-white dark:text-black rounded-full font-semibold text-sm flex items-center gap-2 shadow-xl"
                        style={{ willChange: 'transform' }}
                    >
                        Get in Touch
                        <Mail size={16} />
                    </motion.a>

                    <motion.a
                        href="#projects"
                        whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-4 bg-black/5 dark:bg-apple-gray border border-black/10 dark:border-white/10 text-neutral-900 dark:text-white rounded-full font-medium text-sm transition-colors duration-300"
                        style={{ willChange: 'transform' }}
                    >
                        View Work
                    </motion.a>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={bounceAnimation}
                        transition={bounceTransition}
                    >
                        <ChevronDown size={32} className="text-neutral-600" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
});

Hero.displayName = 'Hero';

export default Hero;
