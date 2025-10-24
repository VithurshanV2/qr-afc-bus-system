import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { Html5Qrcode } from 'html5-qrcode';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const Scan = () => {
  const { backendUrl } = useContext(AppContext);
  const [cameraReady, setCameraReady] = useState(false);
  const [setScannedCode] = useState('');

  useEffect(() => {
    const initScanner = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();

        if (!devices.length) {
          toast.error('No camera found');
          return;
        }

        const cameraId = devices[0].id;
        const qr = new Html5Qrcode('reader');
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        const onScanSuccess = (text) => {
          setScannedCode(text);
          qr.stop();
          toast.success('QR code detected');
        };

        await qr.start(
          { deviceId: { exact: cameraId } },
          config,
          onScanSuccess,
        );
        setCameraReady(true);

        return () => {
          qr.stop().catch(() => {});
        };
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    };

    initScanner();
  }, [backendUrl]);

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="">
        <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />
      </div>
      <div className="mt-6 max-w-md mx-auto shadow rounded-xl p-6 border border-gray-200">
        <h2 className="text-gray-900 text-2xl font-medium">Scan</h2>

        {/* QR code reader */}
        <div className="w-full rounded-xl mt-10 mb-10" />
        <div
          id="reader"
          className="aspect-square rounded-xl bg-gray-100 w-full flex items-center justify-center text-gray-700"
        >
          {!cameraReady && <span>loading...</span>}
        </div>
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
