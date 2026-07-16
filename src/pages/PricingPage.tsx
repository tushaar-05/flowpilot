import React, { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free Starter',
      price: 0,
      desc: 'Perfect for student projects, indie creators, and single developers.',
      features: [
        'Up to 3 active projects',
        'Basic Kanban boards & tasks',
        'Calendar scheduling',
        'Local browser storage persistence',
        'Standard dashboard metrics',
      ],
      cta: 'Get Started',
      variant: 'outline' as const,
      color: 'white' as const,
    },
    {
      name: 'Pro Team',
      price: isAnnual ? 8 : 10,
      desc: 'Designed for high-growth startups and fast-moving teams.',
      features: [
        'Unlimited active projects',
        'Unlimited task boards & priorities',
        'Detailed team velocity analytics',
        'Upload project files (up to 50MB)',
        'Custom task activity audit logs',
        'Priority workspace support',
      ],
      cta: 'Upgrade to Pro',
      variant: 'yellow' as const,
      color: 'yellow' as const,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'For larger companies needing dedicated security and analytics.',
      features: [
        'Everything in Pro Team',
        'SAML Single Sign-On (SSO)',
        'Unlimited file storage capacity',
        'Dedicated account manager',
        '99.9% uptime SLA compliance',
        'Custom reporting & export feeds',
      ],
      cta: 'Contact Sales',
      variant: 'dark' as const,
      color: 'white' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="py-16 px-6 max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-ink border-2 border-ink px-3 py-1 bg-primary/20 rounded-full">
            Pricing Plans
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
            Plans that fit your velocity.
          </h1>
          <p className="text-base sm:text-lg text-muted font-semibold">
            Start completely free with local browser storage. Upgrade anytime to collaborate with your team.
          </p>

          {/* Billing Switcher Toggle */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-sm font-bold ${!isAnnual ? 'text-ink' : 'text-muted'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-6 w-11 rounded-full border-2 border-ink bg-surface transition-colors focus:outline-none"
              aria-label="Toggle annual billing"
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-ink transition-transform ${
                  isAnnual ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-bold flex items-center gap-1.5 ${isAnnual ? 'text-ink' : 'text-muted'}`}>
              Annually 
              <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-extrabold uppercase rounded-full border border-ink shadow-brutal-sm">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <Card
              key={idx}
              color={p.color}
              padding="lg"
              className={`relative flex flex-col justify-between h-full hover:shadow-brutal-hover transition-all ${
                p.popular ? 'border-primary ring-2 ring-primary ring-offset-4' : ''
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3.5 left-6 bg-primary text-white border-2 border-ink px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full shadow-brutal-sm">
                  Most Popular
                </span>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-ink">{p.name}</h3>
                  <p className="text-xs sm:text-sm text-muted mt-2 font-semibold min-h-[40px] leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 pt-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-ink">
                    {typeof p.price === 'number' ? `$${p.price}` : p.price}
                  </span>
                  {typeof p.price === 'number' && (
                    <span className="text-sm font-bold text-muted">/ user / mo</span>
                  )}
                </div>

                <ul className="space-y-3.5 pt-4 border-t-2 border-ink/5">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-muted">
                      <Check className="h-4.5 w-4.5 shrink-0 text-secondary mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                {p.price === 'Custom' ? (
                  <Link to="/contact" className="block w-full">
                    <Button variant={p.variant} className="w-full" size="md">
                      {p.cta}
                    </Button>
                  </Link>
                ) : (
                  <Link to={ROUTES.REGISTER} className="block w-full">
                    <Button variant={p.variant} className="w-full" size="md">
                      {p.cta}
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default PricingPage;
