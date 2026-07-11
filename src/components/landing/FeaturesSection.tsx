import { motion } from 'framer-motion';
import { Kanban, Calendar, BarChart3, Users, FileText, Bell } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';

const features = [
  {
    icon: Bell,
    title: 'Visual Kanban Boards',
    description: 'Drag tasks across columns. See bottlenecks before they become blockers on your next sprint.',
    color: 'bg-primary/15',
  },
  {
    icon: Calendar,
    title: 'Deadline Calendar',
    description: 'Every due date in one view. Plan launches around real timelines, not wishful thinking.',
    color: 'bg-yellow/30',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Track velocity and completion rates. Know exactly where your team stands every Friday.',
    color: 'bg-pink/20',
  },
  {
    icon: Users,
    title: 'Team Workspaces',
    description: 'Assign owners, balance workloads, and keep everyone aligned on what ships next.',
    color: 'bg-secondary/20',
  },
  {
    icon: FileText,
    title: 'File Hub',
    description: 'Specs, designs, and docs live next to the work. No more hunting through Slack threads.',
    color: 'bg-purple/20',
  },
  {
    icon: Kanban,
    title: 'Smart Notifications',
    description: 'Get pinged on what matters — assignments, reviews, and deadlines — not every comment.',
    color: 'bg-white',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 border-t-2 border-ink">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-ink">
            Everything your team needs.<br />Nothing they don&apos;t.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Built for founders, product leads, and engineers who want clarity — not another tool to manage.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card hover className={`h-full ${i === 0 ? 'border-none bg-transparent shadow-none hover:shadow-none pointer-events-none' : ''}`}>
                <div className={`inline-flex rounded-2xl border-2 border-ink p-3 ${f.color} shadow-brutal-sm mb-5`}>
                  <f.icon className="h-6 w-6 text-ink" />
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
