import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import PersonalInfo from "./setup/PersonalInfo";
import IdentityVerification from "./setup/IdentityVerification";
import LicensesCredentials from "./setup/LicensesCredentials";
import ProjectGallery from "./setup/ProjectGallery";
import BuildPreferences from "./setup/BuildPreferences";
import ProfilePreview from "./setup/ProfilePreview";
import ProgressTracker from "./setup/ProgressTracker";
import NavigationButtons from "./setup/NavigationButtons";

interface PortfolioSetupProps {
  onExit: () => void;
}

interface Project {
  id: string;
  title: string;
  type: string;
  location: string;
  description?: string;
  images?: string[];
  budget: string;
  media?: (string | File)[];
  [key: string]: unknown;
}

interface FormData {
  personal: {
    fullName?: string;
    bio?: string;
    companyType?: string;
    yearsExperience?: string;
    citiesCovered?: string[];
    languages?: string[];
    phoneNumber?: string;
    currentLocation?: string;
    occupation?: string;
    preferredContact?: string;
    [key: string]: unknown;
  };
  identity: {
    idDocumentType?: string;
    idNumber?: string;
    idCountry?: string;
    documents?: any[];
    [key: string]: unknown;
  };
  credentials: {
    licenses?: any[];
    certifications?: any[];
    testimonials?: any[];
    [key: string]: unknown;
  };
  projects: Project[];
  preferences: {
    projectTypes?: string[];
    preferredCities?: string[];
    budgetRange?: string;
    workingStyle?: string;
    availability?: string;
    specializations?: string[];
    [key: string]: unknown;
  };
}

