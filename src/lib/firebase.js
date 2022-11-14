// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJJTKnoS22aPqZ12z7uMHXWp8UZZ8gLd4",
  authDomain: "lklpay-dev.firebaseapp.com",
  projectId: "lklpay-dev",
  storageBucket: "lklpay-dev.appspot.com",
  messagingSenderId: "881966195775",
  appId: "1:881966195775:web:10c50c72721349ac88448a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
//setPersistence(auth, inMemoryPersistence)