// BSSOSSCapabilities.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type TabKey = 'BILLING' | 'CHARGING' | 'CATALOG' | 'EVENTS';

interface BSSOSSCapabilitiesProps {
  initialTab?: TabKey;
  className?: string;
}

type Feature = { title: string; description: string; emoji: string };
type TabMeta = {
  key: TabKey;
  label: string;
  emoji: string;
  blurb: string;
  accentFrom: string; // tailwind color (e.g. 'from-sky-500/20')
  accentTo: string;   // tailwind color
  features: Feature[];
};

const TABS: TabMeta[] = [
  {
    key: 'BILLING',
    label: 'Billing',
    emoji: '💳',
    blurb: 'Invoice, collect, and reconcile revenue at scale.',
    accentFrom: 'from-sky-500/25',
    accentTo: 'to-sky-500/0',
    features: [
      { title: 'Invoicing', emoji: '🧾', description: 'Generate itemized invoices with tax, proration, and adjustments.' },
      { title: 'Payments', emoji: '🏦', description: 'Capture payments via gateways with retries and reconciliation.' },
      { title: 'Dunning', emoji: '📨', description: 'Automated retries and notifications to resolve failed charges.' },
      { title: 'Discounts & Credits', emoji: '🏷️', description: 'Apply coupons, credits, and promotional adjustments.' },
    ],
  },
  {
    key: 'CHARGING',
    label: 'Charging',
    emoji: '⚡',
    blurb: 'Real-time rating and usage control.',
    accentFrom: 'from-amber-500/25',
    accentTo: 'to-amber-500/0',
    features: [
      { title: 'Online Charging', emoji: '⏱️', description: 'Authorize and rate usage events in real time.' },
      { title: 'Policy Control', emoji: '🛡️', description: 'Policy and quota management for usage throttling.' },
      { title: 'Mediation', emoji: '🔄', description: 'Normalize and enrich raw usage from multiple sources.' },
      { title: 'Balances', emoji: '💠', description: 'Track balances, allowances, and rollover rules.' },
    ],
  },
  {
    key: 'CATALOG',
    label: 'Catalog',
    emoji: '🗂️',
    blurb: 'Model products, bundles, and pricing with governance.',
    accentFrom: 'from-violet-500/25',
    accentTo: 'to-violet-500/0',
    features: [
      { title: 'Product Modeling', emoji: '🧩', description: 'Define product specs, components, and eligibility.' },
      { title: 'Versioning', emoji: '🗃️', description: 'Safely evolve offerings with versioned lifecycles.' },
      { title: 'Workflows', emoji: '🛠️', description: 'Approval flows and publishing controls.' },
      { title: 'Price Books', emoji: '📚', description: 'Segmented price lists per market and channel.' },
    ],
  },
  {
    key: 'EVENTS',
    label: 'Events',
    emoji: '📅',
    blurb: 'Event-driven integrations and observability.',
    accentFrom: 'from-emerald-500/25',
    accentTo: 'to-emerald-500/0',
    features: [
      { title: 'Event Bus', emoji: '🚌', description: 'Publish domain events to streams and queues.' },
      { title: 'Webhooks', emoji: '🪝', description: 'Reliable outbound webhooks with retries and signing.' },
      { title: 'Observability', emoji: '🔭', description: 'Traces, metrics, and logs for end-to-end insight.' },
      { title: 'Auditing', emoji: '🧭', description: 'Immutable trails for compliance and forensics.' },
    ],
  },
];

const cn = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export const BSSOSSCapabilities: React.FC<BSSOSSCapabilitiesProps> = ({
  initialTab = 'BILLING',
  className,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const active = useMemo(() => TABS.find(t => t.key === activeTab)!, [activeTab]);

  // Register GSAP plugin once on client
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Reveal container when scrolled into view
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, {
        autoAlpha: 0,
        y: 16,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Animate content on tab change
  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );

      const featureCards = gsap.utils.toArray<HTMLElement>('[data-animate="feature"]');
      featureCards.forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 12,
          duration: 0.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            once: true,
          },
        });
      });
    }, contentRef);
    return () => ctx.revert();
  }, [activeTab]);

  // Move the indicator under the active tab
  useEffect(() => {
    const updateIndicator = () => {
      if (!tabsRef.current || !indicatorRef.current) return;
      const btn = tabsRef.current.querySelector<HTMLButtonElement>(`button[data-tab="${activeTab}"]`);
      if (!btn) return;

      const cRect = tabsRef.current.getBoundingClientRect();
      const bRect = btn.getBoundingClientRect();

      const x = bRect.left - cRect.left + tabsRef.current.scrollLeft;
      const w = bRect.width;

      gsap.to(indicatorRef.current, {
        x,
        width: w,
        duration: 0.42,
        ease: 'power3.out',
      });
    };

    // Initial and on resize
    updateIndicator();
    const onResize = () => updateIndicator();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeTab]);

  return (
    <section
      ref={rootRef}
      className={cn(
        'relative mx-auto max-w-5xl px-4 py-10 sm:py-12',
        className
      )}
    >
      <div className="relative rounded-2xl border border-slate-200 bg-white/90 backdrop-blur shadow-sm">
        {/* Header */}
        <div className="px-5 pb-4 pt-6 sm:px-6 sm:pt-7">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              ⚙️
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                BSS/OSS Capabilities
              </h2>
              <p className="text-sm text-slate-600">
                Explore billing, charging, catalog, and event-driven features.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-2 sm:px-6">
          <div
            ref={tabsRef}
            className="relative isolate flex w-full overflow-x-auto rounded-xl bg-slate-100 p-1"
            role="tablist"
            aria-label="Capabilities tabs"
          >
            {/* Animated indicator */}
            <div
              ref={indicatorRef}
              className="pointer-events-none absolute top-1 bottom-1 left-0 z-0 rounded-lg bg-white shadow-sm ring-1 ring-black/5 will-change-transform"
              style={{ width: 0, transform: 'translateX(0px)' }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex min-w-max gap-1">
              {TABS.map((t) => {
                const isActive = t.key === activeTab;
                return (
                  <button
                    key={t.key}
                    type="button"
                    data-tab={t.key}
                    onClick={() => setActiveTab(t.key)}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${t.key}`}
                    className={cn(
                      'group relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      'text-slate-700 hover:text-slate-900'
                    )}
                  >
                    <span aria-hidden="true">{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Accent strip under header based on active tab */}
        <div
          className={cn(
            'mx-4 mt-1 h-1 rounded-full bg-gradient-to-r',
            active.accentFrom,
            active.accentTo
          )}
          aria-hidden="true"
        />

        {/* Content */}
        <div
          id={`panel-${active.key}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.key}`}
          ref={contentRef}
          className="px-5 py-6 sm:px-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="text-lg">{active.emoji}</div>
            <h3 className="text-lg font-semibold text-slate-900">{active.label}</h3>
          </div>
          <p className="mb-6 max-w-3xl text-sm text-slate-600">{active.blurb}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            {active.features.map((f, idx) => (
              <FeatureCard key={`${active.key}-${idx}`} feature={f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div
      data-animate="feature"
      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/90 text-white">
          {feature.emoji}
        </div>
        <h4 className="text-sm font-semibold text-slate-900">{feature.title}</h4>
      </div>
      <p className="text-sm text-slate-600">{feature.description}</p>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-50/0 to-slate-50/0 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

export default BSSOSSCapabilities;