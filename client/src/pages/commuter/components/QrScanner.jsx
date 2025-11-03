import React, { useContext, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { AppContext } from '../../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { CommuterContext, SCAN_STEPS } from '../../../context/CommuterContext';

const QrScanner = () => {
  const { backendUrl } = useContext(AppContext);
  const { setScanStep, setBoardingHalt } = useContext(CommuterContext);
  const qrRef = useRef(null);

  const [cameraDenied, setCameraDenied] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingHalt, setFetchingHalt] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanning, setScanning] = useState(false);

  // Retrieve commuters current location via GPS
  const fetchLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error(`Geolocation not supported`);
        return reject('Geolocation not supported');
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    });
  };

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

  // Handle successful QR scan
  const handleScanSuccess = async (text) => {
    if (scanning) {
      return;
    }

    setScanning(true);
    setFetchingHalt(true);
    try {
      let latitude = 0;
      let longitude = 0;

      try {
        const coords = await fetchLocation();
        latitude = coords.latitude;
        longitude = coords.longitude;
        setLocationDenied(false);
      } catch {
        setLocationDenied(true);
        setFetchingHalt(false);
        await stopScanner();
        setScanning(false);
        return;
      }

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/ticket/scan-qr', {
        busId: text,
        latitude,
        longitude,
      });

      if (data.success) {
        setBoardingHalt(data.ticket.boardingHalt);
        setScanStep(SCAN_STEPS.DESTINATION);
        setScanError('');
        await stopScanner();
        setFetchingHalt(false);
      } else {
        setScanError(data.message || 'Failed to scan');
        await stopScanner();
        setFetchingHalt(false);
      }
    } catch {
      setScanError('Failed to process QR code');
      await stopScanner();
      setFetchingHalt(false);
    } finally {
      setScanning(false);
    }
  };

  // Handle Rescan button
  const handleRescan = async () => {
    setScanError('');
    setScanning(false);
    await stopScanner();
    await startScanner();
  };

  return (
    <motion.div
      key="scan"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-gray-900 text-2xl font-medium text-center">Scan</h2>

      {/* QR code scanner and placeholder*/}
      <div className="relative">
        <div
          id="reader"
          className="aspect-square mt-6 mb-10 rounded-xl bg-gray-100 w-full flex items-center justify-center text-gray-700"
        ></div>

        {fetchingHalt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-white/70 flex flex-col items-center justify-center z-20 backdrop:blur-sm"
          >
            <BounceLoader size={60} color="#FFB347" />
            <p className="mt-4 text-gray-700 font-medium text-center">
              Fetching boarding halt...
            </p>
          </motion.div>
        )}
      </div>

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
      {locationDenied && (
        <p className="text-center text-red-600 mb-2">
          Location access was denied. Please enable location permissions
        </p>
      )}

      {/* Rescan button */}
      <button
        onClick={handleRescan}
        disabled={loading || scanning}
        className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full 
            transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
      >
        Rescan
      </button>
    </motion.div>
  );
};

export default QrScanner;
