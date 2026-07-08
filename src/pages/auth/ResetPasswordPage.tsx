import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/context/AuthContext';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/utils/authSchemas';
import { ROUTES } from '@/constants';
import { ErrorBanner } from '@/components/ui/ErrorBanner';

export function ResetPasswordPage() {
  const { user, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError('');
    const email = user?.email;
    if (!email) {
      setError('Please sign in first or use the forgot password flow with a registered email.');
      return;
    }

    const updated = updatePassword(email, data.password);
    if (updated) {
      setSuccess(true);
      setTimeout(() => navigate(ROUTES.LOGIN), 2000);
    } else {
      setError('Could not update password. Make sure you have a registered account.');
    }
  };

  if (success) {
    return (
      <AuthLayout title="Password updated!" subtitle="You're all set — redirecting to sign in.">
        <div className="rounded-3xl border-2 border-ink bg-secondary/20 p-8 shadow-brutal text-center">
          <CheckCircle className="h-12 w-12 mx-auto text-secondary mb-4" />
          <p className="text-lg font-bold text-ink">Your new password is ready to use.</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set new password" subtitle="Choose a strong password for your account.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

        <Input
          label="New Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <p className="-mt-3 text-xs text-muted">Must include uppercase, lowercase, number & special character.</p>

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" className="w-full" size="lg">
          Update Password
        </Button>

        <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
}
