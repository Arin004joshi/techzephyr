// components/Services.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { fadePop } from './Animation';

const services = [
    {
        title: 'Real-Time Convergent Billing',
        desc: 'Unify usage, subscriptions, and one-off fees with sub-second rating.',
    },
    {
        title: 'Online Charging System (OCS)',
        desc: 'Authorize, rate, and charge events in real time with policy control.',
    },
    {
        title: 'Forecasts & Consolidations',
        desc: 'Predict revenue and carbon impact; close the books faster.',
    },
];

export default function Services() {
    const [idx, setIdx] = useState(0);
    const next = () => setIdx((i) => (i + 1) % services.length);
    const prev = () => setIdx((i) => (i - 1 + services.length) % services.length);

    return (
        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-semibold">Features & Services</h2>
                <div className="flex gap-2">
                    <button
                        onClick={prev}
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                        aria-label="Previous feature"
                    >
                        ←
                    </button>
                    <button
                        onClick={next}
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                        aria-label="Next feature"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-xl border border-slate-200">
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
                </div>

                <div className="relative min-h-[220px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={idx}
                            variants={fadePop}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } }}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="mb-2 text-sm text-slate-500">
                                {String(idx + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                            </div>
                            <h3 className="text-2xl font-semibold">{services[idx].title}</h3>
                            <p className="mt-2 text-slate-600">{services[idx].desc}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}