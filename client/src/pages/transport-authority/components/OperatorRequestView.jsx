import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import ConfirmModal from '../../../components/ConfirmModal';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const OperatorRequestView = ({ request, onClose }) => {
  const { backendUrl, setGlobalLoading } = useContext(AppContext);

  const FILE_BASE_URL = backendUrl + '/uploads';

  const [remarks, setRemarks] = useState(request.remarks || '');
  const [modalType, setModalType] = useState(null);

  const isReadOnly = request.status !== 'PENDING';

  const handleReject = async () => {
    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/operator-requests/reject',
        { requestId: request.id, remarks },
      );

      if (data.success) {
        toast.success('Request rejected successfully');
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/operator-requests/approve',
        { requestId: request.id, remarks },
      );

      if (data.success) {
        toast.success('Request approved successfully');
        onClose();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  // Confirm model for reject request
  const handleConfirmReject = () => {
    setModalType('rejectRequest');
  };

  // Confirm model for approve request
  const handleConfirmApprove = () => {
    setModalType('approveRequest');
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
                <h5 className="font-semibold text-lg text-gray-700 mb-2">
                  Bus {i + 1}
                </h5>

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
            <div className="mb-1">
              <a
                href={`${FILE_BASE_URL}/${request.uploadedDocs.permit}`}
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
                href={`${FILE_BASE_URL}/${request.uploadedDocs.insurance}`}
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
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              readOnly={isReadOnly}
              name="remarks"
              id="remarks"
              placeholder="Enter your remarks here..."
              className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          {!isReadOnly && (
            <>
              <button
                onClick={handleConfirmReject}
                className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 shadow-md text-white
            hover:shadow-red-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
              >
                Reject
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600 shadow-md text-white
            hover:shadow-green-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
              >
                Approve
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md 
            hover:shadow-gray-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Close
          </button>
        </div>
      </div>

      {/* Confirm modal for rejecting request */}
      <ConfirmModal
        isOpen={modalType === 'rejectRequest'}
        title="Reject Account Request?"
        message="Are you sure you want to reject this request?"
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={handleReject}
        onCancel={() => setModalType(null)}
      />

      {/* Confirm modal for approving request */}
      <ConfirmModal
        isOpen={modalType === 'approveRequest'}
        title="Approve Account Request?"
        message="Are you sure you want to approve this request?"
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={handleApprove}
        onCancel={() => setModalType(null)}
      />
    </div>
  );
};

export default OperatorRequestView;
