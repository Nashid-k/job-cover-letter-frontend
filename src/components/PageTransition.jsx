/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -10,
    scale: 0.98,
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoother feel
  duration: 0.2
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full"
      style={{
        // Ensure the page content has consistent background
        backgroundColor: 'inherit',
        position: 'relative',
        zIndex: 1
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;