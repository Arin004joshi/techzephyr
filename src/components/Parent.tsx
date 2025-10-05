import React, { useState } from "react";
import FeatureTabs, { type TabItem } from "./FeatureTabs";

// Simple inline icons (no extra deps)
const Icon = ({
    d,
    className = "h-5 w-5",
}: {
    d: string;
    className?: string;
}) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d={d} />
    </svg>
);

const IconOverview = <Icon d="M4 12h16M4 6h16M4 18h10" />;
const IconBolt = <Icon d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />;
const IconShield = (
    <Icon d="M12 3l7 4v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V7l7-4z" />
);
const IconLifebuoy = (
    <Icon d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-10a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm5.66-1.66-2.12 2.12M8.46 15.54l-2.12 2.12m0-9.2 2.12 2.12m9.2 5.0-2.12-2.12" />
);

const Parent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("overview");

    const tabs: TabItem[] = [
        { id: "overview", label: "Overview", icon: IconOverview },
        { id: "performance", label: "Performance", icon: IconBolt },
        { id: "security", label: "Security", icon: IconShield },
        { id: "support", label: "Support", icon: IconLifebuoy },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <FeatureTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
                <section
                    id="panel-overview"
                    role="tabpanel"
                    aria-labelledby="tab-overview"
                    hidden={activeTab !== "overview"}
                >
                    <h2 className="text-xl font-semibold mb-2">Overview</h2>
                    <p className="text-slate-600">
                        High-level summary of your product’s capabilities and value.
                    </p>
                </section>

                <section
                    id="panel-performance"
                    role="tabpanel"
                    aria-labelledby="tab-performance"
                    hidden={activeTab !== "performance"}
                >
                    <h2 className="text-xl font-semibold mb-2">Performance</h2>
                    <p className="text-slate-600">
                        Benchmarks, speed metrics, and real-world performance notes.
                    </p>
                </section>

                <section
                    id="panel-security"
                    role="tabpanel"
                    aria-labelledby="tab-security"
                    hidden={activeTab !== "security"}
                >
                    <h2 className="text-xl font-semibold mb-2">Security</h2>
                    <p className="text-slate-600">
                        Encryption, compliance, and best practices implemented.
                    </p>
                </section>

                <section
                    id="panel-support"
                    role="tabpanel"
                    aria-labelledby="tab-support"
                    hidden={activeTab !== "support"}
                >
                    <h2 className="text-xl font-semibold mb-2">Support</h2>
                    <p className="text-slate-600">
                        Channels, SLAs, and resources to help your users succeed.
                    </p>
                </section>

                <div className="h-[120vh]" />
            </main>
        </div>
    );
};

export default Parent;