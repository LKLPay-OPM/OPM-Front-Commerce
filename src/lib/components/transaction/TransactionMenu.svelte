<script>
  // import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { isLoggedIn, loggedInUser } from "$lib/stores";
  /* components */
  import Card from "$lib/components/Card.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Title from "$lib/components/Title.svelte";
  import Input from "$lib/components/Input.svelte";
  import Button from "$lib/components/Button.svelte";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import PageLoader from "$lib/components/PageLoader.svelte";
  import Container from "$lib/components/Container.svelte";
  import DateTitle from "$lib/components/DateTitle.svelte";
  import ButtonGroup from "$lib/components/ButtonGroup.svelte";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";
  import CardContainer from "$lib/components/CardContainer.svelte";
  import AlignContainer from "$lib/components/AlignContainer.svelte";
  import ExportButtonGroup from "$lib/components/ExportButtonGroup.svelte";
  import EmptyTransactionsMessage from "$lib/components/transaction/EmptyTransactionsMessage.svelte";
  import TransactionTable from "$lib/components/transaction/TransactionTable.svelte";
  import Select from "$lib/components/Select.svelte";
  /* constants */
  import { filterByDateOptions } from "$lib/constants/filter";
  /* utils */
  import { getStringDate, getFullMomentDate } from "$lib/utils/date";

  /* dynamic vars */
  export let filter = "day";
  export let dateStart = "";
  export let dateEnd = "";
  export let start;
  export let end;
  export let terminals;
  export let selectedTerminal;

  let terminalOptions = terminals.map((terminal) => ({
    name: terminal.serialNumber,
    value: terminal.serialNumber,
  }));
  terminalOptions.unshift({ name: "Todas", value: "" });
  let loading = false;
  let modalDateFilter;
  let dateRangeStart = "";
  let dateRangeEnd = "";

  function handleFilterClick({ detail }) {
    start = 0;
    end = 10;
    const filter = detail?.value;
    goto(`?filter=${filter ?? "day"}&start=${start}&end=${end}`);
  }

  function formatDateTime(dateTime) {
    if (!dateTime) return "";
    return dateTime.replace(
      /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
      "$1/$2/$3 $4:$5:$6"
    );
  }

  const fetchByDateRange = async () => {
    start = 0;
    end = 10;
    dateStart = getStringDate(new Date(dateRangeStart));
    dateEnd = getStringDate(new Date(dateRangeEnd));
    goto(`?filter=range&dateStart=${dateStart}&dateEnd=${dateEnd}&serialNumber=${selectedTerminal}&start=${start}&end=${end}`);
  };
</script>

<!-- MODAL FETCH BY DATE RANGE -->
<Modal className={`modal-medium`} bind:this={modalDateFilter}>
  <div slot="header">
    <!-- <p>Por Fechas</p> -->
  </div>
  <div slot="content">
    <div class="modal-range">
      <p>Filtro</p>
      <div class="date-range-input">
        <DatePicker label="Del" id="date-range-start" bind:value={dateRangeStart} />
        <DatePicker label="Al" id="date-range-end" bind:value={dateRangeEnd} />
      </div>
      <Select
        bind:optionsList={terminalOptions}
        defaultText={"Elige una terminal"}
        label="Terminal"
        id="terminal"
        bind:value={selectedTerminal}
      />
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={modalDateFilter.closeModal()}
      on:click={() => fetchByDateRange()}
      label="Filtrar"
      id="buttonSaveModalDateRange"
      type="button"
      className={`
        ${dateRangeStart != "" && dateRangeEnd != "" ? "btn" : "btn-plain disabled"}`}
      icon=""
    />
  </div>
</Modal>

{#if $isLoggedIn}
  {#if loading}
    <PageLoader />
  {:else}
    <Container>
      <AlignContainer cols="3">
        <Title title="Inicio" />
        <DateTitle />
        <Title title="Reportes" align="right" />
      </AlignContainer>
      <AlignContainer cols="3" marginTop="16px">
        <Button title="Filtrar" on:click={modalDateFilter.show()} />
        <ButtonGroup active={filter} options={filterByDateOptions} on:click={handleFilterClick} />
        <ExportButtonGroup {dateStart} {dateEnd} {selectedTerminal}/>
      </AlignContainer>
      <AlignContainer cols="3" marginTop="16px">
        <div class="subtitle">
          <p class="filter">Desde: <span>{getFullMomentDate(dateStart, "YYMMDDHHmmss")}</span></p>
          <p class="filter">Hasta: <span>{getFullMomentDate(dateEnd, "YYMMDDHHmmss")}</span></p>
          <p class="filter">TPV: <span>{selectedTerminal || "Todas"}</span></p>
        </div>
      </AlignContainer>
    </Container>
  {/if}
{:else}
  <RedirectLogin />
{/if}

<style lang="scss">
  .modal-range {
    p {
      font-weight: 700;
      font-size: 1.25rem; /* 20px */
      line-height: 1.25rem; /* 20px */
      /* Text */
      color: $primary-dark;
    }
  }

  .modal-buttons {
    width: 70%;
    height: 2.5rem; /* 40px */
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
  }

  .date-range-input {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .filter {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    color: $primary-dark;
    margin: 0;
    text-transform: capitalize;

    span {
      font-size: 0.85rem;
      font-weight: normal;
    }
  }
</style>
