// components/ClientLogos.tsx
'use client';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function ClientLogos() {
    const logos = [
        { src: 'data:image/png;base64,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', alt: 'Brex' },
        { src: 'data:image/png;base64,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', alt: 'OpenAI' },
        { src: 'data:image/png;base64,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', alt: 'Cash App' },
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