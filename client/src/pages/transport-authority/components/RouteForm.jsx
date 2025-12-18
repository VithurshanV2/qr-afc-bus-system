import React from 'react';
import { useState } from 'react';

export const RouteForm = ({ route = null }) => {
  const [number, setNumber] = useState(route?.number || '');
  const [name, setName] = useState(route?.name || '');
  const [busType, setBusType] = useState(route?.busType || '');

  return (
    <div className="mx-10 mb-10">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">
          {route ? 'Edit Route' : 'Add Route'}
        </h3>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 mb-6">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Route Details
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Route Number"
            className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Route Name"
            className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <select
            value={busType}
            onChange={(e) => setBusType(e.target.value)}
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
          </select>{' '}
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
            className="px-5 py-2 rounded-full bg-yellow-200 hover:bg-yellow-300 shadow-md 
            hover:shadow-yellow-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Direction A
          </button>
          <button
            className="px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md 
            hover:shadow-gray-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Direction B
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            <input
              placeholder="Halt Name"
              className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              placeholder="Latitude"
              className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              placeholder="Longitude"
              className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              placeholder="Fare"
              className="border border-gray-300 rounded-xl px-4 py-2 
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <button
              type="button"
              className="px-4 py-2 rounded-full bg-red-600  text-white shadow-md 
            hover:shadow-red-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
            >
              Remove
            </button>
          </div>

          <button
            type="button"
            className="px-4 py-2 rounded-full bg-green-600  text-white shadow-md 
          hover:shadow-green-800 hover:brightness-110 hover:scale-105 active:scale-100 transition-all duration-300 transform"
          >
            Add Halt
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-md 
            hover:shadow-gray-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
        >
          Cancel
        </button>
        <button
          className="px-6 py-2 rounded-full bg-yellow-200 hover:bg-yellow-300 shadow-md 
            hover:shadow-yellow-800 hover:scale-105 active:scale-100 transition-all duration-300 transform"
        >
          {route ? 'Update Route' : 'Create Route'}
        </button>
      </div>
    </div>
  );
};

export default RouteForm;
