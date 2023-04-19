<script>
  import { enhance } from "$app/forms";
  import Input from "$lib/components/Input.svelte";
  import IconInput from "$lib/components/IconInput.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import DatePicker from "$lib/components/DatePicker.svelte";

  // export let form;

  let input = {
    amount: 0,
    expiration: "",
    email: "",
    description: "",
  };

  $: validation = input.amount > 0 && input.expiration != "" && input.email != "" && input.description != "";
</script>

<pre>
  <!-- {JSON.stringify(form, null, 2)} -->
</pre>

<div class="form-container">
  <div class="card-container">
    <form class="form" method="POST" use:enhance>
      <IconInput
        icon="dollar"
        label="Monto"
        id="amount"
        bind:value={input.amount}
        className="txt-field normal fill-blue"
        type="number"
        name="amount"
      />
      <DatePicker
        className="fill-blue"
        name="expiration"
        label="Vencimiento"
        id="epiration"
        bind:value={input.expiration}
      />
      <Input
        bind:value={input.email}
        label="Correo Electrónico"
        placeholder="email@dominio.com"
        id="email"
        className="txt-field normal fill-blue"
        type="text"
        name="email"
      />
      <TextArea
        bind:value={input.description}
        label="Descripción"
        placeholder="Descrpición de la transacción"
        id="description"
        name="description"
        className="fill-blue"
      />
      <div class="btn-layout">
        <Input
          label="Generar Link"
          id="btnGenerateLink"
          className={`${validation ? "btn" : "btn-plain disabled"}`}
          type="submit"
        />
      </div>
    </form>
  </div>
</div>

<style>
  .form-container {
    width: 100%;
    height: 100%;
    margin: 2rem 0;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .form {
    min-width: 20rem;
    padding: 1rem 1rem;
  }

  .btn-layout {
    display: flex;
    justify-content: center;
    height: 2.375rem;
    width: 100%;
    margin-bottom: 1.125rem;
    margin-top: 1.125rem;
  }
</style>
