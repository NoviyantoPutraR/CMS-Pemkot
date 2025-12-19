export default function LayananSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm animate-pulse"
        >
          {/* Icon Skeleton */}
          <div className="p-6 bg-gray-100 flex items-center justify-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
          </div>
          {/* Content Skeleton */}
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

