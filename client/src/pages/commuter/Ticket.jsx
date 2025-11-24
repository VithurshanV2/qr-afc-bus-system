import React from 'react';
import { assets } from '../../assets/assets';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { formatIssuedDate } from '../../utils/date';
import TicketCard from './components/TicketCard';

const Ticket = () => {
  const { backendUrl } = useContext(AppContext);

  const [ticket, setTicket] = useState(null);
  const [pastTickets, setPastTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pastLoading, setPastLoading] = useState(false);
  const [pastCursor, setPastCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [viewPastTickets, setViewPastTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

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
    fetchLatestTicket();
    fetchPastTickets();
  }, []);

  const handleLoadMore = () => {
    fetchPastTickets(pastCursor);
  };

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
            {/* Latest ticket view */}
            {!viewPastTickets && (
              <>
                <h2 className="text-gray-900 text-2xl font-medium flex items-center gap-2 mb-4">
                  Ticket
                </h2>

                {/* Latest ticket */}
                <TicketCard ticket={ticket} />
                <button
                  onClick={() => setViewPastTickets(true)}
                  disabled={loading}
                  className="mt-6 w-full py-2 rounded-full bg-yellow-200 text-yellow-800 
                hover:bg-yellow-300 transition-all duration-200 active:scale-95 active:shadow-lg"
                >
                  Show Ticket History
                </button>
              </>
            )}

            {/* Ticket History */}
            {viewPastTickets && (
              <>
                <div className="mb-4 mt-4">
                  {/* Back button */}
                  <button
                    onClick={() => setViewPastTickets(false)}
                    className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 active:scale-95"
                  >
                    <ArrowLeft size={18} />
                    <span className="text-sm text-gray-800">Back</span>
                  </button>

                  <h3 className="text-gray-900 font-semibold text-2xl text-center">
                    Ticket History
                  </h3>

                  <p className="text-gray-700 text-sm text-center">
                    Click on a ticket to view the full ticket
                  </p>
                </div>

                <div
                  className="overflow-y-auto flex flex-col gap-3 mt-4"
                  style={{
                    maxHeight: 'calc(70vh - 200px)',
                    scrollbarWidth: 'thin',
                  }}
                >
                  {pastTickets.length === 0 && !pastLoading && (
                    <div className="text-gray-500 text-sm text-center py-3">
                      No past tickets yet
                    </div>
                  )}

                  {pastTickets.map((tx) => (
                    <button
                      key={tx.id}
                      onClick={() => setSelectedTicket(tx)}
                      className="w-full flex justify-between items-center p-4 rounded-xl border border-gray-200 shadow-200 shadow-sm hover:shadow-md transition-all text-left"
                    >
                      {/* Halts info */}
                      <div className="flex flex-col">
                        <p className="text-gray-900 font-medium">
                          {tx.boardingHalt?.englishName.replace(
                            /\((.*?)\)/g,
                            '',
                          )}{' '}
                          -{' '}
                          {tx.destinationHalt?.englishName.replace(
                            /\((.*?)\)/g,
                            '',
                          )}
                        </p>
                        <p className="text-gray-700">
                          {formatIssuedDate(tx.issuedAt)}
                        </p>
                        <p className="text-gray-700">Ticket #{tx.id}</p>
                      </div>

                      {/* Total fare */}
                      <div className="text-yellow-600 font-bold text-lg">
                        {(tx.totalFare / 100).toFixed(2)} LKR
                      </div>
                    </button>
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
                      : 'No More Tickets'}
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          {selectedTicket && (
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <motion.div
                className="fixed inset-0 z-40 flex items-center justify-center p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                  {/* Back button */}
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 active:scale-95"
                  >
                    <ArrowLeft size={18} />
                    <span className="text-sm text-gray-800">Back</span>
                  </button>
                  <div className="pt-12 pb-4">
                    <TicketCard ticket={selectedTicket} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Ticket;
