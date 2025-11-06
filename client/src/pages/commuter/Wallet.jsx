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
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsCursor, setTransactionsCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const MIN_TOP_UP = 200 * 100;
  const MAX_WALLET_BALANCE = 5000 * 100;

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

  const handleQuickAmountClick = (amount) => {
    if (selectedQuickAmount === amount) {
      setSelectedQuickAmount('');
      setTopUpAmount('');
    } else {
      setSelectedQuickAmount(amount);
      setTopUpAmount(amount);
    }
  };

  useEffect(() => {
    const quickAmounts = [200, 500, 1000];
    const typedAmount = Number(topUpAmount);

    if (quickAmounts.includes(typedAmount)) {
      setSelectedQuickAmount(typedAmount);
    } else {
      setSelectedQuickAmount('');
    }
  }, [topUpAmount]);

  const handleTopUp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + '/api/wallet/create-checkout-session',
        { amount: topUpAmount },
      );

      if (!data.success) {
        toast.error(data.message);
      } else {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    const params = new window.URLSearchParams(window.location.search);
    const session_id = params.get('session_id');

    if (session_id) {
      const fetchSession = async () => {
        axios.defaults.withCredentials = true;

        const { data } = await axios.post(
          backendUrl + '/api/wallet/fetch-session',
          { session_id },
        );

        if (data.success) {
          setBalance(data.wallet.balance);
        }
      };
      fetchSession();
    }
  }, [backendUrl]);

  const fetchTransactions = async (cursor = null) => {
    try {
      setTransactionsLoading(true);

      axios.defaults.withCredentials = true;

      const { data } = await axios.get(
        backendUrl + '/api/wallet/transactions',
        { params: { limit: 5, cursor } },
      );

      if (data.success) {
        if (cursor) {
          setTransactions((prev) => [...prev, ...data.transactions]);
        } else {
          setTransactions(data.transactions);
        }

        setTransactionsCursor(data.nextCursor);
        setHasMore(data.nextCursor !== null);
      } else {
        toast.error('Failed to load transactions');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLoadMore = () => {
    fetchTransactions(transactionsCursor);
  };

  return (
    <div className="bg-white min-h-[calc(100vh-4.4rem)] p-4">
      <div className="flex items-start mb-4">
        <img src={assets.logo} alt="logo" className="w-40 sm:w-48" />
      </div>
      <div className="mt-6 max-w-md mx-auto shadow rounded-xl p-6 border border-gray-200">
        <h2 className="text-gray-900 text-2xl font-medium flex items-center gap-2">
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

        {/* Top Up wallet section */}
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="number"
            min={MIN_TOP_UP / 100}
            max={MAX_WALLET_BALANCE / 100}
            value={topUpAmount}
            onChange={(e) => {
              setTopUpAmount(e.target.value.replace(/^0+/, ''));
              setSelectedQuickAmount('');
            }}
            placeholder="Enter amount (LKR)"
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="flex gap-2">
            {[200, 500, 1000].map((amount) => (
              <button
                key={amount}
                onClick={() => handleQuickAmountClick(amount)}
                className={`flex-1 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 transform
                  ${
                    selectedQuickAmount === amount
                      ? 'bg-yellow-400 text-gray-800 shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {amount} LKR
              </button>
            ))}
          </div>
          <button
            disabled={Number(topUpAmount) < MIN_TOP_UP / 100}
            onClick={handleTopUp}
            className={`w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full transition-all duration-200 transform
            ${
              topUpAmount >= MIN_TOP_UP / 100
                ? 'hover:bg-yellow-300 active:scale-95 active:shadow-lg'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Top Up
          </button>

          {/* Transaction history */}
          <div className="mt-6">
            <h3 className="text-gray-900 font-semibold mb-2">
              Recent Transactions
            </h3>
            <div className="max-h-64 overflow-y-auto pr-4 flex flex-col gap-3">
              {transactions.length === 0 && !transactionsLoading && (
                <div className="text-gray-500 text-sm text-center py-3">
                  No transactions yet
                </div>
              )}

              {transactions.map((tx, index) => (
                <div
                  key={tx.id}
                  className={`flex justify-between items-center py-3 ${
                    index < transactions.length - 1
                      ? 'border-b border-gray-200'
                      : ''
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-900 font-medium text-sm">
                      {tx.description.replace(/\((.*?)\)/g, '')}
                      {/* remove parentheses and their contents */}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <span
                    className={`font-semibold flex-shrink-0 ${
                      tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'}
                    {(tx.amount / 100).toFixed(2)} LKR
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleLoadMore}
              disabled={!hasMore || transactionsLoading}
              className="mt-4 py-2 w-full rounded-full text-sm bg-gray-200 text-gray-800 hover:bg-gray-300
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {transactionsLoading
                ? 'Loading...'
                : hasMore
                  ? 'Load More'
                  : 'No More Transactions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
