import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!admin.apps.length) {
    admin.initializeApp();
}

export const db = getFirestore();
export const auth = getAuth();
