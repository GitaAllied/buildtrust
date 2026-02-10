import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock, DollarSign, User, X, Menu } from "lucide-react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SignoutModal from "@/components/ui/signoutModal";
import DeveloperSidebar from "@/components/DeveloperSidebar";
import { useDispatch, useSelector } from "react-redux";
import { openDeveloperSidebar, openSignoutModal } from "@/redux/action";

const ProjectRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOpen = useSelector((state: any) => state.sidebar.developerSidebar);
  const signOutModal = useSelector((state: any) => state.signout);

  const requests = [
    {
      id: 1,
      client: "Divine Okechukwu",
      project: "Modern Duplex",
      location: "Lekki, Lagos",
      budget: "₦8.5M - ₦12M",
      timeline: "6 months",
      received: "2 hours ago",
      description:
        "Looking for an experienced developer to build a modern 4-bedroom duplex with contemporary finishes.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    },
    {
      id: 2,
      client: "Sarah Ibrahim",
      project: "Bungalow Renovation",
      location: "Abuja",
      budget: "₦4M - ₦6M",
      timeline: "3 months",
      received: "1 day ago",
      description:
        "Complete renovation of a 3-bedroom bungalow including kitchen and bathroom upgrades.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop",
    },
    {
      id: 3,
      client: "Michael Eze",
      project: "Commercial Building",
      location: "Port Harcourt",
      budget: "₦20M - ₦30M",
      timeline: "12 months",
      received: "3 days ago",
      description:
        "Construction of a 3-story commercial building for office and retail spaces.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="" />
          </Link>
        </div>
        <button
          onClick={() => dispatch(openDeveloperSidebar(!isOpen))}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-[#226F75]" />
          ) : (
            <Menu className="h-5 w-5 text-[#226F75]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <DeveloperSidebar active={"requests"} />

      <div className="flex-1 md:pl-64 w-full min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  Project Requests
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  Review and respond to client project requests
                </p>
              </div>
            </div>
            <Badge className="bg-blue-600 text-xs flex-shrink-0">
              {requests.length} New{" "}
              <span className=" hidden md:block">Requests</span>
            </Badge>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {requests.map((request) => (
              <Card key={request.id} className=" transition-shadow">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                      <AvatarImage src={request.avatar} />
                      <AvatarFallback className="text-xs">
                        {request.client
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base text-center md:text-left mb-1 truncate">
                        {request.project}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-2 flex-wrap">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">{request.client}</span>
                        <Badge variant="outline" className="text-xs">
                          {request.received}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base md:text-lg font-semibold text-green-600">
                        {request.budget}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 line-clamp-2">
                    {request.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 text-xs sm:text-sm">
                    <div className="flex justify-center items-center gap-1">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{request.location}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{request.timeline}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate text-xs">{request.budget}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs w-full sm:w-[33%]"
                      onClick={() => navigate(`/project/${request.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-xs w-full sm:w-[33%]"
                    >
                      {/* <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> */}
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-600 hover:bg-red-700 text-xs w-full sm:w-[33%] text-white"
                    >
                      {/* <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> */}
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() => dispatch(openSignoutModal(false))}
        />
      )}
    </div>
  );
};

export default ProjectRequests;
