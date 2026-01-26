
interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressTracker = ({ currentStep, totalSteps }: ProgressTrackerProps) => {
  return (
    <div className="w-full px-2 sm:px-0">
      <div className="flex items-center justify-between gap-1 sm:gap-2 md:gap-3">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center justify-center flex-1 min-w-0">
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
              {stepNumber < totalSteps && (
                <div className={`
                  flex-1 h-1 mx-1 sm:mx-2 transition-colors
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
