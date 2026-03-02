import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { validateEmail, validateName, sanitizeInput } from '../utils/validation';

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
    if (!user || !user.uid) {
        throw new Error("Usuário inválido: UID ausente");
    }

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const { email, displayName, photoURL } = user;

        // Validações
        if (!validateEmail(email)) {
            throw new Error("Email inválido");
        }

        const sanitizedName = sanitizeInput(displayName || email.split('@')[0]);
        if (!validateName(sanitizedName)) {
            throw new Error("Nome deve ter entre 2 e 100 caracteres");
        }

        // Validar role (apenas resident ou merchant na criação)
        const validRoles = ['resident', 'merchant'];
        const role = additionalData.role && validRoles.includes(additionalData.role)
            ? additionalData.role
            : 'resident';

        try {
            await setDoc(userRef, {
                uid: user.uid,
                email: email,
                displayName: sanitizedName,
                photoURL: photoURL || null,
                role: role,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return role;
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw new Error("Falha ao criar perfil de usuário: " + error.message);
        }
    } else {
        return userSnap.data().role;
    }
};
