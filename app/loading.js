export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="text-center">

        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

        <p className="mt-4 text-lg font-medium">
          Loading...
        </p>

      </div>

    </div>
  );
}