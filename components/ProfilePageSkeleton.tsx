import React from 'react';

const ProfilePageSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-6xl mx-auto animate-pulse">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-8 border-b border-gray-200">
        <div className="rounded-full bg-gray-300 w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0"></div>
        <div className="text-center sm:text-left flex-grow w-full">
          <div className="h-10 bg-gray-300 rounded w-3/5 mx-auto sm:mx-0"></div>
          <div className="h-6 bg-gray-300 rounded w-2/5 mx-auto sm:mx-0 mt-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mt-6"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
        </div>
      </div>
      
      {/* Booking Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
        {/* Left Column: Services */}
        <div className="space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
        </div>

        {/* Right Column: Time */}
        <div>
            <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg p-8">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;
