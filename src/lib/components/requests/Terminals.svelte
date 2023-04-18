<script>
  /* components */
  import Icons from '$lib/components/Icons.svelte';

  export let optionSelected;
  export let submenu;
</script>
<div
  class="element"
  class:hidden={optionSelected !== 0 && optionSelected !== 1}
>
  <i
    class="arrow-blue"
    class:hidden={optionSelected == 0}
    on:click={() => (optionSelected = 0)}
    on:keypress={(e) => (e.key === "Enter" ? (optionSelected = 0) : "")}
    on:click={() => (submenu = 0)}
    on:keypress={(e) => (e.key === "Enter" ? (submenu = 0) : "")}
  >
    <Icons name="arrow-bwd" width="24" height="24" />
  </i>
  <div
    on:click={() => (optionSelected = 1)}
    on:keypress={(e) =>
      e.key === "Enter" ? () => (optionSelected = 1) : ""}
    class={`option-col ${
      optionSelected === 1 ? "option-selected" : ""
    }`}
  >
    <i>
      <Icons name="detailed-terminal" width="100" height="100" />
    </i>
    <div class="option-name">Terminales</div>
  </div>
</div>

<style lang="scss">
  @import 'src/lib/styles/requests.scss';
</style>