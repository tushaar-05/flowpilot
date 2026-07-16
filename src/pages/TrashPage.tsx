import { useState, useMemo } from 'react';
import { Trash2, RotateCcw, FolderKanban, CheckSquare, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useApp } from '@/context/AppContext';
import { cn } from '@/utils/cn';
import { capitalize } from '@/utils/helpers';
import type { DeletedItem, Task, Project, FileItem, Notification } from '@/types';

export function TrashPage() {
  const { deletedItems, restoreDeletedItem, permanentlyDeleteItem, emptyTrash, projects } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Modals state
  const [confirmEmptyModal, setConfirmEmptyModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [confirmItem, setConfirmItem] = useState<DeletedItem | null>(null);

  const filteredItems = useMemo(() => {
    let result = [...deletedItems];

    // Filter by tab
    if (activeTab === 'projects') {
      result = result.filter((item) => item.type === 'project');
    } else if (activeTab === 'tasks') {
      result = result.filter((item) => item.type === 'task');
    }

    // Filter by search
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((item) => {
        let title = '';
        let desc = '';
        if (item.type === 'task') {
          title = (item.item as Task).title || '';
          desc = (item.item as Task).description || '';
        } else if (item.type === 'project') {
          title = (item.item as Project).name || '';
          desc = (item.item as Project).description || '';
        } else if (item.type === 'file') {
          title = (item.item as FileItem).name || '';
        } else if (item.type === 'notification') {
          title = (item.item as Notification).title || '';
          desc = (item.item as Notification).message || '';
        }
        return title.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
      });
    }

    // Sort by deleted date (newest first)
    result.sort((a, b) => b.deletedAt - a.deletedAt);

    return result;
  }, [deletedItems, activeTab, search]);

  const handleRestore = async (item: DeletedItem) => {
    await restoreDeletedItem(item);
  };

  const handlePermanentDelete = async () => {
    if (confirmItem) {
      await permanentlyDeleteItem(confirmItem);
      setConfirmItem(null);
      setConfirmDeleteModal(false);
    }
  };

  const handleEmptyTrash = async () => {
    await emptyTrash();
    setConfirmEmptyModal(false);
  };

  const tableRows = filteredItems.map((item) => ({
    id: `${item.type}-${item.item.id}`,
    original: item,
    title: item.type === 'task' 
      ? (item.item as Task).title 
      : item.type === 'notification' 
        ? (item.item as Notification).title 
        : (item.item as Project | FileItem).name,
    type: item.type,
    deletedAt: item.deletedAt,
    context: item.type === 'task' ? (item.item as Task).projectId : '',
  }));

  const columns = [
    {
      key: 'title',
      header: 'Name / Title',
      render: (row: any) => {
        const isTask = row.type === 'task';
        const project = isTask ? projects.find((p) => p.id === row.context) : null;
        return (
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink shadow-brutal-sm text-white',
              isTask ? 'bg-primary' : 'bg-secondary'
            )}>
              {isTask ? <CheckSquare className="h-5 w-5" /> : <FolderKanban className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-extrabold text-ink">{row.title}</p>
              {isTask && (
                <p className="text-xs text-muted">
                  Project: <span className="font-bold">{project?.name ?? 'Unknown Project'}</span>
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'type',
      header: 'Type',
      render: (row: any) => (
        <Badge className={row.type === 'task' ? 'bg-primary/20 text-ink border-ink font-bold' : 'bg-secondary/20 text-ink border-ink font-bold'}>
          {capitalize(row.type)}
        </Badge>
      ),
    },
    {
      key: 'deletedAt',
      header: 'Deleted At',
      render: (row: any) => (
        <span className="text-sm font-semibold text-muted">
          {formatDistanceToNow(new Date(row.deletedAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-36 text-right',
      render: (row: any) => (
        <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRestore(row.original)}
            title="Restore Item"
            className="shadow-brutal-sm py-1.5 px-3 border-2 border-ink hover:bg-yellow/20 active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Restore
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setConfirmItem(row.original);
              setConfirmDeleteModal(true);
            }}
            title="Permanently Delete"
            className="shadow-brutal-sm py-1.5 px-3 border-2 border-ink text-danger hover:bg-red-50 hover:text-danger active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const tabs = [
    { id: 'all', label: `All (${deletedItems.length})` },
    { id: 'projects', label: `Projects (${deletedItems.filter((i) => i.type === 'project').length})` },
    { id: 'tasks', label: `Tasks (${deletedItems.filter((i) => i.type === 'task').length})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Trash Bin' }]} />
          <h1 className="text-2xl font-bold mt-2">Trash Bin</h1>
          <p className="text-muted text-sm mt-1">
            Items in the trash will remain saved until permanently deleted or restored.
          </p>
        </div>
        {deletedItems.length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => setConfirmEmptyModal(true)}
            className="shadow-brutal-sm border-2 border-ink text-danger hover:bg-red-50 hover:text-danger hover:border-danger transition-all duration-150"
          >
            <Trash2 className="h-4 w-4 mr-1.5" /> Empty Trash
          </Button>
        )}
      </div>

      {/* Main content */}
      {deletedItems.length === 0 ? (
        <EmptyState
          icon={<Trash2 className="h-10 w-10 text-muted" />}
          title="Trash Bin is Empty"
          description="Deleted projects and tasks will appear here, allowing you to restore them anytime."
        />
      ) : (
        <div className="space-y-6">
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar 
              value={search} 
              onChange={setSearch} 
              placeholder="Search deleted items..." 
              className="flex-1"
            />
          </div>

          {/* Tabs and Data Table */}
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
            {filteredItems.length === 0 ? (
              <EmptyState
                icon={<AlertTriangle className="h-8 w-8 text-muted" />}
                title="No items match your criteria"
                description="Try clearing your search query or selecting a different tab."
                action={
                  search ? (
                    <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                      Clear Search
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <DataTable
                columns={columns}
                data={tableRows}
              />
            )}
          </Tabs>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmDialog
        open={confirmEmptyModal}
        onClose={() => setConfirmEmptyModal(false)}
        onConfirm={handleEmptyTrash}
        title="Empty Trash Bin"
        message="Are you sure you want to permanently delete all items in the trash? This action is irreversible."
        confirmLabel="Empty Trash"
        variant="accent"
      />

      <ConfirmDialog
        open={confirmDeleteModal}
        onClose={() => {
          setConfirmDeleteModal(false);
          setConfirmItem(null);
        }}
        onConfirm={handlePermanentDelete}
        title={`Permanently Delete ${
          confirmItem?.type === 'task' ? 'Task' :
          confirmItem?.type === 'project' ? 'Project' :
          confirmItem?.type === 'file' ? 'File' : 'Notification'
        }`}
        message={`Are you sure you want to permanently delete "${
          confirmItem?.type === 'task' 
            ? (confirmItem.item as Task).title 
            : confirmItem?.type === 'notification'
              ? (confirmItem.item as Notification).title
              : (confirmItem?.item as Project | FileItem)?.name
        }"? This action is irreversible.`}
        confirmLabel="Delete Permanently"
        variant="accent"
      />
    </div>
  );
}
