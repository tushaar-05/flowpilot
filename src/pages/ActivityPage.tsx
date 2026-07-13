import { useMemo } from 'react';
import {
  CheckSquare,
  FolderKanban,
  MessageSquare,
  FileText,
  Users,
  Settings,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { useApp } from '@/context/AppContext';
import { formatRelative } from '@/utils/helpers';
import type { ActivityType } from '@/types';
import { useState } from 'react';

const typeIcons: Record<ActivityType, typeof CheckSquare> = {
  task: CheckSquare,
  project: FolderKanban,
  comment: MessageSquare,
  file: FileText,
  team: Users,
  system: Settings,
};

const typeColors: Record<ActivityType, string> = {
  task: 'bg-blue-50 text-blue-600',
  project: 'bg-purple-50 text-purple-600',
  comment: 'bg-emerald-50 text-emerald-600',
  file: 'bg-amber-50 text-amber-600',
  team: 'bg-cyan-50 text-cyan-600',
  system: 'bg-slate-50 text-slate-600',
};

export function ActivityPage() {
  const { activity, users } = useApp();
  const [typeFilter, setTypeFilter] = useState('all');

  const sorted = useMemo(() => {
    let items = [...activity];
    if (typeFilter !== 'all') {
      items = items.filter((a) => a.type === typeFilter);
    }
    return items.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [activity, typeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Activity Timeline' }]} />
          <h1 className="text-2xl font-bold mt-2">Activity Timeline</h1>
          <p className="text-muted text-sm mt-1">Track all actions across your workspace</p>
        </div>
        <FilterDropdown
          label="Type"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'task', label: 'Tasks' },
            { value: 'project', label: 'Projects' },
            { value: 'comment', label: 'Comments' },
            { value: 'file', label: 'Files' },
            { value: 'team', label: 'Team' },
            { value: 'system', label: 'System' },
          ]}
        />
      </div>

      <Card padding="lg" className="p-4 sm:p-8 overflow-hidden">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {sorted.map((item) => {
              const user = users.find((u) => u.id === item.userId);
              const Icon = typeIcons[item.type];

              return (
                <div key={item.id} className="relative flex gap-3 sm:gap-4 pl-10 sm:pl-12 min-w-0">
                  <div className={`absolute left-2.5 flex h-6 w-6 items-center justify-center rounded-full ${typeColors[item.type]}`}>
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0 rounded-lg border border-border p-3 sm:p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <Avatar src={user?.avatar} name={user?.name ?? '?'} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm break-words">
                            <span className="font-medium">{user?.name}</span>{' '}
                            <span className="text-muted">{item.action}</span>{' '}
                            <span className="font-medium text-primary">{item.target}</span>
                          </p>
                          <p className="text-xs text-muted mt-1 capitalize">{item.type} activity</p>
                        </div>
                      </div>
                      <time className="text-xs text-muted whitespace-nowrap shrink-0">
                        {formatRelative(item.createdAt)}
                      </time>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
