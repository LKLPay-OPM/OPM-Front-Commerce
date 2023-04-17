<script>
  import { collection, Timestamp, query, orderBy, limit, where, getDocs, startAt, endAt } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import { loggedInUser, redirectUrgentDispersions } from "$lib/stores";
  import Input from "$lib/components/Input.svelte";
  import IconInput from "$lib/components/IconInput.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import Select from "$lib/components/Select.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import ButtonGroup from "$lib/components/ButtonGroup.svelte";
  import { onMount } from "svelte";
  import { generatePDF, generateCSV, generateXLSX } from "$lib/hooks/exportDataToFile.js";
  import { fetchRates } from "$lib/hooks/rates.js";

  // import { updateDispersionStatus } from '$lib/hooks/updates.js'

  export let user;
  const dbCollection = "users-client";
  const uid = user.uid;
  let dispersions = [];
  let selectedDispersion = {};
  let dispersionToArray = [];
  let dispersionDetailView = false;
  let notFound = false;
  let notFoundMessage = "No se encontraron registros";
  let loading = false;
  let date = new Date();
  let active = "1";
  let terms = false;
  let termsDepositPreference = false;

  let dateRangeStart,
    dateRangeEnd,
    ticketId,
    modalDateFilter,
    modalClarification,
    modalDetailClarification,
    modalImmediateDeposit,
    modalImmediateDepositPreference;
  let pdfData,
    print = true;
  let rates;
  /* let rateLklPay, rateNatural, ratesBusinessType, rateUrgentDispersion = 0;
  let urgentDepositQty = 0; */

  selectedDispersion = {
    date: Timestamp.now(),
    id: "123",
    total: 13115.0,
    dispersion: 12548.5,
    commission: 532.5,
    afterDispersion: 0,
    type: 1,
    reference: 6326701,
    tracking: "IACH2GJ05YW9MV",
    clabe: "646180173742378227",
    transactions: 37,
  };

  let clarificationsList = [
    { name: "Opción 1", value: "option1" },
    { name: "Opción 2", value: "option2" },
    { name: "Opción 3", value: "option3" },
    { name: "Opción 4", value: "option4" },
  ];

  let clarification = {
    customer: $loggedInUser.uid,
    description: "",
  };
  let detailClarification = {
    ticket: "",
    description: "",
  };

  let immediateDeposit = {
    availableBalance: $loggedInUser.toDeposit,
    immediateDepositCommission: 0,
    immediateDepositQty: 0,
    toDeposit: 0,
  };

  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
  };

  const getPercentage = (num, per) => {
    const percentage = (num / 100) * per;
    const total = num - percentage;
    return total;
  };

  const fetchDBRates = () => {
    try {
      const fetch = fetchRates();
      fetch
        .then((value) => {
          rates = value;
          // rateLklPay = value.rateLklPay;
          // rateNatural = value.rateNatural;
          immediateDeposit.immediateDepositCommission = value.rateUrgentDispersion;
          // ratesBusinessType = value.ratesBusinessType;
          // console.log(value.rateUrgentDispersion)
        })
        .catch((err) => {
          console.error(err);
        });
      // console.log(rateUrgentDispersion)
    } catch (error) {
      throw new Error(error);
    }
  };

  const dispersionFound = () => {
    if (dispersions.length <= 0) {
      notFound = true;
    } else {
      notFound = false;
    }
    loading = false;
  };

  const fetchByDayButton = async () => {
    // active = "day";
    dispersionDetailView = false;
    // selectedDispersion = {};
    loading = true;
    // dispersions = [...$loggedInUser.dispersions];
    dispersions = [];
    if (dispersions.length <= 0) {
      dispersions.push(
        {
          date: "230222",
          time: "183033",
          type: "Inmediata",
          id: "123",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
        },
        {
          date: "230223",
          time: "093021",
          type: "Tradicional",
          id: "124",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
        },
        {
          date: "230223",
          time: "130638",
          type: "Urgente",
          id: "125",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
        },
        {
          date: "230223",
          time: "183033",
          type: "Inmediata",
          id: "126",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
        },
        {
          date: "230224",
          time: "093021",
          type: "Tradicional",
          id: "127",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
        }
      );
      // console.log($loggedInUser.dispersions)
      // console.log(dispersions)
    }
    /* const curr = new Date;
    const today = new Date(curr.setDate(curr.getDate())).setHours(0,0,0,0); // Sets Date to today day at 00:00
    const tomorrow = new Date(curr.setDate(curr.getDate() + 1)).setHours(0,0,0,0); // Sets Date to tomorrow at 00:00

    const q = query(
      collection(db, dbCollection, "dispersions", uid),
      orderBy('date', 'desc'),
      startAt(Timestamp.fromDate(new Date(tomorrow))), endAt(Timestamp.fromDate(new Date(today))),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    dispersions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    }); */
    dispersionFound();
  };

  const fetchByWeekButton = async () => {
    active = "week";
    dispersionDetailView = false;
    // selectedDispersion = {};
    loading = true;
    dispersions = [...$loggedInUser.dispersions];
    if (dispersions.length <= 0) {
      dispersions.push(
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        }
      );
      // console.log($loggedInUser.dispersions)
      // console.log(dispersions)
    }
    /* const curr = new Date;
    const firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay()+1)).setHours(0,0,0,0);
    const lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay()+7)).setHours(0,0,0,0);
    const first = Timestamp.fromDate(new Date(firstDay));
    const last = Timestamp.fromDate(new Date(lastDay));

    const q = query(
      collection(db, dbCollection, "dispersions", uid),
      orderBy('date', 'desc'),
      startAt(last), endAt(first),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    dispersions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    }); */
    dispersionFound();
  };

  const fetchByMonthButton = async () => {
    active = "month";
    dispersionDetailView = false;
    // selectedDispersion = {};
    loading = true;
    dispersions = [...$loggedInUser.dispersions];
    if (dispersions.length <= 0) {
      dispersions.push(
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        }
      );
    }
    /* const curr = new Date;
    const currentMonth = new Date(curr.setMonth(curr.getMonth(), 1)).setHours(0,0,0,0); // Sets Date to actual month day 1 at 00:00
    const nextMonth = new Date(curr.setMonth(curr.getMonth() + 1, 1)).setHours(0,0,0,0); // Sets Date to next month day 1 at 00:00

    const q = query(
      collection(db, dbCollection, "dispersions", uid),
      orderBy('date', 'desc'),
      startAt(Timestamp.fromDate(new Date(nextMonth))), endAt(Timestamp.fromDate(new Date(currentMonth))),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    dispersions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    }); */
    dispersionFound();
  };

  const fetchByDateRange = async () => {
    active = "range";
    dispersionDetailView = false;
    // selectedDispersion = {};
    loading = true;
    dispersions = [...$loggedInUser.dispersions];
    if (dispersions.length <= 0) {
      dispersions.push(
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Timestamp.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        }
      );
    }
    /* var pattern = /(\d{4})\-(\d{2})\-(\d{2})/; // String pattern replace for date
    const startRange = new Date(dateRangeStart.replace(pattern,'$2-$3-$1')).setHours(0,0,0,0);//Sets the date pattern and time to 00:00
    const endRange = new Date(dateRangeEnd.replace(pattern,'$2-$3-$1')).setHours(23,59,59,59);//Sets the date pattern and time to 23:59
    
    const q = query(
      collection(db, dbCollection, "dispersions", uid),
      orderBy('date', 'desc'),
      startAt(Timestamp.fromDate(new Date(endRange))), endAt(Timestamp.fromDate(new Date(startRange))),
    );
    const querySnapshot = await getDocs(q);
    dispersions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    }); */
    dispersionFound();
    // console.log(dispersions)
  };

  const fetchByTicketId = async () => {
    active = "ticket";
    dispersionDetailView = false;
    // selectedDispersion = {};
    loading = true;
    dispersions = [...$loggedInUser.dispersions];
    if (dispersions.length <= 0) {
      dispersions.push({
        date: Timestamp.now(),
        id: "123",
        total: 1000,
        commission: 30,
        dispersion: 970,
        afterDispersion: 0,
      });
    }
    /* const ticket = ticketId.toString();
    const q = query(
      collection(db, dbCollection, "dispersions", uid),
      where('id', '==', ticket),
      orderBy('date', 'desc'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    dispersions = querySnapshot.docs.map((doc) => {
      return {...doc.data()}
    }); */
    dispersionFound();
    // console.log(dispersions)
  };

  const sortObject = (data) => {
    const dispersionsNew = data.map((element) => {
      return {
        date: element.date.toDate().toLocaleDateString(),
        id: element.id,
        status: element.status,
        total: parseInt(element.total),
      };
    });
    return dispersionsNew;
  };

  const exportDataToPDF = async (dispersions) => {
    //alert("PDF")
    // console.log(dispersions)
    generatePDF(dispersions, user);
  };

  const exportDataToExcel = async (dispersions) => {
    // alert("Excel")
    const data = sortObject(dispersions);
    // console.log(data)
    generateXLSX(data);
  };

  const exportDataToCSV = async (dispersions) => {
    // alert("CSV")
    const data = sortObject(dispersions);
    // console.log(data)
    generateCSV(data);
  };

  /* const reverseDispersion = async(dispersion) => {
    dispersion.total = parseFloat(dispersion.total);
    dispersion.status = "refund";
    // console.log(dispersion)
    await updateDispersionStatus(dispersion);
    dispersionDetailView = false;
    fetchByDayButton();
  } */

  const getMonthName = (month) => {
    const monthsArray = {
      0: { value: "Enero" },
      1: { value: "Febrero" },
      2: { value: "Marzo" },
      3: { value: "Abril" },
      4: { value: "Mayo" },
      5: { value: "Junio" },
      6: { value: "Julio" },
      7: { value: "Agosto" },
      8: { value: "Septiembre" },
      9: { value: "Octubre" },
      10: { value: "Noviembre" },
      11: { value: "Diciembre" },
      "01": { value: "Enero" },
      "02": { value: "Febrero" },
      "03": { value: "Marzo" },
      "04": { value: "Abril" },
      "05": { value: "Mayo" },
      "06": { value: "Junio" },
      "07": { value: "Julio" },
      "08": { value: "Agosto" },
      "09": { value: "Septiembre" },
      "10": { value: "Octubre" },
      "11": { value: "Noviembre" },
      "12": { value: "Diciembre" },
    };

    return monthsArray[month].value;
  };

  const handleClarification = () => {
    console.log(clarification);
  };
  const handleImmediateDeposit = () => {
    immediateDeposit.toDeposit = getPercentage(
      immediateDeposit.immediateDepositQty,
      immediateDeposit.immediateDepositCommission
    );
    console.log(immediateDeposit);
    immediateDeposit = {
      availableBalance: $loggedInUser.toDeposit,
      immediateDepositQty: 0,
      toDeposit: 0,
    };
  };

  const handleImmediateDepositPreference = () => {};

  const traditionalDepositPreference = () => {
    active = "1";
  };
  const immediateDepositPreference = () => {
    active = "2";
    showModal(modalImmediateDepositPreference);
  };

  let buttonGroupOptions = [
    { value: "1", name: "Tradicional", click: traditionalDepositPreference },
    { value: "2", name: "Inmediato", click: immediateDepositPreference },
  ];

  const depositTypeName = (id) => {
    const types = {
      1: { value: "Mismo Día" },
      2: { value: "Día Siguiente" },
    };
    // console.log(id)
    return types[id].value;
  };

  const getTransactionDate = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, "$2");
    const month = getMonthName(extractMonth);
    let str = string.replace(pattern, `$3 de ${month}`);
    // let str = string.replace(pattern, `$3 de ${month} del 20$1`)
    // console.log(str)
    return str;
  };

  const getTransactionTime = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    let str = string.replace(pattern, `$1:$2:$3`);
    // console.log(str)
    return str;
  };

  const getClabe = (string) => {
    var pattern = /(\d{3})(\d{11})(\d{4})/;
    let result = string.replace(pattern, `$1***********$3`);
    return result;
  };

  const showModal = (option) => {
    option.show();
  };

  const closeModal = (option) => {
    option.closeModal();
  };

  onMount(async () => {
    await fetchDBRates();
    await fetchByDayButton();
    if ($redirectUrgentDispersions === true) {
      $redirectUrgentDispersions = false;
      showModal(modalImmediateDeposit);
    }
    /* .then(async() => {
    }).catch(err => {
      console.error(err);
      throw new Error(err);
    }); */
  });
