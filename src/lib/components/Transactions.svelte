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
  let transactionsWeek = [];
  let transactionsMonth = [];
  let selectedTransaction = {};
  let transactionToArray = [];
  let transactionDetailView = false;
  let notFound = false;
  let notFoundMessage = "No se encontraron registros";
  let loading = false;
  let date = new Date;
  let active = "day";
  let toggleWeek = "";
  let toggleWeekDetails = "";
  let selectedDay;

  let dateRangeStart, dateRangeEnd, ticketId, modalDateFilter, modalClarification;
  let pdfData, print = true, dayView = false, monthView = false;

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
      // console.log(transactions)
    }
    loading = false;
  }

  const fetchByDayButton = async() => {
    active = "day";
    transactionDetailView = false;
    selectedTransaction = {};
    transactions = [];
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
    transactionsWeek = [];
    transactions = [];
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
    if(transactions.length < 0){
      transactionsWeek = [];
    }else{
      var index = 0;
      let arr = []
      do {
        const initialDate = new Date();
        let d = new Date(initialDate.setDate(initialDate.getDate() - initialDate.getDay()+(index+1))).setHours(0,0,0,0);
        const formatDay = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(d);
        const key = formatDay.replace(pattern,'$3$2$1')
        arr.push({date: key, data: transactions.filter(date => date['Transaction Date'] === formatDay.replace(pattern,'$3$2$1')).map((doc) => {return doc})})
        index++;
      } while (index < 7);
      transactionsWeek = [...arr]
      // console.log(transactionsWeek)
    }
    transactionFound();
    //console.log(transactions)
  }

  const fetchByMonth = async() => {
    active = "month"
    transactionDetailView = false;
    selectedTransaction = {};
    transactionsMonth = [];
    transactions = [];
    loading = true;
    var pattern = /(\d{2})\/(\d{2})\/(\d{2})/; // String pattern replace for date
    const q = query(
      collection(db, dbCollection, uid, "monthly"),
      // orderBy('Transaction Date', 'desc'),
    );
    const querySnapshot = await getDocs(q);
    transactionsMonth = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    });

    let newArr = [];
    transactionsMonth.map((arr) => {
      arr.data.map((data)=>{
        newArr.push(data)
      })
    })
    transactions = [...newArr]
    // console.log(transactions)
    // console.log(transactionsMonth)

    // console.log(transactions)
    /* let index = 0;
    let arr = []
    let array = []
    let flag = 0;
    let keyFirstDay, keyLastDay;
    let total = transactions.length
    let first = transactions[index]['Transaction Date'], last=transactions[total-1]['Transaction Date'];
    console.log(last)
    if (transactions.lentgh<0) {
      transactionsMonth = [];
    } else {
      do {
        // transactions[index]
        // console.log(transactions[index])
        arr.push({year: date.replace(pattern,'$3'), month: date.replace(pattern,'$2'), data: transactions.filter(date => date['Transaction Date'] === flag.toString()).map((doc) => {return doc})})

        index++;
      } while (index < transactions.length);
    } */
  }

  const fetchByMonthButton = async() => {
    active = "month";
    transactionDetailView = false;
    selectedTransaction = {};
    transactionsMonth = [];
    transactions = [];
    loading = true;
    var pattern = /(\d{2})\/(\d{2})\/(\d{2})/; // String pattern replace for date
    //transactions = [];
    const curr = new Date;
    const currentMonth = new Date(curr.setMonth(curr.getMonth(), 1)).setHours(0,0,0,0); // Sets Date to actual month day 1 at 00:00
    const nextMonth = new Date(curr.setMonth(curr.getMonth() + 1, 1)).setHours(0,0,0,0); // Sets Date to next month day 1 at 00:00
    const lastDayOfMonth = new Date(curr.setMonth(curr.getMonth(), 0)).setHours(0,0,0,0); // Sets Date to last day of month at 00:00
    const numDays = new Date(lastDayOfMonth).getDate();

    const first = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(currentMonth);
    const last = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(nextMonth);
    const lastDayMonth = new Intl.DateTimeFormat('es-MX', { month: '2-digit', day: '2-digit', year: '2-digit' }).format(lastDayOfMonth);

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
    let index = 0;
    let arr = []
    let array = []
    let flag = 0;
    let keyFirstDay, keyLastDay;
    if(transactions.length < 0){
      transactionsMonth = [];
    }else{
      do {
        const d = new Date();
        let initialDate = new Date(currentMonth).setHours(0,0,0,0);
        let m = first.replace(pattern,'$3$2$1')
        flag = parseInt(m) + index;
        const key = flag.toString().replace(pattern,'$3$2$1')
        if(arr.length < 7){
          arr.push({date: key, data: transactions.filter(date => date['Transaction Date'] === flag.toString()).map((doc) => {return doc})})
        }else{
          array.push({firstDay: keyFirstDay, lastDay: keyLastDay ,objects: arr})
          arr = [];
          arr.push({date: key, data: transactions.filter(date => date['Transaction Date'] === flag.toString()).map((doc) => {return doc})})
        }
        if(arr.length === 1){keyFirstDay = flag.toString()}
        else if(arr.length === 7){keyLastDay = flag.toString()}
        index++;
        if((index) === numDays){
          array.push({firstDay: keyFirstDay, lastDay: keyLastDay ,objects: arr})
          arr = [];
          arr.push({date: key, data: transactions.filter(date => date['Transaction Date'] === flag.toString()).map((doc) => {return doc})})
        }
      } while (flag < parseInt(lastDayMonth.replace(pattern,'$3$2$1')));
      // console.log(array)
      transactionsMonth = [...array]

      transactionsMonth.map((months) => (
        console.log(months.data)
        /* months.map((data)=>(

          console.log({data})
        )) */
      ))
      // console.log(transactionsMonth)
    }
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
      //value = Math.round((e.target.value) * 100) / 100
      return {
        date: getTransactionDate(element['Transaction Date']),
        id: element['Transaction Time'],
        total: parseInt(element.Amount)/100,
        commission: ((element.Amount*.035)/100),
        deposit: (element.Amount*.965)/100,
        card: 'MasterCard'
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

  /* const reverseTransaction = async(transaction) => {
    transaction.total = parseFloat(transaction.total);
    transaction.status = "refund";
    // console.log(transaction)
    await updateTransactionStatus(transaction);
    transactionDetailView = false;
    fetchByDayButton();
  } */

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
  const getMonthPeriod = (string) => {
    var pattern = /(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, '$2')
    const month = getMonthName(extractMonth)
    let str = string.replace(pattern, `${month} 20$1`)
    // let str = string.replace(pattern, `$3 de ${month} del 20$1`)
    // console.log(str)
    return str
  }

  const handleClarification = () => {
    console.log(clarification)
  }

  let buttonGroupOptions = [
    {value: "day", name: "Día", click: fetchByDayButton},
    {value: "week", name: "Semana", click: fetchByWeekButton},
    {value: "month", name: "Mes", click: fetchByMonth},
  ]

  const getTransactionDate = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, '$2')
    const month = getMonthName(extractMonth)
    let str = string.replace(pattern, `$3 de ${month}`)
    // let str = string.replace(pattern, `$3 de ${month} del 20$1`)
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

  const handleTableState = (id) => {
    // console.log(id)
    document.getElementById(id).classList.toggle('hidden')
  }
  const handleToggleWeek = (id) => {
    if(toggleWeek === id){toggleWeek = ""; toggleWeekDetails = ""}
    else{toggleWeek = id}
  }
  const handleToggleWeekDetails = (id) => {
    console.log(id)
    if(toggleWeekDetails === id){toggleWeekDetails = ""}
    else{toggleWeekDetails = id}
  }

  const getWeekDay = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    const d = new Date(string.replace(pattern,'$2-$3-20$1'));
    let index = d.getDay()
    // console.log(index)
    const days = {
      0: {name: "Domingo"},
      1: {name: "Lunes"},
      2: {name: "Martes"},
      3: {name: "Miércoles"},
      4: {name: "Jueves"},
      5: {name: "Viernes"},
      6: {name: "Sábado"},
    }
    return days[index].name
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
              <Input on:click={showModal(modalDateFilter)} label="Filtrar" id="openModalDateFilter" type="button" className="btn-plain fill-blue" icon=""/>
            {/if}
          </div>
          {#if transactionDetailView}
            <div class="element">
              <Input on:click={() => (transactionDetailView = false)} label="Regresar" id="detailsReturnButton" type="button" className="btn-plain" icon=""/>
            </div>
          {/if}
        </div>
      </div>
      <div class="top__middle">
        <div class="date">
          <p class="number">
            {date.getDate()} de {getMonthName(date.getMonth())} del {date.getFullYear()}
          </p>
        </div>
        <ButtonGroup bind:active={active} options={buttonGroupOptions}/>
        
      </div>
      <div class="top__right">
        <div class="transaction-search-bar">
          <Input placeholder="Buscar por ticket" id="ticket-id-search" bind:value={ticketId} className="txt-field normal" type="text" icon=""/>
          <Input on:click={fetchByTicketId} label="" id="byTicketId-button" type="button" className="btn-plain btn-round {ticketId != "" ? '' : 'disabled'}" icon="search"/>
        </div>
        <div class="export-buttons">
          <Input on:click={exportDataToCSV(transactions)} label="" id="csv-export" type="button" className="btn-plain btn-square fill-blue {transactions.length > 0 ? '' : 'disabled'}" icon="csv-fill"/>
          <Input on:click={exportDataToExcel(transactions)} label="" id="excel-export" type="button" className="btn-plain btn-square fill-green {transactions.length > 0 ? '' : 'disabled'}" icon="xls-fill"/>
          <Input label="" id="print" type="button" className="btn-plain btn-square fill-blue {transactions.length > 0 ? '' : 'disabled'}" icon="print"/>
          <Input label="" id="pdf-export" type="button" className="btn-plain btn-square fill-red {transactions.length > 0 ? '' : 'disabled'}" icon="pdf-fill"/>
          <!-- <Input on:click={exportDataToCSV(transactions)} label="" id="csv-export" type="button" className="btn-plain btn-square {transactions.length > 0 ? '' : 'disabled'}" icon="csv-fill"/> -->
          <!-- <Input on:click={exportDataToExcel(transactions)} label="" id="excel-export" type="button" className="btn-plain btn-square {transactions.length > 0 ? '' : 'disabled'}" icon="xls-fill"/> -->
          <!-- <Input on:click={exportDataToPDF(transactions)} label="" id="pdf-export" type="button" className="btn-plain btn-square {transactions.length > 0 ? '' : 'disabled'}" icon="pdf-fill"/> -->
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="card-group">
        <div class="card">
          <div><p>Total Vendido</p></div>
          <!-- <div><span>{user.total?.toLocaleString(localeParam.language, localeParam.currency)}</span></div> -->
          <div><span>{transactions
            .reduce((prev, curr) => prev + (curr.Amount/100), 0)
            .toLocaleString(localeParam.language, localeParam.currency)}
            </span></div>
        </div>
        <div class="card">
          <div><p>Comisión</p></div>
          <div><span>{transactions
            .reduce((prev, curr) => prev + (curr.Amount/100)*.035, 0)
            .toLocaleString(localeParam.language, localeParam.currency)}
            </span></div>
          <!-- <div><span>{(user?.toDeposit - user?.totalCommissions)?.toLocaleString(localeParam.language, localeParam.currency)}</span></div> -->
        </div>
        <div class="card">
          <div><p>Propinas</p></div>
          <div><span>{user.tip?.toLocaleString(localeParam.language, localeParam.currency) || (0).toLocaleString(localeParam.language, localeParam.currency)}</span></div>
        </div>
        <div class="card">
          <div><p>Saldo a Depositar</p></div>
          <div><span>{transactions
            .reduce((prev, curr) => prev + (curr.Amount/100)*.965, 0)
            .toLocaleString(localeParam.language, localeParam.currency)}
            </span></div>
          <!-- <div><span>{user.toDeposit?.toLocaleString(localeParam.language, localeParam.currency)}</span></div> -->
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
          {#if active !== "week" && active !=="month" && transactions.length > 0}
            <div class="transaction-tables">
              <div bind:this={pdfData} id="pdfTable" class="table-container">
                <div class="card-container">
                  <table class="table-content">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th class="responsive">ID</th>
                        <th>Venta</th>
                        <th class="responsive">Comisión</th>
                        <th class="responsive">Depósito</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each transactions as transaction}
                        <tr class="clickable number"
                          on:click={() => (selectedTransaction = transaction)}
                          on:click={() => (transactionDetailView = true)}
                          on:keypress={(e) => e.key === 'Enter' ? selectedTransaction = transaction : ""} 
                          on:keypress={(e) => e.key === 'Enter' ? transactionDetailView = true : ""} 
                        >
                          <td>{getTransactionDate(transaction['Transaction Date'])+" - "+getTransactionTime(transaction['Transaction Time'])}<!-- {transaction.date?.toDate().getDate()} {getMonthName(transaction.date?.toDate().getMonth())} {transaction.date?.toDate().getFullYear()} - {transaction.date?.toDate().toLocaleTimeString()} --></td>
                          <td class="responsive">{transaction['Transaction Time']}</td>
                          <td>{parseFloat(transaction.Amount/100)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                          <td class="responsive">{parseFloat((transaction.Amount/100) * 0.035)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                          <td class="responsive">{parseFloat((transaction.Amount/100) * 0.965)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          {:else if active === "week"}<!-- TABLES BY WEEK -->
            {#if !dayView}
              <div class="transaction-tables">
                <div bind:this={pdfData} id="pdfTable" class="table-container">
                  <div class="card-container">
                    <table class="table-content">
                      <thead>
                        <tr>
                          <th class="title">Día</th>
                          <th class="title">N° Ventas</th>
                          <th class="title">Vendido</th>
                          <th class="title responsive">Comisión</th>
                          <th class="title responsive">Depósito</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each transactionsWeek as day}
                          <tr class="clickable"
                            on:click={() => (selectedDay = day)}
                            on:click={() => (dayView = !dayView)}
                            on:keypress={(e) => e.key === 'Enter' ? selectedDay = day : ""} 
                            on:keypress={(e) => e.key === 'Enter' ? dayView = !dayView : ""} 
                          >
                            <td class="element">{getWeekDay(day.date)} - {getTransactionDate(day.date)}</td>
                            <td class="element">{day.data.length}</td>
                            <td class="element">
                              {day.data
                                .reduce((prev, curr) => prev + (curr.Amount/100), 0)
                                .toLocaleString(localeParam.language, localeParam.currency)}
                            </td>
                            <td class="element responsive">
                              {day.data
                                .reduce((prev, curr) => prev + (curr.Amount/100) * 0.035, 0)
                                .toLocaleString(localeParam.language, localeParam.currency)}
                            </td>
                            <td class="element responsive">
                              {day.data
                                .reduce((prev, curr) => prev + (curr.Amount/100) * 0.965, 0)
                                .toLocaleString(localeParam.language, localeParam.currency)}
                            </td>
                            <i class="arrow arrow-blue">
                              <Icons name="arrow-fwd" width="24" height="24"/>
                            </i>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            {:else}
              <div bind:this={pdfData} id={`pdfTable-${selectedDay.date}`} class="table-container">
                <div class="card-container">
                  <div class="row">
                    <div class="title">
                      <i class="arrow-blue"
                        on:click={() => (dayView = !dayView)}
                        on:keypress={(e) => e.key === 'Enter' ? dayView = !dayView : ""}
                      >
                        <Icons name="arrow-bwd" width="24" height="24"/>
                      </i>
                      {getWeekDay(selectedDay.date)} - {getTransactionDate(selectedDay.date)}
                    </div>
                  </div>
                  <table class="table-content">
                    <thead style="height:1.5rem">
                      <tr>
                        <th class="responsive">Fecha</th>
                        <th class="responsive">ID</th>
                        <th>Ventas</th>
                        <th>Comisión</th>
                        <th>Depósito</th>
                      </tr>
                    </thead>
                    <thead style="height:1.5rem">
                      <tr>
                        <th class="responsive"></th>
                        <th class="responsive"></th>
                        <th>
                          {selectedDay.data
                            .reduce((prev, curr) => prev + (curr.Amount/100), 0)
                            .toLocaleString(localeParam.language, localeParam.currency)}
                        </th>
                        <th>
                          {selectedDay.data
                            .reduce((prev, curr) => prev + (curr.Amount/100) * 0.035, 0)
                            .toLocaleString(localeParam.language, localeParam.currency)}
                        </th>
                        <th>
                          {selectedDay.data
                            .reduce((prev, curr) => prev + (curr.Amount/100) * 0.965, 0)
                            .toLocaleString(localeParam.language, localeParam.currency)}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="inside">
                      {#each selectedDay.data as transaction}
                        <tr class="clickable number"
                          on:click={() => (selectedTransaction = transaction)}
                          on:click={() => (transactionDetailView = true)}
                          on:keypress={(e) => e.key === 'Enter' ? selectedTransaction = transaction : ""} 
                          on:keypress={(e) => e.key === 'Enter' ? transactionDetailView = true : ""} 
                        >
                          <td class="responsive">{getTransactionDate(transaction['Transaction Date'])+" - "+getTransactionTime(transaction['Transaction Time'])}</td>
                          <td class="responsive">{transaction['Transaction Time']}</td>
                          <td>{parseFloat(transaction.Amount/100)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                          <td>{parseFloat((transaction.Amount/100) * 0.035)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                          <td>{parseFloat((transaction.Amount/100) * 0.965)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                        </tr>
                        {/each}
                    </tbody>
                  </table>
                  </div>
              </div>
            {/if}
          {:else if active === "month"}<!-- TABLES BY MONTH -->
            {#if !monthView}
              <div class="transaction-tables">
                <div bind:this={pdfData} id="pdfTable" class="table-container">
                  <div class="card-container">
                    <table class="table-content">
                      <thead>
                        <tr>
                          <th class="title">Día</th>
                          <th class="title">N° Ventas</th>
                          <th class="title">Vendido</th>
                          <th class="title responsive">Comisión</th>
                          <th class="title responsive">Depósito</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each transactionsMonth as month}
                        <tr class="clickable"
                          on:click={() => (selectedDay = month)}
                          on:click={() => (monthView = !monthView)}
                          on:keypress={(e) => e.key === 'Enter' ? selectedDay = month : ""} 
                          on:keypress={(e) => e.key === 'Enter' ? monthView = !monthView : ""} 
                        >
                          <td class="element">{getMonthPeriod(month.date)}</td>
                          <td class="element">{month.data.length}</td>
                          <td class="element">
                            {month.data
                              .reduce((prev, curr) => prev + (curr.Amount/100), 0)
                              .toLocaleString(localeParam.language, localeParam.currency)}
                          </td>
                          <td class="element responsive">
                            {month.data
                              .reduce((prev, curr) => prev + (curr.Amount/100) * 0.035, 0)
                              .toLocaleString(localeParam.language, localeParam.currency)}
                          </td>
                          <td class="element responsive">
                            {month.data
                              .reduce((prev, curr) => prev + (curr.Amount/100) * 0.965, 0)
                              .toLocaleString(localeParam.language, localeParam.currency)}
                          </td>
                          <i class="arrow arrow-blue">
                            <Icons name="arrow-fwd" width="24" height="24"/>
                          </i>
                        </tr>
                          <!-- {#each month.data as data}
                            <tr class="clickable"
                              on:click={() => (selectedDay = data)}
                              on:click={() => (monthView = !monthView)}
                              on:keypress={(e) => e.key === 'Enter' ? selectedDay = data : ""} 
                              on:keypress={(e) => e.key === 'Enter' ? monthView = !monthView : ""} 
                            >
                              <td class="element">{getWeekDay(month.date)} - {getTransactionDate(data.date)}</td>
                              <td class="element">{data.data.length}</td>
                              <td class="element">
                                {data.data
                                  .reduce((prev, curr) => prev + (curr.Amount/100), 0)
                                  .toLocaleString(localeParam.language, localeParam.currency)}
                              </td>
                              <td class="element">
                                {data.data
                                  .reduce((prev, curr) => prev + (curr.Amount/100) * 0.035, 0)
                                  .toLocaleString(localeParam.language, localeParam.currency)}
                              </td>
                              <td class="element">
                                {data.data
                                  .reduce((prev, curr) => prev + (curr.Amount/100) * 0.965, 0)
                                  .toLocaleString(localeParam.language, localeParam.currency)}
                              </td>
                              <i class="arrow arrow-blue">
                                <Icons name="arrow-fwd" width="24" height="24"/>
                              </i>
                            </tr>
                          {/each} -->
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            {:else}
              <div bind:this={pdfData} id={`pdfTable-${selectedDay.date}`} class="table-container">
                <div class="card-container">
                  <div class="row">
                    <div class="title">
                      <i class="arrow-blue clickable"
                        on:click={() => (monthView = !monthView)}
                        on:keypress={(e) => e.key === 'Enter' ? monthView = !monthView : ""}
                      >
                        <Icons name="arrow-bwd" width="24" height="24"/>
                      </i>
                      {getMonthPeriod(selectedDay.date)}
                    </div>
                  </div>
                  <table class="table-content">
                    <thead style="height:1.5rem">
                      <tr>
                        <th class="responsive">Fecha</th>
                        <th class="responsive">ID</th>
                        <th>Ventas</th>
                        <th>Comisión</th>
                        <th>Depósito</th>
                      </tr>
                    </thead>
                    <thead style="height:1.5rem">
                      <tr>
                        <th class="responsive"></th>
                        <th class="responsive"></th>
                        <th>
                          {selectedDay.data
                            .reduce((prev, curr) => prev + (curr.Amount/100), 0)
                            .toLocaleString(localeParam.language, localeParam.currency)}
                        </th>
                        <th>
                          {selectedDay.data
                            .reduce((prev, curr) => prev + (curr.Amount/100) * 0.035, 0)
                            .toLocaleString(localeParam.language, localeParam.currency)}
                        </th>
                        <th>
                          {selectedDay.data
                            .reduce((prev, curr) => prev + (curr.Amount/100) * 0.965, 0)
                            .toLocaleString(localeParam.language, localeParam.currency)}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="inside">
                      {#each selectedDay.data as transaction}
                        <tr class="clickable number"
                          
                        >
                          <td class="responsive">{getTransactionDate(transaction['Transaction Date'])+" - "+getTransactionTime(transaction['Transaction Time'])}</td>
                          <td class="responsive">{transaction['Transaction Time']}</td>
                          <td>{parseFloat(transaction.Amount/100)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                          <td>{parseFloat((transaction.Amount/100) * 0.035)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                          <td>{parseFloat((transaction.Amount/100) * 0.965)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                        </tr>
                        {/each}
                    </tbody>
                  </table>
                  </div>
              </div>
            {/if}
            <!-- <div class="transaction-tables">
              {#each transactionsMonth as month}
                <div 
                  class="week-table__title "
                  on:click={handleToggleWeek(`${month.firstDay}-${month.lastDay}`)}
                  on:keypress={(e) => e.key === 'Enter' ? handleToggleWeek(`${month.firstDay}-${month.lastDay}`) : ""}
                >
                  <div class="col">
                    <div class="element">
                      Del {getTransactionDate(month.firstDay)} al {getTransactionDate(month.lastDay)}
                    </div>
                  </div>
                </div>
                {#each month.objects as objects, i}
                  <div 
                    class={`${toggleWeek === `${month.firstDay}-${month.lastDay}` ? "" : "hidden"}`}
                    on:click={handleToggleWeekDetails(`${objects.date}`)}
                    on:keypress={(e) => e.key === 'Enter' ? handleToggleWeek(`${objects.date}`) : ""}
                  >
                    <div class="main-container week-table__subtitle">
                      <div class="col">
                        <div class="element">{getWeekDay(objects.date)}</div>
                        <div class="element">
                          {getTransactionDate(objects.date)}
                        </div>
                      </div>
                      <div class="col">
                        <div class="element">Ventas Totales</div>
                        <div class="element">{objects.data.length}</div>
                      </div>
                      <div class="col">
                        <div class="element">Total</div>
                        <div class="element">
                          {objects.data
                          .reduce((prev, curr) => prev + (curr.Amount/100), 0)
                          .toLocaleString(localeParam.language, localeParam.currency)}
                        </div>
                      </div>
                      <div class="col">
                        <div class="element">Comisión</div>
                        <div class="element">
                          {objects.data
                          .reduce((prev, curr) => prev + (curr.Amount/100) * 0.035, 0)
                          .toLocaleString(localeParam.language, localeParam.currency)}
                        </div>
                      </div>
                      <div class="col">
                        <div class="element">Depósito</div>
                        <div class="element">
                          {objects.data
                          .reduce((prev, curr) => prev + (curr.Amount/100) * 0.965, 0)
                          .toLocaleString(localeParam.language, localeParam.currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div bind:this={pdfData} id={`pdfTable-${month.date}`} class={`table-container ${toggleWeekDetails === objects.date ? "":"hidden"}`}>
                    {#if objects.data.length <= 0}
                      <div class={`not-found`}>
                        <b>
                          {notFoundMessage}
                        </b>
                      </div>
                    {:else}
                    <table class="table-content">
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>ID</th>
                          <th>Venta</th>
                          <th>Comisión</th>
                          <th>Depósito</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each objects.data as transaction}
                          <tr class="clickable number"
                            on:click={() => (selectedTransaction = transaction)}
                            on:click={() => (transactionDetailView = true)}
                            on:keypress={(e) => e.key === 'Enter' ? selectedTransaction = transaction : ""} 
                            on:keypress={(e) => e.key === 'Enter' ? transactionDetailView = true : ""} 
                          >
                            <td>{getTransactionDate(transaction['Transaction Date'])+" - "+getTransactionTime(transaction['Transaction Time'])}</td>
                            <td>{transaction['Transaction Time']}</td>
                            <td>{parseFloat(transaction.Amount/100)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                            <td>{parseFloat((transaction.Amount/100) * 0.035)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                            <td>{parseFloat((transaction.Amount/100) * 0.965)?.toLocaleString(localeParam.language, localeParam.currency)}</td>
                          </tr>
                          {/each}
                      </tbody>
                    </table>
                    {/if}
                  </div>
                {/each}
              {/each}
            </div> -->
          {/if}
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
              <div class="details-left responsive">
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
              <div class="details-right responsive">
                <div class="title">Reportes</div>
                <div class="export-buttons">
                  <Input on:click={
                    () => {
                      transactionToArray.push(selectedTransaction)
                      exportDataToCSV(transactionToArray)
                      transactionToArray = [];
                    }
                  } label="" id="csv-export" type="button" className="btn-plain fill-blue btn-square " icon="csv-fill"/>
                  <Input on:click={
                    () => {
                      transactionToArray.push(selectedTransaction)
                      exportDataToCSV(transactionToArray)
                      transactionToArray = [];
                    }
                  } label="" id="excel-export" type="button" className="btn-plain fill-green btn-square " icon="xls-fill"/>
                  <Input on:click={
                    () => {
                      transactionToArray.push(selectedTransaction)
                      exportDataToCSV(transactionToArray)
                      transactionToArray = [];
                    }
                  } label="" id="pdf-export" type="button" className="btn-plain fill-red btn-square " icon="pdf-fill"/>
                </div>
              </div>
            </div>
          </div>
        {/if}
    {/if}
  </div>
</div>

<style>
  /* .table{
    display: grid;
    grid-auto-flow: row;
  }
  .table > .thead{
    display: grid;
    grid-auto-flow: column;
  }
  .table > .tbody > .tr{
    display: grid;
    grid-auto-flow: column;
  } */

  .padding {
    padding: 2rem;
  }
  .row {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    gap: 1rem;
  }

  .row > .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 18px;
    color: #FD9053;
  }
  .row > .element {
    font-weight: 700;
    font-size: 16px;
    line-height: 18px;
    color: #113A62;
  }
  
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
    justify-content: space-between;
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

  .middle {
    display: flex;
    justify-content: center;
    margin: 0rem 0rem 2rem 0rem;
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
    /* width: 70%; */
    /* border-bottom: 1px solid; */
    border-collapse: collapse;
    margin: 2rem;
    border-spacing: 1rem;
    min-width: 40rem;
  }
  
  .table-content thead {
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 18px;
    text-align: center;
    /* text-placeholder */
    color: #113A62;
    height: 2.375rem;
  }

  .clickable {
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
    padding: 0.625rem 0rem 0.625rem 0rem;
    min-width: 7rem;
  }

  th:first-child {
    text-align: left;
  }
  td:first-child {
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

  .hidden {
    /* height: 0;
    opacity: 0;
    transition: visibility 0s, opacity 0.5s linear; */
    display: none;
  }

  .week-table__title {
    /* width: -webkit-fill-available; */
    display: grid;
    grid-auto-flow: column;
    /* justify-content: center; */
    align-items: center;
    padding: 1rem 1rem;
    gap: 16px;
    margin: 1rem 0rem;
    min-width: 60rem;
    /* Nue Fill */
    
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
    cursor: pointer;
  }

  .week-table__title > .col {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
  }
  .week-table__title * .element {
    /* TEXT */
    font-family: 'Roboto';
    font-weight: 500;
    font-size: 1.25rem;
    color: #113A62;
  }
  .week-table__subtitle {
    /* width: -webkit-fill-available; */
    display: grid;
    grid-auto-flow: column;
    /* justify-content: center; */
    align-items: center;
    padding: 1rem 1rem;
    gap: 16px;
    margin: 1rem 0rem;
    min-width: 60rem;
    /* Nue Fill */
    
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
    cursor: pointer;
  }

  .week-table__subtitle > .col {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
  }
  .week-table__subtitle * .element {
    /* TEXT */
    font-family: 'Roboto';
    font-weight: 500;
    font-size: 1.25rem;
    color: #113A62;
  }

  th.title {
    font-weight: 700;
    font-size: 20px;
    line-height: 18px;
    color: #FD9053;
  }
  td.element {
    font-weight: 700;
    font-size: 16px;
    line-height: 18px;
    color: #113A62;
    padding: 0rem;
  }

  tbody.inside {
    background: #E9EDF0;
    /* inner-flat */
    box-shadow: inset -3px -3px 4px #F9FCFF, inset 3px 3px 3px #AEB8C0;
    border-radius: 0px 0px 10px 10px;
  }

  .arrow-blue {
    color: #007AFF;
  }

  @media (max-width: 540px) {
    .top{
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .top__left .buttons {
      justify-content: center;
      align-items: center;
      width: -webkit-fill-available;
    }
    .top__left * .element {
      width: 15rem;
    }

    .middle > .card-group{
      flex-direction: column;
      height: auto;
      width: 100%;
    }
    
    .middle * .card {
      width: -webkit-fill-available;
    }

    .table-container {
      display: block;
      width: 100%;
    }

    .card-container {
      padding: 2rem 2rem;
    }

    .transactions-view {
      margin: 0rem 0rem 4rem 0rem;
    }

    .table-content {
      min-width: auto;
      width: -webkit-fill-available;
      margin: 0;
    }

    .date-range-input {
      display: block;
    }

    .transactions .return {
      margin: 0rem 0rem 1rem 0rem;
    }

    .details__middle .details-card {
      min-width: auto;
    }
    .responsive {
      display: none;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {

    .top__left{
      min-width: 15rem;
    }
    .middle > .card-group{
      /* flex-direction: column; */
      height: auto;
      width: 100%;
      gap: .5rem;
    }
    .middle * .card {
      width: auto;
    }
    .details__middle {
      gap: 1rem;
    }

    .details-right .export-buttons {
      flex-direction: column;
    }
    /* .responsive {
      display: none;
    } */
  }
</style>