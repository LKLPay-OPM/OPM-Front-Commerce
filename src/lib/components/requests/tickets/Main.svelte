<script>
  /* navigation */
  import { goto } from "$app/navigation";
  /* components */
  import Icons from "$lib/components/Icons.svelte";
</script>

<div class="element">
  <div
    on:click={() => goto("/requests/tickets")}
    on:keypress={(e) => (e.key === "Enter" ? () => goto("/requests/tickets") : "")}
    class={`option-col clickable`}
  >
    <i>
      <Icons name="tickets" width="50" height="50" />
    </i>
    <div class="option-name">Listado de Solicitudes</div>
  </div>
</div>

<style lang="scss">
  .element {
    display: flex;
    margin: 1rem 0;
    justify-content: center;
    & > .option-col {
      display: grid;
      grid-auto-flow: column;
      color: $primary-dark;
      transition: all 0.4s ease;
      align-items: center;
      // cursor: pointer;
      & > i {
        display: grid;
        grid-auto-flow: column;
        justify-content: center;
      }
      & > .option-name {
        font-weight: 700;
        font-size: 1.5rem; /* 24px */
        line-height: 1.25rem; /* 20px */
        text-align: center;
      }
    }
  }

  .clickable {
    cursor: pointer;
  }

  @media (max-width: 425px) {
  }
  @media (min-width: 426px) and (max-width: 540px) {
  }
  @media (min-width: 768px) and (max-width: 1023px) {
  }
</style>
