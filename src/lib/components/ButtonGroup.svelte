<script>

  export let active = "";
  export let options = [];

</script>

<div class="button-group">
  {#each options as option}
    <button on:click={option.click} class={`button ${active === option.value ? "button-active" : ""}`} type="button">{option.name}</button>
  {/each}
</div>

<style>
  .button-group {
    /* Component 1 */
    box-sizing: border-box;
    /* Auto layout */
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: .625rem;/* 10px */
    /* Nue Fill */
    background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    /* Inside auto layout */
    flex: none;
    flex-grow: 0;
    border: 1px solid #FFFFFF
  }

  .button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: .5rem;/* 8px */
    gap: .625rem;/* 10px */
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
    outline:none;
    border: none;
    cursor: pointer;
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    /* identical to box height */
    /* text-placeholder */
    color: #8C9FB1;
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
    height: 100%;
    background: linear-gradient(317.7deg, rgba(0, 0, 0, 0.2) 0%, rgba(255, 255, 255, 0.2) 105.18%), #007AFF;
    background-blend-mode: soft-light, normal;
    /* inner blue */
    box-shadow: inset -5px -5px 8px rgba(56, 151, 255, 0.75), inset 5px 5px 7px rgba(29, 79, 133, 0.5);
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 14px;
    /* identical to box height */
    display: flex;
    align-items: center;
    color: #FFFFFF;
    mix-blend-mode: normal;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
  }
</style>