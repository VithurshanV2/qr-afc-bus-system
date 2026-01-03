import React from 'react';
import { useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { formatIssuedDate } from '../../utils/date';

const Revenue = () => {
  const [search, setSearch] = useState('');
  const [revenues, _setRevenues] = useState([]);
  const [loading, _setLoading] = useState(false);
  const [currentPage, _setCurrentPage] = useState(1);
  const [total, _setTotal] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const limit = 10; // tickets per page

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Operator Revenue Tracking
        </h2>
      </div>

      {/* Search and filters */}
      <div className="flex gap-4 mx-10 mb-6">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by operator, bus, or route"
          className="w-full flex-3/4 border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <div className="flex gap-2 flex-1/4">
          <button
            className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full
              transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
          >
            Search
          </button>
          <button
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-full
              transition-all duration-200 transform hover:bg-gray-300 active:scale-95 active:shadow-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mx-10 mb-6 grid grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-gray-600 font-medium mb-2">Total Revenue</div>
          <div className="text-gray-900 font-medium text-3xl">5,000.00 LKR</div>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-gray-600 font-medium mb-2">Total Trips</div>
          <div className="text-gray-900 font-medium text-3xl">2</div>
        </div>
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="text-gray-600 font-medium mb-2">Total Tickets</div>
          <div className="text-gray-900 font-medium text-3xl">27</div>
        </div>
      </div>

      {/* Revenue table */}
      <div className="mx-10">
        <div className="flex justify-between mb-3">
          <h3 className="text-gray-900 font-semibold text-2xl">
            Revenue Records
          </h3>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Operator</th>
                <th className="px-4 py-3 text-left">Bus</th>
                <th className="px-4 py-3 text-left">Route</th>
                <th className="px-4 py-3 text-left">Trip Date</th>
                <th className="px-4 py-3 text-left">Tickets</th>
                <th className="px-4 py-3 text-left">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td className="py-6 text-center" colSpan="6">
                    <BounceLoader size={30} color="#FFB347" />
                  </td>
                </tr>
              )}

              {!loading && revenues.length === 0 && (
                <tr>
                  <td
                    className="py-6 text-gray-700 text-lg text-center"
                    colSpan="6"
                  >
                    No revenue records found
                  </td>
                </tr>
              )}

              {!loading &&
                revenues.map((revenue) => (
                  <tr key={revenue.id} className="font-medium text-gray-900">
                    {/* Operator */}
                    <td className="px-4 py-3">
                      <div>{revenue.trip?.bus?.operator?.user?.name}</div>
                      <div className="text-sm text-gray-700">
                        {revenue.trip?.bus?.operator?.user?.email}
                      </div>
                      <div className="text-sm text-gray-700">
                        {revenue.trip?.bus?.operator?.nic}
                      </div>
                    </td>

                    {/* Bus */}
                    <td className="px-4 py-3">
                      <div>{revenue.trip?.bus?.registrationNumber}</div>
                      <div className="text-sm text-gray-700">
                        {revenue.trip?.bus?.requestedBusType || '-'}
                      </div>
                    </td>

                    {/* Route */}
                    <td className="px-4 py-3">
                      <div>
                        {revenue.trip?.route?.name} (
                        {revenue.trip?.route?.number})
                      </div>
                    </td>

                    {/* Trip date */}
                    <td className="px-4 py-3">
                      <div>{formatIssuedDate(revenue.trip?.startTime)}</div>
                    </td>

                    {/* Tickets */}
                    <td className="px-4 py-3">
                      <div>{revenue.ticketCount}</div>
                    </td>

                    {/* Revenue */}
                    <td className="px-4 py-3">
                      <div>{(revenue.totalAmount / 100).toFixed(2)} LKR</div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-4 mb-6">
          <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
