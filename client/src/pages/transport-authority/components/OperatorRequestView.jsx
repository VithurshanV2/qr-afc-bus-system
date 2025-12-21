import React from 'react';

const OperatorRequestView = ({ request }) => {
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
          {infoRow('Name', request.name)}
          {infoRow('Email', request.email)}
          {infoRow('Phone Number', request.number)}
          {infoRow('NIC', request.nic)}
          {infoRow('Address', request.address)}
        </div>

        {/* Buses */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Buses</h4>
          {request.buses &&
            request.buses.map((bus, i) => (
              <div
                key={i}
                className="border border-gray-300 rounded-xl p-4 mb-4"
              >
                {infoRow('Registration Number', bus.registrationNumber)}
                {infoRow('Route Name', bus.routeName)}
                {infoRow('Route Number', bus.routeNumber)}
                {infoRow('Bus Type', bus.busType)}
              </div>
            ))}
        </div>

        {/* Documents */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Documents</h4>
          {request.uploadedDocs?.permit && (
            <div>
              <a
                href={request.uploadedDocs?.permit}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download Permit
              </a>
            </div>
          )}
          {request.uploadedDocs?.insurance && (
            <div>
              <a
                href={request.uploadedDocs?.insurance}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download Insurance
              </a>
            </div>
          )}
        </div>

        {/* Remarks */}
        <div className="border border-gray-200 rounded-xl p-6 mb-6">
          <h4 className="text-xl font-semibold mb-4">Remarks</h4>

          <div>
            <textarea name="" id="" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 shadow-md text-white
            hover:shadow-red-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Reject
          </button>
          <button
            className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 shadow-md text-white
            hover:shadow-green-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Approve
          </button>
          <button
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

export default OperatorRequestView;
