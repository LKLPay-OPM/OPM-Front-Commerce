<script>
  /* icons */
  import LoadingSpinner from "$lib/components/icons/LoadingSpinner.svelte";

  export let loading = false;
  export let disabled = false;
  /**
   * The type of the button, defaults to "button".
   * Can be "button", "submit", or "reset".
   * @default "button"
   * @type {'button' | 'submit' | 'reset'}
   */
  export let type = "button";
</script>

<button on:click {disabled} {type}>
  {#if loading}
    <span class="icon-container">
      <LoadingSpinner />
    </span>
  {:else}
    <span class="icon-container">
      <slot name="icon" />
    </span>
  {/if}
  <span class="content">
    <slot />
  </span>
</button>

<style lang="scss">
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem 0.25rem 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    border: none;
    border-radius: 0.25rem;
    background-color: $green;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: darken($green, 10%);
    }

    &:disabled {
      background-color: var(--button-bg-disabled, $grey);
      cursor: not-allowed;
    }
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
