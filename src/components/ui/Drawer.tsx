import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-md border-l-2 border-ink bg-surface shadow-brutal-lg"
          >
            <div className="flex items-center justify-between border-b-2 border-ink px-6 py-5">
              <h2 className="text-xl font-extrabold text-ink">{title}</h2>
              <button onClick={onClose} className="rounded-xl border-2 border-ink p-2 hover:bg-yellow/30 shadow-brutal-sm">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 h-[calc(100%-73px)] scrollbar-thin">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
