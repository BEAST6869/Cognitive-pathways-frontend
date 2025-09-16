import React from 'react';

// Lightweight, fast-loading spinner component
const FastLoader = ({ 
  fullScreen = false, 
  message = "Loading quiz questions...", 
  showProgress = false,
  progress = 0 
}) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="text-center max-w-sm">
        {/* Optimized CSS-only spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Loading message */}
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-2">
          {message}
        </p>
        
        {/* Optional progress bar */}
        {showProgress && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
        )}
        
        {/* Loading tips */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>⚡ Optimized for speed</p>
          <p>🔄 Cached for faster loading</p>
          {fullScreen && (
            <p className="mt-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Loading from server...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Mini loader for inline use
export const MiniLoader = ({ message = "Loading..." }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    <span>{message}</span>
  </div>
);

// Progress loader with steps
export const StepLoader = ({ steps, currentStep, message }) => (
  <div className="text-center p-6">
    <div className="relative w-16 h-16 mx-auto mb-4">
      <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <p className="text-gray-700 font-medium mb-4">{message}</p>
    
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center text-sm">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            index < currentStep ? 'bg-green-500' :
            index === currentStep ? 'bg-primary-500 animate-pulse' :
            'bg-gray-300'
          }`}></div>
          <span className={
            index <= currentStep ? 'text-gray-700 font-medium' : 'text-gray-500'
          }>
            {step}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default FastLoader;
