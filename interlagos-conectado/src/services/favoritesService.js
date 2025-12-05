import { db } from '../firebaseConfig';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where, getDoc } from 'firebase/firestore';

export const toggleFavorite = async (userId, itemId, type, itemData) => {
    if (!userId || !itemId) return;

    const favRef = doc(db, 'users', userId, 'favorites', itemId);
    const favSnap = await getDoc(favRef);

    if (favSnap.exists()) {
        await deleteDoc(favRef);
        return false; // Removed
    } else {
        await setDoc(favRef, {
            itemId,
            type, // 'merchant', 'news', 'ad'
            ...itemData,
            savedAt: new Date()
        });
        return true; // Added
    }
};

export const checkIsFavorite = async (userId, itemId) => {
    if (!userId || !itemId) return false;
    const favRef = doc(db, 'users', userId, 'favorites', itemId);
    const favSnap = await getDoc(favRef);
    return favSnap.exists();
};

export const getFavorites = async (userId) => {
    if (!userId) return [];
    const q = query(collection(db, 'users', userId, 'favorites'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
