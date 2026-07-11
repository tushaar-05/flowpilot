import { motion } from 'framer-motion';
import { MessageSquare, Zap } from 'lucide-react';

const avatars = [
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Priya',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jordan',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sam',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Casey',
];

export function CollaborationSection() {
  return (
    <section className="py-24 px-6 border-t-2 border-ink">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
            Built for teams that<br />move fast together
          </h2>
          <p className="mt-5 text-lg text-muted leading-relaxed">
            Whether you&apos;re a 4-person startup or a 40-person scale-up, FlowPilot keeps
            convesrations, tasks, and files in one place — so nothing falls through the cracks.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              'Real-time activity feed for every project',
              'Role-based views for admins, leads, and contributors',
              'Workload visibility so no one burns out',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-base font-semibold text-ink">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-secondary/30">
                  <Zap className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border-2 border-ink bg-white p-8 shadow-brutal-lg"
        >
          <div className="flex space-x-12 mb-6">
            {avatars.map((src) => (
              <img key={src} src={src} alt="" className="h-12 w-12 rounded-full border-2 border-ink bg-yellow/30" />
            ))}
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-primary text-white text-xs font-bold">
              +8
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-ink bg-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold">Priya left a comment</span>
              </div>
              <p className="text-sm text-muted">&quot;API migration is ready for review — can someone from platform take a look?&quot;</p>
            </div>
            <div className="rounded-2xl border-2 border-ink bg-yellow/20">
              <p className="text-sm font-bold text-ink">Jordan moved &quot;Checkout redesign&quot; → Review</p>
              <p className="text-xs text-muted mt-1">Northwind Labs · 2 min ago</p>
            </div>
            <div className="rounded-2xl border-2 border-ink bg-secondary/15">
              <p className="text-sm font-bold text-ink">🎉 Mobile App v2 hit 85% completion</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
