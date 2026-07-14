import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft, Calendar, Users, Tag } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { formatDate, getPriorityColor, getStatusColor, capitalize } from '@/utils/helpers';
import { ROUTES } from '@/constants';
import type { Task } from '@/types';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, tasks, users } = useApp();

  const project = projects.find((p) => p.id === id);
  const projectTasks = useMemo(() => tasks.filter((t) => t.projectId === id), [tasks, id]);
  const members = useMemo(
    () => users.filter((u) => project?.memberIds.includes(u.id)),
    [users, project]
  );

  if (!project) {
    return (
      <EmptyState
        icon={<ArrowLeft className="h-8 w-8" />}
        title="Project not found"
        description="The project you're looking for doesn't exist or has been removed."
        action={<Link to={ROUTES.PROJECTS} className="text-primary hover:underline">Back to Projects</Link>}
      />
    );
  }

  const columns = [
    {
      key: 'title',
      header: 'Task',
      render: (task: Task) => (
        <div>
          <p className="font-medium">{task.title}</p>
          <p className="text-xs text-muted truncate max-w-xs">{task.description}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (task: Task) => (
        <Badge className={getStatusColor(task.status)}>{capitalize(task.status)}</Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (task: Task) => (
        <Badge className={getPriorityColor(task.priority)}>{capitalize(task.priority)}</Badge>
      ),
    },
    {
      key: 'assignee',
      header: 'Assignee',
      render: (task: Task) => {
        const user = users.find((u) => u.id === task.assigneeId);
        return user ? (
          <div className="flex items-center gap-2">
            <Avatar src={user.avatar} name={user.name} size="xs" />
            <span className="text-sm">{user.name}</span>
          </div>
        ) : null;
      },
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (task: Task) => <span className="text-sm text-muted">{formatDate(task.dueDate)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[
          { label: 'Projects', href: ROUTES.PROJECTS },
          { label: project.name },
        ]} />
        <div className="flex items-start gap-4 mt-4">
          <div
            className="h-14 w-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
            style={{ backgroundColor: project.color }}
          >
            {project.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted mt-1">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className={getStatusColor(project.status)}>{capitalize(project.status)}</Badge>
              <Badge className={getPriorityColor(project.priority)}>{capitalize(project.priority)}</Badge>
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  <Tag className="h-3 w-3" /> {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Calendar className="h-5 w-5 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-sm text-muted">Timeline</p>
              <p className="text-sm font-medium">{formatDate(project.startDate)} — {formatDate(project.endDate)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-secondary/10 p-2.5">
              <Users className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted">Team</p>
              <p className="text-sm font-medium">{members.length} members</p>
            </div>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-muted mb-2">Progress</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
            </div>
            <span className="text-sm font-bold">{project.progress}%</span>
          </div>
        </Card>
      </div>

      <Card padding="none">
        <div className="p-6 border-b border-border">
          <CardTitle>Team Members</CardTitle>
          <div className="flex flex-wrap gap-4 mt-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar src={member.avatar} name={member.name} size="md" />
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted capitalize">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6">
          <CardTitle className="mb-4">Tasks ({projectTasks.length})</CardTitle>
          {projectTasks.length > 0 ? (
            <DataTable columns={columns} data={projectTasks} />
          ) : (
            <p className="text-sm text-muted text-center py-8">No tasks assigned to this project yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
