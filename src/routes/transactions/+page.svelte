<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  //import * as firebase from 'firebase/firestore';
  import { 
    onSnapshot, 
    collection,
    collectionGroup,
    setDoc, 
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
  } from 'firebase/firestore';
  import { db } from "$lib/firebase";
  import RedirectLogin from '$lib/components/RedirectLogin.svelte';
  import Input from '$lib/components/Input.svelte';
  import { onDestroy } from 'svelte';
  import { each } from 'svelte/internal';

  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  let transactions = [];
  let selectedTransactionId;
  let selectedTransaction = {};
  let transactionDetailView = false;
  let notFound = false;
  let notFoundMessage = "No se encontraron registros";
  let loading = false;

  let dateRangeStart, dateRangeEnd, ticketId;

  /* const fetchTransactions = onSnapshot(
    collection(db, dbCollection, uid, "transactions"),
    (snapshot) => {
      transactions = snapshot.docs.map((doc) => {
        return {...doc.data()};
      });
      let transactionsList = transactions;
    },
    (err) => {
      throw new Error(err);
    }
  );
  onDestroy(fetchTransactions); */

  let transactionForm = {
    id: parseFloat(0),
    uid: uid,
    cardNumber: "",
    date: Timestamp.now(),
    location: new GeoPoint(90, 90),
    total: parseFloat(0),
    status: "pending"
  }

  const handleCreateTransaction = async() => {
    await setDoc(doc(db, dbCollection, uid, "transactions", transactionForm.id.toString()), transactionForm);
    //console.log(transactionForm);
    transactionForm = {
      id: parseFloat(0),
      uid: uid,
      cardNumber: "",
      date: Timestamp.now(),
      location: new GeoPoint(90, 90),
      total: parseFloat(0),
      status: "pending"
    }
  }

  const transactionFound = () => {
    if(transactions.length <= 0){
      notFound = true;
    }else{
      notFound = false;
    }
  }

  const fetchByDayButton = async() => {
    transactionDetailView = false;
    selectedTransaction = {};
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

</script>

{#if $isLoggedIn}
  <div class="transactions">
    <div class="transaction-form">
      <form on:submit|preventDefault={handleCreateTransaction} class="card-body">
        <Input label="ID:" id="transaction-id" bind:value={transactionForm.id} type="number"/>
        <Input label="Card Number:" id="transaction-card-number" bind:value={transactionForm.cardNumber} type="text"/>
        <Input label="Total:" id="transaction-total" bind:value={transactionForm.total} type="number"/>
        <button type="submit" class="btn btn-auth-form">Guardar Transacción</button>
      </form>
    </div>
    <div class="transactions-view">
      <div class="transaction-search-bar">
        <Input label="Buscar por ticket:" id="ticket-id-search" bind:value={ticketId} type="text"/>
        {#if ticketId != ""}
          <button on:click|preventDefault={fetchByTicketId} class="btn btn-auth-form">Buscar</button>
        {/if}
      </div>
      <div class="transaction-options">
        <button on:click|preventDefault={fetchByDayButton} class="btn btn-auth-form">Por Día</button>
        <button on:click|preventDefault={fetchByWeekButton} class="btn btn-auth-form">Por Semana</button>
        <button on:click|preventDefault={fetchByMonthButton} class="btn btn-auth-form">Por Mes</button>
        <div class="date-range-input">
          <Input label="Fecha Inicial" id="date-range-start" bind:value={dateRangeStart} type="date"/>
          <Input label="Fecha Final" id="date-range-end" bind:value={dateRangeEnd} type="date"/> 
        </div>
        {#if dateRangeStart != "" && dateRangeEnd != ""}
          <button on:click|preventDefault={fetchByDateRange} class="btn btn-auth-form">Buscar</button>
        {/if}
      </div>
      {#if notFound}
        <div>
          <h1>
            {notFoundMessage}
          </h1>
        </div>
        {:else}
          {#if !transactionDetailView}
            <div class="transaction-tables">
              {#each transactions as transaction}
                <table class="table-content">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Total</th>
                      <th>Estatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{transaction.id}</td>
                      <td>{transaction.total}</td>
                      <td>{transaction.status}</td>
                      <td>
                        <button 
                          on:click|preventDefault={() => (selectedTransaction = transaction)}
                          on:click|preventDefault={() => (transactionDetailView = true)}
                        >
                          Detalles
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              {/each}
            </div>
            {:else}
              <div class="transaction-details">
                <button
                  on:click|preventDefault={() => (selectedTransaction = {})}
                  on:click|preventDefault={() => (transactionDetailView = false)}
                >
                  Regresar
                </button>
                <table class="table-content">
                  <h1>Detalles de transacción</h1>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Total</th>
                      <th>Estatus</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{selectedTransaction.id}</td>
                      <td>{selectedTransaction.total}</td>
                      <td>{selectedTransaction.status}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
          {/if}
      {/if}
    </div>
  </div>
  {:else}
  <RedirectLogin/>
{/if}


<style>
  .transactions {
    display: flex;
    flex-direction: column;
    width: 90%;
    justify-content: right;
  }
  .transaction-form {
    margin: 2rem;
    width: 80%;
  }

  .transactions-view {
    display: flex;
    width: 80%;
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
    flex-direction: row;
  }

  .date-range-input {
    display: flex;
    flex-direction: column;
  }

  .transaction-tables {
    justify-content: center;
  }

  .table-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

</style>