<script>
  /* utils */
  import { onlyNumbers } from "$lib/utils/validations";
  import { selectText } from "$lib/utils/input";
  /* constants */

  export let value = 0;
  export let className = "";
  export let label = "";
  export let id = "";
  let input;

  function add() {
    value++;
  }

  function less() {
    if (value > 0) value--;
  }
</script>

<div class={`container__quantity-input ${className != "" ? className : "label__none"}`}>
  <label for={id} class="label">
    <span>{label}</span>
  </label>
  <div class="quantity-input__container">
    <button on:click={less}>-</button>
    <div>
      <input
        {id}
        bind:this={input}
        on:click={selectText(input)}
        type="text"
        placeholder="0"
        on:input={onlyNumbers}
        bind:value
      />
    </div>
    <button on:click={add}>+</button>
  </div>
</div>

<style lang="scss">
  .quantity-input__container {
    display: grid;
    grid-template-columns: 3rem 3rem 3rem;

    button,
    div,
    input {
      height: 3rem;
      display: block;
    }

    input {
      text-align: center;
      width: 3rem;
    }

    button,
    input {
      border-color: rgb(0 0 0 / 4%);
      border-width: 1px;
      background-color: lighten($grey, $amount: 34);

      &:focus {
        outline: none;
      }
    }

    button {
      cursor: pointer;
      font-size: 24px;
      font-weight: 600;
      line-height: 0;

      &:hover {
        background-color: lighten($grey, $amount: 32);
      }
      &:first-child {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border-right-width: 0;
      }
      &:last-child {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-left-width: 0;
      }
    }
  }

  .container__quantity-input {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    label {
      font-weight: 500;
      font-size: 0.8125rem;
      line-height: 1.25rem;
      color: $primary-dark;
    }
  }

  .label__top {
    flex-direction: column;
    span {
      background: transparent;
    }
  }

  .label__side {
    flex-direction: row;
  }

  .label__none {
    .label {
      display: none;
    }
  }

  /* Dark Mode */
  :global(body.dark-mode) {
    .quantity-input__container {
      button,
      input {
        border-color: rgb(0 0 0 / 4%);
        background-color: $background-dark-accent-primary;
        color: $font-dark-primary;
      }

      button {
        color: $font-dark-primary;
        &:hover {
          background-color: lighten($background-dark, $amount: 10);
        }
      }
    }

    label {
      color: $font-dark-primary;
    }
  }
</style>
