<script>
  import { isLoggedIn, loggedInUser, bankDataDelivered, bankAccountData } from '$lib/stores';
  import Input from '$lib/components/Input.svelte';

  let bankAccountInfo = {
    CLABE: "",
    INE: "",
    bankStatement: "",
    status: "pending"
  }

  let formINE = "", formCLABE = "", formBankStatement = "";

  const handleCreateBankAccount = () => {
    const INE = URL.createObjectURL(
      document.getElementById('form-INE').files[0]
    )
    const bankStatement = URL.createObjectURL(
      document.getElementById('form-bank-statement').files[0]
    )

    bankAccountInfo.CLABE = formCLABE;
    bankAccountInfo.INE = INE;
    bankAccountInfo.bankStatement = bankStatement;

    formINE = "", formCLABE = "", formBankStatement = "";
    bankDataDelivered.update(() => true)
    bankAccountData.set(bankAccountInfo)
    //console.table(bankAccountInfo)
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

<div>
  <div class="content">
    <div class="title">
      <h1>Cuenta de Banco</h1>
    </div>
  </div>
  {#if $bankDataDelivered}
  <div class="data">
    <div>
      <b>CLABE: </b> {$bankAccountData.CLABE}
    </div>
    <div>
      <b>INE: </b>
      {#if $bankAccountData.INE != ""}
        <a href={$bankAccountData.INE} target="_blank" rel="noopener noreferrer">Ver Documento</a>
      {/if}
    </div>
    <div>
      <b>Estado de Cuenta: </b>
      {#if $bankAccountData.bankStatement != ""}
        <a href={$bankAccountData.bankStatement} target="_blank" rel="noopener noreferrer">Ver Documento</a>
      {/if}
    </div>
    <div>
      <b>Estado: </b> {bankAccountDataStatus($bankAccountData.status)}
    </div>
  </div>
  {:else}
  <div>
    <div class="bank-account-form">
      <form on:submit|preventDefault={handleCreateBankAccount} class="card-body">
        <Input label="CLABE:" id="form-CLABE" bind:value={formCLABE} type="text"/>
        <Input label="INE:" id="form-INE" bind:value={formINE} type="file" accept="image/*,.pdf"/>
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
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 2rem;
  padding: 1rem;
}
</style>