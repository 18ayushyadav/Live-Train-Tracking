const admin = require('firebase-admin');

let db = null;

function initFirebase() {
    if (admin.apps.length > 0) return admin.app();

    // In production, use environment variables
    // In development, use a serviceAccountKey.json file
    let credential;
    if (process.env.FIREBASE_PRIVATE_KEY) {
        credential = admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
    } else {
        try {
            const serviceAccount = require('../serviceAccountKey.json');
            credential = admin.credential.cert(serviceAccount);
        } catch {
            console.warn('⚠️  No Firebase credentials found. Running without Firebase.');
            return null;
        }
    }

    const app = admin.initializeApp({
        credential,
        projectId: process.env.FIREBASE_PROJECT_ID,
    });

    db = admin.firestore();
    console.log('✅ Firebase Admin initialized');
    return app;
}

function getFirestore() {
    if (!db) {
        initFirebase();
    }
    return db;
}

module.exports = { initFirebase, getFirestore, admin };
