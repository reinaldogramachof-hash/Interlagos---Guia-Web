import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// 1. Cloud Function para Denormalização (onUserUpdate)
export const updateAuthorDataOnUserUpdate = functions
    .region('southamerica-east1')
    .firestore.document('users/{userId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const oldData = change.before.data();

        if (newData.displayName === oldData.displayName && newData.photoURL === oldData.photoURL) {
            return null;
        }

        const adsQuery = db.collection('ads').where('author.uid', '==', context.params.userId);
        const snapshot = await adsQuery.get();

        if (snapshot.empty) {
            return null;
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, {
                'author.displayName': newData.displayName,
                'author.photoURL': newData.photoURL
            });
        });

        await batch.commit();
        console.log(`Updated author data for ${snapshot.size} ads for user ${context.params.userId}`);
        return null;
    });

// 2. Cloud Function para Agregação Incremental de Métricas (onWrite Review)
export const aggregateMerchantRatings = functions
    .region('southamerica-east1')
    .firestore.document('merchants/{merchantId}/reviews/{reviewId}')
    .onWrite(async (change, context) => {
        const merchantRef = db.collection('merchants').doc(context.params.merchantId);
        const eventId = context.eventId;

        await db.runTransaction(async (transaction) => {
            const processedEventRef = db.collection('processed_events').doc(eventId);
            const processedEventDoc = await transaction.get(processedEventRef);

            if (processedEventDoc.exists) {
                console.log(`Event ${eventId} already processed.`);
                return;
            }

            const merchantDoc = await transaction.get(merchantRef);
            if (!merchantDoc.exists) {
                console.error(`Merchant ${context.params.merchantId} not found.`);
                return;
            }

            const data = merchantDoc.data();
            let oldTotalScore = data?.metrics?.totalScore || 0;
            let oldReviewCount = data?.metrics?.reviewCount || 0;

            const oldReview = change.before.data();
            const newReview = change.after.data();

            if (!change.before.exists && change.after.exists) { // Novo Review
                oldTotalScore += newReview!.rating;
                oldReviewCount += 1;
            } else if (change.before.exists && change.after.exists) { // Review Atualizado
                oldTotalScore = oldTotalScore - oldReview!.rating + newReview!.rating;
            } else if (change.before.exists && !change.after.exists) { // Review Deletado
                oldTotalScore -= oldReview!.rating;
                oldReviewCount -= 1;
            }

            const newRating = oldReviewCount > 0 ? oldTotalScore / oldReviewCount : 0;

            transaction.update(merchantRef, {
                'metrics.reviewCount': oldReviewCount,
                'metrics.totalScore': oldTotalScore,
                'metrics.rating': newRating
            });

            transaction.set(processedEventRef, { processedAt: admin.firestore.FieldValue.serverTimestamp() });

            console.log(`Merchant ${context.params.merchantId} metrics updated. New rating: ${newRating}`);
        });
        return null;
    });

// 3. Cloud Function Agendada para Hard Delete (LGPD)
export const cleanupDeletedUsers = functions
    .region('southamerica-east1')
    .pubsub.schedule('every 24 hours')
    .onRun(async (context) => {
        const twentyFourHoursAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
        const usersToDeleteQuery = db.collection('users')
            .where('deletedAt', '<', twentyFourHoursAgo)
            .where('isHardDeleted', '==', false)
            .limit(100);

        const snapshot = await usersToDeleteQuery.get();
        if (snapshot.empty) {
            console.log('No users to hard delete.');
            return null;
        }

        const batch = db.batch();
        const auth = admin.auth();

        for (const doc of snapshot.docs) {
            const user = doc.data();
            await auth.deleteUser(user.uid).catch(error => console.warn(`Failed to delete Auth user ${user.uid}: ${error.message}`));
            batch.update(doc.ref, { isHardDeleted: true, hardDeletedAt: admin.firestore.FieldValue.serverTimestamp() });
        }

        await batch.commit();
        console.log(`Hard deleted ${snapshot.size} users.`);
        return null;
    });
