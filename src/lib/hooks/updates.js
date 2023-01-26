import { auth, db } from "$lib/firebase";
import { loggedInUser, onboardingSuccess } from '$lib/stores.js'
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
    // alert("Estatus de transacción pendiente de reembolso")
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
          onboardingSuccess.set(true);
          loggedInUser.set(user);
          //sessionStorage.setItem("userData", user);
        } catch (error) {
          throw new Error(error);
        }
    }
    // alert("Se modificó el documento exitosamente")
  } catch (error) {
    // alert("No se pudo modificar el documento")
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

export const updateUserBankAccountInfo = async(data) => {
  const uid = data.uid;
  const bankStatement = data.bankAccountInfo.bankStatement;
  const bankStatementType = data.bankAccountInfo.bankStatementType;
  delete data.bankAccountInfo.bankStatementType;
  const storage = getStorage();
  const storageRefBankStatement = ref(storage, `bank-account/${uid}/bank-statement.${docType(bankStatementType)}`);
  
  /*  */
  try {
    uploadBytes(storageRefBankStatement, bankStatement, { contentType: bankStatementType }).then((snap) => {
      getDownloadURL(snap.ref).then((downloadURL) => {
        data.bankAccountInfo.bankStatement = downloadURL;
        data.statusBankAccountInfo = "delivered"
        // console.log('File available at', downloadURL);
        updateUserInfo(data)
      });
    });
    // console.log(ineURL)
    // console.log(bankStatementURL)

  } catch (error) {
    console.log("Could not update document")
    throw new Error(error);
  }
  // console.log(bankAccountInfo)
  // updateUserBankAccountDocument(bankAccountInfo)
}

export const updateUserIne = async(data) => {
  if(data.bankAccountInfo.ineFront != "" && data.bankAccountInfo.ineBack != ""){
    const uid = data.uid;
    const ineFront = data.bankAccountInfo.ineFront;
    const ineBack = data.bankAccountInfo.ineBack;
    // console.log(ineOne)
    const ineFrontType = data.bankAccountInfo.ineFrontType;
    const ineBackType = data.bankAccountInfo.ineBackType;
    delete data.bankAccountInfo.ineFrontType;
    delete data.bankAccountInfo.ineBackType;
    const storage = getStorage();
    const storageRefINEFront = ref(storage, `bank-account/${uid}/ine_front.${docType(ineFrontType)}`);
    const storageRefINEBack = ref(storage, `bank-account/${uid}/ine_back.${docType(ineBackType)}`);
    
    /*  */
    try {
      uploadBytes(storageRefINEFront, ineFront, { contentType: ineFrontType }).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          data.bankAccountInfo.ineFront = downloadURL;
          // console.log('File available at', downloadURL);
          uploadBytes(storageRefINEBack, ineBack, { contentType: ineBackType }).then((snap) => {
            getDownloadURL(snap.ref).then((downloadURL) => {
              data.bankAccountInfo.ineBack = downloadURL;
              if(data.bankAccountInfo.bankStatement != ""){
                try {
                  // console.log(data)
                  updateUserBankAccountInfo(data)
                } catch (error) {
                  throw new Error(error)
                }
              }else{
                data.bankAccountInfo.bankStatement = "";
                try {
                  updateUserInfo(data);
                } catch (error) {
                  throw new Error(error)
                }
              }
            });
          });
        });
      });
  
    } catch (error) {
      console.log("Could not update document")
      throw new Error(error);
    }
    // console.log(bankAccountInfo)
    // updateUserBankAccountDocument(bankAccountInfo)
  }else{
    try {
      updateUserInfo(data);
    } catch (error) {
      throw new Error(error)
    }
  }
}