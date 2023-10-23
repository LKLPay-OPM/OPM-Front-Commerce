<script>
  /* svelte */
  import { error } from "@sveltejs/kit";
  /* stores */
  import { loggedInUser } from "$lib/stores";
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  import Input from "$lib/components/Input.svelte";
  import QuantityInput from "$lib/components/inputs/QuantityInput.svelte";
  /* repos */
  import { ticketsClient } from "$lib/repos/axios";
  /* utils */
  import {
    errorCustomMsgToast,
    successCustomMsgToast,
  } from "$lib/utils/toast.js";
  /* controllers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";
  export let optionSelected = 0;
  let terminals = {
    pocket: 0,
    smart: 0,
    master: 0,
    max: 0,
  };

  let userDetails = $loggedInUser;

  let innerWidth = 0,
    innerHeight = 0;
  4;

  const requestTerminals = async () => {
    optionSelected = 0;
    try {
      const response = await ticketsClient.post(`/ticket/terminal`, terminals);
      terminals = { pocket: 0, smart: 0, master: 0, max: 0 };
      successCustomMsgToast("Tu petición de terminales ha sido realizada");
    } catch (e) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };
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
          <QuantityInput
            id="pocket"
            label="Pocket"
            className="label__top"
            bind:value={terminals.pocket}
          />
          <!-- <QuantityInput id="smart" label="Smart" className="label__top" bind:value={terminals.smart} /> -->
          <!-- <QuantityInput id="master" label="Master" className="label__top" bind:value={terminals.master} /> -->
          <QuantityInput
            id="max"
            label="Max"
            className="label__top"
            bind:value={terminals.max}
          />
        </div>
        <div class="button">
          <Input
            on:click={requestTerminals}
            label="Solicitar"
            id="buttonRollsQty"
            type="button"
            className={`
              ${
                terminals.pocket > 0 ||
                terminals.max >
                  0 /* || terminals.smart > 0 || terminals.master > 0 */
                  ? "btn"
                  : "btn-plain disabled"
              }`}
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
