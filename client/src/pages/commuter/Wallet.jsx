import React from 'react';
import { assets } from '../../assets/assets';
import { useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { BounceLoader } from 'react-spinners';

const Wallet = () => {
  const { backendUrl } = useContext(AppContext);

  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setLoading(true);
        axios.defaults.withCredentials = true;

        const { data } = await axios.get(backendUrl + '/api/wallet');

        if (!data.success) {
          toast.error(data.message);
        } else {
          setBalance(data.wallet.balance);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletBalance();
  }, [backendUrl]);

  return (
    <div className="bg-white min-h-screen p-4">
      <div className="flex items-start mb-4">
        <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />
      </div>
      <div className="mt-6 max-w-md mx-auto shadow rounded-xl p-6 border border-gray-200">
        <h2 className="text-gray-900 text-lg font-semibold flex items-center gap-2">
          Wallet
        </h2>

        {/* Balance section */}
        <div className="mt-2 flex flex-col items-center justify-center">
          <div className="text-gray-500 text-sm mb-1"> Current Balance</div>
          {loading ? (
            <BounceLoader size={30} color="#FFB347" />
          ) : (
            <div className="text-4xl text-gray-900">
              {(balance / 100).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              LKR
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <button className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full hover:bg-yellow-300 transition">
            Top Up
          </button>
          <div>Transaction history</div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
