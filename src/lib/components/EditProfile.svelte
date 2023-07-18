<script>
  import { isLoggedIn, loggedInUser, redirectBankProfile } from "$lib/stores";
  import { onMount, afterUpdate } from "svelte";
  import Input from "$lib/components/Input.svelte";
  import FileInput from "$lib/components/inputs/FileInput.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import Select from "$lib/components/Select.svelte";
  import Icons from "$lib/components/Icons.svelte";
  import noUser from "$lib/assets/no_user.png";
  import townsData from "$lib/assets/municipios.json";
  /* svelte */
  import { createEventDispatcher } from "svelte";
  /* validations */
  import { checkFileSize } from "$lib/utils/validations.js";
  /* utils */
  import { tryAgainErrorToast, successCustomMsgToast } from "$lib/utils/toast.js";

  const dispatch = createEventDispatcher();
  let statesData = Object.keys(townsData);
  let statesArray = [];
  let townsArray = [];
  let states, towns;
  export let user;

  let stateIndex = 0;
  let townIndex = 0;
  export let userDetails;
  let financialData = {
    /* rfc: "",
    businessName: userDetails.businessName,
    csf: "",
    complianceOpinion: "",
    address: userDetails.businessAddress,
    exteriorNumber: userDetails.outsideNumber,
    interiorNumber: userDetails.insideNumber,
    zipCode: userDetails.zipCode,
    state: userDetails.state,
    town: userDetails.town,
    suburb: userDetails.suburb,
    addressReference: "",
    betweenAddress: "",
    addressProof: "", */
  };
  let ineFront = "";
  let ineBack = "";
  let bankStatement = "";
  let complianceOpinion = "";
  let csf = "";
  let addressProof = "";
  let avatarInput = "";

  $: {
    statesArray = [];
    statesData.map(function (key, index) {
      statesArray.push({ name: key, value: key });
    });
    states = statesArray;
    stateIndex = states.map((state) => state.value).indexOf(financialData.state);
    townsArray = [];
    if (financialData.state) {
      townsData[financialData.state].map(function (key, index) {
        townsArray.push({ name: key, value: key });
      });
      towns = townsArray;
      if (financialData.state != $loggedInUser.state) {
        townIndex = 0;
      } else {
        townIndex = towns.map((town) => town.value).indexOf(userDetails.town);
      }
    }
  }

  let avatar = "";

  const handleUpdateBusinessInfo = async () => {
    try {
      const response = await ticketsClient.post(`/ticket/data`, user);
      console.log(response?.data?.response);
      rollsQty = 0;
      successCustomMsgToast("Tu petición para cambio de datos ha sido realizada");
    } catch (e) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      console.error(e);
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };

  const cancelEdit = () => {
    history.back();
  };

  const imgUpdate = () => {
    const file = avatarInput.files[0];
    user.avatar = file;
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", function () {
        avatar = reader.result;
      });
      reader.readAsDataURL(file);

      return;
    }
  };
</script>

