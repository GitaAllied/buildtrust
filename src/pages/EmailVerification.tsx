import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Link } from "react-router-dom";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();

  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if token is in URL params
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      // Wrap async call in IIFE since useEffect can't be async
      (async () => {
        await handleVerification(urlToken);
      })();
    }
  }, [searchParams]);

  // Get user email for resend functionality
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    } else {
      // Fallback: check localStorage for pending verification email
      const storedEmail = localStorage.getItem('pending_verification_email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [user]);

  // If the user is already verified, force-redirect them away from this page
  useEffect(() => {
    if (user?.email_verified) {
      const role = user.role === 'developer' ? 'developer' : 'client';
      navigate(`/?setup=${role}`, { replace: true });
    }
  }, [user, navigate]);

  const handleVerification = async (verificationToken: string) => {
    setVerifying(true);
    setError(null);

    try {
      const response = await (apiClient as any).verifyEmail({ token: verificationToken });
      setVerified(true);

      // Clear pending email after successful verification
      localStorage.removeItem('pending_verification_email');
      
      // Update the auth context with the new user data
      await refreshUser();

      toast({
        title: 'Email verified!',
        description: 'Your email has been successfully verified.',
      });

      // Redirect to setup after a short delay
      setTimeout(() => {
        if (user?.role === 'developer') {
          navigate('/?setup=developer');
        } else {
          navigate('/?setup=client');
        }
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      setError(errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  const handleManualVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter a verification token');
      return;
    }
    await handleVerification(token);
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('No email address found. Please sign in again.');
      return;
    }

    setResending(true);
    setError(null);

    try {
      await (apiClient as any).resendVerification({ email });
      toast({
        title: 'Verification email sent!',
        description: 'Please check your email for the new verification link.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email';
      setError(errorMessage);
    } finally {
      setResending(false);
    }
  };

  if (verified) {
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
            <CardHeader className="text-center space-y-4 pb-8 bg-gradient-to-b from-green-50 to-transparent rounded-t-3xl">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#226F75] to-[#253E44] rounded-full blur opacity-40 animate-pulse" />
                  <div className="relative bg-gradient-to-r from-[#226F75] to-[#253E44] p-4 rounded-full">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#226F75] to-[#253E44] bg-clip-text text-transparent">
                  Email Verified!
                </CardTitle>
                <CardDescription className="text-base mt-2 text-gray-600">
                  Your email has been successfully verified. Redirecting you to setup...
                </CardDescription>
              </div>
            </CardHeader>
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
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 text-sm text-[#226F75] hover:text-[#253E44] transition-colors mb-6 group font-medium"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to sign in
        </Link>

        <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/80 border-2 border-white/50 rounded-3xl shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8 bg-gradient-to-b from-blue-50 to-transparent rounded-t-3xl">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#226F75] to-[#253E44] rounded-full blur opacity-40 animate-pulse" />
                <div className="relative bg-gradient-to-r from-[#226F75] to-[#253E44] p-3 rounded-full">
                  <Mail className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-base mt-2">
                We've sent a verification link to your email address
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Check your email and click the verification link, or enter the token manually below.
              </p>

              <form onSubmit={handleManualVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Verification Token
                  </Label>
                  <Input
                    id="token"
                    type="text"
                    placeholder="Enter your verification token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="h-12 border-2 focus:border-green-500 focus:ring-green-500/20 transition-all"
                    disabled={verifying}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  disabled={verifying || !token.trim()}
                >
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Verify Email
                    </>
                  )}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or request a new one.
                </p>

                <Button
                  variant="outline"
                  onClick={handleResendVerification}
                  className="w-full border-green-200 hover:border-green-300 hover:bg-green-50"
                  disabled={resending}
                >
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}
