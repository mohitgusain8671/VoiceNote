import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'blue', loading = false }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
    green: {
      bg: 'bg-green-100', 
      text: 'text-green-600',
    },
    orange: {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
    },
  };

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-gray-100">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 ${colorClasses[color].bg} rounded-lg flex items-center justify-center`}>
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
              ) : (
                <Icon className={`h-6 w-6 ${colorClasses[color].text}`} />
              )}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  value
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;