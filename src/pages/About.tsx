import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Heart,
  Lightbulb,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/constants';

const values = [
  {
    icon: Zap,
    title: 'Move with speed',
    description:
      'We believe great teams should spend less time managing work and more time actually shipping it.',
  },
  {
    icon: Eye,
    title: 'Clarity first',
    description:
      'Work should be easy to understand. Everyone should know what matters, what is next, and who owns it.',
  },
  {
    icon: Users,
    title: 'Built for teams',
    description:
      'The best work happens together. FlowPilot helps teams stay connected without unnecessary complexity.',
  },
  {
    icon: Heart,
    title: 'Care about craft',
    description:
      'We pay attention to the details that make products simpler, faster, and genuinely enjoyable to use.',
  },
];

const principles = [
  'Keep project work clear and visible',
  'Reduce unnecessary meetings and status updates',
  'Help teams focus on meaningful progress',
  'Make powerful tools simple to use',
];

export default function About() {
  return (
    <main className="min-h-screen bg-white text-ink">
      {/* Hero */}
      <section className="relative overflow-hidden border-b-2 border-ink px-6 py-20 md:py-28">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/10" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-primary/10" />

        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-primary/10 px-4 py-2 text-sm font-extrabold shadow-brutal-sm">
            <Zap className="h-4 w-4" />
            ABOUT FLOWPILOT
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            Less managing.
            <br />
            More <span className="text-primary">shipping.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-muted md:text-xl">
            FlowPilot is project management for teams that value speed,
            clarity, and getting meaningful work across the finish line.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-primary px-6 py-3 font-extrabold text-white shadow-brutal-sm transition-transform hover:-translate-y-1"
            >
              Get started
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to={ROUTES.LANDING}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-white px-6 py-3 font-extrabold shadow-brutal-sm transition-transform hover:-translate-y-1"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b-2 border-ink px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
              Our mission
            </p>

            <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Make teamwork feel lighter.
            </h2>

            <p className="mt-6 text-lg font-medium leading-relaxed text-muted">
              Teams should not need complicated systems just to understand
              what is happening. FlowPilot brings projects, tasks, files,
              activity, and team collaboration into one clear workspace.
            </p>

            <p className="mt-4 text-lg font-medium leading-relaxed text-muted">
              Our goal is simple: remove friction from project management so
              teams can focus on building, creating, and delivering.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-ink bg-primary/10 p-6 shadow-brutal">
            <div className="rounded-xl border-2 border-ink bg-white p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-ink bg-primary shadow-brutal-sm">
                <Target className="h-7 w-7 text-white" />
              </div>

              <h3 className="mt-6 text-2xl font-extrabold">
                One clear direction
              </h3>

              <p className="mt-3 font-medium leading-relaxed text-muted">
                Keep goals visible, priorities clear, and progress easy to
                understand across the whole team.
              </p>

              <div className="mt-6 space-y-3">
                {principles.map((principle) => (
                  <div
                    key={principle}
                    className="flex items-start gap-3 font-semibold"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{principle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b-2 border-ink bg-primary/5 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
              What we believe
            </p>

            <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">
              Simple principles.
              <br />
              Better work.
            </h2>

            <p className="mt-5 text-lg font-medium leading-relaxed text-muted">
              These ideas guide how we think about teamwork and how we build
              FlowPilot.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.title}
                  className="rounded-2xl border-2 border-ink bg-white p-7 shadow-brutal-sm transition-transform hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <h3 className="mt-6 text-2xl font-extrabold">
                    {value.title}
                  </h3>

                  <p className="mt-3 font-medium leading-relaxed text-muted">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-b-2 border-ink px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border-2 border-ink bg-ink p-8 text-white shadow-brutal md:p-14">
            <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-primary">
                  <Lightbulb className="h-7 w-7" />
                </div>

                <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.2em] text-white/70">
                  Why we exist
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
                  Project management should help work move forward.
                </h2>

                <p className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-white/70">
                  Too many tools create more work instead of reducing it.
                  FlowPilot is built around a different idea: project
                  management should give teams clarity without slowing them
                  down.
                </p>

                <p className="mt-4 max-w-3xl text-lg font-medium leading-relaxed text-white/70">
                  That means fewer confusing workflows, clearer ownership, and
                  a workspace where progress is easy to see.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border-2 border-ink bg-primary/10 p-8 text-center shadow-brutal md:p-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border-2 border-ink bg-primary shadow-brutal-sm">
              <Zap className="h-7 w-7 text-white" />
            </div>

            <h2 className="mt-7 text-4xl font-extrabold md:text-5xl">
              Ready to move work forward?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg font-medium text-muted">
              Bring your projects, tasks, and team together in one clear
              workspace.
            </p>

            <Link
              to={ROUTES.REGISTER}
              className="mt-8 inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-primary px-6 py-3 font-extrabold text-white shadow-brutal-sm transition-transform hover:-translate-y-1"
            >
              Start with FlowPilot
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
