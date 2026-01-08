
import { Button } from "@/components/ui/button";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  canContinue: boolean;
}

const NavigationButtons = ({ currentStep, totalSteps, onPrev, onNext, canContinue }: NavigationButtonsProps) => {
  return (
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
        disabled={!canContinue}
        className={`
          px-6 py-3 rounded-lg font-medium transition-colors
          ${!canContinue
            ? 'cursor-not-allowed opacity-50'
            : 'bg-green-600 text-white hover:bg-green-700'
          }
        `}
      >
        {currentStep === totalSteps ? 'Submit Profile' : 'Continue'}
      </Button>
    </div>
  );
};

export default NavigationButtons;
