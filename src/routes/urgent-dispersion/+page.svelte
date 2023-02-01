<script>
  import { isLoggedIn, loggedInUser, redirectUrgentDispersions } from '$lib/stores';
  import Loader from '$lib/components/Loader.svelte';
  import { updateUserBankAccountInfo, updateUserInfo, updateUserIne} from '$lib/hooks/updates.js'
  import { fetchRates } from '$lib/hooks/rates.js';
  import { Timestamp } from 'firebase/firestore';
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Radio from '$lib/components/Radio.svelte';
  import { onMount } from 'svelte';
  import {goto} from '$app/navigation';

  const localeParam = {
    language: 'es-MX',
    currency: {
      style: 'currency',
      currency: 'MXN'
    }
  }

  let userData = {};

  let bankAccountInfo = {
    clabe: "",
    ineFront: "",
    ineBack: "",
    bankStatement: "",
  }

  let formINEFront = "", formINEBack = "", formCLABE = "", formBankStatement = "";
  let files = [];
  let modalBankInfo, modalUrgentDeposit;
  let depositValue = $loggedInUser.depositPreference;
  let multiple = true;

  let rates;
  let rateLklPay, rateNatural, ratesBusinessType, rateUrgentDispersion;
  let urgentDepositQty = 0;

  let depositOptions = [
    {
      label: "Diario",
      value: "daily",
    },
    {
      label: "Semanal",
      value: "weekly",
    },
    {
      label: "Mensual",
      value: "monthly",
    }
  ]

  const fetchDBRates = () => {
    try {
      const fetch = fetchRates()
      fetch.then((value) => {
        rates = value;
        rateLklPay = value.rateLklPay;
        rateNatural = value.rateNatural;
        rateUrgentDispersion = value.rateUrgentDispersion;
        ratesBusinessType = value.ratesBusinessType;
      }).catch(err => {
        console.log(err);
      });
    } catch (error) {
      throw new Error(error)
    }
  }

  const handleCreateBankAccount = async() => {
    userData.uid = $loggedInUser.uid;
    const ineFront = document.getElementById('buttonIneFront').files[0]
    const ineBack = document.getElementById('buttonIneBack').files[0]
    const bankStatement = document.getElementById('form-bank-statement').files[0]
    /* const ine = URL.createObjectURL(
      document.getElementById('form-ine').files[0]
    ) */
    const ineFrontType = document.getElementById('buttonIneFront').files[0].type;
    const ineBackType = document.getElementById('buttonIneBack').files[0].type;
    const bankStatementType = document.getElementById('form-bank-statement').files[0].type;

    /* const bankStatement = URL.createObjectURL(
      document.getElementById('form-bank-statement').files[0]
      ) */
      
      bankAccountInfo.clabe = formCLABE;
      // bankAccountInfo.ine = ine;
      bankAccountInfo.ineFront = ineFront;
      bankAccountInfo.ineFrontType = ineFrontType;
      bankAccountInfo.ineBack = ineBack;
      bankAccountInfo.ineBackType = ineBackType;
      bankAccountInfo.bankStatement = bankStatement;
      bankAccountInfo.bankStatementType = bankStatementType;

      userData.bankAccountInfo = bankAccountInfo;


    formINEFront = "", formINEBack = "", formCLABE = "", formBankStatement = "";
    // bankDataDelivered.update(() => true)

    // console.log(userData)
    await updateUserIne(userData)
    // await updateUserBankAccountInfo(bankAccountInfo)
    // bankAccountData.set(bankAccountInfo)
    // console.log(bankAccountInfo)
  }

  const handleUpdateDepositPreference = async() => {
    let data = {};
    data.uid = $loggedInUser.uid;
    data.depositPreference = depositValue;
    data.depositDateReference = Timestamp.now();
    try {
      await updateUserInfo(data);
    } catch (error) {
      throw new Error(error)
    }
  }

  const depositPreference = (preference) => {
    const option = {
      "daily": {
        name: "Diario"
      },
      "weekly": {
        name: "Semanal"
      },
      "monthly": {
        name: "Mensual"
      },
      "": {
        name: "Sin Asignar"
      },
    }
    return option[preference].name;
  }

  const bankAccountDataStatus = (status) => {
    const dataStatus = {
      "pending": {
        name: "Pendiente"
      },
      "approved": {
        name: "Aprobada"
      },
      "rejected": {
        name: "Rechazada"
      },
      "delivered": {
        name: "Enviada"
      },
    }
    return dataStatus[status].name;
  }

  const getPercentage = (num, per) => {
    const percentage = (num/100)*per
    const total = num - percentage;
    return total
  }

  const handleAskUrgentDeposit = async() => {
    let data = {};
    data.uid = $loggedInUser.uid;
    data.toDeposit = $loggedInUser.toDeposit - urgentDepositQty;
    try {
      const promise = await updateUserInfo(data)
      /* promise */.then(() => {
        alert("Tu solicitud se procesó con éxito")
      })
      .catch(err => {
        alert("Tu solicitud no se pudo procesar, intenta de nuevo")
      })
    } catch (error) {
      throw new Error(error)
    }
    // console.log(data)
  }

  const showModal = (option) => {
    option.show();
  }

  const closeModal = (option) => {  
    option.closeModal();
  }

  onMount(() => {
    $redirectUrgentDispersions = true;
    goto('/dispersions');
    /* fetchDBRates();
    if($loggedInUser?.statusBankAccountInfo === 'pending'){
      showModal(modalBankInfo)
      // console.log("informacion pendiente")
    } */
  });
