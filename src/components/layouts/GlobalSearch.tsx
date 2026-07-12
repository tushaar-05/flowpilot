import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, FolderKanban, CheckSquare, Users, FileText } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Badge } from '@/components/ui/Badge';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { getStatusColor, getPriorityColor, capitalize } from '@/utils/helpers';
import { ROUTES } from '@/constants';

export function GlobalSearch() {
  const navigate = useNavigate();
  const { query, setQuery, debouncedQuery, results, hasQuery, hasResults } = useGlobalSearch();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
// Close the search results dropdown if the user clicks outside of it
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const closeAndReset = () => {
    setOpen(false);
    setQuery('');
  };

  const goTo = (path: string) => {
    navigate(path);
    closeAndReset();
  };
// Go to the first result if the user presses Enter, or close the dropdown if they press Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const first =
        results.pages[0]?.route ??
        (results.projects[0] && `/projects/${results.projects[0].id}`) ??
        (results.tasks[0] && `${ROUTES.TASKS}?taskId=${results.tasks[0].id}`) ??
        (results.team[0] && `${ROUTES.TEAM}?highlight=${results.team[0].id}`) ??
        (results.files[0] && `${ROUTES.FILES}?highlight=${results.files[0].id}`);
      if (first) goTo(first);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="flex-1 max-w-md relative" onKeyDown={handleKeyDown}>
      <SearchBar
        value={query}
        onChange={(v) => {
          setQuery(v);
          if (v.trim()) setOpen(true);
        }}
        placeholder="Search anything..."
      />

      {open && hasQuery && (
        <div className="absolute top-full left-0 z-30 mt-2 w-full rounded-2xl border-2 border-ink bg-white shadow-brutal max-h-[28rem] overflow-y-auto">
          {!hasResults ? (
            <div className="px-4 py-6 text-center text-sm font-semibold text-muted">
              No results for &ldquo;{debouncedQuery}&rdquo;
            </div>
          ) : (
            <div className="py-2">
              {results.pages.length > 0 && (
                <ResultGroup label="Pages">
                  {results.pages.map((page) => (
                    <ResultRow
                      key={page.route}
                      icon={<Compass className="h-4 w-4 shrink-0 text-muted" />}
                      onClick={() => goTo(page.route)}
                    >
                      {page.label}
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {results.projects.length > 0 && (
                <ResultGroup label="Projects">
                  {results.projects.map((project) => (
                    <ResultRow
                      key={project.id}
                      icon={<FolderKanban className="h-4 w-4 shrink-0 text-muted" />}
                      onClick={() => goTo(`/projects/${project.id}`)}
                      trailing={<Badge className={getPriorityColor(project.priority)}>{capitalize(project.priority)}</Badge>}
                    >
                      {project.name}
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {results.tasks.length > 0 && (
                <ResultGroup label="Tasks">
                  {results.tasks.map((task) => (
                    <ResultRow
                      key={task.id}
                      icon={<CheckSquare className="h-4 w-4 shrink-0 text-muted" />}
                      onClick={() => goTo(`${ROUTES.TASKS}?taskId=${task.id}`)}
                      trailing={<Badge className={getStatusColor(task.status)}>{capitalize(task.status)}</Badge>}
                    >
                      {task.title}
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {results.team.length > 0 && (
                <ResultGroup label="Team">
                  {results.team.map((member) => (
                    <ResultRow
                      key={member.id}
                      icon={<Users className="h-4 w-4 shrink-0 text-muted" />}
                      onClick={() => goTo(`${ROUTES.TEAM}?highlight=${member.id}`)}
                      trailing={<span className="text-xs font-semibold text-muted capitalize">{member.role}</span>}
                    >
                      {member.name}
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}

              {results.files.length > 0 && (
                <ResultGroup label="Files">
                  {results.files.map((file) => (
                    <ResultRow
                      key={file.id}
                      icon={<FileText className="h-4 w-4 shrink-0 text-muted" />}
                      onClick={() => goTo(`${ROUTES.FILES}?highlight=${file.id}`)}
                    >
                      {file.name}
                    </ResultRow>
                  ))}
                </ResultGroup>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-4 pt-2 pb-1 text-xs font-extrabold uppercase tracking-wider text-muted">{label}</p>
      {children}
    </div>
  );
}

function ResultRow({
  icon,
  children,
  onClick,
  trailing,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-yellow/20 transition-colors"
    >
      {icon}
      <span className="flex-1 min-w-0 text-sm font-bold text-ink truncate">{children}</span>
      {trailing}
    </button>
  );
}