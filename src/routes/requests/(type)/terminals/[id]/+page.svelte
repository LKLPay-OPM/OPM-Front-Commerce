<script>
  /* svelte */
  import { error } from "@sveltejs/kit";
  import { onMount } from "svelte";
  /* components */
  import Comment from "$lib/components/requests/tickets/Comment.svelte";
  import RowElement from "$lib/components/requests/tickets/RowElement.svelte";
  import CardHeader from "$lib/components/requests/tickets/CardHeader.svelte";
  import CardFooter from "$lib/components/requests/tickets/CardFooter.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import Input from "$lib/components/Input.svelte";
  /* handlers */
  import { ticketTypeHandler } from "$lib/handlers/ticket-type.handler";
  /* clients */
  import { ticketsClient } from "$lib/repos/axios";
  /* socket */
  // import { appTicketsSocket } from "$lib/repos/socket.io";
  /* controllers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";
  /* utils */
  import { errorCustomMsgToast } from "$lib/utils/toast.js";

  /* props */
  export let data;
  export let optionSelected = 0;
  export let ticket = data.ticket;
  export let comments = data.ticket.comments;

  let description;

  /* lets */
  let innerWidth = 0;
  let innerHeight = 0;

  $: {
    console.log(data);
  }

  const sendComment = async () => {
    try {
      const response = await ticketsClient.post(`/ticket/${ticket._id}/comment`, { description });
      description = "";
      comments.push(response?.data?.response);
      comments = comments;
      console.log(response?.data?.response);
    } catch (err) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      console.error(err);
      const handler = await appErrorResponseHandler(err);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };

  /* onMount(() => {
    appTicketsSocket.on("ticket.create-comment", (comment) => {
      comments.push(comment[0]);
      comments = comments;
    });
  }); */
</script>

<!-- window settings  -->
<svelte:window bind:innerWidth bind:innerHeight />

<!-- component -->
<div class="tickets-list" class:hidden={optionSelected !== 0}>
  <div class="ticket card-primary">
    <div class="row">
      <CardHeader id={ticket._id} type={ticketTypeHandler(ticket.type)} status={ticket.status} />
    </div>
    <!-- <div class="row">
      <RowElement description={ticket.description} />
    </div> -->
    <div class="row margin-btm-1">
      <div class="col">
        <div class="element">
          <p>Pocket <span>{ticket.request.pocket}</span></p>
        </div>
        <div class="element">
          <p>Smart <span>{ticket.request.smart}</span></p>
        </div>
        <div class="element">
          <p>Master <span>{ticket.request.master}</span></p>
        </div>
      </div>
    </div>
    <div class="row">
      {#each comments as comment}
        <Comment
          color={comment.role === "Admin" ? "var(--primary-light)" : "var(--secondary-light)"}
          description={comment.description}
          date={new Date(comment.createdAt)}
        />
      {/each}
    </div>
    <div class="row">
      <TextArea
        bind:value={description}
        label="Agregar Comentario"
        placeholder=""
        id="txtAreaComment"
        name="txtAreaComment"
      />
    </div>
    <div class="button-container">
      <div class="button">
        <Input
          on:click={sendComment}
          label="Enviar"
          id="saveComment"
          className={description != "" ? "btn" : "btn-plain disabled"}
          type="button"
        />
      </div>
    </div>
    <div class="row">
      <CardFooter date={new Date(ticket.updatedAt ?? ticket.createdAt)} />
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/requests/tickets/main.scss";

  :root {
    --divider-color: $primary-light;
  }

  .card-primary {
    padding: 0;
    border-radius: 20px;
    padding: 12px 24px;
  }

  .ticket {
    max-width: 800px;
    min-width: 800px;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .button-container {
    height: 2.5rem;
    display: flex;
    justify-content: center;

    .button {
      width: 20%;
    }
  }

  .row {
    .col {
      .element {
        p {
          color: $primary-dark;
        }
        span {
          font-weight: 700;
          color: $primary-dark;
        }
      }
    }
  }

  :global(body.dark-mode) {
    .row {
      .col {
        .element {
          p {
            color: $font-dark-primary;
          }
          span {
            color: $font-dark-primary;
          }
        }
      }
    }
  }
</style>
