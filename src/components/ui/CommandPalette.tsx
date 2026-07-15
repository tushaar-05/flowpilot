import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  Image,
  FileSpreadsheet,
  FileArchive,
  LayoutDashboard,
  Calendar,
  Activity,
  Bell,
  BarChart3,
  User,
  Settings,
  Columns3,
  Clock,
  CornerDownLeft,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';
import { getFromStorage, setToStorage } from '@/utils/storage';
import { formatFileSize, capitalize } from '@/utils/helpers';

// Navigation pages / app sections categories
const categories = [
  { id: 'nav-dashboard', type: 'category', title: 'Dashboard', subtitle: 'View app metrics, recent activity, and notifications', badge: 'Page', badgeColor: 'orange' as const, url: '/dashboard', icon: LayoutDashboard },
  { id: 'nav-projects', type: 'category', title: 'Projects', subtitle: 'Manage and collaborate on all your workspaces', badge: 'Page', badgeColor: 'orange' as const, url: '/projects', icon: FolderKanban },
  { id: 'nav-tasks', type: 'category', title: 'Tasks', subtitle: 'Track, prioritize, and assign team to-dos', badge: 'Page', badgeColor: 'orange' as const, url: '/tasks', icon: CheckSquare },
  { id: 'nav-kanban', type: 'category', title: 'Kanban Board', subtitle: 'Interactive task board with drag-and-drop columns', badge: 'Page', badgeColor: 'orange' as const, url: '/kanban', icon: Columns3 },
  { id: 'nav-calendar', type: 'category', title: 'Calendar', subtitle: 'Schedule tasks and track upcoming milestones', badge: 'Page', badgeColor: 'orange' as const, url: '/calendar', icon: Calendar },
  { id: 'nav-team', type: 'category', title: 'Team', subtitle: 'Collaborate with team members and manage roles', badge: 'Page', badgeColor: 'orange' as const, url: '/team', icon: Users },
  { id: 'nav-activity', type: 'category', title: 'Activity Feed', subtitle: 'Real-time log of workspace updates and comments', badge: 'Page', badgeColor: 'orange' as const, url: '/activity', icon: Activity },
  { id: 'nav-files', type: 'category', title: 'Files', subtitle: 'View, upload, and search shared project documents', badge: 'Page', badgeColor: 'orange' as const, url: '/files', icon: FileText },
  { id: 'nav-notifications', type: 'category', title: 'Notifications', subtitle: 'Keep track of task assignments and project updates', badge: 'Page', badgeColor: 'orange' as const, url: '/notifications', icon: Bell },
  { id: 'nav-analytics', type: 'category', title: 'Analytics', subtitle: 'Monitor team productivity and project progress', badge: 'Page', badgeColor: 'orange' as const, url: '/analytics', icon: BarChart3 },
  { id: 'nav-profile', type: 'category', title: 'Profile', subtitle: 'Customize your avatar, bio, and personal details', badge: 'Page', badgeColor: 'orange' as const, url: '/profile', icon: User },
  { id: 'nav-settings', type: 'category', title: 'Settings', subtitle: 'Configure app theme, layout, and notification settings', badge: 'Page', badgeColor: 'orange' as const, url: '/settings', icon: Settings },
];

