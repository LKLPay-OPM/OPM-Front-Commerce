<script>
  import {
    collection,
    Timestamp,
    query,
    orderBy,
    limit,
    where,
    getDocs,
    startAt,
    endAt,
  } from 'firebase/firestore';
  import { isLoggedIn, loggedInUser, linkSelected } from '$lib/stores';
  import { onMount } from 'svelte';
  import { db } from "$lib/firebase";
  import InfoCard from '$lib/components/InfoCard.svelte';
  import Input from '$lib/components/Input.svelte';

  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  let transactions = [];
  let loading = false;
  let notFound = false;

  const localeParam = {
    language: 'es-MX',
    currency: {
      style: 'currency',
      currency: 'MXN'
    }
  }

  $: {
		fetchByDay()
  }

  const getMonthName = (month) => {
    const monthsArray = {
      "01": {value: "Enero"},
      "02": {value: "Febrero"},
      "03": {value: "Marzo"},
      "04": {value: "Abril"},
      "05": {value: "Mayo"},
      "06": {value: "Junio"},
      "07": {value: "Julio"},
      "08": {value: "Agosto"},
      "09": {value: "Septiembre"},
      "10": {value: "Octubre"},
      "11": {value: "Noviembre"},
      "12": {value: "Diciembre"},
    }
    return monthsArray[month].value
  }

  const getMonth = (month) => {
    const monthsArray = {
      0: {value: "Enero"},
      1: {value: "Febrero"},
      2: {value: "Marzo"},
      3: {value: "Abril"},
      4: {value: "Mayo"},
      5: {value: "Junio"},
      6: {value: "Julio"},
      7: {value: "Agosto"},
      8: {value: "Septiembre"},
      9: {value: "Octubre"},
      10: {value: "Noviembre"},
      11: {value: "Diciembre"},
    }
    return monthsArray[month].value
  }

  const transactionFound = () => {
    if(transactions.length <= 0){
      notFound = true;
    }else{
      notFound = false;
      console.log(transactions)
    }
    loading = false;
  }

  const fetchByDay = async() => {
    loading = true;
    var pattern = /(\d{2})\/(\d{2})\/(\d{2})/; // String pattern replace for date
    //transactions = [];
    const curr = new Date;
    const today = new Date(curr.setDate(curr.getDate())).setHours(0,0,0,0); // Sets Date to today day at 00:00
    const tomorrow = new Date(curr.setDate(curr.getDate() + 1)).setHours(0,0,0,0); // Sets Date to tomorrow at 00:00
    // Dates in dd/MM/YY
    const strToday = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(today);
    const strTomorrow = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(tomorrow);

    const q = query(
      collection(db, dbCollection, uid, "transactions"), 
      //where('uid', '==', uid),
      orderBy('Transaction Date', 'desc'),
      startAt(strTomorrow.replace(pattern,'$3$2$1')/* Timestamp.fromDate(new Date(tomorrow)) */), endAt(strToday.replace(pattern,'$3$2$1')/* Timestamp.fromDate(new Date(today)) */),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });
    transactionFound();
  }

  const getTransactionDate = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, '$2')
    const month = getMonthName(extractMonth)
    let str = string.replace(pattern, `$3 ${month} 20$1`)
    // console.log(str)
    return str
  }

  const getTransactionTime = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    let str = string.replace(pattern, `$1:$2:$3`)
    // console.log(str)
    return str
  }

  /* onMount(async () => {
		fetchByDay()
	}); */
