import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/authSchemas';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { ErrorBanner } from '@/components/ui/ErrorBanner';

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { getUsers } = useAuth();

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError('');
    await new Promise((r) => setTimeout(r, 600));
    const users = getUsers();
    const found = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (!found) {
      setError('An account with this email address does not exist.');
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout title="Check your inbox" subtitle="We've sent password reset instructions.">
        <div className="rounded-3xl border-2 border-ink bg-yellow/20 p-6 shadow-brutal text-center">
          <Mail className="h-10 w-10 mx-auto text-ink mb-4" />
          <p className="text-base text-ink font-medium">
            If an account exists for <strong>{getValues('email')}</strong>, you&apos;ll receive a reset link shortly.
          </p>
        </div>
        <Link to={ROUTES.RESET_PASSWORD} state={{ email: getValues('email') }} className="block mt-6">
          <Button variant="outline" className="w-full">Continue to Reset Password</Button>
        </Link>
        <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2 mt-4 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot password?" subtitle="No worries — we'll help you get back in.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" className="w-full" size="lg">
          Send Reset Link
        </Button>

        <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
}
