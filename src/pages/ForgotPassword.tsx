import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Mail,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Logo from '../assets/Logo.png';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.forgotPassword({
        email: data.email,
      });

      setSuccess(true);
      toast({
        title: 'Reset email sent!',
        description: 'Check your email for password reset instructions.',
      });
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
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10" />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#226F75]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#253E44]/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        <div className="w-full max-w-md relative z-10">
          <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/80 border-2 border-white/50 rounded-3xl shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-8 bg-gradient-to-b from-[#226F75]/5 to-transparent rounded-t-3xl">
              <div className="flex justify-center">
                <img src={Logo} alt="Build Trust Logo" className="h-16 w-auto" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#226F75] to-[#253E44] bg-clip-text text-transparent">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  We've sent password reset instructions to your email address.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-[#226F75] hover:text-[#253E44] font-medium underline"
                  >
                    try again
                  </button>
                </p>

                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 text-sm text-[#226F75] hover:text-[#253E44] transition-colors font-medium"
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
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10" />

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
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Enter your email address and we'll send you a link to reset your password.
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
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 h-12 border-2 focus:border-[#226F75] focus:ring-[#226F75]/20 transition-all"
                    {...form.register('email')}
                    disabled={loading}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.email.message}
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
                    Sending reset email...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    Send Reset Email
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/auth"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Remember your password? <span className="text-[#226F75] hover:text-[#253E44] font-medium">Sign in</span>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Trusted by diaspora Africa worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
