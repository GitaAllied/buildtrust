import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from '../assets/Logo.png'

const BrowseDevelopers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedProjectType, setSelectedProjectType] = useState("all");
  const [minTransparency, setMinTransparency] = useState(70);
  const [budgetRange, setBudgetRange] = useState("all");

  // Mock data for developers
  const developers = [
    {
      id: 1,
      name: "Adebayo Construction Ltd",
      developer: "Eng. Adebayo Okonkwo",
      verified: true,
      location: "Lagos, Nigeria",
      experience: 8,
      transparencyScore: 95,
      bio: "Specialized in luxury residential properties with sustainable building practices.",
      projects: [
        { image: "/placeholder.svg", title: "Modern Villa in Lekki" },
        { image: "/placeholder.svg", title: "Duplex in Victoria Island" }
      ],
      rating: 4.9,
      completedProjects: 47
    },
    {
      id: 2,
      name: "Sterling Homes",
      developer: "Arch. Funmi Sterling",
      verified: true,
      location: "Abuja, Nigeria",
      experience: 12,
      transparencyScore: 92,
      bio: "Award-winning architect focusing on contemporary African design.",
      projects: [
        { image: "/placeholder.svg", title: "Commercial Complex Abuja" },
        { image: "/placeholder.svg", title: "Residential Estate Gwarinpa" }
      ],
      rating: 4.8,
      completedProjects: 73
    },
    {
      id: 3,
      name: "Royal Build Concept",
      developer: "Engr. Chukwuma Royal",
      verified: true,
      location: "Port Harcourt, Nigeria",
      experience: 6,
      transparencyScore: 88,
      bio: "Delivering quality homes with innovative designs and timely completion.",
      projects: [
        { image: "/placeholder.svg", title: "Waterfront Bungalow" },
        { image: "/placeholder.svg", title: "Twin Duplex Estate" }
      ],
      rating: 4.7,
      completedProjects: 29
    }
  ];

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
            {filteredDevelopers.length} Developer{filteredDevelopers.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Escrow-backed guarantee available</span>
          </div>
        </div>

        {/* Developer Cards */}
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
                      <p className="text-sm text-gray-600">{dev.developer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{dev.transparencyScore}%</div>
                      <div className="text-xs text-gray-500">Trust Score</div>
                    </div>
                  </div>

                  {/* Project Thumbnails */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {dev.projects.slice(0, 2).map((project, idx) => (
                      <div key={idx} className="relative">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-end">
                          <span className="text-white text-xs p-2 truncate">{project.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {dev.location} • {dev.experience} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {dev.rating} rating • {dev.completedProjects} projects completed
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{dev.bio}</p>

                  <Button className="w-full bg-[#253E44] hover:bg-[#253E44]/90">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredDevelopers.length === 0 && (
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
