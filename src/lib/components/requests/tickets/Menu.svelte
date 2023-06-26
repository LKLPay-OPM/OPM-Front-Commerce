<script>
  /* navigation */
  import { goto } from "$app/navigation";
  /* components */
  import RowElement from "$lib/components/requests/tickets/RowElement.svelte";
  import CardHeader from "$lib/components/requests/tickets/CardHeader.svelte";
  import CardFooter from "$lib/components/requests/tickets/CardFooter.svelte";
  import WriteComment from "$lib/components/requests/tickets/WriteComment.svelte";
  /* handlers */
  import { ticketTypeHandler } from "$lib/handlers/ticket-type.handler";
  /* utils */
  import { cutString } from "$lib/utils/string";

  /* props */
  export let optionSelected = 0;
  export let tickets = [];

  /* lets */
  let detailTicketView = false;
  let selectedTicket = {};
  let innerWidth = 0;
  let innerHeight = 0;
</script>

<!-- window settings  -->
<svelte:window bind:innerWidth bind:innerHeight />

<!-- component -->
<div class="tickets-list" class:hidden={optionSelected !== 0}>
  {#if tickets.length <= 0}
    <div class="message">
      <div class="msg">
        <p>No has realizado Solicitudes</p>
      </div>
      <div class="description">
        <p>Aquí podrás ver tu listado de Solicitudes realizadas</p>
      </div>
    </div>
  {:else}
    {#each tickets as ticket}
      <div class="ticket card-container">
        <div class="row">
          <CardHeader id={ticket._id} type={ticketTypeHandler(ticket.type)} status={ticket.status} />
        </div>
        <div class="row">
          <RowElement description={cutString(ticket.description, 50)} />
        </div>
        <div class="row">
          <WriteComment
            placeholder="Abrir más detalles"
            on:click={() => {
              goto(`/requests/tickets/${ticket._id}`);
            }}
          />
        </div>
        <div class="row">
          <CardFooter date={new Date(ticket.updatedAt ?? ticket.createdAt)} />
        </div>
      </div>
    {/each}
  {/if}
</div>

<style lang="scss">
  @import "src/lib/styles/requests/tickets/main.scss";

  .card-container {
    padding: 0;
    border-radius: 20px;
    padding: 12px 24px;
  }

  .ticket {
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: inherit;
    gap: 0.5rem;
  }

  .message .msg {
    font-weight: 700;
    font-size: 1.25rem; /* 16px */
    line-height: 1.25rem; /* 20px */
    text-align: center;
    /* Text */
    color: $primary-dark;
  }
  .message .description {
    font-weight: 500;
    font-size: 1rem; /* 16px */
    line-height: 1.25rem; /* 20px */
    text-align: center;
    /* Text */
    color: #8c9fb1;
  }
</style>
