import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Star,
  Shield,
  Users,
  MapPin,
  Clock,
  User,
  ArrowRight,
  Check,
  Globe,
  Heart,
  Menu,
  X,
  TrendingUp,
  LogOut,
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
import Footer from '../assets/Footer.png'
import Hero from "../assets/Hero.jpg";
import { FaFacebookF, FaX, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSetup, setShowSetup] = useState(false);
  const [showClientSetup, setShowClientSetup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const { user, loading, signOut } = useAuth();

const [line1Typed, setLine1Typed] = useState('');
const [line2Typed, setLine2Typed] = useState('');
const [showCursor, setShowCursor] = useState(true);

useEffect(() => {
  AOS.init({
    duration: 1200,
    easing: 'ease-out',
    once: false,
    mirror: true,
  });
}, []);

  // Check if user came from email verification setup flow
  useEffect(() => {
    if (user && !loading) {
      // Check if setup was triggered by email verification
      const setupRole = localStorage.getItem('setup_after_verification');
      if (setupRole) {
        localStorage.removeItem('setup_after_verification');
        if (setupRole === 'developer' && user.role === 'developer' && user.email_verified && !user.setup_completed) {
          setShowSetup(true);
        } else if (setupRole === 'client' && user.role === 'client' && user.email_verified && !user.setup_completed) {
          setShowClientSetup(true);
        }
      }
      
      // Clean up any stray URL params
      const setupParam = new URLSearchParams(window.location.search).get('setup');
      if (setupParam) {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const line1 = "Build Your Dream";
    const line2 = "Home in Africa";
    let i = 0;
    let currentLine = 1;
    const type = () => {
      if (currentLine === 1) {
        if (i < line1.length) {
          setLine1Typed(line1.slice(0, i + 1));
          i++;
          setTimeout(type, 100);
        } else {
          currentLine = 2;
          i = 0;
          setTimeout(type, 100);
        }
      } else if (currentLine === 2) {
        if (i < line2.length) {
          setLine2Typed(line2.slice(0, i + 1));
          i++;
          setTimeout(type, 100);
        } else {
          setTimeout(() => {
            setLine1Typed('');
            setLine2Typed('');
            i = 0;
            currentLine = 1;
            type();
          }, 3000);
        }
      }
    };
    type();
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Handle developer setup authentication check
  const handleDeveloperSetup = () => {
    // Admin users shouldn't access setup
    if (user && user.role === 'admin') {
      navigate("/super-admin-dashboard");
      return;
    }
    
    if (user) {
      // If the current user is a client, sending them to client setup
      if (user.role === 'client') {
        if (user.email_verified) {
          setShowClientSetup(true);
        } else {
          navigate("/verify-email");
        }
        return;
      }

      // Otherwise (developer or other non-admin), go to developer setup when verified
      if (user.email_verified) {
        setShowSetup(true);
      } else {
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
      // If the current user is a developer, send them to developer setup when verified
      if (user.role === 'developer') {
        if (user.email_verified) {
          setShowSetup(true);
        } else {
          navigate("/verify-email");
        }
        return;
      }

      // Otherwise (client or other non-admin), go to client setup when verified
      if (user.email_verified) {
        setShowClientSetup(true);
      } else {
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
    <div className="min-h-screen bg-[#226F75]/10">
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
      @keyframes pulse-scale {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
      .animate-pulse-scale {
        animation: pulse-scale 2s ease-in-out infinite;
      }
    `}</style>
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-white/20 z-50 shadow-sm">
        <div className="container mx-auto px-10 py-4 flex items-center justify-between">
          <div className=" w-[20%] md:w-[10%]">
            <Link to={'/'}><img src={Logo} alt="Build Trust Logo" /></Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 lg:space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-[#226F75] transition-colors font-medium text-sm md:text-base"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-[#226F75] transition-colors font-medium text-sm md:text-base"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-[#226F75] transition-colors font-medium text-sm md:text-base"
            >
              Success Stories
            </a>
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'client' && user.is_active === 1 && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/client-dashboard")}
                    className="hidden sm:inline-flex border-[#226F75] border-opacity-20 hover:border-opacity-30 hover:bg-[#226F75] hover:bg-opacity-30 text-xs sm:text-sm"
                  >
                    Client Dashboard
                  </Button>
                )}
                {user.role === 'developer' && user.is_active === 1 && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/developer-dashboard")}
                    className="hidden sm:inline-flex border-[#226F75]/20 hover:border-[#226F75]/30 hover:bg-[#226F75]/5 text-xs sm:text-sm"
                  >
                    Developer Dashboard
                  </Button>
                )}
                {user.role === 'admin' && (
                  <Button
                    variant="outline"
                    onClick={() => navigate("/super-admin-dashboard")}
                    className="hidden sm:inline-flex border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-xs sm:text-sm"
                  >
                    Admin Dashboard
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="hidden sm:inline-flex border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs sm:text-sm"
                >
                  <LogOut className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button
                    variant="outline"
                    className="hidden sm:inline-flex border-[#226F75] border-opacity-20 hover:border-opacity-30 hover:bg-[#226F75] hover:bg-opacity-30 text-xs sm:text-sm"
                  >
                    <User className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Button
                  onClick={() => navigate("/browse")}
                  className="hidden sm:inline-flex bg-gradient-to-r from-[#226F75] to-[#253E44] hover:bg-opacity-70 shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm"
                >
                  Browse Developers
                  <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
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
                    {user.role === 'client' && user.is_active === 1 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/client-dashboard");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-[#226F75]/20 hover:border-[#226F75]/30 hover:bg-[#226F75]/50"
                      >
                        Client Dashboard
                      </Button>
                    )}
                    {user.role === 'developer' && user.is_active === 1 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigate("/developer-dashboard");
                          setMobileMenuOpen(false);
                        }}
                        className="w-full border-[#226F75]/20 hover:border-[#226F75]/30 hover:bg-[#226F75]/50"
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
                      variant="outline"
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
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
      <div data-aos="fade-up" className="w-full lg:h-screen bg-gray-100 px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-20 lg:pt-[8rem] flex justify-between items-center flex-col-reverse lg:flex-row gap-6 md:gap-8 pb-[3rem]">
        {/* Left Hero Text */}
        <div className="w-full lg:w-[55%]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight min-h-[6rem] md:min-h-[7rem] lg:min-h-[8rem]">
            <span className="block">{line1Typed}{showCursor && line1Typed.length < "Build Your Dream".length ? '|' : ''}</span>
            <span className="bg-gradient-to-r from-[#226F75] to-[#253E44] bg-opacity-30 bg-clip-text text-transparent block">
              {line2Typed}{showCursor && line2Typed.length < "Home in Africa".length ? '|' : ''}
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg mb-4 max-w-4xl leading-relaxed">
            Connect with verified, licensed developers all over Africa. Track
            progress in real-time , release payments securely, and build with
            complete confidence from anywhere in the world.
          </p>

          {!(user && user.setup_completed === true) && (
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-5">
              <Button
                size="lg"
                onClick={handleClientSetup}
                className="bg-gradient-to-r from-[#226F75] to-[#253E44] hover:bg-opacity-60 px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-scale w-full lg:w-auto"
              >
                <User className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
                Join as Client
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-1 sm:ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDeveloperSetup}
                className="bg-white/10 backdrop-blur-sm border border-black/10 px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl hover:bg-[#226F75] hover:bg-opacity-25 transition-all duration-300 w-full lg:w-auto"
              >
                <Heart className="w-5 h-5 mr-2" />
                Join as Developer
              </Button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 border-t border-slate-100 dark:border-neutral-900 mt-6 sm:mt-8">
            <div className=" text-center md:text-left">
              <div className="text-xl sm:text-2xl font-bold tracking-tight">500+</div>
              <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Happy Clients
              </div>
            </div>
            <div className=" text-center md:text-left">
              <div className="text-xl sm:text-2xl font-bold tracking-tight">50+</div>
              <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Developers
              </div>
            </div>
            <div className=" text-center md:text-left">
              <div className="text-xl sm:text-2xl font-bold tracking-tight">₦2B+</div>
              <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Project Value
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-[40%] relative lg:mt-4 mb-0 md:mb-[4rem] lg:mb-0">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              alt="Luxury Villa 3D Render"
              className="w-full aspect-[4/3] object-cover"
              src={Hero}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
          </div>
          <div className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-4 lg:-bottom-10 lg:-left-6 bg-white dark:bg-neutral-900 p-4 md:p-6 lg:p-6 rounded-xl shadow-xl border border-slate-100 dark:border-neutral-800 hidden md:block">
            <div className="flex items-center gap-3 md:gap-4 lg:gap-4">
              <div className="w-10 md:w-12 lg:w-12 h-10 md:h-12 lg:h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
          <div className="text-center mb-6 sm:mb-8 md:mb-10 space-y-3 sm:space-y-4">
            <span className="text-primary font-bold tracking-[0.25em] uppercase text-[8px] sm:text-[10px]">
              Why BuildTrust
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Clean, Transparent, Reliable
            </h2>
            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              We're more than just a platform — we're your trusted partner in
              building your African dream home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div data-aos="fade-up" data-aos-delay="100" className="group bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg md:hover:shadow-2xl shadow-lg transition-all duration-300">
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Shield className="text-primary dark:text-emerald-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 dark:text-white">
                Verified Developers
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Every developer undergoes a rigorous 5-step background and
                license verification process.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="group bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg md:hover:shadow-2xl shadow-lg transition-all duration-300">
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Globe className="text-amber-600 dark:text-amber-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 dark:text-white">
                Diaspora-Focused
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Purpose-built for Africans abroad, solving the unique trust
                issues of remote construction.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="group bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg md:hover:shadow-2xl shadow-lg transition-all duration-300">
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="text-blue-600 dark:text-blue-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 dark:text-white">
                Africa Coverage
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                From Lagos to Abuja, Port Harcourt to Enugu - we cover all major
                African cities.
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="400" className="group bg-white dark:bg-slate-900 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-lg md:hover:shadow-2xl shadow-lg transition-all duration-300">
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                <Clock className="text-purple-600 dark:text-purple-400 text-2xl sm:text-3xl" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 dark:text-white">
                Real-time Updates
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Track every brick laid with weekly photo/video reports and live
                drone feed options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section data-aos="fade-up" className="w-[95%] sm:w-[90%] my-12 m-auto rounded-2xl sm:rounded-3xl overflow-hidden bg-cover bg-bottom" style={{ backgroundImage: `url(${Steps})` }}>
        <div className="w-full h-full p-4 sm:p-6 md:p-10 py-[3rem] text-white bg-[#253E44] bg-opacity-75 flex flex-col gap-6 md:gap-8">
          <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-1 text-center lg:text-left md:w-[55%]">
            <h4 className="uppercase text-xs sm:text-sm font-bold">
              Build Smarter, Build Securely - In 3 Simple Steps
            </h4>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Building your dream home has never been this simple
            </h1>
            <p className="text-xs sm:text-sm">
              work with the largest network of developers and bring your dream
              to life - from big dreams to big homes
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="p-4 sm:p-6 md:p-8 bg-white shadow-md text-black rounded-lg md:rounded-md flex flex-col gap-2 sm:gap-3">
              <div className="flex justify-between items-center">
                <h1 className="text-base sm:text-lg font-extrabold text-[#253E44]">
                  1. Browse & Select
                </h1>
                <ArrowRight width={14} />
              </div>
              <p className="text-xs sm:text-sm leading-tight text-[#4B5563]">
                Browse verified developers, view portfolios, and select the
                perfect match for your project.
              </p>
            </div>
            {/* Step 2 */}
            <div className="p-4 sm:p-6 md:p-8 bg-white shadow-md text-black rounded-lg md:rounded-md flex flex-col gap-2 sm:gap-3">
              <div className="flex justify-between items-center">
                <h1 className="text-base sm:text-lg font-extrabold text-[#253E44]">
                  2. Secure Agreement
                </h1>
                <ArrowRight width={14} />
              </div>
              <p className="text-xs sm:text-sm leading-tight text-[#4B5563]">
                Set milestones, agree on terms, and secure your payments in
                escrow for complete protection.
              </p>
            </div>
            {/* Step 3 */}
            <div className="p-4 sm:p-6 md:p-8 bg-white shadow-md text-black rounded-lg md:rounded-md flex flex-col gap-2 sm:gap-3">
              <div className="flex justify-between items-center">
                <h1 className="text-base sm:text-lg font-extrabold text-[#253E44]">
                  3. Track & Build
                </h1>
                <ArrowRight width={14} />
              </div>
              <p className="text-xs sm:text-sm leading-tight text-[#4B5563]">
                Monitor progress with real-time photo updates, and communicate
                directly with your developer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-aos="fade-up" className="py-12 sm:py-16 bg-gray-100 md:py-24 " id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <span className="text-primary font-bold tracking-[0.25em] uppercase text-[8px] sm:text-[10px]">
              Success Stories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl mt-2">What Our Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 200}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden"
              >
                <CardContent className="p-4 sm:p-6 md:p-8">
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
                    <div className="absolute -top-2 -left-2 text-4xl md:text-6xl text-[#226F75]/10 font-serif">
                      "
                    </div>
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed italic pl-4">
                      "{testimonial.text}"
                    </p>
                    <div className="absolute -bottom-4 -right-2 text-4xl md:text-6xl text-[#226F75]/10 font-serif">
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
                      <div className="absolute -bottom-1 -right-1 w-4 md:w-5 h-4 md:h-5 bg-[#226F75]/50 rounded-full border-2 border-white flex items-center justify-center">
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
            <div className="flex flex-row items-center gap-4 sm:gap-6 md:gap-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 max-w-4xl mx-auto">
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-bold text-green-600">4.9/5</div>
                <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="w-px h-8 sm:h-12 bg-gray-300"></div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">98%</div>
                <div className="text-xs sm:text-sm text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="w-px h-8 sm:h-12 bg-gray-300"></div>
              <div className="text-center flex-1">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-xs sm:text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-aos="fade-up" className="text-white overflow-hidden w-[95%] sm:w-[90%] m-auto rounded-2xl sm:rounded-3xl bg-cover bg-center my-8 sm:mb-10" style={{ backgroundImage: `url(${CTABackground})` }}>
        <div className="w-full h-full bg-[#253E44] bg-opacity-75 text-center p-4 sm:p-6 md:p-8 py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Ready to Start Building?
          </h2>

          <p className="text-sm sm:text-base md:text-lg lg:text-2xl mb-6 sm:mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
            Join thousands of Africans who have successfully built their dream
            homes through BuildTrust Africa. Your journey to homeownership
            starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mb-8 sm:mb-10 md:mb-12">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/browse")}
              className="px-4 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold bg-white text-[#226F75] hover:bg-gray-100 shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <Globe className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
              Browse Developers
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-1 sm:ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDeveloperSetup}
              className="px-4 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-semibold bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#226F75] transition-all duration-300 w-full sm:w-auto"
            >
              <Heart className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
              Become a Developer
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-[#1a4a4f] via-[#1e5a5f] to-[#226F75] text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-6 gap-6 sm:gap-8 md:gap-12 mb-6 sm:mb-8 md:mb-6">
            <div className="col-span-1 md:col-span-2">
              <img src={Footer} alt="" className="w-[50%] sm:w-[35%]" />
              <p className="text-[#EBE1D3] text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 max-w-md">
                Connecting diaspora Africans with verified developers for
                transparent, secure property development from anywhere in the
                world.
              </p>
              <div className="flex space-x-3 md:space-x-4">
                <div className="w-7 md:w-8 h-7 md:h-8 p-[10px] md:p-3 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <FaFacebookF/>
                </div>
                <div className="w-7 md:w-8 h-7 md:h-8 p-[10px] md:p-3 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <FaX/>
                </div>
                <div className="w-7 md:w-8 h-7 md:h-8 p-[10px] md:p-3 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <FaInstagram/>
                </div>
                <div className="w-7 md:w-8 h-7 md:h-8 p-[10px] md:p-3 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <FaLinkedinIn/>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-6 text-white">
                For Clients
              </h4>
              <ul className="space-y-1 sm:space-y-2 md:space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-[#EBE1D3] hover:opacity-75 transition-colors text-xs sm:text-sm md:text-base"
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

            <div className=" col-span-1">
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
            <div className=" col-span-1">
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

            <div className=" col-span-1" >
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
          <div className="border-t border-[#EBE1D3] pt-6 sm:pt-8">
            <p className="text-[#EBE1D3] text-center text-xs sm:text-sm md:text-base">
              &copy; 2024 BuildTrust Africa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
