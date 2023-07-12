<script>
  export let title = "";
  export let numData;
  export let stringData = "";
  export let className = "";
</script>

<div on:click on:keypress class="card card-primary{className}">
  <div>
    <p>{title}</p>
  </div>
  <div>
    <span>
      {#if stringData != ""}
        {stringData}
      {:else}
        {numData}
      {/if}
    </span>
  </div>
</div>

<style lang="scss">
  .clickable {
    cursor: pointer;
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 16px;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  .card p {
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    /* text-placeholder */
    color: #8c9fb1;
  }

  .card span {
    font-weight: 700;
    font-size: 32px;
    line-height: 20px;
    text-align: center;
    /* Text */
    color: $primary-dark;
  }

  :global(body.dark-mode) {
    .card {
      span {
        color: $font-dark-primary;
      }
    }
  }
</style>
