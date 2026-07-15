import { useMemo } from 'react';
import { startOfWeek, addDays, subDays, format, isSameDay, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  CheckSquare,
  Sparkles,
  ArrowUpRight,
  Clock,
  Flame,
  PartyPopper,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { formatRelative, getDueDateLabel, capitalize } from '@/utils/helpers';
import { ROUTES } from '@/constants';

export function DashboardPage() {
  const { projects, tasks, users, activity } = useApp();
  const { user } = useAuth();

  const { weekData, velocityComparison } = useMemo(() => {
    const now = new Date();
    const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const lastWeekStart = subDays(currentWeekStart, 7);

    let thisWeekDone = 0;
    let lastWeekDone = 0;

    tasks.forEach((t) => {
      if (t.status === 'completed' && t.updatedAt) {
        try {
          const updatedDate = parseISO(t.updatedAt);
          for (let i = 0; i < 7; i++) {
            if (isSameDay(updatedDate, addDays(lastWeekStart, i))) {
              lastWeekDone++;
              break;
            }
          }
        } catch {
          // ignore
        }
      }
    });

    const data = Array.from({ length: 7 }, (_, i) => {
      const targetDay = addDays(currentWeekStart, i);
      const dayLabel = format(targetDay, 'EEE');
      const dateLabel = format(targetDay, 'MMM d, yyyy');

      const done = tasks.filter((t) => {
        if (t.status !== 'completed' || !t.updatedAt) return false;
        try {
          return isSameDay(parseISO(t.updatedAt), targetDay);
        } catch {
          return false;
        }
      }).length;

      const dueOrCreated = tasks.filter((t) => {
        try {
          return (
            (t.dueDate && isSameDay(parseISO(t.dueDate), targetDay)) ||
            (t.createdAt && isSameDay(parseISO(t.createdAt), targetDay))
          );
        } catch {
          return false;
        }
      }).length;

      thisWeekDone += done;
      const total = Math.max(done, dueOrCreated + done);

      return {
        day: dayLabel,
        date: dateLabel,
        done,
        total,
      };
    });

    let diffText = '0% vs last week';
    let badgeColor: 'emerald' | 'orange' | 'blue' = 'blue';

    if (lastWeekDone === 0) {
      if (thisWeekDone > 0) {
        diffText = `+${thisWeekDone} done this week`;
        badgeColor = 'emerald';
      }
    } else {
      const pct = Math.round(((thisWeekDone - lastWeekDone) / lastWeekDone) * 100);
      if (pct > 0) {
        diffText = `+${pct}% vs last week`;
        badgeColor = 'emerald';
      } else if (pct < 0) {
        diffText = `${pct}% vs last week`;
        badgeColor = 'orange';
      } else {
        diffText = '0% vs last week';
        badgeColor = 'blue';
      }
    }

    return { weekData: data, velocityComparison: { diffText, badgeColor } };
  }, [tasks]);

  const openTasks = tasks.filter((t) => t.status !== 'completed').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const activeProjects = projects.filter((p) => p.status === 'active');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const recentTasks = useMemo(() =>
    [...tasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4),
    [tasks]
  );

  const urgentDeadlines = useMemo(() =>
    [...tasks]
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4),
    [tasks]
  );

  const topProject = [...activeProjects].sort((a, b) => b.progress - a.progress)[0];

  return (
    <div className="space-y-10">
      {/* Hero greeting */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border-2 border-ink bg-yellow/25 p-8 sm:p-10 shadow-brutal-lg"
      >
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full border-2 border-ink bg-pink/30" />
        <div className="absolute right-24 bottom-4 h-16 w-16 rounded-2xl border-2 border-ink bg-primary/30 rotate-12" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted mb-2">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-ink leading-tight">
              {greeting}, {user?.name?.split(' ')[0] ?? 'there'} 👋
            </h1>
            <p className="mt-3 text-lg text-muted max-w-xl">
              You have <strong className="text-ink">{openTasks} open tasks</strong> across{' '}
              <strong className="text-ink">{activeProjects.length} active projects</strong>. Let&apos;s make today count.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={ROUTES.TASKS}>
              <Button variant="dark" size="lg">
                <CheckSquare className="h-5 w-5" /> My Tasks
              </Button>
            </Link>
            <Link to={ROUTES.PROJECTS}>
              <Button variant="outline" size="lg">
                <FolderKanban className="h-5 w-5" /> Projects
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Stat bento grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[
          { label: 'Active Projects', value: activeProjects.length, icon: FolderKanban, bg: 'bg-primary/15', accent: 'text-primary' },
          { label: 'Open Tasks', value: openTasks, icon: CheckSquare, bg: 'bg-yellow/30', accent: 'text-ink' },
          { label: 'Completed', value: completedTasks, icon: PartyPopper, bg: 'bg-secondary/20', accent: 'text-secondary' },
          { label: 'Completion', value: completionRate, suffix: '%', icon: Sparkles, bg: 'bg-pink/20', accent: 'text-pink' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card padding="sm" className="h-full">
              <div className={`inline-flex rounded-xl border-2 border-ink p-2.5 ${stat.bg} shadow-brutal-sm mb-4`}>
                <stat.icon className={`h-5 w-5 ${stat.accent}`} />
              </div>
              <p className="text-sm font-bold text-muted uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-ink mt-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix ?? ''} />
              </p>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Main content grid */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Chart */}
        <Card className="xl:col-span-7" padding="lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <CardTitle>Weekly Velocity</CardTitle>
              <p className="text-sm text-muted mt-1 font-medium">Tasks completed vs planned this week</p>
            </div>
            <Badge color={velocityComparison.badgeColor}>{velocityComparison.diffText}</Badge>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 16, border: '2px solid #111827', fontWeight: 700 }}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.date ? `${label} (${item.date})` : label;
                }}
              />
              <Area type="monotone" dataKey="done" stroke="#3B82F6" strokeWidth={3} fill="url(#colorDone)" />
              <Area type="monotone" dataKey="total" stroke="#F97316" strokeWidth={2} strokeDasharray="6 4" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Spotlight project */}
        <Card className="xl:col-span-5" color="blue" padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-accent" />
            <span className="text-sm font-extrabold uppercase tracking-wider text-ink">Spotlight</span>
          </div>
          {topProject ? (
            <>
              <h3 className="text-2xl font-extrabold text-ink">{topProject.name}</h3>
              <p className="text-sm text-muted mt-2 line-clamp-2">{topProject.description}</p>
              <div className="mt-6">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Progress</span>
                  <span className="text-primary">{topProject.progress}%</span>
                </div>
                <div className="h-4 rounded-full border-2 border-ink bg-surface overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topProject.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
              <Link to={`/projects/${topProject.id}`} className="inline-flex items-center gap-1 mt-6 text-sm font-extrabold text-primary hover:underline">
                View project <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <p className="text-muted">No active projects yet.</p>
          )}
        </Card>
      </section>

      {/* Tasks + Activity row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <CardTitle>Recently Updated</CardTitle>
            <Link to={ROUTES.TASKS} className="text-sm font-extrabold text-primary hover:underline flex items-center gap-1">
              See all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task) => {
              const assignee = users.find((u) => u.id === task.assigneeId);
              const project = projects.find((p) => p.id === task.projectId);
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 border-ink/15 bg-background hover:border-ink hover:shadow-brutal-sm transition-all"
                >
                  <Avatar src={assignee?.avatar} name={assignee?.name ?? '?'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink truncate">{task.title}</p>
                    <p className="text-xs font-semibold text-muted">{project?.name} · {formatRelative(task.updatedAt)}</p>
                  </div>
                  <Badge color={task.priority === 'urgent' ? 'pink' : 'blue'}>{capitalize(task.status)}</Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="lg" color="yellow">
          <div className="flex items-center justify-between mb-6">
            <CardTitle>Due Soon</CardTitle>
            <Link to={ROUTES.CALENDAR} className="text-sm font-extrabold text-primary hover:underline flex items-center gap-1">
              Calendar <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {urgentDeadlines.map((task) => {
              const due = getDueDateLabel(task.dueDate);
              return (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl border-2 border-ink bg-surface shadow-brutal-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-accent/20">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink truncate">{task.title}</p>
                    <p className={`text-sm font-bold ${due.className}`}>{due.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Activity strip */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <CardTitle>Team Pulse</CardTitle>
          <Link to={ROUTES.ACTIVITY} className="text-sm font-extrabold text-primary hover:underline">
            Full timeline →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activity.slice(0, 6).map((item) => {
            const member = users.find((u) => u.id === item.userId);
            return (
              <div key={item.id} className="flex gap-3 p-3 rounded-2xl border-2 border-ink/10">
                <Avatar src={member?.avatar} name={member?.name ?? '?'} size="sm" />
                <p className="text-sm leading-snug">
                  <span className="font-extrabold">{member?.name?.split(' ')[0]}</span>{' '}
                  <span className="text-muted">{item.action}</span>{' '}
                  <span className="font-bold text-primary">{item.target}</span>
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
