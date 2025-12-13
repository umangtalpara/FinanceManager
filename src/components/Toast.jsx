import React from 'react';
import { useToast } from '../context/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = () => {
    const { toast, hideToast } = useToast();

    if (!toast.isVisible) return null;

    const getStyles = () => {
        switch (toast.type) {
            case 'success':
                return 'bg-green-50 border-green-400 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-400 text-red-800';
            case 'info':
                return 'bg-blue-50 border-blue-400 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-400 text-gray-800';
        }
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-400" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-400" />;
            default:
                return <Info className="h-5 w-5 text-blue-400" />;
        }
    };

    return (
        <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg border shadow-lg transition-all duration-300 transform translate-y-0 ${getStyles()}`}>
            <div className="flex-shrink-0 mr-3">
                {getIcon()}
            </div>
            <div className="mr-8 text-sm font-medium">
                {toast.message}
            </div>
            <button onClick={hideToast} className="flex-shrink-0 ml-auto focus:outline-none">
                <X className="h-4 w-4 opacity-70 hover:opacity-100" />
            </button>
        </div>
    );
};

export default Toast;
