// lib/firebaseAdmin.js
import admin from 'firebase-admin';

// DO NOT call dotenv.config() here. Vercel handles it.

// Check if the app is already initialized
if (!admin.apps.length) {
  try {
    // Parse the service account JSON from the environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin Initialized.');
  } catch (error) {
    console.error('Firebase admin initialization error:', error.message);
  }
}

// Export the initialized auth service
export const authAdmin = admin.auth();