import React from 'react';
import { LogOut, User, ShieldCheck } from 'lucide-react';
import { auth } from './firebaseConfig';

export default function UserProfile({ user, isAdmin, onLogout }) {
    if (!user) return null;

    const handleLogout = () => {
        auth.signOut();
        if (onLogout) onLogout();
    };

    return (
        <div className="flex items-center gap-3 bg-indigo-800/50 p-1.5 pr-4 rounded-full border border-indigo-500/30 backdrop-blur-sm">
            {user.photoURL ? (
                <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border-2 border-indigo-400"
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <User size={16} />
                </div>
            )}

            <div className="hidden md:block">
                <p className="text-xs font-bold text-white leading-tight max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0]}
                </p>
                {isAdmin && (
                    <p className="text-[10px] text-yellow-300 font-bold flex items-center gap-1">
                        <ShieldCheck size={10} /> Admin
                    </p>
                )}
            </div>

            <button
                onClick={handleLogout}
                className="ml-2 text-indigo-200 hover:text-white transition-colors"
                title="Sair"
            >
                <LogOut size={16} />
            </button>
        </div>
    );
}
