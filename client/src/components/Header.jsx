import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <motion.div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-3xl sm:text-5xl font-bold mb-2"
      >
        Welcome to SmartFare
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="sm:text-xl text-gray-700 mb-6 max-w-xl"
      >
        Seamless digital fare collection for safer, faster journeys.
      </motion.p>

      {!userData && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onClick={() => navigate('/login', { state: { mode: 'signup' } })}
          className="border border-gray-500 rounded-full px-8 py-2.5 
            hover:bg-gray-100 transition-all"
        >
          Register
        </motion.button>
      )}
    </motion.div>
  );
};

export default Header;
