import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/context/ToastContext';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useAuth } from '@/context/AuthContext';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/utils/authSchemas';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const { user, updatePassword } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError('');
    setLoading(true);

    if (!user) {
      setError('No authenticated user found.');
      setLoading(false);
      return;
    }

    if (user.password !== data.currentPassword) {
      setError('Current password is incorrect.');
      setLoading(false);
      return;
    }

    const success = updatePassword(user.email, data.newPassword);

    setLoading(false);

    if (success) {
      addToast('success', 'Password updated successfully.');
      reset();
      onClose();
    } else {
      setError('Failed to update password.');
    }
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        reset();
        setError('');
        onClose();
        }}
      title="Change Password"
    >
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {error && (
            <ErrorBanner
                message={error}
                onDismiss={() => setError('')}
            />
            )}
        <Input
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
        />

        <Input
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
        />
        <p className="-mt-3 text-xs text-muted">Must include uppercase, lowercase, number & special character.</p>

        <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
        />
        

        <div className="flex justify-end gap-3 ">
            

            <Button 
            type="submit"
            loading={loading}
            >
            Save Password
            </Button>
        </div>
        </form>
    </Modal>
  );
}