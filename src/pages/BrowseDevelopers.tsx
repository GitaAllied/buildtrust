import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/api";
import Logo from '../assets/Logo.png'

// Compute backend origin for uploads (remove trailing /api if present)
const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL ?? 'https://buildtrust-backend.onrender.com/api').replace(/\/+$/,'').replace(/\/api$/,'');

const BrowseDevelopers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedProjectType, setSelectedProjectType] = useState("all");
  const [minTransparency, setMinTransparency] = useState(70);
  const [budgetRange, setBudgetRange] = useState("all");
  const [developers, setDevelopers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getDevelopers();
        const list = (response.developers || response || []) as any[];

        // Enrich each developer with their full details (including projects/media)
        const enriched = await Promise.all(
          list.map(async (dev) => {
            try {
              const details = await apiClient.getDeveloperById(dev.id);
              // The API may return the developer directly or under `developer`
              const full = details.developer || details || dev;
              return { ...dev, ...full };
            } catch (e) {
              // If the per-dev fetch fails, return the basic dev entry
              return dev;
            }
          })
        );

        // Normalize project media shape if present
        const normalized = enriched.map((d) => {
          if (d.projects && Array.isArray(d.projects)) {
            d.projects = d.projects.map((p: any) => {
              // Some APIs store media as `media: [{ url }]`, others as `media.url` or `image`
              const mediaArray = [] as any[];
              if (Array.isArray(p.media) && p.media.length > 0) {
                mediaArray.push(...p.media);
              } else if (p.media && p.media.url) {
                mediaArray.push(p.media);
              } else if (p.image) {
                mediaArray.push({ url: p.image });
              }
              return { ...p, media: mediaArray };
            });
          }
          return d;
        });

        setDevelopers(normalized || []);
      } catch (err: any) {
        setError(err.message || "Failed to load developers");
        setDevelopers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const filteredDevelopers = developers.filter(dev => {
    if (searchQuery && !dev.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !dev.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCity !== "all" && !dev.location.includes(selectedCity)) return false;
    if (dev.transparencyScore < minTransparency) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="flex items-center space-x-3">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Developer</h1>
            <p className="text-gray-600">Connect with verified Nigerian developers for your next property project</p>
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
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Lagos">Lagos</SelectItem>
                <SelectItem value="Abuja">Abuja</SelectItem>
                <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                <SelectItem value="Kano">Kano</SelectItem>
                <SelectItem value="Ibadan">Ibadan</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedProjectType} onValueChange={setSelectedProjectType}>
              <SelectTrigger>
                <SelectValue placeholder="Project Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Duplex">Duplex</SelectItem>
                <SelectItem value="Bungalow">Bungalow</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Rental">Rental Property</SelectItem>
                <SelectItem value="Estate">Estate Development</SelectItem>
              </SelectContent>
            </Select>

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
              <span className="text-sm text-gray-600 whitespace-nowrap">Trust Score:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={minTransparency}
                onChange={(e) => setMinTransparency(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900">{minTransparency}%+</span>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {!loading && filteredDevelopers.length} Developer{!loading && filteredDevelopers.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <Card key={dev.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate(`/developer/${dev.id}`)}>
                <CardContent className="p-0">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{dev.name}</h3>
                          {dev.verified && (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{Math.round(dev.transparencyScore)}%</div>
                        <div className="text-xs text-gray-500">Trust Score</div>
                      </div>
                    </div>

                    {/* Project Thumbnails */}
                    {dev.projects && dev.projects.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {dev.projects.slice(0, 2).map((project: any, idx: number) => {
                          // Handle both direct image property and media array
                          const rawUrl = project.media?.[0]?.url || project.image || "/placeholder.svg";

                          // Build absolute URL for backend-served uploads
                          const imageUrl = (rawUrl && (rawUrl.startsWith('http') || rawUrl.startsWith('data:')))
                            ? rawUrl
                            : rawUrl === '/placeholder.svg'
                              ? rawUrl
                              : (rawUrl.startsWith('/') ? `${BACKEND_ORIGIN}${rawUrl}` : `${BACKEND_ORIGIN}/${rawUrl}`);

                          return (
                            <div key={idx} className="relative">
                              <img 
                                src={imageUrl}
                                alt={project.title || "Project"}
                                className="w-full h-20 object-cover rounded-lg bg-gray-200"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails to load
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />

                              {/* Badge to indicate this is a past project provided during developer setup */}
                              <div className="absolute top-2 left-2 bg-[#226F75]/90 text-white text-[10px] px-2 py-1 rounded-full font-semibold">
                                Past Project
                              </div>

                              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex flex-col justify-end p-2">
                                <div className="text-white text-xs font-semibold truncate">{project.title || "Project"}</div>
                                <div className="text-white text-[11px] opacity-90 truncate">{project.setupDetails || project.description || project.notes || 'Details provided during setup'}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {dev.location || 'Nigeria'} • {dev.experience || 0} years experience
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {dev.rating || "N/A"} rating • {dev.completedProjects || 0} projects completed
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dev.bio || "No bio available"}</p>

                    <Button className="w-full bg-[#253E44] hover:bg-[#253E44]/90">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDevelopers.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No developers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseDevelopers;
