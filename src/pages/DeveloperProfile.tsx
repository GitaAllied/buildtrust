
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectRequestModal from "../components/ProjectRequestModal";

const DeveloperProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mock developer data (in a real app, this would come from an API)
  const developer = {
    id: 1,
    name: "Adebayo Construction Ltd",
    developer: "Eng. Adebayo Okonkwo",
    verified: true,
    location: "Lagos, Nigeria",
    experience: 8,
    transparencyScore: 95,
    rating: 4.9,
    completedProjects: 47,
    bio: "Specialized in luxury residential properties with sustainable building practices. Our team has been delivering exceptional homes across Lagos for over 8 years, with a focus on quality craftsmanship and innovative design solutions.",
    citiesServed: ["Lagos", "Ogun", "Oyo"],
    buildTypes: ["Duplex", "Bungalow", "Commercial", "Estate Development"],
    languages: ["English", "Yoruba", "Igbo"],
    responseTime: "Within 2 hours",
    portfolio: [
      {
        id: 1,
        title: "Modern Villa in Lekki",
        type: "Luxury Duplex",
        location: "Lekki, Lagos",
        budget: "₦45M",
        image: "/placeholder.svg",
        description: "A stunning 5-bedroom duplex with modern amenities, swimming pool, and smart home features.",
        completedYear: 2023
      },
      {
        id: 2,
        title: "Duplex in Victoria Island",
        type: "Residential",
        location: "Victoria Island, Lagos",
        budget: "₦62M",
        image: "/placeholder.svg",
        description: "Waterfront duplex with panoramic city views and premium finishes throughout.",
        completedYear: 2023
      },
      {
        id: 3,
        title: "Commercial Complex",
        type: "Commercial",
        location: "Ikeja, Lagos",
        budget: "₦120M",
        image: "/placeholder.svg",
        description: "Multi-story office complex with retail spaces and modern business facilities.",
        completedYear: 2022
      }
    ],
    licenses: [
      { name: "COREN Certification", type: "Professional License", verified: true },
      { name: "CAC Registration", type: "Business Registration", verified: true },
      { name: "NIOB Membership", type: "Professional Body", verified: true }
    ],
    reviews: [
      {
        id: 1,
        client: "Mrs. Adunni Johnson",
        rating: 5,
        project: "4-Bedroom Duplex",
        date: "March 2024",
        comment: "Exceptional work! The project was completed on time and within budget. The attention to detail was outstanding."
      },
      {
        id: 2,
        client: "Mr. Tunde Williams",
        rating: 5,
        project: "Commercial Building",
        date: "January 2024",
        comment: "Professional team, excellent communication throughout the project. Highly recommended!"
      },
      {
        id: 3,
        client: "Dr. Chioma Okafor",
        rating: 4,
        project: "Luxury Bungalow",
        date: "November 2023",
        comment: "Great quality construction. Minor delays due to weather but overall very satisfied with the outcome."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate('/browse')} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => navigate('/')} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BT</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">BuildTrust Africa</span>
            </button>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Escrow-backed guarantee available</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Banner Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{developer.name}</h1>
                  {developer.verified && (
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-lg text-gray-600 mb-4">{developer.developer}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {developer.location}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {developer.rating} ({developer.completedProjects} projects)
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {developer.transparencyScore}% Trust Score
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-0">
                <Button 
                  onClick={() => setShowRequestModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3 h-auto"
                >
                  Request to Build
                </Button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Responds {developer.responseTime}
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
                    <CardTitle>About {developer.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{developer.bio}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Cities Served</h4>
                        <div className="flex flex-wrap gap-2">
                          {developer.citiesServed.map((city) => (
                            <span key={city} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {city}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Build Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {developer.buildTypes.map((type) => (
                            <span key={type} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
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
                      <span className="font-medium">{developer.experience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projects Completed</span>
                      <span className="font-medium">{developer.completedProjects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Languages</span>
                      <span className="font-medium">{developer.languages.join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium">{developer.responseTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {developer.portfolio.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{project.type} • {project.location}</p>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-600">{project.budget}</span>
                        <span className="text-sm text-gray-500">{project.completedYear}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="credentials">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {developer.licenses.map((license, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{license.name}</h4>
                      {license.verified && (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{license.type}</p>
                    <div className="mt-2 text-xs text-green-600">✓ Verified</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {developer.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.client}</h4>
                        <p className="text-sm text-gray-600">{review.project} • {review.date}</p>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ProjectRequestModal 
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        developerName={developer.name}
      />
    </div>
  );
};

export default DeveloperProfile;
