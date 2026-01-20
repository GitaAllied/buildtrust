
interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressTracker = ({ currentStep, totalSteps }: ProgressTrackerProps) => {
  return (
    <div className="flex items-center justify-between">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div key={stepNumber} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors
              ${isCompleted ? 'bg-[#226F75] text-white' : ''}
              ${isCurrent ? 'bg-[#226F75] text-white' : ''}
              ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
            `}>
              {isCompleted ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            {stepNumber < totalSteps && (
              <div className={`
                w-16 h-1 mx-2 transition-colors
                ${stepNumber < currentStep ? 'bg-[#226F75]' : 'bg-gray-200'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTracker;
