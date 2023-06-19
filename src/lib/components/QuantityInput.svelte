<script>
  /* utils */
  import { onlyNumbers } from "$lib/utils/validations";
  /* constants */
  import { selectText } from "$lib/constants/input.js";

  export let value = 0;
  let input;

  function add() {
    value++;
  }

  function less() {
    if (value > 0) value--;
  }
</script>

<div class="quantity-input__container">
  <button on:click={less}>-</button>
  <div>
    <input
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

<style lang="scss">
  /* my code*/
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
</style>
