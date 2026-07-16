import React, { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Briefcase, MapPin, DollarSign, Calendar, Users, Send } from 'lucide-react';

const CareersPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const jobs = [
    {
      id: 'sr-frontend',
      title: 'Senior Frontend Engineer (React / Tailwind)',
      team: 'Engineering',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$140k - $170k',
      type: 'Full-time',
      color: 'blue' as const,
    },
    {
      id: 'lead-designer',
      title: 'Product Designer (Soft-Brutalist Specialist)',
      team: 'Design',
      location: 'Remote (US/Canada)',
      salary: '$120k - $150k',
      type: 'Full-time',
      color: 'yellow' as const,
    },
    {
      id: 'devops-infra',
      title: 'Site Reliability & Infrastructure Engineer',
      team: 'Operations',
      location: 'Remote (Global)',
      salary: '$130k - $160k',
      type: 'Full-time',
      color: 'emerald' as const,
    },
    {
      id: 'growth-pm',
      title: 'Product Manager - Growth & Conversion',
      team: 'Product',
      location: 'San Francisco, CA',
      salary: '$135k - $165k',
      type: 'Full-time',
      color: 'pink' as const,
    },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => {
      setSelectedJob(null);
      setSuccessMsg(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="py-16 px-6 max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-pink/20 p-8 sm:p-16 shadow-brutal-lg">
          <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full border-2 border-ink bg-yellow/30" />
          <div className="absolute right-1/4 bottom-4 h-16 w-16 rounded-2xl border-2 border-ink bg-primary/20 rotate-12" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-ink border-2 border-ink px-3 py-1 bg-surface rounded-full mb-4">
              Careers at FlowPilot
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink leading-none">
              Help us shape the future of sprints.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted font-medium">
              We are a small, hyper-focused team of designers and engineers who value fast iteration, clean code, and beautiful user interfaces.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink text-center">Why join us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card padding="md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-yellow/30 mb-4">
                <Users className="h-5 w-5 text-ink" />
              </div>
              <h3 className="text-lg font-extrabold text-ink mb-1.5">Elite Async Culture</h3>
              <p className="text-xs sm:text-sm text-muted font-semibold leading-relaxed">
                Work from anywhere, on your own schedule. We minimize sync meetings and focus on clear written specs.
              </p>
            </Card>
            <Card padding="md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-primary/20 mb-4">
                <Calendar className="h-5 w-5 text-ink" />
              </div>
              <h3 className="text-lg font-extrabold text-ink mb-1.5">Modern Tech Stack</h3>
              <p className="text-xs sm:text-sm text-muted font-semibold leading-relaxed">
                We build with React 19, TypeScript, Tailwind CSS v4, and Vite. No legacy codebases, just fast development.
              </p>
            </Card>
            <Card padding="md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-emerald/20 mb-4">
                <DollarSign className="h-5 w-5 text-ink" />
              </div>
              <h3 className="text-lg font-extrabold text-ink mb-1.5">Top-Tier Benefits</h3>
              <p className="text-xs sm:text-sm text-muted font-semibold leading-relaxed">
                Competitive equity, comprehensive health insurance, yearly learning stipend, and setup allowance.
              </p>
            </Card>
          </div>
        </section>

        {/* Open Job Listings */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">Current openings</h2>
            <p className="text-muted text-sm mt-1">Join our crew in San Francisco or remotely</p>
          </div>
          
          <div className="space-y-4 max-w-4xl mx-auto">
            {jobs.map((job) => (
              <Card key={job.id} padding="md" color={job.color} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-brutal-hover transition-all">
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-ink leading-snug">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" /> {job.team}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" /> {job.salary}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button variant="dark" size="sm" onClick={() => setSelectedJob(job.title)}>
                    Apply Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Application Modal */}
      <Modal open={!!selectedJob} onClose={() => setSelectedJob(null)} title="Apply for Job">
        {successMsg ? (
          <div className="text-center py-8 space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20 border-2 border-ink">
              <Send className="h-6 w-6 text-secondary" />
            </div>
            <p className="font-extrabold text-ink">Application Submitted!</p>
            <p className="text-xs text-muted">We will review your resume and reach out within 3 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <p className="text-sm font-bold text-muted mb-4">Position: <span className="text-ink">{selectedJob}</span></p>
            <Input label="Full Name" type="text" placeholder="Sarah Chen" required />
            <Input label="Email Address" type="email" placeholder="you@company.com" required />
            <Input label="LinkedIn URL" type="url" placeholder="https://linkedin.com/in/..." />
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setSelectedJob(null)}>Cancel</Button>
              <Button type="submit">Submit Application</Button>
            </div>
          </form>
        )}
      </Modal>

      <LandingFooter />
    </div>
  );
};

export default CareersPage;
