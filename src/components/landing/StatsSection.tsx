import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const stats = [
  { value: 2400, suffix: '+', label: 'Teams onboarded' },
  { value: 98, suffix: '%', label: 'Would recommend' },
  { value: 47, suffix: 'k', label: 'Tasks completed' },
  { value: 12, suffix: 'min', label: 'Avg. setup time' },
];

export function StatsSection() {
  return (
    <section className="py-20 px-6 border-t-2 border-ink bg-ink text-white">
      <div className="mx-auto max-w-6xl flex flex-row overflow-visible gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center min-w-[200px]">
            <p className="text-4xl sm:text-5xl font-extrabold text-white">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm font-bold text-white/90 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
