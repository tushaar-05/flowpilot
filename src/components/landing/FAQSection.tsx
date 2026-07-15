import { AccordionItem } from '@/components/ui/Accordion';

const faqs = [
  {
    q: 'Is FlowPilot really free?',
    a: 'Yes — teams up to 10 members get full access at no cost. We\'re building paid plans for larger orgs, but early adopters keep generous limits.',
  },
  {
    q: 'Can I import from Trello or Notion?',
    a: 'CSV import is available today. Direct integrations with Trello, Linear, and Notion are on our Q3 roadmap.',
  },
  {
    q: 'Where is my data stored?',
    a: 'This demo runs entirely in your browser with local storage. A production deployment would use encrypted cloud storage with SOC 2 compliance.',
  },
  {
    q: 'Does it work offline?',
    a: 'Basic viewing works offline once loaded. Full offline sync is planned for our mobile apps launching later this year.',
  },
  {
    q: 'How is FlowPilot different from Jira?',
    a: 'We focus on speed and clarity for small teams. No admin certification required. No 47 custom fields. Just projects, tasks, and progress.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 px-6 border-t-2 border-ink">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-4xl font-extrabold text-ink text-center mb-12">
          Questions? We&apos;ve got answers.
        </h2>
        <div className="rounded-3xl border-2 border-ink bg-surface px-6 shadow-brutal">
          {faqs.map((f) => (
            <AccordionItem key={f.q} title={f.q}>
              {f.a}
            </AccordionItem>
          ))}
        </div>
      </div>
    </section>
  );
}