</script>

<!-- MODAL UPDATE BANK ACCOUNT INFO -->
<Modal className={"modal-medium"} bind:this={modalBankInfo}>
  <div slot="header">
    <p>Modificar Cuenta de Banco</p>
  </div>
  <div slot="content">
    <p>
      A continuación, ingresa los datos solicitados
    </p>
    <Input label="CLABE:" id="form-clabe" bind:value={formCLABE} type="text" className="txt-field normal"/>
    <div class="modal-row">
      <div class="row-title">INE</div>
      <div class="buttons">
        <Input label="Frente" id="buttonIneFront" bind:value={formINEFront} className="{formINEFront != "" ? "btn-success" : "btn-plain"}"  type="file" accept="image/*,.pdf"/>
        <Input label="Vuelta" id="buttonIneBack" bind:value={formINEBack} className="{formINEBack != "" ? "btn-success" : "btn-plain"}" type="file" accept="image/*,.pdf"/>
      </div>
    </div>
    <div class="modal-row">
      <div class="row-title">Estado de Cuenta</div>
      <div class="buttons">
        <Input label="Estado de Cuenta" id="form-bank-statement" bind:value={formBankStatement} className="{formBankStatement != "" ? "btn-success" : "btn-plain"}" type="file" accept="image/*,.pdf"/>
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input on:click={closeModal(modalBankInfo)} label="Cerrar" id="buttonCloseModalBankInfo" type="button" className="btn" icon=""/>
    <Input 
      on:click={closeModal(modalBankInfo)} 
      on:click={() => handleCreateBankAccount()} 
      label="Guardar" 
      id="buttonSaveModalBankInfo" 
      type="button" 
      className={` 
        ${
          formCLABE != "" &&
          formINEFront != "" && 
          formINEBack != "" && 
          formBankStatement != "" ?
          "btn" : "btn-disabled"
        }`
      } 
      icon=""
    />
  </div>
</Modal>

