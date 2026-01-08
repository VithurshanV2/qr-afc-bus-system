import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import ConfirmModal from '../../../components/ConfirmModal';
import { toast } from 'react-toastify';
import axios from 'axios';

const AssignRouteForm = ({ operator, onClose }) => {
  const { backendUrl, setGlobalLoading } = useContext(AppContext);

  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState(
    (operator.BusOperator.Bus || []).map((bus) => ({
      ...bus,
      routeId: bus.route?.id || null,
    })),
  );
  const [originalBuses] = useState(
    (operator.BusOperator.Bus || []).map((bus) => bus.route?.id || null),
  );
  const [modalType, setModalType] = useState(null);

  const hasChanges = buses.some((bus, i) => bus.routeId !== originalBuses[i]);

  const fetchRouteList = async () => {
    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.get(
        backendUrl + '/api/operator-assignment/assignable-routes',
      );

      if (data.success) {
        toast.success(data.message);
        setRoutes(data.routes);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteList();
  }, []);

  const handleRouteChange = (busId, routeId) => {
    setBuses((prev) =>
      prev.map((bus) =>
        bus.id === busId ? { ...bus, routeId: Number(routeId) } : bus,
      ),
    );
  };

  const handleSaveAssignment = async () => {
    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      for (let i = 0; i < buses.length; i++) {
        const bus = buses[i];

        // Skip if no route is selected
        if (!bus.routeId) {
          continue;
        }

        // Skip if route hasn't changed
        if (bus.routeId === originalBuses[i]) {
          continue;
        }

        let url = '';

        if (originalBuses[i] !== null) {
          url = backendUrl + '/api/operator-assignment/reassign-route';
        } else {
          url = backendUrl + '/api/operator-assignment/assign-route';
        }

        const { data } = await axios.post(url, {
          busId: bus.id,
          routeId: bus.routeId,
        });

        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  const infoRow = (label, value) => (
    <div className="flex gap-4 mb-2">
      <span className="font-semibold text-gray-700 w-48">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="mx-10 mb-10">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Bus Operator Request Review
        </h3>

        {/* Basic info */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Operator Details</h4>
          {infoRow('Name', operator.name)}
          {infoRow('Email', operator.email)}
          {infoRow('Phone Number', operator.number)}
          {infoRow('NIC', operator.BusOperator.nic)}
          {infoRow('Address', operator.BusOperator.address)}
        </div>

        {/* Buses */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Buses</h4>
          {operator.BusOperator.Bus &&
            buses.map((bus, i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-xl p-4 mb-4"
              >
                <h5 className="font-semibold text-lg text-gray-700 mb-2">
                  Bus {i + 1}
                </h5>

                {infoRow('Registration Number', bus.registrationNumber)}
                {infoRow(
                  'Requested Route',
                  `${bus.requestedRouteName} (${bus.requestedRouteNumber}) - ${bus.requestedBusType}`,
                )}
                {infoRow(
                  'Assigned Route',
                  bus.route
                    ? `${bus.route.name} (${bus.route.number}) - ${bus.route.busType}`
                    : 'Not assigned',
                )}

                <div>
                  <label className="font-semibold text-gray-700">
                    Assign Route:
                  </label>
                  <select
                    className="ml-2 border border-gray-300 rounded p-1"
                    value={bus.routeId || ''}
                    onChange={(e) => handleRouteChange(bus.id, e.target.value)}
                  >
                    <option value="">Select Route</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.name} ({route.number}) - {route.busType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md 
            hover:shadow-gray-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Close
          </button>
          <button
            onClick={() => setModalType('saveAssignment')}
            disabled={!hasChanges}
            className={`bg-yellow-200 text-yellow-800 px-5 py-2 rounded-full
            transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg
            ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            Save Assignments
          </button>
        </div>
      </div>

      {/* Confirm modal for saving changes */}
      <ConfirmModal
        isOpen={modalType === 'saveAssignment'}
        title="Confirm Route Assignments?"
        message="Are you sure you want to save all route assignments?"
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={() => {
          handleSaveAssignment();
          setModalType(null);
          onClose();
        }}
        onCancel={() => setModalType(null)}
      />
    </div>
  );
};

export default AssignRouteForm;
