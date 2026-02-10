import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Logo from "../assets/Logo.png";
import { Heart } from "lucide-react";

// Complete list of African cities - synchronized with PersonalInfo.tsx
const AFRICAN_CITIES = [
  // North Africa
  { name: "Cairo", country: "Egypt" },
  { name: "Alexandria", country: "Egypt" },
  { name: "Casablanca", country: "Morocco" },
  { name: "Marrakech", country: "Morocco" },
  { name: "Rabat", country: "Morocco" },
  { name: "Fez", country: "Morocco" },
  { name: "Tunis", country: "Tunisia" },
  { name: "Sousse", country: "Tunisia" },
  { name: "Algiers", country: "Algeria" },
  { name: "Constantine", country: "Algeria" },
  { name: "Tripoli", country: "Libya" },
  
  // West Africa
  { name: "Lagos", country: "Nigeria" },
  { name: "Abuja", country: "Nigeria" },
  { name: "Port Harcourt", country: "Nigeria" },
  { name: "Kano", country: "Nigeria" },
  { name: "Ibadan", country: "Nigeria" },
  { name: "Benin City", country: "Nigeria" },
  { name: "Enugu", country: "Nigeria" },
  { name: "Kaduna", country: "Nigeria" },
  { name: "Owerri", country: "Nigeria" },
  { name: "Abeokuta", country: "Nigeria" },
  { name: "Accra", country: "Ghana" },
  { name: "Kumasi", country: "Ghana" },
  { name: "Dakar", country: "Senegal" },
  { name: "Freetown", country: "Sierra Leone" },
  { name: "Conakry", country: "Guinea" },
  { name: "Monrovia", country: "Liberia" },
  { name: "Bamako", country: "Mali" },
  { name: "Ouagadougou", country: "Burkina Faso" },
  { name: "Lomé", country: "Togo" },
  { name: "Cotonou", country: "Benin" },
  
  // Central Africa
  { name: "Kinshasa", country: "DRC" },
  { name: "Lubumbashi", country: "DRC" },
  { name: "Brazzaville", country: "Congo" },
  { name: "Libreville", country: "Gabon" },
  { name: "Bangui", country: "Central African Republic" },
  { name: "Yaoundé", country: "Cameroon" },
  { name: "Douala", country: "Cameroon" },
  { name: "N'Djamena", country: "Chad" },
  
  // East Africa
  { name: "Nairobi", country: "Kenya" },
  { name: "Mombasa", country: "Kenya" },
  { name: "Dar es Salaam", country: "Tanzania" },
  { name: "Dodoma", country: "Tanzania" },
  { name: "Kampala", country: "Uganda" },
  { name: "Juba", country: "South Sudan" },
  { name: "Addis Ababa", country: "Ethiopia" },
  { name: "Dire Dawa", country: "Ethiopia" },
  { name: "Kigali", country: "Rwanda" },
  { name: "Bujumbura", country: "Burundi" },
  { name: "Djibouti City", country: "Djibouti" },
  { name: "Mogadishu", country: "Somalia" },
  
  // Southern Africa
  { name: "Johannesburg", country: "South Africa" },
  { name: "Cape Town", country: "South Africa" },
  { name: "Durban", country: "South Africa" },
  { name: "Pretoria", country: "South Africa" },
  { name: "Gaborone", country: "Botswana" },
  { name: "Harare", country: "Zimbabwe" },
  { name: "Bulawayo", country: "Zimbabwe" },
  { name: "Lusaka", country: "Zambia" },
  { name: "Lilongwe", country: "Malawi" },
  { name: "Blantyre", country: "Malawi" },
  { name: "Maputo", country: "Mozambique" },
  { name: "Windhoek", country: "Namibia" },
  { name: "Maseru", country: "Lesotho" },
  { name: "Mbabane", country: "Eswatini" },
  { name: "Antananarivo", country: "Madagascar" },
  
  // Island Nations
  { name: "Port Louis", country: "Mauritius" },
  { name: "Victoria", country: "Seychelles" },
];

// Common project types - users can select or type custom ones
const COMMON_PROJECT_TYPES = [
  "Duplex",
  "Bungalow",
  "Commercial",
  "Rental Property",
  "Estate Development",
  "Apartment Complex",
  "Office Building",
  "Hotel",
  "Warehouse",
  "Mixed-use Development",
  "Villa",
  "Townhouse",
  "Shopping Mall",
  "Residential Tower"
];

// Compute backend origin for uploads (remove trailing /api if present)
const BACKEND_ORIGIN = (
  import.meta.env.VITE_API_URL ?? "https://buildtrust-backend.onrender.com/api"
)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

