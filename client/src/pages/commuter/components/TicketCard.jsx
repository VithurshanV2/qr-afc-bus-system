import React from 'react';
import { formatIssuedDate } from '../../../utils/date';
import QRCode from 'react-qr-code';

const TicketCard = ({ ticket }) => {
  if (!ticket) {
    return null;
  }

  const {
    id,
    issuedAt,
    baseFare,
    totalFare,
    boardingHalt,
    destinationHalt,
    adultCount,
    childCount,
    commuter,
    trip,
  } = ticket;

  const route = trip?.route;
  const bus = trip?.bus;

  return (
    <div className="space-y-2 border-3 border-gray-200 rounded-xl p-5 shadow-lg">
      <div className=" border-b border-gray-200 pb-3 mb-3">
        {/* Ticket ID */}
        <div className="text-center text-yellow-600 text-3xl font-semibold mb-2">
          <span className="text-gray-600">Ticket</span> #{id}
        </div>

        {/* Halts info */}
        <div className="text-center mb-4 border-b border-gray-200 pb-2">
          <p className="text-gray-600 text-xs tracking-wide">
            Boarding Halt - Destination Halt
          </p>
          <p className="text-2xl font-medium text-gray-900 leading-[1.1] mt-[-2px]">
            {boardingHalt?.englishName.replace(/\((.*?)\)/g, '')} {'-'}{' '}
            {destinationHalt?.englishName.replace(/\((.*?)\)/g, '')}
          </p>
        </div>

        {/* Ticket details */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Commuter</span>
            <span className="text-gray-900 font-medium">
              {commuter?.name || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Route</span>
            <span className="text-gray-900 font-medium">
              {route?.name || 'N/A'} ({route?.number || 'N/A'})
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Bus Reg. No.</span>
            <span className="text-gray-900 font-medium">
              {bus?.registrationNumber || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Passengers</span>
            <span className="text-gray-900 font-medium">
              {adultCount} Adult{adultCount > 1 ? 's' : ''}
              {childCount > 0 &&
                `, ${childCount} Child${childCount > 1 ? 'ren' : ''}`}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Base Fare</span>
            <span className="text-gray-900 font-medium">
              {(baseFare / 100).toFixed(2)} LKR
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Issued</span>
            <span className="text-gray-900 font-medium">
              {issuedAt ? formatIssuedDate(issuedAt) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mt-5">
        <QRCode value={ticket.qrCode || ''} size={150} />
      </div>

      {/* Total fare */}
      <div className="text-center mt-5">
        <p className="text-gray-600 tracking-wide text-xs leading-tight">
          Total Fare
        </p>
        <p className="text-4xl font-medium text-gray-900 leading-[1.1] mt-[-2px]">
          {(totalFare / 100).toFixed(2)} LKR
        </p>
      </div>
    </div>
  );
};

export default TicketCard;
