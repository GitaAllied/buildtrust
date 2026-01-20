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
      const isIdentityComplete = (formData.isIdentityComplete as boolean) || false;
      return isIdentityComplete;
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
              : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
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
