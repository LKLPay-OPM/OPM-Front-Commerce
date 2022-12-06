import { auth, db } from "$lib/firebase";
import { loggedInUser, isLoggedIn, userId} from '$lib/stores.js'
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { redirect } from '@sveltejs/kit';
import { goto } from "$app/navigation";
import { browser } from '$app/environment';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
  inMemoryPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential
} from "firebase/auth";
import * as functions from 'firebase/functions';

export const login = async(email, password) => {
  setPersistence(auth, browserSessionPersistence)
  try {
    await signInWithEmailAndPassword(auth, email, password)
    .then( async (userCredential) => {
        // Signed in
        if(browser){
          goto("/home");
        }
        const user = userCredential.user;
        const id = user.uid;
        isLoggedIn.update(() => true)
  
        // Retrieve logged in user data from db
        const docRef = doc(db, "users-client", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        try {
              const user = docSnap.data()
              console.log({user})
              loggedInUser.set(user);
            } catch (error) {
              throw new Error(error);
            }
        }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      throw new Error(error)
    });
    
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const logout = async() => {
  signOut(auth).then(() => {
    // Sign-out successful.
    //loggedInUser.set({})
    //goto('/')
    if(browser){
      goto("/");
      // window.location.href = '/';
    }
  }).catch((error) => {
    // An error happened.
  });
}

export const registerUser = async(email, password, data) => {
  await createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
      // Signed in
      const id = userCredential.user.uid;
      const user = userCredential.user;
      data.uid = id;
      delete data.password;
      try {
          createUser(id, data);
      } catch (error) {
          throw new Error(error);
      }
      // ...
      goto("/");
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      //alert(errorMessage)
  });
}

export const createUser = async(id, data) => {
  await setDoc(doc(db, "users-client", id), data)
}

export const resetPass = async(email) => {
  sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    // ..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}

const reauthenticate = (currentPassword) => {
  const user = auth.currentUser;
  const cred = EmailAuthProvider.credential(
      user.email, currentPassword
    );
    const result = reauthenticateWithCredential(
      user,
      cred
    )
  return result
}

export const changePassword = (currentPassword, newPassword) => {
  reauthenticate(currentPassword).then(() => {
    const user = auth.currentUser;
    updatePassword(user, newPassword).then(() => {
      console.log("Password updated!");
      alert("Password updated!")
    }).catch((error) => { console.log(error); });
  }).catch((error) => { console.log(error); });
}

export const changeEmail = (currentPassword, newEmail) => {
  reauthenticate(currentPassword).then(() => {
    const user = auth.currentUser;
    updateEmail(user, newEmail).then(async() => {
      const id = user.uid;
      try {
        await updateDoc(doc(db, "users-client", id), {email: newEmail})
        // loggedInUser.update({email: newEmail})
        // Retrieve logged in user data from db
        const docRef = doc(db, "users-client", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        try {
              const user = docSnap.data()
              console.log({user})
              loggedInUser.set(user);
              //sessionStorage.setItem("userData", user);
            } catch (error) {
              throw new Error(error);
            }
        }
      } catch (error) {
        console.log("Could not update document")
        throw new Error(error);
      }
      alert("Email updated!");
      console.log("Email updated!");
    }).catch((error) => { console.log(error); });
  }).catch((error) => { console.log(error); });
}