import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  Loader2, 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn, 
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one capital letter')
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Auth() {
  const [signInLoading, setSignInLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('signin');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();

  // Check for developer setup intent
  const searchParams = new URLSearchParams(window.location.search);
  const setupIntent = searchParams.get('intent');

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Clear errors and reset forms when switching tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSignInError(null);
    setSignUpError(null);
    setShowSignInPassword(false);
    setShowSignUpPassword(false);
    setShowConfirmPassword(false);
    signInForm.reset();
    signUpForm.reset();
  };

  const handleSignIn = async (data: SignInFormData) => {
    setSignInLoading(true);
    setSignInError(null);

    try {
      const response = await (apiClient as any).login({
        email: data.email,
        password: data.password,
      });

      localStorage.setItem('auth_token', response.token);
      await refreshUser();
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });

      // Redirect based on intent
      if (setupIntent === 'developer-setup') {
        navigate('/?setup=developer');
      } else if (setupIntent === 'client-setup') {
        navigate('/?setup=client');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      if (errorMessage.includes('Invalid') || errorMessage.includes('password')) {
        setSignInError('Invalid email or password. Please try again.');
      } else {
        setSignInError(errorMessage);
      }
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    setSignUpLoading(true);
    setSignUpError(null);

    try {
      const response = await (apiClient as any).signup({
        email: data.email,
        password: data.password,
      });

      // Store token for email verification page
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('pending_verification_email', data.email);
      await refreshUser();

      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      });

      // Redirect to email verification page
      navigate('/verify-email');
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        const errorData = axiosError.response?.data;

        if (errorData && typeof errorData === 'object' && 'error' in errorData && 'details' in errorData) {
          const errorObj = errorData as { error: string; details: unknown };
          if (errorObj.error === 'Validation error' && Array.isArray(errorObj.details)) {
            // Handle detailed validation errors from backend
            errorMessage = errorObj.details
              .map((err: unknown) => (err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : ''))
              .filter(Boolean)
              .join('. ');
          }
        } else if (errorData && typeof errorData === 'object' && 'error' in errorData) {
          errorMessage = String((errorData as { error: unknown }).error);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes('already exists')) {
        setSignUpError('An account with this email already exists. Please sign in instead.');
        // Optionally switch to sign in tab after a delay
        setTimeout(() => {
          handleTabChange('signin');
        }, 2000);
      } else {
        setSignUpError(errorMessage);
      }
    } finally {
      setSignUpLoading(false);
    }
  };

  const onSignInSubmit = (data: SignInFormData) => {
    handleSignIn(data);
  };

  const onSignUpSubmit = (data: SignUpFormData) => {
    handleSignUp(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12 overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-2 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-full">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Welcome to BuildTrust
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Connect with trusted developers for your real estate projects
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 p-1">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-5 mt-6">
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-5">
                  {signInError && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-medium">{signInError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12 border-2 focus:border-green-500 focus:ring-green-500/20 transition-all"
                        {...signInForm.register('email')}
                        disabled={signInLoading}
                      />
                    </div>
                    {signInForm.formState.errors.email && (
                      <p className="text-sm text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {signInForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                      <Input
                        id="signin-password"
                        type={showSignInPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12 border-2 focus:border-green-500 focus:ring-green-500/20 transition-all"
                        {...signInForm.register('password')}
                        disabled={signInLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        disabled={signInLoading}
                        aria-label={showSignInPassword ? "Hide password" : "Show password"}
                      >
                        {showSignInPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {signInForm.formState.errors.password && (
                      <p className="text-sm text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {signInForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    disabled={signInLoading}
                  >
                    {signInLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-green-600 hover:text-green-700 font-medium underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-5 mt-6">
                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-5">
                  {signUpError && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-medium">{signUpError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12 border-2 focus:border-green-500 focus:ring-green-500/20 transition-all"
                        {...signUpForm.register('email')}
                        disabled={signUpLoading}
                      />
                    </div>
                    {signUpForm.formState.errors.email && (
                      <p className="text-sm text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {signUpForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                      <Input
                        id="signup-password"
                        type={showSignUpPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 h-12 border-2 focus:border-green-500 focus:ring-green-500/20 transition-all"
                        {...signUpForm.register('password')}
                        disabled={signUpLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        disabled={signUpLoading}
                        aria-label={showSignUpPassword ? "Hide password" : "Show password"}
                      >
                        {showSignUpPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {signUpForm.formState.errors.password && (
                      <p className="text-sm text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {signUpForm.formState.errors.password.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Must be at least 6 characters, include 1 capital letter and 1 special character
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 h-12 border-2 focus:border-green-500 focus:ring-green-500/20 transition-all"
                        {...signUpForm.register('confirmPassword')}
                        disabled={signUpLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        disabled={signUpLoading}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive font-medium flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {signUpForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50" 
                    disabled={signUpLoading}
                  >
                    {signUpLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create Account
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      By signing up, you agree to our{' '}
                      <Link to="/terms" className="text-green-600 hover:text-green-700 font-medium underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
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