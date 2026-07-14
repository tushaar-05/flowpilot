import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/context/AuthContext';
import { registerSchema, type RegisterFormData } from '@/utils/authSchemas';
import { ROUTES } from '@/constants';
import { ErrorBanner } from '@/components/ui/ErrorBanner';

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setLoading(true);
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      placeOfBirth: data.placeOfBirth,
      petName: data.petName,
      favPlace: data.favPlace,
    });
    setLoading(false);

    if (result.success) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    } else {
      setError(result.error ?? 'Registration failed');
    }
  };

  return (
    <AuthLayout title="Start shipping faster" subtitle="Create your free workspace in under a minute.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

        <Input
          label="Full Name"
          placeholder="Alex Rivera"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="alex@northwindlabs.io"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <p className="-mt-3 text-xs text-muted">Must include uppercase, lowercase, number & special character.</p>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="border-t-2 border-dashed border-ink/20 pt-4">
          <p className="text-sm font-bold text-ink mb-3">Security Questions (For Password Reset)</p>
          <div className="space-y-4">
            <Input
              label="Place of birth"
              placeholder="e.g. New Delhi"
              error={errors.placeOfBirth?.message}
              {...register('placeOfBirth')}
            />
            <Input
              label="Pet name"
              placeholder="e.g. Buddy"
              error={errors.petName?.message}
              {...register('petName')}
            />
            <Input
              label="Favorite place to visit"
              placeholder="e.g. Paris"
              error={errors.favPlace?.message}
              {...register('favPlace')}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create Account
        </Button>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
