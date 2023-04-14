<script>
  /* svelte */
  import { createEventDispatcher } from "svelte";

  export let active = "";
  export let options = [];

  const dispatch = createEventDispatcher();

  function handleClick(value) {
    dispatch("click", { value });
  }
</script>

<div class="align-center">
  <div class="button-group">
    {#each options as option}
      <button
        on:click={handleClick(option.value)}
        class={`button ${active === option.value ? "button-active" : ""}`}
        type="button">{option.name}</button
      >
    {/each}
  </div>
</div>

<style lang="scss">
  .button-group {
    box-sizing: border-box;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6px;
    background: linear-gradient(91.36deg, background-light-accent-primary 0%, #e6e8ef 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff,
      4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    flex: none;
    flex-grow: 0;
    border: 1px solid #ffffff;
  }

  .button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 4px;
    gap: 10px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
    outline: none;
    border: none;
    cursor: pointer;
    font-family: "Raleway";
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    /* identical to box height */
    /* text-placeholder */
    color: #8c9fb1;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .button:first-child {
    border-radius: 5px 0px 0px 5px;
    border-right: none;
  }
  .button:last-child {
    border-right: none;
    border-radius: 0px 5px 5px 0px;
  }

  .button-active {
    height: 22px;
    background: linear-gradient(
        317.7deg,
        rgba(0, 0, 0, 0.2) 0%,
        rgba(255, 255, 255, 0.2) 105.18%
      ),
      $primary-light;
    background-blend-mode: soft-light, normal;
    /* inner blue */
    box-shadow: inset -5px -5px 8px rgba(56, 151, 255, 0.75),
      inset 5px 5px 7px rgba(29, 79, 133, 0.5);
    font-family: "Raleway";
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    /* identical to box height */
    display: flex;
    align-items: center;
    color: #ffffff;
    mix-blend-mode: normal;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .align-center {
    text-align: center;
  }
</style>
