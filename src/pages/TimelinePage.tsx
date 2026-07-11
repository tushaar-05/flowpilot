import { useState, useMemo, useRef, useCallback } from 'react';
import { parseISO, format, differenceInDays, startOfMonth, addMonths, max, min } from 'date-fns';
import { GanttChart } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Badge } from '@/components/ui/Badge';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/cn';
import { formatDate, getPriorityColor, getStatusColor, capitalize } from '@/utils/helpers';
import { useDebounce } from '@/hooks/useDebounce';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '@/constants';
import type { Task, Project } from '@/types';

const CELL_WIDTH = 32;
const ROW_HEIGHT = 52;
const LEFT_COL = 200;

// Opaque equivalent of bg-yellow/20 (#facc15 at 20% over #fffdf7).
// Using a precomputed solid color so the sticky PROJECT cell fully covers
// whatever scrolls behind it.
const PROJECT_COL_BG = '#fef9e3';
const TIMELINE_MONTHS = 3;
const MIN_LABEL_WIDTH = 48;
const LABEL_PADDING = 2;

interface HoveredTaskState {
  task: Task;
  projectName: string;
  rect: { top: number; left: number; width: number };
}

export function TimelinePage() {
  const { tasks, projects } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [hoveredTaskInfo, setHoveredTaskInfo] = useState<HoveredTaskState | null>(null);
  const debouncedSearch = useDebounce(search);

  // Refs for synchronized scrolling between the header and the body.
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerMonthsRef = useRef<HTMLDivElement>(null);

  const windowStart = useMemo(() => startOfMonth(new Date()), []);
  const windowEnd = useMemo(() => addMonths(windowStart, TIMELINE_MONTHS), [windowStart]);
  const totalDays = differenceInDays(windowEnd, windowStart);
  const gridWidth = totalDays * CELL_WIDTH;

  const months = useMemo(() => {
    const result: { label: string; days: number }[] = [];
    let cursor = windowStart;
    while (cursor < windowEnd) {
      const next = addMonths(cursor, 1);
      const clampedEnd = next < windowEnd ? next : windowEnd;
      result.push({ label: format(cursor, 'MMMM yyyy'), days: differenceInDays(clampedEnd, cursor) });
      cursor = next;
    }
    return result;
  }, [windowStart, windowEnd]);

  const dayTicks = useMemo(() => {
    const ticks: { day: number; label: string }[] = [];
    for (let i = 0; i < totalDays; i += 1) {
      const d = new Date(windowStart);
      d.setDate(d.getDate() + i);
      ticks.push({ day: i, label: format(d, 'd') });
    }
    return ticks;
  }, [windowStart, totalDays]);

  const processedTasks = useMemo(() => {
    const result: { task: Task; barLeft: number; barWidth: number }[] = [];
    for (const task of tasks) {
      if (debouncedSearch && !task.title.toLowerCase().includes(debouncedSearch.toLowerCase())) continue;
      if (statusFilter !== 'all' && task.status !== statusFilter) continue;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) continue;

      const created = parseISO(task.createdAt);
      const due = parseISO(task.dueDate);

      if (isNaN(created.getTime()) || isNaN(due.getTime())) {
        if (import.meta.env.DEV) {
          console.warn(`Timeline: Task "${task.title}" skipped due to invalid dates.`);
        }
        continue;
      }

      if (created > windowEnd || due < windowStart) continue;

      const barStart = max([created, windowStart]);
      const barEnd = min([due, windowEnd]);
      const barLeft = differenceInDays(barStart, windowStart) * CELL_WIDTH;
      const barWidth = Math.max(differenceInDays(barEnd, barStart), 1) * CELL_WIDTH;

      result.push({ task, barLeft, barWidth });
    }
    return result;
  }, [tasks, debouncedSearch, statusFilter, priorityFilter, windowStart, windowEnd]);

  const rows = useMemo(() => {
    const projectMap = new Map(projects.map((p) => [p.id, p]));
    const grouped = new Map<string, { project: Project; tasks: typeof processedTasks }>();
    for (const pt of processedTasks) {
      const project = projectMap.get(pt.task.projectId);
      if (!project) continue;
      if (!grouped.has(project.id)) {
        grouped.set(project.id, { project, tasks: [] });
      }
      grouped.get(project.id)!.tasks.push(pt);
    }
    return Array.from(grouped.values());
  }, [projects, processedTasks]);

  // When the body scrolls horizontally, mirror the same scrollLeft onto the
  // months header so they stay in sync. The header itself is overflow-hidden
  // (no native scroll bar) so this is the only way it moves.
  const syncHeaderScroll = useCallback(() => {
    if (headerMonthsRef.current && bodyRef.current) {
      headerMonthsRef.current.scrollLeft = bodyRef.current.scrollLeft;
    }
  }, []);

  const handleMouseEnter = (e: React.MouseEvent, task: Task, projectName: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredTaskInfo({
      task,
      projectName,
      rect: { top: rect.top, left: rect.left, width: rect.width },
    });
  };

  const handleMouseLeave = () => setHoveredTaskInfo(null);

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>, task: Task, projectName: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredTaskInfo({
      task,
      projectName,
      rect: { top: rect.top, left: rect.left, width: rect.width },
    });
  };

  const handleBlur = () => setHoveredTaskInfo(null);

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[{ label: 'Timeline' }]} />
        <h1 className="text-2xl font-bold mt-2">Timeline</h1>
        <p className="text-muted text-sm mt-1">Visualize tasks across projects over time</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ value: 'all', label: 'All' }, ...TASK_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
          />
          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[{ value: 'all', label: 'All' }, ...TASK_PRIORITY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={<GanttChart className="h-8 w-8" />}
          title="No tasks in this window"
          description="Tasks with due dates in the next 3 months will appear here."
        />
      ) : (
        <div role="region" aria-label="Task timeline" className="relative z-10 rounded-3xl border-2 border-ink bg-white shadow-brutal overflow-hidden">
          {/* ── Header ── */}
          <div className="flex border-b-2 border-ink">
            {/* PROJECT header cell — width matches the sticky body labels below */}
            <div
              className="sticky left-0 z-20 shrink-0 border-r-2 border-ink px-4 flex items-center text-xs font-extrabold uppercase tracking-wider text-muted"
              style={{ width: LEFT_COL, height: 64, backgroundColor: PROJECT_COL_BG }}
            >
              Project
            </div>

            {/* Months + day ticks — overflow-hidden so no native scrollbar here;
                scrollLeft is driven by the body onScroll handler */}
            <div ref={headerMonthsRef} className="flex-1 overflow-hidden">
              <div style={{ minWidth: gridWidth }}>
                {/* Row 1: month labels */}
                <div className="flex border-b border-ink/10 h-10" style={{ backgroundColor: PROJECT_COL_BG }}>
                  {months.map((m) => (
                    <div
                      key={m.label}
                      className="shrink-0 border-r border-ink/10 px-2 flex items-center text-xs font-bold text-ink whitespace-nowrap overflow-hidden"
                      style={{ width: m.days * CELL_WIDTH, backgroundColor: PROJECT_COL_BG }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>

                {/* Row 2: day numbers */}
                <div className="relative bg-yellow/10 h-6">
                  {dayTicks.map((t) => (
                    <div
                      key={`gl-h-${t.day}`}
                      className="absolute top-0 bottom-0 w-px bg-ink/10"
                      style={{ left: t.day * CELL_WIDTH }}
                    />
                  ))}
                  {dayTicks.map((t) => (
                    <span
                      key={`lbl-${t.day}`}
                      className="absolute top-1 text-[10px] text-muted font-medium select-none"
                      style={{ left: t.day * CELL_WIDTH + 3 }}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Body (single horizontal scroll container) ── */}
          <div
            ref={bodyRef}
            className="overflow-x-auto scrollbar-thin pb-4"
            onScroll={syncHeaderScroll}
          >
            <div style={{ minWidth: LEFT_COL + gridWidth }}>
              {rows.map(({ project, tasks: projectTasks }) => (
                <div key={project.id} className="flex border-b border-ink/10 last:border-b-0">
                  {/* Sticky project label */}
                  <div
                    className="sticky left-0 z-20 shrink-0 border-r-2 border-ink/20 px-4 py-3 flex flex-col justify-center"
                    style={{ width: LEFT_COL, backgroundColor: PROJECT_COL_BG }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full border border-ink/20 shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-xs font-extrabold text-ink leading-tight line-clamp-2">
                        {project.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted mt-0.5">
                      {projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Task bar area */}
                  <div className="flex-1 relative" style={{ height: projectTasks.length * ROW_HEIGHT }}>
                    {/* Vertical grid lines */}
                    {dayTicks.map((t) => (
                      <div
                        key={`gl-${t.day}`}
                        className="absolute top-0 bottom-0 w-px bg-ink/5"
                        style={{ left: t.day * CELL_WIDTH }}
                      />
                    ))}

                    {/* Task bars */}
                    {projectTasks.map((item, i) => {
                      const { task, barLeft: left, barWidth: width } = item;
                      const labelWidth = Math.min(Math.max(width, MIN_LABEL_WIDTH), gridWidth - left - LABEL_PADDING);

                      return (
                        <div
                          key={task.id}
                          className="absolute"
                          style={{ top: i * ROW_HEIGHT + 4, left, width, height: 44 }}
                          onMouseEnter={(e) => handleMouseEnter(e, task, project.name)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {/* Bar */}
                          <button
                            onClick={() => setSelectedTask(task)}
                            onFocus={(e) => handleFocus(e, task, project.name)}
                            onBlur={handleBlur}
                            aria-label={task.title}
                            aria-describedby="timeline-tooltip"
                            className={cn(
                              'absolute top-0 left-0 w-full h-[22px] rounded-full border-2 border-ink',
                              'shadow-brutal-sm shadow-brutal-hover',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                              task.status === 'completed' && 'opacity-60',
                            )}
                            style={{ backgroundColor: project.color ?? '#3B82F6' }}
                          />

                          {/* Label below the bar */}
                          <div
                            onClick={() => setSelectedTask(task)}
                            aria-hidden="true"
                            className="absolute top-[26px] text-[10px] font-bold text-ink truncate cursor-pointer select-none"
                            style={{ left: 8, width: labelWidth - 8, height: 16 }}
                          >
                            {task.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Tooltip Portal */}
      {hoveredTaskInfo && (
        <div
          id="timeline-tooltip"
          role="tooltip"
          className="pointer-events-none fixed z-50"
          style={{
            top: hoveredTaskInfo.rect.top - 8,
            left: hoveredTaskInfo.rect.left + hoveredTaskInfo.rect.width / 2,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="rounded-md bg-foreground px-3 py-2 text-xs text-white shadow-brutal-sm whitespace-nowrap">
            <p className="font-bold">{hoveredTaskInfo.task.title}</p>
            <p className="mt-0.5 text-white/70">{hoveredTaskInfo.projectName}</p>
            <p className="mt-1 text-white/70">Due {formatDate(hoveredTaskInfo.task.dueDate)}</p>
            <p className="text-white/70">{capitalize(hoveredTaskInfo.task.status)}</p>
          </div>
        </div>
      )}

      <Drawer
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title ?? 'Task'}
      >
        {selectedTask && (
          <div className="space-y-4">
            <p className="text-sm text-muted leading-relaxed">{selectedTask.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge className={getPriorityColor(selectedTask.priority)}>{capitalize(selectedTask.priority)}</Badge>
              <Badge className={getStatusColor(selectedTask.status)}>{capitalize(selectedTask.status)}</Badge>
              {selectedTask.labels.map((l) => (
                <Badge key={l} className="bg-slate-100 text-ink border-ink">{l}</Badge>
              ))}
            </div>
            <div className="rounded-2xl border-2 border-ink/10 bg-background p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted font-semibold">Created</span>
                <span className="font-bold">{formatDate(selectedTask.createdAt)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted font-semibold">Due</span>
                <span className="font-bold">{formatDate(selectedTask.dueDate)}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
