export default function TransparansiSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
        >
          {/* Tahun Skeleton */}
          <div className="mb-4">
            <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          </div>

          {/* Button Skeleton */}
          <div className="flex gap-3 mb-4">
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Info Skeleton */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <div className="h-3 w-3 bg-gray-200 rounded"></div>
            <div className="h-3 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

