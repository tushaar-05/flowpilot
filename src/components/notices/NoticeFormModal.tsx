import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import type { Notice } from '@/types';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  audience: z.enum(['everyone', 'team', 'project']),
  targetId: z.string().optional(),
  expiresAt: z.string().optional(),
  pinned: z.boolean(),
}).refine((data) => {
  if (data.audience !== 'everyone' && !data.targetId) {
    return false;
  }
  return true;
}, {
  message: 'Please select a specific target',
  path: ['targetId'],
});

type FormData = z.infer<typeof schema>;

interface NoticeFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  notice?: Notice;
  loading?: boolean;
}

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'Marketing', 'Operations'];

export function NoticeFormModal({ open, onClose, onSubmit, notice, loading }: NoticeFormModalProps) {
  const { projects } = useApp();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: notice
      ? {
          title: notice.title,
          description: notice.description,
          audience: notice.audience,
          targetId: notice.targetId,
          expiresAt: notice.expiresAt ? notice.expiresAt.split('T')[0] : '',
          pinned: notice.pinned,
        }
      : {
          title: '',
          description: '',
          audience: 'everyone',
          targetId: '',
          expiresAt: '',
          pinned: false,
        },
  });

  const audienceValue = watch('audience');

  useEffect(() => {
    if (notice) {
      reset({
        title: notice.title,
        description: notice.description,
        audience: notice.audience,
        targetId: notice.targetId || '',
        expiresAt: notice.expiresAt ? notice.expiresAt.split('T')[0] : '',
        pinned: notice.pinned,
      });
    } else {
      reset({
        title: '',
        description: '',
        audience: 'everyone',
        targetId: '',
        expiresAt: '',
        pinned: false,
      });
    }
  }, [notice, reset, open]);

  // Reset targetId if audience changes
  useEffect(() => {
    if (!notice) {
      setValue('targetId', '');
    }
  }, [audienceValue, setValue, notice]);

  return (
    <Modal open={open} onClose={onClose} title={notice ? 'Edit Notice' : 'Create Announcement'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-ink mb-1.5">Announcement Title</label>
          <input
            {...register('title')}
            className="w-full rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-base font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm"
            placeholder="e.g., Company Holiday, Extra Working Day"
          />
          {errors.title && <p className="mt-1.5 text-sm font-semibold text-danger">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-ink mb-1.5">Description / Body</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-base font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm resize-none"
            placeholder="Type your announcement detail here..."
          />
          {errors.description && <p className="mt-1.5 text-sm font-semibold text-danger">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Audience</label>
            <select
              {...register('audience')}
              className="w-full rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-base font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm"
            >
              <option value="everyone">Everyone (All Staff)</option>
              <option value="team">Team / Department</option>
              <option value="project">Project Members</option>
            </select>
          </div>

          <div>
            {audienceValue === 'team' && (
              <>
                <label className="block text-sm font-bold text-ink mb-1.5">Select Team</label>
                <select
                  {...register('targetId')}
                  className="w-full rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-base font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm"
                >
                  <option value="">-- Choose Team --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.targetId && <p className="mt-1.5 text-sm font-semibold text-danger">{errors.targetId.message}</p>}
              </>
            )}

            {audienceValue === 'project' && (
              <>
                <label className="block text-sm font-bold text-ink mb-1.5">Select Project</label>
                <select
                  {...register('targetId')}
                  className="w-full rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-base font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm"
                >
                  <option value="">-- Choose Project --</option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))}
                </select>
                {errors.targetId && <p className="mt-1.5 text-sm font-semibold text-danger">{errors.targetId.message}</p>}
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Expiration Date (Optional)</label>
            <input
              type="date"
              {...register('expiresAt')}
              className="w-full rounded-2xl border-2 border-ink bg-surface px-4 py-3 text-base font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary shadow-brutal-sm"
            />
          </div>

          <div className="flex items-center pt-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('pinned')}
                className="h-5 w-5 rounded border-2 border-ink text-primary focus:ring-primary"
              />
              <span className="text-sm font-bold text-ink">Pin this announcement to top</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t-2 border-ink/10">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={!isValid}>
            {notice ? 'Save Changes' : 'Publish Notice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export type { FormData as NoticeFormData };
