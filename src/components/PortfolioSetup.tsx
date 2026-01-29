import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
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
import Logo from '../assets/Logo.png'

interface PortfolioSetupProps {
  onExit: () => void;
}

interface FileData {
  file: File;
  name: string;
  size: number;
  type: string;
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
    role?: string;
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
    id?: FileData;
    cac?: FileData;
    selfie?: FileData;
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

const PortfolioSetup = ({ onExit }: PortfolioSetupProps) => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  // Determine userType from authenticated user's role - MUST be before useState
  // Note: admins are treated as developers in the setup flow
  const userType: 'client' | 'developer' = user?.role === 'client' ? 'client' : 'developer';

  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    // Try to load from localStorage keys
    const personalData = (() => {
      const saved = localStorage.getItem('buildtrust_personal_info');
      return saved ? JSON.parse(saved) : null;
    })();
    
    const identityData = (() => {
      const saved = localStorage.getItem('buildtrust_identity_verification');
      return saved ? JSON.parse(saved) : {};
    })();
    
    const credentialsData = (() => {
      const saved = localStorage.getItem('buildtrust_licenses_credentials');
      return saved ? JSON.parse(saved) : {};
    })();
    
    const projectsData = (() => {
      const saved = localStorage.getItem('buildtrust_projects_gallery');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : [{
            id: Date.now().toString(),
            title: '',
            type: '',
            location: '',
            budget: '',
            description: '',
            media: [],
            mediaMetadata: []
          }];
        } catch (e) {
          console.error('Failed to parse projects from localStorage');
        }
      }
      return [{
        id: Date.now().toString(),
        title: '',
        type: '',
        location: '',
        budget: '',
        description: '',
        media: [],
        mediaMetadata: []
      }];
    })();
    
    const preferencesData = (() => {
      const saved = localStorage.getItem('buildtrust_build_preferences');
      const parsed = saved ? JSON.parse(saved) : null;
      console.log('📦 Loaded preferences from localStorage:', parsed);
      return parsed;
    })();

    // When loading from localStorage, always ensure role matches authenticated user's role
    const finalPersonalData = personalData ? { ...personalData, role: userType } : {
      fullName: '',
      bio: '',
      role: userType,
      companyType: '',
      yearsExperience: '',
      citiesCovered: [],
      languages: [],
      phoneNumber: '',
      currentLocation: '',
      occupation: '',
      adminRole: '',
      department: '',
      preferredContact: ''
    };

    return {
      personal: finalPersonalData,
      identity: identityData,
      credentials: credentialsData,
      projects: projectsData,
      preferences: preferencesData || {
        projectTypes: [],
        preferredCities: [],
        budgetRange: '',
        workingStyle: '',
        availability: '',
        specializations: []
      }
    };
  });

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

  // Ensure formData.personal.role always matches the authenticated user's role
  useEffect(() => {
    if (formData.personal.role !== userType) {
      setFormData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          role: userType
        }
      }));
    }
  }, [userType, formData.personal.role]);

  const handleStepComplete = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const userId = user?.id;
        if (!userId) throw new Error('User ID not available');

        // Prepare form data for submission — keep File objects intact so
        // apiClient.completePortfolioSetup can append them to FormData.
        const submitData = {
          personal: formData.personal,
          identity: formData.identity,
          credentials: formData.credentials,
          projects: formData.projects,
          preferences: formData.preferences,
        };

        console.log('📤 Submitting form data with preferences:', {
          personalFields: Object.keys(formData.personal || {}),
          preferencesData: formData.preferences,
          projectCount: formData.projects.length,
          identityDocs: Object.keys(formData.identity || {}).length
        });

        // Submit to backend endpoint that handles all database inserts
        const response = await apiClient.completePortfolioSetup(submitData);
        
        console.log('✅ [API RESPONSE] Portfolio setup response received:', {
          userId: response.user_id,
          message: response.message,
          preferencesStored: response.preferences_saved,
          summary: response.summary
        });
        console.log('✅ Portfolio setup response:', response);

        // Clear all setup localStorage keys on successful submission
        localStorage.removeItem('buildtrust_personal_info');
        localStorage.removeItem('buildtrust_identity_verification');
        localStorage.removeItem('buildtrust_licenses_credentials');
        localStorage.removeItem('buildtrust_projects_gallery');
        localStorage.removeItem('buildtrust_build_preferences');
        
        // Refresh auth context (so Index and others pick up new status)
        await refreshUser();
        
        // Navigate to developer dashboard
        navigate('/developer-dashboard', { replace: true });
        setIsComplete(true);

      } catch (error: any) {
        console.error('Failed to save profile:', error);

        // Try to parse backend validation details and show a user-friendly message
        let message = 'An error occurred while saving your profile. Some data may have been partially saved. Please check with an admin if issues persist.';
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
              userType={userType}
            />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
              formData={formData.personal}
              userType={userType}
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
              formData={formData.identity}
              userType={userType}
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
              canContinue={formData.credentials?.licenses?.length > 0 && formData.credentials?.certifications?.length > 0 && formData.credentials?.testimonials?.length > 0}
              formData={formData.credentials}
              userType={userType}
            />
          </div>
        );
      case 4:
        const projects = Array.isArray(formData.projects) ? formData.projects : [];
        const hasCompleteProject = projects.length > 0 && projects.some(project => {
          const hasTitle = project.title && String(project.title).trim().length > 0;
          const hasType = project.type && String(project.type).length > 0;
          const hasLocation = project.location && String(project.location).trim().length > 0;
          const hasBudget = project.budget && String(project.budget).length > 0;
          const hasDescription = project.description && String(project.description).trim().length > 0;
          const hasMedia = project.media && Array.isArray(project.media) && project.media.length > 0;
          
          // ALL fields must be complete AND at least one file must be uploaded
          return hasTitle && hasType && hasLocation && hasBudget && hasDescription && hasMedia;
        });
        
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
              canContinue={!!hasCompleteProject}
              formData={formData.personal}
              userType={userType}
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
              formData={formData.personal}
              userType={userType}
            />
          </div>
        );
      case 6:
        return (
          <div>
            <ProfilePreview 
              formData={formData}
              onStepChange={(step) => setCurrentStep(step)}
            />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
              formData={formData as any}
              userType={userType}
            />
          </div>
        );
      default:
        return (
          <div>
            <PersonalInfo 
              data={formData.personal} 
              onChange={(data) => updateFormData('personal', data)}
              userType={userType}
            />
            <NavigationButtons 
              currentStep={currentStep}
              totalSteps={6}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
              formData={formData.personal}
              userType={userType}
            />
          </div>
        );
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#226F75]/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-[#226F75]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-[#226F75]/60" />
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
              className="w-full bg-[#253E44] hover:bg-[#253E44]/90"
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
    <div className="min-h-screen bg-[#226F75]/10">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="" className=" w-[20%]"/>
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
