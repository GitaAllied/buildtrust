
interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  userType?: 'client' | 'developer';
}

const ProgressTracker = ({ currentStep, totalSteps, userType }: ProgressTrackerProps) => {
  // Ensure we have the correct total steps
  const isClient = userType === 'client';
  const actualTotalSteps = isClient ? 3 : (totalSteps || 6);
  
  // For fewer steps, use a more compact layout
  const isCompact = actualTotalSteps <= 3;
  
  return (
    <div className="w-full px-2 sm:px-0">
      <div className={`flex items-center ${isCompact ? 'justify-center gap-4 sm:gap-6 md:gap-8' : 'justify-between gap-1 sm:gap-2 md:gap-3'}`}>
        {Array.from({ length: actualTotalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className={`flex items-center justify-center ${isCompact ? 'flex-shrink-0' : 'flex-1 min-w-0'}`}>
              <div className={`
                flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors
                ${isCompleted ? 'bg-[#226F75] text-white' : ''}
                ${isCurrent ? 'bg-[#226F75] text-white' : ''}
                ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
              `}>
                {isCompleted ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < actualTotalSteps && (
                <div className={`
                  h-1 transition-colors
                  ${isCompact ? 'w-8 sm:w-12 md:w-16 mx-2 sm:mx-3' : 'flex-1 mx-1 sm:mx-2'}
                  ${stepNumber < currentStep ? 'bg-[#226F75]' : 'bg-gray-200'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
