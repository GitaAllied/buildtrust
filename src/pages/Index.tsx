import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Star,
  Shield,
  Users,
  MapPin,
  Clock,
  LogOut,
  User,
  ArrowRight,
  Play,
  Award,
  Check,
  Globe,
  Heart,
  Menu,
  X,
} from "lucide-react";
import PortfolioSetup from "@/components/PortfolioSetup";
import ClientSetup from "@/components/ClientSetup";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSetup, setShowSetup] = useState(false);
  const [showClientSetup, setShowClientSetup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  // Check if user came from setup flow
  useEffect(() => {
    if (user && !loading) {
      if (user.email_verified && !user.setup_completed) {
        // Force redirect to setup if not completed
        if (user.role === "developer") {
          setShowSetup(true);
        } else if (user.role === "client") {
          setShowClientSetup(true);
        }
        return;
      }
    }

    const setupParam = searchParams.get('setup');
    if (setupParam === 'developer' && user && !loading) {
      if (user.email_verified && !user.setup_completed) {
        setShowSetup(true);
        // Clean up the URL
        navigate('/', { replace: true });
      } else {
        // Already completed or not verified — just clean the URL
        navigate('/', { replace: true });
      }
    } else if (setupParam === 'client' && user && !loading) {
      if (user.email_verified && !user.setup_completed) {
        setShowClientSetup(true);
        navigate('/', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [searchParams, user, loading, navigate]);

  // Handle developer setup authentication check
  const handleDeveloperSetup = () => {
    if (user) {
      // Check if email is verified
      if (user.email_verified) {
        // User is authenticated and verified, show setup
        setShowSetup(true);
      } else {
        // User is authenticated but not verified, redirect to verification
        navigate("/verify-email");
      }
    } else {
      // User is not authenticated, redirect to auth with developer setup intent
      navigate("/auth?intent=developer-setup");
    }
  };

  // Handle client setup authentication check
  const handleClientSetup = () => {
    if (user) {
      // Check if email is verified
      if (user.email_verified) {
        // User is authenticated and verified, show client setup
        setShowClientSetup(true);
      } else {
        // User is authenticated but not verified, redirect to verification
        navigate("/verify-email");
      }
    } else {
      // User is not authenticated, redirect to auth with client setup intent
      navigate("/auth?intent=client-setup");
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Verified Developers",
      description: "All developers are licensed and background-checked",
    },
    {
      icon: Users,
      title: "Diaspora-Focused",
      description: "Built specifically for Africans living abroad",
    },
    {
      icon: MapPin,
      title: "Africa Coverage",
      description: "Projects all over Africa",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Track your project progress with live updates",
    },
  ];

  const testimonials = [
    {
      name: "Chioma Adeleke",
      location: "London, UK → Lagos",
      text: "BuildTrust helped me build my dream home in Lagos while I was in London. The transparency was incredible!",
      rating: 5,
    },
    {
      name: "David Okafor",
      location: "Toronto, CA → Abuja",
      text: "Finally, a platform I can trust for real estate development back home. Excellent communication throughout.",
      rating: 5,
    },
  ];

  if (showSetup) {
    return <PortfolioSetup onExit={() => setShowSetup(false)} />;
  }

  if (showClientSetup) {
    return <ClientSetup onExit={() => setShowClientSetup(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(6deg); }
          50% { transform: translateY(-20px) rotate(6deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-12deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-white/20 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">BT</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                BuildTrust
              </span>
              <span className="text-sm text-gray-500 block -mt-1">Africa</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-green-600 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-green-600 transition-colors font-medium"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-green-600 transition-colors font-medium"
            >
              Success Stories
            </a>
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'client' && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/client-dashboard")}
                    className="border-green-200 hover:border-green-300 hover:bg-green-50"
                  >
                    Client Dashboard
                  </Button>
                )}
                {user.role === 'developer' && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/developer-dashboard")}
                    className="border-green-200 hover:border-green-300 hover:bg-green-50"
                  >
                    Developer Dashboard
                  </Button>
                )}
                {user.role === 'admin' && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/super-admin-dashboard")}
                    className="border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                  >
                    Admin Dashboard
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button
                    variant="outline"
                    className="border-green-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Button
                  onClick={() => navigate("/browse")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Browse Developers
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="container mx-auto px-4 py-6 space-y-4">
              <a
                href="#features"
                className="block text-gray-600 hover:text-green-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-gray-600 hover:text-green-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="block text-gray-600 hover:text-green-600 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Success Stories
              </a>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                {user ? (
                  <>
                    {user.role === 'client' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/client-dashboard");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-green-200 hover:border-green-300 hover:bg-green-50"
                      >
                        Client Dashboard
                      </Button>
                    )}
                    {user.role === 'developer' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/developer-dashboard");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-green-200 hover:border-green-300 hover:bg-green-50"
                      >
                        Developer Dashboard
                      </Button>
                    )}
                    {user.role === 'admin' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/super-admin-dashboard");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-purple-200 hover:border-purple-300 hover:bg-purple-50"
                      >
                        Admin Dashboard
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-green-200 hover:border-green-300 hover:bg-green-50"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        navigate("/browse");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Browse Developers
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop&crop=center"
            alt="Beautiful African home with modern architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-8 shadow-lg">
            <Award className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium text-white">
              Trusted by 500+ Diaspora Africans
            </span>
            <div className="flex -space-x-2 ml-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-2 border-white"></div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 border-2 border-white"></div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-white"></div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white">
            <span className="block">Build Your Dream</span>
            <span className="bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Home in Africa
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Connect with verified, licensed developers all over Africa.
            <span className="font-semibold text-green-300">
              {" "}
              Track progress in real-time
            </span>
            , release payments securely, and build with complete confidence from
            anywhere in the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 px-4">
            <Button
              size="lg"
              onClick={handleClientSetup}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              <User className="w-5 h-5 mr-2" />
              Join as Client
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              onClick={() => navigate("/browse")}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
            >
              <Globe className="w-5 h-5 mr-2" />
              Find Your Developer
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDeveloperSetup}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
            >
              <Heart className="w-5 h-5 mr-2" />
              Join as Developer
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-16 px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20">
              <div className="text-3xl sm:text-4xl font-bold text-green-300 mb-2">
                500+
              </div>
              <div className="text-gray-200 font-medium text-sm sm:text-base">
                Happy Clients
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20">
              <div className="text-3xl sm:text-4xl font-bold text-blue-300 mb-2">
                50+
              </div>
              <div className="text-gray-200 font-medium text-sm sm:text-base">
                Verified Developers
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20">
              <div className="text-3xl sm:text-4xl font-bold text-purple-300 mb-2">
                ₦2B+
              </div>
              <div className="text-gray-200 font-medium text-sm sm:text-base">
                Projects Completed
              </div>
            </div>
          </div>

          {/* Quick Access for Existing Users */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-10 border border-white/20 shadow-2xl max-w-3xl mx-auto px-4">
            {user ? (
              <>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center border border-green-400/30">
                    <Check className="w-5 h-5 text-green-300" />
                  </div>
                  <p className="text-white font-medium text-base sm:text-lg text-center sm:text-left">
                    Welcome back, {user.email}!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                  {user.role === 'client' && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/client-dashboard")}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 sm:px-8 py-3 font-semibold w-full sm:w-auto"
                    >
                      Go to Client Dashboard →
                    </Button>
                  )}
                  {user.role === 'developer' && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/developer-dashboard")}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 sm:px-8 py-3 font-semibold w-full sm:w-auto"
                    >
                      Go to Developer Dashboard →
                    </Button>
                  )}
                  {user.role === 'admin' && (
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/super-admin-dashboard")}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 sm:px-8 py-3 font-semibold w-full sm:w-auto"
                    >
                      Go to Admin Dashboard →
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-200 mb-6 font-medium text-base sm:text-lg text-center">
                  Already have an account?
                </p>
                <div className="flex justify-center">
                  <Link to="/auth">
                    <Button
                      variant="ghost"
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 sm:px-10 py-4 font-semibold text-base sm:text-lg"
                    >
                      Sign In to Your Account →
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="py-24 bg-gradient-to-b from-white to-gray-50"
        id="features"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 px-4 py-2">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
                Why Choose BuildTrust
              </span>
              <span className="block text-green-600">Africa?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're more than just a platform – we're your trusted partner in
              building your African dream home from anywhere in the world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="pt-0">
                  {/* Feature Image */}
                  <div className="mt-6 rounded-md overflow-hidden shadow-md">
                    <img
                      src={
                        index === 0
                          ? "https://images.unsplash.com/photo-1718810051760-42528b6d6bc7?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          : index === 1
                          ? "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=300&h=200&fit=crop&crop=center"
                          : index === 2
                          ? "https://images.unsplash.com/photo-1685266326473-5b99c3d08a7e?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          : "https://images.unsplash.com/photo-1765648684630-ac9c15ac98d5?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      }
                      alt={feature.title}
                      className="w-full h-[18rem] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader className="">
                    <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardDescription className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
              Simple Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Building your dream home has never been this simple. Follow our
              proven 3-step process.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
              <div className="flex justify-between">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              </div>
              <div className="absolute top-2 left-8 right-8 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
              <div className="text-center group">
                <div className="relative mb-6 md:mb-8">
                  <div className="w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      1
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                    Browse & Select
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                    Browse verified developers, view portfolios, and select the
                    perfect match for your project.
                  </p>
                  <div className="rounded-2xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=250&fit=crop&crop=center"
                      alt="Developer selection"
                      className="w-full h-32 md:h-[20rem] object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="relative mb-6 md:mb-8">
                  <div className="w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      2
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                    Secure Agreement
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                    Set milestones, agree on terms, and secure your payments in
                    escrow for complete protection.
                  </p>
                  <div className="rounded-2xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&crop=center"
                      alt="Secure agreement"
                      className="w-full h-32 md:h-[20rem] object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="relative mb-6 md:mb-8">
                  <div className="w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      3
                    </span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                    Track & Build
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                    Monitor progress with real-time photo updates, and
                    communicate directly with your developer.
                  </p>
                  <div className="rounded-2xl overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop&crop=center"
                      alt="Progress tracking"
                      className="w-full h-32 md:h-[20rem] object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="py-24 bg-gradient-to-b from-gray-50 to-white"
        id="testimonials"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800 border-yellow-200 px-4 py-2">
              Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-yellow-800 bg-clip-text text-transparent">
                What Our Clients Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real Africans who built their dream homes
              through BuildTrust Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden"
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 md:w-5 h-4 md:h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 font-medium">
                      Verified Client
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute -top-2 -left-2 text-4xl md:text-6xl text-green-100 font-serif">
                      "
                    </div>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed italic pl-4">
                      "{testimonial.text}"
                    </p>
                    <div className="absolute -bottom-4 -right-2 text-4xl md:text-6xl text-green-100 font-serif">
                      "
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="relative">
                      <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 md:w-5 h-4 md:h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="w-2 md:w-3 h-2 md:h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm md:text-base">
                        {testimonial.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>

                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 opacity-5">
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Social Proof */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4.9/5</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-white rounded-full translate-y-40"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Start
              <span className="block text-white">Building?</span>
            </h2>

            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto">
              Join thousands of Africans who have successfully built their dream
              homes through BuildTrust Africa. Your journey to homeownership
              starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/browse")}
                className="px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold bg-white text-green-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                <Globe className="w-5 h-5 mr-2" />
                Browse Developers
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDeveloperSetup}
                className="px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-600 transition-all duration-300 w-full sm:w-auto"
              >
                <Heart className="w-5 h-5 mr-2" />
                Become a Developer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full -translate-x-40 translate-y-40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg md:text-xl">
                      BT
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    BuildTrust
                  </span>
                  <span className="text-base md:text-lg text-gray-400 block -mt-1">
                    Africa
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 max-w-md">
                Connecting diaspora Africans with verified developers for
                transparent, secure property development from anywhere in the
                world.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                <div className="w-9 md:w-10 h-9 md:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs md:text-sm font-bold">f</span>
                </div>
                <div className="w-9 md:w-10 h-9 md:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs md:text-sm font-bold">t</span>
                </div>
                <div className="w-9 md:w-10 h-9 md:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs md:text-sm font-bold">ig</span>
                </div>
                <div className="w-9 md:w-10 h-9 md:h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-xs md:text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 text-white">
                For Clients
              </h4>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Browse Developers
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Support Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 text-white">
                For Developers
              </h4>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Join Platform
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Verification Process
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Success Tips
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Developer Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 text-white">
                Company
              </h4>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Our Mission
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-base md:text-lg mb-4 md:mb-6 text-white">
                Legal
              </h4>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm md:text-base"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left">
                &copy; 2024 BuildTrust Africa. All rights reserved. Made with ❤️
                for the diaspora.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>ISO Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
