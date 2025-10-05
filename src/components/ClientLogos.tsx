// components/ClientLogos.tsx
'use client';
import { motion } from 'framer-motion';
import { fadeIn } from './Animation';

export default function ClientLogos() {
    const logos = [
        { src: '/logos/brex.svg', alt: 'Brex' },
        { src: '/logos/openai.svg', alt: 'OpenAI' },
        { src: '/logos/cashapp.svg', alt: 'Cash App' },
        // Add your actual paths
    ];
    return (
        <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-slate-700">Trusted by leading teams</h3>
            </div>
            <div className="grid grid-cols-2 items-center gap-6 opacity-90 sm:grid-cols-3 md:grid-cols-6">
                {logos.map((logo, i) => (
                    <motion.div
                        key={logo.alt}
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ delay: i * 0.05 }}
                        className="relative mx-auto h-10 w-28 grayscale"
                    >
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYPp7rxDykkwl0fpRwQG45bqdUKLLFb1KRjA&s"
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-contain grayscale"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Optional: a lightweight video showcase below the logos */}
            <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="mt-10 overflow-hidden rounded-xl border border-slate-200"
            >
                <video
                    src="/assets/customer-section.mp4"
                    muted
                    playsInline
                    autoPlay
                    loop
                    preload="metadata"
                    className="h-full w-full"
                    aria-label="Customer highlights"
                />
            </motion.div>
        </section>
    );
}