import { useState } from 'react';
import {
  Trash2,
  Undo2,
  FileText,
  CheckSquare,
  FolderKanban,
  Bell,
  AlertTriangle,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useApp } from '@/context/AppContext';
import { formatRelative, formatFileSize } from '@/utils/helpers';
import type { DeletedItem } from '@/types';

const typeIcons = {
  file: FileText,
  task: CheckSquare,
  project: FolderKanban,
  notification: Bell,
};

const typeBadgeColors: Record<DeletedItem['type'], 'yellow' | 'blue' | 'purple' | 'pink'> = {
  file: 'yellow',
  task: 'blue',
  project: 'purple',
  notification: 'pink',
};

const typeLabels: Record<DeletedItem['type'], string> = {
  file: 'File',
  task: 'Task',
  project: 'Project',
  notification: 'Notification',
};

export function TrashPage() {
  const { deletedStack, restoreDeletedItem, permanentlyDeleteItem, emptyTrash, projects } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeletedItem | null>(null);

  const getItemTitle = (item: DeletedItem['item']): string => {
    if ('title' in item && typeof (item as { title?: string }).title === 'string') {
      return (item as { title: string }).title;
    }
    if ('name' in item && typeof (item as { name?: string }).name === 'string') {
      return (item as { name: string }).name;
    }
    if ('message' in item && typeof (item as { message?: string }).message === 'string') {
      return (item as { message: string }).message;
    }
    return 'Untitled Item';
  };

  const filtered = deletedStack
    .filter((d) => {
      const title = getItemTitle(d.item);
      const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || d.type === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => b.deletedAt - a.deletedAt);

  const getItemSubtitle = (d: DeletedItem) => {
    if (d.type === 'file') {
      const file = d.item as { size: number; projectId: string };
      const project = projects.find((p) => p.id === file.projectId);
      return `${formatFileSize(file.size)}${project ? ` · ${project.name}` : ''}`;
    }
    if (d.type === 'task') {
      const task = d.item as { projectId: string; priority: string };
      const project = projects.find((p) => p.id === task.projectId);
      return `${project ? project.name : 'No Project'} · Priority: ${task.priority}`;
    }
    if (d.type === 'project') {
      const project = d.item as { status: string };
      return `Status: ${project.status}`;
    }
    if (d.type === 'notification') {
      const notif = d.item as { category: string };
      return `Category: ${notif.category}`;
    }
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Trash' }]} />
          <h1 className="text-2xl font-bold mt-2 flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-danger" /> Trash
          </h1>
          <p className="text-muted text-sm mt-1">
            {deletedStack.length} {deletedStack.length === 1 ? 'item' : 'items'} currently in Trash
          </p>
        </div>
        {deletedStack.length > 0 && (
          <Button variant="danger" onClick={() => setConfirmEmptyOpen(true)}>
            <Trash2 className="h-4 w-4" /> Empty Trash
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search deleted items..."
          className="flex-1"
        />
        <FilterDropdown
          label="Category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: 'all', label: 'All Items' },
            { value: 'file', label: 'Files' },
            { value: 'task', label: 'Tasks' },
            { value: 'project', label: 'Projects' },
            { value: 'notification', label: 'Notifications' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Trash2 className="h-8 w-8 text-muted" />}
          title={deletedStack.length === 0 ? 'Trash is empty' : 'No matching items found'}
          description={
            deletedStack.length === 0
              ? 'Items deleted from Files, Tasks, Projects, and Notifications will appear here.'
              : 'Try adjusting your search or category filter.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((d, index) => {
            const Icon = typeIcons[d.type] ?? AlertTriangle;
            const title = getItemTitle(d.item);
            const subtitle = getItemSubtitle(d);

            return (
              <Card
                key={`${d.item.id}-${d.deletedAt}-${index}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-ink"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-slate-50 shadow-brutal-sm">
                    <Icon className="h-6 w-6 text-ink" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold truncate text-ink">{title}</h3>
                      <Badge variant="solid" color={typeBadgeColors[d.type]}>
                        {typeLabels[d.type]}
                      </Badge>
                    </div>
                    {subtitle && <p className="text-xs font-bold text-muted mt-0.5">{subtitle}</p>}
                    <p className="text-[11px] font-medium text-muted mt-1">
                      Deleted {formatRelative(d.deletedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restoreDeletedItem(d)}
                    className="flex items-center gap-1.5 font-bold"
                  >
                    <Undo2 className="h-3.5 w-3.5" /> Restore
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setItemToDelete(d)}
                    className="p-2 text-danger hover:bg-red-50"
                    title="Permanently Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={confirmEmptyOpen}
        onClose={() => setConfirmEmptyOpen(false)}
        onConfirm={() => {
          emptyTrash();
          setConfirmEmptyOpen(false);
        }}
        title="Empty Trash"
        message="Are you sure you want to permanently delete all items in the Trash? This action cannot be undone."
        confirmLabel="Empty Trash"
        variant="danger"
      />

      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            permanentlyDeleteItem(itemToDelete);
            setItemToDelete(null);
          }
        }}
        title="Permanently Delete Item"
        message={`Are you sure you want to permanently delete "${
          itemToDelete ? getItemTitle(itemToDelete.item) : ''
        }"? This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        variant="danger"
      />
    </div>
  );
}
