<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";

  export let optionSelected;
</script>

<div class="element">
  <div
    on:click={() => (optionSelected = 4)}
    on:keypress={(e) => (e.key === "Enter" ? () => (optionSelected = 4) : "")}
    class={`option-col ${optionSelected === 4 ? "option-selected" : "clickable"}`}
  >
    <i>
      <Icons name="detailed-user" width="50" height="50" />
    </i>
    <div class="option-name">Cambio de Datos</div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/requests.scss";
</style>
