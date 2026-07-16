import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types';
import { PROJECT_STATUS_OPTIONS, PROJECT_PRIORITY_OPTIONS } from '@/constants';

const schema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.string(),
  priority: z.string(),
  startDate: z.string(),
  endDate: z.string().min(1, 'End date is required'),
  color: z.string(),
});

type FormData = z.infer<typeof schema>;

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  project?: Project;
  loading?: boolean;
}

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

export function ProjectFormModal({ open, onClose, onSubmit, project, loading }: ProjectFormModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: project
      ? {
          name: project.name,
          description: project.description,
          status: project.status,
          priority: project.priority,
          startDate: project.startDate,
          endDate: project.endDate,
          color: project.color,
        }
      : {
          name: '',
          description: '',
          status: 'planning',
          priority: 'medium',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          color: '#3B82F6',
        },
  });

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        startDate: project.startDate,
        endDate: project.endDate,
        color: project.color,
      });
    } else {
      reset({
        name: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        color: '#3B82F6',
      });
    }
  }, [project, reset]);

  const selectedColor = watch('color');
  const nameValue = watch('name');

  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit Project' : 'Create Project'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Project Name</label>
          <input
            {...register('name')}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Enter project name"
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder="Describe the project"
          />
          {errors.description && <p className="mt-1 text-xs text-danger">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Status</label>
            <select
              {...register('status')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {PROJECT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Priority</label>
            <select
              {...register('priority')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {PROJECT_PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Start Date</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">End Date</label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Color</label>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className={`h-8 w-8 rounded-lg transition-transform ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={!isValid || (nameValue?.length ?? 0) < 3}>
            {project ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export type { FormData as ProjectFormData };
