import { useState, useEffect, useRef, type ChangeEvent, type PointerEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Menu, X, Download, AlertCircle } from "lucide-react";
import Logo from "../assets/Logo.png";
import {
  FaBook,
  FaBriefcase,
  FaCalendar,
  FaDoorOpen,
  FaDownload,
  FaFileContract,
  FaGear,
  FaHeadset,
  FaImages,
  FaLocationPin,
  FaMessage,
  FaMoneyBill,
  FaShare,
  FaStar,
  FaTableCells,
  FaUpload,
  FaUser,
  FaUserGear,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import SignoutModal from "@/components/ui/signoutModal";
import { apiClient } from "@/lib/api";

// Helper function to construct full image URL
const getImageUrl = (mediaUrl?: string): string => {
  if (!mediaUrl) {
    console.log('⚠️ No media URL provided, using placeholder');
    return "https://placehold.net/main.svg";
  }

  if (mediaUrl.startsWith('http')) {
    console.log('✅ Full URL detected:', mediaUrl);
    return mediaUrl;
  }

  const apiBase = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/+$/, '');
  const backendOrigin = apiBase.startsWith('http')
    ? apiBase.replace(/\/api$/, '')
    : window.location.origin;

  let resolvedUrl = mediaUrl;
  if (!resolvedUrl.startsWith('/')) {
    resolvedUrl = `/${resolvedUrl}`;
  }

  const finalUrl = `${backendOrigin}${resolvedUrl}`;
  console.log('🖼️ Image URL constructed:', { mediaUrl, backendOrigin, finalUrl });
  return finalUrl;
};


