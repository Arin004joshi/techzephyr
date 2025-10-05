// components/StatsSection.tsx
'use client';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { fadePop } from './Animation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function useCountUp(target: number, shouldStart: boolean, duration = 1.2) {
    const base = useMotionValue(0);
    const spring = useSpring(base, { stiffness: 100, damping: 16 });
    const [val, setVal] = useState(0);

    useEffect(() => {
        let controls: ReturnType<typeof animate> | undefined;
        if (shouldStart) {
            controls = animate(base, target, { duration, ease: 'easeOut' });
        }
        const unsub = spring.on('change', (v) => setVal(v));
        return () => {
            controls?.stop();
            unsub();
        };
    }, [shouldStart, target]);

    return Math.round(val);
}

export default function StatsSection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(sectionRef, { once: true, margin: '-100px' });

    // Parallax: animate only the image element (avoid conflicts with Motion)
    const imgRef = useRef<HTMLImageElement | null>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const img = imgRef.current;
        if (!section || !img) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        const ctx = gsap.context(() => {
            // From slightly below to slightly above as the section scrolls through
            gsap.fromTo(
                img,
                { yPercent: 10 },
                {
                    yPercent: -10,           // ~20% total movement
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',   // when top of section hits bottom of viewport
                        end: 'bottom top',     // until bottom of section hits top of viewport
                        scrub: true,
                    },
                }
            );
        }, section);

        return () => ctx.revert();
    }, []);

    const kpis = [
        { label: 'CO2e reduced', value: 128_450, suffix: ' t' },
        { label: 'Efficiency gain', value: 37, suffix: '%' },
        { label: 'Realtime events/min', value: 2_400_000, suffix: '' },
    ];

    return (
        <section ref={sectionRef} className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid items-center gap-10 md:grid-cols-2">
                <motion.div
                    variants={fadePop}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    className="grid grid-cols-2 gap-6 md:grid-cols-3"
                >
                    {kpis.map((kpi, i) => {
                        const n = useCountUp(kpi.value, inView);
                        return (
                            <motion.div
                                key={kpi.label}
                                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                                transition={{ delay: 0.05 * i, type: 'spring', stiffness: 120, damping: 16 }}
                                className="rounded-lg border border-slate-200 p-4 shadow-sm"
                            >
                                <div className="text-2xl font-semibold tabular-nums">
                                    {n.toLocaleString()}
                                    {kpi.suffix}
                                </div>
                                <div className="text-sm text-slate-600">{kpi.label}</div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Visual: parallax image */}
                <motion.div
                    variants={fadePop}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200"
                >
                    <img
                        ref={imgRef}
                        // Use your actual image; base64 is fine, or /assets/stats.png from public
                        src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEBUQEBMSFRUSFRUWFxgVFxUVGBIVFRUWFxYXFhcYHSggGBolGxUVITEhJSkrLi4uFx81ODMtNygtLisBCgoKDg0OGA8QGyslHR0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLSstLS0tLf/..."
                        // e.g., src="/assets/stats.png"
                        alt="Key performance indicators visualization"
                        className="absolute inset-0 h-full w-full scale-110 transform-gpu object-cover will-change-transform"
                        loading="lazy"
                    />
                </motion.div>
            </div>
        </section>
    );
}