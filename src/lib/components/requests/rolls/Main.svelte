<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  /* svelte */
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let optionSelected;
</script>

<div class="element" class:hidden={optionSelected !== 0 && optionSelected !== 1}>
  <div class="arrow-fwd-btn" class:hidden={optionSelected === 0}>
    <label for="return">
      <i class="arrow-blue">
        <Icons name="arrow-bwd" width="24" height="24" />
      </i>
    </label>
    <input on:click={() => dispatch("cancel")} id="return" type="button" />
  </div>
  <div
    on:click={() => (optionSelected = 1)}
    on:keypress={(e) => (e.key === "Enter" ? () => (optionSelected = 1) : "")}
    class={`option-col ${optionSelected === 1 ? "option-selected" : "clickable"}`}
  >
    <i>
      <Icons name="roll" width="50" height="50" />
    </i>
    <div class="option-name">Rollos</div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/requests.scss";
</style>
