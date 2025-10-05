// components/HeroSection.tsx
'use client';
import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const bgRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const bg = bgRef.current;
        if (!section || !bg) return;

        // Respect user’s reduced-motion preference
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            gsap.to(bg, {
                yPercent: -20,          // Parallax amount (20% of its own height)
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,          // Smoothly ties animation to scroll
                },
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative overflow-hidden">
            {/* Parallax background (video + overlay) */}
            <div
                ref={bgRef}
                className="absolute inset-0 transform-gpu"
                style={{ willChange: 'transform' }}
            >
                <video
                    className="h-full w-full scale-110 object-cover" // scale to avoid edge reveal during parallax
                    src="/assets/homepage.mp4"
                    muted
                    playsInline
                    autoPlay
                    loop
                    preload="metadata"
                    aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
            </div>

            {/* Foreground content */}
            <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-28 text-white md:py-40">
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-semibold md:text-6xl"
                >
                    Real-time billing and carbon intelligence for modern platforms
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="max-w-2xl text-lg opacity-90"
                >
                    Reports, forecasts, consolidations—powered by convergent charging and granular data.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.45 }}
                    className="flex gap-3"
                >
                    <a
                        href="#demo"
                        className="rounded-md bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow hover:bg-slate-100"
                    >
                        Book a demo
                    </a>
                    <a
                        href="#features"
                        className="rounded-md border border-white/30 px-5 py-3 text-sm font-medium text-white hover:bg-white/10"
                    >
                        See features
                    </a>
                </motion.div>
            </div>
        </section>
    );
}