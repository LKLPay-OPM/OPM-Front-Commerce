<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  import { fetchRates } from '$lib/hooks/rates.js'
  //import * as firebase from 'firebase/firestore';
  import { 
    onSnapshot, 
    collection,
    collectionGroup,
    getDoc,
    setDoc, 
    updateDoc,
    doc, 
    Timestamp, 
    GeoPoint,
    query,
    orderBy,
    limit,
    where,
    getDocs,
    startAt,
    endAt,
    arrayUnion,
    increment
  } from 'firebase/firestore';
  import { db } from "$lib/firebase";
  import RedirectLogin from '$lib/components/RedirectLogin.svelte';
  import RedirectHome from '$lib/components/RedirectHome.svelte';
  import Input from '$lib/components/Input.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import Select from '$lib/components/Select.svelte';
  import Map from '$lib/components/Map.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { each } from 'svelte/internal';
  import { generatePDF, generateCSV, generateXLSX } from '$lib/hooks/exportDataToFile.js';
  import { updateTransactionStatus } from '$lib/hooks/updates.js'
  import { fetchUserData } from '$lib/hooks/auth.js'

  const dbCollection = "users-client";
  const dbTerminals = "terminals";
  const uid = $loggedInUser.uid;
  let loading = false;
  let rates = [];
  let rate;

  const makeId = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  let transactionForm = {
    uuid: makeId(10),
    id: "",
    cardNumber: "",
    date: Timestamp.now(),
    location: new GeoPoint(20.677034, -103.346984),
    total: 0,
    status: "pending"
  }

  let terminalData = {
    serialNumber: ""
  }

  const handleCreateTransaction = async() => {
    rate = rate/100
    transactionForm.user = $loggedInUser;
    transactionForm.total = parseFloat(transactionForm.total);
    transactionForm.commission = Math.round((transactionForm.total*(rate))*100)/100
    transactionForm.dispersion = Math.round((transactionForm.total - transactionForm.commission)*100)/100
    transactionForm.id = transactionForm.id.toString();
    const terminalNumber = terminalData.serialNumber.toString();
    delete transactionForm.user.transactions;
    
    console.log(transactionForm)
    try {
      const docRef = doc(db, "terminals", terminalNumber);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        try {
          const data = docSnap.data()
          const statusTerminal = data.status;
          transactionForm.terminal = data;
          if (statusTerminal === "active") {
            try {
              await setDoc(doc(db, dbCollection, uid, "transactions", transactionForm.id), transactionForm)
              .then(async() => {
                await setDoc(doc(db, dbTerminals, terminalNumber, "transactions", transactionForm.uuid), transactionForm)
              })
              .then(async() => {
                await updateDoc(doc(db,dbCollection, uid), {
                  total: increment(transactionForm.total),
                  toDeposit: increment(transactionForm.dispersion),
                  totalCommissions: increment(transactionForm.dispersion)
                })
              })
              .then(async() => {
                await fetchUserData(uid)
              })
              .catch((err) => {
                throw new Error(err)  
              })
            } catch (error) {
              throw new Error(error)
            }
          }else {
            throw new Error("La terminal está desactivada")
          }
        } catch (error) {
          throw new Error(error);
        }
      }
    } catch (error) {
      throw new Error(error)
    }
    
    //console.log(transactionForm);
    transactionForm = {
      uuid: makeId(10),
      id: "",
      uid: uid,
      cardNumber: "",
      date: Timestamp.now(),
      location: new GeoPoint(20.677034, -103.346984),
      total: 0,
      status: "pending"
    }
    
    terminalData = {
      serialNumber: "",
    }
    // fetchByDayButton()
  }

  const fetchDBRates = () => {
    try {
      const fetch = fetchRates()
      fetch.then((value) => {
        if($loggedInUser.accountType === "basic"){
          rates.push({name: "American Express", value: Math.round(((value.ratesBusinessType[$loggedInUser.businessLine].amex + value.rateLklPay)-($loggedInUser.ratesDiscount.amex)) * 100) / 100})
          rates.push({name: "Crédito", value: Math.round(((value.ratesBusinessType[$loggedInUser.businessLine].credit + value.rateLklPay)-($loggedInUser.ratesDiscount.credit)) * 100) / 100})
          rates.push({name: "Débito", value: Math.round(((value.ratesBusinessType[$loggedInUser.businessLine].debit + value.rateLklPay)-($loggedInUser.ratesDiscount.debit)) * 100) / 100})
          console.log(rates)
        }else{
          rates.push({name: "American Express", value: Math.round(((value.ratesBusinessType[$loggedInUser.businessLine].amex + value.rateNatural)-($loggedInUser.ratesDiscount.amex)) * 100) / 100})
          rates.push({name: "Crédito", value: Math.round(((value.ratesBusinessType[$loggedInUser.businessLine].credit + value.rateNatural)-($loggedInUser.ratesDiscount.credit)) * 100) / 100})
          rates.push({name: "Débito", value: Math.round(((value.ratesBusinessType[$loggedInUser.businessLine].debit + value.rateNatural)-($loggedInUser.ratesDiscount.debit)) * 100) / 100})
          rates = [...rates]
          console.log(rates)
        }
      }).catch(err => {
        console.log(err);
        throw new Error(err)
      });
    } catch (error) {
      console.log(err);
      throw new Error(error)
    }
  }

	onMount(() => {
    fetchDBRates();
	});
</script>

{#if $isLoggedIn}
  {#if loading == true}
    <Loader/>
    {:else if $loggedInUser.businessLine != "" && $loggedInUser.accountType != ""}
    <div class="page-title">
      <h1>Nueva Venta</h1>
    </div>
    <div class="transactions">
      <div class="transaction-form">
        <form on:submit|preventDefault={handleCreateTransaction}>
          <div>
            <span><b>UUID </b>{transactionForm.uuid}</span>
          </div>
          <Input label="No. de Serie de la Terminal" id="transaction-id" bind:value={terminalData.serialNumber} className="txt-field normal" type="text"/>
          <Input label="ID" id="transaction-id" bind:value={transactionForm.id} className="txt-field normal" type="text"/>
          <Input label="Número de Tarjeta" id="transaction-card-number" bind:value={transactionForm.cardNumber} className="txt-field normal" type="text"/>
          <Input label="Total" id="transaction-total" bind:value={transactionForm.total} className="txt-field normal" type="number"/>
          {#if rates.length > 0}
            <Select bind:value={rate} label="Tarjeta" defaultText={"Elige una opción"} bind:optionsList={rates}/>
          {/if}
          <Input label="Guardar Transacción" id="submit-transaction" 
            className={`btn 
              ${
                transactionForm.terminalSerialNumber != "" &&
                transactionForm.id != "" &&
                transactionForm.cardNumber != "" &&
                transactionForm.total > 0 ?
                "" : "btn-disabled"
              }
            `} 
            type="submit"/>
        </form>
      </div>
    </div>
    {:else if $loggedInUser.businessLine === "" && $loggedInUser.accountType === ""}
    <RedirectHome/>
  {/if}
  {:else}
  <RedirectLogin/>
{/if}


<style>
  .transactions {
    /* display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: right; */
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }
  .transaction-form {
    display: flex;
    margin: 2rem;
    /* width: 50%; */
    justify-content: center;
  }
</style>