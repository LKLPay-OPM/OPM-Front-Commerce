<script>
  export let title = "";
  export let align = "left";
</script>

{#if title}
  <div class="title" style="text-align: {align};">
    <p>{title}</p>
  </div>
{/if}

<style lang="scss">
  .title {
    p {
      font-style: normal;
      font-weight: 700;
      font-size: 1.5rem; /* 20px */
      line-height: 1.25rem; /* 20px */
      /* text-placeholder */
      color: #113a62;
    }
  }
</style>
