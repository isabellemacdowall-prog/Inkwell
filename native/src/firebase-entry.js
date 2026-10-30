// Re-exports exactly what index.html imports from the three Firebase CDN modules,
// so the Android app can load Firebase from inside the APK (works offline).
export { initializeApp } from "firebase/app";
export { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
export { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, collection, doc, setDoc, getDoc, deleteDoc, getDocs, onSnapshot, waitForPendingWrites } from "firebase/firestore";
