<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
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
  import Input from '$lib/components/Input.svelte';
  import Loader from '$lib/components/Loader.svelte';
  import Map from '$lib/components/Map.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { each } from 'svelte/internal';
  import { generatePDF, generateCSV, generateXLSX } from '$lib/hooks/exportDataToFile.js';
  import { updateTransactionStatus } from '$lib/hooks/updates.js'

  const dbCollection = "users-client";
  const dbTerminals = "terminals";
  const uid = $loggedInUser.uid;
  let transactions = [];
  let selectedTransactionId;
  let selectedTransaction = {};
  let transactionDetailView = false;
  let notFound = false;
  let notFoundMessage = "No se encontraron registros";
  let loading = false;

  let dateRangeStart, dateRangeEnd, ticketId;
  let pdfData, print = true;
  let salesTotal = 0;

  const localeParam = {
    language: 'es-MX',
    currency: {
      style: 'currency',
      currency: 'MXN'
    }
  }

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
    total: parseFloat(0),
    status: "pending"
  }

  let terminalData = {
    serialNumber: "",
    status: "active"
  }

  onMount(async () => {
		await fetchByDayButton()
	});

  const handleCreateTransaction = async() => {
    transactionForm.user = $loggedInUser;
    transactionForm.total = parseFloat(transactionForm.total)
    transactionForm.terminal = terminalData
    const terminalNumber = terminalData.serialNumber;
    delete transactionForm.user.transactions;
    
    // console.log(transactionForm)
    try {
      const docRef = doc(db, "terminals", terminalNumber);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      try {
            const data = docSnap.data()
            const statusTerminal = data.status;
            if (statusTerminal === "active") {
              try {
                await setDoc(doc(db, dbCollection, uid, "transactions", transactionForm.id), transactionForm);
                await setDoc(doc(db, dbTerminals, terminalNumber, "transactions", transactionForm.uuid), transactionForm);
                await updateDoc(doc(db,dbCollection, uid), {
                  total: increment(transactionForm.total),
                  toDeposit: increment(transactionForm.total)
                });
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
      id: "",
      uid: uid,
      cardNumber: "",
      date: Timestamp.now(),
      location: new GeoPoint(20.677034, -103.346984),
      total: parseFloat(0),
      status: "pending"
    }
    
    terminalData = {
      serialNumber: "",
      status: "active"
    }
    fetchByDayButton()
  }

  const transactionFound = () => {
    if(transactions.length <= 0){
      notFound = true;
    }else{
      notFound = false;
    }
    loading = false;
  }

  const fetchByDayButton = async() => {
    transactionDetailView = false;
    selectedTransaction = {};
    loading = true;
    //transactions = [];
    const curr = new Date;
    const today = new Date(curr.setDate(curr.getDate())).setHours(0,0,0,0); // Sets Date to today day at 00:00
    const tomorrow = new Date(curr.setDate(curr.getDate() + 1)).setHours(0,0,0,0); // Sets Date to tomorrow at 00:00

    /* console.log(new Date(today))
    console.log(new Date(tomorrow)) */
    const q = query(
      collection(db, dbCollection, uid, "transactions"), 
      //where('uid', '==', uid),
      orderBy('date', 'desc'),
      startAt(Timestamp.fromDate(new Date(tomorrow))), endAt(Timestamp.fromDate(new Date(today))),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });
    transactionFound();
    //console.log(transactions)
  }

  const fetchByWeekButton = async() => {
    transactionDetailView = false;
    selectedTransaction = {};
    loading = true;
    const curr = new Date;
    const firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay()+1)).setHours(0,0,0,0);
    const lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay()+7)).setHours(0,0,0,0);
    const first = Timestamp.fromDate(new Date(firstDay));
    const last = Timestamp.fromDate(new Date(lastDay));

    const q = query(
      collection(db, dbCollection, uid, "transactions"), 
      //where('uid', '==', uid),
      orderBy('date', 'desc'),
      startAt(last), endAt(first),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });
    transactionFound();
    //console.log(transactions)
  }

  const fetchByMonthButton = async() => {
    transactionDetailView = false;
    selectedTransaction = {};
    loading = true;
    //transactions = [];
    const curr = new Date;
    const currentMonth = new Date(curr.setMonth(curr.getMonth(), 1)).setHours(0,0,0,0); // Sets Date to actual month day 1 at 00:00
    const nextMonth = new Date(curr.setMonth(curr.getMonth() + 1, 1)).setHours(0,0,0,0); // Sets Date to next month day 1 at 00:00

    const q = query(
      collection(db, dbCollection, uid, "transactions"),
      orderBy('date', 'desc'),
      startAt(Timestamp.fromDate(new Date(nextMonth))), endAt(Timestamp.fromDate(new Date(currentMonth))),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });
    transactionFound();
    //console.log(transactions)
  }

  const fetchByDateRange = async() => {
    transactionDetailView = false;
    selectedTransaction = {};
    loading = true;
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/; // String pattern replace for date
    const startRange = new Date(dateRangeStart.replace(pattern,'$2-$3-$1')).setHours(0,0,0,0);//Sets the date pattern and time to 00:00
    const endRange = new Date(dateRangeEnd.replace(pattern,'$2-$3-$1')).setHours(23,59,59,59);//Sets the date pattern and time to 23:59
    
    const q = query(
      collection(db, dbCollection, uid, "transactions"),
      orderBy('date', 'desc'),
      startAt(Timestamp.fromDate(new Date(endRange))), endAt(Timestamp.fromDate(new Date(startRange))),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });
    transactionFound();
    //console.log(transactions)
  }

  const fetchByTicketId = async() => {
    transactionDetailView = false;
    selectedTransaction = {};
    loading = true;
    //console.log(ticketId)
    const q = query(
      collection(db, dbCollection, uid, "transactions"), 
      where('id', '==', ticketId),
      orderBy('date', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });
    transactionFound();
    //console.log(transactions)
  }

  const sortObject = (data) => {
    const transactionsNew = data.map(element => {
      return {
        date: element.date.toDate().toLocaleDateString(),
        id: element.id,
        status: element.status,
        total: parseInt(element.total)
      }
    })
    return transactionsNew;
  }

  const exportDataToPDF = async() => {
    //alert("PDF")
    generatePDF(transactions, $loggedInUser)
  }

  const exportDataToExcel = async() => {
    // alert("Excel")
    const data = sortObject(transactions);
    // console.log(data)
    generateXLSX(data);
  }

  const exportDataToCSV = async() => {
    // alert("CSV")
    const data = sortObject(transactions);
    // console.log(data)
    generateCSV(data)
  }

  const reverseTransaction = async(transaction) => {
    transaction.total = parseFloat(transaction.total);
    transaction.status = "refund";
    // console.log(transaction)
    await updateTransactionStatus(transaction);
    transactionDetailView = false;
    fetchByDayButton();
  }
  
