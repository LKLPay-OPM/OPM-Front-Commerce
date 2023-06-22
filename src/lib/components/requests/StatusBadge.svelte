<script>
  /* handlers */
  import { ticketStatusClass } from "$lib/handlers/ticket-status.handler";
  /* variables */
  export let status = "";
</script>

<div class="card-right {ticketStatusClass(status)}">
  <p>{status ?? "N/A"}</p>
</div>

<style lang="scss">
  .card-right {
    p {
      text-align: right;
      position: relative;
      z-index: 1;
      display: inline-block;
      &::before {
        position: absolute;
        content: "";
        top: 50%;
        left: -12px;
        transform: translateY(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        z-index: 2;
      }
    }
    &.normal {
      p::before {
        background-color: grey;
      }
    }
    &.success {
      p::before {
        background-color: green;
      }
    }
    &.error {
      p::before {
        background-color: red;
      }
    }
    &.warning {
      p::before {
        background-color: orange;
      }
    }
    &.info {
      p::before {
        background-color: blue;
      }
    }
  }
</style>
