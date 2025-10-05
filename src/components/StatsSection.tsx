// components/StatsSection.tsx
'use client';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Enhanced count-up with slot machine effect
function useSlotMachineCount(target: number, shouldStart: boolean, duration = 2) {
    const [displayValue, setDisplayValue] = useState('000000');
    const [isRolling, setIsRolling] = useState(false);

    useEffect(() => {
        if (!shouldStart) return;

        setIsRolling(true);
        const targetStr = target.toLocaleString();
        const digitCount = targetStr.replace(/,/g, '').length;

        // Random rolling effect
        const rollInterval = setInterval(() => {
            const randomNum = Math.floor(Math.random() * Math.pow(10, digitCount));
            setDisplayValue(randomNum.toLocaleString().padStart(digitCount, '0'));
        }, 50);

        // Gradually slow down and settle on target
        const slowdownTimeout = setTimeout(() => {
            clearInterval(rollInterval);

            // Final approach animation
            let current = 0;
            const increment = target / 20;
            const finalInterval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(finalInterval);
                    setIsRolling(false);
                }
                setDisplayValue(Math.floor(current).toLocaleString());
            }, duration * 1000 / 20);
        }, duration * 500);

        return () => {
            clearInterval(rollInterval);
            clearTimeout(slowdownTimeout);
        };
    }, [shouldStart, target, duration]);

    return { value: displayValue, isRolling };
}

