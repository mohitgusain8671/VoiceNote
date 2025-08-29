import React from 'react';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  className = '',
  type = 'error' 
}) => {
  const typeClasses = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200', 
      text: 'text-yellow-800',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800', 
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const classes = typeClasses[type];

  return (
    <div className={`${classes.bg} border ${classes.border} rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className={`w-5 h-5 ${classes.text} mr-2`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className={`${classes.text} font-medium`}>{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`px-3 py-1 ${classes.button} text-white text-sm font-medium rounded transition-colors`}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;