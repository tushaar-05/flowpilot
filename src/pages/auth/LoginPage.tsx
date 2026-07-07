import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, type LoginFormData } from '@/utils/authSchemas';
import { ROUTES } from '@/constants';
import { ErrorBanner } from '@/components/ui/ErrorBanner';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? ROUTES.DASHBOARD;

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: true },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setLoading(true);
    const result = await login(data.email, data.password, data.rememberMe);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to pick up where your team left off.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="text"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-start justify-between">
          <label className="block cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 rounded border-2 border-ink accent-primary"
            />
            <span className="block text-sm font-semibold text-ink mt-1">
              Remember me
            </span>
          </label>

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-bold text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign In
        </Button>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link to={ROUTES.REGISTER} className="font-bold text-primary hover:underline">
            Create one free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
