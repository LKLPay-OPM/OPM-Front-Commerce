import { db } from "$lib/firebase";
import { doc, setDoc, getDoc, getDocs, query, updateDoc, collection } from "firebase/firestore";
let dbCollection = "rates";

export const fetchRates = async() => {
  const q = query(collection(db, dbCollection));
  const querySnapshot = await getDocs(q);
  const rates = querySnapshot.docs.map((doc) => {
    return {...doc.data()}
  });
  // console.log(rates[0])
  return rates[0]
}