// Component for rotating project images in the badge
const ProjectImageBadge = ({ project, idx }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Extract media array from project
  const mediaArray = Array.isArray(project.project_media)
    ? project.project_media
    : Array.isArray(project.media)
      ? project.media
      : [];

  // Get current image URL
  let currentImageUrl: string | null = null;
  if (mediaArray.length > 0) {
    const currentMedia = mediaArray[currentImageIndex];
    if (currentMedia && typeof currentMedia === "object" && currentMedia.url) {
      currentImageUrl = currentMedia.url;
    } else if (typeof currentMedia === "string") {
      currentImageUrl = currentMedia;
    }
  }

  // Construct full display URL
  const displayUrl = currentImageUrl
    ? currentImageUrl.startsWith("http")
      ? currentImageUrl
      : `${BACKEND_ORIGIN}${currentImageUrl}`
    : null;

  // Rotate images every 30 seconds
  useEffect(() => {
    if (mediaArray.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % mediaArray.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [mediaArray.length]);

  // Log for debugging
  if (displayUrl) {
    console.log(`Project ${project.id} image rotation:`, {
      currentIndex: currentImageIndex,
      totalImages: mediaArray.length,
      currentUrl: displayUrl,
    });
  }

  return (
    <div
      className="h-[1.5rem] w-[1.5rem] rounded-full border-2 border-gray-300 -ml-2 flex items-center justify-center bg-white overflow-hidden flex-shrink-0 relative group"
      key={`${project.id}-${idx}`}
      title={project.title || "Project"}
    >
      {displayUrl ? (
        <>
          <img
            src={displayUrl}
            alt={project.title || "Project"}
            className="w-full h-full object-cover transition-opacity duration-500"
            loading="lazy"
            onError={(e) => {
              // Fallback to gradient if image fails to load
              (e.target as HTMLImageElement).style.display = "none";
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.style.background =
                  "linear-gradient(135deg, rgb(209, 213, 219), rgb(156, 163, 175))";
              }
            }}
          />
          {/* (counter removed) */}
        </>
      ) : (
        // Placeholder for projects without media
        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xs font-bold text-gray-500">
          {project.source === "portfolio" ? "P" : "•"}
        </div>
      )}
    </div>
  );
};

const BrowseDevelopers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedProjectType, setSelectedProjectType] = useState("all");
  const [minTransparency, setMinTransparency] = useState(25);
  const [budgetRange, setBudgetRange] = useState("all");
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [citySearch, setCitySearch] = useState("");
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [projectTypeSearch, setProjectTypeSearch] = useState("");
  const [projectTypePopoverOpen, setProjectTypePopoverOpen] = useState(false);
  const [savedDevelopers, setSavedDevelopers] = useState<Set<number>>(new Set());
  const [savingId, setSavingId] = useState<number | null>(null);

  // Mock data for when API is not connected
  const mockDevelopers = [
    {
      id: 1,
      name: "Engr. Adewale Construction",
      location: "Lagos",
      trust_score: 92,
      years_experience: 12,
      rating: 4.8,
      completed_projects: 24,
      bio: "Expert in modern residential and commercial construction with over a decade of experience.",
      is_verified: true,
      profile_image:
        "https://ui-avatars.com/api/?name=Engr+Adewale&background=226F75&color=fff",
      projects: [
        {
          id: 101,
          title: "Modern Duplex Development",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 102,
          title: "Luxury Villa",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1570129477992-45a003ff3271?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 103,
          title: "Estate Gates",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=150&h=150&fit=crop",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Prime Build Ltd",
      location: "Lagos",
      trust_score: 88,
      years_experience: 9,
      rating: 4.6,
      completed_projects: 18,
      bio: "Specializing in commercial plazas and mixed-use development projects.",
      is_verified: true,
      profile_image:
        "https://ui-avatars.com/api/?name=Prime+Build&background=253E44&color=fff",
      projects: [
        {
          id: 201,
          title: "Commercial Plaza Project",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 202,
          title: "Shopping Complex",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1536367567313-e1831ff27c1f?w=150&h=150&fit=crop",
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Covenant Builders Nigeria",
      location: "Abuja",
      trust_score: 85,
      years_experience: 11,
      rating: 4.7,
      completed_projects: 21,
      bio: "Leading construction firm in Northern Nigeria with expertise in residential estate development.",
      is_verified: true,
      profile_image:
        "https://ui-avatars.com/api/?name=Covenant+Builders&background=6C5B7F&color=fff",
      projects: [
        {
          id: 301,
          title: "Residential Estate Expansion",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 302,
          title: "Gated Community Development",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 303,
          title: "Townhouse Complex",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1512207736139-c2b276e76403?w=150&h=150&fit=crop",
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "BuildRight Enterprises",
      location: "Lagos",
      trust_score: 90,
      years_experience: 14,
      rating: 4.9,
      completed_projects: 31,
      bio: "Premium construction services with focus on luxury residential and office complexes.",
      is_verified: true,
      profile_image:
        "https://ui-avatars.com/api/?name=BuildRight&background=D4AF37&color=000",
      projects: [
        {
          id: 401,
          title: "Office Complex Construction",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 402,
          title: "Corporate Headquarters",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 403,
          title: "Luxury Penthouse",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1542314503-37143f4f6e64?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 404,
          title: "Hotel Development",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=150&h=150&fit=crop",
            },
          ],
        },
      ],
    },
    {
      id: 5,
      name: "SafeHaven Construction",
      location: "Port Harcourt",
      trust_score: 82,
      years_experience: 8,
      rating: 4.5,
      completed_projects: 15,
      bio: "Trusted builder for residential properties with excellent safety and quality standards.",
      is_verified: true,
      profile_image:
        "https://ui-avatars.com/api/?name=SafeHaven&background=47B881&color=fff",
      projects: [
        {
          id: 501,
          title: "Residential Complex",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1570129477992-45a003ff3271?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 502,
          title: "Family Homes Project",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=150&h=150&fit=crop",
            },
          ],
        },
      ],
    },
    {
      id: 6,
      name: "Heritage Builders Ltd",
      location: "Lagos",
      trust_score: 87,
      years_experience: 13,
      rating: 4.8,
      completed_projects: 28,
      bio: "Specialists in bungalow and duplex construction with attention to architectural detail.",
      is_verified: true,
      profile_image:
        "https://ui-avatars.com/api/?name=Heritage+Builders&background=8B4513&color=fff",
      projects: [
        {
          id: 601,
          title: "Classic Bungalow Design",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 602,
          title: "Modern Duplex Series",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1512207736139-c2b276e76403?w=150&h=150&fit=crop",
            },
          ],
        },
        {
          id: 603,
          title: "Architectural Showcase",
          project_media: [
            {
              url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=150&h=150&fit=crop",
            },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getDevelopers();
        const list = (response.developers || response || []) as any[];
        console.log("Initial developers response:", list);

        // Enrich each developer with their full details (including projects/media)
        const enriched = await Promise.all(
          list.map(async (dev) => {
            try {
              const details = await apiClient.getDeveloperById(dev.id);
              // The API may return the developer directly or under `developer`
              const full = details.developer || details || dev;
              console.log(`Developer ${dev.id} detailed response:`, full);
              // Use full details from getDeveloperById, which has complete project info with media
              return full;
            } catch (e) {
              // If the per-dev fetch fails, return the basic dev entry
              console.warn(
                `Failed to fetch details for developer ${dev.id}:`,
                e,
              );
              return dev;
            }
          }),
        );

        console.log("Enriched developers:", enriched);

        // Normalize project media shape if present
        const normalized = enriched.map((d) => {
          if (d.projects && Array.isArray(d.projects)) {
            d.projects = d.projects.map((p: any) => {
              // Ensure media is always an array
              const mediaArray = Array.isArray(p.project_media)
                ? p.project_media
                : Array.isArray(p.media)
                  ? p.media
                  : [];
              return { ...p, media: mediaArray };
            });
          }
          return d;
        });

        console.log("Final normalized developers:", normalized);
        setDevelopers(normalized || []);
      } catch (err: any) {
        console.error("Error fetching developers from API:", err.message);
        console.warn("Using mock data due to API connection issue");
        // Use mock data when API fails
        setDevelopers(mockDevelopers);
        setError("Using demo data - API connection unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  // Load saved developers when user is logged in or developers are loaded
  useEffect(() => {
    const loadSavedDevelopers = async () => {
      if (!user || user.role !== 'client') {
        setSavedDevelopers(new Set());
        return;
      }

      try {
        const response = await apiClient.getSavedDevelopers();
        const saved = Array.isArray(response) ? response : response?.developers || [];
        const savedIds = new Set<number>(saved.map((dev: any) => dev.id));
        setSavedDevelopers(savedIds);
        console.log('Loaded saved developers:', savedIds);
      } catch (err) {
        console.error('Error loading saved developers:', err);
        setSavedDevelopers(new Set());
      }
    };

    loadSavedDevelopers();
  }, [user, developers.length]);

  // Handle save/unsave developer
  const handleSaveDeveloper = async (e: React.MouseEvent, developerId: number) => {
    e.stopPropagation(); // Prevent card click

    if (!user) {
      toast({
        title: "Please Log In",
        description: "You must be logged in to save developers.",
        variant: "destructive",
      });
      return;
    }

    if (user.role !== 'client') {
      toast({
        title: "Not Available",
        description: "Only clients can save developers.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingId(developerId);
      const isSaved = savedDevelopers.has(developerId);

      if (isSaved) {
        // Unsave developer
        await apiClient.unsaveDeveloper(developerId);
        setSavedDevelopers((prev) => {
          const updated = new Set(prev);
          updated.delete(developerId);
          return updated;
        });
        toast({
          title: "Removed",
          description: "Developer removed from your saved list.",
        });
      } else {
        // Save developer
        await apiClient.saveDeveloper(developerId);
        setSavedDevelopers((prev) => new Set(prev).add(developerId));
        toast({
          title: "Saved",
          description: "Developer added to your saved list.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save developer",
        variant: "destructive",
      });
    } finally {
      setSavingId(null);
    }
  };

  const filteredDevelopers = developers.filter((dev) => {
    if (
      searchQuery &&
      !dev.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !dev.location.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (selectedCity !== "all" && !dev.location.includes(selectedCity))
      return false;
    // Use trust_score from DB or transparencyScore fallback
    const trustScoreValue =
      dev.trust_score !== null && dev.trust_score !== undefined
        ? dev.trust_score
        : dev.transparencyScore || 0;
    if (trustScoreValue < minTransparency) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3"
            >
              <img src={Logo} alt="" className=" w-[20%] md:w-[15%]" />
            </button>
          </div>
          <div className="text-sm text-gray-500">
            <span className="bg-[#226F75]/10 text-[#226F75]/80 px-5 py-2 rounded-full hidden md:block">
              All developers are verified and licensed
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Find Your Perfect Developer
            </h1>
            <p className="text-gray-600">
              Connect with verified Nigerian developers for your next property
              project
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search by city, project type, or developer name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* City Selector with Search */}
            <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300"
                >
                  <span className="text-gray-700">
                    {selectedCity === "all" ? "Select City" : AFRICAN_CITIES.find(c => c.name === selectedCity)?.name || selectedCity}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" side="bottom" align="start" sideOffset={8}>
                <div className="space-y-3">
                  <Input
                    placeholder="Search cities..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="h-9"
                  />
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    <button
                      onClick={() => {
                        setSelectedCity("all");
                        setCityPopoverOpen(false);
                        setCitySearch("");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${
                        selectedCity === "all" ? "bg-blue-100 text-[#226F75] font-medium" : "text-gray-700"
                      }`}
                    >
                      All Cities
                    </button>
                    {AFRICAN_CITIES.filter(city => 
                      city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
                      city.country.toLowerCase().includes(citySearch.toLowerCase())
                    ).map((city) => (
                      <button
                        key={`${city.name}-${city.country}`}
                        onClick={() => {
                          setSelectedCity(city.name);
                          setCityPopoverOpen(false);
                          setCitySearch("");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${
                          selectedCity === city.name ? "bg-blue-100 text-[#226F75] font-medium" : "text-gray-700"
                        }`}
                      >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-xs text-gray-500">{city.country}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Project Type Selector with Custom Entry */}
            <Popover open={projectTypePopoverOpen} onOpenChange={setProjectTypePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-white hover:bg-gray-50 border-gray-300"
                >
                  <span className="text-gray-700">
                    {selectedProjectType === "all" ? "Project Type" : selectedProjectType}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3" side="bottom" align="start" sideOffset={8}>
                <div className="space-y-3">
                  <Input
                    placeholder="Type or search project type..."
                    value={projectTypeSearch}
                    onChange={(e) => setProjectTypeSearch(e.target.value)}
                    className="h-9"
                  />
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    <button
                      onClick={() => {
                        setSelectedProjectType("all");
                        setProjectTypePopoverOpen(false);
                        setProjectTypeSearch("");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${
                        selectedProjectType === "all" ? "bg-blue-100 text-[#226F75] font-medium" : "text-gray-700"
                      }`}
                    >
                      All Types
                    </button>
                    {/* Show filtered common types */}
                    {COMMON_PROJECT_TYPES.filter(type =>
                      type.toLowerCase().includes(projectTypeSearch.toLowerCase())
                    ).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedProjectType(type);
                          setProjectTypePopoverOpen(false);
                          setProjectTypeSearch("");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${
                          selectedProjectType === type ? "bg-blue-100 text-[#226F75] font-medium" : "text-gray-700"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                    {/* Show custom entry option if text doesn't match common types */}
                    {projectTypeSearch && !COMMON_PROJECT_TYPES.some(type =>
                      type.toLowerCase() === projectTypeSearch.toLowerCase()
                    ) && (
                      <button
                        onClick={() => {
                          setSelectedProjectType(projectTypeSearch);
                          setProjectTypePopoverOpen(false);
                          setProjectTypeSearch("");
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors text-[#226F75] font-medium border border-[#226F75] bg-blue-50"
                      >
                        ✓ Use "{projectTypeSearch}"
                      </button>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Select value={budgetRange} onValueChange={setBudgetRange}>
              <SelectTrigger>
                <SelectValue placeholder="Budget Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Budget</SelectItem>
                <SelectItem value="5-15">₦5M - ₦15M</SelectItem>
                <SelectItem value="15-30">₦15M - ₦30M</SelectItem>
                <SelectItem value="30-50">₦30M - ₦50M</SelectItem>
                <SelectItem value="50+">₦50M+</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                Trust Score:
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={minTransparency}
                onChange={(e) => setMinTransparency(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900">
                {minTransparency}%+
              </span>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {!loading && filteredDevelopers.length} Developer
            {!loading && filteredDevelopers.length !== 1 ? "s" : ""} Found
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Escrow-backed guarantee available</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#226F75]"></div>
              <span className="text-gray-600">Loading developers...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Developer Cards */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDevelopers.map((dev) => (
              <Card
                key={dev.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/developer/${dev.id}`)}
              >
                <CardContent className="p-5 space-y-5">
                  {/* Top section */}
                  <div className=" flex justify-between items-center">
                    {/* Images */}
                    <div className=" flex items-center gap-3">
                      <div className=" h-[4rem] w-[4rem] rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-100">
                        {dev.profile_image ? (
                          <img
                            src={dev.profile_image}
                            alt={dev.name || "Developer"}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 rounded-full text-white font-bold text-lg">
                            {(dev.name || "D").charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className=" space-y-1">
                        <div className=" flex items-center gap-1">
                          <h1 className=" font-bold text-xl">
                            {dev.name || "Developer"}
                          </h1>
                          {dev.is_verified && (
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        {/* Projects count badges */}
                        <div className="flex ml-2 items-center">
                          <div className="flex -ml-2">
                            {dev.projects &&
                              dev.projects
                                .slice(0, 5)
                                .map((project: any, idx: number) => (
                                  <ProjectImageBadge
                                    key={`${project.id}-${idx}`}
                                    project={project}
                                    idx={idx}
                                  />
                                ))}
                          </div>

                          {/* Project count badge: show total from projects array (includes both sources) */}
                          <div className="ml-3">
                            <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              {dev.projects ? dev.projects.length : 0} projects
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trust score */}
                    <div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {dev.trust_score !== null &&
                          dev.trust_score !== undefined
                            ? dev.trust_score
                            : dev.transparencyScore || 0}
                          %
                        </div>
                        <p className="text-[10px] text-gray-500">Trust Score</p>
                      </div>
                    </div>
                  </div>

                  {/* Middle section */}
                  <div className=" space-y-1.5">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {dev.location || "Nigeria"} • {dev.years_experience || 0}{" "}
                      years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {Number(dev.rating || 0).toFixed(1)} rating •{" "}
                      {dev.completed_projects || 0} projects completed
                    </div>
                  </div>

                  {/* Bottom section */}
                  <div className=" space-y-1.5">
                    <p className="text-sm text-gray-600 truncate">
                      {dev.bio || "No description provided"}
                    </p>
                    <div className=" flex items-center gap-2">
                      <Button className="w-full bg-[#253E44] hover:bg-[#253E44]/90">
                        View Profile
                      </Button>
                      
                      {user && user.role === 'client' && (
                        <Button
                          variant={savedDevelopers.has(dev.id) ? "default" : "outline"}
                          className={`px-3 ${
                            savedDevelopers.has(dev.id)
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'border-gray-300'
                          }`}
                          onClick={(e) => handleSaveDeveloper(e, dev.id)}
                          disabled={savingId === dev.id}
                          title={savedDevelopers.has(dev.id) ? "Remove from saved" : "Save to favorites"}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              savedDevelopers.has(dev.id) ? 'fill-white' : ''
                            }`}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDevelopers.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No developers found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseDevelopers;
