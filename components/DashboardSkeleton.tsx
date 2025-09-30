import React from 'react';

const SkeletonCard: React.FC = () => (
    <div className="bg-white p-5 rounded-xl shadow-sm">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2 animate-pulse"></div>
    </div>
);

const SkeletonPanel: React.FC<{ lines?: number }> = ({ lines = 5 }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
            ))}
        </div>
    </div>
);


const DashboardSkeleton: React.FC = () => {
    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div>
                <div className="h-9 bg-gray-300 rounded w-1/4 animate-pulse mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
                
                {/* Main Content */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                    <SkeletonPanel lines={4} />
                </div>

                {/* Right Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    <SkeletonPanel lines={2} />
                    <SkeletonPanel lines={3} />
                    <SkeletonPanel lines={1} />
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
