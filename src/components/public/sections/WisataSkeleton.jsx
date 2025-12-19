export default function WisataSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="w-full aspect-video bg-gray-200"></div>
          {/* Content Skeleton */}
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="flex items-start gap-2 mb-3">
              <div className="w-4 h-4 bg-gray-200 rounded mt-0.5"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

