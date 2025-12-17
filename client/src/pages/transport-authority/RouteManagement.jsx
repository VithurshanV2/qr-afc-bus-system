import React from 'react';

const RouteManagement = () => {
  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          RouteManagement
        </h2>
      </div>

      {/* Search routes */}
      <div className="flex gap-4 mx-10 mb-6">
        <input
          placeholder="Search routes by route number or name"
          className="w-full flex-2/3 border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          className="w-full flex-1/3 bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full
          transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
        >
          Search
        </button>
      </div>

      {/* Route list */}
      <div className="mx-10">
        <h3 className="text-gray-900 font-semibold mb-3 text-2xl">
          Route List
        </h3>

        <div>
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Route</th>
                <th className="px-4 py-2 text-left">Bus Type</th>
                <th className="px-4 py-2 text-left">Last Updated</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RouteManagement;
