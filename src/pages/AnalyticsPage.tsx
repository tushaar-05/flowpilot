import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useApp } from '@/context/AppContext';
import { capitalize } from '@/utils/helpers';

export function AnalyticsPage() {
  const { projects, tasks, loading } = useApp();

  const completionTrend = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    return months.map((month, i) => ({
      month,
      completed: Math.floor(tasks.filter((t) => t.status === 'completed').length * (i + 1) / 7),
      created: Math.floor(tasks.length * (i + 1) / 7),
    }));
  }, [tasks]);

  const projectAnalytics = useMemo(() =>
    projects.map((p) => ({
      name: p.name.length > 15 ? `${p.name.slice(0, 15)}...` : p.name,
      progress: p.progress,
      tasks: tasks.filter((t) => t.projectId === p.id).length,
    })),
    [projects, tasks]
  );

  const priorityBreakdown = useMemo(() => {
    const counts: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
    tasks.forEach((t) => { counts[t.priority]++; });
    return Object.entries(counts).map(([name, count]) => ({
      priority: capitalize(name),
      count,
    }));
  }, [tasks]);

  if (loading) {
    return (
      <div className="h-64">
        <Spinner size="lg" className="mt-20 ml-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[{ label: 'Analytics' }]} />
        <h1 className="text-2xl font-bold mt-2">Analytics</h1>
        <p className="text-muted text-sm mt-1">Insights and metrics across your workspace</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-muted">Total Tasks</p>
          <p className="text-3xl font-bold mt-1">{tasks.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Completion Rate</p>
          <p className="text-3xl font-bold mt-1 text-secondary">
          {tasks.length === 0
          ? 0
            : Math.round(
          (tasks.filter((t) => t.status === 'completed').length / tasks.length) * 100
          )}%
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Active Projects</p>
          <p className="text-3xl font-bold mt-1 text-primary">
            {projects.filter((p) => p.status === 'active').length}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-4">Task Completion Trend</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="created" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle className="mb-4">Priority Distribution</CardTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardTitle className="mb-4">Project Performance</CardTitle>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={projectAnalytics} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" fill="#3B82F6" name="Progress %" radius={[0, 4, 4, 0]} />
            <Bar dataKey="tasks" fill="#8B5CF6" name="Tasks" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
