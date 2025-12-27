import React from 'react';
import { toast } from 'react-toastify';
import QRCode from 'qrcode';

const QrCodeDownload = ({ value, fileName }) => {
  const handleDownload = async () => {
    try {
      if (!value) {
        return;
      }

      const dataUrl = await QRCode.toDataURL(value, { margin: 2, width: 200 });
      const link = document.createElement('a');

      link.href = dataUrl;
      link.download = fileName || 'qr-code.png';
      link.click();
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full mt-5
        transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
      >
        Download
      </button>
    </div>
  );
};

export default QrCodeDownload;
