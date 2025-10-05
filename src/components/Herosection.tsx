// components/HeroSection.tsx
'use client';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// Custom hook for mouse parallax
function useMouseParallax(strength = 10) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(mouseX, springConfig);
  const parallaxY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX - innerWidth / 2) / innerWidth;
      const y = (clientY - innerHeight / 2) / innerHeight;

      mouseX.set(x * strength);
      mouseY.set(y * strength);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, strength]);

  return { x: parallaxX, y: parallaxY };
}

// Word splitter component
function AnimatedWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: delay + i * 0.05,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1], // Custom easing for smooth motion
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && '\u00A0'} {/* Non-breaking space */}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  // Transform values for parallax
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5], [1, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Mouse parallax for 3D effect
  const mouseParallax = useMouseParallax(15);

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Video ready handler
  const handleVideoReady = () => {
    setVideoReady(true);
  };

  // GSAP for additional scroll effects
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Add any additional GSAP animations here if needed
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
        }
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Initial black screen fade */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      <motion.section
        ref={sectionRef}
        className="relative h-screen overflow-hidden"
        style={{ opacity, scale }}
      >
        {/* Parallax video background with 3D mouse effect */}
        <motion.div
          className="absolute inset-0 transform-gpu"
          style={{
            y: videoY,
            x: mouseParallax.x,
            rotateY: mouseParallax.x,
            rotateX: useTransform(mouseParallax.y, (v) => -v),
            scale: 1.15, // Larger scale to accommodate movement
            willChange: 'transform',
          }}
        >
          {/* Video with fade-in effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full w-full"
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src="/assets/homepage.mp4"
              muted
              playsInline
              autoPlay
              loop
              preload="auto"
              onLoadedData={handleVideoReady}
              aria-hidden="true"
            />
          </motion.div>

          {/* Dynamic gradient overlay */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
          </motion.div>
        </motion.div>

        {/* Foreground content with cinematic animations */}
        <motion.div
          className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-center gap-8 px-6 text-white"
          style={{ y: contentY }}
        >
          {/* Main headline with word-by-word animation */}
          <h1 className="text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">
            <AnimatedWords
              text="Real-time billing and"
              delay={0.8}
            />
            <br />
            <AnimatedWords
              text="carbon intelligence for"
              delay={1.2}
            />
            <br />
            <AnimatedWords
              text="modern platforms"
              className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
              delay={1.6}
            />
          </h1>

          {/* Subtitle with faster word animation */}
          <div className="max-w-3xl">
            <p className="text-xl md:text-2xl opacity-90">
              <AnimatedWords
                text="Reports, forecasts, consolidations—powered by convergent charging and granular data."
                delay={2.2}
              />
            </p>
          </div>

          {/* CTA buttons with pop effect */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }}
          >
            <motion.a
              href="#demo"
              className="group relative overflow-hidden rounded-lg bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-2xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 2.9,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Book a demo</span>
            </motion.a>

            <motion.a
              href="#features"
              className="group relative overflow-hidden rounded-lg border-2 border-white/30 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm"
              whileHover={{
                scale: 1.05,
                y: -2,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 3.0,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              {/* Subtle shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
              <span className="relative z-10">See features</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator with pulse animation */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-white/60"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
}