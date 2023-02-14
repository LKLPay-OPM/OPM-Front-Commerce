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
  import Select from '$lib/components/Select.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import ButtonGroup from '$lib/components/ButtonGroup.svelte';
  import { onMount } from 'svelte';
  import { generatePDF, generateCSV, generateXLSX } from '$lib/hooks/exportDataToFile.js';
  import { updateTransactionStatus } from '$lib/hooks/updates.js'
  import Icons from './Icons.svelte';

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

  let dateRangeStart, dateRangeEnd, ticketId, modalDateFilter, modalClarification;
  let pdfData, print = true;

  let clarificationsList = [
    {name: "Opción 1", value: "option1"},
    {name: "Opción 2", value: "option2"},
    {name: "Opción 3", value: "option3"},
    {name: "Opción 4", value: "option4"}
  ]

  let clarification = {
    type: "",
    description: "",
  }

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
      // transactions = JSON.parse(JSON.stringify(transactions).replace(/"\s+|\s+"/g,'"'))
      console.log(transactions)
    }
    loading = false;
  }

  const fetchByDayButton = async() => {
    active = "day";
    transactionDetailView = false;
    selectedTransaction = {};
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
    // console.log(transactions)
  }

  const fetchByWeekButton = async() => {
    active = "week";
    transactionDetailView = false;
    selectedTransaction = {};
    loading = true;
    var pattern = /(\d{2})\/(\d{2})\/(\d{2})/; // String pattern replace for date
    const curr = new Date;
    const firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay()+1)).setHours(0,0,0,0);
    const lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay()+7)).setHours(0,0,0,0);
    // const first = Timestamp.fromDate(new Date(firstDay));
    // const last = Timestamp.fromDate(new Date(lastDay));
    const first = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(firstDay);
    const last = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(lastDay);

    const q = query(
      collection(db, dbCollection, uid, "transactions"), 
      //where('uid', '==', uid),
      orderBy('Transaction Date', 'desc'),
      startAt(last.replace(pattern,'$3$2$1')), endAt(first.replace(pattern,'$3$2$1')),
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
    var pattern = /(\d{2})\/(\d{2})\/(\d{2})/; // String pattern replace for date
    //transactions = [];
    const curr = new Date;
    const currentMonth = new Date(curr.setMonth(curr.getMonth(), 1)).setHours(0,0,0,0); // Sets Date to actual month day 1 at 00:00
    const nextMonth = new Date(curr.setMonth(curr.getMonth() + 1, 1)).setHours(0,0,0,0); // Sets Date to next month day 1 at 00:00

    const first = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(currentMonth);
    const last = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(nextMonth);

    const q = query(
      collection(db, dbCollection, uid, "transactions"),
      orderBy('Transaction Date', 'desc'),
      startAt(last.replace(pattern,'$3$2$1')/* Timestamp.fromDate(new Date(nextMonth)) */), endAt(first.replace(pattern,'$3$2$1')/* Timestamp.fromDate(new Date(currentMonth)) */),
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
    var patternFetch = /(\d{2})\/(\d{2})\/(\d{2})/; // String pattern replace fetch date
    const startRange = new Date(dateRangeStart.replace(pattern,'$2-$3-$1')).setHours(0,0,0,0);//Sets the date pattern and time to 00:00
    const endRange = new Date(dateRangeEnd.replace(pattern,'$2-$3-$1')).setHours(23,59,59,59);//Sets the date pattern and time to 23:59

    const first = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(startRange);
    const last = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(endRange);

    // console.log(first)
    // console.log(last)
    
    const q = query(
      collection(db, dbCollection, uid, "transactions"),
      orderBy('Transaction Date', 'desc'),
      startAt(last.replace(patternFetch,'$3$2$1')/* Timestamp.fromDate(new Date(endRange)) */), endAt(first.replace(patternFetch,'$3$2$1')/* Timestamp.fromDate(new Date(startRange)) */),
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
      where('Transaction Time', '==', ticket),
      orderBy('Transaction Date', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    transactions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });
    transactionFound();
    // console.log(transactions)
  }

  const sortObject = (data) => {
    const transactionsNew = data.map(element => {
      return {
        date: element.date?.toDate().toLocaleDateString(),
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

  const handleClarification = () => {
    console.log(clarification)
  }

  let buttonGroupOptions = [
    {value: "day", name: "Día", click: fetchByDayButton},
    {value: "week", name: "Semana", click: fetchByWeekButton},
    {value: "month", name: "Mes", click: fetchByMonthButton},
  ]

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

  const dateToLocalString = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, '$2')
    const month = getMonthName(extractMonth)
    let str = string.replace(pattern, `$3 de ${month} del 20$1`)
    return str
    // de {getMonthName(selectedTransaction.date?.toDate().getMonth())} del {selectedTransaction.date?.toDate().getFullYear()}
  }
  const timeToLocalString = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    let str = string.replace(pattern, `a las $1:$2`)
    return str
    // a las {selectedTransaction.date?.toDate().toLocaleTimeString()}
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

<!-- MODAL TRANSACTION CLARIFICATION -->
<Modal className={`modal-medium`} wrapperClass={"text-area-wrapper"} bind:this={modalClarification}>
  <div slot="header">
    <p>Solicitar Aclaración</p>
  </div>
  <div slot="content">
    <div class="clarifications-select">
      <Select bind:optionsList={clarificationsList} defaultText={"Elige una opción"} label="Tipo de Aclaración" id="clarificationType" bind:value={clarification.type}/>
    </div>
    <div class="clarification-description">
      <TextArea bind:value={clarification.description} label="Descripción" placeholder="¿Qué problema hay con esta transacción?" id="clarificationDescription" name="clarificationDescription"/>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input on:click={closeModal(modalClarification)} label="Cerrar" id="buttonCloseModalClarification" type="button" className="btn-plain" icon=""/>
    <Input 
      on:click={closeModal(modalClarification)} 
      on:click={() => handleClarification()} 
      label="Enviar Aclaración" 
      id="buttonSaveModalClarification" 
      type="button" 
      className={`btn-plain
        ${
          clarification.description != "" 
          ? "" : "disabled"
        }`
      } 
      icon=""
    />
  </div>
</Modal>

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
    <Input on:click={closeModal(modalDateFilter)} label="Cerrar" id="buttonCloseModalDateRange" type="button" className="btn-plain" icon=""/>
    <Input 
      on:click={closeModal(modalDateFilter)} 
      on:click={() => fetchByDateRange()} 
      label="Filtrar" 
      id="buttonSaveModalDateRange" 
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
          <div class="element">
            {#if !transactionDetailView}
              <Input on:click={showModal(modalDateFilter)} label="Filtrar " id="openModalDateFilter" type="button" className="btn-plain" icon=""/>
            {/if}
          </div>
          <div class="element">
            {#if transactionDetailView}
              <Input on:click={() => (transactionDetailView = false)} label="Regresar" id="detailsReturnButton" type="button" className="btn-plain" icon=""/>
            {/if}
          </div>
        </div>
      </div>
      <div class="top__middle">
        <div class="date">
          <p class="number">
            {date.getDate()} de {getMonth(date.getMonth())} del {date.getFullYear()}
          </p>
        </div>
        <ButtonGroup bind:active={active} options={buttonGroupOptions}/>
        <!-- <div class="button-group">
          <button on:click={fetchByDayButton} class={`button ${active === "day" ? "button-active" : ""}`} type="button">Día</button>
          <button on:click={fetchByWeekButton} class={`button ${active === "week" ? "button-active" : ""}`} type="button">Semana</button>
          <button on:click={fetchByMonthButton} class={`button ${active === "month" ? "button-active" : ""}`} type="button">Mes</button>
        </div> -->
        <div class="card-group">
          <div class="card">
            <div><p>Ventas Totales</p></div>
            <div><span>{user.total?.toLocaleString(localeParam.language, localeParam.currency)}</span></div>
          </div>
          <div class="card">
            <div><p>Comisiones Cobradas</p></div>
            <div><span>{(user?.toDeposit - user?.totalCommissions)?.toLocaleString(localeParam.language, localeParam.currency)}</span></div>
          </div>
          <div class="card">
            <div><p>Saldo a Depositar</p></div>
            <div><span>{user.toDeposit?.toLocaleString(localeParam.language, localeParam.currency)}</span></div>
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
                    <tr class="clickable-table-row number"
                      on:click={() => (selectedTransaction = transaction)}
                      on:click={() => (transactionDetailView = true)}
                      on:keypress={(e) => e.key === 'Enter' ? selectedTransaction = transaction : ""} 
                      on:keypress={(e) => e.key === 'Enter' ? transactionDetailView = true : ""} 
                    >
                      <td>{getTransactionDate(transaction['Transaction Date'])+" - "+getTransactionTime(transaction['Transaction Time'])}<!-- {transaction.date?.toDate().getDate()} {getMonthName(transaction.date?.toDate().getMonth())} {transaction.date?.toDate().getFullYear()} - {transaction.date?.toDate().toLocaleTimeString()} --></td>
                      <td>
                        {transaction['Transaction Time']}
                        <!-- <Input
                          id='detailsTicket{transaction.id}'
                          title="Ver Detalles"
                          on:click={() => (selectedTransaction = transaction)}
                          on:click={() => (transactionDetailView = true)}
                          label={transaction.id} type="button" className="text-button" icon=""/> -->
                      </td>
                      <td>{parseFloat(transaction.Amount/100)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                      <td>{parseFloat((transaction.Amount/100) * 0.035)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                      <td>{parseFloat((transaction.Amount/100) * 0.965)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                    </tr>
                  {/each}
                    <tr>
                      <td><b>Total</b></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        {
                          transactions
                          .reduce((prev, curr) => prev + (curr.Amount/100) * 0.965, 0)
                          .toLocaleString(localeParam.language, localeParam.currency)
                        }
                      </td>
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
              <b>Recibo #{selectedTransaction['Transaction Time']}</b>
              <p>
                {dateToLocalString(selectedTransaction['Transaction Date'])} {timeToLocalString(selectedTransaction['Transaction Time'])}
              </p>
            </div>
            <div class="details__middle">
              <div class="details-left">
                <div class="title">Datos</div>
                <div class="item">
                  <b>Referencia</b>
                  <p>{selectedTransaction['IFD Serial Number']}</p>
                </div>
                <div class="item">
                  <b>TVR</b>
                  <p>{selectedTransaction.TVR}</p>
                </div>
                <div class="item">
                  <b>AID</b>
                  <p>{selectedTransaction['Terminal Capabilities']}</p>
                </div>
                <div class="item">
                  <b>TSI</b>
                  <p>{selectedTransaction['Additional Terminal Capabilities']}</p>
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
                      <div class=item__title>
                        <b>Tarjeta Utilizada</b>
                      </div>
                      <div class=item__content>
                        <p><span>{"**** **** **** "+selectedTransaction['Application PAN'].substr(-4)}</span></p>
                      </div>
                    </div>
                    <div class="item">
                      <div class=item__title>
                        <b>Tipo de Tarjeta</b>
                      </div>
                      <div class=item__content>
                        <p><Icons name="mastercard" width="24" height="24"/></p>
                      </div>
                    </div>
                    <div class="item">
                      <div class=item__title>
                        <b>Total de la Venta</b>
                      </div>
                      <div class=item__content>
                        <p>{(selectedTransaction.Amount/100)?.toLocaleString(localeParam.language, localeParam.currency)}</p>
                      </div>
                    </div>
                  </div>
                  <div class="details-card__bottom">
                    <div class="item">
                      <div class=item__title>
                        <b>Estatus</b>
                      </div>
                      <div class=item__content>
                        <p>APROBADA</p>
                      </div>
                    </div>
                    <div class="item">
                      <div class=item__title>
                        <b>Comisión</b>
                      </div>
                      <div class=item__content>
                        <p>{((selectedTransaction.Amount/100) * 0.0406)?.toLocaleString(localeParam.language, localeParam.currency)}</p>
                        <span>{`(4.06%)`}</span>
                      </div>
                    </div>
                    <div class="item">
                      <div class=item__title>
                        <b>Total a Depositar</b>
                      </div>
                      <div class=item__content>
                        <p>{((selectedTransaction.Amount/100) * 0.9594)?.toLocaleString(localeParam.language, localeParam.currency)}</p>
                      </div>
                      <span></span>
                    </div>
                  </div>
                </div>
                <div class="card-buttons">
                  <div class="reverse-button">
                    <Input on:click={showModal(modalClarification)} label="Aclaración" id="reverseTransaction" type="button" className="btn-plain" icon=""/>
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
    width: 10rem;/* 160px */
    height: 2.5rem;/* 40px */
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
  .top__left .buttons .element {
    height: 2.5rem;/* 40px */
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

    /* width: 610px; */
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
    width: auto;
    min-width: 180px;
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
    font-family: 'Roboto';
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

  .clarifications-select {
    display: flex;
    width: 50%;
  }
  .clarification-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* width: 50%; */
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

  .table-content .clickable-table-row {
    cursor: pointer;
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

  .modal-buttons{
    width: 70%;
    height: 2.5rem;/* 40px */
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
    font-family: 'Roboto';
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
    min-width: 26.75rem;/* 428px */
    min-height: 13.125rem;/* 210px */
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
    /* display: flex;
    flex-direction: row;
    gap: 1rem; */
    width: -webkit-fill-available;
    display: grid;
    grid-auto-flow: column;
    grid-template: auto / 10rem 6rem auto;

  }
  .details__middle .details-center .details-card .details-card__middle .item .item__title{
    display: flex;
    justify-content: center;
  }
  .details__middle .details-center .details-card .details-card__middle .item .item__content{
    display: flex;
    justify-content: center;
  }
  .details__middle .details-center .details-card .details-card__middle .item .item__title b{
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
  }
  
  .details__middle .details-center .details-card .details-card__middle .item p{
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
  }
  .details__middle .details-center .details-card .details-card__middle .item p span{
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;/* 20px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
  }
  .details__middle .details-center .details-card .details-card__bottom{
    /* display: flex;
    flex-direction: row;
    gap: .5rem; */
    width: -webkit-fill-available;
    display: grid;
    grid-auto-flow: column;
    grid-template: auto / 10rem 6rem auto;
  }
  .details__middle .details-center .details-card .details-card__bottom .item .item__title{
    display: flex;
    justify-content: center;
  }
  .details__middle .details-center .details-card .details-card__bottom .item .item__content{
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .details__middle .details-center .details-card .details-card__bottom .item .item__title b{
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: 1.125rem;/* 18px */
    color: #8C9FB1;
  }

  .details__middle .details-center .details-card .details-card__bottom .item p{
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: .875rem;/* 14px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
    text-align: center;
  }

  .details__middle .details-center .details-card .details-card__bottom .item span{
    font-family: 'Roboto';
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
    height: 2.5rem;/* 40px */
    display: flex;
    margin-top: 2rem;/* 32px */
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