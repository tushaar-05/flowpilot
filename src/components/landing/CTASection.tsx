import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';

export function CTASection() {
  return (
    <section className="py-24 px-6 border-t-2 border-ink">
      <div className="mx-auto max-w-4xl rounded-3xl border-2 border-ink bg-primary p-12 sm:p-16 text-center shadow-brutal-lg relative overflow-hidden">
        <div className="absolute top-4 right-8 h-40 w-40 rounded-2xl border-2 border-white/30 bg-yellow/80 rotate-12 z-20" />
        <div className="absolute bottom-6 left-10 h-40 w-40 rounded-full border-2 border-white/30 bg-pink/80 z-20" />

        <h2 className="text-4xl sm:text-5xl font-extrabold text-white relative z-10">
          Ready to ship with clarity?
        </h2>
        <p className="mt-4 text-lg text-white/80 max-w-lg mx-auto relative z-10">
          Join teams at Latticefield, Parcel OS, and Campfire Studio who ditched the spreadsheet chaos.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="yellow" size="lg">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to={ROUTES.REGISTER}>
            <Button variant="outline" size="lg" className="bg-white">
              View Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
