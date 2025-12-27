import React from 'react';

const TripManagement = () => {
  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          TripManagement
        </h2>
      </div>

      <div className="mx-10 flex flex-col gap-6">
        {/* Bus card */}
        <div className="border border-gray-200 rounded-xl p-6">
          <h3>Bus</h3>
          <div>Route</div>
          <div>Status</div>
          <div>Direction</div>
          <button
            className="px-3 py-1 rounded-full bg-green-500 hover:bg-green-600 text-white 
          transition-all duration-200 transform active:scale-95 active:shadow-lg"
          >
            Start Trip
          </button>
          <button
            className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white
          transition-all duration-200 transform active:scale-95 active:shadow-lg"
          >
            End Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripManagement;
