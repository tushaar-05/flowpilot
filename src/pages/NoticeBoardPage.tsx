import { useState, useMemo } from 'react';
import { Plus, Megaphone, Trash2, Edit2, Pin, Calendar, Users, FolderKanban } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { NoticeFormModal, type NoticeFormData } from '@/components/notices/NoticeFormModal';
import { useApp } from '@/context/AppContext';
import type { Notice } from '@/types';
import { formatRelative, formatDate } from '@/utils/helpers';
import { cn } from '@/utils/cn';

export function NoticeBoardPage() {
  const { notices, projects, currentUser, createNotice, updateNotice, deleteNotice } = useApp();

  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [showExpired, setShowExpired] = useState(false);
  const [relevantOnly, setRelevantOnly] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Check if current user is authorized to manage notices (admin or manager)
  const isAuthorized = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const filteredNotices = useMemo(() => {
    let result = [...notices];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      );
    }

    // Audience filter
    if (audienceFilter !== 'all') {
      result = result.filter((n) => n.audience === audienceFilter);
    }

    // Relevance filter (Personalization)
    if (relevantOnly && currentUser) {
      result = result.filter((n) => {
        if (n.audience === 'everyone') return true;
        if (n.audience === 'team') {
          return n.targetId?.toLowerCase() === currentUser.department?.toLowerCase();
        }
        if (n.audience === 'project') {
          return currentUser.projectIds.includes(n.targetId || '');
        }
        return false;
      });
    }

    // Expiry filter
    if (!showExpired) {
      const now = new Date();
      result = result.filter((n) => {
        if (!n.expiresAt) return true;
        return new Date(n.expiresAt) > now;
      });
    }

    // Sort: Pinned notices first, then recently created
    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [notices, search, audienceFilter, relevantOnly, showExpired, currentUser]);

  const handleCreate = async (data: NoticeFormData) => {
    await createNotice({
      title: data.title,
      description: data.description,
      audience: data.audience,
      targetId: data.targetId,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
      pinned: data.pinned,
    });
    setModalOpen(false);
  };

  const handleEdit = async (data: NoticeFormData) => {
    if (!editingNotice) return;
    const updated: Notice = {
      ...editingNotice,
      title: data.title,
      description: data.description,
      audience: data.audience,
      targetId: data.targetId,
      expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
      pinned: data.pinned,
    };
    await updateNotice(updated);
    setModalOpen(false);
    setEditingNotice(null);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteNotice(deleteId);
      setDeleteId(null);
    }
  };

  const openEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setModalOpen(true);
  };

  const getTargetLabel = (notice: Notice) => {
    if (notice.audience === 'everyone') {
      return { label: 'Everyone', icon: Users, color: 'blue' as const };
    }
    if (notice.audience === 'team') {
      return { label: `Team: ${notice.targetId}`, icon: Users, color: 'emerald' as const };
    }
    if (notice.audience === 'project') {
      const project = projects.find((p) => p.id === notice.targetId);
      return { label: `Project: ${project ? project.name : 'Unknown'}`, icon: FolderKanban, color: 'purple' as const };
    }
    return { label: 'Unknown', icon: Users, color: 'orange' as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Notice Board' }]} />
          <h1 className="text-2xl font-bold mt-2">Notice Board</h1>
          <p className="text-muted text-sm mt-1">
            Browse company-wide announcements, team updates, and project notes.
          </p>
        </div>
        {isAuthorized && (
          <Button onClick={() => { setEditingNotice(null); setModalOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Notice
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search announcements..."
          className="w-full lg:max-w-md"
        />

        <div className="flex gap-2 flex-wrap items-center w-full lg:w-auto">
          <FilterDropdown
            label="Audience"
            value={audienceFilter}
            onChange={setAudienceFilter}
            options={[
              { value: 'all', label: 'All Audiences' },
              { value: 'everyone', label: 'Everyone' },
              { value: 'team', label: 'Teams' },
              { value: 'project', label: 'Projects' },
            ]}
          />

          <button
            onClick={() => setRelevantOnly(!relevantOnly)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all shadow-brutal-sm',
              relevantOnly ? 'bg-yellow border-ink text-ink' : 'border-ink bg-surface text-muted hover:text-ink'
            )}
          >
            Relevant to me
          </button>

          <button
            onClick={() => setShowExpired(!showExpired)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold transition-all shadow-brutal-sm',
              showExpired ? 'bg-pink/20 border-ink text-pink-700' : 'border-ink bg-surface text-muted hover:text-ink'
            )}
          >
            Show Expired
          </button>
        </div>
      </div>

      {filteredNotices.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="h-8 w-8" />}
          title="No notices found"
          description="There are no announcements matching your filters. Stay tuned for future updates!"
          action={
            isAuthorized ? (
              <Button onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" /> Create Announcement
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => {
            const target = getTargetLabel(notice);
            const isNoticeExpired = notice.expiresAt ? new Date(notice.expiresAt) < new Date() : false;

            return (
              <Card
                key={notice.id}
                padding="md"
                className={cn(
                  'transition-all relative border-2 border-ink',
                  notice.pinned
                    ? 'bg-yellow/10 dark:bg-surface ring-2 ring-yellow ring-offset-2 shadow-brutal-hover'
                    : 'bg-surface shadow-brutal',
                  isNoticeExpired && 'opacity-65 border-dashed border-ink/40'
                )}
              >
                {notice.pinned && (
                  <div className="absolute right-4 top-4 flex items-center gap-1.5 text-xs font-bold text-yellow-600 bg-yellow/20 px-2 py-1 rounded-lg border border-yellow">
                    <Pin className="h-3 w-3 fill-current" /> PINNED
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="shrink-0 flex items-center gap-3 md:flex-col md:items-center">
                    <Avatar src={notice.authorAvatar} name={notice.authorName} size="md" className="border border-ink shadow-brutal-sm" />
                    <div className="md:text-center">
                      <p className="font-bold text-sm text-ink truncate max-w-[120px]">{notice.authorName}</p>
                      <p className="text-[11px] text-muted">{formatRelative(notice.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-extrabold text-ink pr-14">{notice.title}</h3>
                      <Badge color={target.color} variant="solid">
                        <target.icon className="h-3.5 w-3.5 shrink-0 mr-1.5 inline" />
                        {target.label}
                      </Badge>
                      {isNoticeExpired && <Badge color="pink">Expired</Badge>}
                    </div>

                    <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">{notice.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-muted font-semibold">
                      {notice.expiresAt && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>Expires: {formatDate(notice.expiresAt)}</span>
                        </div>
                      )}

                      {isAuthorized && (
                        <div className="flex gap-2 ml-auto">
                          <button
                            onClick={() => openEdit(notice)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 border-ink bg-surface hover:bg-yellow/30 text-ink shadow-brutal-sm transition-all"
                            title="Edit notice"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(notice.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border-2 border-ink bg-danger hover:bg-red-600 text-white shadow-brutal-sm transition-all"
                            title="Delete notice"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <NoticeFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingNotice(null); }}
        onSubmit={editingNotice ? handleEdit : handleCreate}
        notice={editingNotice ?? undefined}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This announcement will be permanently removed for all target members."
      />
    </div>
  );
}
