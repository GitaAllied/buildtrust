import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
  formData?: Record<string, unknown>;
  userType?: 'client' | 'developer';
}

const NavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  onPrev, 
  onNext, 
  canContinue,
  formData = {},
  userType
}: NavigationButtonsProps) => {
  const validateFormIsComplete = (): boolean => {
    if (!formData || typeof formData !== 'object') {
      return false;
    }

    // For developer step 2 (IdentityVerification), check if identity is complete
    if (userType === 'developer' && currentStep === 2) {
      const hasId = (formData.id as any)?.file !== undefined;
      const hasCac = (formData.cac as any)?.file !== undefined;
      const hasSelfie = (formData.selfie as any)?.file !== undefined;
      return hasId && hasCac && hasSelfie;
    }

    // For developer step 3 (LicensesCredentials), check if all credential types have files
    if (userType === 'developer' && currentStep === 3) {
      const licenses = (formData.licenses as any[]) || [];
      const certifications = (formData.certifications as any[]) || [];
      const testimonials = (formData.testimonials as any[]) || [];
      return licenses.length > 0 && certifications.length > 0 && testimonials.length > 0;
    }

    // For developer step 4 (ProjectGallery), check if at least one project is complete
    if (userType === 'developer' && currentStep === 4) {
      const projects = (formData as any[]) || [];
      if (!Array.isArray(projects) || projects.length === 0) {
        return false;
      }
      // Check if at least the first project has required fields filled
      const firstProject = projects[0];
      if (!firstProject) return false;
      const title = (firstProject.title as string)?.trim() || '';
      const type = (firstProject.type as string)?.trim() || '';
      const location = (firstProject.location as string)?.trim() || '';
      const budget = (firstProject.budget as string)?.trim() || '';
      const description = (firstProject.description as string)?.trim() || '';
      return title && type && location && budget && description;
    }

    const fullName = (formData.fullName as string)?.trim() || '';
    const bio = (formData.bio as string)?.trim() || '';
    
    // Common required fields
    if (!fullName || !bio) return false;

    if (userType === 'developer') {
      const companyType = (formData.companyType as string)?.trim() || '';
      const yearsExperience = (formData.yearsExperience as string)?.trim() || '';
      const citiesCovered = (formData.citiesCovered as string[]) || [];
      const languages = (formData.languages as string[]) || [];
      
      if (!companyType || !yearsExperience) return false;
      if (citiesCovered.length === 0 || languages.length === 0) return false;
    } else {
      const phoneNumber = (formData.phoneNumber as string)?.trim() || '';
      const currentLocation = (formData.currentLocation as string)?.trim() || '';
      const occupation = (formData.occupation as string)?.trim() || '';
      
      if (!phoneNumber || !currentLocation || !occupation) return false;
    }

    return true;
  };

  const isFormComplete = validateFormIsComplete();

  return (
    <div className="flex flex-col gap-4">
      {/* Navigation Buttons */}
      <div className="flex justify-between p-6 bg-gray-50 border-t">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={currentStep === 1}
          className={`
            px-6 py-3 rounded-lg font-medium transition-colors
            ${currentStep === 1 
              ? 'cursor-not-allowed opacity-50' 
              : 'hover:bg-gray-100'
            }
          `}
        >
          Back
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!isFormComplete}
          className={`
            px-6 py-3 rounded-lg font-medium transition-colors
            ${!isFormComplete
              ? 'cursor-not-allowed opacity-50 bg-gray-400'
              : 'bg-[#253E44] text-white hover:bg-[#253E44]/90 active:bg-[#253E44]/80'
            }
          `}
        >
          {currentStep === totalSteps ? 'Submit Profile' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default NavigationButtons;