</script>

{#if $isLoggedIn}
  {#if loading == true}
    <Loader/>
    {:else}
    <div class="page-title">
      <h1>Mis Ventas</h1>
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
          <Input label="Guardar Transacción" id="submit-transaction" bind:value={transactionForm.total} 
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
      <div class="transactions-view">
        <div class="transaction-search-bar">
          <Input label="Buscar por ticket:" id="ticket-id-search" bind:value={ticketId} type="text" icon=""/>
          <Input on:click={fetchByTicketId} label="" id="by-ticketId-button" type="button" className="button {ticketId != "" ? '' : 'disabled'}" icon="search"/>
        </div>
        <div class="transaction-options">
          <div class="fetch-data-buttons">
            <Input on:click={fetchByDayButton} label="Por Día" id="by-day-button" type="button" className="button" icon=""/>
            <Input on:click={fetchByWeekButton} label="Por Semana" id="by-week-button" type="button" className="button" icon=""/>
            <Input on:click={fetchByMonthButton} label="Por Mes" id="by-month-button" type="button" className="button" icon=""/>
          </div>
          <div class="date-range-input">
            <Input label="Fecha Inicial" id="date-range-start" bind:value={dateRangeStart} type="date"/>
            <Input label="Fecha Final" id="date-range-end" bind:value={dateRangeEnd} type="date"/> 
          </div>
          <div>
            <Input on:click={fetchByDateRange} label="Buscar " id="by-range-button" type="button" className="button {dateRangeStart != "" && dateRangeEnd != "" ? '' : 'disabled'}" icon="search"/>
          </div>
        </div>
        {#if notFound}
          <div class="not-found">
            <h1>
              {notFoundMessage}
            </h1>
          </div>
          {:else}
            {#if !transactionDetailView}
              <div class="transaction-tables">
                <div bind:this={pdfData} id="pdfTable" class="table-container">
                  <table class="table-content">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Total</th>
                        <th>Estatus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each transactions as transaction}
                        <tr>
                          <td>
                            <Input
                              id='detailsTicket{transaction.id}'
                              title="Ver Detalles"
                              on:click={() => (selectedTransaction = transaction)}
                              on:click={() => (transactionDetailView = true)}
                              label={transaction.id} type="button" className="text-button" icon=""/>
                          </td>
                          <td>{parseFloat(transaction.total).toLocaleString(localeParam.language, localeParam.currency)}</td>
                          <td>{transaction.status}</td>
                        </tr>
                      {/each}
                        <tr>
                          <td><b>Total Ventas</b></td>
                          <td>
                            {
                              transactions.reduce((prev, curr) => prev + parseInt(curr.total), 0)
                              .toLocaleString(localeParam.language, localeParam.currency)
                            }
                          </td>
                        </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="divider"> Exportar </div>
                {#if transactions.length > 0}
                  <div class="export-buttons">
                    <Input on:click={exportDataToPDF} label="Exportar a PDF" id="pdf-export" type="button" className="button" icon=""/>
                    <Input on:click={exportDataToExcel} label="Exportar a Excel" id="excel-export" type="button" className="button" icon=""/>
                    <Input on:click={exportDataToCSV} label="Exportar a CSV" id="csv-export" type="button" className="button" icon=""/>
                  </div>
                {/if}
              {:else}
              <div class="transaction-details">
                <div class="return">
                  <Input on:click={() => (transactionDetailView = false)} label="Regresar" id="detailsReturnButton" type="button" className="button" icon=""/>
                </div>
                <div class="page-title">
                  <h2>Detalles de transacción</h2>
                </div>
                <table class="table-content">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Total</th>
                      <th>Estatus</th>
                      <th>Localización</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedTransaction.id}</td>
                      <td>{parseFloat(selectedTransaction.total).toLocaleString(localeParam.language, localeParam.currency)}</td>
                      <td>{selectedTransaction.status}</td>
                      <td>
                        <a 
                          target="_blank" rel="noopener noreferrer" 
                          href={`https://www.google.com/maps/place/${selectedTransaction.location._lat}+${selectedTransaction.location._long}`}
                        >
                          Ver en Maps
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Input on:click={reverseTransaction(selectedTransaction)} label="Reembolsar" id="csv-export" type="button" className="button" icon=""/>
                <!-- <div>
                  <Map location={selectedTransaction.location}/>
                </div> -->
              </div>
            {/if}
        {/if}
      </div>
    </div>
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

  .transactions-view {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .transaction-search-bar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 1rem;
  }

  .transaction-options {
    display: flex;
    justify-content: center;
    flex-direction: row;
  }

  .fetch-data-buttons {
    display: flex;
    justify-content: center;
    flex-direction: row;
  }

  .date-range-input {
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 1060px) {
    .fetch-data-buttons {
      flex-direction: column;
      transition: all 0.5s ease;
    }
  }

  .export-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .not-found {
    display: flex;
    justify-content: center;
  }
  .transaction-tables {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .table-container {
    width: 100%;
  }

  .table-content {
    width: 100%;
    /* border-bottom: 1px solid; */
    border-collapse: collapse;
    padding: 1rem 1rem;
  }

  .table-content th, .table-content td {
    text-align: center;
    border-bottom: 1px solid;
    padding: .5rem .5rem;
  }

</style>