import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  CheckCircle2, 
  Info, 
  Edit3, 
  X, 
  HelpCircle,
  AlertOctagon
} from 'lucide-react';

const DialogContext = createContext(null);

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'danger', // 'danger' | 'warning' | 'info' | 'success' | 'prompt' | 'confirm'
    title: '',
    titleSin: '',
    message: '',
    messageSin: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    defaultValue: '',
    placeholder: '',
    inputType: 'text',
    resolve: null
  });

  const [promptInput, setPromptInput] = useState('');
  const inputRef = useRef(null);

  // Focus and select input on prompt open
  useEffect(() => {
    if (dialog.isOpen && dialog.type === 'prompt') {
      setPromptInput(dialog.defaultValue || '');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [dialog.isOpen, dialog.type, dialog.defaultValue]);

  // Show a confirmation dialog (returns Promise<boolean>)
  const showConfirm = ({
    title = 'Confirm Action',
    titleSin = 'තහවුරු කරන්න',
    message = 'Are you sure you want to proceed?',
    messageSin = '',
    type = 'danger',
    confirmText = 'Confirm (තහවුරු කරන්න)',
    cancelText = 'Cancel (අවලංගු කරන්න)'
  }) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type,
        title,
        titleSin,
        message,
        messageSin,
        confirmText,
        cancelText,
        resolve
      });
    });
  };

  // Show an alert dialog (returns Promise<boolean>)
  const showAlert = ({
    title = 'Notice',
    titleSin = 'දැනුම්දීමයි',
    message = '',
    messageSin = '',
    type = 'info',
    confirmText = 'OK (තේරුම් ගතිමි)'
  }) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type,
        title,
        titleSin,
        message,
        messageSin,
        confirmText,
        cancelText: null,
        resolve
      });
    });
  };

  // Show a prompt input dialog (returns Promise<string | null>)
  const showPrompt = ({
    title = 'Edit',
    titleSin = 'වෙනස් කරන්න',
    message = 'Enter new value:',
    messageSin = '',
    defaultValue = '',
    placeholder = '',
    inputType = 'text',
    confirmText = 'Save (සුරකින්න)',
    cancelText = 'Cancel (අවලංගු කරන්න)'
  }) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: 'prompt',
        title,
        titleSin,
        message,
        messageSin,
        defaultValue,
        placeholder,
        inputType,
        confirmText,
        cancelText,
        resolve
      });
    });
  };

  const handleConfirm = () => {
    if (dialog.type === 'prompt') {
      dialog.resolve?.(promptInput.trim());
    } else {
      dialog.resolve?.(true);
    }
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (dialog.type === 'prompt') {
      dialog.resolve?.(null);
    } else {
      dialog.resolve?.(false);
    }
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && dialog.type === 'prompt') {
      e.preventDefault();
      handleConfirm();
    }
  };

  // Icon and accent styling selector
  const getDialogStyle = () => {
    switch (dialog.type) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6 text-red-600" />,
          iconBg: 'bg-red-100/80 border border-red-200 text-red-600 ring-4 ring-red-50',
          confirmBtn: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-200'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          iconBg: 'bg-amber-100/80 border border-amber-200 text-amber-600 ring-4 ring-amber-50',
          confirmBtn: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-200'
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          iconBg: 'bg-emerald-100/80 border border-emerald-200 text-emerald-600 ring-4 ring-emerald-50',
          confirmBtn: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-md shadow-emerald-200'
        };
      case 'prompt':
        return {
          icon: <Edit3 className="w-6 h-6 text-indigo-600" />,
          iconBg: 'bg-indigo-100/80 border border-indigo-200 text-indigo-600 ring-4 ring-indigo-50',
          confirmBtn: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-200'
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-6 h-6 text-blue-600" />,
          iconBg: 'bg-blue-100/80 border border-blue-200 text-blue-600 ring-4 ring-blue-50',
          confirmBtn: 'bg-[#0f172a] hover:bg-black text-white shadow-md'
        };
    }
  };

  const style = getDialogStyle();

  return (
    <DialogContext.Provider value={{ showConfirm, showAlert, showPrompt }}>
      {children}

      {/* Centered Modern Modal Dialog */}
      {dialog.isOpen && (
        <div 
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
          onClick={handleCancel}
          onKeyDown={handleKeyDown}
        >
          <div 
            className="relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-6 text-center sm:text-left transform transition-all animate-in zoom-in-95 duration-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close 'X' Button */}
            <button
              type="button"
              onClick={handleCancel}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Icon + Titles */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${style.iconBg}`}>
                {style.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight leading-snug">
                  {dialog.title}
                </h3>
                {dialog.titleSin && (
                  <p className="text-xs font-bold text-[#f03a5f] mt-0.5">
                    {dialog.titleSin}
                  </p>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="mt-3.5 sm:ml-16 space-y-1">
              {dialog.message && (
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  {dialog.message}
                </p>
              )}
              {dialog.messageSin && (
                <p className="text-xs text-gray-500 leading-relaxed">
                  {dialog.messageSin}
                </p>
              )}

              {/* Input for Prompt type */}
              {dialog.type === 'prompt' && (
                <div className="pt-2">
                  <input
                    ref={inputRef}
                    type={dialog.inputType || 'text'}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={dialog.placeholder || 'Enter value...'}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f03a5f] focus:border-transparent transition"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 mt-6 pt-3.5 border-t border-gray-100">
              {dialog.cancelText && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-bold transition shadow-2xs"
                >
                  {dialog.cancelText}
                </button>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition active:scale-98 ${style.confirmBtn}`}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
