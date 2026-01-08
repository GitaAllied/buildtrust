
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
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Requests</h1>
              <p className="text-gray-500">Review and respond to client project requests</p>
            </div>
          </div>
          <Badge className="bg-blue-600">{requests.length} New Requests</Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback>{request.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{request.project}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <User className="h-4 w-4" />
                        <span>{request.client}</span>
                        <Badge variant="outline" className="text-xs">
                          {request.received}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">{request.budget}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{request.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{request.timeline}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>{request.budget}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Request
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <X className="h-4 w-4 mr-2" />
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
