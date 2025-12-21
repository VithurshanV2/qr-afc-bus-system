import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { useEffect } from 'react';
import OperatorRequestView from './components/OperatorRequestView';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BounceLoader } from 'react-spinners';
import { formatIssuedDate } from '../../utils/date';

const ReviewAccountRequest = () => {
  const { backendUrl } = useContext(AppContext);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const limit = 10; // requests per page

  const totalPages = Math.ceil(total / limit);

  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(
        backendUrl + '/api/operator-requests/list',
        {
          params: { search, status, page, limit },
        },
      );

      if (data.success) {
        setRequests(data.requests);
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
    fetchRequests();
  }, []);

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Account Requests
        </h2>
      </div>

      {/* View request */}
      {selectedRequest && (
        <OperatorRequestView
          request={selectedRequest}
          onClose={() => {
            setSelectedRequest(null);
            fetchRequests(currentPage);
          }}
        />
      )}

      {/* Search requests */}
      {!selectedRequest && (
        <div>
          <div className="flex gap-4 mx-10 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or NIC"
              className="w-full flex-3/4 border border-gray-300 rounded-xl px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <button
              onClick={() => fetchRequests(1)}
              className="w-full flex-1/4 bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full
              transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
            >
              Search
            </button>
          </div>

          {/* Table */}
          <div className="mx-10">
            <h3 className="text-gray-900 font-semibold mb-3 text-2xl">
              Request List
            </h3>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Requested By</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Reviewed By</th>
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

                  {!loading && requests.length === 0 && (
                    <tr>
                      <td
                        className="py-6 text-gray-700 text-lg text-center"
                        colSpan="5"
                      >
                        No requests found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    requests.map((request) => (
                      <tr
                        key={request.id}
                        className="font-medium text-gray-900"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold">{request.name}</div>
                          <div className="text-sm text-gray-600">
                            {request.email}
                          </div>
                          <div className="text-sm text-gray-600">
                            {request.nic}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {formatIssuedDate(request.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`${
                              request.status === 'APPROVED'
                                ? 'text-green-600'
                                : request.status === 'REJECTED'
                                  ? 'text-red-600'
                                  : 'text-gray-900'
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>

                        {/* Reviewed By */}
                        <td className="px-4 py-3 flex-col gap-2">
                          {request.reviewedBy ? (
                            <div>
                              <div>{formatIssuedDate(request.reviewedAt)}</div>
                              <div>
                                <div className="text-sm text-gray-600">
                                  {request.reviewedBy.name} (
                                  {request.reviewedBy.email})
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-600">Not Reviewed</span>
                          )}
                        </td>

                        <td className="px-4 py-3 flex-col gap-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="px-3 py-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                          >
                            {request.status === 'PENDING' ? 'Review' : 'View'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => fetchRequests(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => fetchRequests(currentPage + 1)}
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

export default ReviewAccountRequest;
