<script>
  /* svelte */
  import { goto } from "$app/navigation";
  /* utils */
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import { timeToLocalString, dateToLocalStringShort } from "$lib/utils/date";
  import {
    getIconStatusClass,
    getDepositIconStatus,
    getDepositIconTooltip,
    getTransactionIconStatus,
  } from "$lib/utils/iconClass";
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  /* variables */
  export let transaction;

  /**
   * Devuelve el texto para e tooltip
   * @param {string} type
   */
  function getTransactionTypeText(type) {
    if (type === "tpv") return "Terminal Punto de Venta"
    if (type === "e-commerce") return "Link de Pago"
    return ""
  }

  /**
   * Devuelve la clase CSS para el ícono status
   * @param {string} status
   * @param {string} type
   */
  function getIconName(status, type) {
    if (status === "reversed") return "reverse"
    if (status === "refund") return "refund"
    if (type === "tpv") return "terminal"
    if (type === "e-commerce") return "qr-code"
    return "terminal"
  }
</script>

<tr class="clickable" on:click={() => goto(`/transactions/detail?ticket=${transaction?._id}`)}>
  <td class="text-center"
    >{`${dateToLocalStringShort(transaction?.["Transaction_Date"])} ${timeToLocalString(
      transaction?.["Transaction_Time"]
    )}` ?? "-"}</td
  >
  <td class="text-center">{transaction?.["IFD Serial Number"] ?? "-"}</td>
  <td class="text-center">{transaction?.["ID Transaction"] ?? "-"}</td>
  <td class="text-center">{currencyFormatLocal(transaction?.amount ?? 0) ?? "-"}</td>
  <td class="text-center">{currencyFormatLocal(transaction?.comission ?? 0) ?? "-"}</td>
  <td class="text-center">{currencyFormatLocal(transaction?.iva ?? 0) ?? "-"}</td>
  <td class="text-center">
    <i class={`icon ${getIconStatusClass(transaction.transactionStatus)} tooltip`}>
      {#if getDepositIconStatus(transaction.transactionStatus) != "muted"}
        <Icons
          name={getIconName(transaction.transactionStatus, transaction.type)}
          width="24"
          height="24"
        />
      {:else}
        <Icons name="circle-slash" width="24" height="24" />
      {/if}
      <span class="tooltiptext"
        >{`${getTransactionTypeText(transaction.type)} | ${getTransactionIconStatus(transaction.transactionStatus)}`}</span
      >
    </i>
  </td>
  <td class="text-center">{transaction?.authorization ?? "-"}</td>
  <td class="text-center">
    <i class={`icon ${getDepositIconStatus(transaction.depositStatus)} tooltip`}>
      {#if getDepositIconStatus(transaction.depositStatus) != "muted"}
        <Icons name="hand-coin" width="24" height="24" />
      {:else}
        <Icons name="circle-slash" width="24" height="24" />
      {/if}
      <span class="tooltiptext">
        {getDepositIconTooltip(transaction.depositStatus)}
      </span>
    </i>
  </td>
</tr>

<style lang="scss">
  td {
    font-family: "Raleway";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #000000;
    text-align: center;
    border-bottom: 1px solid #8c9fb1;
    padding: 0.5rem 0.5rem;
    text-align: left;
  }

  .text-center {
    text-align: center;
  }

  .icon {
    color: $primary-dark;
    &.success {
      color: $green;
    }
    &.error {
      color: $red;
    }
    &.warning {
      color: $orange;
    }
    &.muted {
      color: $grey;
    }
    &.tooltip {
      position: relative;
      font-weight: 500;
      font-size: 0.8125rem;
      line-height: 1.25rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      .tooltiptext {
        visibility: hidden;
        width: fit-content;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 5px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        min-width: max-content;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
      }
      &:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
      }
    }
  }
</style>
