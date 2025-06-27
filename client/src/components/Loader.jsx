import React from 'react';
import PropTypes from 'prop-types';
import { BounceLoader } from 'react-spinners';

const Loader = ({ size = 80, color = '#FFB347' }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm bg-black/50">
      <BounceLoader size={size} color={color} />
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Loader;
