
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectRequestModal from "../components/ProjectRequestModal";
import { apiClient } from "@/lib/api";
import Logo from '../assets/Logo.png'

// Component for rotating project images
const ProjectImageCarousel = ({ project }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPagination, setShowPagination] = useState(false);

  // Compute backend origin for image URLs
  const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/api$/, '');

  // Extract media array from project
  const mediaArray = Array.isArray(project.media) ? project.media : [];

  // Get current image URL
  let currentImageUrl: string | null = null;
  if (mediaArray.length > 0) {
    const currentMedia = mediaArray[currentImageIndex];
    if (currentMedia && typeof currentMedia === 'object' && currentMedia.url) {
      currentImageUrl = currentMedia.url;
    } else if (typeof currentMedia === 'string') {
      currentImageUrl = currentMedia;
    }
  }

  // Construct full display URL
  const displayUrl = currentImageUrl 
    ? (currentImageUrl.startsWith('http') ? currentImageUrl : `${BACKEND_ORIGIN}${currentImageUrl}`)
    : project.image || '/placeholder.svg';

  // Rotate images every 10 seconds
  useEffect(() => {
    if (mediaArray.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % mediaArray.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [mediaArray.length]);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowPagination(true)}
      onMouseLeave={() => setShowPagination(false)}
    >
      <img 
        src={displayUrl} 
        alt={project.title}
        className="w-full h-48 object-cover rounded-t-lg transition-opacity duration-500"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.svg';
        }}
      />
      {/* Dot pagination */}
      {mediaArray.length > 1 && (
        <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 px-2 py-1 bg-black/40 rounded-full transition-opacity duration-300 ${showPagination ? 'opacity-100' : 'opacity-0'}`}>
          {mediaArray.map((_, index: number) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white w-3' 
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DeveloperProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [developer, setDeveloper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Compute backend origin for image URLs
  const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/api$/, '');

  useEffect(() => {
    const fetchDeveloperData = async () => {
      if (!id) {
        setError('Developer ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await apiClient.getDeveloperById(id);

        // API may return { success: true, developer: { ... } } or the developer object directly
        const payload = data && data.developer ? data.developer : data;

        // Normalize project media URLs to include backend origin
        if (payload?.projects && Array.isArray(payload.projects)) {
          payload.projects = payload.projects.map((project: any) => {
            if (project.media && Array.isArray(project.media)) {
              project.media = project.media.map((m: any) => {
                const mediaUrl = (typeof m === 'string') ? m : (m.url || m);
                const fullUrl = mediaUrl && mediaUrl.startsWith('http') ? mediaUrl : `${BACKEND_ORIGIN}${mediaUrl}`;
                return {
                  ...(typeof m === 'string' ? {} : m),
                  url: fullUrl
                };
              });
              // Use first media item as the main image
              project.image = project.media[0]?.url || '/placeholder.svg';
            }
            console.log(`📍 Project: ${project.title}, Location:`, project.location, 'City:', project.city);
            return project;
          });
        }

        console.log('📄 DEVELOPER DATA LOADED:', payload);
        setDeveloper(payload);
        setError(null);
      } catch (err: any) {
        console.error('❌ Failed to fetch developer:', err);
        setError(err.message || 'Failed to load developer profile');
        setDeveloper(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperData();
  }, [id]);

  // Normalize cities covered into a consistent array for rendering
  const citiesCovered: string[] = (() => {
    if (!developer) return [];
    const raw = developer.cities_covered ?? developer.citiesCovered ?? developer.citiesServed ?? developer.preferred_cities ?? developer.cities_served;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map((c: any) => (typeof c === 'string' ? c : c.name || String(c))).filter(Boolean);
    if (typeof raw === 'string') {
      // Try JSON parse, otherwise split on commas
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map((c: any) => (typeof c === 'string' ? c : c.name || String(c))).filter(Boolean);
      } catch (_) {
        return raw.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    return [];
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/')} className="flex items-center space-x-3">
              <img src={Logo} alt="" className="w-[20%] md:w-[15%]" />
            </button>
          </div>
          <div className=" items-center space-x-2 text-sm text-gray-500 hidden md:flex">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Escrow-backed guarantee available</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#226F75]"></div>
              <p className="mt-4 text-gray-600">Loading developer profile...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="text-red-600 text-2xl">⚠️</div>
                <div>
                  <h3 className="font-semibold text-red-900">Error Loading Profile</h3>
                  <p className="text-red-700">{error}</p>
                  <Button 
                    onClick={() => navigate('/browse')}
                    className="mt-4 bg-red-600 hover:bg-red-700"
                  >
                    Back to Browse Developers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {developer && !loading && (
          <>
        {/* Banner Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{developer.name || 'Developer'}</h1>
                  {developer.is_verified && (
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-lg text-gray-600 mb-4">{developer.contact_person || 'Developer'}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {developer.location || 'Not specified'}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {developer.rating || 'N/A'} ({developer.completed_projects || 0} projects)
                  </div>
                  {developer.trust_score && (
                    <div className="bg-[#226F75]/10 text-[#226F75] px-2 py-1 rounded-full">
                      {developer.trust_score}% Trust Score
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 lg:mt-0">
                <Button 
                  onClick={() => setShowRequestModal(true)}
                  className="bg-[#253E44] hover:bg-[#253E44]/70 text-lg px-8 py-3 h-auto"
                >
                  Request to Build
                </Button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Responds {developer.response_time || 'within 24 hours'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">About This Developer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bio */}
                <div>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {developer.bio || 'This developer has not yet provided a bio. Contact them to learn more about their experience and expertise.'}
                  </p>
                </div>

                {/* Key Highlights */}
                <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#226F75]">{developer.years_experience || '0'}</div>
                    <div className="text-xs text-gray-600 mt-1">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#226F75]">{developer.completed_projects || '0'}</div>
                    <div className="text-xs text-gray-600 mt-1">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{developer.rating || '0'}</div>
                    <div className="text-xs text-gray-600 mt-1">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{developer.trust_score || '0'}%</div>
                    <div className="text-xs text-gray-600 mt-1">Trust Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specializations & Services */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Build Types / Specializations */}
              {developer.build_types && developer.build_types.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Types & Specializations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      This developer specializes in the following project types:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {developer.build_types.map((type: any, idx: number) => (
                        <span 
                          key={idx} 
                          className="bg-[#226F75] text-white px-3 py-2 rounded-full text-sm font-medium"
                        >
                          {typeof type === 'string' ? type : type.name || type}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Languages & Communication */}
              <Card>
                <CardHeader>
                  <CardTitle>Communication & Languages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Languages</h4>
                    <p className="text-gray-700">
                      {developer.languages ? 
                        (Array.isArray(developer.languages) ? developer.languages.join(", ") : developer.languages)
                        : 'Not specified'
                      }
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Response Time</h4>
                    <p className="text-gray-700">
                      {developer.response_time || 'within 24 hours'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Areas */}
            {citiesCovered.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Service Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    This developer is available to serve clients in the following cities:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {citiesCovered.map((city: any, idx: number) => (
                      <span 
                        key={idx} 
                        className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm border border-blue-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {city}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Working Style & Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Availability & Engagement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-green-900">Verified Professional</span>
                    </div>
                    <p className="text-xs text-green-700">
                      {developer.is_verified ? 'Identity and credentials verified' : 'Pending verification'}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-blue-900">Quick Response</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Responds {developer.response_time || 'within 24 hours'}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium text-purple-900">Highly Rated</span>
                    </div>
                    <p className="text-xs text-purple-700">
                      {developer.rating || '0'}/5 stars from verified clients
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            {developer.projects && developer.projects.length > 0 ? (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {developer.projects.map((project: any) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <ProjectImageCarousel project={project} />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">{project.title || 'Untitled Project'}</h3>
                        
                        {/* Project Type Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.project_type && (
                            <>
                              {(() => {
                                let types: any[] = [];
                                if (Array.isArray(project.project_type)) {
                                  types = project.project_type;
                                } else if (typeof project.project_type === 'string') {
                                  // Try to parse if it's a JSON string
                                  try {
                                    const parsed = JSON.parse(project.project_type);
                                    types = Array.isArray(parsed) ? parsed : [project.project_type];
                                  } catch {
                                    types = [project.project_type];
                                  }
                                } else {
                                  types = [project.project_type];
                                }
                                
                                return types.map((type: any, typeIdx: number) => (
                                  <span 
                                    key={typeIdx}
                                    className="inline-flex items-center bg-[#226F75] text-white px-3 py-1.5 rounded-full text-xs font-medium"
                                  >
                                    {typeof type === 'string' ? type : type.name || type}
                                  </span>
                                ));
                              })()}
                            </>
                          )}
                          {(project.location || project.city || project.project_location) && (
                            <span className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-200">
                              <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {project.location || project.city || project.project_location}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{project.description || 'No description'}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <span className="font-medium text-green-600">
                            {project.budget ? `₦${project.budget}` : 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {project.status === 'completed' || (project.status === 'open' && project.estimated_hours == null)
                              ? 'Completed'
                              : project.contract_id != null
                              ? 'In progress'
                              : (project.completion_year || 'In progress')
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-600">
                  No projects available yet
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="credentials">
            {/* Always show 6 expected documents and whether each is submitted/verified */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(() => {
                const expected = [
                  { key: 'government_id', label: 'Government ID' },
                  { key: 'business_registration', label: 'Business Registration (CAC)' },
                  { key: 'selfie', label: 'Selfie' },
                  { key: 'license', label: 'License' },
                  { key: 'certification', label: 'Certification' },
                  { key: 'testimonial', label: 'Testimonial' }
                ];

                const docs: any[] = developer.documents || [];
                const docDescriptions: Record<string, string> = {
                  government_id: 'Government-issued ID (passport, driver\'s license)',
                  business_registration: 'Official company registration document',
                  selfie: 'Recent selfie for identity confirmation',
                  license: 'Professional license or permit',
                  certification: 'Relevant certification or certificate',
                  testimonial: 'Client testimonial or reference'
                };

                return expected.map((item) => {
                  const found = docs.find(d => (d.type || '').toLowerCase() === item.key || (d.filename || '').toLowerCase().includes(item.key));
                  const submitted = !!found;
                  const verified = !!(found && (found.verified === 1 || found.verified === true));

                  return (
                    <Card key={item.key} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{item.label}</h4>
                          {verified && (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        <p className="text-sm text-gray-600">
                          {docDescriptions[item.key] || item.label}
                        </p>

                        <div className="mt-3">
                          {verified ? (
                            <div className="inline-flex items-center text-xs text-green-600">✓ Verified by admin</div>
                          ) : submitted ? (
                            <div className="inline-flex items-center text-xs text-yellow-600">Pending verification</div>
                          ) : (
                            <div className="inline-flex items-center text-xs text-gray-500">Awaiting upload</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                });
              })()}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            {developer.reviews && developer.reviews.length > 0 ? (
              <div className="space-y-4">
                {developer.reviews.map((review: any) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{review.client_name || 'Anonymous'}</h4>
                          <p className="text-sm text-gray-600">
                            {review.project_title || 'Project'} • {review.review_date || 'Recently'}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">{review.rating || 0}/5</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment || 'No comment'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-600">
                  No reviews yet
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </>
        )}
      </div>

      <ProjectRequestModal 
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        developerName={developer?.name || 'Developer'}
      />
    </div>
  );
};

export default DeveloperProfile;
