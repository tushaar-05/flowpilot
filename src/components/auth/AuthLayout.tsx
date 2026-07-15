import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r-2 border-ink relative overflow-hidden">
        <Link to={ROUTES.LANDING} className="flex items-center gap-3 z-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink bg-primary shadow-brutal">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-ink">FlowPilot</span>
        </Link>

        <div className="z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xl:text-5xl font-extrabold text-ink leading-tight"
          >
            Where teams ship<br />
            <span className="text-primary">without the chaos.</span>
          </motion.h1>
          <p className="mt-6 text-lg text-muted max-w-md leading-relaxed">
            Join 2,400+ startup teams using FlowPilot to plan sprints, track deliverables, and actually hit deadlines.
          </p>
        </div>

        <div className="z-10 flex gap-3">
          {['#3B82F6', '#F97316', '#FACC15', '#10B981', '#EC4899'].map((c) => (
            <div key={c} className="h-3 w-3 rounded-full border-2 border-ink" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-20 right-12 h-32 w-32 rounded-3xl border-2 border-ink bg-yellow/40 shadow-brutal rotate-12" />
        <div className="absolute bottom-32 right-24 h-24 w-24 rounded-full border-2 border-ink bg-pink/30 shadow-brutal" />
        <div className="absolute top-1/2 left-8 h-16 w-40 rounded-2xl border-2 border-ink bg-primary/20 shadow-brutal -rotate-6" />
      </div>

      <div className="flex-1 flex flex-col justify-start px-6 py-12 sm:px-12">
        <div className="lg:hidden mb-8">
          <Link to={ROUTES.LANDING} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-primary shadow-brutal-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold">FlowPilot</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <h2 className="text-3xl font-extrabold text-ink">{title}</h2>
          <p className="mt-2 text-base text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
