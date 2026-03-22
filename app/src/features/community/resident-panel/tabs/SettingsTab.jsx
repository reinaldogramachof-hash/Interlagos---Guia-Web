import React from 'react';

export default function SettingsTab({ currentUser }) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Meus Dados</h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                {currentUser.photoURL
                    ? <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-16 h-16 rounded-full" onError={e => { e.target.onerror=null; e.target.style.display='none'; }} />
                    : <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">{currentUser.displayName?.[0]?.toUpperCase() ?? '?'}</div>
                }
                <div>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{currentUser.displayName}</p>
                    <p className="text-slate-500">{currentUser.email}</p>
                </div>
            </div>
        </div>
    );
}
