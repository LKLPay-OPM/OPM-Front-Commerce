<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
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
  {#if !detailTicketView}
    {#each tickets as ticket}
      <div class="ticket card-container clickable">
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
              console.log("quesito");
              selectedTicket = ticket;
            }}
          />
        </div>
        <div class="row">
          <CardFooter date={new Date(ticket.updatedAt ?? ticket.createdAt)} />
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
          <RowElement title="Solicitud" description={selectedTicket._id} />
        </div>
        <RowElement title="Motivo" description={ticketTypeHandler(selectedTicket.type)} />
        <RowElement title="Estado" description={selectedTicket.status} />
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
</style>
