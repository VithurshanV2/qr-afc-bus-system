import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { Html5Qrcode } from 'html5-qrcode';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { BounceLoader } from 'react-spinners';

const Scan = () => {
  const { backendUrl } = useContext(AppContext);
  const [setCameraReady] = useState(false);
  const [cameraDenied, setCameraDenied] = useState(false);
  const [setScannedCode] = useState('');
  const [qr, setQr] = useState(null);
  const [loading, setLoading] = useState(false);

  const startScanner = async () => {
    setLoading(true);
    setCameraDenied(false);

    try {
      if (qr) {
        await qr.stop().catch(() => {});
      }

      const devices = await Html5Qrcode.getCameras();

      if (!devices.length) {
        toast.error('No camera found');
        setLoading(false);
        return;
      }

      const cameraId = devices[0].id;
      const html5QrCode = new Html5Qrcode('reader');
      setQr(html5QrCode);

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      const onScanSuccess = (text) => {
        setScannedCode(text);
        html5QrCode.stop();
        toast.success('QR code detected');
      };

      await html5QrCode.start(
        { deviceId: { exact: cameraId } },
        config,
        onScanSuccess,
      );

      setCameraReady(true);
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
      if (qr) {
        qr.stop().catch(() => {});
      }
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
        >
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
        </div>

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
