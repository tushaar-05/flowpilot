import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Card } from '@/components/ui/Card';
import { BookOpen, UserCheck, AlertTriangle, Scale, ShieldAlert, FileText } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    { id: 'acceptance', label: '1. Acceptance of Terms', icon: BookOpen },
    { id: 'accounts', label: '2. User Accounts', icon: UserCheck },
    { id: 'conduct', label: '3. Prohibited Conduct', icon: AlertTriangle },
    { id: 'ip', label: '4. Intellectual Property', icon: FileText },
    { id: 'liability', label: '5. Limitation of Liability', icon: ShieldAlert },
    { id: 'governing-law', label: '6. Governing Law', icon: Scale },
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
        <div className="relative overflow-hidden rounded-3xl border-2 border-ink bg-yellow/20 p-8 sm:p-12 shadow-brutal-lg mb-12">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full border-2 border-ink bg-pink/30" />
          <div className="absolute right-24 bottom-4 h-16 w-16 rounded-2xl border-2 border-ink bg-primary/20 rotate-12" />
          
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-ink border-2 border-ink px-3 py-1 bg-white rounded-full mb-4">
              Legal & Terms
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink leading-none">
              Terms of Service
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted font-medium">
              Please read these terms and conditions carefully before using our software workspace.
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

          {/* Right: Terms Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  1. Acceptance of Terms
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    By creating an account, accessing, or using FlowPilot ("Service"), you agree to be bound by these Terms of Service. If you are entering into these terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity.
                  </p>
                  <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notification of major modifications, but continued use of the service signifies acceptance of revised terms.
                  </p>
                </div>
              </Card>
            </section>

            {/* Section 2 */}
            <section id="accounts" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <UserCheck className="h-5 w-5 text-pink" />
                  2. User Accounts
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    To access FlowPilot, you must create a user profile. You are entirely responsible for maintaining the confidentiality of your credentials and local data sessions.
                  </p>
                  <p>
                    You agree to provide accurate, current, and complete information during registration. FlowPilot is a browser-based application where data is localized in LocalStorage. You are responsible for backing up your projects and tasks, as clearing cookies or browser files will erase your local workspace context.
                  </p>
                </div>
              </Card>
            </section>

            {/* Section 3 */}
            <section id="conduct" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  3. Prohibited Conduct
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    You agree not to engage in any activity that interferes with or disrupts the service. Prohibited behaviors include:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Using the Service for any unauthorized or illegal purposes.</li>
                    <li>Uploading files containing malware, viruses, or malicious script code.</li>
                    <li>Attempting to probe, scan, or breach system firewall security configurations.</li>
                    <li>Engaging in automated scraping, mining, or harvesting of workspace assets.</li>
                  </ul>
                </div>
              </Card>
            </section>

            {/* Section 4 */}
            <section id="ip" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-purple-600" />
                  4. Intellectual Property
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    The Service, including its UI design layouts, soft-brutalist theme design systems, codebase, icons, brand design, and logos, are and will remain the exclusive property of FlowPilot and its licensors.
                  </p>
                  <p>
                    You retain all ownership rights to the metadata, project text, tasks, and files you create or upload in your workspace. You grant us a non-exclusive license to process your localized data internally as needed to run the client-side workspace.
                  </p>
                </div>
              </Card>
            </section>

            {/* Section 5 */}
            <section id="liability" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <ShieldAlert className="h-5 w-5 text-red-600" />
                  5. Limitation of Liability & Disclaimers
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                  </p>
                  <p>
                    IN NO EVENT SHALL FLOWPILOT, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA LOSS, OR SYSTEM SERVICE INTERRUPTIONS ARISING OUT OF THE USE OR INABILITY TO USE THE SERVICE.
                  </p>
                </div>
              </Card>
            </section>

            {/* Section 6 */}
            <section id="governing-law" className="scroll-mt-24">
              <Card padding="lg">
                <h2 className="text-xl font-extrabold text-ink flex items-center gap-2 mb-4">
                  <Scale className="h-5 w-5 text-emerald-600" />
                  6. Governing Law & Dispute Resolution
                </h2>
                <div className="text-sm leading-relaxed text-muted space-y-3 font-medium">
                  <p>
                    These Terms shall be governed, construed, and enforced in accordance with the laws of the State of California, United States, without reference to its conflict of law principles.
                  </p>
                  <p>
                    Any disputes, controversies, or claims arising under these terms shall be settled exclusively in the state or federal courts located in San Francisco, California.
                  </p>
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
