<script>
  import { loggedInUser } from "$lib/stores";
  import Icons from "$lib/components/Icons.svelte";
  export let optionSelected = 0;
  let detailTicketView = false;
  let selectedTicket = {};

  let userDetails = $loggedInUser;

  let innerWidth = 0,
    innerHeight = 0;

  let tickets = [
    {
      id: 1,
      type: "Asistencia y Soporte",
      description: "Problema con terminal Problema con terminal en la sucursal Matriz, se traba al abrir la aplicación",
      status: "Pendiente",
    },
    {
      id: 2,
      type: "Asistencia y Soporte",
      description: "Revisión de terminal en sucursal Vallarta",
      status: "Pendiente",
    },
  ];

  $: {
    // console.log($loggedInUser.state)
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="tickets-list" class:hidden={optionSelected !== 0}>
  {#if !detailTicketView}
    {#each tickets as ticket}
      <div
        class="ticket card-container clickable"
        on:click={() => (selectedTicket = ticket)}
        on:keypress={(e) => (e.key === "Enter" ? () => (selectedTicket = ticket) : "")}
        on:click={() => (detailTicketView = true)}
        on:keypress={(e) => (e.key === "Enter" ? () => (detailTicketView = true) : "")}
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
            on:keypress={(e) => (e.key === "Enter" ? () => (detailTicketView = false) : "")}
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

<style lang="scss">
  @import "src/lib/styles/requests.scss";
</style>
