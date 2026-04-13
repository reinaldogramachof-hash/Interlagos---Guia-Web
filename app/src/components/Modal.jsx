import React from 'react';
import { X } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';

export default function Modal({ isOpen, onClose, children, title, action }) {
    useScrollLock(isOpen);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-gray-800 truncate pr-16">{title}</h3>
                    <div className="flex items-center gap-1 absolute right-2 top-2">
                        {action}
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto overflow-x-hidden p-4 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}
