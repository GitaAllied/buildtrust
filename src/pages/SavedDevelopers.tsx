
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MessageSquare, Heart } from "lucide-react";

const SavedDevelopers = () => {
  const navigate = useNavigate();

  const savedDevelopers = [
    {
      id: 1,
      name: "Engr. Adewale Structures",
      specialization: "Residential Construction",
      rating: 4.9,
      projects: 24,
      location: "Lagos, Nigeria",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
      savedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Prime Build Ltd",
      specialization: "Commercial Development",
      rating: 4.8,
      projects: 18,
      location: "Abuja, Nigeria",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      savedDate: "2024-02-10"
    },
    {
      id: 3,
      name: "Covenant Builders",
      specialization: "Renovations & Repairs",
      rating: 4.7,
      projects: 32,
      location: "Port Harcourt, Nigeria",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      savedDate: "2024-01-28"
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
              <h1 className="text-2xl font-bold text-gray-900">Saved Developers</h1>
              <p className="text-gray-500">Your favorite developers for future projects</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-6">
          {savedDevelopers.map((developer) => (
            <Card key={developer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={developer.avatar} />
                    <AvatarFallback>{developer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{developer.name}</h3>
                      <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    <p className="text-gray-600 mb-2">{developer.specialization}</p>
                    <p className="text-sm text-gray-500 mb-3">{developer.location}</p>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{developer.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {developer.projects} projects completed
                      </span>
                      <Badge variant="outline">
                        Saved {developer.savedDate}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => navigate(`/developer/${developer.id}`)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate('/messages')}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedDevelopers;
