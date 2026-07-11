import { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { useApp } from '@/context/AppContext';
import type { Task, TaskStatus } from '@/types';
import { KANBAN_COLUMNS } from '@/constants';
import { getPriorityColor, capitalize, formatDate } from '@/utils/helpers';
import { GripVertical } from 'lucide-react';

function KanbanCard({ task, users }: { task: Task; users: ReturnType<typeof useApp>['users'] }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const assignee = users.find((u) => u.id === task.assigneeId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-border bg-white p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 text-muted shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-2">{task.title}</p>
          <div className="flex items-center justify-between">
            <Badge className={getPriorityColor(task.priority)}>{capitalize(task.priority)}</Badge>
            {assignee && <Avatar src={assignee.avatar} name={assignee.name} size="xs" />}
          </div>
          <p className="text-xs text-muted mt-2">{formatDate(task.dueDate)}</p>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  title,
  status,
  tasks,
  users,
}: {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  users: ReturnType<typeof useApp>['users'];
}) {
  const columnTasks = tasks.filter((t) => t.status === status);
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-[280px] flex-1">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-muted bg-slate-100 rounded-full px-2 py-0.5">{columnTasks.length}</span>
      </div>
      <SortableContext id={status} items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex-1 space-y-2 rounded-xl bg-slate-50/80 p-3 min-h-[400px]">
          {columnTasks.map((task) => (
            <KanbanCard key={task.id} task={task} users={users} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanPage() {
  const { tasks, users, reorderTasks, projects } = useApp();
  const [projectFilter, setProjectFilter] = useState('all');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const source = localTasks.length > 0 ? localTasks : tasks;
    if (projectFilter === 'all') return source;
    return source.filter((t) => t.projectId === projectFilter);
  }, [localTasks, tasks, projectFilter]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = filteredTasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let newStatus: TaskStatus | null = null;
    const column = KANBAN_COLUMNS.find((c) => c.id === overId || c.status === overId);
    if (column) {
      newStatus = column.status as TaskStatus;
    } else {
      const overTask = localTasks.find((t) => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (!newStatus) return;

    const activeIndex = localTasks.findIndex((t) => t.id === activeId);
    if (activeIndex === -1) return;

    let updatedTasks = [...localTasks];

    // Update status and updatedAt of the moved task
    updatedTasks[activeIndex] = {
      ...updatedTasks[activeIndex],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    const overIndex = localTasks.findIndex((t) => t.id === overId);

    if (overIndex !== -1) {
      // Reordering within the same or different column over another task
      updatedTasks = arrayMove(updatedTasks, activeIndex, overIndex);
    } else {
      // Dropping directly on a column container
      const [movedTask] = updatedTasks.splice(activeIndex, 1);
      const columnTasks = updatedTasks.filter((t) => t.status === newStatus);
      if (columnTasks.length > 0) {
        const lastTask = columnTasks[columnTasks.length - 1];
        const lastTaskIndex = updatedTasks.findIndex((t) => t.id === lastTask.id);
        updatedTasks.splice(lastTaskIndex + 1, 0, movedTask);
      } else {
        updatedTasks.push(movedTask);
      }
    }

    setLocalTasks(updatedTasks);
    reorderTasks(updatedTasks);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Kanban Board' }]} />
          <h1 className="text-2xl font-bold mt-2">Kanban Board</h1>
          <p className="text-muted text-sm mt-1">Drag and drop tasks to update their status</p>
        </div>
        <FilterDropdown
          label="Project"
          value={projectFilter}
          onChange={setProjectFilter}
          options={[
            { value: 'all', label: 'All Projects' },
            ...projects.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {KANBAN_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              title={col.title}
              status={col.status as TaskStatus}
              tasks={filteredTasks}
              users={users}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <Card className="w-[280px] shadow-lg rotate-2">
              <p className="text-sm font-medium">{activeTask.title}</p>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
