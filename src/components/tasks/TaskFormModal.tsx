import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Task } from '@/types';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS } from '@/constants';
import { useApp } from '@/context/AppContext';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  priority: z.string(),
  status: z.string(),
  dueDate: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
  assigneeId: z.string().min(1, 'Assignee is required'),
  labels: z.string(),
});

type FormData = z.infer<typeof schema>;

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  task?: Task;
  defaultProjectId?: string;
  loading?: boolean;
}

export function TaskFormModal({ open, onClose, onSubmit, task, defaultProjectId, loading }: TaskFormModalProps) {
  const { projects, users } = useApp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          projectId: task.projectId,
          assigneeId: task.assigneeId,
          labels: task.labels.join(', '),
        }
      : {
          title: '',
          description: '',
          priority: 'medium',
          status: 'todo',
          dueDate: '',
          projectId: defaultProjectId ?? '',
          assigneeId: '',
          labels: '',
        },
  });

  useEffect(() => {
    if (open) {
      reset(
        task
          ? {
              title: task.title,
              description: task.description,
              priority: task.priority,
              status: task.status,
              dueDate: task.dueDate,
              projectId: task.projectId,
              assigneeId: task.assigneeId,
              labels: task.labels.join(', '),
            }
          : {
              title: '',
              description: '',
              priority: 'medium',
              status: 'todo',
              dueDate: '',
              projectId: defaultProjectId ?? '',
              assigneeId: '',
              labels: '',
            }
      );
    }
  }, [open, task, defaultProjectId, reset]);

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'Create Task'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            {...register('title')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Task title"
          />
          {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div>
            <label className="block text-sm font-medium mb-1.5">Project</label>
            <select
              {...register('projectId')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.projectId && <p className="mt-1 text-xs text-danger">{errors.projectId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Assignee</label>
            <select
              {...register('assigneeId')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="">Select member</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {errors.assigneeId && <p className="mt-1 text-xs text-danger">{errors.assigneeId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select {...register('status')} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
              {TASK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Priority</label>
            <select {...register('priority')} className="w-full rounded-lg border border-border px-3 py-2 text-sm">
              {TASK_PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Due Date</label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Labels (comma separated)</label>
          <input
            {...register('labels')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="bug, feature, design"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export type { FormData as TaskFormData };
