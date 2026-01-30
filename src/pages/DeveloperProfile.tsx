
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectRequestModal from "../components/ProjectRequestModal";
import { apiClient } from "@/lib/api";
import Logo from '../assets/Logo.png'

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
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About {developer.name || 'Developer'}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{developer.bio || 'No bio available'}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      {citiesCovered.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Cities Served</h4>
                          <div className="flex flex-wrap gap-2">
                            {citiesCovered.map((city: any, idx: number) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                {city}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {developer.build_types && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Build Types</h4>
                          <div className="flex flex-wrap gap-2">
                            {developer.build_types.map((type: any, idx: number) => (
                              <span key={idx} className="bg-[#226F75]/10 text-[#226F75] px-2 py-1 rounded text-sm">
                                {typeof type === 'string' ? type : type.name || type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">{developer.years_experience || 'N/A'} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects Completed</span>
                      <span className="font-medium">{developer.completed_projects || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Languages</span>
                      <span className="font-medium">
                        {developer.languages ? 
                          (Array.isArray(developer.languages) ? developer.languages.join(", ") : developer.languages)
                          : 'Not specified'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium">{developer.rating || 'N/A'}/5</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            {developer.projects && developer.projects.length > 0 ? (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {developer.projects.map((project: any) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <img 
                        src={project.image || '/placeholder.svg'} 
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{project.title || 'Untitled Project'}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {project.project_type || 'Project'} • {project.location || 'Not specified'}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">{project.description || 'No description'}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-green-600">
                            {project.budget ? `₦${project.budget}` : 'N/A'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {project.completion_year || 'In progress'}
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
                  No portfolio projects available yet
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="credentials">
            {developer.licenses && developer.licenses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {developer.licenses.map((license: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{license.name || 'License'}</h4>
                        {license.is_verified && (
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{license.license_type || 'License'}</p>
                      {license.is_verified && (
                        <div className="mt-2 text-xs text-green-600">✓ Verified</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-600">
                  No credentials available yet
                </CardContent>
              </Card>
            )}
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
