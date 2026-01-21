import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  Loader2,
  Lock,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Logo from '../assets/Logo.png';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one capital letter')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"|,.<>?]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Invalid reset link. Please request a new password reset.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.resetPassword({
        token,
        password: data.password,
      });

      setSuccess(true);
      toast({
        title: 'Password reset successful!',
        description: 'You can now sign in with your new password.',
      });

      // Redirect to auth page after a delay
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative px-4 py-12 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-[#226F75]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10" />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#226F75]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#253E44]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        <div className="w-full max-w-md relative z-10">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-2 shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#226F75] to-[#253E44] rounded-full blur opacity-40 animate-pulse" />
                  <div className="relative bg-gradient-to-r from-[#226F75] to-[#253E44] p-4 rounded-full">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#226F75] to-[#253E44] bg-clip-text text-transparent">
                  Password Reset Successful!
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Your password has been updated. You can now sign in with your new password.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Redirecting to sign in page...
                </p>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 text-sm text-[#226F75] hover:text-[#253E44] font-medium underline mt-2"
                >
                  Go to sign in now
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center relative px-4 py-12 overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-[#226F75]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10" />

        <div className="w-full max-w-md relative z-10">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-2 shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-full blur opacity-50" />
                  <div className="relative bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-full">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-red-600">
                  Invalid Reset Link
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  This password reset link is invalid or has expired.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center gap-2 text-[#226F75]/60 hover:text-[#226F75]/70 font-medium underline"
                >
                  Request a new password reset
                </Link>

                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-[#226F75]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#226F75]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#253E44]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 text-sm text-[#226F75] hover:text-[#253E44] transition-colors mb-6 group font-medium"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to sign in
        </Link>

        <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/80 border-2 border-white/50 rounded-3xl shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8 bg-gradient-to-b from-[#226F75]/5 to-transparent rounded-t-3xl">
            <div className="flex justify-center">
              <img src={Logo} alt="Build Trust Logo" className="h-16 w-auto" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#226F75] to-[#253E44] bg-clip-text text-transparent">
                Reset Your Password
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Enter your new password below.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    className="pl-10 pr-10 h-12 border-2 focus:border-[#226F75] focus:ring-[#226F75]/20 transition-all"
                    {...form.register('password')}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.password.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters, include 1 capital letter and 1 special character
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    className="pl-10 pr-10 h-12 border-2 focus:border-[#226F75] focus:ring-[#226F75]/20 transition-all"
                    {...form.register('confirmPassword')}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                    disabled={loading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Reset Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Trusted by diaspora Nigerians worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
