import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { Html5Qrcode } from 'html5-qrcode';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { BounceLoader } from 'react-spinners';
import axios from 'axios';

const Scan = () => {
  const { backendUrl } = useContext(AppContext);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [loading, setLoading] = useState(false);
  const qrRef = useRef(null);

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

  const stopScanner = async () => {
    const readerEl = document.getElementById('reader');

    if (qrRef.current && readerEl) {
      try {
        await qrRef.current.stop();
        qrRef.current.clear();
        qrRef.current = null;
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    } else {
      toast.error('Something went wrong');
    }
  };

  const startScanner = async () => {
    setLoading(true);
    setCameraDenied(false);

    await stopScanner();

    try {
      const devices = await Html5Qrcode.getCameras();

      if (!devices.length) {
        toast.error('No camera found');
        setLoading(false);
        return;
      }

      const cameraId = devices[0].id;
      const html5QrCode = new Html5Qrcode('reader');
      qrRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      const onScanSuccess = async (text) => {
        await stopScanner();

        let latitude = 0;
        let longitude = 0;

        try {
          const coords = await fetchLocation();
          latitude = coords.latitude;
          longitude = coords.longitude;
        } catch {
          toast.warning('Could not get location');
        }

        try {
          axios.defaults.withCredentials = true;

          const { data } = await axios.post(
            backendUrl + '/api/ticket/scan-qr',
            {
              busId: text,
              latitude,
              longitude,
            },
          );

          if (data.success) {
            toast.success(`Boarding halt: ${data.ticket.boardingHalt}`);
          } else {
            toast.error(data.message);
          }
        } catch {
          toast.error('Failed to process QR code');
        }
      };

      await html5QrCode.start(
        { deviceId: { exact: cameraId } },
        config,
        onScanSuccess,
      );
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setCameraDenied(true);
        toast.error('Camera access was denied');
      } else {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
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
          <div className="flex flex-col items-center justify-center gap-3">
            <BounceLoader size={50} color="#FFB347" />
            <span className="text-sm text-gray-700">Starting camera...</span>
          </div>
        )}
        {!loading && cameraDenied && (
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="text-gray-700">Camera access was denied</span>
            <button
              onClick={startScanner}
              className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full 
              transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
            >
              Retry Access
            </button>
          </div>
        )}

        {/* Scan button */}
        <button
          className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full 
        transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
        >
          Scan
        </button>
      </div>
    </div>
  );
};

export default Scan;