export function CommandPalette() {
  const { projects, tasks, users, files, searchOpen, setSearchOpen } = useApp();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Load recent searches and reset state when opening modal
  useEffect(() => {
    if (searchOpen) {
      const recent = getFromStorage<string[]>('flowpilot_recent_searches', []);
      setRecentSearches(recent);
      setQuery('');
      setActiveTab('all');
      setSelectedIndex(0);
      document.body.style.overflow = 'hidden';
      // Autofocus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  // Global key listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [searchOpen, setSearchOpen]);

  // Handle active navigation list
  const getFilteredResults = () => {
    if (!query.trim()) {
      // If query is empty, show recent searches as navigable items
      return recentSearches.map((q, idx) => ({
        id: `recent-${idx}`,
        type: 'recent' as const,
        title: q,
        subtitle: 'Click or press Enter to search',
        badge: 'Recent',
        badgeColor: 'pink' as const,
        icon: <Clock className="h-4 w-4 shrink-0 text-muted" />,
        originalItem: q,
        url: '',
      }));
    }

    const lowercaseQuery = query.toLowerCase();

    // 1. Projects
    const matchedProjects = projects
      .filter(
        (p) =>
          p.name.toLowerCase().includes(lowercaseQuery) ||
          p.description.toLowerCase().includes(lowercaseQuery)
      )
      .map((p) => ({
        id: p.id,
        type: 'project' as const,
        title: p.name,
        subtitle: `${capitalize(p.status)} • ${capitalize(p.priority)} Priority • ${p.progress}% progress`,
        badge: 'Project',
        badgeColor: 'blue' as const,
        url: `/projects/${p.id}`,
        icon: <FolderKanban className="h-4 w-4 shrink-0" />,
        originalItem: p,
      }));

    // 2. Tasks
    const matchedTasks = tasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(lowercaseQuery) ||
          t.description.toLowerCase().includes(lowercaseQuery)
      )
      .map((t) => ({
        id: t.id,
        type: 'task' as const,
        title: t.title,
        subtitle: `${capitalize(t.status)} • ${capitalize(t.priority)} Priority`,
        badge: 'Task',
        badgeColor: 'yellow' as const,
        url: `/tasks`,
        icon: <CheckSquare className="h-4 w-4 shrink-0" />,
        originalItem: t,
      }));

    // 3. Team Members
    const matchedMembers = users
      .filter(
        (u) =>
          u.name.toLowerCase().includes(lowercaseQuery) ||
          u.email.toLowerCase().includes(lowercaseQuery) ||
          u.department.toLowerCase().includes(lowercaseQuery) ||
          u.skills.some((s) => s.toLowerCase().includes(lowercaseQuery))
      )
      .map((u) => ({
        id: u.id,
        type: 'member' as const,
        title: u.name,
        subtitle: `${u.email} • ${capitalize(u.role)} • ${u.department}`,
        badge: 'Member',
        badgeColor: 'purple' as const,
        url: `/team`,
        icon: <Avatar src={u.avatar} name={u.name} size="xs" className="shadow-none border border-ink" />,
        originalItem: u,
      }));

    // 4. Files
    const matchedFiles = files
      .filter((f) => f.name.toLowerCase().includes(lowercaseQuery))
      .map((f) => {
        let icon = <FileText className="h-4 w-4 shrink-0" />;
        if (f.type === 'image') icon = <Image className="h-4 w-4 shrink-0" />;
        else if (f.type === 'spreadsheet') icon = <FileSpreadsheet className="h-4 w-4 shrink-0" />;
        else if (f.type === 'archive') icon = <FileArchive className="h-4 w-4 shrink-0" />;

        return {
          id: f.id,
          type: 'file' as const,
          title: f.name,
          subtitle: `${formatFileSize(f.size)} • Uploaded on ${new Date(f.uploadedAt).toLocaleDateString()}`,
          badge: 'File',
          badgeColor: 'emerald' as const,
          url: `/files`,
          icon,
          originalItem: f,
        };
      });

    // 5. Categories
    const matchedCategories = categories
      .filter(
        (c) =>
          c.title.toLowerCase().includes(lowercaseQuery) ||
          c.subtitle.toLowerCase().includes(lowercaseQuery)
      )
      .map((c) => ({
        id: c.id,
        type: 'category' as const,
        title: c.title,
        subtitle: c.subtitle,
        badge: c.badge,
        badgeColor: c.badgeColor,
        url: c.url,
        icon: <c.icon className="h-4 w-4 shrink-0" />,
        originalItem: c,
      }));

    // Filter based on activeTab
    if (activeTab === 'projects') return matchedProjects;
    if (activeTab === 'tasks') return matchedTasks;
    if (activeTab === 'members') return matchedMembers;
    if (activeTab === 'files') return matchedFiles;

    // For 'all' tab, return a combined array
    return [
      ...matchedProjects,
      ...matchedTasks,
      ...matchedMembers,
      ...matchedFiles,
      ...matchedCategories,
    ];
  };

  const results = getFilteredResults();

  // Reset selected item when query or tab changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  // Keep highlighted item visible during keyboard navigation scrolling
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  const handleSelectResult = (item: typeof results[number]) => {
    if (item.type === 'recent') {
      setQuery(item.originalItem as string);
      setTimeout(() => inputRef.current?.focus(), 50);
      return;
    }

    // Save query to localStorage (keep last 5 unique searches)
    if (query.trim()) {
      const recent = getFromStorage<string[]>('flowpilot_recent_searches', []);
      const updated = [
        query.trim(),
        ...recent.filter((q) => q.toLowerCase() !== query.trim().toLowerCase()),
      ].slice(0, 5);
      setToStorage('flowpilot_recent_searches', updated);
      setRecentSearches(updated);
    }

    setSearchOpen(false);
    if (item.url) {
      navigate(item.url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSearchOpen(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'projects', label: 'Projects' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'members', label: 'Members' },
    { id: 'files', label: 'Files' },
  ];

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh] sm:pt-[15vh]">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl rounded-3xl border-[2.5px] border-ink bg-surface shadow-brutal-lg flex flex-col overflow-hidden max-h-[70vh] sm:max-h-[60vh]"
            onKeyDown={handleKeyDown}
          >
            {/* Header / Input */}
            <div className="relative flex items-center border-b-2 border-ink px-4 py-4 shrink-0">
              <Search className="h-5 w-5 text-ink shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search projects, tasks, members..."
                className="w-full bg-transparent text-ink text-base font-bold placeholder:text-muted/60 focus:outline-none pr-10"
                aria-label="Search items"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                aria-controls="command-palette-results"
                aria-activedescendant={results.length > 0 ? `option-${selectedIndex}` : undefined}
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl border border-ink p-1.5 hover:bg-yellow/20 transition-colors shadow-brutal-sm text-ink shrink-0"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Tabs (only show when there is a search query) */}
            {query.trim() && (
              <div className="flex gap-1.5 px-4 py-3 border-b-2 border-ink bg-background/50 overflow-x-auto scrollbar-thin shrink-0 select-none">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'px-3.5 py-1.5 text-xs font-extrabold rounded-xl border border-ink transition-all shrink-0',
                      activeTab === tab.id
                        ? 'bg-yellow text-ink shadow-brutal-sm -translate-y-px -translate-x-px'
                        : 'bg-surface hover:bg-yellow/20 text-muted hover:text-ink shadow-none'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
              {results.length > 0 ? (
                <div>
                  {!query.trim() && (
                    <div className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-muted/80 select-none">
                      Recent Searches
                    </div>
                  )}
                  <ul
                    ref={listRef}
                    id="command-palette-results"
                    role="listbox"
                    className="space-y-1 mt-1"
                  >
                    {results.map((item, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <li
                          key={item.id}
                          id={`option-${index}`}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelectResult(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border-2 border-transparent transition-all cursor-pointer select-none',
                            isSelected
                              ? 'bg-yellow/20 border-ink text-ink shadow-brutal-sm'
                              : 'hover:bg-yellow/10 text-muted hover:text-ink'
                          )}
                        >
                          {/* Left Icon box */}
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-ink bg-surface shadow-brutal-sm shrink-0">
                            {item.icon}
                          </div>

                          {/* Info Text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-sm text-ink truncate max-w-full">
                                {item.title}
                              </span>
                              <Badge
                                variant="default"
                                color={item.badgeColor}
                                className="shrink-0 h-4 px-1.5 text-[9px] border-2"
                              >
                                {item.badge}
                              </Badge>
                            </div>
                            {item.subtitle && (
                              <p className="text-xs text-muted truncate mt-0.5 font-medium">
                                {item.subtitle}
                              </p>
                            )}
                          </div>

                          {/* Selection indicator */}
                          <div className="shrink-0 flex items-center justify-center">
                            {item.type === 'recent' ? (
                              <ArrowRightIcon className="h-4 w-4 opacity-50" />
                            ) : (
                              <CornerDownLeft
                                className={cn(
                                  'h-4 w-4 transition-opacity',
                                  isSelected ? 'opacity-100 text-ink' : 'opacity-0'
                                )}
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="py-12 text-center select-none">
                  {query.trim() ? (
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm font-extrabold text-ink">No matching results found.</p>
                      <p className="text-xs text-muted mt-1">Try adjusting your query or changing the filter.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center px-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink bg-yellow/30 shadow-brutal-sm mb-4">
                        <Search className="h-6 w-6 text-ink" />
                      </div>
                      <p className="text-sm font-extrabold text-ink">Search FlowPilot</p>
                      <p className="text-xs text-muted mt-1 text-center max-w-xs leading-relaxed">
                        Start typing to search projects, tasks, team members, files, or navigation pages.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with keyboard guides */}
            <div className="border-t-2 border-ink px-4 py-3 bg-background/50 flex items-center justify-between text-[11px] font-black text-muted tracking-wide uppercase select-none shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-ink bg-surface px-1 py-0.5 text-[9px] shadow-brutal-sm">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-ink bg-surface px-1 py-0.5 text-[9px] shadow-brutal-sm">↵</kbd> Select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-ink bg-surface px-1 py-0.5 text-[9px] shadow-brutal-sm">Esc</kbd> Close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Arrow helper icon
function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
