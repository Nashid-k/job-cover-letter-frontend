
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import ToastProvider from './components/ui/ToastProvider';
import { useEffect, Suspense, lazy, useMemo } from 'react';

// Lazy load heavy components for better initial load performance
const Experience = lazy(() => import('./components/Experience'));
const Projects = lazy(() => import('./components/Projects'));
const Education = lazy(() => import('./components/Education'));
const Strengths = lazy(() => import('./components/Strengths'));
const Contact = lazy(() => import('./components/Contact'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));

function App() {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Memoize background glow elements to prevent re-renders
  const backgroundGlow = useMemo(() => (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-white/3 rounded-full blur-3xl transition-colors duration-500" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-neutral-800/10 rounded-full blur-3xl transition-colors duration-500" />
    </div>
  ), []);

  // Memoize loading fallback
  const loadingFallback = useMemo(() => (
    <div className="w-full h-32 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-neutral-400 dark:border-neutral-500 border-t-transparent animate-spin" />
    </div>
  ), []);

  const chatLoadingFallback = useMemo(() => (
    <div className="fixed bottom-8 right-8 z-50 p-4 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 shadow-lg animate-pulse">
      <div className="w-6 h-6 rounded-full border-2 border-neutral-400 dark:border-neutral-500 border-t-transparent animate-spin" />
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-neutral-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      {/* Subtle Background Glow */}
      {backgroundGlow}

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <div className="container mx-auto px-6 md:px-12 lg:px-20 space-y-32 pb-32">
          <About />
          <Skills />

          <Suspense fallback={loadingFallback}>
            <Experience />
          </Suspense>

          <Suspense fallback={loadingFallback}>
            <Projects />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <Suspense fallback={loadingFallback}>
              <Education />
            </Suspense>
            <Suspense fallback={loadingFallback}>
              <Strengths />
            </Suspense>
          </div>

          <Suspense fallback={loadingFallback}>
            <Contact />
          </Suspense>
        </div>
      </main>

      <Suspense fallback={chatLoadingFallback}>
        <ChatWidget />
      </Suspense>
      <ToastProvider />
    </div>
  );
}

export default App;
