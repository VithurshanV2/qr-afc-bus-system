import React, { useContext } from 'react';
import { useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import ConfirmModal from '../../../components/ConfirmModal';

const createEmptyHalt = (id) => ({
  id: id,
  englishName: '',
  latitude: '',
  longitude: '',
  fare: '',
});

export const RouteForm = ({ route = null, onClose, viewMode = false }) => {
  const { backendUrl, globalLoading, setGlobalLoading } =
    useContext(AppContext);

  const [modalType, setModalType] = useState(null);
  const [number, setNumber] = useState(route?.number || '');
  const [name, setName] = useState(route?.name || '');
  const [busType, setBusType] = useState(route?.busType || '');
  const [haltsA, setHaltsA] = useState(
    route?.haltsA?.halts.map((halt) => ({
      ...halt,
      fare: halt.fare !== null ? (halt.fare / 100).toFixed(2) : '',
    })) || [createEmptyHalt(0), createEmptyHalt(1)],
  );
  const [haltsB, setHaltsB] = useState(
    route?.haltsB?.halts.map((halt) => ({
      ...halt,
      fare: halt.fare !== null ? (halt.fare / 100).toFixed(2) : '',
    })) || [createEmptyHalt(0), createEmptyHalt(1)],
  );
  const [activeDirection, setActiveDirection] = useState('A');
  const [directionAName, setDirectionAName] = useState(
    route?.haltsA?.directionName || '',
  );
  const [directionBName, setDirectionBName] = useState(
    route?.haltsB?.directionName || '',
  );
  const [errors, setErrors] = useState({ number: '', name: '', busType: '' });

  const getCurrentHalts = () => {
    return activeDirection === 'A' ? haltsA : haltsB;
  };

  const setCurrentHalts = (halts) => {
    if (activeDirection === 'A') {
      setHaltsA(halts);
    } else {
      setHaltsB(halts);
    }
  };

  const updateHaltField = (index, field, value) => {
    const halts = getCurrentHalts();
    const updatedHalts = [];

    for (let i = 0; i < halts.length; i++) {
      if (i === index) {
        const updatedHalt = {
          id: halts[i].id,
          englishName: halts[i].englishName,
          latitude: halts[i].latitude,
          longitude: halts[i].longitude,
          fare: halts[i].fare,
        };

        if (field === 'englishName') updatedHalt.englishName = value;
        if (field === 'latitude') updatedHalt.latitude = value;
        if (field === 'longitude') updatedHalt.longitude = value;
        if (field === 'fare') updatedHalt.fare = value;

        updatedHalts.push(updatedHalt);
      } else {
        updatedHalts.push(halts[i]);
      }
    }
    setCurrentHalts(updatedHalts);
  };

  const removeHalt = (index) => {
    const halts = getCurrentHalts();

    if (halts.length <= 2) {
      return;
    }

    const updatedHalts = [];

    for (let i = 0; i < halts.length; i++) {
      if (i !== index) {
        const halt = {
          id: updatedHalts.length,
          englishName: halts[i].englishName,
          latitude: halts[i].latitude,
          longitude: halts[i].longitude,
          fare: halts[i].fare,
        };
        updatedHalts.push(halt);
      }
    }
    setCurrentHalts(updatedHalts);
  };

  const addHalt = () => {
    const halts = getCurrentHalts();
    const newHalt = {
      id: halts.length,
      englishName: '',
      latitude: '',
      longitude: '',
      fare: '',
    };

    const updatedHalts = [];

    for (let i = 0; i < halts.length; i++) {
      updatedHalts.push(halts[i]);
    }
    updatedHalts.push(newHalt);

    setCurrentHalts(updatedHalts);
  };

  const buildPayload = () => {
    const convertHalts = (halts) => {
      return halts.map((halt) => ({
        id: halt.id,
        englishName: halt.englishName,
        latitude: halt.latitude === '' ? null : parseFloat(halt.latitude),
        longitude: halt.longitude === '' ? null : parseFloat(halt.longitude),
        fare: halt.fare === '' ? null : Math.round(Number(halt.fare) * 100),
      }));
    };

    return {
      number: number,
      name: name,
      busType: busType,
      haltsA: {
        routeNumber: number,
        directionName: directionAName,
        halts: convertHalts(haltsA),
      },
      haltsB: {
        routeNumber: number,
        directionName: directionBName,
        halts: convertHalts(haltsB),
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = { number: '', name: '', busType: '' };

    let hasError = false;

    if (!number) {
      newErrors.number = 'Route number is required';
      hasError = true;
    }

    if (!name) {
      newErrors.name = 'Route name is required';
      hasError = true;
    }

    if (!busType) {
      newErrors.busType = 'Bus type is required';
      hasError = true;
    }

    if (!directionAName || !directionBName) {
      newErrors.directionName = 'Both direction names are required';
      hasError = true;
    }

    const allHalts = [...haltsA, ...haltsB];

    for (let i = 0; i < allHalts.length; i++) {
      const halt = allHalts[i];

      if (halt.latitude && isNaN(Number(halt.latitude))) {
        newErrors.halts = 'Latitude must be a number';
        hasError = true;
        break;
      }

      if (halt.longitude && isNaN(Number(halt.longitude))) {
        newErrors.halts = 'Longitude must be a number';
        hasError = true;
        break;
      }

      if (halt.fare && isNaN(Number(halt.fare))) {
        newErrors.halts = 'Fare must be a number';
        hasError = true;
        break;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setGlobalLoading(true);

      const payload = buildPayload();

      axios.defaults.withCredentials = true;

      let response;

      if (route) {
        response = await axios.put(
          backendUrl + '/api/route/update-route/' + route.id,
          payload,
        );
      } else {
        response = await axios.post(
          backendUrl + '/api/route/create-route',
          payload,
        );
      }

      const { data } = response;

      if (data.success) {
        toast.success(
          route ? 'Route updated successfully' : 'Route created successfully',
        );

        if (onClose) {
          onClose();
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setGlobalLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  // Open cancel modal
  const handleConfirmCancel = () => {
    setModalType('cancelRoute');
  };

  // Flip halts data to the other direction
  const flipDirection = () => {
    const sourceHalts = activeDirection === 'A' ? haltsA : haltsB;

    const newHalts = [];
    const sourceLength = sourceHalts.length;

    for (let i = 0; i < sourceLength; i++) {
      const sourceIndex = sourceLength - 1 - i;
      const halt = {
        id: i,
        englishName: sourceHalts[sourceIndex].englishName,
        latitude: sourceHalts[sourceIndex].latitude,
        longitude: sourceHalts[sourceIndex].longitude,
        fare: sourceHalts[i].fare,
      };
      newHalts.push(halt);
    }

    if (activeDirection === 'A') {
      setHaltsB(newHalts);
    } else {
      setHaltsA(newHalts);
    }

    toast.success('Direction flipped successfully');
    setModalType(null);
  };

  // Open direction flip modal
  const handleConfirmFlipDirection = () => {
    setModalType('flipDirection');
  };

  return (
    <div className="mx-10 mb-10">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          {viewMode ? 'View Route' : route ? 'Edit Route' : 'Add Route'}
        </h3>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 mb-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Route Details
        </h4>

        <div className="mb-2 text-gray-700 text-sm">
          Route name format: Kandy - Dambulla
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Route Number"
              readOnly={viewMode}
              className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            {errors.number && (
              <p className="text-red-600 text-sm ml-5">{errors.number}</p>
            )}
          </div>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Route Name"
              readOnly={viewMode}
              className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
            {errors.name && (
              <p className="text-red-600 text-sm ml-5">{errors.name}</p>
            )}
          </div>
          <div>
            <select
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
              disabled={viewMode}
              className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="" disabled>
                Select Bus Type
              </option>
              <option value="NORMAL">Normal</option>
              <option value="SEMILUXURY">Semi-Luxury</option>
              <option value="LUXURY">Luxury</option>
              <option value="SUPERLUXURY">Super-Luxury</option>
            </select>
            {errors.busType && (
              <p className="text-red-600 text-sm ml-5">{errors.busType}</p>
            )}
          </div>
        </div>
      </div>

      {/* Halts section */}
      <div className="border border-gray-200 rounded-xl p-6 mb-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Halt Details
        </h4>

        {/* Direction toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveDirection('A')}
            className={`px-5 py-2 rounded-full  shadow-md 
            hover:shadow-yellow-800 hover:scale-105 active:scale-100 transition-all duration-300 transform ${
              activeDirection === 'A'
                ? 'bg-yellow-200 hover:bg-yellow-300 hover:shadow-yellow-800'
                : 'bg-gray-200 hover:bg-gray-300 hover:shadow-gray-800'
            }`}
          >
            Direction A
          </button>
          <button
            onClick={() => setActiveDirection('B')}
            className={`px-5 py-2 rounded-full  shadow-md 
            hover:shadow-yellow-800 hover:scale-105 active:scale-100 transition-all duration-300 transform ${
              activeDirection === 'B'
                ? 'bg-yellow-200 hover:bg-yellow-300 hover:shadow-yellow-800'
                : 'bg-gray-200 hover:bg-gray-300 hover:shadow-gray-800'
            }`}
          >
            Direction B
          </button>

          {!viewMode && (
            <button
              type="button"
              onClick={handleConfirmFlipDirection}
              className="px-5 py-2 rounded-full  shadow-md bg-blue-200 hover:bg-blue-300 hover:shadow-blue-800
            hover:scale-105 active:scale-100 transition-all duration-300 transform"
            >
              Flip Direction Data
            </button>
          )}
        </div>

        <div className="mb-4">
          <input
            value={activeDirection === 'A' ? directionAName : directionBName}
            onChange={(e) =>
              activeDirection === 'A'
                ? setDirectionAName(e.target.value)
                : setDirectionBName(e.target.value)
            }
            readOnly={viewMode}
            placeholder="Direction Name (Origin - Destination)"
            className="border border-gray-300 rounded-xl px-4 py-2 w-2/3
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {errors.directionName && (
            <p className="text-red-600 text-sm ml-5">{errors.directionName}</p>
          )}
        </div>

        <div className="space-y-4">
          {errors.halts && (
            <p className="text-red-600 text-sm ml-5">{errors.halts}</p>
          )}
          {getCurrentHalts().map((halt, id) => (
            <div
              key={`${activeDirection}-${halt.id}`}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center"
            >
              <input
                value={halt.englishName}
                onChange={(e) =>
                  updateHaltField(id, 'englishName', e.target.value)
                }
                readOnly={viewMode}
                placeholder="Halt Name"
                className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <input
                value={halt.latitude}
                onChange={(e) =>
                  updateHaltField(id, 'latitude', e.target.value)
                }
                readOnly={viewMode}
                placeholder="Latitude"
                className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <input
                value={halt.longitude}
                onChange={(e) =>
                  updateHaltField(id, 'longitude', e.target.value)
                }
                readOnly={viewMode}
                placeholder="Longitude"
                className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <input
                value={halt.fare}
                onChange={(e) => updateHaltField(id, 'fare', e.target.value)}
                placeholder="Fare"
                readOnly={viewMode}
                inputMode="decimal"
                className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              {getCurrentHalts().length > 2 && !viewMode && (
                <button
                  onClick={() => removeHalt(id)}
                  type="button"
                  className="px-4 py-2 rounded-full bg-red-600  text-white shadow-md 
            hover:shadow-red-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {!viewMode && (
            <button
              onClick={() => addHalt()}
              type="button"
              className="px-4 py-2 rounded-full bg-green-600  text-white shadow-md 
          hover:shadow-green-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
            >
              Add Halt
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        {!viewMode && (
          <button
            onClick={handleConfirmCancel}
            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md 
            hover:shadow-gray-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Cancel
          </button>
        )}
        {!viewMode && (
          <button
            onClick={handleSubmit}
            disabled={globalLoading}
            className="px-6 py-2 rounded-full bg-yellow-200 hover:bg-yellow-300 shadow-md 
            hover:shadow-yellow-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            {route ? 'Update Route' : 'Create Route'}
          </button>
        )}
        {viewMode && (
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md 
            hover:shadow-gray-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Close
          </button>
        )}
      </div>

      {/* Confirm modal for cancel ticket */}
      <ConfirmModal
        isOpen={modalType === 'cancelRoute'}
        title="Discard changes?"
        message="All unsaved changes will be lost"
        confirmText="Discard"
        cancelText="Continue Editing"
        onConfirm={() => {
          setModalType(null);
          handleCancel();
        }}
        onCancel={() => setModalType(null)}
      />

      {/* Confirm modal for flip direction data */}
      <ConfirmModal
        isOpen={modalType === 'flipDirection'}
        title="Flip Direction Data?"
        message="All data in the target direction will be removed and replaced with flipped data. Are you sure?"
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={flipDirection}
        onCancel={() => setModalType(null)}
      />
    </div>
  );
};

export default RouteForm;
