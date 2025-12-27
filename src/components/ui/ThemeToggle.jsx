import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    // Initialize state from local storage or default to dark
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300 focus:outline-none"
            aria-label="Toggle Theme"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ willChange: 'transform' }}
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180, scale: theme === 'dark' ? 1 : 1.1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ willChange: 'transform' }}
            >
                {theme === 'dark' ? (
                    <Moon size={20} className="text-white" />
                ) : (
                    <Sun size={20} className="text-neutral-900" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
