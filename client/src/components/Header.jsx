import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      {!userData && (
        <button
          onClick={() => navigate('/login', { state: { mode: 'signup' } })}
          className="border border-gray-500 rounded-full px-8 py-2.5 
            hover:bg-gray-100 transition-all"
        >
          Register
        </button>
      )}
    </div>
  );
};

export default Header;