// Animated Chart Component
function AnimatedChart({ inView }: { inView: boolean }) {
    const [hoveredBar, setHoveredBar] = useState<number | null>(null);
    const chartData = [
        { month: 'Jan', value: 65, label: 'CO2 Reduction' },
        { month: 'Feb', value: 72, label: 'CO2 Reduction' },
        { month: 'Mar', value: 78, label: 'CO2 Reduction' },
        { month: 'Apr', value: 85, label: 'CO2 Reduction' },
        { month: 'May', value: 91, label: 'CO2 Reduction' },
        { month: 'Jun', value: 95, label: 'CO2 Reduction' },
    ];

    return (
        <div className="relative h-full w-full p-8">
            {/* Animated grid lines */}
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <motion.path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="rgba(148, 163, 184, 0.1)"
                            strokeWidth="1"
                            initial={{ pathLength: 0 }}
                            animate={inView ? { pathLength: 1 } : {}}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Bar Chart */}
            <div className="relative z-10 flex h-full items-end justify-around gap-4">
                {chartData.map((item, i) => (
                    <motion.div
                        key={item.month}
                        className="relative flex-1"
                        onMouseEnter={() => setHoveredBar(i)}
                        onMouseLeave={() => setHoveredBar(null)}
                    >
                        <motion.div
                            className="relative w-full cursor-pointer overflow-hidden rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-400"
                            initial={{ height: 0 }}
                            animate={inView ? { height: `${item.value}%` } : {}}
                            transition={{
                                delay: i * 0.1,
                                duration: 0.8,
                                type: "spring",
                                stiffness: 100,
                                damping: 15
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {/* Animated shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: "linear",
                                    repeatDelay: 2
                                }}
                            />
                        </motion.div>

                        {/* Tooltip */}
                        <AnimatePresence>
                            {hoveredBar === i && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-sm text-white shadow-xl"
                                >
                                    <div className="font-semibold">{item.value}t CO2e</div>
                                    <div className="text-xs opacity-70">{item.month} 2024</div>
                                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-2 text-center text-xs text-slate-600">{item.month}</div>
                    </motion.div>
                ))}
            </div>

            {/* Animated trend line */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
                <motion.path
                    d="M 50 85 Q 150 75, 250 65 T 450 45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 0.5 } : {}}
                    transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

// Connecting particles effect
function ConnectingParticles() {
    return (
        <div className="absolute -top-20 left-0 right-0 h-40 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    initial={{
                        x: `${20 + i * 15}%`,
                        y: -10,
                        opacity: 0
                    }}
                    animate={{
                        y: [0, 100, 200],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 3,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="absolute inset-0 rounded-full bg-blue-400 blur-sm" />
                </motion.div>
            ))}
        </div>
    );
}

// Import AnimatePresence for exit animations
import { AnimatePresence } from 'framer-motion';

export default function StatsSection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });

    // Scroll-based animations
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Parallax transforms for different layers
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
    const cardsY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
    const chartY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

    // Background color transition
    useLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            gsap.to(section, {
                backgroundColor: '#f8fafc',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'top center',
                    scrub: 1,
                },
            });
        }, section);

        return () => ctx.revert();
    }, []);

    const kpis = [
        { label: 'CO2e reduced', value: 128450, suffix: ' t', icon: '🌱' },
        { label: 'Efficiency gain', value: 37, suffix: '%', icon: '⚡' },
        { label: 'Realtime events/min', value: 2400000, suffix: '', icon: '📊' },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative mx-auto max-w-7xl px-6 py-20 overflow-hidden"
            style={{ backgroundColor: '#0f172a' }} // Start with dark bg
        >
            {/* Connecting particles from hero section */}
            <ConnectingParticles />

            {/* Animated background pattern */}
            <motion.div
                className="absolute inset-0 opacity-5"
                style={{ y: backgroundY }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-transparent to-cyan-600" />
            </motion.div>

            <div ref={containerRef} className="relative grid items-center gap-10 md:grid-cols-2">
                {/* KPI Cards with enhanced animations */}
                <motion.div
                    style={{ y: cardsY }}
                    className="grid grid-cols-2 gap-6 md:grid-cols-3"
                >
                    {kpis.map((kpi, i) => {
                        const { value, isRolling } = useSlotMachineCount(kpi.value, inView, 2 + i * 0.3);

                        return (
                            <motion.div
                                key={kpi.label}
                                className="relative"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.1 * i, type: 'spring', stiffness: 100, damping: 15 }}
                            >
                                {/* Animated border */}
                                <svg className="absolute inset-0 h-full w-full">
                                    <motion.rect
                                        x="1"
                                        y="1"
                                        width="calc(100% - 2px)"
                                        height="calc(100% - 2px)"
                                        rx="8"
                                        fill="none"
                                        stroke="url(#border-gradient)"
                                        strokeWidth="2"
                                        strokeDasharray="300"
                                        initial={{ strokeDashoffset: 300 }}
                                        animate={inView ? { strokeDashoffset: 0 } : {}}
                                        transition={{ delay: 0.2 + i * 0.1, duration: 1 }}
                                    />
                                    <defs>
                                        <linearGradient id="border-gradient">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#06b6d4" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Card content */}
                                <motion.div
                                    className="relative rounded-lg bg-white/95 backdrop-blur-sm p-6 shadow-xl"
                                    whileHover={{ scale: 1.05, rotateY: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <motion.div
                                        className="text-3xl mb-2"
                                        animate={isRolling ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ repeat: isRolling ? Infinity : 0, duration: 0.3 }}
                                    >
                                        {kpi.icon}
                                    </motion.div>

                                    <div className={`text-2xl font-bold tabular-nums ${isRolling ? 'text-blue-600' : 'text-slate-900'}`}>
                                        <motion.span
                                            animate={isRolling ? { opacity: [1, 0.5, 1] } : {}}
                                            transition={{ repeat: isRolling ? Infinity : 0, duration: 0.2 }}
                                        >
                                            {value}
                                        </motion.span>
                                        {kpi.suffix}
                                    </div>

                                    <div className="text-sm text-slate-600 mt-1">{kpi.label}</div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Animated Chart */}
                <motion.div
                    style={{ y: chartY }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="relative aspect-[4/3] w-full rounded-xl bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden"
                >
                    <AnimatedChart inView={inView} />
                </motion.div>
            </div>
        </section>
    );
}