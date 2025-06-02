import React from 'react';

const Header = () => {
    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            <button className='border border-gray-500 rounded-full px-8 py-2.5 
            hover:bg-gray-100 transition-all'>Register</button>
        </div>
    );
};

export default Header;