<!-- MODAL URGENT DEPOSIT -->
<Modal className={`modal-medium`} bind:this={modalUrgentDeposit}>
  <div slot="header">
    <h1>Solicitar Depósito Urgente</h1>
  </div>
  <div slot="content">
    <p>
      A continuación, ingresa la cantidad que deseas solicitar.
    </p>
    <p>
      Recuerda que se te cobrará una comisión extra de <b>{rateUrgentDispersion}%</b> <!-- más tu comisión actual de <b>...</b> -->
    </p>
    {#if urgentDepositQty > 0 && urgentDepositQty <= $loggedInUser?.toDeposit}
      <p>
        Recibirás <b>{getPercentage(urgentDepositQty, (rateUrgentDispersion)).toLocaleString(localeParam.language, localeParam.currency)}</b>
        de tus <b>{urgentDepositQty.toLocaleString(localeParam.language, localeParam.currency)}</b> solicitados
      </p>
    {/if}
    <Input label="Cantidad Solicitada" id="form-clabe" bind:value={urgentDepositQty} type="number" className="txt-field normal"/>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input on:click={closeModal(modalUrgentDeposit)} label="Cerrar" id="buttonCloseModalUrgentDeposit" type="button" className="btn" icon=""/>
    <Input 
      on:click={closeModal(modalUrgentDeposit)} 
      on:click={() => handleAskUrgentDeposit()} 
      label="Solicitar" 
      id="buttonSaveModalUrgentDeposit" 
      type="button" 
      className={`
        ${
          urgentDepositQty > 0 && urgentDepositQty <= $loggedInUser?.toDeposit 
          ? "btn" : "btn-disabled"
        }`
      } 
      icon=""
    />
  </div>
</Modal>

<div class="container">
  <Loader/>
</div>
<!-- <div class="content">
  <div class="title">
    <h1>Cuenta de Banco</h1>
  </div>
  <div class="data">
    <div class="data-row">
      <b>Pendiente de Depósito: </b> 
      <p>
        {$loggedInUser.toDeposit?.toLocaleString(localeParam.language, localeParam.currency) || ""}
      </p>
      <Input
        id='triggerModalUrgentDeposit'
        title="Solicitar Depósito Urgente"
        on:click={() => (showModal(modalUrgentDeposit))}
        label={"Solicitar"} type="button" className="text-button" icon=""
      />
    </div>
    <div class="data-row">
      <b>CLABE: </b> {$loggedInUser.bankAccountInfo?.clabe || ""}
    </div>
    <div class="data-row">
      <b>Tipo de Depósito: </b> {$loggedInUser.depositPreference ? depositPreference($loggedInUser?.depositPreference) : ""}
    </div>
    <div class="data-row">
      <b>INE: </b>
      {#if $loggedInUser.bankAccountInfo?.ineFront}
      <a href={$loggedInUser.bankAccountInfo?.ineFront} target="_blank" rel="noopener noreferrer">INE Frente</a>
      <a href={$loggedInUser.bankAccountInfo?.ineBack} target="_blank" rel="noopener noreferrer">INE Vuelta</a>
      {/if}
    </div>
    <div class="data-row">
      <b>Estado de Cuenta: </b>
      {#if $loggedInUser.bankAccountInfo?.bankStatement}
        <a href={$loggedInUser.bankAccountInfo?.bankStatement} target="_blank" rel="noopener noreferrer">Ver Documento</a>
      {/if}
    </div>
    <div class="data-row">
      <b>Estado: </b> {$loggedInUser.statusBankAccountInfo ? bankAccountDataStatus($loggedInUser?.statusBankAccountInfo) : ""}
    </div>
    <div class="footer">
      <Input on:click={showModal(modalBankInfo)} label="Editar" id="edit-bankAccount-info" type="checkbox" className="btn" icon=""/>
    </div>
    <div class="radio-options">
      <Radio bind:options={depositOptions} fontSize={16} legend='Selecciona la periodicidad de tus depósitos' bind:userSelected={depositValue}/>
      <div>
        <Input on:click={handleUpdateDepositPreference(depositValue)} label="Guardar" id="editDepositPreferenceSaveButton" type="button" className="btn" icon=""/>
      </div>
    </div>
  </div>
</div> -->

<style>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
}
.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

.title{
  display: flex;
  justify-content: center;
}

/* .display-user-info{
  display: flex;
  justify-content: left;
  flex-direction: column;
} */

.data {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 2rem;
  padding: 1rem;
}

.data .data-row {
  display: flex;
  flex-direction: row;
  gap: 1rem
}
.data .footer{
  width: 30%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 1rem 0rem;
}

.modal-buttons {
  width: 60%;
  gap: 1rem;
  display: flex;
  flex-direction: row;
}

.modal-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.modal-row .row-title {
  font-size: .8125rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #8B9EB0;
  text-align: center;
  margin-top: 1rem;
}
.modal-row .buttons {
  display: inherit;
  width: 90%;
  height: 2.5rem;/* 40px */
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>