<script>
  /* navigation */
  import { goto } from "$app/navigation";
  /* components */
  import Icons from "$lib/components/Icons.svelte";
</script>

<div class="element">
  <div
    on:click={() => goto("/requests/update-profile")}
    on:keypress={(e) => (e.key === "Enter" ? () => goto("/requests/update-profile") : "")}
    class={`option-col clickable`}
  >
    <i>
      <Icons name="detailed-user" width="50" height="50" />
    </i>
    <div class="option-name">Cambio de Datos</div>
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

  /* Dark Mode */
  :global(body.dark-mode) {
    .option-col {
      color: $font-dark-primary;
    }
  }

  @media (max-width: 425px) {
  }
  @media (min-width: 426px) and (max-width: 540px) {
  }
  @media (min-width: 768px) and (max-width: 1023px) {
  }
</style>
