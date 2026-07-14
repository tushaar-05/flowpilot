import React from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { FolderKanban, CheckSquare, Calendar, BarChart3, Bell, Users, Zap } from 'lucide-react';

const FeaturesPage: React.FC = () => {
  const list = [
    {
      icon: FolderKanban,
      title: 'Kanban Boards',
      desc: 'Visualize your sprint deliverables in standard columns (To Do, In Progress, Review, Completed). Drag and drop cards seamlessly to manage workflow.',
      color: 'yellow' as const,
    },
    {
      icon: CheckSquare,
      title: 'Task Management',
      desc: 'Create tasks, assign priority ranks, add labels, track checklist subtasks, and set due dates to keep the engineering pipeline aligned.',
      color: 'blue' as const,
    },
    {
      icon: Calendar,
      title: 'Timeline Calendar',
      desc: 'Schedule milestones and task durations on a unified calendar grid. Avoid overlap and hit major launch timelines.',
      color: 'pink' as const,
    },
    {
      icon: BarChart3,
      title: 'Velocity Analytics',
      desc: 'Visualize completion trends, priority distribution, and project progress metrics via recharts graphs and analytics tables.',
      color: 'emerald' as const,
    },
    {
      icon: Bell,
      title: 'Activity Logs',
      desc: 'Keep track of project activity history and notifications. Audit who created, completed, or updated tasks in real time.',
      color: 'emerald' as const,
    },
    {
      icon: Users,
      title: 'Team Management',
      desc: 'Assign team members to specific tasks, manage team member profiles, and set roles (Admin, Member) in a centralized list.',
      color: 'yellow' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <main className="py-16 px-6 max-w-6xl mx-auto space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-ink border-2 border-ink px-3 py-1 bg-yellow/30 rounded-full">
            Product Tour
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
            Built for developers. designed for speed.
          </h1>
          <p className="text-base sm:text-lg text-muted font-semibold">
            All the project features your team needs, styled with a modern soft-brutalist theme and lightning-fast transitions.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to={ROUTES.REGISTER}>
              <Button size="md">Get Started Free</Button>
            </Link>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" size="md">Open Live Demo</Button>
            </Link>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {list.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} color={feat.color} padding="lg" hover className="flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-surface shadow-brutal-sm mb-5">
                    <Icon className="h-6 w-6 text-ink" />
                  </div>
                  <h3 className="text-xl font-extrabold text-ink mb-2">{feat.title}</h3>
                  <p className="text-sm font-semibold text-muted leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-ink/5 text-xs font-extrabold text-ink flex items-center gap-1.5 cursor-pointer hover:underline">
                  Learn more <Zap className="h-3.5 w-3.5 text-yellow" />
                </div>
              </Card>
            );
          })}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default FeaturesPage;
