<script>
  export let title = "";
</script>

<div>
  <button type="button" on:click>
    {title}
  </button>
</div>

<style>
  button {
    background: #e6e9ef;
    /* base-gray */
    border: 1px solid #e6e9ef;
    /* out */
    box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    padding: 8px 16px;
    font-weight: 700;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    letter-spacing: -0.4px;
    color: #113a62;
    cursor: pointer;
  }
</style>
