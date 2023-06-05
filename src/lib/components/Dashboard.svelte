<script>
  /* svelte */
  import { onMount } from "svelte";
  import { loggedInUser } from "$lib/stores";
  import { goto } from "$app/navigation";
  /* componens */
  import InfoCard from "$lib/components/InfoCard.svelte";
  /* utils */
  import { getMonthName, timeToLocalString, dateToLocalString } from "$lib/utils/date";
  /* constants */
  import { localeParam } from "$lib/constants/locale.js";

  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  export let data;
  let resume = data.transactions.resume;
  let transactions = data.transactions.transactions;
  let loading = false;
  let notFound = false;

  const transactionFound = () => {
    if (transactions.length <= 0) {
      notFound = true;
    } else {
      notFound = false;
      console.log(transactions);
    }
    loading = false;
  };

  onMount(() => {
    transactionFound();
  });
</script>

<div class="container">
  <div class="title">
    <p>Resumen</p>
  </div>
  <div class="subtitle">
    <p>Tu Información al día de hoy</p>
  </div>
  <div class="content">
    <div class="card-group">
      <div class="card">
        <InfoCard
          className={""}
          title="Monto Total"
          numData={resume?.Amount?.toLocaleString(localeParam.language, localeParam.currency) ?? "$0.00"}
        />
      </div>
      <div class="card">
        <InfoCard className={""} title="N° de Ventas" numData={resume?.Sold ?? "0"} />
      </div>
      <div class="card">
        <InfoCard
          className={""}
          title="Saldo a Depositar"
          numData={resume?.Deposit?.toLocaleString(localeParam.language, localeParam.currency) ?? "$0.00"}
        />
      </div>
    </div>
    <div class="transactions" style={transactions?.length <= 0 ? "min-height: 25rem;" : ""}>
      <div class="top">
        <div class="top__left">
          <p><a href="/transactions">Últimas Transacciones</a></p>
        </div>
      </div>
      {#if transactions?.length > 0}
        <div id="pdfTable" class="table-container">
          <table class="table-content">
            <thead>
              <tr>
                <th>Fecha</th>
                <th class="responsive">Ticket</th>
                <th>Cobro</th>
                <th class="responsive">Comisión</th>
                <th class="responsive">IVA</th>
                <th class="responsive">Dispersión</th>
              </tr>
            </thead>
            <tbody>
              {#each transactions as transaction}
                <tr class="clickable" on:click={() => goto(`/transactions/detail?ticket=${transaction?._id}`)}>
                  <td>
                    {dateToLocalString(transaction["Transaction Date"]) +
                      " - " +
                      timeToLocalString(transaction["Transaction Time"])}
                  </td><td class="responsive">{transaction.id}</td>
                  <td
                    >{transaction.Amount?.toLocaleString(
                      localeParam.language,
                      localeParam.currency
                    )}</td
                  >
                  <td class="responsive"
                    >{transaction.comission?.toLocaleString(
                      localeParam.language,
                      localeParam.currency
                    )}</td
                  >
                  <td class="responsive"
                    >{transaction?.IVA?.toLocaleString(localeParam.language, localeParam.currency)}</td
                  >
                  <td class="responsive"
                    >{transaction.deposit?.toLocaleString(
                      localeParam.language,
                      localeParam.currency
                    )}</td
                  >
                </tr>
              {/each}
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

<style lang="scss">
  @import "src/lib/styles/dashboard.scss";
</style>