</script>

<!-- MODAL DEPOSIT PREFERENCE-->
<Modal className={`modal-medium`} wrapperClass={"text-area-wrapper"} bind:this={modalImmediateDepositPreference}>
  <div slot="header">
    <p>Contratar Depósito Inmediato</p>
  </div>
  <div slot="content">
    <div class="immediate-deposit">
      <div class="error">
        <p>Todas tus ventas acumuladas del día hasta las 6:00pm serán depositadas a las 6:30pm.</p>
      </div>
      <div class="column-element">
        <div class="blue-title">
          <p>Costo Extra por Depósito</p>
        </div>
        <div class="content">
          <p>{immediateDeposit.immediateDepositCommission}%</p>
        </div>
      </div>
      <div class="terms">
        <div class="terms-checkbox">
          <Checkbox bind:checked={termsDepositPreference} />
        </div>
        <p>
          He Leído, entendido y acepto los
          <a href="/#terms">Términos y Condiciones Generales</a> de LklPay, así como su
          <a href="/#privacy">Política de Privacidad</a> y, por lo tanto estoy de acuerdo en el uso y procesamiento de datos
          personales.
        </p>
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalImmediateDepositPreference)}
      label="Cerrar"
      id="buttonCloseModalImmediateDepositPreference"
      type="button"
      className="btn-plain"
      icon=""
    />
    {#if termsDepositPreference}
      <Input
        on:click={closeModal(modalImmediateDepositPreference)}
        on:click={() => handleImmediateDepositPreference()}
        label="Contratar"
        id="buttonSaveModalImmediateDepositPreference"
        type="button"
        className={`
          ${termsDepositPreference ? "btn" : "btn-plain disabled"}`}
        icon=""
      />
    {/if}
  </div>
</Modal>
<!-- MODAL IMMEDIATE DEPOSIT -->
<Modal className={`modal-medium`} wrapperClass={"text-area-wrapper"} bind:this={modalImmediateDeposit}>
  <div slot="header">
    <p>Solicitar Depósito Urgente</p>
  </div>
  <div slot="content">
    <div class="immediate-deposit">
      {#if immediateDeposit.availableBalance < 500}
        <div class="error">
          <p>
            El monto mínimo para solicitar es de $500.00 mxn más el costo extra del {immediateDeposit.immediateDepositCommission}%
          </p>
        </div>
      {:else}
        <div class="row-element">
          <!-- <p>{immediateDeposit.availableBalance.toLocaleString(localeParam.language, localeParam.currency)}</p> -->
          <IconInput
            icon="dollar"
            label="Saldo Disponible"
            id="availableAmountTxtField"
            value={immediateDeposit.availableBalance}
            disabled={true}
            className="disabled-txt-field"
            type="number"
          />
          <IconInput
            icon="dollar"
            label="Monto Solicitado"
            placeholder="Monto Solicitado"
            id="requestedAmountTxtField"
            bind:value={immediateDeposit.immediateDepositQty}
            className="txt-field normal"
            type="number"
          />
        </div>
        <div class="column-element">
          <div class="blue-title">
            <p>Comisión por disposición inmediata</p>
          </div>
          <div class="content">
            <p>{immediateDeposit.immediateDepositCommission} %</p>
          </div>
        </div>
        <div class="column-element">
          <div class="gray-title">
            <p>Monto a Depositar</p>
          </div>
          <div class="content">
            <p>
              {$loggedInUser.toDeposit?.toLocaleString(localeParam.language, localeParam.currency)}
            </p>
          </div>
        </div>
        <div class="terms">
          <div class="terms-checkbox">
            <Checkbox bind:checked={terms} />
          </div>
          <p>
            He Leído, entendido y acepto los
            <a href="/#terms">Términos y Condiciones Generales</a> de LklPay, así como su
            <a href="/#privacy">Política de Privacidad</a> y, por lo tanto estoy de acuerdo en el uso y procesamiento de
            datos personales.
          </p>
        </div>
      {/if}
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    {#if immediateDeposit.availableBalance < 500}
      <Input
        on:click={closeModal(modalImmediateDeposit)}
        label="Entendido"
        id="buttonCloseModalImmediateDeposit"
        type="button"
        className="btn-plain btn-orange"
        icon=""
      />
    {:else}
      <Input
        on:click={closeModal(modalImmediateDeposit)}
        label="Cerrar"
        id="buttonCloseModalImmediateDeposit"
        type="button"
        className="btn-plain"
        icon=""
      />
      {#if immediateDeposit.availableBalance > 500 && terms}
        <Input
          on:click={closeModal(modalImmediateDeposit)}
          on:click={() => handleImmediateDeposit()}
          label="Solicitar Depósito"
          id="buttonSaveModalImmediateDeposit"
          type="button"
          className={`btn-plain
            ${
              immediateDeposit.immediateDepositQty > 0 && immediateDeposit.immediateDepositQty > 500 && terms === true
                ? ""
                : "disabled"
            }`}
          icon=""
        />
      {/if}
    {/if}
  </div>
</Modal>

<!-- MODAL DISPERSION CLARIFICATION -->
<Modal className={`modal-medium`} wrapperClass={"text-area-wrapper"} bind:this={modalClarification}>
  <div slot="header">
    <p>Solicitar Aclaración</p>
  </div>
  <div slot="content">
    <div class="clarifications">
      <div class="title">Cantidad</div>
      <div class="description">
        <p>
          {immediateDeposit.availableBalance.toLocaleString(localeParam.language, localeParam.currency)}
        </p>
      </div>
    </div>
    <div class="clarification-description">
      <TextArea
        bind:value={clarification.description}
        label="Descripción"
        placeholder="¿Qué problema hay con esta transacción?"
        id="clarificationDescription"
        name="clarificationDescription"
      />
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalClarification)}
      label="Cerrar"
      id="buttonCloseModalClarification"
      type="button"
      className="btn-plain"
      icon=""
    />
    <Input
      on:click={closeModal(modalClarification)}
      on:click={() => handleClarification()}
      label="Enviar Aclaración"
      id="buttonSaveModalClarification"
      type="button"
      className={`
        ${clarification.description != "" ? "btn" : "btn-plain disabled"}`}
      icon=""
    />
  </div>
</Modal>
<!-- MODAL DISPERSION DETAIL CLARIFICATION -->
<Modal className={`modal-medium`} wrapperClass={"text-area-wrapper"} bind:this={modalDetailClarification}>
  <div slot="header">
    <p>Solicitar Aclaración</p>
  </div>
  <div slot="content">
    <div class="clarifications">
      <div class="title">Recibo N°</div>
      <div class="description">
        <p>{detailClarification.ticket}</p>
      </div>
    </div>
    <!-- <div class="clarifications-select">
      <Select bind:optionsList={clarificationsList} defaultText={"Elige una opción"} label="Tipo de Aclaración" id="clarificationDetailType" bind:value={detailClarification.type}/>
    </div> -->
    <div class="clarification-description">
      <TextArea
        bind:value={detailClarification.description}
        label="Descripción"
        placeholder="¿Qué problema hay con esta transacción?"
        id="clarificationDetailDescription"
        name="clarificationDescription"
      />
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalDetailClarification)}
      label="Cerrar"
      id="buttonCloseModalDetailClarification"
      type="button"
      className="btn-plain"
      icon=""
    />
    <Input
      on:click={closeModal(modalDetailClarification)}
      on:click={() => handleClarification()}
      label="Enviar Aclaración"
      id="buttonSaveModalDetailClarification"
      type="button"
      className={`btn-plain
        ${detailClarification.description != "" ? "" : "disabled"}`}
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
      <DatePicker label="Del" id="date-range-start" bind:value={dateRangeStart} />
      <DatePicker label="Al" id="date-range-end" bind:value={dateRangeEnd} />
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalDateFilter)}
      label="Cerrar"
      id="buttonCloseModalUrgentDeposit"
      type="button"
      className="btn-plain"
      icon=""
    />
    <Input
      on:click={closeModal(modalDateFilter)}
      on:click={() => fetchByDateRange()}
      label="Filtrar"
      id="buttonSaveModalUrgentDeposit"
      type="button"
      className={`btn-plain
        ${dateRangeStart != "" && dateRangeEnd != "" ? "" : "disabled"}`}
      icon=""
    />
  </div>
