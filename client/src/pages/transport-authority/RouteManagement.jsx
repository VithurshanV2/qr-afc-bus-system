import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { BounceLoader } from 'react-spinners';
import { formatIssuedDate } from '../../utils/date';

const RouteManagement = () => {
  const { backendUrl } = useContext(AppContext);

  const [search, setSearch] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + '/api/route/list', {
        params: {
          search,
          page: 1,
          limit: 10,
        },
      });

      if (data.success) {
        setRoutes(data.routes);
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search routes by route number or name"
          className="w-full flex-2/3 border border-gray-300 rounded-xl px-4 py-2 
          focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
          onClick={fetchRoutes}
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
                      {route.name} (No.{route.number})
                    </td>

                    <td className="px-4 py-3">{route.busType}</td>

                    <td className="px-4 py-3">
                      {formatIssuedDate(route.updatedAt)}
                    </td>

                    <td className="px-4 py-3">{route.status}</td>

                    <td className="px-4 py-3 flex gap-2">
                      <button className="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300">
                        Edit
                      </button>

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
      </div>
    </div>
  );
};

export default RouteManagement;
