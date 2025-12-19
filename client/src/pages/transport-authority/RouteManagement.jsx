import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { BounceLoader } from 'react-spinners';
import { formatIssuedDate } from '../../utils/date';
import RouteForm from './components/RouteForm';

const RouteManagement = () => {
  const { backendUrl } = useContext(AppContext);

  const [search, setSearch] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [createRoute, setCreateRoute] = useState(false);

  const limit = 10; // routes per page

  const totalPages = Math.ceil(total / limit);

  const fetchRoutes = async (page = 1) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + '/api/route/list', {
        params: { search, page, limit },
      });

      if (data.success) {
        setRoutes(data.routes);
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
    fetchRoutes();
  }, []);

  const closeForm = () => {
    setSelectedRoute(null);
    setCreateRoute(false);
    fetchRoutes(currentPage);
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          RouteManagement
        </h2>
      </div>

      {/* Render route form */}
      {(createRoute || selectedRoute) && (
        <div>
          <RouteForm route={selectedRoute || null} onClose={closeForm} />
        </div>
      )}

      {/* Search routes */}
      {!createRoute && !selectedRoute && (
        <div>
          <div className="flex gap-4 mx-10 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search routes by route number or name"
              className="w-full flex-3/4 border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <button
              onClick={() => fetchRoutes(1)}
              className="w-full flex-1/4 bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full
          transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
            >
              Search
            </button>
          </div>

          {/* Route list */}
          <div className="mx-10">
            <div className="flex justify-between">
              <h3 className="text-gray-900 font-semibold mb-3 text-2xl">
                Route List
              </h3>

              <button
                onClick={() => setCreateRoute(true)}
                className=" bg-yellow-200 text-yellow-800 px-5 py-2 mb-3 rounded-full
            transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
              >
                Add Route
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Route</th>
                    <th className="px-4 py-3 text-left">Bus Type</th>
                    <th className="px-4 py-3 text-left">Last Updated</th>
                    <th className="px-4 py-3 text-left">Status</th>
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

                  {!loading && routes.length === 0 && (
                    <tr>
                      <td
                        className="py-6 text-gray-700 text-lg text-center"
                        colSpan="5"
                      >
                        No routes found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    routes.map((route) => (
                      <tr key={route.id} className="font-medium text-gray-900">
                        <td className="px-4 py-3">
                          {route.name} ({route.number})
                        </td>

                        <td className="px-4 py-3">{route.busType}</td>

                        <td className="px-4 py-3">
                          {formatIssuedDate(route.updatedAt)}
                        </td>

                        <td className="px-4 py-3">{route.status}</td>

                        <td className="px-4 py-3 flex gap-2">
                          {(route.status === 'DRAFT' ||
                            route.status === 'DEACTIVATED') && (
                            <button
                              onClick={() => setSelectedRoute(route)}
                              className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
                            >
                              Edit
                            </button>
                          )}

                          {route.status === 'DRAFT' && (
                            <button className="px-3 py-1 rounded-full bg-green-500 hover:bg-green-600 text-white">
                              Activate
                            </button>
                          )}

                          {route.status === 'ACTIVE' && (
                            <button className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white">
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => fetchRoutes(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => fetchRoutes(currentPage + 1)}
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

export default RouteManagement;
