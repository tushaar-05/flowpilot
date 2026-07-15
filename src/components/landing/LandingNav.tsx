import { Link } from 'react-router-dom';
import { Zap, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#testimonials', label: 'Stories' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to={ROUTES.LANDING} className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-primary shadow-brutal-sm">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-extrabold text-ink">FlowPilot</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-bold text-muted hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
            className="rounded-xl border-2 border-ink p-2 hover:bg-yellow/30 transition-colors shadow-brutal-sm bg-surface"
          >
            {theme === 'light' ? <Moon className="h-5 w-5 text-ink" /> : <Sun className="h-5 w-5 text-yellow" />}
          </button>
          {isAuthenticated ? (
            <Link to={ROUTES.DASHBOARD}>
              <Button size="sm">Open Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl border-2 border-ink bg-surface shadow-brutal-sm"
          >
            {theme === 'light' ? <Moon className="h-5 w-5 text-ink" /> : <Sun className="h-5 w-5 text-yellow" />}
          </button>
          <button className="p-2 rounded-xl border-2 border-ink bg-surface shadow-brutal-sm" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t-2 border-ink bg-background overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-base font-bold py-2">
                  {l.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER} onClick={() => setOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
                {!isAuthenticated && (
                  <Link to={ROUTES.LOGIN} onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
