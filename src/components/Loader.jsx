import React from 'react';
import { useLoader } from '../context/LoaderContext';

const Loader = () => {
    const { isLoading } = useLoader();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity">
            <div className="flex flex-col items-center p-5 bg-white rounded-2xl shadow-2xl">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-3 text-sm font-medium text-gray-700">Loading...</p>
            </div>
        </div>
    );
};

export default Loader;
