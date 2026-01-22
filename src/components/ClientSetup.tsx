import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, User, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import PersonalInfo from "./setup/PersonalInfo";
import ProgressTracker from "./setup/ProgressTracker";
import NavigationButtons from "./setup/NavigationButtons";
import Logo from '../assets/Logo.png'

interface ClientSetupProps {
  onExit: () => void;
}

interface PersonalFormData extends Record<string, unknown> {
  fullName?: string;
  phoneNumber?: string;
  currentLocation?: string;
  occupation?: string;
  preferredContact?: string;
}

const ClientSetup = ({ onExit }: ClientSetupProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: {} as PersonalFormData
  });
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  // Check email verification on component mount
  useEffect(() => {
    if (user && !user.email_verified) {
      navigate('/verify-email');
    }
  }, [user, navigate]);

  const handleStepComplete = async () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Define profileData outside try to avoid ReferenceError in catch
      const profileData: Record<string, any> = {
        name: formData.personal.fullName,
        phone: formData.personal.phoneNumber,
        location: formData.personal.currentLocation,
        bio: formData.personal.occupation,
        preferred_contact: formData.personal.preferredContact,
      };

      // Remove undefined or empty string values
      const cleanedProfileData: Record<string, any> = {};
      Object.entries(profileData).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === 'string' && v.trim() === '') return;
        cleanedProfileData[k] = v;
      });

      try {
        const response = await apiClient.updateProfile(cleanedProfileData);
        
        await refreshUser();
        
        // Clear localStorage on successful submission
        localStorage.removeItem('buildtrust_personal_info');
        localStorage.removeItem('buildtrust_preferences');
        
        // Redirect to client dashboard
        onExit();
        navigate('/client-dashboard');
      } catch (error: any) {
        console.error('❌ FAILED TO SAVE PROFILE:', {
          message: error.message,
          status: error.status,
          body: error.body,
          url: error.url,
          payload: cleanedProfileData,
          timestamp: new Date().toISOString()
        });
        // show user-friendly UI message
        alert('An error occurred while updating your profile. Check console for details.');
      }
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (section: string, data: Record<string, unknown>) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const browse = () => {
    navigate('/browse');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#226F75]/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-[#226F75]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-sm sm:text-base text-gray-600 px-4">Help us personalize your experience and connect you with the right developers.</p>
            </div>
            <PersonalInfo
              data={formData.personal}
              onChange={(data) => updateFormData('personal', data)}
              userType="client"
            />
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={2}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
              formData={formData.personal}
              userType="client"
            />
          </div>
        );
      case 2:
        return (
          <div>
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#226F75]/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#226F75]/60" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Review Your Profile</h2>
              <p className="text-sm sm:text-base text-gray-600 px-4">Everything looks great! You're ready to start your building journey.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Profile Summary</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 text-sm sm:text-base">Personal information completed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 text-sm sm:text-base">Ready to connect with developers</span>
                </div>
              </div>
            </div>

            <NavigationButtons
              currentStep={currentStep}
              totalSteps={2}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
              formData={formData.personal}
              userType="client"
            />
          </div>
        );
      default:
        return (
          <div>
            <PersonalInfo
              data={formData.personal}
              onChange={(data) => updateFormData('personal', data)}
              userType="client"
            />
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={2}
              onNext={handleStepComplete}
              onPrev={handleStepBack}
              canContinue={true}
              formData={formData.personal}
              userType="client"
            />
          </div>
        );
    }
  };

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <ProgressTracker currentStep={currentStep} totalSteps={2} />
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

export default ClientSetup;