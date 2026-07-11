import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  KanbanSquare,
  Lightbulb,
  Rocket,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/constants';

type Article = {
  id: number;
  category: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  content: string[];
  icon: React.ElementType;
};

const articles: Article[] = [
  {
    id: 1,
    icon: Rocket,
    category: 'PRODUCTIVITY',
    title: 'Why great teams spend less time managing work',
    description:
      'Project management should create clarity, not more work. Here are practical ways teams can reduce unnecessary process and focus on meaningful progress.',
    date: 'July 8, 2026',
    readTime: '6 min read',
    content: [
      'Great teams do not spend their entire day updating boards, attending status meetings, or searching for information. Their systems make progress visible without creating extra work.',
      'A useful project management system should answer simple questions quickly: What are we working on? Who owns it? What is blocked? What should happen next?',
      'The goal is not to remove planning. The goal is to keep planning useful. Clear priorities, visible ownership, and short feedback loops help teams spend more time creating and less time managing the process.',
      'FlowPilot is built around this idea: project management should support the work, not become the work.',
    ],
  },
  {
    id: 2,
    icon: KanbanSquare,
    category: 'WORKFLOW',
    title: 'How to build a workflow your team will actually use',
    description:
      'A practical guide to creating clear workflows without adding unnecessary complexity.',
    date: 'July 5, 2026',
    readTime: '5 min read',
    content: [
      'The best workflow is not the most complicated one. It is the one your team can understand and use consistently.',
      'Start with the real stages that work moves through. For many teams, a simple structure such as To Do, In Progress, Review, and Done is enough.',
      'Every task should have a clear owner and a useful description. When responsibility is visible, teams spend less time asking who is handling something.',
      'Review the workflow regularly. If a stage is never used or creates confusion, simplify it.',
    ],
  },
  {
    id: 3,
    icon: Users,
    category: 'TEAMWORK',
    title: 'Better collaboration starts with clearer ownership',
    description:
      'Learn how clear responsibilities can reduce confusion and help projects move faster.',
    date: 'July 2, 2026',
    readTime: '4 min read',
    content: [
      'Collaboration becomes difficult when nobody knows who is responsible for the next step.',
      'Clear ownership does not mean people work alone. It means every important task has someone responsible for moving it forward.',
      'Teams can improve collaboration by making owners, deadlines, and current status visible in one shared workspace.',
      'When everyone can see who owns what, communication becomes more focused and projects move with less confusion.',
    ],
  },
  {
    id: 4,
    icon: BarChart3,
    category: 'PRODUCTIVITY',
    title: 'Track progress without creating more meetings',
    description:
      'Simple ways to keep everyone informed while protecting your team’s focus time.',
    date: 'June 28, 2026',
    readTime: '7 min read',
    content: [
      'Meetings are useful when discussion and decisions are needed. They are less useful when their only purpose is collecting status updates.',
      'A shared project workspace can make progress visible asynchronously. Team members can update tasks, blockers, and completed work as they go.',
      'Short written updates and visible dashboards allow meetings to focus on decisions rather than information gathering.',
      'The result is more focus time for the team while everyone still understands how the project is progressing.',
    ],
  },
  {
    id: 5,
    icon: Rocket,
    category: 'SHIPPING',
    title: 'From idea to shipped: keeping momentum alive',
    description:
      'Practical principles for helping projects move from planning to delivery.',
    date: 'June 24, 2026',
    readTime: '5 min read',
    content: [
      'Projects often lose momentum when the next action is unclear or the plan becomes too large.',
      'Break ambitious goals into smaller deliverables. Each completed milestone should create visible progress and useful feedback.',
      'Keep priorities limited and make blockers visible early. A team that knows what matters now can make better decisions.',
      'Momentum grows when progress is visible, feedback is frequent, and the next step is clear.',
    ],
  },
  {
    id: 6,
    icon: Lightbulb,
    category: 'PLANNING',
    title: 'Simple planning is usually better planning',
    description:
      'Why smaller plans, clear priorities, and visible progress can outperform complex systems.',
    date: 'June 20, 2026',
    readTime: '6 min read',
    content: [
      'Planning should provide direction without pretending that every future detail is already known.',
      'Start with a clear outcome, identify the most important milestones, and decide what the team needs to do next.',
      'As new information appears, update the plan. A useful plan changes with reality instead of becoming outdated documentation.',
      'Simple planning makes priorities easier to understand and gives teams room to adapt.',
    ],
  },
  {
    id: 7,
    icon: CheckCircle2,
    category: 'TASKS',
    title: 'The hidden cost of unclear tasks',
    description:
      'Small improvements to task clarity can save teams hours of confusion and rework.',
    date: 'June 16, 2026',
    readTime: '4 min read',
    content: [
      'A vague task may look small, but it often creates questions, delays, and unnecessary rework.',
      'A useful task explains the expected outcome, gives enough context, and has a clear owner.',
      'When needed, add acceptance criteria so everyone shares the same understanding of what completion means.',
      'Clear tasks reduce back-and-forth communication and help people begin useful work faster.',
    ],
  },
];

