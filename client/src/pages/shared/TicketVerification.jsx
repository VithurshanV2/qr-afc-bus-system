import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { Html5Qrcode } from 'html5-qrcode';
import { BounceLoader } from 'react-spinners';

const TicketVerification = () => {
  const { _backendUrl } = useContext(AppContext);
  const qrRef = useRef(null);

  const [cameraDenied, setCameraDenied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  // Stop and clear QR scanner
  const stopScanner = async () => {
    if (qrRef.current) {
      try {
        await qrRef.current.stop();
        qrRef.current.clear();
        qrRef.current = null;
      } catch {
        toast.error('Could not stop scanner');
      }
    }
  };

  // Start QR scanner
  const startScanner = async () => {
    if (scanning || loading) {
      return;
    }

    setLoading(true);
    setCameraDenied(false);
    setScanError('');

    try {
      const devices = await Html5Qrcode.getCameras();

      if (!devices.length) {
        toast.error('No camera found');
        setLoading(false);
        return;
      }

      const cameraId = devices[0].id;
      qrRef.current = new Html5Qrcode('reader');

      const config = { fps: 10, qrbox: { width: 300, height: 150 } };

      await qrRef.current.start(
        { deviceId: { exact: cameraId } },
        config,
        handleScanSuccess,
      );
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setCameraDenied(true);
      } else {
        setScanError(error.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Rescan button
  const handleRescan = async () => {
    setScanError('');
    setScanning(false);
    await stopScanner();
    await startScanner();
  };

  const handleScanSuccess = async () => {};

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Ticket Verification
        </h2>
      </div>

      <div>
        {/* Scanner */}
        <div className="mt-4 w-full mx-auto max-w-md sm:max-w-lg lg:max-w-xl shadow rounded-xl p-6 border border-gray-200 mb-8">
          <div className="relative">
            <div
              id="reader"
              className="w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 aspect-[4/3]"
            ></div>

            {(loading || scanning) && (
              <div className="absolute top-0 left-0 w-full h-full bg-white/70 flex flex-col items-center justify-center z-20 backdrop:blur-sm">
                <BounceLoader size={60} color="#FFB347" />
                <p className="mt-4 text-gray-700 font-medium text-center">
                  Scanning ticket...
                </p>
              </div>
            )}
          </div>

          {/* Errors */}
          {loading && (
            <p className="text-center text-gray-700 mb-2">Starting camera</p>
          )}
          {scanError && (
            <p className="text-center text-red-600 mb-2">{scanError}</p>
          )}
          {cameraDenied && (
            <p className="text-center text-red-600  mb-2">
              Camera access was denied. Please enable camera permissions
            </p>
          )}

          {/* Rescan button */}
          <button
            onClick={handleRescan}
            disabled={loading || scanning}
            className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full mt-5
            transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
          >
            Rescan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketVerification;
