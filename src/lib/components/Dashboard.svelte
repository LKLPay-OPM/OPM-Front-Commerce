<script>
  /* svelte */
  import { onMount } from "svelte";
  import { loggedInUser } from "$lib/stores";
  import { goto } from "$app/navigation";
  /* components */
  import InfoCard from "$lib/components/InfoCard.svelte";
  import Icons from "$lib/components/Icons.svelte";
  /* utils */
  import { getMonthName, timeToLocalString, dateToLocalString } from "$lib/utils/date";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";

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
        <InfoCard className={""} title="Monto Total" numData={currencyFormatLocal(resume?.Amount ?? 0)} />
      </div>
      <div class="card">
        <InfoCard className={""} title="N° de Ventas" numData={resume?.Sold ?? "0"} />
      </div>
      <div class="card">
        <InfoCard className={""} title="Saldo a Depositar" numData={currencyFormatLocal(resume?.Deposit ?? 0)} />
      </div>
    </div>
    <div class="transactions card-primary" style={transactions?.length <= 0 ? "min-height: 25rem;" : ""}>
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
                <th class="sm">Hora</th>
                <th class="sm">Ticket</th>
                <th>Cobro</th>
                <th class="">Comisión</th>
                <th class="sm md">IVA</th>
                <th class="">Dispersión</th>
                <th class="">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {#each transactions as transaction}
                <tr class="clickable" on:click={() => goto(`/transactions/detail?ticket=${transaction?._id}`)}>
                  <td class="sm">{timeToLocalString(transaction["Transaction Time"])}</td>
                  <td class="sm">{transaction.id}</td>
                  <td>{currencyFormatLocal(transaction?.Amount)}</td>
                  <td class="">{currencyFormatLocal(transaction?.comission)}</td>
                  <td class="sm md">{currencyFormatLocal(transaction?.IVA)}</td>
                  <td class="">{currencyFormatLocal(transaction?.deposit)}</td>
                  <td class="">
                    <i class="icon tooltip">
                      <Icons
                        name={transaction.type === "tpv"
                          ? "terminal"
                          : transaction.type === "e-commerce"
                          ? "qr-code"
                          : "terminal"}
                        width="24"
                        height="24"
                      />
                      <span class="tooltiptext"
                        >{transaction.type === "tpv"
                          ? "Terminal Punto de Venta"
                          : transaction.type === "e-commerce"
                          ? "Link de Pago"
                          : ""}</span
                      >
                    </i>
                  </td>
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
