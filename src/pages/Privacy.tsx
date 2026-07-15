import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Card } from '@/components/ui/Card';
import { Shield, Eye, Lock, Globe, Mail, CheckCircle } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    { id: 'introduction', label: '1. Introduction', icon: Globe },
    { id: 'collection', label: '2. Information We Collect', icon: Eye },
    { id: 'usage', label: '3. How We Use Information', icon: Shield },
    { id: 'storage', label: '4. Data Storage & Local Storage', icon: Lock },
    { id: 'rights', label: '5. Your Rights & Control', icon: CheckCircle },
    { id: 'contact', label: '6. Contact Us', icon: Mail },
  ];

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main className="py-16 px-6 max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-pink/20 p-8 sm:p-12 shadow-brutal-lg mb-12">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full border-2 border-ink bg-yellow/30" />
          <div className="absolute right-24 bottom-4 h-16 w-16 rounded-2xl border-2 border-ink bg-primary/20 rotate-12" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-ink border-2 border-ink px-3 py-1 bg-white rounded-full mb-4">
              Legal & Compliance
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink leading-none">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted font-medium">
              We value your trust and security. This policy outlines how FlowPilot collects, uses, and safeguards your data when using our workspace.
            </p>
            <p className="text-xs font-bold text-muted mt-6">
              Last Updated: July 8, 2026
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Sticky Table of Contents */}
          <aside className="lg:col-span-4 sticky top-24 self-start hidden lg:block">
            <Card padding="sm" className="space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted px-3 mb-3">
                Table of Contents
              </p>
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleScroll(sec.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-muted hover:bg-slate-50 hover:text-ink hover:border-ink/20 transition-all border-2 border-transparent"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </Card>
          </aside>

          {/* Right: Policy Document Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1 */}
            <section id="introduction" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  1. Introduction
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    Welcome to FlowPilot ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to all information collected through our website, application, and any related services.
                  </p>
                  <p>
                    By accessing or using FlowPilot, you agree to the practices described in this policy. If you do not agree with any terms outlined here, please discontinue use of the service immediately.
                  </p>
                </div>
              </Card>
            </section>

            {/* Section 2 */}
            <section id="collection" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-pink" />
                  2. Information We Collect
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-4 font-medium">
                  <p>
                    We collect personal information that you voluntarily provide to us when registering for an account, building projects, creating tasks, or communicating with us.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Account Data:</strong> Name, work email address, user avatar, and credentials.
                    </li>
                    <li>
                      <strong>Workspace Data:</strong> Information generated within the platform including project names, descriptions, priority tags, task details, checklists, activity timelines, and team role assignments.
                    </li>
                    <li>
                      <strong>Uploaded Files:</strong> Document metadata, file sizes, and names uploaded into project threads.
                    </li>
                    <li>
                      <strong>Usage & Analytics Data:</strong> IP addresses, browser types, referral URLs, operating system metadata, and page interaction timestamps.
                    </li>
                  </ul>
                </div>
              </Card>
            </section>

            {/* Section 3 */}
            <section id="usage" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  3. How We Use Information
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    We process your information for purposes based on legitimate business interests, the fulfillment of our services, compliance with legal obligations, and user consent:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>To facilitate account creation, authentication, and secure login workflows.</li>
                    <li>To deliver core application features, such as Kanban boards, calendars, analytics dashboards, and team project lists.</li>
                    <li>To notify you about important updates, security alerts, and system notifications.</li>
                    <li>To analyze user engagement and optimize the visual and functional design layout of our workspace.</li>
                  </ul>
                </div>
              </Card>
            </section>

            {/* Section 4 */}
            <section id="storage" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <Lock className="h-5 w-5 text-amber-500" />
                  4. Data Storage & Local Storage
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    For the client-side demonstration of FlowPilot, all database records, tasks, projects, settings, and active user session states are stored in your browser's <strong>LocalStorage</strong>.
                  </p>
                  <p>
                    <strong>Important Note:</strong> Because this demo runs client-side, your workspace data remains localized on your computer. Clearing browser cookies or cache will delete your stored projects, tasks, and settings. Production integrations are planned to route through secure, encrypted cloud data centers with full backup systems.
                  </p>
                </div>
              </Card>
            </section>

            {/* Section 5 */}
            <section id="rights" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  5. Your Rights & Control
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    You have complete control over the data stored in FlowPilot. Depending on your location, you may have specific rights regarding your personal information, including:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>The right to request access to and receive copies of the data stored.</li>
                    <li>The right to edit, modify, or update your account information.</li>
                    <li>The right to request complete erasure of your workspace and tasks (which can be done by signing out or clearing browser cache).</li>
                  </ul>
                </div>
              </Card>
            </section>

            {/* Section 6 */}
            <section id="contact" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <Mail className="h-5 w-5 text-purple-600" />
                  6. Contact Us
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    If you have questions, comments, or concerns about this policy or our data safety standards, you can contact our privacy officer at:
                  </p>
                  <div className="rounded-2xl border-2 border-ink/10 bg-slate-50 p-4 mt-2">
                    <p className="font-bold text-ink">FlowPilot Security & Compliance Team</p>
                    <p className="mt-1">Email: <a href="mailto:privacy@flowpilot.io" className="text-primary hover:underline">privacy@flowpilot.io</a></p>
                    <p>Address: San Francisco, CA, USA</p>
                  </div>
                </div>
              </Card>
            </section>
          </div>
          
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}