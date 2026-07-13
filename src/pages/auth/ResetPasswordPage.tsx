import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const { user, getUsers, updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || user?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [step, setStep] = useState<'enter-email' | 'verify-questions' | 'reset-password' | 'success'>(
    initialEmail ? 'verify-questions' : 'enter-email'
  );
  const [questionsError, setQuestionsError] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [petName, setPetName] = useState('');
  const [favPlace, setFavPlace] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleEnterEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionsError('');
    if (!email) {
      setQuestionsError('Email address is required.');
      return;
    }
    const users = getUsers();
    const found = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      setQuestionsError('No account found with this email address.');
      return;
    }
    setStep('verify-questions');
  };

  const handleVerifyQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    setQuestionsError('');

    if (!placeOfBirth.trim() || !petName.trim() || !favPlace.trim()) {
      setQuestionsError('All answers are required.');
      return;
    }

    const users = getUsers();
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      setQuestionsError('Account not found.');
      return;
    }

    const q = foundUser.securityQuestions;
    if (!q) {
      // Legacy fallback (Delhi, Buddy, Paris)
      if (
        placeOfBirth.trim().toLowerCase() === 'delhi' &&
        petName.trim().toLowerCase() === 'buddy' &&
        favPlace.trim().toLowerCase() === 'paris'
      ) {
        setStep('reset-password');
      } else {
        setQuestionsError('Incorrect answers to security questions.');
      }
      return;
    }

    const matchBirth = q.placeOfBirth.trim().toLowerCase() === placeOfBirth.trim().toLowerCase();
    const matchPet = q.petName.trim().toLowerCase() === petName.trim().toLowerCase();
    const matchFav = q.favPlace.trim().toLowerCase() === favPlace.trim().toLowerCase();

    if (matchBirth && matchPet && matchFav) {
      setStep('reset-password');
    } else {
      setQuestionsError('Incorrect answers to security questions.');
    }
  };

  const onSubmitReset = async (data: ResetPasswordFormData) => {
    setQuestionsError('');
    setLoading(true);
    const updated = await updatePassword(email, data.password);
    setLoading(false);
    if (updated) {
      setStep('success');
      setTimeout(() => navigate(ROUTES.LOGIN), 2500);
    } else {
      setQuestionsError('Could not update password. Make sure you have a registered account.');
    }
  };

  if (step === 'success') {
    return (
      <AuthLayout title="Password updated!" subtitle="You're all set — redirecting to sign in.">
        <div className="rounded-3xl border-2 border-ink bg-secondary/20 p-8 shadow-brutal text-center animate-bounce">
          <CheckCircle className="h-12 w-12 mx-auto text-secondary mb-4" />
          <p className="text-lg font-bold text-ink">Your new password is ready to use.</p>
        </div>
      </AuthLayout>
    );
  }

  if (step === 'enter-email') {
    return (
      <AuthLayout title="Reset password" subtitle="Verify your email to recover your account.">
        <form onSubmit={handleEnterEmail} className="space-y-5">
          {questionsError && <ErrorBanner message={questionsError} onDismiss={() => setQuestionsError('')} />}

          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" className="w-full" size="lg">
            Verify Email
          </Button>

          <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </form>
      </AuthLayout>
    );
  }

  if (step === 'verify-questions') {
    return (
      <AuthLayout title="Verify Identity" subtitle="Answer security questions to reset your password.">
        <form onSubmit={handleVerifyQuestions} className="space-y-5">
          {questionsError && <ErrorBanner message={questionsError} onDismiss={() => setQuestionsError('')} />}

          <div className="rounded-2xl border-2 border-ink bg-yellow/10 p-4 text-xs text-ink font-medium leading-relaxed">
            <span className="font-bold block mb-1">💡 Default Answers for Pre-existing Accounts:</span>
            If you are resetting a legacy account, the default answers are:<br />
            1. Place of birth: <strong className="underline">Delhi</strong><br />
            2. Pet name: <strong className="underline">Buddy</strong><br />
            3. Favorite place to visit: <strong className="underline">Paris</strong>
          </div>

          <div className="space-y-4">
            <Input
              label="1. Place of birth"
              placeholder="Your answer"
              value={placeOfBirth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
            />
            <Input
              label="2. Pet name"
              placeholder="Your answer"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
            />
            <Input
              label="3. Favorite place to visit"
              placeholder="Your answer"
              value={favPlace}
              onChange={(e) => setFavPlace(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            Verify Answers
          </Button>

          <button
            type="button"
            onClick={() => setStep('enter-email')}
            className="flex items-center justify-center gap-2 w-full text-sm font-bold text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to email entry
          </button>
        </form>
      </AuthLayout>
    );
  }

  // step === 'reset-password'
  return (
    <AuthLayout title="Set new password" subtitle={`Choose a strong password for ${email}.`}>
      <form onSubmit={handleSubmit(onSubmitReset)} className="space-y-5">
        {questionsError && <ErrorBanner message={questionsError} onDismiss={() => setQuestionsError('')} />}

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

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Update Password
        </Button>

        <Link to={ROUTES.LOGIN} className="flex items-center justify-center gap-2 text-sm font-bold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </form>
    </AuthLayout>
  );
}
