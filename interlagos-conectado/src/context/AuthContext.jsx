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

    const loginAsDev = (role) => {
        const devUsers = {
            master: { uid: 'dev_master', email: 'master@dev.com', displayName: 'Dev Master', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Master' },
            admin: { uid: 'dev_admin', email: 'admin@dev.com', displayName: 'Dev Admin', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
            merchant: { uid: 'dev_merchant', email: 'merchant@dev.com', displayName: 'Dev Merchant', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Merchant' },
            resident: { uid: 'dev_resident', email: 'resident@dev.com', displayName: 'Dev Resident', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Resident' }
        };

        const user = devUsers[role];
        if (user) {
            setCurrentUser(user);
            setUserRole(role);
        }
    };

    const value = {
        currentUser,
        userRole,
        loading,
        logout,
        loginAsDev,
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
