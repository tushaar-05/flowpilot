import { Link } from 'react-router-dom';
import { Menu, Search, Plus, Bell } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { SearchBar } from '@/components/ui/SearchBar';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { ROUTES } from '@/constants';
import { useState } from 'react';

export function Navbar() {
  const { sidebarOpen, setSidebarOpen, notifications, profile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b-2 border-ink bg-background/95 backdrop-blur-md px-4 sm:px-6">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-xl border-2 border-ink p-2.5 hover:bg-yellow/30 transition-colors shadow-brutal-sm md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search anything..."
          />
        </div>
      </div>
<div className="flex items-center gap-2 sm:gap-3">
  <Link to={`${ROUTES.TASKS}?newTask=true`} className="hidden sm:block">
   <Button size="sm" variant="dark" className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:scale-105"> 
      <Plus className="h-4 w-4" /> New Task
    </Button>
  </Link>
        <Link
          to={ROUTES.NOTIFICATIONS}
          className="relative rounded-xl border-2 border-ink p-2.5 hover:bg-yellow/30 transition-colors shadow-brutal-sm"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-pink text-[10px] font-extrabold text-white">
              {unread}
            </span>
          )}
        </Link>
        <button className="rounded-xl border-2 border-ink p-2.5 sm:hidden shadow-brutal-sm">
          <Search className="h-5 w-5" />
        </button>
        <Link
          to={ROUTES.PROFILE}
          className="flex items-center gap-2.5 rounded-2xl border-2 border-ink bg-white pl-1.5 pr-3 py-1.5 hover:shadow-brutal-sm transition-all"
        >
          <Avatar src={profile?.avatar} name={profile?.name ?? 'User'} size="sm" />
          <span className="hidden lg:block text-sm font-extrabold max-w-[120px] truncate">{profile?.name}</span>
        </Link>
      </div>
    </header>
  );
}
