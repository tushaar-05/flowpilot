import { format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import type { TaskPriority, TaskStatus, ProjectPriority, ProjectStatus } from '@/types';

export function formatDate(date: string, dateFormat = 'MMM d, yyyy'): string {
  return format(parseISO(date), dateFormat);
}

export function formatRelative(date: string | number): string {
  return formatDistanceToNow(typeof date === 'number' ? date : parseISO(date), { addSuffix: true });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getDueDateLabel(date: string): { label: string; className: string } {
  const parsed = parseISO(date);
  if (isPast(parsed)) return { label: 'Overdue', className: 'text-red-600' };
  if (isToday(parsed)) return { label: 'Today', className: 'text-amber-600' };
  if (isTomorrow(parsed)) return { label: 'Tomorrow', className: 'text-blue-600' };
  return { label: formatDate(date), className: 'text-muted' };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 3);
}

export function getStatusColor(status: TaskStatus | ProjectStatus): string {
  const colors: Record<string, string> = {
    todo: 'bg-yellow/30 text-ink border-ink',
    planning: 'bg-yellow/30 text-ink border-ink',
    'in-progress': 'bg-primary/20 text-ink border-ink',
    active: 'bg-primary/20 text-ink border-ink',
    review: 'bg-purple/20 text-ink border-ink',
    completed: 'bg-secondary/20 text-ink border-ink',
    'on-hold': 'bg-accent/20 text-ink border-ink',
    archived: 'bg-slate-100 text-muted border-ink',
  };
  return colors[status] ?? 'bg-slate-100 text-ink border-ink';
}

export function getPriorityColor(priority: TaskPriority | ProjectPriority): string {
  const colors: Record<string, string> = {
    low: 'bg-slate-100 text-ink border-ink',
    medium: 'bg-primary/20 text-ink border-ink',
    high: 'bg-accent/25 text-ink border-ink',
    urgent: 'bg-pink/25 text-ink border-ink',
    critical: 'bg-pink/25 text-ink border-ink',
  };
  return colors[priority] ?? 'bg-slate-100 text-ink border-ink';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}
