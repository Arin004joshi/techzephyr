// components/BrandKits.tsx
'use client';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export default function BrandKits() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const kits = [
    { 
      title: 'Fintech Kit', 
      desc: 'Regulatory-ready, multi-entity, audit trails',
      gradient: 'from-blue-500 to-purple-600',
      image: '/api/placeholder/400/300'
    },
    { 
      title: 'SaaS Kit', 
      desc: 'Usage metrics, entitlements, trials',
      gradient: 'from-emerald-500 to-cyan-600',
      image: '/api/placeholder/400/300'
    },
    { 
      title: 'Telco Kit', 
      desc: 'OCS, convergent charging, mediation',
      gradient: 'from-orange-500 to-pink-600',
      image: '/api/placeholder/400/300'
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % kits.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, kits.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <section 
      id="brand-kits" 
      className="relative mx-auto max-w-7xl px-6 py-20 overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, #06b6d4 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Brand Kits
        </h2>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
          Personalize features, pricing, and visuals per enterprise client
        </p>
      </motion.div>

      {/* Carousel Container */}
      <div 
        ref={containerRef}
        className="relative h-[450px] flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full max-w-5xl mx-auto">
          <AnimatePresence mode="sync">
            {kits.map((kit, index) => (
              <BrandKitCard
                key={kit.title}
                kit={kit}
                index={index}
                activeIndex={activeIndex}
                totalCards={kits.length}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
          {kits.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="group relative p-2"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === activeIndex 
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-600' 
                  : 'bg-slate-400 hover:bg-slate-600'}
              `} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Individual Card Component
function BrandKitCard({ 
  kit, 
  index, 
  activeIndex, 
  totalCards, 
  onClick 
}: {
  kit: any;
  index: number;
  activeIndex: number;
  totalCards: number;
  onClick: () => void;
}) {
  const isActive = index === activeIndex;
  const offset = (index - activeIndex + totalCards) % totalCards;
  const adjustedOffset = offset > totalCards / 2 ? offset - totalCards : offset;
  
  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  // Ripple effect state
  const [ripples, setRipples] = useState<Array<{x: number, y: number, id: number}>>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    x.set(e.clientX - rect.left - centerX);
    y.set(e.clientY - rect.top - centerY);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    
    setRipples(prev => [...prev, { x: rippleX, y: rippleY, id: Date.now() }]);
    
    setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 1000);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Calculate position and scale
  const xPosition = adjustedOffset * (isActive ? 280 : 250);
  const scale = isActive ? 1 : 0.85;
  const zIndex = totalCards - Math.abs(adjustedOffset);
  const opacity = Math.abs(adjustedOffset) > 1 ? 0 : 1;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 cursor-pointer"
      style={{
        rotateX: isActive ? springRotateX : 0,
        rotateY: isActive ? springRotateY : 0,
        transformStyle: "preserve-3d",
        zIndex,
      }}
      initial={{ 
        x: '-50%',
        y: '-50%',
        scale: 0.8,
        opacity: 0 
      }}
      animate={{ 
        x: `calc(-50% + ${xPosition}px)`,
        y: '-50%',
        scale,
        opacity,
        filter: isActive ? 'none' : 'brightness(0.7)',
      }}
      exit={{ 
        scale: 0.8,
        opacity: 0 
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={isActive ? { scale: 1.02 } : {}}
    >
      <div className={`
        relative w-[320px] h-[380px] rounded-2xl overflow-hidden
        ${isActive ? 'shadow-2xl' : 'shadow-lg'}
        transition-shadow duration-300
      `}>
        {/* Glow Effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`
              absolute inset-0 bg-gradient-to-br ${kit.gradient}
              opacity-20 blur-3xl scale-150
            `} />
          </motion.div>
        )}

        {/* Card Background */}
        <div className={`
          absolute inset-0 bg-gradient-to-br ${kit.gradient}
          opacity-10
        `} />

        {/* Image Container with Ripple Effect */}
        <div className="relative h-[60%] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          {/* Ripple Effects */}
          <AnimatePresence>
            {ripples.map(ripple => (
              <motion.div
                key={ripple.id}
                className="absolute rounded-full border-2 border-white/30"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  x: '-50%',
                  y: '-50%',
                }}
                initial={{ width: 0, height: 0, opacity: 1 }}
                animate={{ 
                  width: 300, 
                  height: 300, 
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {/* Placeholder for actual image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`
              w-32 h-32 rounded-2xl bg-gradient-to-br ${kit.gradient}
              opacity-20
            `} />
          </div>

          {/* Liquid overlay effect */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 3,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white">
          <motion.h3 
            className="text-xl font-bold text-slate-900 mb-2"
            animate={{ scale: isActive ? 1 : 0.95 }}
          >
            {kit.title}
          </motion.h3>
          <motion.p 
            className="text-sm text-slate-600"
            animate={{ opacity: isActive ? 1 : 0.8 }}
          >
            {kit.desc}
          </motion.p>
          
          {isActive && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className={`
                inline-flex items-center text-sm font-medium
                bg-gradient-to-r ${kit.gradient} bg-clip-text text-transparent
              `}>
                Explore Kit →
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}