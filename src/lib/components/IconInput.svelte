<script>
  import Icons from "$lib/components/Icons.svelte";
  export let label = "";
  export let type = "";
  export let id = "";
  export let name = "";
  export let placeholder = "";
  export let value = "";
  export let accept = "";
  export let className = "";
  export let icon = "";
  export let title = "";
  export let multiple = false;
  export let disabled = false;
  export let min;

  const onInput = (e) => {
    if (type != "number") {
      value = e.target.value;
    } else {
      if (isNaN(e.target.value)) {
        value = e.target.value;
      } else {
        // value = parseFloat(e.target.value).round(2)
        value = Math.round(e.target.value * 100) / 100;
      }
    }
  };
</script>

<div class={`${className}`}>
  <label {title} class="label" for={id}>
    <span class="label-text">
      {label}
    </span>
  </label>
  <div class="input">
    {#if icon != ""}
      <Icons name={icon} width="24" height="24" />
    {/if}
    <input
      class="input-field"
      on:click
      {type}
      {placeholder}
      {id}
      {value}
      {name}
      on:input={onInput}
      {accept}
      {multiple}
      {disabled}
      {min}
    />
  </div>
</div>

<style lang="scss">
  .input .input-field {
    border: none;
    outline: none;
    width: 80%;
    height: 3.125rem;
    background: transparent;
    /* border: none; */
    border-radius: 4px;
    padding-left: 0.5rem; /* 8px */
    /* TEXT */
    font-weight: 500;
    font-size: 1.25rem; /* 20px */
    line-height: 1.125rem; /* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: $primary-dark;
  }

  .txt-field label {
    margin-top: 1rem;
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: $grey;
  }
  .txt-field .input {
    width: 100%;
    height: 3.125rem;
    background: linear-gradient(91.36deg, $background-light-accent-primary 0%, #e6e8ef 100%);
    box-shadow: inset -3px -3px 4px #f9fcff, inset 3px 3px 3px #aeb8c0;
    /* border: none; */
    border-radius: 4px;
    padding-left: 0.5rem; /* 8px */
    /* TEXT */
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: $primary-dark;
  }

  .txt-field input::placeholder {
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    color: #d9d9d9;
  }
  .disabled-txt-field label {
    margin-top: 1rem;
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: $grey;
  }
  .disabled-txt-field .input {
    width: 100%;
    height: 3.125rem;
    background: transparent;
    /* border: none; */
    border-radius: 4px;
    padding-left: 0.5rem; /* 8px */
    /* TEXT */
    font-weight: 500;
    font-size: 1.25rem; /* 20px */
    line-height: 1.125rem; /* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: $primary-dark;
  }

  .disabled-txt-field input::placeholder {
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    color: #d9d9d9;
  }

  .fill-blue label {
    font-size: 0.875rem;
    color: $primary-dark;
  }
</style>
