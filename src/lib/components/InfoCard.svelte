<script>
  export let title = "";
  export let numData;
  export let stringData = "";
  export let className = "";

  const localeParam = {
    language: 'es-MX',
    currency: {
      style: 'currency',
      currency: 'MXN'
    }
  }
</script>
<div on:click on:keypress class="card {className}">
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

<style>
  .clickable {
    cursor: pointer;
  }

  .card{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 16px;
    width: 100%;
    height: 100%;
    /* Nue Fill */
    background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
    /* out */
    box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41);
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
    color: #8C9FB1;
  }

  .card span {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 20px;
    text-align: center;
    /* Text */
    color: #113A62;
  }
</style>