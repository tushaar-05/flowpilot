import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Columns3,
  Calendar,
  GanttChart,
  Users,
  Activity,
  FileText,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  Zap,
  LogOut,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants';

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.PROJECTS, label: 'Projects', icon: FolderKanban },
  { to: ROUTES.TASKS, label: 'Tasks', icon: CheckSquare },
  { to: ROUTES.KANBAN, label: 'Kanban', icon: Columns3 },
  { to: ROUTES.CALENDAR, label: 'Calendar', icon: Calendar },
  { to: ROUTES.TIMELINE, label: 'Timeline', icon: GanttChart },
  { to: ROUTES.TEAM, label: 'Team', icon: Users },
  { to: ROUTES.ACTIVITY, label: 'Activity', icon: Activity },
  { to: ROUTES.FILES, label: 'Files', icon: FileText },
  { to: ROUTES.NOTIFICATIONS, label: 'Notifications', icon: Bell },
  { to: ROUTES.ANALYTICS, label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, notifications } = useApp();
  const { logout } = useAuth();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-full flex-col border-r-2 border-ink bg-white transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-[76px]',
        'max-md:shadow-brutal-lg',
        !sidebarOpen && 'max-md:-translate-x-full max-md:w-64'
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b-2 border-ink px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-primary shadow-brutal-sm">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <h1 className="text-lg font-extrabold text-ink">FlowPilot</h1>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Workspace</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 scrollbar-thin">
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => {
                if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all duration-150 border-2',
                    isActive
                      ? 'bg-yellow/30 border-ink text-ink shadow-brutal-sm'
                      : 'border-transparent text-muted hover:bg-background hover:text-ink hover:border-ink/20'
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="flex-1">{item.label}</span>}
                {sidebarOpen && item.to === ROUTES.NOTIFICATIONS && unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-pink px-1.5 text-[10px] font-extrabold text-white">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t-2 border-ink px-3 py-4 space-y-1.5">
        <NavLink
          to={ROUTES.SETTINGS}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-all border-2',
              isActive ? 'bg-yellow/30 border-ink shadow-brutal-sm' : 'border-transparent text-muted hover:text-ink'
            )
          }
        >
          <Settings className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </NavLink>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-muted hover:text-danger hover:bg-red-50 border-2 border-transparent transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span>Log out</span>}
        </button>
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          'absolute -right-3.5 top-20 flex h-7 w-7 items-center justify-center rounded-xl border-2 border-ink bg-yellow shadow-brutal-sm hover:shadow-brutal',
          !sidebarOpen && 'max-md:hidden'
        )}
      >
        <ChevronLeft className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')} />
      </button>
    </aside>
  );
}
