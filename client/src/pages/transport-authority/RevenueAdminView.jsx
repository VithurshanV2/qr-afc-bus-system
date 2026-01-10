import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { formatIssuedDate } from '../../utils/date';
import { motion, AnimatePresence } from 'framer-motion';

const RevenueAdminView = () => {
  const { backendUrl } = useContext(AppContext);

  const [search, setSearch] = useState('');
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);

  // Trip table states
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsPage, setTripsPage] = useState(1);
  const [tripsTotal, setTripsTotal] = useState(0);
  const [tripsTotalTickets, setTripsTotalTickets] = useState(0);
  const [tripsTotalRevenue, setTripsTotalRevenue] = useState(0);

  // Month selector
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );

  // generate years from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Array(currentYear - 2020 + 1),
    (value, index) => 2020 + index,
  );

  const limit = 10; // operators per page
  const tripsLimit = 10; // trips per page

  const totalPages = Math.ceil(total / limit);
  const tripsTotalPages = Math.ceil(tripsTotal / tripsLimit);

  const fetchOperators = async (page = 1) => {
    try {
      setLoading(true);

      axios.defaults.withCredentials = true;

      const params = {
        year: selectedYear,
        month: selectedMonth,
        search,
        page,
        limit,
      };

      const { data } = await axios.get(
        backendUrl + '/api/revenue/operators/monthly',
        {
          params,
        },
      );

      if (data.success) {
        setOperators(data.operators);
        setTotal(data.total);
        setTotalTickets(data.totalTickets);
        setTotalRevenue(data.totalRevenue);
        setTotalTrips(data.totalTrips);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchOperatorTrips = async (operatorId, page = 1) => {
    try {
      setTripsLoading(true);

      axios.defaults.withCredentials = true;

      const params = {
        year: selectedYear,
        month: selectedMonth,
        page,
        limit: tripsLimit,
      };

      const { data } = await axios.get(
        backendUrl + `/api/revenue/operators/${operatorId}/trips`,
        {
          params,
        },
      );

      if (data.success) {
        setTrips(data.revenues);
        setTripsTotal(data.total);
        setTripsTotalTickets(data.totalTickets);
        setTripsTotalRevenue(data.totalRevenue);
        setTripsPage(page);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setTripsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedOperator) {
      fetchOperators(1);
    }
  }, [search, selectedYear, selectedMonth]);

  const clearFilters = () => {
    setSearch('');
    const currentDate = new Date();
    setSelectedYear(currentDate.getFullYear());
    setSelectedMonth(currentDate.getMonth() + 1);
    setCurrentPage(1);
    fetchOperators(1);
  };

  const viewOperatorTrips = (operator) => {
    setSelectedOperator(operator);
    fetchOperatorTrips(operator.operator.userId, 1);
  };

  const handleBack = () => {
    setSelectedOperator(null);
    setTrips([]);
    setTripsPage(1);
    fetchOperators(currentPage);
  };

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

  return (
    <AnimatePresence mode="wait">
      {/* Monthly revenue summary */}
      {!selectedOperator && (
        <motion.div
          key="operator-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-6">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Operator Revenue Tracking
            </h2>
          </div>

          {/* Search and filters */}
          <div className="flex gap-4 mx-10 mb-6">
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

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by operator, bus, or route"
              className="w-full flex-3/4 border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <div className="flex gap-2 flex-1/4">
              <button
                onClick={() => fetchOperators(1)}
                className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full
              transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
              >
                Search
              </button>
              <button
                onClick={clearFilters}
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
              <div className="text-gray-600 font-medium mb-2">
                Total Revenue
              </div>
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
              <div className="text-gray-600 font-medium mb-2">
                Total Tickets
              </div>
              <div className="text-gray-900 font-medium text-3xl">
                {totalTickets}
              </div>
            </div>
          </div>

          {/* Operator table */}
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
                    <th className="px-4 py-3 text-left">Trips</th>
                    <th className="px-4 py-3 text-left">Tickets</th>
                    <th className="px-4 py-3 text-left">Revenue</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td className="py-6 text-center" colSpan="5">
                        <BounceLoader size={30} color="#FFB347" />
                      </td>
                    </tr>
                  )}

                  {!loading && operators.length === 0 && (
                    <tr>
                      <td
                        className="py-6 text-gray-700 text-lg text-center"
                        colSpan="5"
                      >
                        No revenue records found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    operators.map((operator) => (
                      <tr
                        key={operator.id}
                        className="font-medium text-gray-900"
                      >
                        {/* Operator */}
                        <td className="px-4 py-3">
                          <div>{operator.operator?.user?.name}</div>
                          <div className="text-sm text-gray-700">
                            {operator.operator?.user?.email}
                          </div>
                          <div className="text-sm text-gray-700">
                            {operator.operator?.nic}
                          </div>
                        </td>

                        {/* Trips */}
                        <td className="px-4 py-3">
                          <div>{operator.totalTrips}</div>
                        </td>

                        {/* Tickets */}
                        <td className="px-4 py-3">
                          <div>{operator.totalTickets}</div>
                        </td>

                        {/* Revenue */}
                        <td className="px-4 py-3">
                          <div>
                            {(operator.totalRevenue / 100).toFixed(2)} LKR
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => viewOperatorTrips(operator)}
                            className="px-3 py-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                          >
                            View Trips
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-4 mb-6">
              <button
                onClick={() => fetchOperators(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => fetchOperators(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Trip details view */}
      {selectedOperator && (
        <motion.div
          key="trip-details"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4 }}
        >
          <div className="p-6">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              {selectedOperator.operator.user.name} - Monthly Trips
            </h2>
          </div>

          {/* Back button */}
          <div className="mx-10 mb-6">
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 active:scale-95"
            >
              <ArrowLeft size={18} />
              <span className="text-sm text-gray-800">Back</span>
            </button>
          </div>

          {/* Summary cards for trip */}
          <div className="mx-10 mb-6 grid grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-gray-600 font-medium mb-2">
                Total Revenue
              </div>
              <div className="text-gray-900 font-medium text-3xl">
                {(tripsTotalRevenue / 100).toFixed(2)} LKR
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-gray-600 font-medium mb-2">Total Trips</div>
              <div className="text-gray-900 font-medium text-3xl">
                {tripsTotal}
              </div>
            </div>
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="text-gray-600 font-medium mb-2">
                Total Tickets
              </div>
              <div className="text-gray-900 font-medium text-3xl">
                {tripsTotalTickets}
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
                  {tripsLoading && (
                    <tr>
                      <td className="py-6 text-center" colSpan="6">
                        <BounceLoader size={30} color="#FFB347" />
                      </td>
                    </tr>
                  )}

                  {!tripsLoading && trips.length === 0 && (
                    <tr>
                      <td
                        className="py-6 text-gray-700 text-lg text-center"
                        colSpan="6"
                      >
                        No trips found
                      </td>
                    </tr>
                  )}

                  {!tripsLoading &&
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
                            {trip.trip?.route?.name} ({trip.trip?.route?.number}
                            )
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
                onClick={() =>
                  fetchOperatorTrips(
                    selectedOperator.operator.userId,
                    tripsPage - 1,
                  )
                }
                disabled={tripsPage === 1}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span>
                Page {tripsPage} of {tripsTotalPages}
              </span>

              <button
                onClick={() =>
                  fetchOperatorTrips(
                    selectedOperator.operator.userId,
                    tripsPage + 1,
                  )
                }
                disabled={tripsPage === tripsTotalPages}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RevenueAdminView;
