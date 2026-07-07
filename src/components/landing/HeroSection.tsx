import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square">
      <motion.div
        initial={{ opacity: 0, rotate: -8 }}
        animate={{ opacity: 1, rotate: -6 }}
        transition={{ delay: 0.3 }}
        className="absolute top-8 left-4 h-28 w-44 rounded-3xl border-2 border-ink bg-yellow shadow-brutal"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute top-24 right-0 h-36 w-52 rounded-3xl border-2 border-ink bg-white shadow-brutal-lg p-4"
      >
        <div className="h-3 w-20 rounded-full bg-ink/10 mb-3" />
        <div className="space-y-2">
          <div className="h-2.5 w-full rounded-full bg-primary/30" />
          <div className="h-2.5 w-4/5 rounded-full bg-secondary/30" />
          <div className="h-2.5 w-3/5 rounded-full bg-pink/30" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-8 w-8 rounded-xl border-2 border-ink bg-primary/20" />
          <div className="h-8 w-8 rounded-xl border-2 border-ink bg-accent/20" />
          <div className="h-8 w-8 rounded-xl border-2 border-ink bg-purple/20" />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-16 left-12 h-24 w-24 rounded-full border-2 border-ink bg-pink/40 shadow-brutal"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-8 right-16 h-20 w-32 rounded-2xl border-2 border-ink bg-primary shadow-brutal flex items-center justify-center"
      >
        <span className="text-white font-extrabold text-sm">78% done</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute top-4 right-20 h-14 w-14 rounded-2xl border-2 border-ink bg-secondary/50 shadow-brutal-sm"
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 px-6">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-yellow/30 px-4 py-1.5 text-sm font-bold text-ink mb-6 shadow-brutal-sm">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            Now in public beta — 2,400+ teams
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] tracking-tight">
            Manage Projects.<br />
            <span className="text-primary">Collaborate Better.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-lg">
            FlowPilot helps startup teams plan work, track progress, and ship on time —
            without the bloat of enterprise tools or the chaos of spreadsheets.
          </p>

          <div className="mt-10 flex flex-col-reverse sm:flex-row gap-4">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" className="w-full sm:w-auto">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="outline" size="lg" className="w-full text-gray-200 sm:w-auto">
                <Play className="h-5 w-5" /> View Demo
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm font-semibold text-muted">
            Free for teams up to 10 · No credit card required
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <HeroIllustration />
        </motion.div>
      </div>
    </section>
  );
}
