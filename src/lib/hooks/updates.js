import { auth, db } from "$lib/firebase";
import { loggedInUser } from '$lib/stores.js'
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

export const updateTransactionStatus = async(transactionData) => {
  const data = transactionData;
  const uid = data.uid;
  const id = data.id;
  try {
    await updateDoc(doc(db, "users-client", uid, "transactions", id), {
      status: data.status,
      // total: data.total
    })
    alert("Estatus de transacción pendiente de reembolso")
  } catch (error) {
    console.log("Could not update document")
    throw new Error(error);
  }
}

export const updateUserInfo = async(userInfo) => {
  const id = userInfo.uid;
  try {
    await updateDoc(doc(db, "users-client", id), userInfo)
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
    alert("Se modificó el documento exitosamente")
  } catch (error) {
    console.log("Could not update document")
    throw new Error(error);
  }
}

const docType = (type) => {
  const dataTypes = {
    "image/jpeg" : {
      typeName: "jpg"
    },
    "image/png" : {
      typeName: "png"
    },
    "document/pdf": {
      typeName: "pdf"
    }
  }

  return dataTypes[type].typeName;
}

const updateUserBankAccountDocument = async(bankAccountInfo) => {
  const uid = bankAccountInfo.uid;
  try {
    // Try to create/update user bankAccountInfo in DB
    await updateDoc(doc(db, "users-client", uid), {bankAccountInfo})
    // Retrieve logged in user data from db
    const docRef = doc(db, "users-client", uid);
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
    // console.log(bankAccountInfo)
    alert("Se modificó el documento exitosamente")
  } catch (error) {
    console.log("Could not update document")
    throw new Error(error);
  }
}

export const updateUserBankAccountInfo = async(bankAccountInfo) => {
  const uid = bankAccountInfo.uid;
  const ine = bankAccountInfo.ine;
  const ineType = bankAccountInfo.ineType;
  const bankStatement = bankAccountInfo.bankStatement;
  const bankStatementType = bankAccountInfo.bankStatementType;
  const storage = getStorage();
  const storageRefINE = ref(storage, `bank-account/${uid}/ine.${docType(ineType)}`);
  const storageRefBankStatement = ref(storage, `bank-account/${uid}/bank-statement.${docType(bankStatementType)}`);
  
  /*  */
  try {
    uploadBytes(storageRefINE, ine, { contentType: ineType }).then((snapshot) => {
      // console.log(snapshot)
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        bankAccountInfo.ine = downloadURL;
        // console.log('File available at', downloadURL);
        // console.log(bankAccountInfo.ine)
        uploadBytes(storageRefBankStatement, bankStatement, { contentType: bankStatementType }).then((snap) => {
          getDownloadURL(snap.ref).then((downloadURL) => {
            bankAccountInfo.bankStatement = downloadURL;
            // console.log('File available at', downloadURL);
            // console.log(bankAccountInfo.bankStatement)
            // console.log(bankAccountInfo)
            updateUserBankAccountDocument(bankAccountInfo)
          });
        });
      });
    });
    
    
    delete bankAccountInfo.ineType;
    delete bankAccountInfo.bankStatementType;
    // console.log(ineURL)
    // console.log(bankStatementURL)

    
  } catch (error) {
    console.log("Could not update document")
    throw new Error(error);
  }
  // console.log(bankAccountInfo)
  // updateUserBankAccountDocument(bankAccountInfo)
}