import React from 'react';
import { assets } from '../../assets/assets';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const Ticket = () => {
  const { backendUrl } = useContext(AppContext);

  const [ticket, setTicket] = useState(null);
  const [pastTickets, setPastTickets] = useState([]);
  const [_loading, setLoading] = useState(false);
  const [pastLoading, setPastLoading] = useState(false);
  const [pastCursor, setPastCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch latest ticket of the user
  const fetchLatestTicket = async () => {
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + '/api/ticket/latest');

      if (data.success && data.ticket) {
        setTicket(data.ticket);
      } else {
        toast.error(data.message || 'Unable to fetch ticket');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestTicket();
  }, []);

  // Fetch past tickets
  const fetchPastTickets = async (cursor = null) => {
    try {
      setPastLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + '/api/ticket/past', {
        params: { limit: 5, cursor },
      });

      if (data.success) {
        if (cursor) {
          setPastTickets((prev) => [...prev, ...data.tickets]);
        } else {
          setPastTickets(data.tickets);
        }

        setPastCursor(data.nextCursor);
        setHasMore(data.nextCursor !== null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setPastLoading(false);
    }
  };

  useEffect(() => {
    fetchPastTickets();
  }, []);

  const handleLoadMore = () => {
    fetchPastTickets(pastCursor);
  };

  if (!ticket) {
    return;
  }

  const {
    id,
    issuedAt,
    baseFare,
    totalFare,
    boardingHalt,
    destinationHalt,
    adultCount,
    childCount,
    commuter,
    trip,
  } = ticket;

  const route = trip?.route;
  const bus = trip?.bus;

  return (
    <div className="bg-white min-h-[calc(100vh-4.4rem)] p-4">
      <div className="flex items-start mb-4">
        <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />
      </div>

      <div className="mt-6 max-w-md mx-auto shadow rounded-xl p-6 border border-gray-200">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-gray-900 text-2xl font-medium flex items-center gap-2 mb-4">
              Ticket
            </h2>

            {/* Latest ticket */}
            <div className="space-y-5 border-3 border-gray-200 rounded-xl p-5 shadow-lg">
              <div className=" border-b border-gray-200 pb-3 mb-3">
                {/* Ticket ID */}
                <div className="text-center text-yellow-600 text-3xl font-semibold mb-2">
                  <span className="text-gray-600">Ticket</span> #{id}
                </div>

                {/* Halts info */}
                <div className="text-center mb-4 border-b border-gray-200 pb-2">
                  <p className="text-gray-600 text-xs tracking-wide">
                    Boarding Halt - Destination Halt
                  </p>
                  <p className="text-2xl font-medium text-gray-900 leading-[1.1] mt-[-2px]">
                    {boardingHalt?.englishName.replace(/\((.*?)\)/g, '')} {'-'}{' '}
                    {destinationHalt?.englishName.replace(/\((.*?)\)/g, '')}
                  </p>
                </div>

                {/* Ticket details */}
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commuter</span>
                    <span className="text-gray-900 font-medium">
                      {commuter?.name || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Route</span>
                    <span className="text-gray-900 font-medium">
                      {route?.name || 'N/A'} ({route?.number || 'N/A'})
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Bus Reg. No.</span>
                    <span className="text-gray-900 font-medium">
                      {bus?.registrationNumber || 'N/A'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers</span>
                    <span className="text-gray-900 font-medium">
                      {adultCount} Adult{adultCount > 1 ? 's' : ''}
                      {childCount > 0 &&
                        `, ${childCount} Child${childCount > 1 ? 'ren' : ''}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="text-gray-900 font-medium">
                      {(baseFare / 100).toFixed(2)} LKR
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Issued</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(issuedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total fare */}
              <div className="text-center mt-2">
                <p className="text-gray-600 tracking-wide text-xs leading-tight">
                  Total Fare
                </p>
                <p className="text-4xl font-medium text-gray-900 leading-[1.1] mt-[-2px]">
                  {(totalFare / 100).toFixed(2)} LKR
                </p>
              </div>
            </div>

            {/* Ticket History */}
            <div className="mt-6">
              <h3 className="text-gray-900 font-semibold mb-2">
                Ticket History
              </h3>
              <div className="max-h-64 overflow-y-auto pr-4 flex flex-col gap-3">
                {pastTickets.length === 0 && !pastLoading && (
                  <div className="text-gray-500 text-sm text-center py-3">
                    No past tickets yet
                  </div>
                )}

                {pastTickets.map((tx, index) => (
                  <div
                    key={tx.id}
                    className={`flex justify-between items-center py-3 ${
                      index < pastTickets.length - 1
                        ? 'border-b border-gray-200'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-900 font-medium">
                        Ticket #{tx.id}
                      </span>
                      <span>{(tx.totalFare / 100).toFixed(2)} LKR</span>
                    </div>
                    <p>
                      {tx.boardingHalt?.englishName.replace(/\((.*?)\)/g, '')}{' '}
                      {'-'}{' '}
                      {tx.destinationHalt?.englishName.replace(
                        /\((.*?)\)/g,
                        '',
                      )}
                    </p>
                    <p>{new Date(tx.issuedAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={handleLoadMore}
                disabled={!hasMore || pastLoading}
                className="mt-4 py-2 w-full rounded-full text-sm bg-gray-200 text-gray-800 hover:bg-gray-300
              disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pastLoading
                  ? 'Loading...'
                  : hasMore
                    ? 'Load More'
                    : 'No More Transactions'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Ticket;
