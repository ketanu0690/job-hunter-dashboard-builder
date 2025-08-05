import React from "react";

const AppLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
      {/* Spinner Animation */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>

      {/* Label below spinner */}
      <div className="text-xl font-semibold animate-pulse">K Loder..</div>
    </div>
  );
};

export default AppLoader;
