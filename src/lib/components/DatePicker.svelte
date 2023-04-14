<script>
  export let label = "";
  export let type = "";
  export let id = "";
  export let placeholder = "";
  export let value = "";
  export let accept = "";
  export let className = "";
  export let icon = "";
  export let title = "";

  const onInput = (e) => {
    value = e.target.value;
    // console.log(value)
  };
</script>

<div class="form-date">
  <label {title} class="label" for={id}>
    <span class="label-text">
      {label}
      <!-- {#if icon != ""}
          <Icons name={icon} width="24" height="24"/>
        {/if} -->
    </span>
  </label>
  <input
    on:click
    type="date"
    {placeholder}
    {id}
    {value}
    on:input={onInput}
    {accept}
  />
</div>

<style lang="scss">
  .form-date {
    padding: 16px;
    display: flex;
    flex-direction: column;
  }

  .label {
    display: flex;
    -webkit-user-select: none;
    user-select: none;
    align-items: center;
    justify-content: space-between;
  }

  .label-text {
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1.25rem;
    display: flex;
    flex-direction: row;
    color: $grey;
  }

  input[type="date"] {
    height: 35px;
    width: 10.75rem;
    margin: 0 auto;
    /* width: 100%; */
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    background-color: lighten(#2f2f2f, 40%);
    outline: none;
    border: 0;
    border-radius: 3px;
    padding: 0 3px;
    background: linear-gradient(91.36deg, background-light-accent-primary 0%, #e6e8ef 100%);
    /* inner-flat */
    box-shadow: inset -3px -3px 4px #f9fcff, inset 3px 3px 3px #aeb8c0;
    border-radius: 4px;
    color: #8c9fb1;
  }
</style>
