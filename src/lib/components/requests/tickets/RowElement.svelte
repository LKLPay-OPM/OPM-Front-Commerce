<script>
  export let title = "";
  export let description;
</script>

<!-- component -->
<div class="element">
  {#if title}
    <div class="title">{title}</div>
  {/if}
  <p class="item">{description}</p>
</div>

<!-- styles -->
<style lang="scss">
  .element {
    display: flex;
    margin: 1rem 0;
    justify-content: center;
    flex-direction: column;
    line-height: 1.25rem; /* 20px */
    color: $primary-dark;
    .title {
      font-weight: 700;
    }
    .item {
      font-weight: 300;
      font-size: 24px;
      line-height: 1.15;
    }
  }
</style>
