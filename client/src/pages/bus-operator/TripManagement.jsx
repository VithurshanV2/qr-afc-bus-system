import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import QRCode from 'react-qr-code';
import QrCodeDownload from '../../components/QrCodeDownload';
import ConfirmModel from '../../components/ConfirmModal';

const TripManagement = () => {
  const { backendUrl, setGlobalLoading, globalLoading } =
    useContext(AppContext);

  const [buses, setBuses] = useState([]);
  const [directions, setDirections] = useState({});
  const [selectedBus, setSelectedBus] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchBuses = async () => {
    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.get(backendUrl + '/api/trip/operator-buses');

      if (data.success) {
        setBuses(data.buses);
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
    fetchBuses();
  }, []);

  const startTrip = async (busId) => {
    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/trip/start', {
        busId,
        direction: directions[busId],
      });

      if (data.success) {
        toast.success('Trip started');
        fetchBuses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  const endTrip = async (busId) => {
    try {
      setGlobalLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/trip/end', {
        busId,
      });

      if (data.success) {
        toast.success('Trip ended');
        fetchBuses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleConfirmStartTrip = async () => {
    await startTrip(selectedBus.id);
    setSelectedBus(null);
    setModalType(null);
  };

  const handleConfirmEndTrip = async () => {
    await endTrip(selectedBus.id);
    setSelectedBus(null);
    setModalType(null);
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          TripManagement
        </h2>
      </div>

      {!globalLoading && buses.length === 0 && (
        <div className="text-center text-gray-700">No buses found</div>
      )}

      <div className="mx-10 flex flex-col gap-6">
        {buses.map((bus) => {
          const activeTrip = bus.Trip?.[0];

          return (
            <div
              key={bus.id}
              className="border border-gray-200 rounded-xl p-5 flex flex-col"
            >
              <h3 className="text-2xl font-semibold text-gray-900">
                {bus.registrationNumber}
              </h3>

              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex flex-col md:flex-row flex-1 items-start md:items-center gap-6">
                  <div>
                    <div className="font-medium text-gray-900">
                      {bus.route?.name} ({bus.route?.number})
                    </div>
                    <div className="text-sm text-gray-700">
                      {bus.route?.busType}
                    </div>
                  </div>

                  <div>
                    <span className="font-medium">Status:</span>{' '}
                    {activeTrip ? (
                      <span className="text-green-600 font-semibold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        INACTIVE
                      </span>
                    )}
                  </div>

                  {!activeTrip && (
                    <select
                      value={directions[bus.id] || ''}
                      onChange={(e) =>
                        setDirections({
                          ...directions,
                          [bus.id]: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-md px-3 py-1"
                    >
                      <option value="">Select direction</option>
                      <option value="DIRECTIONA">
                        {bus.route?.haltsA?.directionName}
                      </option>
                      <option value="DIRECTIONB">
                        {bus.route?.haltsB?.directionName}
                      </option>
                    </select>
                  )}

                  {/* Actions */}
                  <div>
                    {!activeTrip && (
                      <button
                        onClick={() => {
                          setSelectedBus(bus);
                          setModalType('startTrip');
                        }}
                        className="px-4 py-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white 
                    transition-all duration-200 transform active:scale-95 active:shadow-lg"
                      >
                        Start Trip
                      </button>
                    )}

                    {activeTrip && (
                      <button
                        onClick={() => {
                          setSelectedBus(bus);
                          setModalType('endTrip');
                        }}
                        className="px-4 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white
                    transition-all duration-200 transform active:scale-95 active:shadow-lg"
                      >
                        End Trip
                      </button>
                    )}
                  </div>
                </div>

                <div className="hidden lg:block w-px bg-gray-300 self-stretch" />

                <div className="flex flex-col items-center lg:justify-end">
                  <QRCode value={bus.qrCode || ''} size={150} />
                  <QrCodeDownload
                    value={bus.qrCode}
                    fileName={`${bus.registrationNumber}_qr.png`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start trip model */}
      <ConfirmModel
        isOpen={modalType === 'startTrip'}
        title="Start Trip?"
        message={`Are you sure you want to start the trip for bus ${selectedBus?.registrationNumber}?`}
        confirmText="Start"
        cancelText="Cancel"
        onConfirm={handleConfirmStartTrip}
        onCancel={() => {
          setModalType(null);
          setSelectedBus(null);
        }}
      />

      {/* End trip model */}
      <ConfirmModel
        isOpen={modalType === 'endTrip'}
        title="End Trip?"
        message={`Are you sure you want to end the trip for bus ${selectedBus?.registrationNumber}?`}
        confirmText="End"
        cancelText="Cancel"
        onConfirm={handleConfirmEndTrip}
        onCancel={() => {
          setModalType(null);
          setSelectedBus(null);
        }}
      />
    </div>
  );
};

export default TripManagement;
