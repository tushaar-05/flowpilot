import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFormModal, type ProjectFormData } from '@/components/projects/ProjectFormModal';
import { useApp } from '@/context/AppContext';
import type { Project } from '@/types';
import { PROJECT_STATUS_OPTIONS, PROJECT_PRIORITY_OPTIONS } from '@/constants';

type SortField = 'name' | 'progress' | 'priority' | 'updatedAt';

export function ProjectsPage() {
  const { projects, createProject, updateProject, deleteProject, checkProjectDeadlines } = useApp();
  
  useEffect(() => {
    checkProjectDeadlines();
  }, [checkProjectDeadlines]);
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setActiveSearch(value);
  };

  const handleSearchClear = () => {
    setSearch('');
    setActiveSearch('');
  };
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortField>('updatedAt');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const editSnapshot = useRef<Project | null>(null);

  const filtered = useMemo(() => {
    let result = [...projects];

    if (activeSearch) {
      result = result.filter(
        (p) => p.name.includes(activeSearch) || p.description.includes(activeSearch)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      result = result.filter((p) => p.priority === priorityFilter);
    }

    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'progress': return b.progress - a.progress;
        case 'priority': return (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
        case 'updatedAt': return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default: return 0;
      }
    });

    return result;
  }, [projects, activeSearch, statusFilter, priorityFilter, sortBy]);

  const handleCreate = async (data: ProjectFormData) => {
    await createProject({
      ...data,
      status: data.status as Project['status'],
      priority: data.priority as Project['priority'],
      progress: 0,
      memberIds: ['user-1'],
      tags: [],
    });
    setModalOpen(false);
  };

  const handleEdit = async (data: ProjectFormData) => {
    if (!editingProject) return;
    const updated = {
      ...editingProject,
      ...data,
      status: data.status as Project['status'],
      priority: data.priority as Project['priority'],
    };
    editSnapshot.current = updated;
    await updateProject(updated);
    setModalOpen(false);
    setEditingProject(editSnapshot.current);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProject(deleteId);
      setDeleteId(null);
    }
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Projects' }]} />
          <h1 className="text-2xl font-bold mt-2">Projects</h1>
          <p className="text-muted text-sm mt-1">{projects.length} projects total</p>
        </div>
        <Button onClick={() => { setEditingProject(null); setModalOpen(true); }}>
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          placeholder="Search projects..."
          className="flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[{ value: 'all', label: 'All' }, ...PROJECT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
          />
          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={[{ value: 'all', label: 'All' }, ...PROJECT_PRIORITY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))]}
          />
          <FilterDropdown
            label="Sort"
            value={sortBy}
            onChange={(v) => setSortBy(v as SortField)}
            options={[
              { value: 'updatedAt', label: 'Recently Updated' },
              { value: 'name', label: 'Name' },
              { value: 'progress', label: 'Progress' },
              { value: 'priority', label: 'Priority' },
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-8 w-8" />}
          title="No projects found"
          description="Try adjusting your search or filters, or create a new project to get started."
          action={
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="h-4 w-4" /> Create Project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={editingProject?.id === project.id ? editingProject : project}
              onEdit={openEdit}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <ProjectFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProject(null); }}
        onSubmit={editingProject ? handleEdit : handleCreate}
        project={editingProject ?? undefined}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action can be undone from the toast notification."
      />
    </div>
  );
}
