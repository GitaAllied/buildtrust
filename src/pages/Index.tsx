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
  TrendingUp,
} from "lucide-react";
import PortfolioSetup from "@/components/PortfolioSetup";
import ClientSetup from "@/components/ClientSetup";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import AOS from "aos";
import "aos/dist/aos.css";
import CTABackground from "../assets/CTA.jpg";
import Steps from "../assets/steps.jpg";
import Logo from "../assets/Logo.png";
import Hero from "../assets/Hero.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSetup, setShowSetup] = useState(false);
  const [showClientSetup, setShowClientSetup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: 'ease-out',
      once: false,
      mirror: true,
    });
  }, []);

  // Check if user came from setup flow
  useEffect(() => {
    if (user && !loading) {
      // Admin users don't need setup - they go straight to dashboard
      if (user.role === 'admin') {
        return;
      }
      
      // Only force setup redirect if email is verified AND setup is NOT completed
      if (user.email_verified && !user.setup_completed) {
        if (user.role === "developer") {
          setShowSetup(true);
        } else if (user.role === "client") {
          setShowClientSetup(true);
        }
        return;
      }
      
      // If setup is completed, allow user to stay on homepage
      if (user.setup_completed) {
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
    // Admin users shouldn't access setup
    if (user && user.role === 'admin') {
      navigate("/super-admin-dashboard");
      return;
    }
    
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
    // Admin users shouldn't access setup
    if (user && user.role === 'admin') {
      navigate("/super-admin-dashboard");
      return;
    }
    
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
        <div className="container mx-auto px-[3%] py-4 flex items-center justify-between">
          <div className=" w-[20%] md:w-[10%]">
            <img src={Logo} alt="Build Trust Logo" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-[#226F75] transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-[#226F75] transition-colors font-medium"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-[#226F75] transition-colors font-medium"
            >
              Success Stories
            </a>
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'client' && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/client-dashboard")}
                    className="border-[#226F75] border-opacity-20 hover:border-opacity-30 hover:bg-[#226F75] hover:bg-opacity-30"
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
                    className="border-[#226F75] border-opacity-20 hover:border-opacity-30 hover:bg-[#226F75] hover:bg-opacity-30"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Button
                  onClick={() => navigate("/browse")}
                  className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:bg-opacity-70 shadow-lg hover:shadow-xl transition-all duration-200"
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
                className="block py-2 text-gray-600 hover:text-[#226F75] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block py-2 text-gray-600 hover:text-[#226F75] transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </a>
              <a
                href="#testimonials"
                className="block py-2 text-gray-600 hover:text-[#226F75] transition-colors font-medium"
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
                        className="w-full border-[#226F75] border-opacity-20 hover:border-opacity-30 hover:bg-[#226F75] hover:bg-opacity-30"
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
                      className="w-full bg-gradient-to-r from-[#226F75] to-[#253E44] hover:bg-opacity-70 shadow-lg hover:shadow-xl transition-all duration-200"
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
      <div data-aos="fade-up" className=" w-full p-5 px-[3%] pt-[25%] md:pt-[10%] flex justify-between items-center flex-col-reverse md:flex-row">
        {/* Left Hero Text */}
        <div className=" w-full md:w-[55%]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold mb-6 leading-tight">
            <span className="block">Build Your Dream</span>
            <span className="bg-gradient-to-r from-[#226F75] to-[#253E44] bg-opacity-30 bg-clip-text text-transparent">
              Home in Africa
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-xl mb-6 max-w-4xl leading-relaxed">
            Connect with verified, licensed developers all over Africa. Track
            progress in real-time , release payments securely, and build with
            complete confidence from anywhere in the world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
            <Button
              size="lg"
              onClick={handleClientSetup}
              className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:bg-opacity-60 px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              <User className="w-5 h-5 mr-2" />
              Join as Client
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDeveloperSetup}
              className="bg-white/10 backdrop-blur-sm border border-black/10 px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl hover:bg-[#226F75] hover:bg-opacity-25 transition-all duration-300 w-full sm:w-auto"
            >
              <Heart className="w-5 h-5 mr-2" />
              Join as Developer
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 p-3 border-t border-slate-100 dark:border-neutral-900">
            <div>
              <div className="text-2xl font-bold tracking-tight">500+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Happy Clients
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">50+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Developers
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight">₦2B+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Project Value
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className=" w-full md:w-[40%] h-[80%] relative">
          <div className=" rounded-2xl overflow-hidden shadow-2xl">
            <img
              alt="Luxury Villa 3D Render"
              className="w-full aspect-[4/3] object-cover"
              src={Hero}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-xl border border-slate-100 dark:border-neutral-800 hidden md:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
                  Project Pulse
                </p>
                <p className="font-bold text-sm tracking-tight">
                  Building Phase: Foundation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section data-aos="fade-up" className="py-24 bg-gradient-to-b from-white to-gray-50" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-4">
            <span className="text-primary font-bold tracking-[0.25em] uppercase text-[10px]">
              Why BuildTrust
            </span>
            <h2 className="text-4xl lg:text-5xl">
              Clean, Transparent, Reliable
            </h2>
            <p className="text-charcoal/70 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              We're more than just a platform — we're your trusted partner in
              building your Nigerian dream home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div data-aos="fade-up" data-aos-delay="100" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="text-primary dark:text-emerald-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">
                Verified Developers
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Every developer undergoes a rigorous 5-step background and
                license verification process.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="text-amber-600 dark:text-amber-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">
                Diaspora-Focused
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Purpose-built for Nigerians abroad, solving the unique trust
                issues of remote construction.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="text-blue-600 dark:text-blue-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">
                Nigeria Coverage
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                From Lagos to Abuja, Port Harcourt to Enugu - we cover all major
                Nigerian cities.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="400" className="group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="text-purple-600 dark:text-purple-400 text-3xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">
                Real-time Updates
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Track every brick laid with weekly photo/video reports and live
                drone feed options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section data-aos="fade-up" className="w-[90%] m-auto rounded-3xl overflow-hidden bg-cover bg-bottom" style={{ backgroundImage: `url(${Steps})` }}>
        <div className=" w-full h-full p-10 px-[8%] text-white bg-[#253E44] bg-opacity-75 flex flex-col gap-8">
          <div className=" w-full md:w-[60%] flex flex-col gap-5 text-center md:text-left">
            <h4 className=" uppercase text-sm font-bold">
              Build Smarter, Build Securely - In 3 Simple Steps
            </h4>
            <h1 className=" text-3xl md:text-5xl font-bold">
              Building your dream home has never been this simple
            </h1>
            <p className=" text-xs">
              work with the largest network of developers and bring your dream
              to life - from big dreams to big homes
            </p>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className=" p-8 bg-white shadow-md text-black rounded-md flex flex-col gap-3">
              <div className=" flex justify-between items-center">
                <h1 className=" text-lg font-extrabold text-[#253E44]">
                  1. Browse & Select
                </h1>
                <ArrowRight width={14} />
              </div>
              <p className=" text-sm leading-tight text-[#4B5563]">
                Browse verified developers, view portfolios, and select the
                perfect match for your project.
              </p>
            </div>
            {/* Step 2 */}
            <div className=" p-8 bg-white shadow-md text-black rounded-md flex flex-col gap-3">
              <div className=" flex justify-between items-center">
                <h1 className=" text-lg font-extrabold text-[#253E44]">
                  2. Secure Agreement
                </h1>
                <ArrowRight width={14} />
              </div>
              <p className=" text-sm leading-tight text-[#4B5563]">
                Set milestones, agree on terms, and secure your payments in
                escrow for complete protection.
              </p>
            </div>
            {/* Step 3 */}
            <div className=" p-8 bg-white shadow-md text-black rounded-md flex flex-col gap-3">
              <div className=" flex justify-between items-center">
                <h1 className=" text-lg font-extrabold text-[#253E44]">
                  3. Track & Build
                </h1>
                <ArrowRight width={14} />
              </div>
              <p className=" text-sm leading-tight text-[#4B5563]">
                Monitor progress with real-time photo updates, and communicate
                directly with your developer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-aos="fade-up" className="py-24 bg-gradient-to-b from-gray-50 to-white" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-[0.25em] uppercase text-[10px]">
              Success Stories
            </span>
            <h2 className="text-4xl mt-2">What Our Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 200}
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
                      <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-[#226F75] to-[#253E44] rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg">
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
      <section data-aos="fade-up" className=" text-white overflow-hidden w-[90%] m-auto rounded-3xl bg-cover bg-center mb-10" style={{ backgroundImage: `url(${CTABackground})` }}>
        <div className=" w-full h-full bg-[#253E44] bg-opacity-75 text-center p-5 py-[2rem] md:py-[5rem]">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Start Building?
          </h2>

          <p className="text-xl md:text-2xl mb-6 opacity-90 leading-relaxed max-w-3xl mx-auto">
            Join thousands of Africans who have successfully built their dream
            homes through BuildTrust Africa. Your journey to homeownership
            starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/browse")}
              className="px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold bg-white text-[#226F75] hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              <Globe className="w-5 h-5 mr-2" />
              Browse Developers
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDeveloperSetup}
              className="px-6 sm:px-10 py-4 text-base sm:text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#226F75] transition-all duration-300 w-full sm:w-auto"
            >
              <Heart className="w-5 h-5 mr-2" />
              Become a Developer
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gradient-to-b from-[#1a4a4f] via-[#1e5a5f] to-[#226F75] text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-12 mb-6">
            <div className="md:col-span-2">
              <img src={Logo} alt="" className="w-[35%]" />
              <p className="text-[#EBE1D3] text-base md:text-lg leading-relaxed mb-6 max-w-md">
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
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Browse Developers
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
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
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Join Platform
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Verification Process
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Success Tips
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
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
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Our Mission
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
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
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-sm md:text-base"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#EBE1D3] pt-8">
            <p className="text-[#EBE1D3] text-center">
              &copy; 2024 BuildTrust Africa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
