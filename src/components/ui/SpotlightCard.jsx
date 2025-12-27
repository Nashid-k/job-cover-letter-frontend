import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';

const SpotlightCard = ({ children, className = "" }) => {
    const divRef = useRef(null);
    const throttleRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = useCallback((e) => {
        // Throttle with requestAnimationFrame - reduces updates from 100+/sec to ~60/sec
        if (throttleRef.current) return;

        throttleRef.current = requestAnimationFrame(() => {
            if (!divRef.current) {
                throttleRef.current = null;
                return;
            }

            const div = divRef.current;
            const rect = div.getBoundingClientRect();

            setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            throttleRef.current = null;
        });
    }, []);

    const handleFocus = useCallback(() => {
        setOpacity(1);
        setIsHovering(true);
    }, []);

    const handleBlur = useCallback(() => {
        setOpacity(0);
        setIsHovering(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setOpacity(1);
        setIsHovering(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setOpacity(0);
        setIsHovering(false);
    }, []);

    // Memoize gradient style to prevent recalculation on every render
    const gradientStyle = useMemo(() => ({
        opacity,
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        // Only add will-change when hovering to avoid memory overhead
        ...(isHovering ? { willChange: 'opacity' } : {})
    }), [opacity, position.x, position.y, isHovering]);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (throttleRef.current) {
                cancelAnimationFrame(throttleRef.current);
            }
        };
    }, []);

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className='pointer-events-none absolute -inset-px opacity-0 transition duration-300'
                style={gradientStyle}
            />

            {children}
        </motion.div>
    );
};

export default SpotlightCard;