</script>
<div class="container">
  <div class="title">
    <p class="">Resumen</p>
  </div>
  <div class="subtitle">
    <p>
      Tu Información al día de hoy
    </p>
  </div>
  <div class="content">
    <div class="card-group">
      <div class="card">
        <InfoCard className={""} title="Total Vendido" numData={transactions.reduce((prev, curr) => prev + (curr['Amount']/100), 0)?.toLocaleString(localeParam.language, localeParam.currency)}/>
      </div>
      <div class="card">
        <InfoCard className={""} title="N° de Ventas" numData={transactions.length}/>
      </div>
      <div class="card">
        <InfoCard className={""} title="Saldo a Depositar" numData={transactions.reduce((prev, curr) => prev + (curr['Amount']/100)* 0.965, 0)?.toLocaleString(localeParam.language, localeParam.currency)}/>
      </div>
    </div>
    <div class="transactions">
      <div class="top">
        <div class="top__left">
          <p><a href="/transactions">Últimas Transacciones</a></p>
          <!-- <p>Transacciones recientes</p> -->
        </div>
        <!-- <div class="top__right">
          <a on:click={() => ($linkSelected = "Mis Ventas")} href="/transactions">Ver Transacciones ></a>
        </div> -->
      </div>
      {#if transactions?.length > 0}
        <div id="pdfTable" class="table-container">
          <table class="table-content">
            <thead>
              <tr>
                <th>Fecha</th>
                <th class="responsive">ID Transacción</th>
                <th>Cobro</th>
                <th class="responsive">Comisión</th>
                <th class="responsive">Dispersión</th>
              </tr>
            </thead>
            <tbody>
              {#each transactions as transaction}
                <tr>
                  <td>{getTransactionDate(transaction['Transaction Date'])+" - "+getTransactionTime(transaction['Transaction Time'])}<!-- {transaction.date?.toDate().getDate()} {getMonthName(transaction.date?.toDate().getMonth())} {transaction.date?.toDate().getFullYear()} - {transaction.date?.toDate().toLocaleTimeString()} --></td>
                  <td class="responsive">{transaction['Transaction Time']}</td>
                  <!-- <td>
                    <Input
                      id='detailsTicket{transaction.id}'
                      title="Ver Detalles"
                      on:click={() => (selectedTransaction = transaction)}
                      on:click={() => (transactionDetailView = true)}
                      label={transaction.id} type="button" className="text-button" icon=""/>
                  </td> -->
                  <td>{parseFloat(transaction.Amount/100)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                  <td class="responsive">{parseFloat((transaction.Amount/100) * 0.035)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                  <td class="responsive">{parseFloat((transaction.Amount/100) * 0.965)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                  <!-- <td>{parseFloat(transaction.total)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                  <td>{parseFloat(transaction.commission)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                  <td>{parseFloat(transaction.dispersion)?.toLocaleString(localeParam.language, localeParam.currency)}</td> -->
                </tr>
              {/each}
                <!-- <tr>
                  <td><b>Totales</b></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    {
                      transactions?.reduce((prev, curr) => prev + (curr['Amount']/100) * 0.965, 0)
                      .toLocaleString(localeParam.language, localeParam.currency)
                    }
                  </td>
                </tr> -->
            </tbody>
          </table>
        </div>
        {:else}
          <div class="message">
            <div class="msg">
              <p>No has realizado ventas el día de hoy</p>
            </div>
            <div class="description">
              <p>Aquí podrás ver el resumen de tus últimas ventas realizadas</p>
            </div>
          </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 2rem 2rem; /* 32px 32px */
  }

  .container .title p{
    font-style: normal;
    font-weight: 700;
    font-size: 1.5rem;/* 20px */
    line-height: 1.25rem;/* 20px */
    text-align: left;
    margin-left: 2rem;
    /* text-placeholder */
    color: #113A62;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .subtitle {
    margin: .5rem 0rem;
  }

  .subtitle p {
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    /* text-placeholder */
    color: #113A62;
  }

  .content .card-group {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    gap: 1rem;
  }

  .content .card-group .card {
    min-width: calc((80% / 4) - 2rem);
  }

  .transactions {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    padding: 2rem 0rem;/* 32px 0px */
    gap: 16px;
    margin: 0rem 4rem 2rem 4rem;/* 0px 64px */
    /* min-width: calc(80% - 20rem); */
    min-height: 25rem;/* 400px */
    /* Nue Fill */
    background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
    /* out */
    box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
  }
  .transactions .top {
    display: flex;
    width: -webkit-fill-available;
  }

  .transactions * .top__left {
    display: flex;
    width: 100%;
    justify-content: center;
    padding-left: 2rem;
  }
  .transactions .top .top__left p{
    font-weight: 700;
    font-size: 1.5rem;/* 24px */
    line-height: 20px;/* 20px */
    text-align: center;
    /* Text */
    color: #113A62;
  }

  .top__left * a {
    text-decoration: none;
    font-weight: 700;
    font-size: 1.5rem;/* 24px */
    line-height: 20px;/* 20px */
    text-align: center;
    /* Text */
    color: #113A62;
  }
  
  .transactions * .top__right {
    display: flex;
    width: 50%;
    justify-content: right;
    padding-right: 2rem;
  }
  .transactions .top .top__right a{
    font-weight: 500;
    font-size: 1.25rem;/* 20px */
    line-height: 1.25rem;/* 20px */
    text-decoration: none;
    text-align: center;
    /* Text */
    color: #113A62;
  }

  .table-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .table-content {
    /* width: 46.875rem; */
    width: 70%;
    /* border-bottom: 1px solid; */
    border-collapse: collapse;
    padding: 1rem 1rem;
  }
  
  .table-content thead {
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    text-align: left;
    /* text-placeholder */
    color: #8C9FB1;
    height: 2.375rem;
  }

  .table-content td {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #000000;
    text-align: center;
    border-bottom: 1px solid #8C9FB1;
    padding: .5rem .5rem;
    text-align: left;
  }

  .message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: inherit;
    gap: .5rem;
  }

  .message .msg{
    font-weight: 700;
    font-size: 1.25rem;/* 16px */
    line-height: 1.25rem;/* 20px */
    text-align: center;
    /* Text */
    color: #113A62;
  }
  .message .description{
    font-weight: 500;
    font-size: 1rem;/* 16px */
    line-height: 1.25rem;/* 20px */
    text-align: center;
    /* Text */
    color: #8C9FB1;
  }

  /* MEDIA QUERIES */
  @media (max-width: 540px) {
    .container {
      margin: 0;
    }

    .container .title p{
      margin: 0;
      text-align: center;
    }

    .content > .card-group,
    .transactions > .top {
      flex-direction: column;
      gap: 1rem;
    }

    .content > .transactions {
      margin: 0;
      min-height: auto;
    }

    .transactions * .top__right,
    .transactions * .top__left {
      width: 100%;
      padding: 0;
      justify-content: center;
    }

    .responsive {
      display: none;
    }
  }
</style>