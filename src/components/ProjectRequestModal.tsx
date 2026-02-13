
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api";

interface ProjectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  developerName: string;
  developerId?: number;
}

// Common building types - users can select or type custom ones
const COMMON_BUILDING_TYPES = [
  "Duplex",
  "Bungalow",
  "Commercial Building",
  "Rental Property",
  "Estate Development",
  "Renovation Project",
  "Apartment Complex",
  "Office Building",
  "Hotel",
  "Warehouse",
  "Mixed-use Development",
  "Villa",
  "Townhouse",
  "Shopping Mall",
  "Industrial Complex"
];

const ProjectRequestModal = ({ isOpen, onClose, developerName, developerId }: ProjectRequestModalProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    buildingType: "",
    budgetRange: "",
    startDate: "",
    duration: "",
    message: "",
    sitePlan: null as File | null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [buildingTypeSearch, setBuildingTypeSearch] = useState("");
  const [buildingTypePopoverOpen, setBuildingTypePopoverOpen] = useState(false);

  const getStoredRole = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u?.role) return String(u.role).toLowerCase().trim();
      }

      const t = localStorage.getItem('auth_token');
      if (t) {
        const parts = t.split('.');
        if (parts.length >= 2) {
          try {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            const roleFromToken = payload?.role || payload?.roles || null;
            if (roleFromToken) return String(roleFromToken).toLowerCase().trim();
          } catch (e) {
            // ignore
          }
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  const effectiveRole = userRole ?? getStoredRole();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate Project Name
    if (!formData.projectName.trim()) {
      errors.projectName = "Project name is required";
    } else if (formData.projectName.trim().length < 3) {
      errors.projectName = "Project name must be at least 3 characters";
    } else if (formData.projectName.trim().length > 100) {
      errors.projectName = "Project name cannot exceed 100 characters";
    }

    // Validate Location
    if (!formData.location.trim()) {
      errors.location = "Project location is required";
    } else if (formData.location.trim().length < 3) {
      errors.location = "Location must be at least 3 characters";
    }

    // Validate Building Type
    if (!formData.buildingType) {
      errors.buildingType = "Please select a building type";
    }

    // Validate Budget Range
    if (!formData.budgetRange) {
      errors.budgetRange = "Please select a budget range";
    }

    // Validate Message
    if (!formData.message.trim()) {
      errors.message = "Message to developer is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    } else if (formData.message.trim().length > 1000) {
      errors.message = "Message cannot exceed 1000 characters";
    }

    // Validate Start Date if provided
    if (formData.startDate) {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.startDate = "Start date must be today or in the future";
      }
    }

    // Validate File if provided
    if (formData.sitePlan) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (formData.sitePlan.size > maxSize) {
        errors.sitePlan = "File size cannot exceed 5MB";
      }
      const validFormats = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validFormats.includes(formData.sitePlan.type)) {
        errors.sitePlan = "File format not supported. Please use PDF, JPG, PNG, DOC, or DOCX";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form first
    if (!validateForm()) {
      setError("Please fix the errors below before submitting");
      return;
    }

    setIsLoading(true);

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('auth_token');

      // If no token, redirect to login with message
      if (!token) {
        navigate('/', { 
          state: { 
            message: 'Please log in to submit a project request',
            messageType: 'info'
          }
        });
        handleClose();
        return;
      }

      const role = effectiveRole ?? '';

      // Prevent developers from submitting project requests
      if (role === 'developer') {
        setIsLoading(false);
        setError(
          'You are currently registered as a developer and cannot submit project requests. '
          + 'If you need to request a build, please sign in with a client account, create a separate client profile, '
          + 'or contact our support team for help converting your account.'
        );
        return;
      }

      // Submit the project request
      const response = await apiClient.submitProjectRequest({
        developerId,
        projectName: formData.projectName,
        location: formData.location,
        buildingType: formData.buildingType,
        budgetRange: formData.budgetRange,
        startDate: formData.startDate,
        duration: formData.duration,
        message: formData.message,
        sitePlan: formData.sitePlan ? {
          url: `/uploads/project-requests/${formData.sitePlan.name}`,
          filename: formData.sitePlan.name,
          mimeType: formData.sitePlan.type
        } : null
      });

      if (response.success) {
        setIsSubmitted(true);

        // Redirect after success message is shown (delay for UX)
        setTimeout(() => {
          if (effectiveRole === 'developer') {
              navigate(`/developer/${developerId}`, {
              state: {
                message: '✓ Project request submitted! The developer will review and respond within 24 hours.',
                messageType: 'success'
              }
            });
          } else {
            // Redirect clients to the client dashboard
            navigate('/client-dashboard', {
              state: {
                message: '✓ Project request submitted! The developer will review and respond within 24 hours.',
                messageType: 'success'
              }
            });
          }
          handleClose();
        }, 2000);
      } else {
        setError(response.error || 'Failed to submit project request');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred while submitting your request';
      
      // Check if it's a login-required error
      if (err.message?.includes('unauthorized') || err.requireLogin) {
        navigate('/', {
          state: {
            message: 'Please log in to submit a project request',
            messageType: 'info'
          }
        });
        handleClose();
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, sitePlan: file }));
  };

  useEffect(() => {
    if (!isOpen) return;
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const role = user?.role ? String(user.role).toLowerCase() : null;
      setUserRole(role);
    } catch (e) {
      setUserRole(null);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsSubmitted(false);
    setError(null);
    setFieldErrors({});
    setFormData({
      projectName: "",
      location: "",
      buildingType: "",
      budgetRange: "",
      startDate: "",
      duration: "",
      message: "",
      sitePlan: null
    });
    onClose();
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Sent Successfully!</h3>
            <p className="text-gray-600 mb-6">
              {developerName} will review your project request and respond within 24 hours.
            </p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Failed</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex justify-center space-x-3">
              <Button type="button" variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={() => setError(null)} className="bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Only show the request form to logged-in clients. For other roles or unauthenticated users,
  // display an informative dialog explaining the restriction or prompting to log in.
  if (effectiveRole !== 'client') {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const isAuthenticated = !!token;

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 1112 3a9 9 0 019 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Project requests are for clients only</h3>
              <p className="text-sm text-gray-700 mb-3">
                {isAuthenticated ? (
                  "Only client accounts can send project requests. Please switch to a client account or contact support for assistance."
                ) : (
                  "Please log in with a client account to send a project request."
                )}
              </p>
              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Close
                </Button>
                {!isAuthenticated ? (
                  <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/')}>
                    Log In
                  </Button>
                ) : (
                  <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/support')}>
                    Contact Support
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Project Request to {developerName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Validation Error Alert */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Validation Error</h4>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => {
                  handleInputChange("projectName", e.target.value);
                  if (fieldErrors.projectName) setFieldErrors(prev => ({ ...prev, projectName: "" }));
                }}
                placeholder="e.g., Modern Family Duplex"
                className={fieldErrors.projectName ? "border-red-500 focus:ring-red-500" : ""}
                required
              />
              {fieldErrors.projectName && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.projectName}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="location">Project Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => {
                  handleInputChange("location", e.target.value);
                  if (fieldErrors.location) setFieldErrors(prev => ({ ...prev, location: "" }));
                }}
                placeholder="e.g., Lekki, Lagos"
                className={fieldErrors.location ? "border-red-500 focus:ring-red-500" : ""}
                required
              />
              {fieldErrors.location && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.location}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buildingType">Type of Building *</Label>
              <Popover open={buildingTypePopoverOpen} onOpenChange={setBuildingTypePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between ${fieldErrors.buildingType ? "border-red-500" : ""}`}
                  >
                    <span className="text-gray-700">
                      {formData.buildingType || "Select building type"}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" side="bottom" align="start" sideOffset={8}>
                  <div className="space-y-3">
                    <Input
                      placeholder="Type or search building type..."
                      value={buildingTypeSearch}
                      onChange={(e) => setBuildingTypeSearch(e.target.value)}
                      className="h-9"
                    />
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      <button
                        onClick={() => {
                          handleInputChange("buildingType", "");
                          setBuildingTypePopoverOpen(false);
                          setBuildingTypeSearch("");
                          if (fieldErrors.buildingType) setFieldErrors(prev => ({ ...prev, buildingType: "" }));
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${
                          !formData.buildingType ? "bg-blue-100 text-[#226F75] font-medium" : "text-gray-700"
                        }`}
                      >
                        Clear Selection
                      </button>
                      {/* Show filtered common types */}
                      {COMMON_BUILDING_TYPES.filter(type =>
                        type.toLowerCase().includes(buildingTypeSearch.toLowerCase())
                      ).map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            handleInputChange("buildingType", type);
                            setBuildingTypePopoverOpen(false);
                            setBuildingTypeSearch("");
                            if (fieldErrors.buildingType) setFieldErrors(prev => ({ ...prev, buildingType: "" }));
                          }}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors ${
                            formData.buildingType === type ? "bg-blue-100 text-[#226F75] font-medium" : "text-gray-700"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                      {/* Show custom entry option if text doesn't match common types */}
                      {buildingTypeSearch && !COMMON_BUILDING_TYPES.some(type =>
                        type.toLowerCase() === buildingTypeSearch.toLowerCase()
                      ) && (
                        <button
                          onClick={() => {
                            handleInputChange("buildingType", buildingTypeSearch);
                            setBuildingTypePopoverOpen(false);
                            setBuildingTypeSearch("");
                            if (fieldErrors.buildingType) setFieldErrors(prev => ({ ...prev, buildingType: "" }));
                          }}
                          className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors text-[#226F75] font-medium border border-[#226F75] bg-blue-50"
                        >
                          ✓ Use "{buildingTypeSearch}"
                        </button>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {fieldErrors.buildingType && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.buildingType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="budgetRange">Estimated Budget Range *</Label>
              <Select 
                value={formData.budgetRange} 
                onValueChange={(value) => {
                  handleInputChange("budgetRange", value);
                  if (fieldErrors.budgetRange) setFieldErrors(prev => ({ ...prev, budgetRange: "" }));
                }}
              >
                <SelectTrigger className={fieldErrors.budgetRange ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-15">₦5M - ₦15M</SelectItem>
                  <SelectItem value="15-30">₦15M - ₦30M</SelectItem>
                  <SelectItem value="30-50">₦30M - ₦50M</SelectItem>
                  <SelectItem value="50-100">₦50M - ₦100M</SelectItem>
                  <SelectItem value="100+">₦100M+</SelectItem>
                </SelectContent>
              </Select>
              {fieldErrors.budgetRange && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.budgetRange}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Preferred Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => {
                  handleInputChange("startDate", e.target.value);
                  if (fieldErrors.startDate) setFieldErrors(prev => ({ ...prev, startDate: "" }));
                }}
                className={fieldErrors.startDate ? "border-red-500 focus:ring-red-500" : ""}
              />
              {fieldErrors.startDate && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.startDate}</p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">Estimated Duration</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-6">3-6 months</SelectItem>
                  <SelectItem value="6-12">6-12 months</SelectItem>
                  <SelectItem value="12-18">12-18 months</SelectItem>
                  <SelectItem value="18+">18+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="sitePlan">Upload Site Plan or Notes (Optional)</Label>
            <Input
              id="sitePlan"
              type="file"
              onChange={(e) => {
                handleFileChange(e);
                if (fieldErrors.sitePlan) setFieldErrors(prev => ({ ...prev, sitePlan: "" }));
              }}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className={`file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 ${fieldErrors.sitePlan ? "border-red-500" : ""}`}
            />
            {fieldErrors.sitePlan && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.sitePlan}</p>
            )}
            {!fieldErrors.sitePlan && (
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, JPG, PNG, DOC, DOCX (max 5MB)
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="message">Message to Developer *</Label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => {
                handleInputChange("message", e.target.value);
                if (fieldErrors.message) setFieldErrors(prev => ({ ...prev, message: "" }));
              }}
              placeholder="Please describe your project requirements, any specific preferences, or questions you have..."
              className={`w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical ${fieldErrors.message ? "border-red-500 focus:ring-red-500" : ""}`}
              required
            />
            <div className="flex justify-between items-start mt-1">
              <div>
                {fieldErrors.message && (
                  <p className="text-red-600 text-sm">{fieldErrors.message}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {formData.message.length}/1000
              </span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-green-800">Escrow Protection Available</h4>
                <p className="text-sm text-green-700">
                  Your payment is protected through our escrow service. Funds are only released when project milestones are completed to your satisfaction.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Send Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRequestModal;
