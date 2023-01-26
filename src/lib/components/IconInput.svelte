<script>
	import Icons from '$lib/components/Icons.svelte';
  export let label = "";
  export let type = "";
  export let id = "";
  export let placeholder = "";
  export let value = "";
  export let accept = "";
  export let className = "";
  export let icon = "";
  export let title = "";
  export let multiple = false;
  export let disabled = false;
  
  const onInput = e => {
    if(type != "number"){
      value = e.target.value
    }else{
      if(isNaN(e.target.value)){
        value = e.target.value
      }else {
        // value = parseFloat(e.target.value).round(2)
        value = Math.round((e.target.value) * 100) / 100
      }
    }
  };
</script>

<div class={`${className}`}>
  <label title={title} class="label" for={id}>
    <span class="label-text">
      {label}
    </span>
  </label>
  <div class="input">
    {#if icon != ""}
      <Icons name={icon} width="24" height="24"/>
    {/if}
    <input class="input-field" on:click {type} {placeholder} {id} {value} on:input={onInput} {accept} {multiple} {disabled}>
  </div>
</div>

<style>

  .input .input-field {
    border: none;
    outline: none;
    width: 80%;
    height: 3.125rem;
    background: transparent;
    /* border: none; */
    border-radius: 4px;
    padding-left: .5rem;/* 8px */
    /* TEXT */
    font-weight: 500;
    font-size: 1.25rem;/* 20px */
    line-height: 1.125rem;/* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: #113A62;
  }

  .txt-field label {
    margin-top: 1rem;
    font-size: .8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #8B9EB0;
  }
  .txt-field .input {
    width: 100%;
    height: 3.125rem;
    background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
    box-shadow: inset -3px -3px 4px #F9FCFF, inset 3px 3px 3px #AEB8C0;
    /* border: none; */
    border-radius: 4px;
    padding-left: .5rem;/* 8px */
    /* TEXT */
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: 1.125rem;/* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: #113A62;
  }

  .txt-field input::placeholder{
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: 1.125rem;/* 18px */
    color: #D9D9D9;
  }
  .disabled-txt-field label {
    margin-top: 1rem;
    font-size: .8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #8B9EB0;
  }
  .disabled-txt-field .input {
    width: 100%;
    height: 3.125rem;
    background: transparent;
    /* border: none; */
    border-radius: 4px;
    padding-left: .5rem;/* 8px */
    /* TEXT */
    font-weight: 500;
    font-size: 1.25rem;/* 20px */
    line-height: 1.125rem;/* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: #113A62;
  }

  .disabled-txt-field input::placeholder{
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: 1.125rem;/* 18px */
    color: #D9D9D9;
  }
</style>