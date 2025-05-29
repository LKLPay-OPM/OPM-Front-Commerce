<script>
  /* svelte */
  import { onMount } from "svelte";
  import { loggedInUser } from "$lib/stores";

  import { goto } from "$app/navigation";
  /* components */
  import Title from "$lib/components/Title.svelte";
  import InfoCard from "$lib/components/InfoCard.svelte";
  import Container from "$lib/components/Container.svelte";
  import AlignContainer from "$lib/components/AlignContainer.svelte";
  import ExportButtonGroup from "$lib/components/ExportButtonGroup.svelte";
  /* utils */
  import { getMonthName, timeToLocalString, dateToLocalString } from "$lib/utils/date";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import { getIconStatusClass } from "$lib/utils/iconClass";
    import TransactionTable from "./transaction/TransactionTable.svelte";

  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  export let data;

  console.log("data", data);
  let filter = "day";
  let dateStart = data.dateStart;
  let dateEnd = data.dateEnd;
  export let start;
  export let end;
  let pageSelected = 1;
  let resume = data.summary;
  let transactions = data.transactions;
  let loading = false;
  let notFound = false;

  const transactionFound = () => {
    if (transactions.length <= 0) {
      notFound = true;
    } else {
      notFound = false;
    }
    loading = false;
  };

  export let handlePagination;

  onMount(() => {
    transactionFound();
  });
</script>

<div class="container">
  <Container>
    <AlignContainer cols="2">
      <Title title="Resumen" align="left" />
      <Title title="Reporte del día" align="right" />
    </AlignContainer>
    <AlignContainer cols="1" marginTop="16px">
      <ExportButtonGroup {dateStart} {dateEnd} />
    </AlignContainer>
  </Container>
  <div class="subtitle">
    <p>Tu Información al día de hoy</p>
  </div>
  <div class="content" style="margin-top: 20px;">
    <div class="card-group">
      <div class="card">
        <InfoCard className={""} title="Monto Total" numData={currencyFormatLocal(resume?.approvedAmount ?? 0)} />
      </div>
      <div class="card">
        <InfoCard className={""} title="N° de Ventas" numData={resume?.approvedCount ?? "0"} />
      </div>
      <div class="card">
        <InfoCard className={""} title="Saldo a Depositar" numData={currencyFormatLocal(resume?.toDeposit ?? 0)} />
      </div>
    </div>
    <div class="transactions" style={transactions?.length <= 0 ? "min-height: 25rem;" : ""}>
      <div class="top">
        <div class="top__left">
          <p><a href="/transactions">Últimas Transacciones</a></p>
        </div>
      </div>
      {#if transactions?.length > 0}
        <TransactionTable
          {transactions}
          bind:count={data.total}
          bind:start
          bind:end
          bind:selected={pageSelected}
          on:pagination={handlePagination}
          bind:loading={loading}
        />
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

<style lang="scss">
  @import "src/lib/styles/dashboard.scss";
</style>
