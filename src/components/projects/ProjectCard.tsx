import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import type { Project } from '@/types';
import { Link } from 'react-router-dom';
import { MoreHorizontal, Users } from 'lucide-react';
import { getPriorityColor, capitalize, getProjectDeadlineBadge } from '@/utils/helpers';
import { Dropdown } from '@/components/ui/Dropdown';
import { useApp } from '@/context/AppContext';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { users } = useApp();
  const members = users.filter((u) => project.memberIds.includes(u.id));

  return (
    <Card hover className="group relative">
      <div className="flex items-start justify-between mb-4">
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: project.color }}
        >
          {project.name.charAt(0)}
        </div>
        <Dropdown
          trigger={
            <button className="rounded-lg p-1.5 text-muted opacity-0 group-hover:opacity-100 hover:bg-slate-100 transition-all">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
          align="right"
          items={[
            { label: 'Edit', onClick: () => onEdit(project) },
            { label: 'Delete', onClick: () => onDelete(project.id), danger: true },
          ]}
        />
      </div>

      <Link to={`/projects/${project.id}`}>
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
          {project.name}
        </h3>
        <p className="text-sm text-muted line-clamp-2 mb-4">{project.description}</p>
      </Link>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Badge className={getPriorityColor(project.priority)}>
          {capitalize(project.priority)}
        </Badge>
        <Badge className="bg-slate-100 text-slate-600">
          {capitalize(project.status)}
        </Badge>
        {(() => {
          const deadlineBadge = getProjectDeadlineBadge(project.endDate, project.status);
          if (deadlineBadge) {
            return (
              <Badge color={deadlineBadge.color}>
                <span className="mr-1">{deadlineBadge.icon}</span>
                {deadlineBadge.label}
              </Badge>
            );
          }
          return null;
        })()}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted mb-1.5">
          <span>Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((member) => (
            <Avatar key={member.id} src={member.avatar} name={member.name} size="sm" />
          ))}
          {members.length > 3 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-muted border-2 border-white">
              +{members.length - 3}
            </div>
          )}
        </div>
        <span className="flex items-center gap-1 text-xs text-muted">
          <Users className="h-3.5 w-3.5" />
          {members.length}
        </span>
      </div>
    </Card>
  );
}
