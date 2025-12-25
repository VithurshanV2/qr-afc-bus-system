import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { BounceLoader } from 'react-spinners';
import { formatIssuedDate } from '../../utils/date';
import TicketCard from '../commuter/components/TicketCard';

const TripLogs = () => {
  const { backendUrl, setGlobalLoading } = useContext(AppContext);

  const [search, setSearch] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const limit = 10; // tickets per page

  const totalPages = Math.ceil(total / limit);

  const fetchTickets = async (page = 1) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const params = {
        from: fromDate,
        to: toDate,
        search,
        page,
        limit,
      };

      const { data } = await axios.get(backendUrl + '/api/ticket/trip-logs', {
        params,
      });

      if (data.success) {
        setTickets(data.tripLogs);
        setTotal(data.total);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1);
  }, [search, fromDate, toDate]);

  const closeForm = () => {
    setSelectedTicket(null);
    fetchTickets(currentPage);
  };

  const clearFilters = () => {
    setSearch('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
    fetchTickets(1);
  };

  const viewTicket = async (ticketId) => {
    try {
      setGlobalLoading(true);

      const { data } = await axios.get(
        backendUrl + '/api/ticket/ticket/' + ticketId,
      );

      if (data.success) {
        setSelectedTicket(data.ticket);
      } else {
        toast.error(data.message || 'Failed to fetch ticket');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">TripLogs</h2>
      </div>

      {/* Render ticket */}
      {selectedTicket && (
        <div className="flex justify-center mb-4">
          <div className="max-w-4xl border border-gray-200 p-4 rounded-xl shadow-lg">
            <button
              onClick={closeForm}
              className="top-2 right-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md mb-3
            hover:shadow-gray-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
            >
              Back
            </button>

            <TicketCard ticket={selectedTicket || null} onClose={closeForm} />
          </div>
        </div>
      )}

      {/* Search tickets */}
      {!selectedTicket && (
        <div>
          <div className="flex gap-4 mx-10 mb-6">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="Search by name, email, number, or bus registration number"
              className="border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="Search by name, email, number, or bus registration number"
              className="border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, number, or bus registration number"
              className="w-full flex-3/4 border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <div className="flex gap-2 flex-1/4">
              <button
                onClick={() => fetchTickets(1)}
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

          {/* Ticket list */}
          <div className="mx-10">
            <div className="flex justify-between">
              <h3 className="text-gray-900 font-semibold mb-3 text-2xl">
                Ticket List
              </h3>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Commuter</th>
                    <th className="px-4 py-3 text-left">Bus</th>
                    <th className="px-4 py-3 text-left">Ticket Details</th>
                    <th className="px-4 py-3 text-left">Issued Date</th>
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

                  {!loading && tickets.length === 0 && (
                    <tr>
                      <td
                        className="py-6 text-gray-700 text-lg text-center"
                        colSpan="5"
                      >
                        No tickets found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="font-medium text-gray-900">
                        {/* Commuter */}
                        <td className="px-4 py-3">
                          <div>{ticket.commuter?.name}</div>
                          <div className="text-sm text-gray-700">
                            {ticket.commuter?.email}
                          </div>
                          <div className="text-sm text-gray-700">
                            {ticket.commuter?.number}
                          </div>
                        </td>

                        {/* Bus */}
                        <td className="px-4 py-3">
                          <div>{ticket.trip?.bus?.registrationNumber}</div>
                          <div className="text-sm text-gray-700">
                            {ticket.trip?.bus?.requestedBusType || '-'}
                          </div>
                        </td>

                        {/* Ticket */}
                        <td className="px-4 py-3">
                          <div>
                            {ticket.boardingHalt?.englishName} -{' '}
                            {ticket.destinationHalt?.englishName || '-'}
                          </div>
                          <div className="text-sm text-gray-700">
                            Adults: {ticket.adultCount} | Children:{' '}
                            {ticket.childCount}
                          </div>
                          <div className="text-sm text-gray-700">
                            Total Fare: {(ticket.totalFare / 100).toFixed(2)}{' '}
                            LKR
                          </div>
                        </td>

                        {/* Issued date */}
                        <td className="px-4 py-3">
                          <div>{formatIssuedDate(ticket.issuedAt)}</div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => viewTicket(ticket.id)}
                            className="px-3 py-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                          >
                            View Ticket
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
                onClick={() => fetchTickets(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => fetchTickets(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripLogs;
