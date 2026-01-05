import React from 'react';
import { useState } from 'react';
import { formatIssuedDate } from '../../utils/date';
import { BounceLoader } from 'react-spinners';
import axios from 'axios';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const RevenueOperatorView = () => {
  const { backendUrl } = useContext(AppContext);

  const [viewType, setViewType] = useState('daily');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [currentPage, _setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Month selector
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );
  const [selectedDate, setSelectedDate] = useState(
    currentDate.toISOString().split('T')[0],
  );

  const limit = 10; // trips per page
  const totalPages = Math.ceil(total / limit);

  // generate years from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Array(currentYear - 2020 + 1),
    (value, index) => 2020 + index,
  );

  // Get direction name from halt json
  const getDirectionName = (route, direction) => {
    if (!route) {
      return direction;
    }

    try {
      if (direction === 'DIRECTIONA' && route.haltsA) {
        return route.haltsA.directionName || direction;
      }

      if (direction === 'DIRECTIONB' && route.haltsB) {
        return route.haltsB.directionName || direction;
      }
    } catch (error) {
      console.error(error);
    }
    return direction;
  };

  const fetchDailyRevenue = async () => {
    try {
      setLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + `/api/revenue/daily`, {
        params: { date: selectedDate },
      });

      if (data.success) {
        setTrips(data.revenues);
        setTotal(data.totalTrips);
        setTotalRevenue(data.totalRevenue);
        setTotalTickets(data.totalTickets);
        setTotalTrips(data.totalTrips);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewType === 'daily') {
      fetchDailyRevenue();
    }
  }, [selectedDate, viewType]);

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">Revenue</h2>
      </div>

      <div className="flex mx-10 mb-6 gap-6">
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('daily')}
            className={`px-4 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg ${
              viewType === 'daily'
                ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setViewType('monthly')}
            className={`px-4 py-2 rounded-full transition-all duration-200 transform active:scale-95 active:shadow-lg ${
              viewType === 'monthly'
                ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Date input or month and year dropdown */}
        <div>
          {viewType === 'daily' ? (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          ) : (
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-xl px-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-xl px-4 py-2 
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {years.map((year, index) => (
                  <option key={`year${index}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div>
        {/* Summary cards for trip */}
        <div className="mx-10 mb-6 grid grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="text-gray-600 font-medium mb-2">Total Revenue</div>
            <div className="text-gray-900 font-medium text-3xl">
              {(totalRevenue / 100).toFixed(2)} LKR
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="text-gray-600 font-medium mb-2">Total Trips</div>
            <div className="text-gray-900 font-medium text-3xl">
              {totalTrips}
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="text-gray-600 font-medium mb-2">Total Tickets</div>
            <div className="text-gray-900 font-medium text-3xl">
              {totalTickets}
            </div>
          </div>
        </div>

        {/* Trips table */}
        <div className="mx-10">
          <div className="flex justify-between mb-3">
            <h3 className="text-gray-900 font-semibold text-2xl">
              Trip Details
            </h3>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Bus</th>
                  <th className="px-4 py-3 text-left">Route</th>
                  <th className="px-4 py-3 text-left">Direction</th>
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

                {!loading && trips.length === 0 && (
                  <tr>
                    <td
                      className="py-6 text-gray-700 text-lg text-center"
                      colSpan="6"
                    >
                      No trips found
                    </td>
                  </tr>
                )}

                {!loading &&
                  trips.map((trip) => (
                    <tr key={trip.id} className="font-medium text-gray-900">
                      {/* Bus */}
                      <td className="px-4 py-3">
                        <div>{trip.trip?.bus?.registrationNumber}</div>
                        <div className="text-sm text-gray-700">
                          {trip.trip?.bus?.requestedBusType || '-'}
                        </div>
                      </td>

                      {/* Route */}
                      <td className="px-4 py-3">
                        <div>
                          {trip.trip?.route?.name} ({trip.trip?.route?.number})
                        </div>
                        <div className="text-sm text-gray-700">
                          {trip.trip?.route?.busType}
                        </div>
                      </td>

                      {/* Direction */}
                      <td className="px-4 py-3">
                        <div>
                          {getDirectionName(
                            trip.trip?.route,
                            trip.trip?.direction,
                          )}
                        </div>
                      </td>

                      {/* TripDate */}
                      <td className="px-4 py-3">
                        <div>{formatIssuedDate(trip.trip?.startTime)}</div>
                      </td>

                      {/* Tickets */}
                      <td className="px-4 py-3">
                        <div>{trip.ticketCount}</div>
                      </td>

                      {/* Revenue */}
                      <td className="px-4 py-3">
                        <div>{(trip.totalAmount / 100).toFixed(2)} LKR</div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-4 mb-6">
            <button
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOperatorView;
