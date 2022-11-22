<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  import { updateUserBankAccountInfo } from '$lib/hooks/updates.js'
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { onMount } from 'svelte';

  let bankAccountInfo = {
    clabe: "",
    ine: "",
    bankStatement: "",
    status: "pending"
  }

  let formINE = "", formCLABE = "", formBankStatement = "";
  /* let bankDataDelivered = false;

  onMount(async () => {
    if ($loggedInUser.bankAccountInfo) {
      bankDataDelivered = true;
    }
	}); */

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

  const bankAccountDataStatus = (status) => {
    const dataStatus = {
      pending: {
        status: "Pendiente"
      },
      approved: {
        status: "Aprobada"
      },
      rejected: {
        status: "Rechazada"
      }
    }

    return dataStatus[status].status;
  }
</script>

<!-- MODAL UPDATE BANK ACCOUNT INFO -->
<Modal>
  <div slot="trigger" let:open>
    <Input on:click={open} label="Editar" id="edit-bankAccount-info" type="checkbox" className="modal-toggle" icon=""/>
  </div>
  <div slot="header">
    <h1>Modificar Cuenta de Banco</h1>
  </div>
  <div slot="content">
    <p>
      A continuación, ingresa los datos solicitados
    </p>
    <Input label="CLABE:" id="form-clabe" bind:value={formCLABE} type="text"/>
    <Input label="INE:" id="form-ine" bind:value={formINE} class="button" type="file" accept="image/*,.pdf"/>
    <Input label="Estado de Cuenta:" id="form-bank-statement" bind:value={formBankStatement} class="button" type="file" accept="image/*,.pdf"/>
  </div>
  <div class="modal-buttons" slot="footer" let:store={{close}}>
    <Input on:click={close} label="Cerrar" id="close-modal-button" type="button" className="button" icon=""/>
    {#if formCLABE != "" && formINE != "" && formBankStatement != ""}
      <Input on:click={close} on:click={() => handleCreateBankAccount()} label="Guardar" id="save-modal-button" type="button" className="button" icon=""/>
    {/if}
  </div>
</Modal>

<div class="content">
  <div class="title">
    <h1>Cuenta de Banco</h1>
  </div>
  {#if $loggedInUser.bankAccountInfo }
  <div class="data">
    <div>
      <b>CLABE: </b> {$loggedInUser.bankAccountInfo?.clabe}
    </div>
    <div>
      <b>INE: </b>
      {#if $loggedInUser.bankAccountInfo?.ine != ""}
        <a href={$loggedInUser.bankAccountInfo?.ine} target="_blank" rel="noopener noreferrer">Ver Documento</a>
      {/if}
    </div>
    <div>
      <b>Estado de Cuenta: </b>
      {#if $loggedInUser.bankAccountInfo?.bankStatement != ""}
        <a href={$loggedInUser.bankAccountInfo?.bankStatement} target="_blank" rel="noopener noreferrer">Ver Documento</a>
      {/if}
    </div>
    <div>
      <b>Estado: </b> {bankAccountDataStatus($loggedInUser.bankAccountInfo?.status)}
    </div>
    <Input on:click={open} label="Editar" id="edit-bankAccount-info" type="checkbox" className="button" icon=""/>
  </div>
  {:else}
  <div>
    <div class="bank-account-form">
      <form on:submit|preventDefault={handleCreateBankAccount} class="card-body">
        <Input label="CLABE:" id="form-clabe" bind:value={formCLABE} type="text"/>
        <Input label="INE:" id="form-ine" bind:value={formINE} type="file" accept="image/jpeg, image/png, .pdf"/>
        <Input label="Estado de Cuenta:" id="form-bank-statement" bind:value={formBankStatement} type="file" accept="image/*,.pdf"/>
        {#if formCLABE != "" && formINE != "" && formBankStatement != ""}
          <button type="submit" class="btn btn-auth-form">Guardar Datos</button>
        {/if}
      </form>
    </div>
  </div>
  {/if}
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
</style>