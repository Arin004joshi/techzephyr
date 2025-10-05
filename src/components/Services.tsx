// components/Services.tsx
'use client';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
// import { fadePop } from './Animation';

const services = [
    {
        title: 'Real-Time Convergent Billing',
        desc: 'Unify usage, subscriptions, and one-off fees with sub-second rating.',
        icon: '⚡',
        details: [
            'Sub-second transaction processing',
            'Multi-currency support',
            'Real-time balance updates',
            'Flexible pricing models'
        ],
        color: 'from-blue-500 to-cyan-500'
    },
    {
        title: 'Online Charging System (OCS)',
        desc: 'Authorize, rate, and charge events in real time with policy control.',
        icon: '🔄',
        details: [
            'Real-time authorization',
            'Dynamic policy enforcement',
            'Event-driven charging',
            'Scalable architecture'
        ],
        color: 'from-purple-500 to-pink-500'
    },
    {
        title: 'Forecasts & Consolidations',
        desc: 'Predict revenue and carbon impact; close the books faster.',
        icon: '📊',
        details: [
            'AI-powered forecasting',
            'Carbon impact analysis',
            'Automated reconciliation',
            'Real-time reporting'
        ],
        color: 'from-green-500 to-emerald-500'
    },
];

// Typing animation component
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 50 + delay);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, delay]);

    useEffect(() => {
        setDisplayText('');
        setCurrentIndex(0);
    }, [text]);

    return <span>{displayText}</span>;
};

// Animated icon component
const AnimatedIcon = ({ icon, isActive }: { icon: string; isActive: boolean }) => {
    return (
        <motion.div
            className="text-6xl mb-4"
            animate={isActive ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
                y: [0, -10, 0]
            } : { scale: 1, rotate: 0, y: 0 }}
            transition={{
                duration: 2,
                repeat: isActive ? Infinity : 0,
                repeatType: "reverse"
            }}
        >
            {icon}
        </motion.div>
    );
};

// Dynamic background component
const DynamicBackground = ({ activeIndex }: { activeIndex: number }) => {
    const service = services[activeIndex];

    return (
        <div className="absolute inset-0 overflow-hidden">
            <motion.div
                key={activeIndex}
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={`${activeIndex}-${i}`}
                    className={`absolute w-2 h-2 bg-gradient-to-r ${service.color} rounded-full`}
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                />
            ))}
        </div>
    );
};

export default function Services() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Transform scroll progress to horizontal movement
    const x = useTransform(scrollYProgress, [0, 1], [0, -100 * (services.length - 1)]);
    const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

    // Update active index based on scroll position
    useEffect(() => {
        const unsubscribe = scrollYProgress.onChange((progress) => {
            const newIndex = Math.round(progress * (services.length - 1));
            setActiveIndex(Math.max(0, Math.min(services.length - 1, newIndex)));
        });
        return unsubscribe;
    }, [scrollYProgress]);

    const handleCardClick = (index: number) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    return (
        <section
            ref={containerRef}
            id="features"
            className="relative h-[400vh] overflow-hidden"
        >
            <div className="sticky top-0 h-screen flex items-center">
                <DynamicBackground activeIndex={activeIndex} />

                <div className="relative z-10 w-full">
                    <div className="mx-auto max-w-7xl px-6">
                        <motion.h2
                            className="text-4xl font-bold text-center mb-16 text-white mix-blend-difference"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Features & Services
                        </motion.h2>

                        <motion.div
                            className="flex gap-8"
                            style={{ x: smoothX, width: `${services.length * 100}%` }}
                        >
                            {services.map((service, index) => (
                                <motion.div
                                    key={index}
                                    className="flex-shrink-0 w-screen flex items-center justify-center px-8"
                                >
                                    <div className="grid gap-8 md:grid-cols-2 max-w-6xl w-full">
                                        {/* Video Section */}
                                        <motion.div
                                            className="relative overflow-hidden rounded-xl border border-slate-200 shadow-2xl"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{
                                                opacity: activeIndex === index ? 1 : 0.3,
                                                scale: activeIndex === index ? 1 : 0.8
                                            }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <video
                                                src="/assets/features-services.mp4"
                                                muted
                                                playsInline
                                                autoPlay
                                                loop
                                                preload="metadata"
                                                className="h-full w-full"
                                                aria-label="Feature previews"
                                            />

                                            {/* Overlay with service-specific color */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-20 mix-blend-multiply`} />
                                        </motion.div>

                                        {/* Content Section */}
                                        <motion.div
                                            className="relative"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{
                                                opacity: activeIndex === index ? 1 : 0.3,
                                                x: activeIndex === index ? 0 : 50
                                            }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                            <div
                                                className="rounded-xl border border-slate-200 bg-white/90 backdrop-blur-sm p-8 shadow-2xl cursor-pointer hover:shadow-3xl transition-all duration-300"
                                                onClick={() => handleCardClick(index)}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="text-sm text-slate-500 font-mono">
                                                        {String(index + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                                                    </div>
                                                    <motion.button
                                                        className="text-slate-400 hover:text-slate-600"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        {expandedCard === index ? '−' : '+'}
                                                    </motion.button>
                                                </div>

                                                <AnimatedIcon
                                                    icon={service.icon}
                                                    isActive={activeIndex === index}
                                                />

                                                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                                    {activeIndex === index ? (
                                                        <TypewriterText text={service.title} />
                                                    ) : (
                                                        service.title
                                                    )}
                                                </h3>

                                                <p className="text-slate-600 text-lg leading-relaxed">
                                                    {activeIndex === index ? (
                                                        <TypewriterText text={service.desc} delay={service.title.length * 50} />
                                                    ) : (
                                                        service.desc
                                                    )}
                                                </p>

                                                {/* Expandable details */}
                                                <AnimatePresence>
                                                    {expandedCard === index && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="mt-6 pt-6 border-t border-slate-200"
                                                        >
                                                            <h4 className="font-semibold text-slate-800 mb-3">Key Features:</h4>
                                                            <div className="grid gap-2">
                                                                {service.details.map((detail, detailIndex) => (
                                                                    <motion.div
                                                                        key={detailIndex}
                                                                        initial={{ opacity: 0, x: -20 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{ delay: detailIndex * 0.1 }}
                                                                        className="flex items-center gap-2 text-slate-600"
                                                                    >
                                                                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color}`} />
                                                                        {detail}
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Progress indicator */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {services.map((_, index) => (
                                <motion.div
                                    key={index}
                                    className={`w-3 h-3 rounded-full border-2 border-white ${activeIndex === index ? 'bg-white' : 'bg-transparent'
                                        }`}
                                    animate={{
                                        scale: activeIndex === index ? 1.2 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}