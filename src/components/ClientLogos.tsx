// components/ClientLogos.tsx
'use client';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function ClientLogos() {
    const logos = [
        { src: '/logos/brex.svg', alt: 'Brex' },
        { src: '/logos/openai.svg', alt: 'OpenAI' },
        { src: '/logos/cashapp.svg', alt: 'Cash App' },
        // Add your actual paths
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const videoWallRef = useRef<HTMLDivElement>(null);
    const [activeVideo, setActiveVideo] = useState<number | null>(null);

    // Scroll-based animations
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect - logos move slower than video wall
    const logoY = useTransform(scrollYProgress, [0, 1], [20, -20]);
    const videoWallY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

    // Cinematic zoom-out effect
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

    // Particle effect for logos
    const particleAnimations = logos.map((_, index) => {
        const controls = useAnimation();

        useEffect(() => {
            if (scrollYProgress.get() > 0.1) {
                controls.start({
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "grayscale(0%)",
                    transition: {
                        delay: index * 0.08,
                        duration: 0.6,
                        ease: "easeOut"
                    }
                });
            }
        }, [scrollYProgress, controls, index]);

        return controls;
    });

    // Glow animation for logos
    const glowAnimations = logos.map((_, _index) => {
        const controls = useAnimation();

        useEffect(() => {
            const interval = setInterval(() => {
                controls.start({
                    boxShadow: "0 0 15px rgba(66, 153, 225, 0.5)",
                    transition: { duration: 1, ease: "easeInOut" }
                }).then(() => {
                    controls.start({
                        boxShadow: "0 0 5px rgba(66, 153, 225, 0.2)",
                        transition: { duration: 1, ease: "easeInOut" }
                    });
                });
            }, 3000);

            return () => clearInterval(interval);
        }, [controls]);

        return controls;
    });

    // Handle video hover interactions
    const handleVideoHover = (index: number) => {
        setActiveVideo(index);
    };

    const handleVideoLeave = () => {
        setActiveVideo(null);
    };

    return (
        <section
            ref={containerRef}
            className="mx-auto max-w-7xl px-6 py-16 relative overflow-hidden"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
        >
            {/* Background gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white -z-10"></div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-700">Trusted by leading teams</h3>
            </div>

            {/* Logo Grid with Parallax Effect */}
            <motion.div
                style={{ y: logoY }}
                className="grid grid-cols-2 items-center gap-6 opacity-90 sm:grid-cols-3 md:grid-cols-6 mb-10"
            >
                {logos.map((logo, i) => (
                    <motion.div
                        key={logo.alt}
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.8,
                            filter: "grayscale(100%)"
                        }}
                        animate={particleAnimations[i]}
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.3 }
                        }}
                        className="relative mx-auto h-10 w-28 cursor-pointer"
                    >
                        <motion.div
                            animate={glowAnimations[i]}
                            className="absolute inset-0 flex items-center justify-center rounded-lg"
                        >
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                loading="lazy"
                                className="h-full w-full object-contain"
                            />
                        </motion.div>

                        {/* Particle effect overlay */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(5)].map((_, j) => (
                                <motion.div
                                    key={j}
                                    initial={{
                                        opacity: 0,
                                        scale: 0,
                                        x: Math.random() * 40 - 20,
                                        y: Math.random() * 40 - 20
                                    }}
                                    animate={{
                                        opacity: [0, 0.7, 0],
                                        scale: [0, 1, 0],
                                        x: Math.random() * 40 - 20,
                                        y: Math.random() * 40 - 20
                                    }}
                                    transition={{
                                        delay: i * 0.05 + j * 0.02,
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatDelay: 2
                                    }}
                                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Interactive Video Wall */}
            <motion.div
                ref={videoWallRef}
                style={{ y: videoWallY }}
                className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-black"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${activeVideo === index ? 'z-10' : 'z-0'
                                }`}
                            onMouseEnter={() => handleVideoHover(index)}
                            onMouseLeave={handleVideoLeave}
                            animate={{
                                scale: activeVideo === index ? 1.05 : 0.95,
                                opacity: activeVideo === index || activeVideo === null ? 1 : 0.4,
                                filter: activeVideo === index ? 'none' : 'brightness(0.7)',
                                zIndex: activeVideo === index ? 10 : 0
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <video
                                src={`/assets/customer-section-${index + 1}.mp4`}
                                muted={activeVideo !== index}
                                playsInline
                                autoPlay={activeVideo === index}
                                loop
                                preload="metadata"
                                className="h-full w-full object-cover"
                                aria-label={`Customer highlight ${index + 1}`}
                            />

                            {/* Overlay for non-active videos */}
                            {activeVideo !== null && activeVideo !== index && (
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9.504 1.132a1 1 0 011.05 0l4.724 4.724a1 1 0 11-1.414 1.414L9.5 3.912V18.5a1 1 0 01-2 0V3.912l-4.364 4.364A1 1 0 111.72 6.864l4.724-4.724a1 1 0 011.05-.003z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* Play button for inactive videos */}
                            {activeVideo !== index && (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3 1.5A1 1 0 0014 14V6a1 1 0 00-1.555-.832l-3-1.5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Video controls overlay when active */}
                {activeVideo !== null && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <div className="flex items-center justify-between text-white text-sm">
                            <span>Customer Highlight {activeVideo + 1}</span>
                            <button
                                onClick={() => setActiveVideo(null)}
                                className="px-3 py-1 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Cinematic zoom-out effect indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"
            />
        </section>
    );
}