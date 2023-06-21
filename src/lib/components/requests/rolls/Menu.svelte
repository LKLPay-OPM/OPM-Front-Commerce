<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  import Input from "$lib/components/Input.svelte";
  import QuantityInput from "$lib/components/inputs/QuantityInput.svelte";
  /* utils */
  import { successCustomMsgToast } from "$lib/utils/toast.js";

  export let optionSelected = 0;
  let rollsQty = 0;

  let innerWidth = 0,
    innerHeight = 0;

  const requestRolls = () => {
    (optionSelected = 0), (rollsQty = 0);
    successCustomMsgToast("Tu petición de rollos ha sido realizada");
  };
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="card-container container">
  <div class="col">
    <div class="element">
      <div class={`option-row option-selected`}>
        <i>
          <Icons name="roll" width="50" height="50" />
        </i>
        <div class="option-name">Rollos</div>
      </div>
    </div>
    <div class="divider-hor" />
    <div class="element">
      <div class={innerWidth <= 540 ? "col" : "row"}>
        <QuantityInput bind:value={rollsQty} />
        <div class="button">
          <Input
            on:click={requestRolls}
            label="Solicitar"
            id="buttonRollsQty"
            type="button"
            className={`
              ${rollsQty > 0 ? "btn" : "btn-plain disabled"}`}
            icon=""
          />
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/requests/rolls/menu.scss";
</style>
