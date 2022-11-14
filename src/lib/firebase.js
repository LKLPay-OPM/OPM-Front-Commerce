// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgi9IrqxAmE-aD9vdk2Br9mOinsodS8z8",
  authDomain: "lklpay.firebaseapp.com",
  projectId: "lklpay",
  storageBucket: "lklpay.appspot.com",
  messagingSenderId: "160088283136",
  appId: "1:160088283136:web:55c870724b263a652fa0e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
//setPersistence(auth, inMemoryPersistence)