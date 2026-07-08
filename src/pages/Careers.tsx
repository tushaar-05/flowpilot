import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, Lightbulb } from 'lucide-react';

const Careers: React.FC = () => {
  return (
    <main className="min-h-screen bg-white text-ink">
      <section className="border-b-2 border-ink px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em]">
            Careers
          </p>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
            Build the future with FlowPilot.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
            We are building smarter ways for teams to work, automate tasks,
            and turn ideas into action.
          </p>
        </div>
      </section>

      <section className="border-b-2 border-ink px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold">
            Why join us?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="border-2 border-ink p-7">
              <Zap size={36} />

              <h3 className="mt-6 text-2xl font-bold">
                Make an impact
              </h3>

              <p className="mt-3 text-gray-600">
                Build useful products that make everyday work simpler.
              </p>
            </div>

            <div className="border-2 border-ink p-7">
              <Lightbulb size={36} />

              <h3 className="mt-6 text-2xl font-bold">
                Explore ideas
              </h3>

              <p className="mt-3 text-gray-600">
                Experiment with AI, automation, and new ways of working.
              </p>
            </div>

            <div className="border-2 border-ink p-7">
              <Users size={36} />

              <h3 className="mt-6 text-2xl font-bold">
                Grow together
              </h3>

              <p className="mt-3 text-gray-600">
                Learn, collaborate, and build alongside a focused team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            No open positions right now.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-300">
            We are growing carefully. Check back later for future opportunities.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 border-2 border-white bg-white px-6 py-3 font-bold text-black"
          >
            Back to Home
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Careers;