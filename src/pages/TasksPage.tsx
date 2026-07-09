import { useState, useMemo } from 'react';
import { Plus, CheckSquare, Trash2, Undo2 } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { TaskFormModal, type TaskFormData } from '@/components/tasks/TaskFormModal';
import { useApp } from '@/context/AppContext';
import { usePagination } from '@/hooks/usePagination';
import { useDebounce } from '@/hooks/useDebounce';
import type { Task } from '@/types';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '@/constants';
import { formatDate, getPriorityColor, getStatusColor, capitalize } from '@/utils/helpers';

type SortField = 'title' | 'dueDate' | 'priority' | 'status';

export function TasksPage() {
  const { tasks, users, projects, createTask, updateTask, deleteTask, undoDelete, settings } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortField>('dueDate');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    let result = [...tasks];
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((task) => {
        const projectName = projects.find((project) => project.id === task.projectId)?.name ?? '';
        const assigneeName = users.find((user) => user.id === task.assigneeId)?.name ?? '';
        const searchableText = [
          task.title,
          task.description,
          task.priority,
          task.status,
          task.dueDate,
          projectName,
          assigneeName,
          ...task.labels,
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
    }

    result = result.filter((task) => {
      const statusMatch = statusFilter === 'all' || task.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });

    return result;
  }, [tasks, debouncedSearch, statusFilter, priorityFilter, projects, users]);

  const sorted = useMemo(() => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'dueDate': return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority': return (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
        case 'status': return a.status.localeCompare(b.status);
        default: return 0;
      }
    });
  }, [filtered, sortBy]);

  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(
    sorted,
    settings.itemsPerPage
  );

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleCreate = async (data: TaskFormData) => {
    await createTask({
      title: data.title,
      description: data.description,
      priority: data.priority as Task['priority'],
      status: data.status as Task['status'],
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      projectId: data.projectId,
      assigneeId: data.assigneeId,
      labels: data.labels ? data.labels.split(',').map((l) => l.trim()).filter(Boolean) : [],
      attachments: [],
      checklist: [],
      comments: [],
    });
    setModalOpen(false);
  };

  const handleEdit = async (data: TaskFormData) => {
    if (!editingTask) return;
    await updateTask({
      ...editingTask,
      title: data.title,
      description: data.description,
      priority: data.priority as Task['priority'],
      status: data.status as Task['status'],
      dueDate: data.dueDate || editingTask.dueDate,
      projectId: data.projectId,
      assigneeId: data.assigneeId,
      labels: data.labels ? data.labels.split(',').map((l) => l.trim()).filter(Boolean) : [],
    });
    setModalOpen(false);
    setEditingTask(null);
  };

  const columns = [
    {
      key: 'title',
      header: 'Task',
      render: (task: Task) => (
        <div>
          <p className="font-medium">{task.title}</p>
          <p className="text-xs text-muted">{projects.find((p) => p.id === task.projectId)?.name}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (task: Task) => <Badge className={getStatusColor(task.status)}>{capitalize(task.status)}</Badge>,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (task: Task) => <Badge className={getPriorityColor(task.priority)}>{capitalize(task.priority)}</Badge>,
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
      render: (task: Task) => <span className="text-sm">{formatDate(task.dueDate)}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'w-20',
      render: (task: Task) => (
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setEditingTask(task); setModalOpen(true); }}
            className="p-1.5 rounded-lg text-muted hover:bg-slate-100 text-xs"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setDeleteId(task.id); }}
            className="p-1.5 rounded-lg text-danger hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Tasks' }]} />
          <h1 className="text-2xl font-bold mt-2">Tasks</h1>
          <p className="text-muted text-sm mt-1">{tasks.length} tasks across all projects</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={undoDelete}>
            <Undo2 className="h-4 w-4" /> Undo
          </Button>
          <Button onClick={() => { setEditingTask(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
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
          <FilterDropdown
            label="Sort"
            value={sortBy}
            onChange={(v) => setSortBy(v as SortField)}
            options={[
              { value: 'dueDate', label: 'Due Date' },
              { value: 'title', label: 'Title' },
              { value: 'priority', label: 'Priority' },
              { value: 'status', label: 'Status' },
            ]}
          />
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-8 w-8" />}
          title="No tasks found"
          description="Try adjusting your filters or create a new task to get started."
          action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Create Task</Button>}
        />
      ) : (
        <>
          {paginatedItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-slate-50/50 rounded-xl border border-dashed">
              No tasks found on this page.
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={paginatedItems}
              onRowClick={(task) => { setEditingTask(task); setModalOpen(true); }}
            />
          )}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={editingTask ? handleEdit : handleCreate}
        task={editingTask ?? undefined}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId) { await deleteTask(deleteId); setDeleteId(null); } }}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
      />
    </div>
  );
}