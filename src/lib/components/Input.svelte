<script>
  import Icons from "$lib/components/Icons.svelte";
  export let label = "";
  export let type = "";
  export let id = "";
  export let placeholder = "";
  export let value = "";
  export let accept = "";
  export let className = "";
  export let icon = "";
  export let title = "";
  export let name = "";
  export let multiple = false;
  export let disabled = false;

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
      {#if icon != ""}
        <Icons name={icon} width="24" height="24" />
      {/if}
    </span>
  </label>
  <input
    on:click
    {name}
    {type}
    {placeholder}
    {id}
    {value}
    on:input={onInput}
    {accept}
    {multiple}
    {disabled}
  />
</div>

<style>
  .txt-field label {
    margin-top: 1rem;
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #8b9eb0;
  }
  .txt-field input {
    font-family: "Roboto";
    width: -webkit-fill-available;
    height: 3.125rem;
    background: linear-gradient(91.36deg, #efeef5 0%, #e6e8ef 100%);
    box-shadow: inset -3px -3px 4px #f9fcff, inset 3px 3px 3px #aeb8c0;
    /* border: none; */
    border-radius: 4px;
    padding-left: 1.25rem; /* 20px */
    /* TEXT */
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: #113a62;
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
    color: #8b9eb0;
  }
  .disabled-txt-field input {
    background: transparent;
    border: none;
    outline: none;
    width: -webkit-fill-available;
    height: 100%;
    border-radius: 4px;
    /* padding-left: 1.25rem; */
    /* TEXT */
    font-weight: 500;
    font-size: 1rem; /* 16px */
    line-height: 1.125rem; /* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: #113a62;
  }

  .disabled-txt-field input::placeholder {
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    color: #d9d9d9;
  }
  .txt-field-slim label {
    margin-top: 1rem;
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #8b9eb0;
  }
  .txt-field-slim input {
    width: -webkit-fill-available;
    min-height: 2.125rem; /* 34px */
    height: 2.125rem; /* 34px */
    background: linear-gradient(91.36deg, #efeef5 0%, #e6e8ef 100%);
    box-shadow: inset -3px -3px 4px #f9fcff, inset 3px 3px 3px #aeb8c0;
    /* border: none; */
    border-radius: 4px;
    padding-left: 1.25rem;
    /* TEXT */
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: #113a62;
  }

  .txt-field-slim input::placeholder {
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    color: #d9d9d9;
  }

  /* .txtField input:focus {
    outline: none;
  } */

  .normal input {
    outline: none;
    background: linear-gradient(#efeef5, #e6e8ef) padding-box,
      linear-gradient(187deg, #ffffff, #d6e3f3) border-box;
    border-radius: 4px;
    border: 2px solid transparent;
  }
  .valid input {
    outline-color: #00c48c;
    border-color: #00c48c;
  }

  .invalid input {
    outline-color: #ff0000;
    border-color: #ff0000;
  }

  div.btn {
    align-content: center;
    justify-content: center;
    border: none;
    display: flex;
    height: 100%;
    width: 100%;
    background: linear-gradient(270deg, #0478ff 0%, #50caff 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff,
      4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 0.625rem;
  }

  .btn label {
    width: 100%;
    cursor: pointer;
    /* TEXT */
    font-weight: 800;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #ffffff;
  }

  .btn input {
    display: none;
  }

  div.btn-plain {
    align-content: center;
    justify-content: center;
    border: none;
    display: flex;
    /* height: 2.5rem; */
    height: 100%;
    width: 100%;
    max-width: 20rem;
    background: linear-gradient(91.36deg, #efeef5 0%, #e6e8ef 100%);
    box-shadow: -5px -5px 8px #f2f4f8, 5px 5px 7px rgba(174, 174, 192, 0.5);
    border-radius: 5px;
  }

  .btn-plain label {
    width: 100%;
    cursor: pointer;
    /* TEXT */
    font-weight: 800;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #8c9fb1;
  }

  .btn-plain input {
    display: none;
  }

  div.btn-round {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
  }
  div.btn-square {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 5px;
  }
  div.btn-success {
    width: 100%;
    align-content: center;
    justify-content: center;
    border: none;
    display: flex;
    height: 3.375rem;
    background: linear-gradient(270deg, #00c48c 0%, #50ffd5 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff,
      4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 0.625rem;
  }

  .btn-success label {
    width: 100%;
    cursor: pointer;
    /* TEXT */
    font-weight: 800;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #ffffff;
  }

  .btn-success input {
    display: none;
  }
  div.btn-success {
    width: 100%;
    height: 100%;
    align-content: center;
    justify-content: center;
    border: none;
    display: flex;
    background: linear-gradient(270deg, #00c48c 0%, #50ffd5 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff,
      4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 0.625rem;
  }

  .btn-success label {
    width: 100%;
    cursor: pointer;
    /* TEXT */
    font-weight: 800;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #ffffff;
  }

  .btn-success input {
    display: none;
  }
  div.btn-error {
    width: 100%;
    align-content: center;
    justify-content: center;
    border: none;
    display: flex;
    height: 3.375rem;
    background: linear-gradient(270deg, #fd5353 0%, #ffa450 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff,
      4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 0.625rem;
  }

  .btn-error label {
    width: 100%;
    cursor: pointer;
    /* TEXT */
    font-weight: 800;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #ffffff;
  }

  .btn-error input {
    display: none;
  }

  div.btn-orange {
    background: #fd9053;
  }

  .btn-orange label {
    color: #ffffff;
  }

  div.btn-disabled {
    width: 100%;
    align-content: center;
    justify-content: center;
    cursor: not-allowed;
    pointer-events: none;
    border: none;
    display: flex;
    height: 3.375rem;
    background: linear-gradient(91.36deg, #e6e8ef 0%, #efeef5 100%);
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff,
      4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 0.625rem;
  }

  .btn-disabled label {
    width: 100%;
    cursor: not-allowed;
    pointer-events: none;
    /* TEXT */
    font-weight: 700;
    font-size: 1.3125;
    line-height: 1.25rem;
    text-align: center;
    justify-content: center;
    letter-spacing: -0.4px;
    color: #a6b4c8;
  }

  .btn-disabled input {
    display: none;
  }
  .form-control {
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
    font-size: 0.875rem;
    line-height: 1.25rem;
    display: flex;
    flex-direction: row;
  }

  .input {
    flex-shrink: 1;
    height: 1.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    line-height: 2;
  }

  .button {
    margin: 10px;
  }

  .button label {
    background-color: darkslateblue;
    display: flex;
    -webkit-user-select: none;
    user-select: none;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border: none;
    padding: 0.5rem 1.5rem;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1px;
    cursor: pointer;
    max-width: fit-content;
    transition: all 0.5s ease;
  }

  .button input {
    display: none;
  }

  .button label .label-text {
    color: darkgray;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .text-button label {
    /* background-color: darkslateblue; */
    display: flex;
    -webkit-user-select: none;
    user-select: none;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border: none;
    /* padding: .5rem 1.5rem; */
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 1px;
    /* cursor: pointer; */
    width: fit-content;
    /* max-width: fit-content; */
    transition: all 0.5s ease;
  }

  .text-button input {
    display: none;
  }

  .text-button label .label-text {
    color: darkslateblue;
    font-size: 1.25rem;
    line-height: 1.25rem;
    cursor: pointer;
  }

  .txt-field-horizontal label {
    font-size: 0.8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #8b9eb0;
    min-width: 4.25rem; /* 10px */
  }
  .txt-field-horizontal.blue label {
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.25rem; /* 20px */
    color: #113a62;
  }
  div.txt-field-horizontal {
    width: -webkit-fill-available;
    min-width: -webkit-fill-available;
    display: flex;
    margin: 0.75rem 0rem 0rem 0rem;
    /* max-width: 100%; */
  }

  .txt-field-horizontal input {
    width: -webkit-fill-available;
    max-width: 5rem; /* 80px */
    min-height: 2.125rem; /* 34px */
    height: 2.125rem; /* 34px */
    background: linear-gradient(91.36deg, #efeef5 0%, #e6e8ef 100%);
    box-shadow: inset -3px -3px 4px #f9fcff, inset 3px 3px 3px #aeb8c0;
    /* border: none; */
    border-radius: 4px;
    padding-left: 1.25rem;
    /* TEXT */
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    display: flex;
    align-items: center;
    justify-content: left;
    color: #113a62;
  }

  .txt-field-horizontal input::placeholder {
    font-weight: 500;
    font-size: 0.8125rem; /* 13px */
    line-height: 1.125rem; /* 18px */
    color: #d9d9d9;
  }

  .modal-toggle {
    display: none;
  }

  .disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  .profile-pic-upload {
    display: none;
  }

  .fill-red label {
    color: #c40000;
  }
  .fill-green label {
    color: #00c48c;
  }
  .fill-blue label {
    color: #113a62;
  }

  .fill-orange label {
    color: #fd9053;
  }
</style>