const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contractTemplate, setContractTemplate] = useState<string>('');

  const [activeTab, setActiveTab] = useState("projects");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signOutModal, setSignOutModal] = useState(false);
  const [contractSigned, setContractSigned] = useState(false);
  const [contractTermsAccepted, setContractTermsAccepted] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSubmittingSignature, setIsSubmittingSignature] = useState(false);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [projectFiles, setProjectFiles] = useState<any[]>([]);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Determine which sidebar items to show based on user role
  const getDefaultSidebarItems = () => {
    if (user?.role === "developer") {
      return [
        { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
        { id: "requests", label: "Project Requests", icon: <FaDownload /> },
        { id: "projects", label: "Active Projects", icon: <FaBriefcase />, active: true },
        { id: "upload", label: "Upload Update", icon: <FaUpload /> },
        { id: "messages", label: "Messages", icon: <FaMessage /> },
        { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
        { id: "profile", label: "Licenses & Profile", icon: <FaUser /> },
        { id: "support", label: "Support", icon: <FaGear /> },
      ];
    }
    // Client sidebar items
    return [
      { id: "dashboard", label: "Dashboard", icon: <FaUser /> },
      { id: "projects", label: "Projects", icon: <FaBriefcase />, active: true },
      { id: "payments", label: "Payments", icon: <FaMoneyBill /> },
      { id: "messages", label: "Messages", icon: <FaMessage /> },
      { id: "contracts", label: "Contracts", icon: <FaFileContract /> },
      { id: "saved", label: "Saved Developers", icon: <FaUserGear /> },
      { id: "settings", label: "Settings", icon: <FaGear /> },
    ];
  };

  const [sidebarItems, setSidebarItems] = useState(getDefaultSidebarItems());

  useEffect(() => {
    if (!project || !user?.role) return;
    const signed = user.role === 'developer'
      ? !!project.contract?.developer_signed_at
      : user.role === 'client'
      ? !!project.contract?.client_signed_at
      : false;
    setContractSigned(signed);
  }, [project, user?.role]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isCanvasBlank = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d');
    if (!context) return true;
    const pixelBuffer = new Uint32Array(
      context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );
    return !pixelBuffer.some(color => color !== 0);
  };

  const handleSignaturePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    lastPointRef.current = { x, y };
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1F2937';
  };

  const handleSignaturePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas || !lastPointRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    lastPointRef.current = { x, y };
  };

  const handleSignaturePointerUp = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.closePath();
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const clearSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureFile(null);
    setSignatureDataUrl('');
    setSignatureError(null);
  };

  const handleSignatureUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    setSignatureFile(file);
    setSignatureDataUrl('');
    setSignatureError(null);
  };

  const getSignatureDataUrl = (): string | null => {
    if (signatureFile) return null;
    const canvas = signatureCanvasRef.current;
    if (!canvas || isCanvasBlank(canvas)) return null;
    return canvas.toDataURL('image/png');
  };

  const handleSignContract = async () => {
    if (!contractTermsAccepted) {
      setSignatureError('Please agree to the contract terms before signing.');
      return;
    }

    const signatureData = getSignatureDataUrl();
    if (!signatureFile && !signatureData) {
      setSignatureError('Draw or upload your signature before signing.');
      return;
    }

    setIsSubmittingSignature(true);
    setSignatureError(null);

    try {
      const response = await apiClient.signProjectContract(Number(id), {
        signatureFile: signatureFile ?? undefined,
        signatureDataUrl: signatureData ?? undefined,
        role: user?.role || 'developer'
      });

      setContractSigned(true);
      if (signatureData) {
        setSignatureDataUrl(signatureData);
      }
      if (response?.signatureUrl) {
        setSignatureDataUrl(signatureData || response.signatureUrl);
      }
    } catch (err) {
      console.error('Contract signing failed:', err);
      setSignatureError((err as Error)?.message || 'Failed to sign contract');
    } finally {
      setIsSubmittingSignature(false);
    }
  };

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "dashboard":
        setActiveTab(itemId);
        navigate(user?.role === "developer" ? "/developer-dashboard" : "/client-dashboard");
        break;
      case "requests":
        navigate("/project-requests");
        break;
      case "projects":
        navigate(user?.role === "developer" ? "/active-projects" : "/projects");
        break;
      case "upload":
        navigate("/upload-update");
        break;
      case "payments":
        navigate(user?.role === "developer" ? "/developer-payments" : "/payments");
        break;
      case "messages":
        navigate(user?.role === "developer" ? "/developer-messages" : "/messages");
        break;
      case "contracts":
        navigate("/contracts");
        break;
      case "saved":
        navigate("/saved-developers");
        break;
      case "profile":
        navigate("/developer-liscences");
        break;
      case "support":
        navigate("/support");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "logout":
        handleLogout();
        break;
      default:
        navigate("/browse");
    }
  };

  useEffect(() => {
    // Update sidebar items when user role changes
    setSidebarItems(getDefaultSidebarItems());
  }, [user?.role]);

  useEffect(() => {
    if (!id || loading === false && project) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getProjectById(id);
        console.log('📦 Project fetched:', response);
        console.log('🖼️ Media info:', response?.project?.media);
        
        const projectData = response?.project || null;
        if (!projectData) {
          setError('Project not found');
          return;
        }

        setProject(projectData);

        // Populate projectFiles with contract, signatures, and media
        const files: any[] = [];
        
        // Add contract PDF
        if (projectData.contract) {
          files.push({
            type: 'contract',
            name: 'Service Agreement',
            description: 'Contract PDF',
            date: projectData.contract.created_at || projectData.created_at,
            icon: FaFileContract,
            color: 'bg-red-50 text-red-600'
          });
        }
        
        // Add developer signature
        if (projectData.contract?.developer_signature) {
          files.push({
            type: 'signature',
            name: 'Developer Signature',
            description: 'Developer signed',
            date: projectData.contract.developer_signed_at,
            icon: FaUser,
            color: 'bg-green-50 text-green-600'
          });
        }
        
        // Add client signature
        if (projectData.contract?.client_signature) {
          files.push({
            type: 'signature',
            name: 'Client Signature',
            description: 'Client signed',
            date: projectData.contract.client_signed_at,
            icon: FaUser,
            color: 'bg-blue-50 text-blue-600'
          });
        }
        
        // Add project media
        if (projectData.media && Array.isArray(projectData.media)) {
          projectData.media.forEach((media: any) => {
            files.push({
              type: 'media',
              name: media.filename || 'Project File',
              description: media.description || 'Project media',
              date: media.created_at,
              url: media.media_url,
              icon: FaImages,
              color: 'bg-purple-50 text-purple-600'
            });
          });
        }
        
        // Sort by date descending (newest first)
        files.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        
        setProjectFiles(files);

        // Fetch contract template from database
        try {
          console.log('📄 Fetching contract template...');
          const templateResponse = await apiClient.getContractTemplate();
          console.log('📄 Contract template response:', templateResponse);
          
          // Handle different response structures
          let contractTerms = null;
          
          if (templateResponse?.template?.contract_terms) {
            contractTerms = templateResponse.template.contract_terms;
            console.log('✅ Contract template loaded (nested structure)');
          } else if (templateResponse?.contract_terms) {
            contractTerms = templateResponse.contract_terms;
            console.log('✅ Contract template loaded (direct structure)');
          } else if (templateResponse?.data?.contract_terms) {
            contractTerms = templateResponse.data.contract_terms;
            console.log('✅ Contract template loaded (data structure)');
          }
          
          if (contractTerms) {
            setContractTemplate(contractTerms);
          } else {
            console.warn('⚠️ Contract template not found in response:', {
              hasNestedTemplate: !!templateResponse?.template?.contract_terms,
              hasDirectTerms: !!templateResponse?.contract_terms,
              hasDataTerms: !!templateResponse?.data?.contract_terms,
              responseKeys: Object.keys(templateResponse || {})
            });
            setContractTemplate('Contract template not available');
          }
        } catch (err) {
          console.error('❌ Failed to fetch contract template:', {
            error: err,
            message: (err as any)?.message,
            status: (err as any)?.status
          });
          setContractTemplate('Failed to load contract template');
        }
      } catch (err) {
        console.error('❌ Failed to fetch project:', err);
        setError('Failed to load project details. Please try again.');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#226F75]/10">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-[#226F75] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="mt-3 text-sm text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#226F75]/10">
        <div className="text-center">
          <p className="text-red-600 font-semibold">{error || 'Project not found'}</p>
          <Button onClick={() => navigate(-1)} className="mt-4 bg-[#226F75]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatBudget = (min?: number, max?: number) => {
    if (min && max) {
      const minFormatted = `$${Number(min).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      const maxFormatted = `$${Number(max).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      return `${minFormatted} - ${maxFormatted}`;
    }
    return "Budget TBD";
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return "Timeline pending";
    const durationMap: Record<string, string> = {
      '3-6': '3-6 months',
      '6-12': '6-12 months',
      '12-18': '12-18 months',
      '18+': '18+ months'
    };
    return durationMap[duration] || duration;
  };

  const formatStartDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatFileDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleFileDownload = async (file: any) => {
    try {
      if (file.type === 'contract') {
        // Download or generate contract PDF
        await generateContractPDF();
      } else if (file.url) {
        // Download file from URL
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  const daysLeft = project.hours_remaining ? Math.ceil(project.hours_remaining / 24) : null;

  const generateContractPDF = async () => {
    try {
      console.log('📥 Generating contract download with template from database');
      
      // Use ONLY database contract template
      if (!contractTemplate || contractTemplate === 'No contract template available' || contractTemplate === 'Failed to load contract template') {
        console.warn('⚠️ Contract template not available:', { contractTemplate });
        alert('Contract template is not yet loaded. Please wait a moment and try again.');
        return;
      }

      console.log('✅ Using database contract template, length:', contractTemplate.length);

      // Append signature information to database template
      const fullContent = `${contractTemplate}

================================================================================
                              SIGNATURE SECTION
================================================================================

CLIENT SIGNATURE:
Signed: ${project.contract?.client_signed_at ? 'YES' : 'PENDING'}
Date: ${project.contract?.client_signed_at ? new Date(project.contract.client_signed_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Awaiting signature'}

DEVELOPER SIGNATURE:
Signed: ${project.contract?.developer_signed_at ? 'YES' : 'PENDING'}
Date: ${project.contract?.developer_signed_at ? new Date(project.contract.developer_signed_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Awaiting signature'}

================================================================================

Generated by BuildTrust Africa Platform
Copyright © 2026 BuildTrust Africa. All rights reserved.
This document is confidential and legally binding.

================================================================================
      `;

      console.log('📄 Contract content prepared for download, total length:', fullContent.length);

      // Create a blob from the content
      const blob = new Blob([fullContent], { type: 'text/plain' });
      
      // Create temporary download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Contract_${project.title.replace(/\s+/g, '_')}_${new Date().getTime()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Contract downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading contract:', error);
      alert('Failed to download contract. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#226F75]/10 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-white/20 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2 w-[20%]">
          <Link to={"/"}>
            <img src={Logo} alt="Build Trust Africa Logo" />
          </Link>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 sm:p-2 hover:bg-[#226F75]/10 rounded-lg transition-colors"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-[#226F75]" />
          ) : (
            <Menu className="h-5 w-5 text-[#226F75]" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block md:w-64 bg-white/95 backdrop-blur-sm shadow-lg md:shadow-sm border-r border-white/20 fixed top-14 md:top-0 left-0 right-0 h-[calc(100vh-56px)] md:h-screen z-40 md:z-auto overflow-y-auto`}
      >
        <div className=" h-full flex flex-col justify-start md:justify-between">
          <div>
            {/* logo */}
            <div className="p-4 sm:pb-2 sm:p-6 hidden md:block">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity w-full"
              >
                <Link to={"/"}>
                  <img src={Logo} alt="" className="w-[55%]" />
                </Link>
              </button>
            </div>
            {/* nav links */}
            <nav className="p-3 sm:p-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavigation(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-[#226F75]/10 to-[#253E44]/10 text-[#226F75] border-[#226F75]"
                      : "text-gray-600 hover:bg-[#226F75]/5 hover:text-[#226F75]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Signout Button */}
          <div className="p-3 sm:p-4">
            <button
              onClick={() => {
                setSignOutModal(true);
              }}
              className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-md sm:rounded-xl mb-1 transition-all text-sm sm:text-sm font-medium flex gap-2 items-center text-red-500"
            >
              <FaDoorOpen />
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 md:pl-64 w-full min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-12 md:top-0 z-30 shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">
                  {user?.role === "developer" ? "Active Projects" : "My Projects"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {user?.role === "developer" ? "View and manage project updates" : "Track and manage your construction projects"}
                </p>
              </div>
            </div>
            <Button
              className="bg-[#253E44] hover:bg-[#253E44]/90 text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => navigate(user?.role === "developer" ? "/upload-update" : "/browse")}
            >
              {user?.role === "developer" ? "Upload Update" : "Start New Project"}
            </Button>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-10">
          {/* Content */}
          <div className="max-w-6xl mx-auto space-y-3">
            <div className=" flex items-center gap-2">
              <Badge className="text-[10px] uppercase p-3 py-1">
                {project.status || 'Pending'}
              </Badge>
              <p className=" flex items-center gap-1 text-sm text-gray-600">
                <FaLocationPin /> {project.location || 'Location TBD'}
              </p>
            </div>
            <div className="flex md:items-center justify-between flex-col md:flex-row items-start gap-3 ">
              <h1 className="text-2xl md:text-4xl font-extrabold">
                {project.title}
              </h1>
              <div className=" flex items-center gap-4">
                <Button
                onClick={() => navigate("/project-requests")}
                variant="ghost"
                className=" border"
              >
                All Projects
              </Button>
              <Button
                // variant="ghost"
                className=""
                style={{ display: user?.role === "developer" ? "none" : "inline-flex" }}
              >
                <FaShare/> Share
              </Button>
              </div>
            </div>

            <div className=" py-5 relative">
              <img
                src={getImageUrl(project.media?.url)}
                alt={project.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-3xl"
                onError={(e) => {
                  console.error('❌ Image failed to load:', (e.target as HTMLImageElement).src);
                  (e.target as HTMLImageElement).src = "https://placehold.net/main.svg";
                }}
              />
              <div className=" absolute bottom-10 left-5">
                <p className=" text-xs sm:text-sm text-white">Estimated completion</p>
                <p className=" font-bold text-lg sm:text-xl text-white">{project.duration ? formatDuration(project.duration) : 'TBD'}</p>
              </div>
            </div>

            {/* section below image */}
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* section to the left */}
              <div className=" md:col-span-2 space-y-3">
                {/* stats cards */}
                <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Card className=" p-6 sm:p-8 md:p-10 px-6 sm:px-8 flex flex-col items-center">
                    <p className=" text-xs font-bold text-[#253E44]/50">
                      TOTAL BUDGET
                    </p>
                    <h1 className=" font-extrabold text-lg sm:text-xl text-[#253E44]">
                      {formatBudget(project.budget_min, project.budget_max)}
                    </h1>
                  </Card>
                  <Card className="p-6 sm:p-8 md:p-10 px-6 sm:px-8 flex flex-col items-center">
                    <p className=" text-xs font-bold text-[#253E44]/50">
                      PROJECT TIMELINE
                    </p>
                    <h1 className=" font-extrabold text-lg sm:text-xl text-[#253E44]">
                      {formatDuration(project.duration)}
                    </h1>
                    {daysLeft && project.acceptance_status === 'pending' && (
                      <p className=" text-xs text-gray-400">{daysLeft} days left to decide</p>
                    )}
                  </Card>
                  <Card className="p-6 sm:p-8 md:p-10 px-6 sm:px-8 text-center">
                    <p className=" text-xs font-bold text-[#253E44]/50">
                      PROJECT STATUS
                    </p>
                    <div className=" flex items-center justify-center gap-2 mt-2">
                      <h1 className=" font-extrabold text-lg sm:text-xl text-[#253E44]">
                        {project.acceptance_status === 'pending' ? '⏳ Pending' : project.acceptance_status === 'accepted' ? '✓ Accepted' : 'Rejected'}
                      </h1>
                    </div>
                  </Card>
                </div>
                {/* project description */}
                <Card className=" p-4 sm:p-6 md:p-8 space-y-3">
                  <h3 className="font-bold text-base sm:text-lg">Project Description</h3>
                  <p className="text-sm text-gray-700 leading-6">
                    {project.message || 'No description provided'}
                  </p>
                  {project.building_type && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">{project.building_type}</Badge>
                    </div>
                  )}
                  <p className=" text-xs text-gray-400 flex items-center gap-1">
                    <FaCalendar /> Started {formatStartDate(project.start_date)}
                  </p>
                </Card>
                {/* milestones */}
                <Card>
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold">Milestones</h3>
                      <button className="text-[#253E44] text-sm font-bold hover:underline">
                        View All
                      </button>
                    </div>
                    <div className="relative pl-8 space-y-12">
                      <div className="absolute left-[12px] top-2 bottom-2 w-0.5 bg-gray-500"></div>
                      <div className="relative">
                        <div className="absolute -left-[27px] mt-1 w-4 h-4 rounded-full bg-[#253E44] border-4 border-white ring-4 ring-[#253E44]/20"></div>
                        <div className="flex items-start justify-between">
                          <div className = " w-[80%]">
                            <h4 className="font-bold text-sm md:text-base">
                              Foundation &amp; Earthworks
                            </h4>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">
                              Completed on Oct 12, 2024
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-extrabold rounded-full uppercase text-nowrap">
                            Completed
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[27px] mt-1 w-4 h-4 rounded-full bg-[#253E44] border-4 border-white ring-4 ring-[#253E44]/40 animate-pulse"></div>
                        <div className="flex items-start justify-between">
                          <div className = " w-[80%]">
                            <h4 className="font-bold text-sm md:text-base">
                              Block Work &amp; Lintel
                            </h4>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">
                              Started Nov 01, 2024 • Expected end Dec 20
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-[#253E44]/10 text-[#253E44] text-[10px] font-extrabold rounded-full uppercase text-nowrap">
                            In Progress
                          </span>
                        </div>
                      </div>
                      <div className="relative opacity-60">
                        <div className="absolute -left-[27px] mt-1 w-4 h-4 rounded-full bg-slate-200 border-4 border-white"></div>
                        <div className="flex items-start justify-between text-gray-300">
                          <div className = " w-[80%]">
                            <h4 className="font-bold text-sm md:text-base">
                              Roofing &amp; External Finishing
                            </h4>
                            <p className="text-xs md:text-sm text-slate-500 mt-1">
                              Estimated start January 2025
                            </p>
                          </div>
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-extrabold rounded-full uppercase text-nowrap">
                            Upcoming
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* section to the right */}
              <div>
                <div className="space-y-6">
                  {user?.role !== 'developer' && (
                    <Card className="">
                      <div className="p-6 space-y-3">
                        <p className="text-slate-400 text-xs font-bold uppercase">
                          Project Developer
                        </p>
                        <div className="flex items-center gap-4">
                          <img
                            alt={project.developer?.name}
                            className="w-16 h-16 rounded-full object-cover"
                            src="https://placehold.net/avatar-4.svg"
                          />
                          <div>
                            <h4 className="font-bold text-[#253E44] ">
                              {project.developer?.name || 'Assigned Developer'}
                            </h4>
                            {project.developer && (
                              <div className="flex items-center gap-1">
                                <span className="material-icons-round text-yellow-400 text-[14px]">
                                  <FaStar/>
                                </span>
                                <span className="text-xs font-bold text-slate-700">
                                  {project.developer.rating || 'N/A'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  ({project.developer.total_reviews || 0} reviews)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <button className="w-full bg-[#253E44] hover:bg-slate-800 text-sm text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                            <FaMessage/>
                            Message Developer
                          </button>
                          <button className="w-full bg-white border border-slate-200 hover:border-[#226F75] text-[#253E44] text-sm font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                            <FaBook/>
                            Request Inspection
                          </button>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">
                            Response time
                          </span>
                          <span className="font-bold">
                            &lt; 2 hours
                          </span>
                        </div>
                      </div>
                    </Card>
                  )}
                  {/* Alert when contract needs re-signing */}
                  {project?.contract?.needs_resign && project?.acceptance_status !== 'pending' && ['developer', 'client'].includes(user?.role) && !contractSigned && (
                    <Card className="p-4 border-2 border-yellow-400 bg-yellow-50">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-bold text-yellow-900">Contract Requires Re-signing</h4>
                          <p className="text-sm text-yellow-800 mt-1">
                            The admin has updated the contract terms. You need to review and re-sign the updated contract below.
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                  {/* Contract Review & Signing Card - Shows when project is accepted */}
                  {['developer', 'client'].includes(user?.role) && project?.acceptance_status === 'accepted' && (
                    <Card className={`p-6 space-y-4 border-2 ${contractSigned ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <FaFileContract className="text-blue-600 text-xl" />
                        <div>
                          <h4 className={`font-bold text-lg ${contractSigned ? 'text-green-700' : 'text-blue-700'}`}>
                            {contractSigned ? '✓ Contract Signed' : 'Review & Sign Contract'}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {user?.role === 'developer' ? 'Developer contract signature' : 'Client contract signature'}
                          </p>
                        </div>
                      </div>

                      {!contractSigned ? (
                        <>
                          <div className="bg-white p-4 rounded-lg border border-blue-200 max-h-96 overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-bold text-sm text-[#253E44]">SERVICE AGREEMENT & LEGAL CONTRACT</h5>
                              <button
                                onClick={generateContractPDF}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Download contract as document"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </button>
                            </div>
                            <div className="text-xs space-y-4 text-gray-700 prose prose-sm max-w-none whitespace-pre-wrap">
                              {contractTemplate && contractTemplate !== 'Loading contract template...' ? (
                                contractTemplate
                              ) : contractTemplate === 'Failed to load contract template' ? (
                                <p className="text-red-500 font-semibold">⚠️ {contractTemplate}</p>
                              ) : (
                                <p className="text-gray-500">Loading contract template...</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-slate-700">Add your signature</p>
                              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <canvas
                                  ref={signatureCanvasRef}
                                  width={520}
                                  height={140}
                                  onPointerDown={handleSignaturePointerDown}
                                  onPointerMove={handleSignaturePointerMove}
                                  onPointerUp={handleSignaturePointerUp}
                                  onPointerLeave={handleSignaturePointerUp}
                                  className="w-full h-36 bg-white"
                                />
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                <label className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer">
                                  Upload image
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/gif"
                                    onChange={handleSignatureUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={clearSignatureCanvas}
                                  className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                  Clear signature
                                </button>
                              </div>
                              {signatureFile && (
                                <p className="text-xs text-slate-600">Selected file: {signatureFile.name}</p>
                              )}
                              {signatureDataUrl && (
                                <div className="mt-2">
                                  <p className="text-xs text-slate-600 mb-1">Signature preview:</p>
                                  <img src={signatureDataUrl} alt="Signature preview" className="max-h-24 rounded-lg border border-slate-200" />
                                </div>
                              )}
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <input
                                type="checkbox"
                                id="contractTerms"
                                checked={contractTermsAccepted}
                                onChange={(e) => setContractTermsAccepted(e.target.checked)}
                                className="mt-1 cursor-pointer"
                              />
                              <label htmlFor="contractTerms" className="text-xs text-gray-700 cursor-pointer flex-1">
                                I have read and fully understand the entire Service Agreement above. I confirm that I am legally authorized to execute this contract on behalf of {user?.role === 'developer' ? 'my business/self as Service Provider' : 'my organization as Project Owner'}. I accept all terms, conditions, breach remedies, liability limitations, and dispute resolution procedures outlined herein. I acknowledge this is a legally binding contract enforceable in the courts of the project jurisdiction. I consent to electronic signature as legally valid.
                              </label>
                            </div>

                            {signatureError && (
                              <p className="text-xs text-red-600">{signatureError}</p>
                            )}

                            <Button
                              onClick={handleSignContract}
                              disabled={!contractTermsAccepted || isSubmittingSignature}
                              className={`w-full font-bold py-3 ${
                                contractTermsAccepted
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              <FaFileContract className="mr-2" />
                              {isSubmittingSignature ? 'Signing...' : 'Sign Contract Digitally'}
                            </Button>

                            <p className="text-xs text-blue-600 text-center">
                              💡 Digital signature ensures both parties are legally bound to the terms.
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-gray-700 font-semibold">
                                ✓ Contract Legally Executed on:{' '}
                                {new Date(
                                  user?.role === 'developer'
                                    ? project.contract?.developer_signed_at
                                    : project.contract?.client_signed_at || new Date()
                                ).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                              <button
                                onClick={generateContractPDF}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Download executed contract"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              Your digital signature has been securely recorded and this contract is now legally binding. Both you and the counterparty are obligated to fulfill all terms. Breach may result in legal action, financial penalties, and negative platform records. BuildTrust has facilitated this agreement and retains copies for dispute resolution.
                            </p>
                          </div>

                          <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-slate-700">
                            <p className="font-semibold mb-2">Counterparty status</p>
                            <p>
                              {user?.role === 'developer'
                                ? project.contract?.client_signed_at
                                  ? 'Client has also signed the contract.'
                                  : 'Awaiting client signature.'
                                : project.contract?.developer_signed_at
                                  ? 'Developer has also signed the contract.'
                                  : 'Awaiting developer signature.'}
                            </p>
                          </div>

                          <Button
                            onClick={() => navigate(user?.role === 'developer' ? '/developer-messages' : '/messages')}
                            className="w-full font-bold py-3 bg-green-600 hover:bg-green-700 text-white"
                          >
                            <FaMessage className="mr-2" />
                            Message {user?.role === 'developer' ? 'Client' : 'Developer'}
                          </Button>
                          <Button
                            onClick={() => navigate('/upload-update')}
                            className="w-full font-bold py-3 bg-[#253E44] hover:bg-[#253E44]/90 text-white"
                          >
                            <FaUpload className="mr-2" />
                            Upload Project Update
                          </Button>
                        </div>
                      )}
                    </Card>
                  )}
                  <Card className=" p-6 space-y-3" style={{ display: user?.role === "client" ? "block" : "none" }}>
                    <h4 className="font-bold text-[#253E44]">
                      Project Files
                    </h4>
                    <div className="space-y-3">
                      {projectFiles.length > 0 ? (
                        projectFiles.map((file, index) => {
                          const IconComponent = file.icon;
                          return (
                            <div key={index} onClick={() => handleFileDownload(file)} className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 ${file.color} rounded flex items-center justify-center`}>
                                  <IconComponent/>
                                </div>
                                <div>
                                  <p className="text-xs font-bold truncate max-w-[120px]">
                                    {file.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400">{formatFileDate(file.date)}</p>
                                </div>
                              </div>
                              <span className="material-icons-round text-slate-400">
                                <FaDownload/>
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 py-4">No project files yet.</p>
                      )}
                    </div>
                    {projectFiles.length > 0 && (
                      <button className="w-full mt-4 text-xs font-bold text-[#253E44] hover:underline">
                        Download All Files
                      </button>
                    )}
                  </Card>
                  <Card className=" p-6 space-y-3" style={{ display: user?.role === "developer" ? "block" : "none" }}>
                    <h4 className="font-bold text-[#253E44]">
                      Project Files
                    </h4>
                    <div className="space-y-3">
                      {projectFiles.length > 0 ? (
                        projectFiles.map((file, index) => {
                          const IconComponent = file.icon;
                          return (
                            <div key={index} onClick={() => handleFileDownload(file)} className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 ${file.color} rounded flex items-center justify-center`}>
                                  <IconComponent/>
                                </div>
                                <div>
                                  <p className="text-xs font-bold truncate max-w-[120px]">
                                    {file.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400">{formatFileDate(file.date)}</p>
                                </div>
                              </div>
                              <span className="material-icons-round text-slate-400">
                                <FaDownload/>
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 py-4">No project files yet.</p>
                      )}
                    </div>
                    <Button onClick={() => navigate("/upload-update")} className="w-full mt-4 text-xs font-bold bg-[#253E44] hover:bg-[#253E44]/90">
                      Upload New Update
                    </Button>
                  </Card>
                  <Card className=" p-6 bg-[#253E44]/5 space-y-3" style={{ display: user?.role === "client" ? "block" : "none" }}>
                    <h4 className="font-bold text-[#253E44] flex items-center gap-2">
                      <FaHeadset/>
                      Need Help?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Our project managers are available to assist with any
                      concerns.
                    </p>
                    <a
                      className="inline-block text-xs font-bold text-[#253E44] hover:underline"
                      href="#"
                    >
                      Chat with Support
                    </a>
                  </Card>
                  <Card className=" p-6 bg-green-50 space-y-3" style={{ display: user?.role === "developer" ? "block" : "none" }}>
                    <h4 className="font-bold text-green-700 flex items-center gap-2">
                      <FaHeadset/>
                      Project Status
                    </h4>
                    <p className="text-xs text-green-600 leading-relaxed mb-4">
                      You are assigned to this project. Keep the client updated with regular progress reports.
                    </p>
                    <Button onClick={() => navigate("/developer-messages")} className="inline-block text-xs font-bold bg-green-600 hover:bg-green-700">
                      Message Client
                    </Button>
                  </Card>


                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {signOutModal && (
        <SignoutModal
          isOpen={signOutModal}
          onClose={() => setSignOutModal(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetails;
