import React from 'react';
import { FaRocket, FaTimes } from 'react-icons/fa';

const DevelopmentUpdate = ({ onClose }) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 notification-popup">
            <div className="bg-white text-gray-800 rounded-lg shadow-xl overflow-hidden w-80 transform transition-all duration-300 hover:scale-105">
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                            <div className="bg-indigo-100 p-2 rounded-full mr-3">
                                <FaRocket className="text-indigo-600 text-lg" />
                            </div>
                            <h3 className="font-bold text-gray-900">Development Update</h3>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close notification"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    <div className="mt-2 pl-11">
                        <p className="text-sm text-gray-600">
                            I'm actively working on this project and adding new features. All the current functionality was completed just this week! Stay tuned for more updates.
                        </p>
                        <div className="mt-3 flex items-center text-xs text-indigo-600">
                            <span className="flex h-2 w-2 mr-1">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Active Development
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-right">
                    <button 
                        onClick={onClose}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        Got it, thanks!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DevelopmentUpdate;
