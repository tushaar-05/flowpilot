import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type {
  Project,
  Task,
  User,
  Notification,
  FileItem,
  ActivityItem,
  UserProfile,
  AppSettings,
  DeletedItem,
} from '@/types';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '@/constants';
import { getFromStorage, setToStorage, removeFromStorage } from '@/utils/storage';
import { generateId } from '@/utils/helpers';
import { fetchProjects, createProjectApi, updateProjectApi, deleteProjectApi } from '@/services/projectService';
import { fetchTasks, createTaskApi, updateTaskApi, deleteTaskApi } from '@/services/taskService';
import { fetchUsers, fetchCurrentUser } from '@/services/userService';
import { fetchNotifications } from '@/services/notificationService';
import { fetchFiles } from '@/services/fileService';
import { fetchActivity } from '@/services/activityService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface AppContextValue {
  loading: boolean;
  projects: Project[];
  tasks: Task[];
  users: User[];
  currentUser: User | null;
  notifications: Notification[];
  files: FileItem[];
  activity: ActivityItem[];
  profile: UserProfile;
  settings: AppSettings;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  createProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  undoDelete: () => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  reorderTasks: (tasks: Task[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  updateProfile: (profile: UserProfile) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  uploadFile: (file: Omit<FileItem, 'id' | 'uploadedAt'>) => void;
  deleteFile: (id: string) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const defaultProfile: UserProfile = {
  id: 'user-1',
  name: 'Sarah Chen',
  email: 'sarah.chen@flowpilot.io',
  phone: '+1 (415) 555-0142',
  bio: 'Full-stack engineer with 8 years of experience building SaaS products.',
  location: 'San Francisco, CA',
  website: 'https://sarahchen.dev',
  skills: ['React', 'TypeScript', 'Node.js', 'System Design', 'Leadership'],
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast();
  const { user: authUser, updateAuthUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [settings, setSettings] = useState<AppSettings>(() =>
    getFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [deletedStack, setDeletedStack] = useState<DeletedItem[]>([]);
  const pendingUpdates = useRef<Map<string, number>>(new Map());

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsData, tasksData, usersData, user, notifs, filesData, activityData] =
        await Promise.all([
          fetchProjects(),
          fetchTasks(),
          fetchUsers(),
          fetchCurrentUser(),
          fetchNotifications(),
          fetchFiles(),
          fetchActivity(),
        ]);

      const storedProjects = getFromStorage<Project[] | null>(STORAGE_KEYS.PROJECTS, null);
      const storedTasks = getFromStorage<Task[] | null>(STORAGE_KEYS.TASKS, null);
      const storedNotifs = getFromStorage<Notification[] | null>(STORAGE_KEYS.NOTIFICATIONS, null);

      setProjects(storedProjects ?? projectsData);
      setTasks(storedTasks ?? tasksData);
      setUsers(usersData);
      setCurrentUser(user);
      setNotifications(storedNotifs ?? notifs);
      setFiles(filesData);
      setActivity(activityData);
    } catch {
      addToast('error', 'Failed to load application data');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (loading) return;

    if (authUser) {
      const found = users.find((u) => u.email.toLowerCase() === authUser.email.toLowerCase());
      if (found) {
        setCurrentUser(found);
      } else {
        setCurrentUser({
          id: authUser.email,
          name: authUser.name,
          email: authUser.email,
          role: 'member',
          avatar: authUser.avatar,
          department: 'General',
          phone: '',
          bio: '',
          skills: [],
          joinedAt: authUser.createdAt || new Date().toISOString(),
          projectIds: [],
        });
      }

      // Load user-specific profile
      const userProfileKey = `${STORAGE_KEYS.PROFILE}_${authUser.email.toLowerCase()}`;
      const initialProfile: UserProfile = {
        id: found?.id || authUser.email,
        name: found?.name || authUser.name,
        email: found?.email || authUser.email,
        phone: found?.phone || '',
        bio: found?.bio || '',
        location: '',
        website: '',
        skills: found?.skills || [],
        avatar: found?.avatar || authUser.avatar,
      };
      setProfile(getFromStorage<UserProfile>(userProfileKey, initialProfile));
    } else {
      setCurrentUser(null);
      setProfile(defaultProfile);
    }
  }, [authUser, users, loading]);

  useEffect(() => {
    if (!loading && projects.length > 0) {
      setToStorage(STORAGE_KEYS.PROJECTS, projects);
    }
  }, [projects, loading]);

  useEffect(() => {
    if (!loading && tasks.length > 0) {
      setToStorage(STORAGE_KEYS.TASKS, tasks);
    }
  }, [tasks, loading]);

  useEffect(() => {
    setToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    if (!loading) {
      setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications.filter((n) => n.read));
    }
  }, [notifications, loading]);

  const createProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const project: Project = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    setProjects((prev) => [project, ...prev]);
    addToast('success', `Project "${project.name}" created`);
    try {
      await createProjectApi(project);
    } catch {
      addToast('error', 'Failed to sync project');
    }
  };

  const updateProject = async (project: Project) => {
    const updateId = project.id;
    const timestamp = Date.now();
    pendingUpdates.current.set(updateId, timestamp);

    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p))
    );

    try {
      const result = await updateProjectApi(project);
      setProjects((prev) =>
        prev.map((p) => (p.id === result.id ? result : p))
      );
      pendingUpdates.current.delete(updateId);
    } catch {
      addToast('error', 'Failed to update project');
    }
  };

  const deleteProject = async (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletedStack((prev) => [...prev, { type: 'project', item: project, deletedAt: Date.now() }]);
    addToast('success', 'Project deleted');
    try {
      await deleteProjectApi(id);
    } catch {
      addToast('error', 'Failed to delete project');
    }
  };

  const createTask = async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const task: Task = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [task, ...prev]);
    addToast('success', `Task "${task.title}" created`);

    try {
      await createTaskApi(task);
    } catch {
      addToast('error', 'Failed to create task');
    }
  };

  const updateTask = async (task: Task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...task, updatedAt: new Date().toISOString() } : t))
    );
    try {
      await updateTaskApi(task);
    } catch {
      addToast('error', 'Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeletedStack((prev) => [...prev, { type: 'task', item: task, deletedAt: Date.now() }]);
    addToast('success', 'Task deleted');

    try {
      await deleteTaskApi(id);
    } catch {
      addToast('error', 'Failed to delete task');
    }
  };

  const undoDelete = () => {
    if (deletedStack.length === 0) return;
    const toRestore = deletedStack[0];
    setDeletedStack((prev) => prev.slice(1));

    if (toRestore.type === 'task') {
      setTasks((prev) => [...prev, toRestore.item as Task]);
    } else {
      setProjects((prev) => [...prev, toRestore.item as Project]);
    }
    addToast('info', 'Item restored');
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const reorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      setToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateProfile = (updated: UserProfile) => {
    setProfile(updated);
    if (authUser) {
      const userProfileKey = `${STORAGE_KEYS.PROFILE}_${updated.email.toLowerCase()}`;
      setToStorage(userProfileKey, updated);

      const updatedFields = {
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        bio: updated.bio,
        skills: updated.skills,
        avatar: updated.avatar,
      };

      // Sync the user list in state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.email.toLowerCase() === authUser.email.toLowerCase()
            ? { ...u, ...updatedFields }
            : u
        )
      );

      // Also update the currentUser state directly
      setCurrentUser((prev) => (prev ? { ...prev, ...updatedFields } : null));

      // If email changed, remove the old profile storage key
      if (authUser.email.toLowerCase() !== updated.email.toLowerCase()) {
        removeFromStorage(`${STORAGE_KEYS.PROFILE}_${authUser.email.toLowerCase()}`);
      }

      // Also update authUser, STORAGE_KEYS.USERS, and flowpilot_session
      updateAuthUser(updated.name, updated.email, updated.avatar);
    }
    addToast('success', 'Profile updated');
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
    addToast('success', 'Settings saved');
  };

  const uploadFile = (data: Omit<FileItem, 'id' | 'uploadedAt'>) => {
    const file: FileItem = {
      ...data,
      id: generateId(),
      uploadedAt: new Date().toISOString(),
    };
    setFiles((prev) => [file, ...prev]);
    addToast('success', `File "${file.name}" uploaded`);
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    addToast('success', 'File deleted');
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        projects,
        tasks,
        users,
        currentUser,
        notifications,
        files,
        activity,
        profile,
        settings,
        sidebarOpen,
        setSidebarOpen,
        createProject,
        updateProject,
        deleteProject,
        createTask,
        updateTask,
        deleteTask,
        undoDelete,
        updateTaskStatus,
        reorderTasks,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        updateProfile,
        updateSettings,
        uploadFile,
        deleteFile,
        refreshData: loadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
