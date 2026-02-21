'use client';
import ReactDOM from "react-dom/client";

import { useEffect } from 'react';

const variantStyles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200',
};

function Toast({ message, variant = 'info', onClose, duration = 5000 }: { message: string, variant?: 'info' | 'error' | 'success', onClose: () => void, duration?: number }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `@keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-slideIn {
      animation: slideIn 0.3s ease-out;
    }
    `
    document.head.appendChild(style)
  }, [])

  return (
    <div
      className={`
        fixed top-[10px] right-[10px]
        flex items-center justify-between p-4 mb-2 rounded-lg border
        shadow-lg transition-all duration-300 ease-in-out
        animate-slideIn ${variantStyles[variant]}
      `}
      role="alert"
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default function toast({ message, variant = 'info', duration = 5000 }: { message: string, variant?: 'info' | 'error' | 'success', duration?: number }) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);

  const handleClose = () => {
    root.unmount();
    div.remove();
  };

  root.render(<Toast message={message} variant={variant} duration={duration} onClose={handleClose} />);
}