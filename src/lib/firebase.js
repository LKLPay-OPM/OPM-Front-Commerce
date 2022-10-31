// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOA-JCMCpzb0rYyzXXiT57PvJglZQktHk",
  authDomain: "lkl-pay.firebaseapp.com",
  projectId: "lkl-pay",
  storageBucket: "lkl-pay.appspot.com",
  messagingSenderId: "155580648632",
  appId: "1:155580648632:web:453884f42d573563b3784d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
//setPersistence(auth, inMemoryPersistence)