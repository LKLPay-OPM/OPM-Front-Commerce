<script>
  /* stores */
  import { loggedInUser } from "$lib/stores";
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  import Input from "$lib/components/Input.svelte";
  import QuantityInput from "$lib/components/inputs/QuantityInput.svelte";
  /* utils */
  import { tryAgainErrorToast, successCustomMsgToast } from "$lib/utils/toast.js";

  export let optionSelected = 0;
  let terminals = {
    pocket: 0,
    smart: 0,
    master: 0,
  };

  let userDetails = $loggedInUser;

  let innerWidth = 0,
    innerHeight = 0;

  const requestTerminals = () => {
    optionSelected = 0;
    terminals = { pocket: 0, smart: 0, master: 0 };
    successCustomMsgToast("Tu petición de terminales ha sido realizada");
  };

  $: {
    // console.log($loggedInUser.state)
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="card-primary container">
  <div class="col">
    <div class="element">
      <div class={`option-row option-selected`}>
        <i>
          <Icons name="detailed-terminal" width="50" height="50" />
        </i>
        <div class="option-name">Terminales</div>
      </div>
    </div>
    <div class="divider-hor" />
    <div class="element">
      <div class="col">
        <div class={innerWidth <= 540 ? "grid-row" : "grid-col"}>
          <QuantityInput id="pocket" label="Pocket" className="label__top" bind:value={terminals.pocket} />
          <QuantityInput id="smart" label="Smart" className="label__top" bind:value={terminals.smart} />
          <QuantityInput id="master" label="Master" className="label__top" bind:value={terminals.master} />
        </div>
        <div class="button">
          <Input
            on:click={requestTerminals}
            label="Solicitar"
            id="buttonRollsQty"
            type="button"
            className={`
              ${terminals.pocket > 0 || terminals.smart > 0 || terminals.master > 0 ? "btn" : "btn-plain disabled"}`}
            icon=""
          />
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/requests.scss";
</style>
