import React from "react";
import {
  FiShield,
  FiTrendingUp,
  FiLayers,
  FiUsers,
  FiDatabase,
  FiBell,
  FiCompass,
  FiCheckCircle,
} from "react-icons/fi";

// Narrative overview of the LAWATA Risk-Integrated Crowdfunding platform
const About = () => {
  const differentiators = [
    {
      icon: <FiShield className="h-6 w-6" />,
      title: "Risk-first investment decisions",
      description:
        "Every campaign is paired with contextual risk signals—ranging from milestone burn-down tracking to community sentiment—so backers can support ideas with clarity, not guesswork.",
    },
    {
      icon: <FiTrendingUp className="h-6 w-6" />,
      title: "Creator growth companion",
      description:
        "Project owners unlock analytics, milestone roadmaps, tiered rewards, and compliance-friendly data capture that scales with them from idea to launch to repeat campaigns.",
    },
    {
      icon: <FiLayers className="h-6 w-6" />,
      title: "Unified funding workflows",
      description:
        "A single experience connects discovery, investing, wallet management, messaging, and after-care so the entire lifecycle stays on one platform.",
    },
  ];

  const investorJourney = [
    {
      step: "01",
      title: "Discover opportunities",
      copy:
        "Use dynamic search, curated collections, and risk overlays to surface projects that match your appetite for innovation and impact.",
    },
    {
      step: "02",
      title: "Due diligence in context",
      copy:
        "Dive into milestone roadmaps, projected rewards, and creator credibility signals captured through verification workflows and Firestore-backed profiles.",
    },
    {
      step: "03",
      title: "Fund with confidence",
      copy:
        "Secure, Firebase-authenticated flows guard every transaction while wallet integrations make deposits, withdrawals, and reinvestments effortless.",
    },
    {
      step: "04",
      title: "Stay in the loop",
      copy:
        "Real-time notifications, community updates, and milestone alerts ensure you always know how your backing is performing.",
    },
  ];

  const builderToolkit = [
    {
      icon: <FiDatabase className="h-6 w-6" />,
      title: "Data-rich profiles",
      body:
        "Creator dashboards sync with Firestore to store identity artifacts, funding history, and community engagement stats in one canonical record.",
    },
    {
      icon: <FiBell className="h-6 w-6" />,
      title: "Signal-aware outreach",
      body:
        "NotificationBell components broadcast campaign updates, investor Q&A, and milestone approvals without leaving the project workspace.",
    },
    {
      icon: <FiCompass className="h-6 w-6" />,
      title: "Guided launch playbooks",
      body:
        "From rewards configuration to compliance messaging, guided forms and validation utilities lower the barrier to launching responsibly.",
    },
  ];

  const roadmap = [
    {
      milestone: "Q4 2025",
      detail:
        "Deploy automated risk scoring that blends platform telemetry with third-party data feeds for even richer investor insights.",
    },
    {
      milestone: "Q1 2026",
      detail:
        "Introduce collaborative due diligence rooms where investors can annotate milestones, share research, and vote on creator requests.",
    },
    {
      milestone: "H1 2026",
      detail:
        "Expand multi-currency wallets and smart contract settlement options to unlock a broader global investor base.",
    },
  ];

  return (
    <div className="bg-white text-color-e">
      <section className="relative overflow-hidden bg-gradient-to-br from-color-b/10 via-white to-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-20 pt-28 md:gap-12 md:px-10">
          <div className="space-y-6 md:max-w-3xl">
            <p className="inline-flex items-center rounded-full bg-color-b/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-color-b">
              About LAWATA
            </p>
            <h1 className="text-4xl font-bold leading-tight text-color-e md:text-5xl lg:text-6xl">
              Building the world’s first risk-integrated crowdfunding and investment marketplace.
            </h1>
            <p className="text-lg text-color-c md:text-xl">
              LAWATA fuses community-powered backing with institutional-grade risk intelligence. We’re creating a trusted home where
              visionary builders meet discerning investors, backed by transparent data, smart automation, and a human-first support network.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {differentiators.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-color-b/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-color-b/10 text-color-b">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-color-e">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-color-c">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.2fr,0.8fr] md:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-color-e md:text-4xl">Why risk intelligence matters</h2>
            <p className="text-base leading-relaxed text-color-c md:text-lg">
              Impactful crowdfunding demands more than enthusiasm. LAWATA weaves together analytics from components like ProjectAnalytics,
              MilestoneRoadmap, RewardsList, and Wallet management to surface the real-time health of every campaign. The result is a
              transparent ecosystem that rewards creators who plan responsibly while empowering investors to diversify with confidence.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-color-b/10 bg-color-b/5 p-5">
                <p className="text-2xl font-semibold text-color-b">8+</p>
                <p className="mt-1 text-sm text-color-c">specialised modules working together across the platform experience.</p>
              </div>
              <div className="rounded-2xl border border-color-b/10 bg-color-b/5 p-5">
                <p className="text-2xl font-semibold text-color-b">24/7</p>
                <p className="mt-1 text-sm text-color-c">real-time sync powered by Firebase Auth, Firestore, and Storage safeguards.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-dashed border-color-b/30 bg-color-b/5 p-8">
            <h3 className="text-xl font-semibold text-color-e">Platform Values</h3>
            <ul className="mt-4 space-y-3 text-sm text-color-c">
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-1 h-5 w-5 text-color-b" />
                Radical transparency in creator and investor data.
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-1 h-5 w-5 text-color-b" />
                Supportive community features that celebrate progress, not just funding totals.
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-1 h-5 w-5 text-color-b" />
                Responsible innovation aligned with regulatory best practices.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-color-e/5">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <h2 className="text-3xl font-bold text-color-e md:text-4xl">Investor journey</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-color-c md:text-base">
            Whether you’re scanning for emerging ventures or backing seasoned founders, LAWATA keeps the process simple, secure, and insight-rich.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {investorJourney.map((item) => (
              <div key={item.step} className="rounded-3xl border border-color-b/10 bg-white p-6 shadow-sm">
                <span className="text-sm font-semibold uppercase tracking-wide text-color-b">Step {item.step}</span>
                <h3 className="mt-2 text-xl font-semibold text-color-e">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-color-c">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid gap-10 md:grid-cols-[0.8fr,1.2fr] md:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-color-e md:text-4xl">Creator toolkit</h2>
            <p className="text-base leading-relaxed text-color-c md:text-lg">
              Launching a campaign is more than publishing a pitch. LAWATA equips builders with workflows that raise the signal-to-noise ratio
              and steward every backer relationship.
            </p>
            <div className="space-y-4">
              {builderToolkit.map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-color-b/10 bg-white p-5 shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-color-b/10 text-color-b">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-color-e">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-color-c">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-color-b/15 via-white to-white p-8 shadow-inner">
            <h3 className="text-xl font-semibold text-color-e">Powered by a modern stack</h3>
            <ul className="mt-4 space-y-3 text-sm text-color-c">
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-1 h-5 w-5 text-color-b" />
                React 18 + Vite for lightning-fast interface updates.
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-1 h-5 w-5 text-color-b" />
                Firebase Authentication, Firestore, and Storage securing profiles, funding data, and media uploads.
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-1 h-5 w-5 text-color-b" />
                Tailwind-inspired utility styling with bespoke palettes for consistent branding.
              </li>
              <li className="flex items-start gap-2">
                <FiCheckCircle className="mt-1 h-5 w-5 text-color-b" />
                GSAP-powered motion for immersive onboarding and campaign storytelling.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-color-b/5">
        <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
          <h2 className="text-3xl font-bold text-color-e md:text-4xl">What’s next for LAWATA</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-color-c md:text-base">
            We’re committed to a transparent build, sharing early milestones with the community. Here’s what the upcoming roadmap looks like.
          </p>
          <div className="mt-10 space-y-6">
            {roadmap.map((item) => (
              <div key={item.milestone} className="flex flex-col gap-3 rounded-2xl border border-color-b/10 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                <span className="text-lg font-semibold text-color-b">{item.milestone}</span>
                <p className="text-sm leading-relaxed text-color-c md:max-w-3xl">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center md:px-10">
          <h2 className="text-3xl font-bold text-color-e md:text-4xl">Join the LAWATA community</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-color-c md:text-base">
            Whether you’re an investor hunting for the next breakout venture, a builder validating a bold idea, or a policy leader shaping
            responsible finance, LAWATA offers the data, tooling, and partnerships to move faster with confidence.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/browse"
              className="inline-flex items-center justify-center rounded-full bg-color-b px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-color-b/90"
            >
              Explore projects
            </a>
            <a
              href="/create"
              className="inline-flex items-center justify-center rounded-full border border-color-b px-6 py-3 text-sm font-semibold text-color-b transition hover:bg-color-b/10"
            >
              Launch your campaign
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
