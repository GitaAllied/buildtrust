import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  EyeOff,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Logo from "../assets/Logo.png";
import Logomark from "../assets/Logomark.png";
import AuthImage from "../assets/Auth.png";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one capital letter")
      .regex(
        /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?/]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
    role: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
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
  const [activeTab, setActiveTab] = useState("signin");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();

  // Check for developer setup intent
  const searchParams = new URLSearchParams(window.location.search);
  const setupIntent = searchParams.get("intent");

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
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

      localStorage.setItem("auth_token", response.token);
      await refreshUser();

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      // Redirect based on user role and setup intent
      const userFromResponse = response.user;

      console.log('📊 SIGN-IN REDIRECT LOGIC:', {
        userRole: userFromResponse?.role,
        setupCompleted: userFromResponse?.setup_completed,
        emailVerified: userFromResponse?.email_verified,
        setupIntent,
        timestamp: new Date().toISOString()
      });

      // Admin users go to admin dashboard
      if (userFromResponse && userFromResponse.role === "admin") {
        console.log('👨‍💼 REDIRECTING ADMIN TO DASHBOARD');
        navigate("/super-admin-dashboard");
        return;
      }

      // Determine if setup is completed
      const setupCompleted = !!userFromResponse?.setup_completed;
      const userRole = userFromResponse?.role || 'client';

      console.log('🔄 SETUP STATUS:', { setupCompleted, userRole });

      // Route based on setup completion status
      if (setupCompleted) {
        // Setup is complete - redirect to dashboard
        const dashboard = userRole === 'developer' ? '/developer-dashboard' : '/client-dashboard';
        console.log(`✅ SETUP COMPLETED, REDIRECTING TO ${dashboard}`);
        navigate(dashboard);
      } else {
        // Setup not completed - redirect to setup page
        const setupPage = userRole === 'developer' ? '/developer-setup' : '/client-setup';
        console.log(`🔧 SETUP NOT COMPLETED, REDIRECTING TO ${setupPage}`);
        navigate(setupPage);
      }
    } catch (error) {
      // Handle structured API errors from apiClient (it attaches `status` and `body` to Error)
      const errAny = error as any;
      const serverBody = errAny && errAny.body ? errAny.body : null;

      // If backend indicates email not verified, redirect to verification flow
      if (errAny && errAny.status === 403 && serverBody && serverBody.error === 'Email not verified') {
        try {
          localStorage.setItem('pending_verification_email', data.email);
        } catch {}
        navigate('/verify-email');
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";

      if (
        errorMessage.includes("Invalid") ||
        errorMessage.includes("password")
      ) {
        setSignInError("Invalid email or password. Please try again.");
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
      console.log("📝 SIGNUP FORM SUBMITTED:", {
        timestamp: new Date().toISOString(),
        email: data.email,
        passwordLength: data.password.length,
        setupIntent,
      });

      const payload: any = { email: data.email, password: data.password };

      // Determine role: prefer explicit form value, fallback to setupIntent mapping
      const roleFromForm = (data as any).role;
      if (roleFromForm && roleFromForm !== "") {
        payload.role = roleFromForm;
      } else if (setupIntent === "developer-setup") {
        payload.role = "developer";
      } else if (setupIntent === "client-setup") {
        payload.role = "client";
      }

      if (setupIntent) {
        payload.intent = setupIntent;
        console.log("🎯 SETUP INTENT DETECTED:", setupIntent);
      }

      console.log("🔖 ROLE INCLUDED IN PAYLOAD:", payload.role);

      console.log("📤 SENDING SIGNUP REQUEST TO API:", {
        payloadKeys: Object.keys(payload),
        email: payload.email,
      });

      const response = await (apiClient as any).signup(payload);

      console.log("✅ SIGNUP RESPONSE RECEIVED:", {
        userId: response.user?.id,
        email: response.user?.email,
        role: response.user?.role,
        tokenLength: response.token?.length,
        setupCompleted: response.user?.setup_completed,
        emailVerified: response.user?.email_verified,
      });

      // Store token for email verification page
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("pending_verification_email", data.email);
      await refreshUser();

      console.log("💾 TOKENS STORED & USER REFRESHED");

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      // Redirect to email verification page
      navigate("/verify-email");
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        const errorData = axiosError.response?.data;

        if (
          errorData &&
          typeof errorData === "object" &&
          "error" in errorData &&
          "details" in errorData
        ) {
          const errorObj = errorData as { error: string; details: unknown };
          if (
            errorObj.error === "Validation error" &&
            Array.isArray(errorObj.details)
          ) {
            // Handle detailed validation errors from backend
            errorMessage = errorObj.details
              .map((err: unknown) =>
                err && typeof err === "object" && "message" in err
                  ? String((err as { message: unknown }).message)
                  : "",
              )
              .filter(Boolean)
              .join(". ");
          }
        } else if (
          errorData &&
          typeof errorData === "object" &&
          "error" in errorData
        ) {
          errorMessage = String((errorData as { error: unknown }).error);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("❌ SIGNUP ERROR:", {
        timestamp: new Date().toISOString(),
        error: errorMessage,
        email: data.email,
        fullError: error,
      });

      if (errorMessage.includes("already exists")) {
        setSignUpError(
          "An account with this email already exists. Please sign in instead.",
        );
        // Optionally switch to sign in tab after a delay
        setTimeout(() => {
          handleTabChange("signin");
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
    <div className="h-screen flex items-center justify-between relative overflow-hidden">
      <div className=" relative w-[55%] h-screen hidden md:block">
        <img
          src={AuthImage}
          alt="Image to left on authentication page"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute left-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent w-full h-full z-10"></div>
        <div className=" absolute bottom-5 left-0 z-10 p-12 py-16 flex flex-col gap-2">
          <div className=" flex items-center gap-2">
            <div className="flex items-center h-10 w-10 p-2 rounded-full bg-[#EBE1D3]">
              <Link to={"/"} className=" flex justify-center">
                <img src={Logomark} alt="Build Trust Logo" className="" />
              </Link>
            </div>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
             Welcome to Build Trust Africa.
          </h2>
          <p className=" text-gray-300 text-sm">
            Build your dream home, back home. Connect with trusted developers for your real estate projects and secure your legacy in Nigeria
            with complete transparency.
          </p>
        </div>
      </div>

      {/* Form area */}
      <div className="w-full md:w-[45%] flex flex-col items-start py-16 md:py-0 md:justify-center relative z-10 px-[8%] h-full space-y-14 md:space-y-5 bg-[#226F75]/5">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm transition-colors group font-medium"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        <div className=" md:hidden z-10 flex items-center text-center flex-col gap-2">
          <div className=" flex items-center gap-2 w-[35%]">
              <Link to={"/"} className=" flex justify-center w-full">
                <img src={Logo} alt="Build Trust Logo" className="" />
              </Link>
          </div>

          <h2 className="text-2xl font-bold tracking-tight leading-tight">
             Welcome to Build Trust Africa.
          </h2>
          <p className=" text-sm">
            Build your dream home, back home. Connect with trusted developers for your real estate projects.
          </p>
        </div>

        <div className=" w-full">
          <CardContent className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-10 bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 p-1 rounded-lg">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#226F75] data-[state=active]:to-[#253E44] data-[state=active]:text-white data-[state=active]:shadow-md transition-all text-sm"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#226F75] data-[state=active]:to-[#253E44] data-[state=active]:text-white data-[state=active]:shadow-md transition-all text-sm"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="">
                <form
                  onSubmit={signInForm.handleSubmit(onSignInSubmit)}
                  className=" space-y-3"
                >
                  {signInError && (
                    <Alert
                      variant="destructive"
                      className="border-red-200 bg-red-50 dark:bg-red-950/50"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-medium">
                        {signInError}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="">
                    <Label
                      htmlFor="signin-email"
                      className="text-xs font-semibold"
                    >
                      Email Address
                    </Label>
                    <div className="relative border border-[#253E44]/50 rounded-md">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-10 border-1 text-sm focus:ring-[#226F75]/20 transition-all"
                        {...signInForm.register("email")}
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

                  <div className="">
                    <Label
                      htmlFor="signin-password"
                      className="text-xs font-semibold"
                    >
                      Password
                    </Label>
                    <div className="relative border border-[#253E44]/50 rounded-md">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        id="signin-password"
                        type={showSignInPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-10 border-1 text-sm focus:ring-[#226F75]/20 transition-all"
                        {...signInForm.register("password")}
                        disabled={signInLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignInPassword(!showSignInPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        disabled={signInLoading}
                        aria-label={
                          showSignInPassword ? "Hide password" : "Show password"
                        }
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
                    className="w-full h-10 bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
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

                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-[#253E44] font-medium underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="">
                <form
                  onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                  className=" space-y-3"
                >
                  {signUpError && (
                    <Alert
                      variant="destructive"
                      className="border-red-200 bg-red-50 dark:bg-red-950/50"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="font-medium">
                        {signUpError}
                      </AlertDescription>
                    </Alert>
                  )}

                  

                  {!setupIntent && (
                    <div className="">
                      <Label
                        htmlFor="signupOption"
                        className="text-xs font-semibold "
                      >
                        I am signing up as a
                      </Label>
                        <select
                          id="signup-role"
                          {...signUpForm.register("role")}
                          className=" w-full relative border border-[#253E44]/50 rounded-md pl-4 h-10 border-1 text-sm focus:ring-[#226F75]/20 transition-all placeholder:text-muted-foreground"
                        >
                          <option value="">Select an option</option>
                          <option value="client">Client</option>
                          <option value="developer">Developer</option>
                        </select>
                    </div>
                  )}

                  <div className="">
                    <Label
                      htmlFor="signup-email"
                      className="text-xs font-semibold "
                    >
                      Email Address
                    </Label>
                    <div className="relative border border-[#253E44]/50 rounded-md">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-10 border-1 text-sm focus:ring-[#226F75]/20 transition-all"
                        {...signUpForm.register("email")}
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

                  <div className="">
                    <Label
                      htmlFor="signup-password"
                      className="text-xs font-semibold "
                    >
                      Password
                    </Label>
                    <div className="relative border border-[#253E44]/50 rounded-md">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        id="signup-password"
                        type={showSignUpPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 h-10 border-1 text-sm focus:ring-[#226F75]/20 transition-all"
                        {...signUpForm.register("password")}
                        disabled={signUpLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignUpPassword(!showSignUpPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        disabled={signUpLoading}
                        aria-label={
                          showSignUpPassword ? "Hide password" : "Show password"
                        }
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
                    <p className="text-xs pt-2 text-muted-foreground">
                      Use 6+ characters with at least 1 capital letter and 1 symbol.
                    </p>
                  </div>

                  <div className="">
                    <Label
                      htmlFor="confirm-password"
                      className="text-xs font-semibold"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative border border-[#253E44]/50 rounded-md">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 h-10 border-1 text-sm focus:ring-[#226F75]/20 transition-all"
                        {...signUpForm.register("confirmPassword")}
                        disabled={signUpLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        disabled={signUpLoading}
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
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
                    className="w-full h-10 bg-gradient-to-r from-[#226F75] to-[#253E44] hover:opacity-90 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
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

                  <div className="text-center">
                    <p className="text-xs">
                      By signing up, you agree to our{" "}
                      <Link
                        to="/terms"
                        className="text-[#226F75] hover:text-[#253E44] font-medium underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-[#226F75] hover:text-[#253E44] font-medium underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </div>

        {/* Additional Info */}
        {/* <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Trusted by diaspora Africas worldwide
          </p>
        </div> */}
      </div>
    </div>
  );
}
