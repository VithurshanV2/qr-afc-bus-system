import React from 'react';

const ExitTracking = () => {
  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Passenger Exit Tracking
        </h2>

        {/* Bus tab */}
        <div className="flex gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg 
            bg-yellow-200 text-yellow-800 hover:bg-yellow-300`}
          >
            Bus Registration number and type
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg 
            bg-gray-200 text-gray-800 hover:bg-gray-300`}
          >
            Bus Registration number and type
          </button>
        </div>

        {/* Bus related info */}
        <div className="border border-gray-200 p-5 rounded-xl mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">
            Bus registration Number
          </h3>
          <p className="text-xl text-gray-700">Route name (number)</p>

          <div className="flex justify-center gap-10 mb-6">
            <div>
              <label className="text-gray-700 text-sm">Upcoming Halt</label>
              <p className="text-3xl">Halt</p>
            </div>
            <div>
              <label className="text-gray-700 text-sm">Exit count</label>
              <p className="text-3xl">3</p>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            className={`px-6 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg 
        bg-gray-200 text-gray-800 hover:bg-gray-300`}
          >
            Previous Halt
          </button>
          <button
            className={`px-6 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg 
        bg-yellow-200 text-yellow-800 hover:bg-yellow-300`}
          >
            Next Halt
          </button>
        </div>

        {/* Halts table */}
        <div className="border border-gray-200 rounded-xl overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Halt Name</th>
                <th className="px-4 py-2 text-left">Passengers Exiting</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  className="py-6 text-gray-700 text-lg text-center"
                  colSpan="3"
                >
                  No active trip for this bus
                </td>
              </tr>

              <tr>
                <td className="px-4 py-2">Id</td>
                <td className="px-4 py-2">Halt name</td>
                <td className="px-4 py-2">Exit count</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExitTracking;
