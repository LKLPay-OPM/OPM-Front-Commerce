<script>
  import { loggedInUser } from "$lib/stores";
  import Icons from "$lib/components/Icons.svelte";
  import Input from "$lib/components/Input.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import EditProfile from "$lib/components/EditProfile.svelte";
  import Terminals from '$lib/components/requests/Terminals.svelte';
  import Support from '$lib/components/requests/Support.svelte';
  import { terminate } from "firebase/firestore";
  let date = new Date();
  let optionSelected = 0;
  let submenu = 0;
  let rollsQty = 0;
  let modalSupport;
  let detailTicketView = false;
  let selectedTicket = {};
  let terminals = {
    pocket: 0,
    smart: 0,
    master: 0,
  };
  let supportDetails = {
    user: $loggedInUser.uid,
    description: "",
  };

  let userDetails = $loggedInUser;

  let innerWidth = 0,
    innerHeight = 0;
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

  let tickets = [
    {
      id: 1,
      type: "Asistencia y Soporte",
      description:
        "Problema con terminal Problema con terminal en la sucursal Matriz, se traba al abrir la aplicación",
      status: "Pendiente",
    },
    {
      id: 2,
      type: "Asistencia y Soporte",
      description: "Revisión de terminal en sucursal Vallarta",
      status: "Pendiente",
    },
  ];

  const requestRolls = () => {
    (optionSelected = 0), (submenu = 0), (rollsQty = 0);
  };
  const requestTerminals = () => {
    (optionSelected = 0), (submenu = 0);
    terminals = { pocket: 0, smart: 0, master: 0 };
  };
  const requestSupport = () => {
    console.log("Soporte");
  };
  const requestProfileUpdate = () => {
    console.log("Perfil");
  };

  const handleSupportRequest = () => {};

  $: {
    // console.log($loggedInUser.state)
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />



<div class="content">
  <div class="container">
    <div class="date">
      <p>
        {date.getDate()} de {getMonthName(date.getMonth())} del {date.getFullYear()}
      </p>
    </div>
    <div class="card-container container">
      <div class={innerWidth <= 540 ? "col" : "col"}>
        <Terminals bind:optionSelected bind:submenu/>
      <div
        class={innerWidth <= 540 ? "divider-hor" : "divider-hor"}
        class:hidden={optionSelected > 0}
      />
        <Support bind:optionSelected bind:submenu/>
      <div
        class={innerWidth <= 540 ? "divider-hor" : "divider-hor"}
        class:hidden={optionSelected > 0}
      />
        <div
          class="element"
          class:hidden={optionSelected !== 0 && optionSelected !== 3}
        >
          <!-- <i class="arrow-blue" class:hidden={optionSelected == 0}
            on:click={() => (optionSelected = 0)}
            on:keypress={(e) => e.key === 'Enter' ? optionSelected = 0 : ""}
          >
            <Icons name="arrow-bwd" width="24" height="24"/>
          </i> -->
          <div
            on:click={() => (optionSelected = 3)}
            on:keypress={(e) =>
              e.key === "Enter" ? () => (optionSelected = 3) : ""}
            class={`option-col ${
              optionSelected === 3 ? "option-selected" : ""
            }`}
          >
            <i>
              <Icons name="detailed-user" width="100" height="100" />
            </i>
            <div class="option-name">Cambio de Datos</div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-container container" class:hidden={optionSelected !== 1}>
      <div class="col">
        <div class="element" class:hidden={submenu !== 0 && submenu !== 1}>
          <i
            class="arrow-blue"
            class:hidden={submenu == 0}
            on:click={() => (submenu = 0)}
            on:keypress={(e) => (e.key === "Enter" ? (submenu = 0) : "")}
          >
            <Icons name="arrow-bwd" width="24" height="24" />
          </i>
          <div
            on:click={() => (submenu = 1)}
            on:keypress={(e) => (e.key === "Enter" ? () => (submenu = 1) : "")}
            class={`option-row ${submenu === 1 ? "option-selected" : ""}`}
          >
            <i>
              <Icons name="roll" width="50" height="50" />
            </i>
            <div class="option-name">Rollos para Impresora</div>
          </div>
        </div>
        <div class="divider-hor" class:hidden={submenu > 1} />
        <div class="element" class:hidden={submenu != 1}>
          <div class={innerWidth <= 540 ? "col" : "row"}>
            <Input
              placeholder=""
              label="Cantidad"
              id="rollsQty"
              bind:value={rollsQty}
              className="txt-field-slim normal fill-blue"
              type="number"
            />
            <div class="button">
              <Input
                on:click={requestRolls}
                label="Solicitar"
                id="buttonRollsQty"
                type="button"
                className={`
                  ${rollsQty > 0 ? "btn" : "btn-plain disabled"}`}
                icon=""
              />
            </div>
          </div>
        </div>
        <div class="element" class:hidden={submenu !== 0 && submenu !== 2}>
          <i
            class="arrow-blue"
            class:hidden={submenu == 0}
            on:click={() => (submenu = 0)}
            on:keypress={(e) => (e.key === "Enter" ? (submenu = 0) : "")}
          >
            <Icons name="arrow-bwd" width="24" height="24" />
          </i>
          <div
            on:click={() => (submenu = 2)}
            on:keypress={(e) => (e.key === "Enter" ? () => (submenu = 1) : "")}
            class={`option-row ${submenu === 2 ? "option-selected" : ""}`}
          >
            <i>
              <Icons name="detailed-terminal" width="50" height="50" />
            </i>
            <div class="option-name">Terminales</div>
          </div>
        </div>
        <div class="divider-hor" class:hidden={submenu !== 2} />
        <div class="element" class:hidden={submenu != 2}>
          <div class="col">
            <div class={innerWidth <= 540 ? "grid-row" : "grid-col"}>
              <Input
                placeholder=""
                label="Pocket"
                id="PocketTerminalQty"
                bind:value={terminals.pocket}
                className="txt-field-horizontal normal blue"
                type="number"
              />
              <Input
                placeholder=""
                label="Smart"
                id="SmartTerminalQty"
                bind:value={terminals.smart}
                className="txt-field-horizontal normal blue"
                type="number"
              />
              <Input
                placeholder=""
                label="Master"
                id="MasterTerminalQty"
                bind:value={terminals.master}
                className="txt-field-horizontal normal blue"
                type="number"
              />
            </div>
            <div class="button">
              <Input
                on:click={requestTerminals}
                label="Solicitar"
                id="buttonRollsQty"
                type="button"
                className={`
                  ${
                    terminals.pocket > 0 ||
                    terminals.smart > 0 ||
                    terminals.master > 0
                      ? "btn"
                      : "btn-plain disabled"
                  }`}
                icon=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class:hidden={optionSelected != 3}>
      <!-- <EditProfile bind:optionSelected bind:userDetails /> -->
    </div>
    <div class="tickets-list" class:hidden={optionSelected !== 0}>
      {#if !detailTicketView}
        {#each tickets as ticket}
          <div
            class="ticket card-container clickable"
            on:click={() => (selectedTicket = ticket)}
            on:keypress={(e) =>
              e.key === "Enter" ? () => (selectedTicket = ticket) : ""}
            on:click={() => (detailTicketView = true)}
            on:keypress={(e) =>
              e.key === "Enter" ? () => (detailTicketView = true) : ""}
          >
            <div class="row">
              <div class="element">
                <div class="item">Solicitud</div>
                <div class="item">{ticket.id}</div>
              </div>
              <div class="element">
                <div class="item">Motivo</div>
                <div class="item">{ticket.type}</div>
              </div>
              <div class="element">
                <div class="item">Estado</div>
                <div class="item">{ticket.status}</div>
              </div>
              <div class="element">
                <i class="arrow arrow-blue">
                  <Icons name="arrow-fwd" width="24" height="24" />
                </i>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="ticket col card-container">
          <div class="row title">
            <div class="row-element">
              <div
                class="element return-arrow"
                on:click={() => (detailTicketView = false)}
                on:keypress={(e) =>
                  e.key === "Enter" ? () => (detailTicketView = false) : ""}
              >
                <i class="arrow arrow-blue">
                  <Icons name="arrow-bwd" width="24" height="24" />
                </i>
              </div>
              <div class="element">
                <div class="item">Solicitud</div>
                <div class="item">{selectedTicket.id}</div>
              </div>
            </div>
            <div class="element">
              <div class="item">Motivo</div>
              <div class="item">{selectedTicket.type}</div>
            </div>
            <div class="element">
              <div class="item">Estado</div>
              <div class="item">{selectedTicket.status}</div>
            </div>
          </div>
          <div class="row description">
            <div class="element card-inside">
              <div class="description">{selectedTicket.description}</div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @import 'src/lib/styles/requests.scss';
</style>
