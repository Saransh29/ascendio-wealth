export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="mt-8">
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}