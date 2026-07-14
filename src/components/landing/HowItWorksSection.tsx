import { motion } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Create your workspace',
    description: 'Set up projects for each initiative — product launches, marketing campaigns, or engineering sprints.',
    color: 'bg-primary',
  },
  {
    step: '02',
    title: 'Break work into tasks',
    description: 'Add owners, priorities, and due dates. Your team always knows what to pick up next.',
    color: 'bg-accent',
  },
  {
    step: '03',
    title: 'Track and ship',
    description: 'Move cards on Kanban, watch progress bars fill, and celebrate when milestones hit 100%.',
    color: 'bg-secondary',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-yellow/10 border-t-2 border-ink">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-ink text-center mb-16">
          Up and running in minutes
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <div
                  className={`flex h-24 w-full max-w-[240px] items-center justify-center rounded-2xl border-2 border-ink ${s.color} text-white font-extrabold text-lg text-center px-6 shadow-brutal mb-8`}
              >
                   {s.title}
              </div>
              <h3 className="text-2xl font-extrabold text-ink mb-3">{s.title}</h3>
              <p className="max-w-sm text-base text-muted leading-relaxed">{s.description}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-24 w-40 border-t-2 border-dashed border-ink" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
