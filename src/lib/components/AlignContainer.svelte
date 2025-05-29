<script>
  export let marginTop = 0;
  export let cols = 1;
</script>

<div class="align-container" style="--cols: {cols}; margin-top: {marginTop}">
  <slot />
</div>

<style lang="scss">
  .align-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    & > :global(*) {
      flex-grow: 0;
      flex-shrink: 0;
      flex-basis: calc(100% / var(--cols));
    }
  }
</style>
