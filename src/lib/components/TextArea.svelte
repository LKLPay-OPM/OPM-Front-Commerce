<script>
  export let label = "";
  export let id = "";
  export let placeholder = "";
  export let value = "";
  export let className = "";
  export let title = "";
  const onInput = e => {
    value = e.target.value
  };
</script>

<!-- <div class={`${className}`}>
  <label title={title} class="label" for={id}>
      <span class="label-text">
        {label}
        {#if icon != ""}
          <Icons class={color} name={icon} width="24" height="24"/>
        {/if}
      </span>
  </label>
  <input on:click {type} {placeholder} {id} {value} on:input={onInput} {step} {accept}>
</div> -->
<label title={title} class="label" for={id}>
  <span class="label-text">
    {label}
  </span>
</label>
<textarea on:input={onInput} {value} {placeholder} {id} class="text-area" rows="5"></textarea>
<style>
  .label {
    display: flex;
    -webkit-user-select: none;
            user-select: none;
    align-items: center;
    justify-content: space-between
  }

  .label-text {
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    font-size: .8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #8B9EB0;
  }

  .text-area {
    display: flex;
    justify-content: center;
    padding: .5rem;
    margin: .5rem 0rem;
    width: 100%;
    height: 7rem;/* 112px */
    border: none;
    outline: none;
    background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
    /* inner-flat */
    box-shadow: inset -3px -3px 4px #F9FCFF, inset 3px 3px 3px #AEB8C0;
    border-radius: 4px;
    font-size: .8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #113A62;
    /* outline-color: #113A62; */
    /* border-color: #00C48C; */
  }

  /* textarea.text-area {
    width: 50%;
  } */
</style>