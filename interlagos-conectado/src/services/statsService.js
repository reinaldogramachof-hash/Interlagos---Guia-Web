import { db } from '../firebaseConfig';
import { doc, updateDoc, increment, arrayUnion, serverTimestamp } from 'firebase/firestore';

/**
 * Increments the view count for a merchant.
 * @param {string} merchantId - The ID of the merchant.
 */
export const incrementMerchantView = async (merchantId) => {
    if (!merchantId) return;
    try {
        const merchantRef = doc(db, 'merchants', merchantId);
        await updateDoc(merchantRef, {
            views: increment(1),
            lastViewedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error incrementing merchant view:", error);
    }
};

/**
 * Increments the click count for a merchant's WhatsApp/Contact.
 * @param {string} merchantId - The ID of the merchant.
 */
export const incrementMerchantContactClick = async (merchantId) => {
    if (!merchantId) return;
    try {
        const merchantRef = doc(db, 'merchants', merchantId);
        await updateDoc(merchantRef, {
            contactClicks: increment(1),
            lastContactClickAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error incrementing merchant contact click:", error);
    }
};

/**
 * Increments the view count for an ad.
 * @param {string} adId - The ID of the ad.
 */
export const incrementAdView = async (adId) => {
    if (!adId) return;
    try {
        const adRef = doc(db, 'ads', adId);
        await updateDoc(adRef, {
            views: increment(1)
        });
    } catch (error) {
        console.error("Error incrementing ad view:", error);
    }
};

/**
 * Increments the click count for an ad's WhatsApp button.
 * @param {string} adId - The ID of the ad.
 */
export const incrementAdClick = async (adId) => {
    if (!adId) return;
    try {
        const adRef = doc(db, 'ads', adId);
        await updateDoc(adRef, {
            clicks: increment(1)
        });
    } catch (error) {
        console.error("Error incrementing ad click:", error);
    }
};
