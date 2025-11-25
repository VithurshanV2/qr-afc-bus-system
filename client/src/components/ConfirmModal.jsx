import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import ReactDOM from 'react-dom';

const ConfirmModel = ({
  isOpen,
  title = 'Confirm Action',
  message = '',
  confirmText = 'Confirm',
  cancelText,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 text-center">
              <h3 className="text-gray-900 text-xl font-semibold mb-2">
                {title}
              </h3>
              <p className="text-gray-700 mb-6">{message}</p>
              <div className="flex gap-3">
                {onCancel && cancelText && (
                  <button
                    onClick={onCancel}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-full hover:bg-gray-300 
                  transition-all duration-200 active:scale-95"
                  >
                    {cancelText}
                  </button>
                )}

                <button
                  onClick={onConfirm}
                  className={`${onCancel && cancelText ? 'flex-1' : 'w-full'} bg-yellow-200 text-yellow-800 py-2 rounded-full hover:bg-yellow-300 
                  transition-all duration-200 active:scale-95`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default ConfirmModel;
