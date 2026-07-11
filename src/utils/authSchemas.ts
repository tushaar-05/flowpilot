import { z } from 'zod';

// Reusable strong password Zod schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/, 'Password must contain at least one special character');

// Login keeps the old min(6) so existing users can still sign in
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

//adding a new Schema for changing password with current password, new password and confirm password fields(we can reuse the resetPasswordSchema for new password and confirm password validation but i find creating a new schema for change password more readable and clear)
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});


export const profileSchema = z.object({
  id: z.string(),

  name: z.string().trim().min(2, 'Name must be at least 2 characters'),

  email: z.string().trim().email('Enter a valid email address'),

  phone: z.string().trim()
  .regex(/^\d+$/, 'Phone must contain only numbers')
  .min(10, 'Phone must be at least 10 digits')
  .max(12, 'Phone must be at most 12 digits')
  .optional().or(z.literal('')),

  location: z.string().trim(),
  bio: z.string().trim().max(200, 'Bio must be at most 200 characters'),

  website: z.string().trim().refine(
    (value) => value === '' || z.string().url().safeParse(value).success, {
    message: 'Enter a valid URL (e.g., https://example.com)',
  }),
  
  skills: z.array(z.string().trim()),
  avatar: z.string().trim(),
});


export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;