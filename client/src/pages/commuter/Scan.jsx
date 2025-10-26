import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { Html5Qrcode } from 'html5-qrcode';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Scan = () => {
  const { backendUrl } = useContext(AppContext);
  const qrRef = useRef(null);

  const [cameraDenied, setCameraDenied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanSuccess, setScanSuccess] = useState('');
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
          toast.error('Could not get your location');
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
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
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
    setScanSuccess('');
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
    try {
      let latitude = 0;
      let longitude = 0;

      try {
        const coords = await fetchLocation();
        latitude = coords.latitude;
        longitude = coords.longitude;
      } catch {
        toast.warning('Could not get location');
      }

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/ticket/scan-qr', {
        busId: text,
        latitude,
        longitude,
      });

      if (data.success) {
        setScanSuccess(`Boarding halt: ${data.ticket.boardingHalt}`);
        setScanError('');
        await stopScanner();
      } else {
        setScanError(data.message);
        setScanSuccess('');
        await stopScanner();
      }
    } catch {
      const message = 'Failed to process QR code';
      setScanError(message);
      setScanSuccess('');
      await stopScanner();
    } finally {
      setScanning(false);
    }
  };

  // Handle Rescan button
  const handleRescan = async () => {
    setScanError('');
    setScanSuccess('');
    setScanning(false);
    await stopScanner();
    await startScanner();
  };

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, [backendUrl]);

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="">
        <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />
      </div>
      <div className="mt-6 max-w-md mx-auto shadow rounded-xl p-6 border border-gray-200">
        <h2 className="text-gray-900 text-2xl font-medium">Scan</h2>

        {/* QR code scanner and placeholder*/}
        <div
          id="reader"
          className="aspect-square mt-10 mb-10 rounded-xl bg-gray-100 w-full flex items-center justify-center text-gray-700"
        ></div>

        {loading && (
          <p className="text-center text-gray-700 mb-2">Starting camera</p>
        )}
        {scanError && (
          <p className="text-center text-red-600 mb-2">{scanError}</p>
        )}
        {scanSuccess && (
          <p className="text-center text-green-600  mb-2">{scanSuccess}</p>
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
          className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full 
            transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
        >
          Rescan
        </button>
      </div>
    </div>
  );
};

export default Scan;
