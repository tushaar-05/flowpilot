export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type UserRole = 'admin' | 'manager' | 'member' | 'viewer';
export type NotificationCategory = 'task' | 'project' | 'team' | 'system' | 'file';
export type FileType = 'document' | 'image' | 'spreadsheet' | 'presentation' | 'archive' | 'other';
export type ActivityType = 'task' | 'project' | 'comment' | 'file' | 'team' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  phone: string;
  bio: string;
  skills: string[];
  joinedAt: string;
  projectIds: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  labels: string[];
  assigneeId: string;
  attachments: Attachment[];
  checklist: ChecklistItem[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  startDate: string;
  endDate: string;
  memberIds: string[];
  tags: string[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  projectId: string;
  folderId: string | null;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: string;
  action: string;
  target: string;
  projectId?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  website: string;
  skills: string[];
  avatar: string;
}

export interface AppSettings {
  theme?: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  taskReminders: boolean;
  weeklyDigest: boolean;
  compactMode: boolean;
  showAvatars: boolean;
  animationsEnabled: boolean;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  defaultView: string;
  itemsPerPage: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface DeletedItem {
  type: 'task' | 'project' | 'file' | 'notification';
  item: Task | Project | FileItem | Notification;
  deletedAt: number;
}

export interface AuthUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: string;
  securityQuestions?: {
    placeOfBirth: string;
    petName: string;
    favPlace: string;
  };
}

export interface AuthSession {
  email: string;
  rememberMe: boolean;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  audience: 'everyone' | 'team' | 'project';
  targetId?: string; // department name or project ID
  expiresAt?: string;
  pinned: boolean;
}

