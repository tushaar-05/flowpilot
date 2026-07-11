export const APP_NAME = 'FlowPilot';
export const APP_TAGLINE = 'Manage projects. Collaborate better.';

export const ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  TASKS: '/tasks',
  KANBAN: '/kanban',
  CALENDAR: '/calendar',
  TIMELINE: '/timeline',
  TEAM: '/team',
  ACTIVITY: '/activity',
  FILES: '/files',
  NOTIFICATIONS: '/notifications',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const STORAGE_KEYS = {
  PROJECTS: 'flowpilot_projects',
  TASKS: 'flowpilot_tasks',
  NOTIFICATIONS: 'flowpilot_notifications',
  SETTINGS: 'flowpilot_settings',
  PROFILE: 'flowpilot_profile',
  THEME: 'flowpilot_theme',
  USERS: 'flowpilot_users',
  SESSION: 'flowpilot_session',
} as const;

export const API_DELAYS = {
  SHORT: 500,
  MEDIUM: 700,
  LONG: 1000,
} as const;

export const KANBAN_COLUMNS: { id: string; title: string; status: string }[] = [
  { id: 'todo', title: 'To Do', status: 'todo' },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
  { id: 'review', title: 'Review', status: 'review' },
  { id: 'completed', title: 'Completed', status: 'completed' },
];

export const PROJECT_STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning', color: 'bg-yellow/30 text-ink border-ink' },
  { value: 'active', label: 'Active', color: 'bg-primary/20 text-ink border-ink' },
  { value: 'on-hold', label: 'On Hold', color: 'bg-accent/20 text-ink border-ink' },
  { value: 'completed', label: 'Completed', color: 'bg-secondary/20 text-ink border-ink' },
  { value: 'archived', label: 'Archived', color: 'bg-slate-100 text-muted border-ink' },
];

export const PROJECT_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-slate-100 text-ink border-ink' },
  { value: 'medium', label: 'Medium', color: 'bg-primary/20 text-ink border-ink' },
  { value: 'high', label: 'High', color: 'bg-accent/25 text-ink border-ink' },
  { value: 'critical', label: 'Critical', color: 'bg-pink/25 text-ink border-ink' },
];

export const TASK_STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do', color: 'bg-yellow/30 text-ink border-ink' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-primary/20 text-ink border-ink' },
  { value: 'review', label: 'Review', color: 'bg-purple/20 text-ink border-ink' },
  { value: 'completed', label: 'Completed', color: 'bg-secondary/20 text-ink border-ink' },
];

export const TASK_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-slate-100 text-ink border-ink' },
  { value: 'medium', label: 'Medium', color: 'bg-primary/20 text-ink border-ink' },
  { value: 'high', label: 'High', color: 'bg-accent/25 text-ink border-ink' },
  { value: 'urgent', label: 'Urgent', color: 'bg-pink/25 text-ink border-ink' },
];

export const NOTIFICATION_CATEGORIES = [
  { value: 'task', label: 'Tasks' },
  { value: 'project', label: 'Projects' },
  { value: 'team', label: 'Team' },
  { value: 'system', label: 'System' },
  { value: 'file', label: 'Files' },
];

export const DEFAULT_SETTINGS = {
  language: 'en',
  timezone: 'America/New_York',
  dateFormat: 'MMM d, yyyy',
  emailNotifications: true,
  pushNotifications: true,
  taskReminders: true,
  weeklyDigest: false,
  compactMode: false,
  showAvatars: true,
  animationsEnabled: true,
  twoFactorEnabled: false,
  sessionTimeout: 30,
  defaultView: 'dashboard',
  itemsPerPage: 10,
};

export const LABEL_COLORS: Record<string, string> = {
  bug: 'bg-pink/25 text-ink border-ink',
  feature: 'bg-primary/20 text-ink border-ink',
  design: 'bg-purple/20 text-ink border-ink',
  docs: 'bg-secondary/20 text-ink border-ink',
  urgent: 'bg-accent/25 text-ink border-ink',
  backend: 'bg-slate-100 text-ink border-ink',
  frontend: 'bg-yellow/30 text-ink border-ink',
};

export const BRAND_COLORS = {
  blue: '#3B82F6',
  orange: '#F97316',
  yellow: '#FACC15',
  emerald: '#10B981',
  pink: '#EC4899',
  purple: '#8B5CF6',
} as const;
