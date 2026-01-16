
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, Calendar, MapPin, User, Plus } from "lucide-react";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  const projects = [
    {
      id: 1,
      title: "Modern Duplex in Lekki",
      location: "Lekki, Lagos",
      developer: "Engr. Adewale Structures",
      status: "In Progress",
      progress: 45,
      startDate: "2024-08-15",
      expectedCompletion: "2025-02-15",
      budget: "₦8.5M",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop",
      lastUpdate: "Foundation complete, starting block work"
    },
    {
      id: 2,
      title: "Commercial Plaza",
      location: "Victoria Island, Lagos",
      developer: "Prime Build Ltd",
      status: "In Progress",
      progress: 20,
      startDate: "2024-10-01",
      expectedCompletion: "2025-10-01",
      budget: "₦25M",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop",
      lastUpdate: "Site preparation ongoing"
    },
    {
      id: 3,
      title: "Family Villa",
      location: "Abuja",
      developer: "Crystal Homes",
      status: "Completed",
      progress: 100,
      startDate: "2024-01-10",
      expectedCompletion: "2024-08-10",
      budget: "₦12M",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=200&fit=crop",
      lastUpdate: "Project completed successfully"
    },
    {
      id: 4,
      title: "Townhouse Development",
      location: "Port Harcourt",
      developer: "Horizon Builders",
      status: "Planning",
      progress: 0,
      startDate: "2025-01-01",
      expectedCompletion: "2025-12-01",
      budget: "₦18M",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=200&fit=crop",
      lastUpdate: "Awaiting permits and approvals"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-600";
      case "In Progress":
        return "bg-blue-600";
      case "Planning":
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.developer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || project.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">My Projects</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Track and manage your construction projects</p>
            </div>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm w-full sm:w-auto"
            onClick={() => navigate('/browse')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Start New Project
          </Button>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6">
        {/* Search and Filter */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10 text-xs sm:text-sm h-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select 
              className="px-3 sm:px-4 py-2 border rounded-lg bg-white text-xs sm:text-sm h-9 flex-1 sm:flex-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Projects Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <p className="text-lg sm:text-2xl font-bold text-gray-900">4</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Total Projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <p className="text-lg sm:text-2xl font-bold text-blue-600">2</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <p className="text-lg sm:text-2xl font-bold text-green-600">1</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <p className="text-lg sm:text-2xl font-bold text-orange-600">1</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Planning</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full sm:w-24 md:w-32 h-40 sm:h-24 md:h-32 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base truncate">{project.title}</h3>
                      <Badge className={`${getStatusColor(project.status)} text-xs flex-shrink-0`}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{project.developer}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate text-xs">{project.startDate} - {project.expectedCompletion}</span>
                      </div>
                    </div>

                    {project.status === "In Progress" && (
                      <div className="mb-3 sm:mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="font-semibold text-sm sm:text-base text-green-600">{project.budget}</p>
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="text-xs w-full sm:w-auto"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        View Details
                      </Button>
                    </div>

                    <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600">
                        <strong>Latest Update:</strong> {project.lastUpdate}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-500 mb-4">No projects found matching your criteria.</p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => navigate('/browse')}
            >
              Start Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
