import { auth, db } from "$lib/firebase";
import { loggedInUser } from '$lib/stores.js'
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const updateTransactionStatus = async(transactionData) => {
  const data = transactionData;
  const uuid = transactionData.uuid;
  const terminal = transactionData.terminal.serialNumber;
  const uid = data.user.uid;
  const id = data.id;
  try {
    try {
      await updateDoc(doc(db, "users-client", uid, "transactions", id), {
        status: data.status,
        // total: data.total
      })
    } catch (error) {
      throw new Error(error)
    }
    try {
      await updateDoc(doc(db, "terminals", terminal, "transactions", uuid), {
        status: data.status
      })
    } catch (error) {
      throw new Error(error)
    }
    try {
      await updateDoc(doc(db, "users-client", uid), {
        total: increment(-transactionData.total),
        toDeposit: increment(-transactionData.total)
      });
    } catch (error) {
      throw new Error(error)
    }
    alert("Estatus de transacción pendiente de reembolso")
  } catch (error) {
    console.log("Could not update document")
    throw new Error(error);
  }
}

export const updateUserInfo = async(userInfo) => {
  const id = userInfo.uid;
  delete userInfo.uid;
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
    alert("No se pudo modificar el documento")
    // console.log("Could not update document")
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

export const updateUserAvatar = async(data) => {
  const uid = data.uid;
  const avatar = data.avatar
  const fileType = data.fileType;
  const storage = getStorage();
  const avatarRef = ref(storage, `avatars/${uid}/avatar.${docType(fileType)}`);
  try {
    uploadBytes(avatarRef, avatar, { contentType: fileType }).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        delete data.fileType;
        data.avatar = downloadURL;
        updateUserInfo(data);
        // console.log(data)
        // console.log('File available at', downloadURL);
      });
    });
  } catch (error) {
    
  }
}

const updateUserBankAccountDocument = async(bankAccountInfo) => {
  const uid = bankAccountInfo.uid;
  try {
    // Try to create/update user bankAccountInfo in DB
    await updateDoc(doc(db, "users-client", uid), {
      statusBankAccountInfo: 'delivered',
      bankAccountInfo
    })
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
  const ineOne = bankAccountInfo.ine[0];
  const ineTwo = bankAccountInfo.ine[1];
  // console.log(ineOne)
  const ineType = bankAccountInfo.ineType;
  const bankStatement = bankAccountInfo.bankStatement;
  const bankStatementType = bankAccountInfo.bankStatementType;
  const storage = getStorage();
  const storageRefINEOne = ref(storage, `bank-account/${uid}/ine_1.${docType(ineType)}`);
  const storageRefINETwo = ref(storage, `bank-account/${uid}/ine_2.${docType(ineType)}`);
  const storageRefBankStatement = ref(storage, `bank-account/${uid}/bank-statement.${docType(bankStatementType)}`);
  
  /*  */
  try {
    if(bankAccountInfo.ine.length > 1){
      uploadBytes(storageRefINEOne, ineOne, { contentType: ineType }).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          bankAccountInfo.ine[0] = downloadURL;
          // console.log('File available at', downloadURL);
          uploadBytes(storageRefINETwo, ineTwo, { contentType: ineType }).then((snap) => {
            getDownloadURL(snap.ref).then((downloadURL) => {
              bankAccountInfo.ine[1] = downloadURL;
              // console.log('File available at', downloadURL);
              uploadBytes(storageRefBankStatement, bankStatement, { contentType: bankStatementType }).then((snap) => {
                getDownloadURL(snap.ref).then((downloadURL) => {
                  bankAccountInfo.bankStatement = downloadURL;
                  // console.log('File available at', downloadURL);
                  updateUserBankAccountDocument(bankAccountInfo)
                });
              });
            });
          });
        });
      });
    }else{
      uploadBytes(storageRefINEOne, ineOne, { contentType: ineType }).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          bankAccountInfo.ine[0] = downloadURL;
          // console.log('File available at', downloadURL);
          uploadBytes(storageRefBankStatement, bankStatement, { contentType: bankStatementType }).then((snap) => {
            getDownloadURL(snap.ref).then((downloadURL) => {
              bankAccountInfo.bankStatement = downloadURL;
              // console.log('File available at', downloadURL);
              updateUserBankAccountDocument(bankAccountInfo)
            });
          });
        });
      });
    }
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