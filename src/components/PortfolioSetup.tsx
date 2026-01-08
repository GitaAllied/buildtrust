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
    [key: string]: unknown;
  };
  identity: Record<string, unknown>;
  credentials: Record<string, unknown>;
  projects: Project[];
  preferences: Record<string, unknown>;
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
    personal: {},
    identity: {},
    credentials: {},
    projects: [],
    preferences: {}
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();
  const from = (location.state as any)?.from?.pathname || '/developer-dashboard';

  // Check email verification on component mount
  useEffect(() => {
    if (user && !user.email_verified && user.setup_completed === true) {  // Redirect only after setup is completed
      navigate('/verify-email');
    }
  }, [user, navigate]);

  const handleStepComplete = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        // Save profile data (including build preferences)
        const profileData = {
          name: formData.personal.fullName,
          bio: formData.personal.bio,
          company_type: formData.personal.companyType,
          years_experience: formData.personal.yearsExperience,
          project_types: JSON.stringify(formData.preferences.projectTypes || []),
          preferred_cities: JSON.stringify(formData.preferences.preferredCities || []),
          budget_range: formData.preferences.budgetRange,
          working_style: formData.preferences.workingStyle,
          availability: formData.preferences.availability,
          specializations: JSON.stringify(formData.preferences.specializations || []),
        };
        await apiClient.updateProfile(profileData);

        // Save projects (if any)
        if (formData.projects && formData.projects.length > 0) {
          for (const project of formData.projects) {
            const projectData = {
              title: project.title,
              type: project.type,
              location: project.location,
              budget: project.budget,
              description: project.description,
            };
            await (apiClient as any).createProject(projectData);
          }
        }

        await refreshUser();
        setIsComplete(true);
      } catch (error) {
        console.error('Failed to save:', error);
        // Handle error
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
