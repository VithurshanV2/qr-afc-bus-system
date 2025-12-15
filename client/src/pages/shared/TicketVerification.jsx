import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { Html5Qrcode } from 'html5-qrcode';
import { BounceLoader } from 'react-spinners';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import TicketCard from '../commuter/components/TicketCard';
import { motion, AnimatePresence } from 'framer-motion';

const TicketVerification = () => {
  const { backendUrl } = useContext(AppContext);
  const qrRef = useRef(null);

  const [cameraDenied, setCameraDenied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scannedTicket, setScannedTicket] = useState(null);

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

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

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

  const handleScanSuccess = async (text) => {
    if (scanning) {
      return;
    }

    setScanning(true);

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/ticket/verify-ticket',
        { qrCode: text },
      );

      if (data.success && data.ticket) {
        setScannedTicket(data.ticket);
        setScanError('');
        toast.success('Ticket found');
        await stopScanner();
      } else {
        setScanError(data.message || 'Ticket not found');
        await stopScanner();
      }
    } catch (error) {
      setScanError(
        error.response?.data?.message || 'Failed to process QR Code',
      );
      await stopScanner();
      await stopScanner();
    } finally {
      setScanning(false);
    }
  };

  // Go back to scanner
  const handleBack = () => {
    setScannedTicket(null);
    setScanError('');
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Ticket Verification
        </h2>
      </div>

      {/* Scanner */}
      <div className="mt-4 w-full mx-auto max-w-md sm:max-w-lg lg:max-w-xl shadow rounded-xl p-6 border border-gray-200 mb-8 relative">
        <AnimatePresence mode="wait">
          {!scannedTicket ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div
                id="reader"
                className="w-full rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 aspect-[4/3]"
              ></div>

              {/* Rescan button */}
              <button
                onClick={handleRescan}
                disabled={loading || scanning}
                className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full mt-5
                transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
              >
                Rescan
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
            >
              {/* Back button */}
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-200 active:scale-95"
              >
                <ArrowLeft size={18} />
                <span className="text-sm text-gray-800">Back</span>
              </button>
              <TicketCard ticket={scannedTicket} />
            </motion.div>
          )}
        </AnimatePresence>

        {scanning && (
          <div className="absolute top-0 left-0 w-full h-full bg-white/70 flex flex-col items-center justify-center z-20 backdrop:blur-sm">
            <BounceLoader size={60} color="#FFB347" />
            <p className="mt-4 text-gray-700 font-medium text-center">
              Scanning ticket...
            </p>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default TicketVerification;
