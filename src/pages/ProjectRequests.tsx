
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, DollarSign, User, CheckCircle, X } from "lucide-react";

const ProjectRequests = () => {
  const navigate = useNavigate();

  const requests = [
    {
      id: 1,
      client: "Divine Okechukwu",
      project: "Modern Duplex",
      location: "Lekki, Lagos",
      budget: "₦8.5M - ₦12M",
      timeline: "6 months",
      received: "2 hours ago",
      description: "Looking for an experienced developer to build a modern 4-bedroom duplex with contemporary finishes.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      client: "Sarah Ibrahim",
      project: "Bungalow Renovation",
      location: "Abuja",
      budget: "₦4M - ₦6M",
      timeline: "3 months",
      received: "1 day ago",
      description: "Complete renovation of a 3-bedroom bungalow including kitchen and bathroom upgrades.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      client: "Michael Eze",
      project: "Commercial Building",
      location: "Port Harcourt",
      budget: "₦20M - ₦30M",
      timeline: "12 months",
      received: "3 days ago",
      description: "Construction of a 3-story commercial building for office and retail spaces.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    }
  ];

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
              <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">Project Requests</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate">Review and respond to client project requests</p>
            </div>
          </div>
          <Badge className="bg-blue-600 text-xs flex-shrink-0">{requests.length} New Requests</Badge>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6">
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                    <AvatarImage src={request.avatar} />
                    <AvatarFallback className="text-xs">{request.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs sm:text-sm md:text-base mb-1 truncate">{request.project}</h3>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-2 flex-wrap">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{request.client}</span>
                      <Badge variant="outline" className="text-xs">
                        {request.received}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-green-600">{request.budget}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 line-clamp-2">{request.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{request.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{request.timeline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                    <span className="truncate text-xs">{request.budget}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-xs w-full sm:w-auto"
                  >
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Accept Request
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs w-full sm:w-auto">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 text-xs w-full sm:w-auto">
                    <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectRequests;
