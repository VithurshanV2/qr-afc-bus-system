import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import ConfirmModel from '../../components/ConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAccount = () => {
  const { backendUrl, setGlobalLoading } = useContext(AppContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [modalType, setModalType] = useState(null);

  const isPhoneNumberValid = (number) => {
    const regex = /^(?:0|94|\+94)?(7[0-8][0-9]{7})$/;
    return regex.test(number);
  };

  const onSubmitHandler = async () => {
    try {
      setGlobalLoading(true);

      if (!isPhoneNumberValid(number)) {
        toast.error('Invalid phone number');
        return;
      }

      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/admin/create', {
        name,
        email,
        number,
      });

      if (data.success) {
        toast.success(data.message);
        setName('');
        setEmail('');
        setNumber('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setGlobalLoading(false);
      setModalType(null);
    }
  };

  // Form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setModalType('createAccount');
  };

  // Confirm model for create account
  const handleCreateAccount = async () => {
    await onSubmitHandler();
  };

  return (
    <div>
      <div className="p-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Create Admin Account
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key="create-admin-account"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
          >
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-4 w-sm border border-gray-200 p-6 rounded-xl shadow-sm"
            >
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                required
                className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                placeholder="Full Name"
              />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                placeholder="Email ID"
              />
              <input
                onChange={(e) => setNumber(e.target.value)}
                value={number}
                type="tel"
                required
                className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                placeholder="Phone Number"
              />
              <button
                type="submit"
                className="w-full bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full mt-2
                transition-all duration-200 transform hover:bg-yellow-300 active:scale-95 active:shadow-lg"
              >
                Create Account
              </button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confirm modal for creating an account */}
      <ConfirmModel
        isOpen={modalType === 'createAccount'}
        title="Create Admin Account?"
        message="Are you sure you want to create this admin account?"
        confirmText="Yes"
        cancelText="Cancel"
        onConfirm={handleCreateAccount}
        onCancel={() => setModalType(null)}
      />
    </div>
  );
};

export default AdminAccount;
