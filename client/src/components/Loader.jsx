import React from 'react';
import PropTypes from 'prop-types';
import { BounceLoader } from 'react-spinners';
import { createPortal } from 'react-dom';

const Loader = ({ size = 80, color = '#FFB347' }) => {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex justify-center items-center backdrop-blur-sm bg-black/50">
      <BounceLoader size={size} color={color} />
    </div>,
    document.getElementById('global-loader-root'),
  );
};

Loader.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
};

export default Loader;
