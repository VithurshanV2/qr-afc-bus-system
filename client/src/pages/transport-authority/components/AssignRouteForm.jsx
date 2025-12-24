import React from 'react';
import { AppContext } from '../../../context/AppContext';
import ConfirmModal from '../../../components/ConfirmModal';

const AssignRouteForm = ({ operator, onClose }) => {
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
            operator.BusOperator.Bus.map((bus, i) => (
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
              </div>
            ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md 
            hover:shadow-gray-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignRouteForm;
