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
  import { db } from "$lib/firebase";
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import DatePicker from '$lib/components/DatePicker.svelte';
  import { onMount } from 'svelte';
  import { generatePDF, generateCSV, generateXLSX } from '$lib/hooks/exportDataToFile.js';
  import { updateTransactionStatus } from '$lib/hooks/updates.js'

  export let user;
  const dbCollection = "users-client";
  const uid = user.uid;
  let transactions = [];
  let selectedTransaction = {};
  let transactionToArray = [];
  let transactionDetailView = false;
  let notFound = false;
  let notFoundMessage = "No se encontraron registros";
  let loading = false;
  let date = new Date;
  let active = "day";

  let dateRangeStart, dateRangeEnd, ticketId, modalDateFilter;
  let pdfData, print = true;

  const localeParam = {
    language: 'es-MX',
    currency: {
      style: 'currency',
      currency: 'MXN'
    }
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
    active = "day";
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
    active = "week";
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
    active = "month";
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
    active = "range";
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
      // limit(10)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });
    transactionFound();
    // console.log(transactions)
  }

  const fetchByTicketId = async() => {
    active = "ticket"
    transactionDetailView = false;
    selectedTransaction = {};
    loading = true;
    const ticket = ticketId.toString();
    const q = query(
      collection(db, dbCollection, uid, "transactions"), 
      where('id', '==', ticket),
      orderBy('date', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });
    transactionFound();
    console.log(transactions)
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

  const exportDataToPDF = async(transactions) => {
    //alert("PDF")
    // console.log(transactions)
    generatePDF(transactions, user)
  }

  const exportDataToExcel = async(transactions) => {
    // alert("Excel")
    const data = sortObject(transactions);
    // console.log(data)
    generateXLSX(data);
  }

  const exportDataToCSV = async(transactions) => {
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

  const getMonthName = (month) => {
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

  const showModal = (option) => {
    option.show();
  }

  const closeModal = (option) => {  
    option.closeModal();
  }
  
  onMount(async () => {
		await fetchByDayButton()
	});
</script>

<!-- MODAL FETCH BY DATE RANGE -->
<Modal className={`modal-medium`} bind:this={modalDateFilter}>
  <div slot="header">
    <p>Por Fechas</p>
  </div>
  <div slot="content">
    <div class="date-range-input">
      <DatePicker label="Del" id="date-range-start" bind:value={dateRangeStart}/>
      <DatePicker label="Al" id="date-range-end" bind:value={dateRangeEnd}/>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input on:click={closeModal(modalDateFilter)} label="Cerrar" id="buttonCloseModalUrgentDeposit" type="button" className="btn-plain" icon=""/>
    <Input 
      on:click={closeModal(modalDateFilter)} 
      on:click={() => fetchByDateRange()} 
      label="Filtrar" 
      id="buttonSaveModalUrgentDeposit" 
      type="button" 
      className={`btn-plain
        ${
          dateRangeStart != "" && dateRangeEnd != "" 
          ? "" : "disabled"
        }`
      } 
      icon=""
    />
  </div>
</Modal>

<div class="transactions">
  {#if !transactionDetailView}
    <div class="top">
      <div class="top__left">
        <div class="page-title">
          <h1>Ventas</h1>
        </div>
        <div class="buttons">
          {#if !transactionDetailView}
            <Input on:click={showModal(modalDateFilter)} label="Filtrar " id="openModalDateFilter" type="button" className="btn-plain" icon=""/>
          {/if}
          {#if transactionDetailView}
            <Input on:click={() => (transactionDetailView = false)} label="Regresar" id="detailsReturnButton" type="button" className="btn-plain" icon=""/>
          {/if}
        </div>
      </div>
      <div class="top__middle">
        <div class="date">
          <p>
            {date.getDate()} de {getMonthName(date.getMonth())} del {date.getFullYear()}
          </p>
        </div>
        <div class="button-group">
          <button on:click={fetchByDayButton} class={`button ${active === "day" ? "button-active" : ""}`} type="button">Día</button>
          <button on:click={fetchByWeekButton} class={`button ${active === "week" ? "button-active" : ""}`} type="button">Semana</button>
          <button on:click={fetchByMonthButton} class={`button ${active === "month" ? "button-active" : ""}`} type="button">Mes</button>
        </div>
        <div class="card-group">
          <div class="card">
            <div><p>Ventas Totales</p></div>
            <div><span>{user.total.toLocaleString(localeParam.language, localeParam.currency)}</span></div>
          </div>
          <div class="card">
            <div><p>Comisiones por Dispersar</p></div>
            <div><span>{user.toDeposit.toLocaleString(localeParam.language, localeParam.currency)}</span></div>
          </div>
          <div class="card">
            <div><p>Comisiones Cobradas</p></div>
            <div><span>{(user?.toDeposit - user?.totalCommissions).toLocaleString(localeParam.language, localeParam.currency)}</span></div>
          </div>
        </div>
      </div>
      <div class="top__right">
        <div class="transaction-search-bar">
          <Input placeholder="Buscar por ticket" id="ticket-id-search" bind:value={ticketId} className="txt-field normal" type="text" icon=""/>
          <Input on:click={fetchByTicketId} label="" id="byTicketId-button" type="button" className="btn-plain btn-round {ticketId != "" ? '' : 'disabled'}" icon="search"/>
        </div>
        <div class="export-buttons">
          <Input on:click={exportDataToCSV(transactions)} label="" id="csv-export" type="button" className="btn-plain btn-square {transactions.length > 0 ? '' : 'disabled'}" icon="csv-fill"/>
          <Input on:click={exportDataToExcel(transactions)} label="" id="excel-export" type="button" className="btn-plain btn-square {transactions.length > 0 ? '' : 'disabled'}" icon="xls-fill"/>
          <Input on:click={exportDataToPDF(transactions)} label="" id="pdf-export" type="button" className="btn-plain btn-square {transactions.length > 0 ? '' : 'disabled'}" icon="pdf-fill"/>
        </div>
      </div>
    </div>
  {/if}
  <div class="transactions-view">
    {#if notFound}
      <div class="not-found">
        <b>
          {notFoundMessage}
        </b>
      </div>
      {:else}
        {#if !transactionDetailView}
          <div class="transaction-tables">
            <div bind:this={pdfData} id="pdfTable" class="table-container">
              <table class="table-content">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>ID Transacción</th>
                    <th>Cobro</th>
                    <th>Comisión</th>
                    <th>Dispersión</th>
                  </tr>
                </thead>
                <tbody>
                  {#each transactions as transaction}
                    <tr>
                      <td>{transaction.date.toDate().getDate()} {getMonthName(transaction.date.toDate().getMonth())} {transaction.date.toDate().getFullYear()} - {transaction.date.toDate().toLocaleTimeString()}</td>
                      <td>
                        <Input
                          id='detailsTicket{transaction.id}'
                          title="Ver Detalles"
                          on:click={() => (selectedTransaction = transaction)}
                          on:click={() => (transactionDetailView = true)}
                          label={transaction.id} type="button" className="text-button" icon=""/>
                      </td>
                      <td>{parseFloat(transaction.total).toLocaleString(localeParam.language, localeParam.currency)}</td>
                      <td>{parseFloat(transaction.commission).toLocaleString(localeParam.language, localeParam.currency)}</td>
                      <td>{parseFloat(transaction.dispersion).toLocaleString(localeParam.language, localeParam.currency)}</td>
                    </tr>
                  {/each}
                    <tr>
                      <td><b>Totales</b></td>
                      <td></td>
                      <td>
                        {
                          transactions.reduce((prev, curr) => prev + parseInt(curr.total), 0)
                          .toLocaleString(localeParam.language, localeParam.currency)
                        }
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
          {:else}
          <div class="return">
            <Input on:click={() => (transactionDetailView = false)} label="Regresar" id="detailsReturnButton" type="button" className="btn-plain" icon=""/>
          </div>
          <div class="transaction-details">
            <div class="details__top">
              <b>Recibo #{selectedTransaction.id}</b>
              <p>
                {selectedTransaction.date.toDate().getDate()} de {getMonthName(selectedTransaction.date.toDate().getMonth())} del {selectedTransaction.date.toDate().getFullYear()} a las {selectedTransaction.date.toDate().toLocaleTimeString()}
              </p>
            </div>
            <div class="details__middle">
              <div class="details-left">
                <div class="title">Datos</div>
                <div class="item">
                  <b>Referencia</b>
                  <p>{selectedTransaction.uuid}</p>
                </div>
                <div class="item">
                  <b>TVR</b>
                  <p>0000000000</p>
                </div>
                <div class="item">
                  <b>AID</b>
                  <p></p>
                </div>
                <div class="item">
                  <b>TSI</b>
                  <p></p>
                </div>
                <div class="item">
                  <b>Tipo de Tarjeta</b>
                  <p>MASTERCARD</p>
                </div>
              </div>
              <div class="details-center">
                <div class="details-card">
                  <div class="details-card__top">
                    <b>Detalle de Venta</b>
                  </div>
                  <div class="details-card__middle">
                    <div class="item">
                      <b>Tarjeta Utilizada</b>
                      <p></p>
                    </div>
                    <div class="item">
                      <b>Tipo de Tarjeta</b>
                      <p></p>
                    </div>
                    <div class="item">
                      <b>Total de la Venta</b>
                      <p>{selectedTransaction.total.toLocaleString(localeParam.language, localeParam.currency)}</p>
                    </div>
                  </div>
                  <div class="details-card__bottom">
                    <div class="item">
                      <b>Comisión Lkl Pay</b>
                      <p>{selectedTransaction.commission.toLocaleString(localeParam.language, localeParam.currency)}</p>
                      <span>{`(${(selectedTransaction.commission/selectedTransaction.total)*100}%)`}</span>
                    </div>
                    <div class="item">
                      <b>Comisión por Operación</b>
                      <p><!-- {`(${selectedTransaction.total})`} -->()</p>
                      <span></span>
                    </div>
                    <div class="item">
                      <b>Total a Dispersión</b>
                      <p>{selectedTransaction.dispersion.toLocaleString(localeParam.language, localeParam.currency)}</p>
                      <span></span>
                    </div>
                  </div>
                </div>
                <div class="card-buttons">
                  <div class="reverse-button">
                    <Input on:click={reverseTransaction(selectedTransaction)} label="Reembolsar" id="reverseTransaction" type="button" className="btn-plain" icon=""/>
                  </div>
                  <div class="email-button">
                    <Input label="Enviar por e-mail" id="emailTransaction" type="button" className="btn-plain" icon=""/>
                  </div>
                  <div class="print-button">
                    <Input label="Imprimir Recibo" id="printTransaction" type="button" className="btn-plain" icon=""/>
                  </div>
                </div>
              </div>
              <div class="details-right">
                <div class="title">Reportes</div>
                <div class="export-buttons">
                  <Input on:click={
                    () => {
                      transactionToArray.push(selectedTransaction)
                      exportDataToCSV(transactionToArray)
                      transactionToArray = [];
                    }
                  } label="" id="csv-export" type="button" className="btn-plain btn-square " icon="csv-fill"/>
                  <Input on:click={
                    () => {
                      transactionToArray.push(selectedTransaction)
                      exportDataToCSV(transactionToArray)
                      transactionToArray = [];
                    }
                  } label="" id="excel-export" type="button" className="btn-plain btn-square " icon="xls-fill"/>
                  <Input on:click={
                    () => {
                      transactionToArray.push(selectedTransaction)
                      exportDataToCSV(transactionToArray)
                      transactionToArray = [];
                    }
                  } label="" id="pdf-export" type="button" className="btn-plain btn-square " icon="pdf-fill"/>
                </div>
              </div>
            </div>
          </div>
        {/if}
    {/if}
  </div>
</div>

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

  .transactions .return {
    display: flex;
    width: 10rem;
    justify-content: left;
  }
  
  .top {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 2.5rem;
  }

  .top__left .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .top__middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .top__middle .date p {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.25rem;/* 20px */
    text-align: center;
    /* Text */
    color: #113A62;
  }

  .button-group {
    /* Component 1 */
    box-sizing: border-box;
    /* Auto layout */
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px;
    width: 134px;
    height: 38px;
    /* Nue Fill */
    background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    /* Inside auto layout */
    flex: none;
    order: 1;
    flex-grow: 0;
    border: 1px solid #FFFFFF
  }

  .button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px;
    gap: 10px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
    outline:none;
    border: none;
    cursor: pointer;

    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    /* identical to box height */


    /* text-placeholder */

    color: #8C9FB1;


    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .button:first-child {
    border-radius: 5px 0px 0px 5px;
    border-right: none;
  }
  .button:last-child {
    border-right: none;
    border-radius: 0px 5px 5px 0px;
  }

  .button-active {
    height: 22px;
    background: linear-gradient(317.7deg, rgba(0, 0, 0, 0.2) 0%, rgba(255, 255, 255, 0.2) 105.18%), #007AFF;
    background-blend-mode: soft-light, normal;
    /* inner blue */
    box-shadow: inset -5px -5px 8px rgba(56, 151, 255, 0.75), inset 5px 5px 7px rgba(29, 79, 133, 0.5);

    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    /* identical to box height */
    display: flex;
    align-items: center;
    color: #FFFFFF;
    mix-blend-mode: normal;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
  
  }

  .card-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 24px;

    width: 610px;
    height: 88px;


    /* Inside auto layout */

    flex: none;
    order: 2;
    flex-grow: 0;
  }

  .card-group .card{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 16px;
    width: 166px;
    height: 88px;
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

  .card-group .card p {
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    /* text-placeholder */
    color: #8C9FB1;
  }

  .card-group .card span {
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 20px;
    text-align: center;
    /* Text */
    color: #113A62;
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
    align-items: center;
    gap: 1rem;
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
    justify-content: center;
  }

  .export-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0rem;
  }
  .not-found {
    display: flex;
    justify-content: center;
  }
  .not-found b {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.25rem;/* 20px */
    text-align: center;
    /* Text */
    color: #113A62;
  }
  .transaction-tables {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
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
    font-family: 'Raleway';
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

  .modal-buttons{
    width: 50%;
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
  }

  .transaction-details {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .details__top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .details__top b{
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.25rem;
    color: #113A62;
  }
  .details__top p{
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.25rem;
    color: #8C9FB1;
  }

  .details__middle {
    width: 100%;
    display: flex;
    gap: 2rem;
    justify-content: space-evenly;
  }

  .details__middle .details-left .title {
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.125rem;
    color: #113A62;
  }

  .details__middle .details-left .item b {
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }
  .details__middle .details-left .item p {
    font-style: normal;
    font-weight: 700;
    font-size: .875rem;/* 14px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }

  .details__middle .details-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;/* 16px */
    gap: 2rem;/* 32px */
    width: 26.75rem;/* 428px */
    height: 13.125rem;/* 210px */
    /* Fill Container */
    background: #F3F3F3;
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
  }

  .details__middle .details-center .details-card .details-card__top b{
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
  }
  .details__middle .details-center .details-card .details-card__middle{
    display: flex;
    flex-direction: row;
    gap: 2rem;
  }
  .details__middle .details-center .details-card .details-card__middle .item b{
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
  }

  .details__middle .details-center .details-card .details-card__middle .item p{
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
  }
  .details__middle .details-center .details-card .details-card__bottom{
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
  .details__middle .details-center .details-card .details-card__bottom .item b{
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: 1.125rem;/* 18px */
    color: #8C9FB1;
  }

  .details__middle .details-center .details-card .details-card__bottom .item p{
    font-style: normal;
    font-weight: 700;
    font-size: .875rem;/* 14px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
    text-align: center;
  }

  .details__middle .details-center .details-card .details-card__bottom .item span{
    display: flex; 
    justify-content: center;
    font-style: normal;
    font-weight: 500;
    font-size: .625rem;/* 10px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }

  .details__middle .details-center .card-buttons {
    width: 100%;
    display: flex;
    margin-top: 2rem;
    gap: 1rem;/* 16px */
    justify-content: center;
  }
  .details__middle .details-center .card-buttons .reverse-button {
    display: flex;
    width: 6rem; /* 80px */
  }
  .details__middle .details-center .card-buttons .email-button {
    display: flex;
    width: 7.5rem; /* 120px */
  }
  .details__middle .details-center .card-buttons .print-button {
    display: flex;
    width: 7.5rem; /* 120px */
  }

  .details__middle .details-right .title {
    display: flex;
    justify-content: center;
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.125rem;
    color: #113A62;
  }

  .details__middle .details-right .item b {
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }
  .details__middle .details-right .item p {
    font-style: normal;
    font-weight: 700;
    font-size: .875rem;/* 14px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }/* 
  .details-footer {
    margin: 1rem 0rem;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .details-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  } */
</style>