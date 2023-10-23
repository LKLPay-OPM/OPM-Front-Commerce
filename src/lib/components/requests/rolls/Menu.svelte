<script>
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

  let rollsQty = 0;

  let innerWidth = 0,
    innerHeight = 0;

  const requestRolls = async () => {
    try {
      const response = await ticketsClient.post(`/ticket/roll`, {
        quantity: rollsQty,
      });
      rollsQty = 0;
      successCustomMsgToast("Tu petición de rollos ha sido realizada");
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
