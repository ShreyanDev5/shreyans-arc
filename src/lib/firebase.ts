import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

/**
 * FIREBASE CONFIGURATION
 * 
 * Replace the values below with your specific Firebase Project Config.
 * You can find this in Firebase Console -> Project Settings -> General -> Your apps
 */
const firebaseConfig = {
  apiKey: "AIzaSyBJqC-Jot6MYof9mHg_LO_jb4xZwtYbjR4",
  authDomain: "shreyans-arc.firebaseapp.com",
  projectId: "shreyans-arc",
  storageBucket: "shreyans-arc.firebasestorage.app",
  messagingSenderId: "102438847894",
  appId: "1:102438847894:web:a13bfa89f871cd186109b7"
};


// Check if the API key has been configured (basic check)
export const isConfigured = firebaseConfig.apiKey !== "REPLACE_WITH_YOUR_API_KEY" && firebaseConfig.apiKey.length > 10;

// Initialize only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup, firebaseSignOut, doc, setDoc, getDoc, onSnapshot };