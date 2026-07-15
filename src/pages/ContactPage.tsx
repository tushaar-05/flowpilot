import React, { useState } from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, MessageSquare, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-ink border-2 border-ink px-3 py-1 bg-yellow/30 rounded-full">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
            Contact FlowPilot
          </h1>
          <p className="text-base sm:text-lg text-muted font-semibold">
            Have questions about custom integrations or enterprise pricing? Send us a message and our team will respond shortly.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6">
          {/* Left info cards */}
          <div className="lg:col-span-5 space-y-6">
            <Card padding="md">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-primary/20">
                  <Mail className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <h3 className="font-extrabold text-ink">General Support</h3>
                  <p className="text-xs sm:text-sm text-muted font-semibold mt-1">
                    For general account help, bug reports, and project templates.
                  </p>
                  <a href="mailto:support@flowpilot.io" className="inline-block text-sm font-bold text-primary hover:underline mt-2">
                    support@flowpilot.io
                  </a>
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-emerald/20">
                  <MessageSquare className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <h3 className="font-extrabold text-ink">Sales & Enterprise</h3>
                  <p className="text-xs sm:text-sm text-muted font-semibold mt-1">
                    Custom workspace setups, security contracts, and volume discounts.
                  </p>
                  <a href="mailto:sales@flowpilot.io" className="inline-block text-sm font-bold text-primary hover:underline mt-2">
                    sales@flowpilot.io
                  </a>
                </div>
              </div>
            </Card>

            <Card padding="md">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-yellow/30">
                  <MapPin className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <h3 className="font-extrabold text-ink">Headquarters</h3>
                  <p className="text-xs sm:text-sm text-muted font-semibold mt-1">
                    FlowPilot Labs, Inc.<br />
                    100 Pine Street, Suite 1250<br />
                    San Francisco, CA 94111
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right inquiry form */}
          <div className="lg:col-span-7">
            <Card padding="lg" className="relative">
              {submitted ? (
                <div className="text-center py-16 space-y-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20 border-2 border-ink">
                    <CheckCircle className="h-7 w-7 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-ink">Message Sent!</h2>
                  <p className="text-muted text-sm max-w-sm mx-auto font-semibold">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-extrabold text-ink mb-4">Send a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="First Name" type="text" placeholder="Sarah" required />
                    <Input label="Last Name" type="text" placeholder="Chen" required />
                  </div>
                  <Input label="Work Email" type="email" placeholder="you@company.com" required />
                  <div>
                    <label className="block text-sm font-bold text-ink mb-2">Message</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="How can we help your team?"
                      className="w-full rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-base font-medium text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 shadow-brutal-sm"
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full flex items-center justify-center gap-2" loading={loading}>
                      <Send className="h-4 w-4" /> Send Message
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default ContactPage;