function ProtectedRoute({ children, isAuthenticated }: { children: JSX.Element; isAuthenticated: boolean; }) {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const PortfolioSetup = ({ onExit }: PortfolioSetupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    personal: {
      fullName: '',
      bio: '',
      companyType: '',
      yearsExperience: '',
      citiesCovered: [],
      languages: [],
      phoneNumber: '',
      currentLocation: '',
      occupation: '',
      preferredContact: ''
    },
    identity: {},
    credentials: {},
    projects: [],
    preferences: {
      projectTypes: [],
      preferredCities: [],
      budgetRange: '',
      workingStyle: '',
      availability: '',
      specializations: []
    }
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/developer-dashboard';

  // Redirect away if setup already completed or if email is not verified
  useEffect(() => {
    if (!user) return;

    // If setup already completed, go to developer dashboard
    if (user.setup_completed === true) {
      navigate('/developer-dashboard', { replace: true });
      return;
    }

    // If email is not yet verified, send to verify page
    if (!user.email_verified) {
      navigate('/verify-email', { replace: true });
      return;
    }
  }, [user, navigate]);

  const handleStepComplete = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Build and clean profile data (omit empty/blank fields; send arrays as arrays)
        const rawProfileData: Record<string, any> = {
          name: formData.personal.fullName,
          bio: formData.personal.bio,
          company_type: formData.personal.companyType,
          years_experience: formData.personal.yearsExperience ? (Number(formData.personal.yearsExperience) || undefined) : undefined,
          project_types: (formData.preferences.projectTypes && formData.preferences.projectTypes.length > 0) ? formData.preferences.projectTypes : undefined,
          preferred_cities: (formData.personal.citiesCovered && formData.personal.citiesCovered.length > 0) ? formData.personal.citiesCovered : (formData.preferences.preferredCities && formData.preferences.preferredCities.length > 0) ? formData.preferences.preferredCities : undefined,
          languages: (formData.personal.languages && formData.personal.languages.length > 0) ? formData.personal.languages : undefined,
          budget_range: formData.preferences.budgetRange || undefined,
          working_style: formData.preferences.workingStyle || undefined,
          availability: formData.preferences.availability || undefined,
          specializations: (formData.preferences.specializations && formData.preferences.specializations.length > 0) ? formData.preferences.specializations : undefined,
          setup_completed: true, // mark setup complete on final submit
        };

        // Remove undefined or empty string values
        const profileData: Record<string, any> = {};
        Object.entries(rawProfileData).forEach(([k, v]) => {
          if (v === undefined || v === null) return;
          if (typeof v === 'string' && v.trim() === '') return;
          profileData[k] = v;
        });

        // Upload any credentials / license files first
        const userId = user?.id;
        
        try {
          let uploadedCount = 0;
          if (userId && formData.credentials) {
            const creds = formData.credentials as any;
            // Licenses
            if (Array.isArray(creds.licenses)) {
              for (const f of creds.licenses) {
                if (f instanceof File) {
                  await apiClient.uploadDocument(userId, 'license', f);
                  uploadedCount++;
                }
              }
            }
            // Certifications
            if (Array.isArray(creds.certifications)) {
              for (const f of creds.certifications) {
                if (f instanceof File) {
                  await apiClient.uploadDocument(userId, 'certification', f);
                  uploadedCount++;
                }
              }
            }
            // Testimonials
            if (Array.isArray(creds.testimonials)) {
              for (const f of creds.testimonials) {
                if (f instanceof File) {
                  await apiClient.uploadDocument(userId, 'testimonial', f);
                  uploadedCount++;
                }
              }
            }
          }

          // Upload identity docs
          if (userId && formData.identity && Array.isArray((formData.identity as any).documents)) {
            for (const f of (formData.identity as any).documents) {
              if (f instanceof File) {
                await apiClient.uploadDocument(userId, 'identity', f);
                uploadedCount++;
              }
            }
          }

        } catch (uploadErr) {
          console.error('Document upload failed:', uploadErr);
          // Continue saving profile even if upload fails; optionally notify user
        }

        // Save projects BEFORE updating profile (so they're ready before setup completion)
        let savedProjectsCount = 0;
        if (formData.projects && formData.projects.length > 0) {
          
          for (const project of formData.projects) {
            try {
              // Only save if project has title and description
              if (project.title && project.description) {
                const projectData = {
                  title: project.title,
                  type: project.type || '',
                  location: project.location || '',
                  budget: project.budget || '',
                  description: project.description,
                  client_id: userId,
                };
                
                const projectResponse = await (apiClient as any).createProject(projectData);
                const projectId = projectResponse?.id || projectResponse?.project?.id;

                // Upload project media if any
                if (projectId && project.media && project.media.length > 0) {
                  for (const mediaFile of project.media) {
                    if (mediaFile instanceof File) {
                      try {
                        await (apiClient as any).uploadProjectMedia(projectId, mediaFile);
                      } catch (mediaErr) {
                        console.error('Failed to upload media:', mediaErr);
                        // Continue even if media upload fails
                      }
                    }
                  }
                }
                
                savedProjectsCount++;
              }
            } catch (projectErr) {
              console.error('Failed to save project:', projectErr);
              // Continue to next project even if one fails
            }
          }
        }

        try {
          const updated = await apiClient.updateProfile(profileData);

          // If server confirms setup_completed, navigate to developer dashboard
          if (updated && updated.user && updated.user.setup_completed === 1) {
            // Refresh auth context (so Index and others pick up new status)
            await refreshUser();
            navigate('/developer-dashboard', { replace: true });
            return;
          }

          await refreshUser();
          setIsComplete(true);
        } catch (error: any) {
          console.error('Failed to save profile:', error);

          // Try to parse backend validation details and show a user-friendly message
          let message = 'An error occurred while saving your profile.';
          if (error && typeof error === 'object') {
            if ((error as any).body && (error as any).body.error === 'Validation error' && Array.isArray((error as any).body.details)) {
              message = (error as any).body.details.map((d: any) => d.message).join('. ');
            } else if (error.message) {
              message = error.message;
            }
          }

          // Show an in-component alert
          setIsComplete(false);
          alert(message);
        }
      } catch (err) {
        console.error('Error completing setup:', err);
        alert('An unexpected error occurred while saving your profile. Please try again later.');
      }
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section: keyof FormData, data: unknown) => {
    setFormData(prev => ({
      ...prev,
      [section]: data as any
    }));
  };

  const handleGoToDashboard = () => {
    navigate('/developer-dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <PersonalInfo 
              data={formData.personal} 
              onChange={(data) => updateFormData('personal', data)}
              userType="developer"
            />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <IdentityVerification 
              data={formData.identity} 
              onChange={(data) => updateFormData('identity', data)} 
            />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <LicensesCredentials 
              data={formData.credentials} 
              onChange={(data) => updateFormData('credentials', data)} 
            />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <ProjectGallery 
              data={formData.projects as any} 
              onChange={(data) => updateFormData('projects', data)} 
            />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
            />
          </div>
        );
      case 5:
        return (
          <div>
            <BuildPreferences 
              data={formData.preferences} 
              onChange={(data) => updateFormData('preferences', data)} 
            />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
            />
          </div>
        );
      case 6:
        return (
          <div>
            <ProfilePreview formData={formData} />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
            />
          </div>
        );
      default:
        return (
          <div>
            <PersonalInfo 
              data={formData.personal} 
              onChange={(data) => updateFormData('personal', data)}
              userType="developer"
            />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
            />
          </div>
        );
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Profile Setup Complete!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Welcome to BuildTrust Africa! Your developer profile is now live and ready to receive project requests from diaspora clients.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={handleGoToDashboard}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Developer Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">BT</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">BuildTrust Africa</h1>
                <p className="text-xs sm:text-sm text-gray-500">Developer Profile Setup</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onExit} className="flex-shrink-0">
              <span className="hidden sm:inline">Exit Setup</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ProgressTracker currentStep={currentStep} totalSteps={6} />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSetup;
