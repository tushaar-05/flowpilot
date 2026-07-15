import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, Users } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Tooltip } from '@/components/ui/Tooltip';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/cn';

export function TeamPage() {
  const { users, projects, tasks } = useApp();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // If the URL has a highlight param, scroll to that member and highlight them
  useEffect(() => {
    const target = searchParams.get('highlight');
    if (!target) return;

    setHighlightedId(target);
    requestAnimationFrame(() => {
      document.getElementById(`team-member-${target}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Strip the param so refreshing or sharing the URL doesn't re-trigger it
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('highlight');
        return next;
      },
      { replace: true }
    );

    const timeout = setTimeout(() => setHighlightedId(null), 2500);
    return () => clearTimeout(timeout);
  }, [searchParams, setSearchParams]);

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getWorkload = (userId: string) => {
    const userTasks = tasks.filter((t) => t.assigneeId === userId && t.status !== 'completed');
    return userTasks.length;
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[{ label: 'Team Members' }]} />
        <h1 className="text-2xl font-bold mt-2">Team Members</h1>
        <p className="text-muted text-sm mt-1">{users.length} members across the organization</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search members..." className="flex-1" />
        <FilterDropdown
          label="Role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: 'all', label: 'All Roles' },
            { value: 'admin', label: 'Admin' },
            { value: 'manager', label: 'Manager' },
            { value: 'member', label: 'Member' },
            { value: 'viewer', label: 'Viewer' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((member) => {
          const memberProjects = projects.filter((p) => member.projectIds.includes(p.id));
          const workload = getWorkload(member.id);
          const isHighlighted = member.id === highlightedId;

          return (
            <Card
              key={member.id}
              id={`team-member-${member.id}`}
              hover
              className={cn('scroll-mt-24 transition-all duration-500', isHighlighted && 'ring-4 ring-primary ring-offset-2')}
            >
              <div className="flex items-start gap-4">
                <Tooltip content={member.role} position="left">
                  <div className="shrink-0">
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size="lg"
                      className="ring-2 ring-white !h-[4.5rem] !w-[4.5rem] text-lg"
                    />
                  </div>
                </Tooltip>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{member.name}</h3>
                  <Badge className="mt-1 bg-slate-100 text-slate-600 capitalize">{member.role}</Badge>
                  <p className="text-sm text-muted mt-2">{member.department}</p>
                </div>
              </div>

              <p className="text-sm text-muted mt-4 line-clamp-2">{member.bio}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {memberProjects.length} projects
                  </span>
                  <span className={`font-medium ${workload > 5 ? 'text-danger' : workload > 3 ? 'text-amber-600' : 'text-secondary'}`}>
                    {workload} active tasks
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {member.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
