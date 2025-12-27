import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ui/ThemeToggle';

const Navbar = memo(() => {
  const [activeSection, setActiveSection] = useState('home');
  const [isOpen, setIsOpen] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Memoize links array to prevent recreation on each render
  const links = useMemo(() => [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ], []);

  // Memoize handleLinkClick to prevent recreation
  const handleLinkClick = useCallback((id) => {
    // Lock observer updates
    isScrollingRef.current = true;

    // Set active section immediately
    setActiveSection(id);
    setIsOpen(false);

    // Clear existing timeout if any
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Unlock observer after animation (approx 1s)
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    // Use Intersection Observer instead of scroll listener for better performance
    // Query ALL sections on the page, not just navbar-linked ones
    const allSections = Array.from(document.querySelectorAll('section[id]'));

    // Create a Set of navbar section IDs for quick lookup
    const navbarSectionIds = new Set(links.map(link => link.href.substring(1)));

    // Track which sections are currently visible - MUST be outside callback to persist
    const visibilityMap = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        // Do not update active section if we are manually scrolling to a target
        if (isScrollingRef.current) return;

        // Update visibility map with latest intersection data
        entries.forEach(entry => {
          visibilityMap.set(entry.target.id, entry.isIntersecting);
        });

        // Find the first visible navbar section in document order (top to bottom)
        // This ensures we highlight the topmost visible navbar section
        let foundActiveSection = null;

        for (const section of allSections) {
          const isVisible = visibilityMap.get(section.id);
          const isNavbarSection = navbarSectionIds.has(section.id);

          // If this section is visible AND it's a navbar section, we found our candidate
          if (isVisible && isNavbarSection) {
            foundActiveSection = section.id;
            break; // Take the first visible navbar section from the top
          }
        }

        // Only update if we found a visible navbar section
        if (foundActiveSection) {
          setActiveSection(foundActiveSection);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '-100px 0px -66% 0px'
      }
    );

    allSections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [links]);

  return (
    <div
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
    >
      <nav
        aria-label="Main navigation"
        className="glass-panel px-2 py-2 md:px-3 md:py-1 flex items-center justify-between md:justify-center gap-1 rounded-full relative"
      >
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-3 text-neutral-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 pr-1">
          {links.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ease-apple-ease hover:bg-white/20 dark:hover:bg-white/5 ripple ${activeSection === link.href.substring(1)
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-apple-text hover:text-neutral-900 dark:hover:text-white'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLinkClick(link.href.substring(1))}
            >
              {activeSection === link.href.substring(1) && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 bg-white/50 dark:bg-white/10 border border-black/5 dark:border-white/5 rounded-full backdrop-blur-md shadow-sm glow-pulse"
                  transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
                  style={{ willChange: 'transform' }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </motion.a>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="pl-1 border-l border-neutral-200 dark:border-white/10 ml-1">
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 px-4 md:hidden"
          >
            <div className="glass-panel p-2 flex flex-col gap-1 shadow-2xl">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${activeSection === link.href.substring(1)
                    ? 'bg-black/5 dark:bg-white/10 text-neutral-900 dark:text-white'
                    : 'text-neutral-500 dark:text-apple-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  onClick={() => handleLinkClick(link.href.substring(1))}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
