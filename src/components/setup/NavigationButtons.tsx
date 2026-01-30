import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
  formData?: Record<string, unknown>;
  userType?: 'client' | 'developer' | 'admin';
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
  const [submitting, setSubmitting] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Comprehensive profile validation function
  const validateAllProfileData = (): boolean => {
    const formDataObj = formData as any;
    
    // For clients, formData is passed directly as personal info (not nested)
    if (userType === 'client') {
      console.log('🔍 VALIDATING CLIENT DATA:', formDataObj);
      // Client validation - just needs personal info
      const fullName = (formDataObj?.fullName as string)?.trim() || '';
      const bio = (formDataObj?.bio as string)?.trim() || '';
      const phoneNumber = (formDataObj?.phoneNumber as string)?.trim() || '';
      const currentLocation = (formDataObj?.currentLocation as string)?.trim() || '';
      const occupation = (formDataObj?.occupation as string)?.trim() || '';
      
      const isValid = !!(fullName && bio && phoneNumber && currentLocation && occupation);
      console.log('✅ CLIENT VALIDATION RESULT:', { fullName, bio, phoneNumber, currentLocation, occupation, isValid });
      return isValid;
    }

    // For developers, formData is nested under personal property
    const personal = formDataObj.personal || formDataObj;
    if (!personal?.fullName?.trim()) {
      return false;
    }
    if (!personal?.bio?.trim()) {
      return false;
    }
    if (!personal?.role) {
      return false;
    }
    
    if (personal.role === 'developer') {
      if (!personal?.companyType) return false;
      if (!personal?.yearsExperience) return false;
      if (!personal?.citiesCovered || personal.citiesCovered.length === 0) return false;
      if (!personal?.languages || personal.languages.length === 0) return false;
    } else if (personal.role === 'admin') {
      if (!personal?.adminRole) return false;
      if (!personal?.department) return false;
    }

    // Step 2: Identity Verification validation (developers only)
    const identity = formDataObj.identity || {};
    if ((!identity?.id?.file && !identity?.id?.name)) {
      console.log('Missing ID document');
      return false;
    }
    if ((!identity?.cac?.file && !identity?.cac?.name)) {
      console.log('Missing CAC document');
      return false;
    }
    if ((!identity?.selfie?.file && !identity?.selfie?.name)) {
      console.log('Missing selfie document');
      return false;
    }

    // Step 3: Licenses & Credentials validation (developers only)
    const credentials = formDataObj.credentials || {};
    const licenses = credentials?.licenses || [];
    const certifications = credentials?.certifications || [];
    const testimonials = credentials?.testimonials || [];
    if (licenses.length === 0) return false;
    if (certifications.length === 0) return false;
    if (testimonials.length === 0) return false;

    // Step 4: Project Gallery validation (developers only)
    const projects = formDataObj.projects || [];
    if (projects.length === 0) {
      console.log('No projects');
      return false;
    }
    const invalidProjects = projects.filter((p: any) => 
      !p.title?.trim() || !p.type || !p.location?.trim() || !p.budget || 
      !p.description?.trim() || !p.media?.length
    );
    if (invalidProjects.length > 0) return false;

    // Step 5: Build Preferences validation (developers only)
    const preferences = formDataObj.preferences || {};
    if (!preferences?.projectTypes || preferences.projectTypes.length === 0) return false;
    if (!preferences?.preferredCities || preferences.preferredCities.length === 0) return false;
    if (!preferences?.budgetRange) return false;
    if (!preferences?.workingStyle) return false;
    if (!preferences?.availability) return false;
    if (!preferences?.specializations || preferences.specializations.length === 0) return false;

    return true;
  };

  // Track profile validation state whenever formData changes
  useEffect(() => {
    if (currentStep === totalSteps) {
      const isComplete = validateAllProfileData();
      console.log('🔍 PROFILE VALIDATION CHECK:', {
        currentStep,
        totalSteps,
        isComplete,
        formData,
        personal: (formData as any)?.personal,
        timestamp: new Date().toISOString()
      });
      setIsProfileComplete(isComplete);
    }
  }, [formData, currentStep, totalSteps]);

  const handleSubmit = () => {
    if (!isProfileComplete) {
      window.scrollTo(0, 0);
      return;
    }

    setSubmitting(true);
    // Call the parent's handleStepComplete which will handle the actual submission
    // The submission is already implemented in PortfolioSetup
    onNext();
  };

  const handleButtonClick = () => {
    if (currentStep === totalSteps) {
      handleSubmit();
    } else {
      onNext();
    }
  };

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

    // For developer step 4 (ProjectGallery), use canContinue prop from parent
    if (userType === 'developer' && currentStep === 4) {
      return false; // Will use canContinue prop instead
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
  
  // For step 4 (ProjectGallery), use the canContinue prop instead of validateFormIsComplete
  const continueDisabled = userType === 'developer' && currentStep === 4 
    ? !canContinue 
    : !isFormComplete;

  // For final step (ProfilePreview/Step 6), use isProfileComplete state
  const buttonDisabled = currentStep === totalSteps 
    ? submitting || !isProfileComplete
    : continueDisabled;

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
          onClick={handleButtonClick}
          disabled={buttonDisabled}
          className={`
            px-6 py-3 rounded-lg font-medium transition-colors
            ${buttonDisabled
              ? 'cursor-not-allowed opacity-50 bg-gray-400'
              : 'bg-[#253E44] text-white hover:bg-[#253E44]/90 active:bg-[#253E44]/80'
            }
          `}
        >
          {currentStep === totalSteps 
            ? (submitting ? 'Submitting...' : isProfileComplete ? 'Submit Profile' : 'Fix Issues to Continue')
            : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default NavigationButtons;
