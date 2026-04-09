import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { subscribeToNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationService';


const TYPE_COLORS = {
    success: 'bg-emerald-500',
    error:   'bg-red-500',
    warning: 'bg-amber-500',
    info:    'bg-indigo-500',
};
const TYPE_BG = {
    success: 'bg-emerald-50/50 dark:bg-emerald-900/10',
    error:   'bg-red-50/50 dark:bg-red-900/10',
    warning: 'bg-amber-50/50 dark:bg-amber-900/10',
    info:    'bg-indigo-50/50 dark:bg-indigo-900/10',
};

export default function NotificationBell() {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToNotifications(currentUser?.uid, (notifs) => {
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.read).length);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const handleMarkAsRead = (id) => {
        markNotificationAsRead(currentUser?.uid, id);
    };

    const handleBellClick = () => {
        setIsOpen(!isOpen);
    };

    if (!currentUser) return null;

    return (
        <div className="relative">
            <button
                onClick={handleBellClick}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
                <Bell size={24} className="text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Notificações</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllNotificationsAsRead(currentUser?.id)}
                                    className="text-xs text-indigo-600 font-bold hover:underline"
                                >
                                    Marcar tudo como lido
                                </button>
                            )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    Nenhuma notificação por enquanto.
                                </div>
                            ) : (
                                notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleMarkAsRead(notif.id)}
                                        className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.read ? (TYPE_BG[notif.type] ?? TYPE_BG.info) : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notif.read ? (TYPE_COLORS[notif.type] ?? 'bg-indigo-500') : 'bg-transparent'}`} />
                                            <div>
                                                <p className={`text-sm ${!notif.read ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2">
                                                    {notif.created_at
                                                        ? new Date(notif.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                                                        : 'Agora'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
