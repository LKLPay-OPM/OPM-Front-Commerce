// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiQmUVlch5MJ0qcS9WVGOsCdKKT9YH-tQ",
  authDomain: "lklpaytest.firebaseapp.com",
  projectId: "lklpaytest",
  storageBucket: "lklpaytest.appspot.com",
  messagingSenderId: "407367559850",
  appId: "1:407367559850:web:e319935c7dce6f8e873ed3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
//setPersistence(auth, inMemoryPersistence)