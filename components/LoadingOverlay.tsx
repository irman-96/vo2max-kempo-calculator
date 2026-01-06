
import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-[100] animate-fade-in" aria-modal="true" role="dialog" aria-labelledby="loading-message">
      <div className="w-16 h-16 border-4 border-t-4 border-t-indigo-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
      <p id="loading-message" className="mt-4 text-white text-lg font-semibold text-center px-4">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
