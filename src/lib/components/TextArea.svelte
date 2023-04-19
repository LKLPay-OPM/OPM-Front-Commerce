<script>
  export let label = "";
  export let id = "";
  export let placeholder = "";
  export let value = "";
  export let className = "";
  export let title = "";
  export let name = "";
  const onInput = (e) => {
    value = e.target.value;
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
<div class={className}>
  <label {title} class="label" for={id}>
    <span class="label-text">
      {label}
    </span>
  </label>
  <textarea on:input={onInput} {value} {placeholder} {id} {name} class="text-area" rows="5" />
</div>

<style lang="scss">
  .label {
    display: flex;
    -webkit-user-select: none;
    user-select: none;
    align-items: center;
    justify-content: space-between;
  }

  .label-text {
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: $grey;
  }

  .text-area {
    display: flex;
    justify-content: center;
    padding: 0.5rem;
    margin: 0.5rem 0rem;
    width: 100%;
    height: 7rem; /* 112px */
    border: none;
    outline: none;
    background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #e6e8ef 100%);
    /* inner-flat */
    box-shadow: inset -3px -3px 4px #f9fcff, inset 3px 3px 3px #aeb8c0;
    border-radius: 4px;
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: $primary-dark;
    /* outline-color: $primary-dark; */
    /* border-color: #00C48C; */
  }

  .fill-blue .label-text {
    color: $primary-dark;
    font-size: 0.875rem;
  }

  /* textarea.text-area {
    width: 50%;
  } */
</style>
