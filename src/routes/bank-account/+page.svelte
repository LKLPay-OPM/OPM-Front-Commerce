<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  import { updateUserBankAccountInfo, updateUserInfo } from '$lib/hooks/updates.js'
  import { fetchRates } from '$lib/hooks/rates.js'
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Radio from '$lib/components/Radio.svelte';
  import { onMount } from 'svelte';

  const localeParam = {
    language: 'es-MX',
    currency: {
      style: 'currency',
      currency: 'MXN'
    }
  }

  let bankAccountInfo = {
    clabe: "",
    ine: "",
    bankStatement: "",
  }

  let formINE = "", formCLABE = "", formBankStatement = "";
  let files = [];
  let modalBankInfo, modalUrgentDeposit;
  let depositValue = $loggedInUser.depositPreference;

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
    bankAccountInfo.uid = $loggedInUser.uid;
    const ine = document.getElementById('form-ine').files[0]
    const bankStatement = document.getElementById('form-bank-statement').files[0]
    /* const ine = URL.createObjectURL(
      document.getElementById('form-ine').files[0]
    ) */
    const ineType = document.getElementById('form-ine').files[0].type;
    const bankStatementType = document.getElementById('form-bank-statement').files[0].type;
    /* const bankStatement = URL.createObjectURL(
      document.getElementById('form-bank-statement').files[0]
    ) */

    bankAccountInfo.clabe = formCLABE;
    bankAccountInfo.ine = ine;
    bankAccountInfo.bankStatement = bankStatement;
    bankAccountInfo.ineType = ineType;
    bankAccountInfo.bankStatementType = bankStatementType;


    formINE = "", formCLABE = "", formBankStatement = "";
    // bankDataDelivered.update(() => true)

    await updateUserBankAccountInfo(bankAccountInfo)
    // bankAccountData.set(bankAccountInfo)
    // console.log(bankAccountInfo)
  }

  const handleUpdateDepositPreference = async() => {
    let data = {};
    data.uid = $loggedInUser.uid;
    data.depositPreference = depositValue;
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
    fetchDBRates();
    if($loggedInUser?.statusBankAccountInfo === 'pending'){
      showModal(modalBankInfo)
      // console.log("informacion pendiente")
    }
  });
</script>

<!-- MODAL UPDATE BANK ACCOUNT INFO -->
<Modal className={"modal-medium"} bind:this={modalBankInfo}>
  <div slot="header">
    <h1>Modificar Cuenta de Banco</h1>
  </div>
  <div slot="content">
    <p>
      A continuación, ingresa los datos solicitados
    </p>
    <Input label="CLABE:" id="form-clabe" bind:value={formCLABE} type="text" className="txt-field normal"/>
    <Input label="INE:" id="form-ine" bind:value={formINE} className="" type="file" accept="image/*,.pdf"/>
    <Input label="Estado de Cuenta:" id="form-bank-statement" bind:value={formBankStatement} className="" type="file" accept="image/*,.pdf"/>
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
          formINE != "" && 
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

<div class="content">
  <div class="title">
    <h1>Cuenta de Banco</h1>
  </div>
  <div class="data">
    <div class="data-row">
      <b>Pendiente de Depósito: </b> 
      <p>
        {$loggedInUser?.toDeposit.toLocaleString(localeParam.language, localeParam.currency) || ""}
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
      {#if $loggedInUser.bankAccountInfo?.ine}
        <a href={$loggedInUser.bankAccountInfo?.ine} target="_blank" rel="noopener noreferrer">Ver Documento</a>
      {/if}
    </div>
    <div class="data-row">
      <b>Estado de Cuenta: </b>
      {#if $loggedInUser.bankAccountInfo?.bankStatement}
        <a href={$loggedInUser.bankAccountInfo?.bankStatement} target="_blank" rel="noopener noreferrer">Ver Documento</a>
      {/if}
    </div>
    <div class="data-row">
      <b>Estado: </b> {bankAccountDataStatus($loggedInUser?.statusBankAccountInfo)}
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
</div>

<style>
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
</style>