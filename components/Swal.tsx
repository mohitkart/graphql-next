/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import ReactDOM from "react-dom/client";


// Icon components (using simple SVG; you can replace with Heroicons or any library)
const Icons = {
  success: (
    <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

function SweetAlert({
  title,
  message,
  icon = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  showCancel = false,
}: { isOpen: boolean, title?: string, message?: string, icon?: 'info' | 'error' | 'warning' | 'success', confirmText?: string, cancelText?: string, onConfirm: () => void, onCancel: () => void, showCancel?: boolean }) {

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key === 'Escape') {
        onCancel?.();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);


  return <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Backdrop with blur */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={onCancel}
    />
    {/* Modal */}
    <div
      className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-message"
    >
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center mb-4">
          {Icons[icon] || Icons.info}
        </div>
        {/* Title */}
        <h3 id="alert-title" className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        {/* Message */}
        <p id="alert-message" className="text-sm text-gray-600 mb-6">
          {message}
        </p>
        {/* Buttons */}
        <div className="flex justify-center gap-3">
          {showCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  </div>
}

export default function swal(props: { title?: string, message?: string, icon?: 'info' | 'error' | 'warning' | 'success', confirmText?: string, cancelText?: string, showCancel?: boolean }) {
  return new Promise<{isConfirmed:boolean,isCanceled:boolean}>((resolve) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const root = ReactDOM.createRoot(div);

    const handleClose = () => {
      root.unmount();
      div.remove();
      resolve({ isConfirmed: false, isCanceled: true })
    };

    const onConfirm = () => {
      root.unmount();
      div.remove();
      resolve({ isConfirmed: true, isCanceled: false })
    }

    root.render(<SweetAlert onConfirm={onConfirm} isOpen onCancel={handleClose} {...props} />);
  })
}