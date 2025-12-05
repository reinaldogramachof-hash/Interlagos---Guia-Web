import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const getUserRole = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data().role;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user role:", error);
        return null;
    }
};

export const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const { email, displayName, photoURL } = user;
        try {
            await setDoc(userRef, {
                uid: user.uid,
                email,
                displayName,
                photoURL,
                role: 'resident', // Default role
                createdAt: serverTimestamp(),
                ...additionalData
            });
            return 'resident';
        } catch (error) {
            console.error("Error creating user profile:", error);
            return 'resident'; // Fallback
        }
    } else {
        return userSnap.data().role;
    }
};