<div class="container">
  <div class="card-primary padding-2">
    <div class="content">
      <!-- Left Section -->
      <!-- <div class="left" /> -->
      <!-- Middle Section -->
      <div class="middle">
        <div class="col padding-1">
          <div class="element">
            <div class="avatar-container">
              <div class="avatar">
                <!-- <img class="avatar-img" alt="imagen" src={$loggedInUser.avatar ?? noUser} /> -->
                <img
                  class="avatar-img"
                  alt="imagen"
                  src={avatar != "" ? avatar : $loggedInUser.avatar ? $loggedInUser.avatar : noUser}
                />
                <label for="file">
                  <input
                    on:change={imgUpdate}
                    bind:this={avatarInput}
                    id="file"
                    type="file"
                    accept="image/jpeg, image/png"
                  />
                  <div class="avatar-content">
                    <span class="avatar-icon"><Icons name="camera-fill" width="24" height="24" /></span>
                    <span class="avatar-text">Cambiar Foto</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="element">
            <div class="title-blue">
              <!-- {userDetails.businessName} -->
            </div>
            <div class="description text-center">
              <!-- {getBusinessLineName(userDetails?.businessLine)} -->
            </div>
          </div>
        </div>
        <div class="buttons">
          <Input on:click={() => cancelEdit()} label="Cancelar" id="cancel" className="btn-plain blue" type="button" />
          <Input
            on:click={handleUpdateBusinessInfo}
            label="Guardar"
            id="saveData"
            className="btn-plain blue"
            type="button"
          />
        </div>
        <div class="title">Datos de la Persona</div>
        <div class="element">
          <Input
            bind:value={user.name}
            label="Nombre (s)"
            placeholder="Ejemplo de nombre"
            id="name"
            className="txt-field-slim normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="element">
          <Input
            bind:value={user.firstLastName}
            label="Primer Apellido"
            placeholder="Apellido"
            id="firstLastName"
            className="txt-field-slim normal fill-blue"
            type="text"
            icon=""
          />
          <Input
            bind:value={user.secondLastName}
            label="Segundo Apellido"
            placeholder="Apellido"
            id="secondLastName"
            className="txt-field-slim normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="row-title">INE</div>
        <div class="element">
          <FileInput
            label="Frente"
            id="IneFront"
            bind:file={ineFront}
            className={`btn-plain ${
              ineFront === "" ? "" : checkFileSize(ineFront) ? "btn-success" : "border-btn-error"
            }`}
            accept="image/jpeg, image/png, application/pdf"
          />
          <FileInput
            label="Vuelta"
            id="IneBack"
            bind:file={ineBack}
            className={`btn-plain ${ineBack === "" ? "" : checkFileSize(ineBack) ? "btn-success" : "border-btn-error"}`}
            accept="image/jpeg, image/png, application/pdf"
          />
        </div>
        <div class="element">
          <Input
            bind:value={user.phone}
            label="Teléfono"
            placeholder="331-3124-521"
            id="phone"
            className="txt-field-slim normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="element">
          <Input
            bind:value={user.email}
            label="Email"
            placeholder="nombre@dominio.com"
            id="email"
            className="txt-field-slim normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="element">
          <Input
            bind:value={user.clabe}
            label="Número CLABE"
            placeholder="123123123456789011"
            id="clabe"
            className="txt-field-slim normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="element button">
          <FileInput
            label="Carátula de Cuenta Bancaria"
            id="bankStatement"
            bind:file={bankStatement}
            className={`btn-plain ${
              bankStatement === "" ? "" : checkFileSize(bankStatement) ? "btn-success" : "border-btn-error"
            }`}
            accept="application/pdf"
          />
        </div>
      </div>
      <!-- Right Section -->
      {#if $loggedInUser.accountType > 0}
        <div class="right">
          <div class="title">Datos Fiscales</div>
          <div class="element">
            <!-- bind:value={userDetails.rfc} -->
            <Input
              label="RFC"
              placeholder="AAAA1234562T1"
              id="rfc"
              className="txt-field-slim normal fill-blue"
              type="text"
              icon=""
            />
          </div>
          <div class="element button">
            <!-- bind:value={csf} -->
            <Input
              label="Constancia de Situación Fiscal"
              id="csf"
              className={csf != "" ? "btn-success-border" : "btn-plain blue"}
              type="file"
              accept="application/pdf"
            />
          </div>
          <div class="element button">
            <!-- bind:value={complianceOpinion} -->
            <Input
              label="Opinión de Cumplimiento"
              id="complianceOpinion"
              className={complianceOpinion != "" ? "btn-success-border" : "btn-plain blue"}
              type="file"
              accept="application/pdf"
            />
          </div>
          <div class="title">Domicilio Fiscal</div>
          <div class="element">
            <!-- bind:value={financialData.address} -->
            <Input
              label="Calle"
              placeholder="Circunvalación Jorge Álvarez del Castillo"
              id="address"
              className="txt-field-slim normal fill-blue"
              type="text"
              icon=""
            />
          </div>
          <div class="element">
            <div class="row-element">
              <!-- bind:value={financialData.exteriorNumber} -->
              <Input
                placeholder="1106"
                label="N° Exterior"
                id="ExteriorNumber"
                className="txt-field-slim normal fill-blue"
                type="email"
              />
            </div>
            <div class="row-element">
              <!-- bind:value={financialData.interiorNumber} -->
              <Input
                placeholder="NA"
                label="N° Interior"
                id="InteriorNumber"
                className="txt-field-slim normal fill-blue"
                type="text"
              />
            </div>
            <div class="row-element">
              <!-- bind:value={financialData.zipCode} -->
              <Input
                placeholder="44620"
                label="Código Postal"
                id="ZipCode"
                className="txt-field-slim normal fill-blue"
                type="text"
              />
            </div>
          </div>
          <div class="element">
            <!-- <Select
              index={stateIndex}
              classList={"blue"}
              bind:value={financialData.state}
              label="Estado"
              defaultText={"Elige una opción"}
              bind:optionsList={states}
            />
            <Select
              index={townIndex}
              classList={"blue"}
              bind:value={financialData.town}
              label="Municipio"
              defaultText={"Elige una opción"}
              bind:optionsList={towns}
            /> -->
          </div>
          <!-- 
          {#if statesArray.length>0}
          {/if} -->
          <div class="element">
            <!-- bind:value={financialData.address} -->
            <Input
              placeholder="Chapultepec Country"
              label="Colonia"
              id="Suburb"
              className="txt-field-slim normal fill-blue"
              type="text"
            />
          </div>
          <div class="element">
            <!-- bind:value={financialData.addressReference} -->
            <Input
              placeholder="Casa con portón negro"
              label="Referencia del Domicilio"
              id="AddressReference"
              className="txt-field-slim normal fill-blue"
              type="text"
            />
          </div>
          <!-- bind:value={financialData.betweenAddress} -->
          <TextArea
            className={"fill-blue"}
            label="Entre Calles"
            placeholder="Av. Plan de San Luis y Av. Circunvalacion Jorge Alvarez del Castillo"
            id="BetweenStreets"
            name="BetweenStreets"
          />
          <div class="element button">
            <Input
              label="Comprobante de Domicilio"
              id="AddressProof"
              bind:value={addressProof}
              className={addressProof != "" ? "btn-success-border" : "btn-plain blue"}
              type="file"
              accept="application/pdf"
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/profile/edit.scss";
</style>
