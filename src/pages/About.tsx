import React from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Card } from '@/components/ui/Card';
import { Target, Eye, Shield } from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'To simplify collaborative planning and sprint execution, helping start-ups and creators ship work on schedule without burnout.',
      color: 'blue' as const,
    },
    {
      icon: Eye,
      title: 'Our Vision',
      desc: 'To build the most intuitive, beautiful, and transparent project manager workspace that people actually enjoy using daily.',
      color: 'yellow' as const,
    },
    {
      icon: Shield,
      title: 'Our Values',
      desc: 'Transparency, speed, and great design. We believe that clean aesthetics inspire focused attention and better output.',
      color: 'emerald' as const,
    },
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Co-Founder & CEO',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Ex-Stripe Product Lead. Passionate about productivity software and design.',
    },
    {
      name: 'Marcus Vance',
      role: 'Head of Engineering',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      bio: 'Former React Core Contributor. Loves Rust, WebAssembly, and clean architecture.',
    },
    {
      name: 'Elena Rostova',
      role: 'Lead Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      bio: 'Brutalist design enthusiast. Creator of the signature FlowPilot layout.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="py-16 px-6 max-w-6xl mx-auto space-y-16">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-primary/20 p-8 sm:p-16 shadow-brutal-lg text-center sm:text-left">
          <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full border-2 border-ink bg-yellow/30" />
          <div className="absolute left-1/3 bottom-4 h-16 w-16 rounded-2xl border-2 border-ink bg-pink/20 rotate-12" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-ink border-2 border-ink px-3 py-1 bg-surface rounded-full mb-4">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
              We build workspaces for creators.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted font-medium">
              FlowPilot was founded in 2026 to help startup founders, student teams, and developers plan milestones without the clutter of legacy trackers.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink text-center">Guided by clarity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Card key={i} color={v.color} padding="lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-surface shadow-brutal-sm mb-4">
                    <Icon className="h-6 w-6 text-ink" />
                  </div>
                  <h3 className="text-xl font-extrabold text-ink mb-2">{v.title}</h3>
                  <p className="text-sm font-semibold text-muted leading-relaxed">{v.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">Meet the founders</h2>
            <p className="text-muted text-sm mt-1">The designers and builders behind FlowPilot</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((t, idx) => (
              <Card key={idx} padding="lg" hover className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full border-2 border-ink bg-yellow overflow-hidden mb-4 shadow-brutal-sm">
                  <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="text-lg font-extrabold text-ink">{t.name}</h3>
                <span className="text-xs font-bold text-primary uppercase mt-0.5">{t.role}</span>
                <p className="text-sm text-muted mt-3 font-semibold leading-relaxed">{t.bio}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default AboutPage;
