import { db } from '../firebaseConfig';
import { collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

/**
 * Creates a notification for a specific user.
 * @param {string} userId - The ID of the user to notify.
 * @param {string} title - The title of the notification.
 * @param {string} message - The body message.
 * @param {string} type - 'info', 'success', 'warning', 'error'.
 */
export const createNotification = async (userId, title, message, type = 'info') => {
    if (!userId) return;
    try {
        await addDoc(collection(db, 'users', userId, 'notifications'), {
            title,
            message,
            type,
            read: false,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

/**
 * Marks a notification as read.
 * @param {string} userId 
 * @param {string} notificationId 
 */
export const markNotificationAsRead = async (userId, notificationId) => {
    if (!userId || !notificationId) return;
    try {
        const notifRef = doc(db, 'users', userId, 'notifications', notificationId);
        await updateDoc(notifRef, { read: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

/**
 * Subscribes to user's notifications.
 * @param {string} userId 
 * @param {function} callback 
 * @returns {function} unsubscribe function
 */
export const subscribeToNotifications = (userId, callback) => {
    if (!userId) return () => { };

    const q = query(
        collection(db, 'users', userId, 'notifications'),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(notifications);
    });
};
