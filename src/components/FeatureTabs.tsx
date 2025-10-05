import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type TabItem = {
    id: string;
    label: string;
    icon?: React.ReactNode;
};

export interface FeatureTabsProps {
    tabs: TabItem[];
    activeTab: string;
    setActiveTab: (id: string) => void;
    className?: string;
}

const FeatureTabs: React.FC<FeatureTabsProps> = ({
    tabs,
    activeTab,
    setActiveTab,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ctx = gsap.context(() => {
            const q = gsap.utils.selector(containerRef);
            gsap.from(q(".tabItem"), {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
                opacity: 0,
                y: 10,
                stagger: 0.08,
                duration: 0.35,
                ease: "power2.out",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
        const idx = tabs.findIndex((t) => t.id === activeTab);
        if (idx === -1) return;

        const focusTab = (i: number) => {
            setActiveTab(tabs[i].id);
            const el =
                containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[i];
            el?.focus();
        };

        switch (e.key) {
            case "ArrowRight":
                e.preventDefault();
                focusTab((idx + 1) % tabs.length);
                break;
            case "ArrowLeft":
                e.preventDefault();
                focusTab((idx - 1 + tabs.length) % tabs.length);
                break;
            case "Home":
                e.preventDefault();
                focusTab(0);
                break;
            case "End":
                e.preventDefault();
                focusTab(tabs.length - 1);
                break;
        }
    };

    return (
        <div
            ref={containerRef}
            className={[
                "sticky top-0 z-40 w-full border-b",
                "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60",
                className || "",
            ].join(" ")}
        >
            <nav
                role="tablist"
                aria-label="Feature tabs"
                onKeyDown={handleKeyDown}
                className="mx-auto max-w-5xl px-3 sm:px-4"
            >
                <div className="relative flex items-center justify-between gap-1 py-2 sm:py-3">
                    {tabs.map((tab) => {
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                id={`tab-${tab.id}`}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-controls={`panel-${tab.id}`}
                                className={[
                                    "tabItem group flex-1 select-none rounded-md px-3 py-2 sm:py-3",
                                    "text-xs sm:text-sm font-medium transition",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2",
                                    isActive
                                        ? "text-indigo-600 bg-indigo-50 ring-1 ring-indigo-100 shadow-[inset_0_-2px_0_theme(colors.indigo.500)]"
                                        : "text-slate-600 hover:bg-slate-50",
                                ].join(" ")}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {tab.icon ? (
                                        <span
                                            className={[
                                                "shrink-0",
                                                isActive
                                                    ? "text-indigo-600"
                                                    : "text-slate-500 group-hover:text-slate-700",
                                            ].join(" ")}
                                        >
                                            {tab.icon}
                                        </span>
                                    ) : null}
                                    <span>{tab.label}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default FeatureTabs;