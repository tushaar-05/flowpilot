import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';

const testimonials = [
  {
    quote: 'We replaced three tools with FlowPilot. Our sprint planning went from 2 hours to 40 minutes.',
    name: 'Maya Okonkwo',
    role: 'Head of Product, Latticefield',
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Maya',
  },
  {
    quote: 'Finally a PM tool that doesn\'t feel like it was designed for a Fortune 500 committee.',
    name: 'Leo Hartmann',
    role: 'CTO, Parcel OS',
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Leo',
  },
  {
    quote: 'The Kanban board alone saved our design-dev handoff. Everyone sees the same truth.',
    name: 'Sofia Reyes',
    role: 'Design Lead, Campfire Studio',
    avatar: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sofia',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-pink/10 border-t-2 border-ink">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-ink text-center mb-16">
          Teams that switched, stayed
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                color={i === 1 ? 'yellow' : 'white'}
                className={`h-full flex flex-col ${i === 1 ? 'border-transparent shadow-none' : i === 2 ? 'bg-transparent border-transparent shadow-none' : ''}`}
              >
                <p className="text-base text-ink leading-relaxed flex-1 font-medium truncate">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-6 pt-6 border-t-2 border-ink/10">
                  <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full border-2 border-ink" />
                  <div>
                    <p className="font-extrabold text-ink">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
