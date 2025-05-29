<script>
  export let title = "";
  export let value = "";
</script>

<div class="card-primary">
  {#if title}
    <p class="title font-20px">{title}</p>
  {/if}
  {#if value}
    <p class="value font-32px">{value}</p>
  {/if}
</div>

<style lang="scss">
  .card-primary {
    background: linear-gradient(91.36deg, #efeef5 0%, #e6e8ef 100%);
    box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    padding: 16px;
  }

  .title {
    color: #8c9fb1;
  }

  .value {
    color: #113a62;
  }

  .title,
  .value {
    text-align: center;
    font-weight: 700;
  }

  .font-20px {
    font-size: 20px;
  }

  .font-32px {
    font-size: 32px;
  }
</style>