</Modal>

<div class="dispersions">
  {#if !dispersionDetailView}
    <div class="top">
      <div class="top__left">
        <div class="page-title">
          <h1>Depósitos</h1>
        </div>
        <div class="buttons">
          <div class="element">
            {#if !dispersionDetailView}
              <Input
                on:click={showModal(modalDateFilter)}
                label="Filtrar "
                id="openModalDateFilter"
                type="button"
                className="btn-plain"
                icon=""
              />
            {/if}
          </div>
          {#if dispersionDetailView}
            <div class="element">
              <Input
                on:click={() => (dispersionDetailView = false)}
                label="Regresar"
                id="detailsReturnButton"
                type="button"
                className="btn-plain"
                icon=""
              />
            </div>
          {/if}
        </div>
      </div>
      <div class="top__middle">
        <div class="date">
          <p>
            {date.getDate()} de {getMonthName(date.getMonth())} del {date.getFullYear()}
          </p>
        </div>
        <ButtonGroup bind:active options={buttonGroupOptions} />
      </div>
      <div class="top__right">
        <div class="dispersion-search-bar">
          <Input
            placeholder="Buscar por ticket"
            id="ticket-id-search"
            bind:value={ticketId}
            className="txt-field normal"
            type="text"
            icon=""
          />
          <Input
            on:click={fetchByTicketId}
            label=""
            id="byTicketId-button"
            type="button"
            className="btn-plain btn-round {ticketId != '' ? '' : 'disabled'}"
            icon="search"
          />
        </div>
        <div class="export-buttons">
          <Input
            label=""
            id="csv-export"
            type="button"
            className="btn-plain btn-square fill-blue {dispersions.length > 0 ? '' : 'disabled'}"
            icon="csv-fill"
          />
          <Input
            label=""
            id="excel-export"
            type="button"
            className="btn-plain btn-square fill-green {dispersions.length > 0 ? '' : 'disabled'}"
            icon="xls-fill"
          />
          <Input
            label=""
            id="print"
            type="button"
            className="btn-plain btn-square fill-blue {dispersions.length > 0 ? '' : 'disabled'}"
            icon="print"
          />
          <Input
            label=""
            id="pdf-export"
            type="button"
            className="btn-plain btn-square fill-red {dispersions.length > 0 ? '' : 'disabled'}"
            icon="pdf-fill"
          />
          <!-- <Input on:click={exportDataToCSV(dispersions)} label="" id="csv-export" type="button" className="btn-plain btn-square {dispersions.length > 0 ? '' : 'disabled'}" icon="csv-fill"/> -->
          <!-- <Input on:click={exportDataToExcel(dispersions)} label="" id="excel-export" type="button" className="btn-plain btn-square {dispersions.length > 0 ? '' : 'disabled'}" icon="xls-fill"/> -->
          <!-- <Input on:click={exportDataToPDF(dispersions)} label="" id="pdf-export" type="button" className="btn-plain btn-square {dispersions.length > 0 ? '' : 'disabled'}" icon="pdf-fill"/> -->
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="card-group">
        <div class="button">
          <Input
            on:click={showModal(modalClarification)}
            label="Solicitar Aclaración"
            id="aclarationButton"
            type="button"
            className="btn-plain"
            icon=""
          />
        </div>
        <div class="card">
          <div><p>Saldo a Depositar</p></div>
          <div>
            <span>{user.toDeposit.toLocaleString(localeParam.language, localeParam.currency)}</span>
          </div>
        </div>
        <div class="button">
          <Input
            on:click={showModal(modalImmediateDeposit)}
            label="Depósito Urgente"
            id="immediateDepositButton"
            type="button"
            className="btn"
            icon=""
          />
        </div>
      </div>
    </div>
  {/if}
  <div class="dispersions-view">
    {#if notFound}
      <div class="not-found">
        <b>
          {notFoundMessage}
        </b>
      </div>
    {:else if !dispersionDetailView}
      <div class="dispersion-tables">
        <div bind:this={pdfData} id="pdfTable" class="table-container">
          <div class="card-container">
            <table class="table-content">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th class="responsive hide">ID</th>
                  <th>Saldo</th>
                  <th>Tipo</th>
                  <th class="responsive hide">Comisión</th>
                  <th class="responsive hide">IVA</th>
                  <th class="responsive hide">Interés</th>
                  <th class="responsive hide">Depósito</th>
                  <th class="responsive hide">Saldo Final</th>
                </tr>
              </thead>
              <tbody>
                {#each dispersions as dispersion}
                  <tr
                    class="clickable-table-row"
                    on:click={() => (dispersionDetailView = true)}
                    on:keypress={(e) => (e.key === "Enter" ? (dispersionDetailView = true) : "")}
                  >
                    <td>{getTransactionDate(dispersion.date) + " - " + getTransactionTime(dispersion.time)}</td>
                    <!-- <td>
                          <Input
                            id='detailsTicket{dispersion.id}'
                            title="Ver Detalles"
                            on:click={() => (selectedDispersion = dispersion)}
                            on:click={() => (dispersionDetailView = true)}
                            label={dispersion.id} type="button" className="text-button" icon=""/>
                        </td> -->
                    <td class="responsive hide">{dispersion.id}</td>
                    <td>{parseFloat(dispersion.total).toLocaleString(localeParam.language, localeParam.currency)}</td>
                    <td>{dispersion.type}</td>
                    <td class="responsive hide"
                      >{parseFloat(dispersion.commission).toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                    <td class="responsive hide"> - </td>
                    <td class="responsive hide" />
                    <td class="responsive hide"
                      >{parseFloat(dispersion.dispersion).toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                    <td class="responsive hide"
                      >{parseFloat(dispersion.afterDispersion).toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    {:else}
      <div class="return">
        <Input
          on:click={() => (dispersionDetailView = false)}
          label="Regresar"
          id="detailsReturnButton"
          type="button"
          className="btn-plain"
          icon=""
        />
      </div>
      <div class="dispersion-details">
        <div class="details__top">
          <b>Recibo #{selectedDispersion.id}</b>
          <p>
            {selectedDispersion.date.toDate().getDate()} de {getMonthName(selectedDispersion.date.toDate().getMonth())} del
            {selectedDispersion.date.toDate().getFullYear()} a las {selectedDispersion.date
              .toDate()
              .toLocaleTimeString()}
          </p>
        </div>
        <div class="details__middle">
          <div class="details-left hide">
            <div class="title">Datos</div>
            <div class="item">
              <b>Tipo de Depósito</b>
              <p>{depositTypeName(selectedDispersion.type)}</p>
            </div>
            <div class="item">
              <b>Referencia</b>
              <p>{selectedDispersion.reference}</p>
            </div>
            <div class="item">
              <b>Rastreo</b>
              <p>{selectedDispersion.tracking}</p>
            </div>
          </div>
          <div class="details-center">
            <div class="details-card">
              <div class="details-card__top">
                <b>Detalle de Depósito</b>
              </div>
              <div class="details-card__middle">
                <div class="item">
                  <b>Cuenta CLABE</b>
                  <p>{getClabe(selectedDispersion.clabe)}</p>
                </div>
                <!-- <div class="item">
                      <b>Tipo de Tarjeta</b>
                      <p></p>
                    </div> -->
                <div class="item">
                  <b>Total Depositado</b>
                  <p>
                    {selectedDispersion.dispersion.toLocaleString(localeParam.language, localeParam.currency)}
                  </p>
                </div>
              </div>
              <div class="details-card__bottom">
                <div class="item">
                  <b>Ventas</b>
                  <p>{selectedDispersion.transactions}</p>
                  <!-- <span>{`(${(selectedDispersion.commission/selectedDispersion.total)*100}%)`}</span> -->
                </div>
                <div class="item">
                  <b>Total Ventas</b>
                  <p>{selectedDispersion.total.toLocaleString(localeParam.language, localeParam.currency)}</p>
                  <span />
                </div>
                <div class="item">
                  <p>
                    {selectedDispersion.commission.toLocaleString(localeParam.language, localeParam.currency)}
                  </p>
                  <!-- <span>(4.06%)</span> -->
                </div>
              </div>
            </div>
            <div class="card-buttons">
              <div class="clarification-button">
                <Input
                  on:click={() => (detailClarification.ticket = selectedDispersion.id)}
                  on:click={showModal(modalDetailClarification)}
                  label="Aclaración"
                  id="clarificationDispersionDetail"
                  type="button"
                  className="btn-plain"
                  icon=""
                />
              </div>
              <div class="email-button">
                <Input label="Enviar por e-mail" id="emailDispersion" type="button" className="btn-plain" icon="" />
              </div>
              <div class="print-button">
                <Input label="Imprimir Recibo" id="printDispersion" type="button" className="btn-plain" icon="" />
              </div>
            </div>
          </div>
          <div class="details-right hide">
            <div class="title">Reportes</div>
            <div class="export-buttons">
              <Input
                label=""
                id="csv-export"
                type="button"
                className="btn-plain btn-square fill-blue {dispersions.length > 0 ? '' : 'disabled'}"
                icon="csv-fill"
              />
              <Input
                label=""
                id="excel-export"
                type="button"
                className="btn-plain btn-square fill-green {dispersions.length > 0 ? '' : 'disabled'}"
                icon="xls-fill"
              />
              <Input
                id="print"
                type="button"
                className="btn-plain btn-square fill-blue {dispersions.length > 0 ? '' : 'disabled'}"
                icon="print"
              />
              <Input
                label=""
                id="pdf-export"
                type="button"
                className="btn-plain btn-square fill-red {dispersions.length > 0 ? '' : 'disabled'}"
                icon="pdf-fill"
              />
              <!-- <Input on:click={
                    () => {
                      dispersionToArray.push(selectedDispersion)
                      exportDataToCSV(dispersionToArray)
                      dispersionToArray = [];
                    }
                  } label="" id="csv-export" type="button" className="btn-plain btn-square " icon="csv-fill"/>
                  <Input on:click={
                    () => {
                      dispersionToArray.push(selectedDispersion)
                      exportDataToCSV(dispersionToArray)
                      dispersionToArray = [];
                    }
                  } label="" id="excel-export" type="button" className="btn-plain btn-square " icon="xls-fill"/>
                  <Input on:click={
                    () => {
                      dispersionToArray.push(selectedDispersion)
                      exportDataToCSV(dispersionToArray)
                      dispersionToArray = [];
                    }
                  } label="" id="pdf-export" type="button" className="btn-plain btn-square " icon="pdf-fill"/>
                 -->
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .dispersions {
    /* display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: right; */
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }

  .dispersions .return {
    display: flex;
    width: 10rem;
    height: 2.5rem; /* 40px */
    justify-content: left;
  }

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.5rem;
  }

  .top__left .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .top__left .buttons .element {
    height: 2.5rem; /* 40px */
  }

  .top__middle {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    gap: 1rem;
  }

  .top__middle .date p {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem; /* 20px */
    line-height: 1.25rem; /* 20px */
    text-align: center;
    /* Text */
    color: $primary-dark;
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
    justify-content: center;
    padding: 0px;
    gap: 24px;
    width: 610px;
    height: 88px;
    /* Inside auto layout */
    flex: none;
    order: 2;
    flex-grow: 0;
  }

  .card-group .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 16px;
    min-width: 166px;
    height: 88px;
    /* Nue Fill */
    background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #e6e8ef 100%);
    /* out */
    box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
  }
  .card-group .button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 1rem;
    gap: 1rem;
    width: 8.75rem; /* 140px */
    height: 4.375rem; /* 70px */
    /* Nue Fill */
    /* background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #E6E8EF 100%); */
    /* out */
    /* box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41); */
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
    color: #8c9fb1;
  }

  .card-group .card span {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 20px;
    text-align: center;
    /* Text */
    color: $primary-dark;
  }

  .dispersions-view {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .dispersion-search-bar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .clarifications {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* TEXT */
    text-align: center;
    font-weight: 700;
    line-height: 1.25rem; /* 20px */
    color: $primary-dark;
  }
  .clarifications .title {
    font-size: 1rem; /* 16px */
  }
  .clarifications .description {
    font-size: 1.5rem; /* 16px */
  }
  .clarification-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* width: 50%; */
  }

  /* STYLES IMMEDIATE DEPOSIT MODAL */
  .immediate-deposit {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 1rem;
  }

  .immediate-deposit > .error > p {
    font-weight: 700;
    font-size: 1rem; /* 16px */
    line-height: 1.25rem; /* 20px */
    /* or 100% */

    display: flex;
    align-items: center;
    text-align: center;

    /* Text */

    color: $primary-dark;
  }
  .immediate-deposit .row-element {
    display: flex;
  }
  .immediate-deposit .column-element {
    display: flex;
    flex-direction: column;
  }
  .immediate-deposit .column-element .blue-title {
    display: flex;
    align-self: center;
    font-weight: 700;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.25rem; /* 20px */
    color: $primary-dark;
  }
  .immediate-deposit .column-element .gray-title {
    display: flex;
    align-self: center;
    font-weight: 700;
    font-size: 1.25rem; /* 20px */
    line-height: 1.25rem; /* 20px */
    color: #8c9fb1;
  }
  .immediate-deposit .column-element .content {
    display: flex;
    align-self: center;
    font-weight: 700;
    font-size: 1.25rem; /* 20px */
    line-height: 1.25rem; /* 20px */
    color: $primary-dark;
  }

  .immediate-deposit .terms {
    display: flex;
    flex-direction: row;
    height: 5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: 700;
    font-size: 0.8125rem;
    line-height: 1.25;
    display: flex;
    align-items: center;
    color: $grey;
  }

  .immediate-deposit .terms a {
    text-decoration: none;
    color: #5585ff;
  }

  .immediate-deposit .terms-checkbox {
    height: 100%;
    margin-right: 0.4375rem;
    display: flex;
    align-items: start;
  }
  /* -------------------------------------------- */

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
    font-size: 1.25rem; /* 20px */
    line-height: 1.25rem; /* 20px */
    text-align: center;
    /* Text */
    color: $primary-dark;
  }
  .dispersion-tables {
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

  .table-content .clickable-table-row {
    cursor: pointer;
  }

  .table-content thead {
    font-family: "Raleway";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    text-align: center;
    /* text-placeholder */
    color: $primary-dark;
    height: 2.375rem;
  }

  .table-content td {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #000000;
    text-align: center;
    border-bottom: 1px solid #8c9fb1;
    padding: 0.625rem 0rem 0.625rem 0rem;
    min-width: 7rem;
  }

  th:first-child {
    text-align: left;
  }
  td:first-child {
    text-align: left;
  }

  .modal-buttons {
    width: 70%;
    height: 2.5rem; /* 40px */
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
  }

  .dispersion-details {
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

  .details__top b {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.25rem;
    color: $primary-dark;
  }
  .details__top p {
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.25rem;
    color: #8c9fb1;
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
    color: $primary-dark;
  }

  .details__middle .details-left .item b {
    font-style: normal;
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 0.875rem; /* 14px */
    color: #8c9fb1;
  }
  .details__middle .details-left .item p {
    font-style: normal;
    font-weight: 700;
    font-size: 0.875rem; /* 14px */
    line-height: 0.875rem; /* 14px */
    color: #8c9fb1;
  }

  .details__middle .details-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem; /* 16px */
    gap: 2rem; /* 32px */
    width: 26.75rem; /* 428px */
    height: 13.125rem; /* 210px */
    /* Fill Container */
    background: $background-light-secondary;
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
  }

  .details__middle .details-center .details-card .details-card__top b {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem; /* 20px */
    line-height: 1.125rem; /* 18px */
    color: $primary-dark;
  }
  .details__middle .details-center .details-card .details-card__middle {
    display: flex;
    flex-direction: row;
    gap: 2rem;
  }
  .details__middle .details-center .details-card .details-card__middle .item b {
    display: flex;
    justify-content: center;
    font-style: normal;
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    color: $primary-dark;
  }

  .details__middle .details-center .details-card .details-card__middle .item p {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem; /* 20px */
    line-height: 1.125rem; /* 18px */
    color: $primary-dark;
  }
  .details__middle .details-center .details-card .details-card__bottom {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    width: -webkit-fill-available;
    justify-content: space-evenly;
  }
  .details__middle .details-center .details-card .details-card__bottom .item b {
    font-style: normal;
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    color: #8c9fb1;
  }

  .details__middle .details-center .details-card .details-card__bottom .item p {
    font-style: normal;
    font-weight: 700;
    font-size: 0.875rem; /* 14px */
    line-height: 1.125rem; /* 18px */
    color: $primary-dark;
    text-align: center;
  }

  .details__middle .details-center .details-card .details-card__bottom .item span {
    display: flex;
    justify-content: center;
    font-style: normal;
    font-weight: 500;
    font-size: 0.625rem; /* 10px */
    line-height: 0.875rem; /* 14px */
    color: #8c9fb1;
  }

  .details__middle .details-center .card-buttons {
    width: 100%;
    height: 2.5rem; /* 40px */
    display: flex;
    margin-top: 2rem;
    gap: 1rem; /* 16px */
    justify-content: center;
  }
  .details__middle .details-center .card-buttons .clarification-button {
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
    color: $primary-dark;
  }

  .details__middle .details-right .item b {
    font-style: normal;
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 0.875rem; /* 14px */
    color: #8c9fb1;
  }
  .details__middle .details-right .item p {
    font-style: normal;
    font-weight: 700;
    font-size: 0.875rem; /* 14px */
    line-height: 0.875rem; /* 14px */
    color: #8c9fb1;
  } /* 
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

  @media (max-width: 540px) {
    .top {
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

    .middle > .card-group {
      /* flex-direction: column;
      height: auto;
      width: 100%; */
      gap: 0.5rem;
    }

    .middle * .button {
      padding: 0;
      width: 7rem;
      height: 3.375rem;
    }

    /* .middle * .card {
      width: -webkit-fill-available;
    } */

    .table-container {
      display: block;
      width: 100%;
    }

    .card-container {
      padding: 2rem 2rem;
    }

    .dispersions-view {
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

    .dispersions .return {
      margin: 0rem 0rem 1rem 0rem;
    }

    .details__middle .details-card {
      width: auto;
    }

    .immediate-deposit .terms {
      max-width: 310px;
    }
    .responsive,
    .hide {
      display: none;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .top__left {
      min-width: 15rem;
    }
    .middle > .card-group {
      /* flex-direction: column; */
      height: auto;
      width: 100%;
      gap: 0.5rem;
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
    .hide {
      display: none;
    }
    /* .responsive {
      display: none;
    } */
  }
</style>
