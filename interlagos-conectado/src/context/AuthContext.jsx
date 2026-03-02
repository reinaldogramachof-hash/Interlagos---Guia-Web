import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { createUserProfile } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in, fetch/create profile and get role
                const role = await createUserProfile(user);
                setUserRole(role);
                setCurrentUser(user);
            } else {
                // User is signed out
                setCurrentUser(null);
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = async () => {
        await auth.signOut();
        setCurrentUser(null);
        setUserRole(null);
    };

    const value = {
        currentUser,
        userRole,
        loading,
        logout,
        isAdmin: userRole === 'admin' || userRole === 'master',
        isMaster: userRole === 'master',
        isMerchant: userRole === 'merchant',
        isResident: userRole === 'resident'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
