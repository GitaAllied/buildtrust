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
      return saved ? JSON.parse(saved) : [];
    })();
    
    const preferencesData = (() => {
      const saved = localStorage.getItem('buildtrust_build_preferences');
      return saved ? JSON.parse(saved) : null;
    })();

    return {
      personal: personalData || {
        fullName: '',
        bio: '',
        role: 'developer',
        companyType: '',
        yearsExperience: '',
        citiesCovered: [],
        languages: [],
        phoneNumber: '',
        currentLocation: '',
        occupation: '',
        preferredContact: ''
      },
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
        const userId = user?.id;
        if (!userId) throw new Error('User ID not available');

        // Phase 1: Build schema-aware profile data with null handling
        // Only include fields that have values; omit undefined/empty fields as null
        const profileData: Record<string, any> = {
          name: formData.personal.fullName?.trim() || null,
          bio: formData.personal.bio?.trim() || null,
          role: formData.personal.role || null,
          company_type: formData.personal.companyType || null,
          years_experience: formData.personal.yearsExperience ? parseInt(formData.personal.yearsExperience.split('-')[0]) : null,
          
          // Preferred cities - use personal or preferences, whichever has data
          preferred_cities: formData.personal.citiesCovered?.length > 0 
            ? JSON.stringify(formData.personal.citiesCovered) 
            : formData.preferences.preferredCities?.length > 0
            ? JSON.stringify(formData.preferences.preferredCities)
            : null,
          
          // Languages - array to JSON string
          languages: formData.personal.languages?.length > 0 
            ? JSON.stringify(formData.personal.languages) 
            : null,
          
          // Project types (preferences)
          project_types: formData.preferences.projectTypes?.length > 0
            ? JSON.stringify(formData.preferences.projectTypes)
            : null,
          
          // Preferences fields
          budget_range: formData.preferences.budgetRange || null,
          working_style: formData.preferences.workingStyle || null,
          availability: formData.preferences.availability || null,
          specializations: formData.preferences.specializations?.length > 0
            ? JSON.stringify(formData.preferences.specializations)
            : null,
          
          // Setup status
          setup_completed: true,
        };

        // Phase 2: Upload and store documents with proper categorization
        const documentCategories: Record<string, { type: string; files: File[] }> = {
          identity: { type: 'identity', files: [] },
          licenses: { type: 'license', files: [] },
          certifications: { type: 'certification', files: [] },
          testimonials: { type: 'testimonial', files: [] },
          projects: { type: 'project_media', files: [] },
        };

        // Collect identity documents
        if (formData.identity?.id?.file) documentCategories.identity.files.push(formData.identity.id.file);
        if (formData.identity?.cac?.file) documentCategories.identity.files.push(formData.identity.cac.file);
        if (formData.identity?.selfie?.file) documentCategories.identity.files.push(formData.identity.selfie.file);

        // Collect credential documents
        if (Array.isArray(formData.credentials?.licenses)) {
          documentCategories.licenses.files.push(...formData.credentials.licenses.filter(f => f instanceof File));
        }
        if (Array.isArray(formData.credentials?.certifications)) {
          documentCategories.certifications.files.push(...formData.credentials.certifications.filter(f => f instanceof File));
        }
        if (Array.isArray(formData.credentials?.testimonials)) {
          documentCategories.testimonials.files.push(...formData.credentials.testimonials.filter(f => f instanceof File));
        }

        // Store documents with proper user_documents table mapping
        const uploadedDocuments: Array<{ type: string; count: number }> = [];
        for (const [category, { type, files }] of Object.entries(documentCategories)) {
          if (files.length > 0) {
            for (const file of files) {
              try {
                await apiClient.uploadDocument(userId, type, file);
              } catch (docErr) {
                console.error(`Failed to upload ${type} document:`, docErr);
              }
            }
            uploadedDocuments.push({ type, count: files.length });
          }
        }

        // Phase 3: Create portfolio entry
        const portfolioData = {
          user_id: userId,
          bio: formData.personal.bio?.trim() || null,
          specializations: formData.preferences.specializations?.length > 0
            ? formData.preferences.specializations.join(', ')
            : null,
          preferred_cities: formData.personal.citiesCovered?.length > 0
            ? formData.personal.citiesCovered.join(', ')
            : null,
        };

        try {
          await (apiClient as any).createPortfolio?.(portfolioData);
          console.log('Portfolio created successfully');
        } catch (portfolioErr) {
          console.warn('Portfolio creation optional, continuing...', portfolioErr);
        }

        // Phase 4: Create and store projects with media
        const projectsCreated: Array<{ id: string; title: string }> = [];
        if (Array.isArray(formData.projects) && formData.projects.length > 0) {
          for (const project of formData.projects) {
            try {
              // Only create project if has required minimum data
              if (project.title?.trim()) {
                const projectPayload = {
                  user_id: userId,
                  title: project.title,
                  description: project.description?.trim() || null,
                  type: project.type || null,
                  location: project.location?.trim() || null,
                  budget: project.budget || null,
                };

                const projectResponse = await (apiClient as any).createProject?.(projectPayload);
                const projectId = projectResponse?.id || projectResponse?.project?.id;

                if (projectId) {
                  projectsCreated.push({ id: projectId, title: project.title });

                  // Upload project media files to user_documents
                  if (Array.isArray(project.media) && project.media.length > 0) {
                    for (const mediaFile of project.media) {
                      if (mediaFile instanceof File) {
                        try {
                          await apiClient.uploadDocument(userId, 'project_media', mediaFile);
                        } catch (mediaErr) {
                          console.error('Failed to upload project media:', mediaErr);
                        }
                      }
                    }
                  }
                }
              }
            } catch (projectErr) {
              console.error('Failed to create project:', projectErr);
            }
          }
        }

        // Phase 5: Update user profile with all collected data
        try {
          const updated = await apiClient.updateProfile(profileData);

          console.log('Profile updated successfully. Data stored:', {
            profileData,
            documentsUploaded: uploadedDocuments,
            projectsCreated,
          });

          // If server confirms setup_completed, navigate to developer dashboard
          if (updated && updated.user && updated.user.setup_completed === 1) {
            // Clear all setup localStorage keys on successful submission
            localStorage.removeItem('buildtrust_personal_info');
            localStorage.removeItem('buildtrust_identity_verification');
            localStorage.removeItem('buildtrust_licenses_credentials');
            localStorage.removeItem('buildtrust_projects_gallery');
            localStorage.removeItem('buildtrust_build_preferences');
            
            // Refresh auth context (so Index and others pick up new status)
            await refreshUser();
            navigate('/developer-dashboard', { replace: true });
            return;
          }

          await refreshUser();
          
          // Clear all setup localStorage keys on successful completion
          localStorage.removeItem('buildtrust_personal_info');
          localStorage.removeItem('buildtrust_identity_verification');
          localStorage.removeItem('buildtrust_licenses_credentials');
          localStorage.removeItem('buildtrust_projects_gallery');
          localStorage.removeItem('buildtrust_build_preferences');
          
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
              formData={formData.personal}
              userType="developer"
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
              userType="developer"
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
              formData={formData.credentials}
              userType="developer"
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
              formData={formData.projects}
              userType="developer"
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
              userType="developer"
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
              formData={formData.personal}
              userType="developer"
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
              formData={formData.personal}
              userType="developer"
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