export default function Blog() {
  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  const featuredPost = articles[0];
  const posts = articles.slice(1);

  return (
    <main className="min-h-screen bg-white text-ink">
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-ink px-6 py-20 md:py-28">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10" />
        <div className="absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-primary/10" />

        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-primary/10 px-4 py-2 text-sm font-extrabold shadow-brutal-sm">
            <Sparkles className="h-4 w-4" />
            FLOWPILOT BLOG
          </div>

          <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            Ideas for teams that
            <br />
            want to <span className="text-primary">move faster.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-muted md:text-xl">
            Practical ideas about project management, teamwork, productivity,
            and building a healthier way to get meaningful work done.
          </p>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      <section className="border-b-2 border-ink px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-6 text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
            Featured story
          </p>

          <article className="overflow-hidden rounded-2xl border-2 border-ink bg-primary/10 shadow-brutal-sm">
            <div className="grid md:grid-cols-2">
              <div className="flex min-h-[320px] items-center justify-center border-b-2 border-ink p-10 md:border-b-0 md:border-r-2">
                <div className="flex h-40 w-40 items-center justify-center rounded-3xl border-2 border-ink bg-primary shadow-brutal-sm">
                  <Rocket className="h-20 w-20 text-white" />
                </div>
              </div>

              <div className="flex flex-col justify-center bg-white p-8 md:p-12">
                <span className="text-sm font-extrabold tracking-[0.15em] text-primary">
                  {featuredPost.category}
                </span>

                <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
                  {featuredPost.title}
                </h2>

                <p className="mt-5 font-medium leading-relaxed text-muted">
                  {featuredPost.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-muted">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {featuredPost.date}
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(featuredPost)}
                  className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl border-2 border-ink bg-primary px-5 py-3 font-extrabold text-white shadow-brutal-sm transition-transform hover:-translate-y-1"
                >
                  Read article
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="border-b-2 border-ink bg-primary/5 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-primary">
            Latest articles
          </p>

          <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">
            Learn. Improve. Ship.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const Icon = post.icon;

              return (
                <article
                  key={post.id}
                  className="group flex flex-col rounded-2xl border-2 border-ink bg-white p-6 shadow-brutal-sm transition-transform hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <p className="mt-6 text-xs font-extrabold tracking-[0.15em] text-primary">
                    {post.category}
                  </p>

                  <h3 className="mt-3 text-2xl font-extrabold leading-tight">
                    {post.title}
                  </h3>

                  <p className="mt-4 flex-1 font-medium leading-relaxed text-muted">
                    {post.description}
                  </p>

                  <div className="mt-6 flex gap-3 text-xs font-semibold text-muted">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedArticle(post)}
                    className="mt-6 inline-flex items-center gap-2 self-start font-extrabold"
                  >
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-2xl border-2 border-ink bg-ink p-8 text-white shadow-brutal-sm md:p-14">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-primary">
                <Zap className="h-6 w-6" />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold md:text-5xl">
                Better work, delivered.
              </h2>

              <p className="mt-4 max-w-xl text-lg font-medium text-white/70">
                Practical ideas about productivity, teamwork, and shipping
                meaningful work.
              </p>
            </div>

            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white bg-white px-6 py-3 font-extrabold text-ink"
            >
              Try FlowPilot
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <article
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-title"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border-2 border-ink bg-white p-6 shadow-brutal-sm md:p-10"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-extrabold tracking-[0.15em] text-primary">
                  {selectedArticle.category}
                </p>

                <h2
                  id="article-title"
                  className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl"
                >
                  {selectedArticle.title}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close article"
                onClick={() => setSelectedArticle(null)}
                className="shrink-0 rounded-xl border-2 border-ink p-2 transition-colors hover:bg-ink hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 border-b-2 border-ink/10 pb-6 text-sm font-semibold text-muted">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {selectedArticle.date}
              </span>

              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {selectedArticle.readTime}
              </span>
            </div>

            <p className="mt-7 text-xl font-semibold leading-relaxed">
              {selectedArticle.description}
            </p>

            <div className="mt-7 space-y-5">
              {selectedArticle.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg font-medium leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 rounded-xl border-2 border-ink bg-primary/10 p-5">
              <p className="font-extrabold">
                Ready to help your team move faster?
              </p>

              <Link
                to={ROUTES.REGISTER}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border-2 border-ink bg-primary px-5 py-3 font-extrabold text-white shadow-brutal-sm"
              >
                Try FlowPilot
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}