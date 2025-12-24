import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { useEffect } from 'react';
import OperatorRequestView from './components/OperatorRequestView';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BounceLoader } from 'react-spinners';
import ConfirmModel from '../../components/ConfirmModal';

const RouteAssignment = () => {
  const { backendUrl, setGlobalLoading } = useContext(AppContext);

  const [search, setSearch] = useState('');
  const [operators, setOperators] = useState([]);
  const [isActive, setIsActive] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [modalOperator, setModalOperator] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);

  const limit = 10; // requests per page

  const totalPages = Math.ceil(total / limit);

  const fetchOperators = async (page = 1) => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const params = { search, page, limit };

      if (isActive !== '') {
        params.isActive = isActive === 'true';
      }

      const { data } = await axios.get(
        backendUrl + '/api/operator-assignment/list',
        { params },
      );

      if (data.success) {
        setOperators(data.operators);
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
    fetchOperators();
  }, [search, isActive]);

  // Activate operator account
  const activateOperator = async (operatorId) => {
    try {
      setGlobalLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/operator-assignment/activate/' + operatorId,
      );

      if (data.success) {
        toast.success(data.message);
        fetchOperators(currentPage);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  // Activate operator account
  const deactivateOperator = async (operatorId) => {
    try {
      setGlobalLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/operator-assignment/deactivate/' + operatorId,
      );

      if (data.success) {
        toast.success(data.message);
        fetchOperators(currentPage);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  // Confirm model for activate account
  const handleConfirmActivate = async (operatorId) => {
    await activateOperator(operatorId);
    setModalOperator(null);
    setModalType(null);
  };

  // Confirm model for deactivate account
  const handleConfirmDeactivate = async (operatorId) => {
    await deactivateOperator(operatorId);
    setModalOperator(null);
    setModalType(null);
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Route Assignment
        </h2>
      </div>

      {/* View request */}
      {showAssignForm && selectedOperator && (
        <OperatorRequestView
          operator={selectedOperator}
          onClose={() => {
            setShowAssignForm(false);
            fetchOperators(currentPage);
          }}
        />
      )}

      {/* Search requests */}
      {!selectedOperator && (
        <div>
          <div className="flex gap-4 mx-10 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full flex-3/4 border border-gray-300 rounded-xl px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            <button
              onClick={() => fetchOperators(1)}
              className="w-full flex-1/4 bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full
              transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
            >
              Search
            </button>
          </div>

          {/* Table */}
          <div className="mx-10">
            <h3 className="text-gray-900 font-semibold mb-3 text-2xl">
              Operator List
            </h3>

            <div className="border border-gray-200 rounded-xl overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Operator</th>
                    <th className="px-4 py-3 text-left">Buses</th>
                    <th className="px-4 py-3 text-left">Account Status</th>
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
                        No requests found
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    operators.map((operator) => (
                      <tr
                        key={operator.id}
                        className="font-medium text-gray-900"
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold">{operator.name}</div>
                          <div className="text-sm text-gray-600">
                            {operator.email}
                          </div>
                          <div className="text-sm text-gray-600">
                            {operator.nic}
                          </div>
                        </td>

                        {/* Bus list */}
                        <td className="px-4 py-3">
                          {operator.BusOperator?.Bus?.length > 0 ? (
                            operator.BusOperator.Bus.map((bus) => (
                              <div key={bus.id}>
                                - {bus.registrationNumber}
                                {bus.routeId && <span> (assigned)</span>}
                              </div>
                            ))
                          ) : (
                            <span>No buses</span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`${
                              operator.isActive
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {operator.isActive ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>

                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOperator(operator);
                              setShowAssignForm(true);
                            }}
                            className="px-4 py-1 rounded-full bg-yellow-100 hover:bg-yellow-200"
                          >
                            Assign Routes
                          </button>

                          {operator.isActive ? (
                            <button
                              onClick={() => {
                                setModalOperator(operator);
                                setModalType('deactivateAccount');
                              }}
                              className="px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setModalOperator(operator);
                                setModalType('activateAccount');
                              }}
                              className="px-3 py-1 rounded-full bg-green-500 hover:bg-green-600 text-white"
                            >
                              Activate
                            </button>
                          )}
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
        </div>
      )}

      {/* Confirm modal for activating account */}
      <ConfirmModel
        isOpen={modalType === 'activateAccount'}
        title="Activate Operator Account?"
        message={`Are you sure you want to activate ${modalOperator?.name}'s account?`}
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={() => handleConfirmActivate(modalOperator.id)}
        onCancel={() => {
          setModalType(null);
          setModalOperator(null);
        }}
      />

      {/* Confirm modal for deactivating account */}
      <ConfirmModel
        isOpen={modalType === 'deactivateAccount'}
        title="Deactivate Operator Account?"
        message={`Are you sure you want to deactivate ${modalOperator?.name}'s account?`}
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={() => handleConfirmDeactivate(modalOperator.id)}
        onCancel={() => {
          setModalType(null);
          setModalOperator(null);
        }}
      />
    </div>
  );
};

export default RouteAssignment;
