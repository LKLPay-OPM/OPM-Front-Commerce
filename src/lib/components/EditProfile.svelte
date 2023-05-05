<script>
  import { isLoggedIn, loggedInUser, redirectBankProfile } from "$lib/stores";
  import { updateUserIne, updateUserBankAccountInfo } from "$lib/hooks/updates.js";
  import { updateUserInfo, updateUserAvatar } from "$lib/hooks/updates.js";
  import { onMount, afterUpdate } from "svelte";
  import Input from "$lib/components/Input.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import Select from "$lib/components/Select.svelte";
  import Icons from "$lib/components/Icons.svelte";
  import noUser from "$lib/assets/no_user.png";
  import { fetchRates } from "$lib/hooks/rates.js";
  import townsData from "$lib/assets/municipios.json";
  /* svelte */
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let statesData = Object.keys(townsData);
  let statesArray = [];
  let townsArray = [];
  let states, towns;
  export let optionSelected;
  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
  };

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
  let ineFront = "",
    ineBack = "",
    bankStatement = "",
    avatarImg = "",
    complianceOpinion = "",
    csf = "",
    addressProof = "";
  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  let ratesBusinessType;

  $: {
    console.log({ optionSelected });
    // console.log(financialData)
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

  const fetchDBRates = () => {
    try {
      const fetch = fetchRates();
      fetch
        .then((value) => {
          ratesBusinessType = value.ratesBusinessType[$loggedInUser.businessLine];
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      throw new Error(error);
    }
  };

  const getBusinessLineName = (businessLine) => {
    const businessLineArray = {
      0: { name: "Agregadoras" },
      1: { name: "Agencias de Viajes" },
      2: { name: "Aseguradoras" },
      3: { name: "Beneficencia" },
      4: { name: "Colegios y Universidades" },
      5: { name: "Comida Rápida" },
      6: { name: "Educación Básica" },
      7: { name: "Entretenimiento" },
      8: { name: "Estacionamientos" },
      9: { name: "Farmacias" },
      10: { name: "Gasolineras" },
      11: { name: "Hospitales" },
      12: { name: "Hoteles" },
      13: { name: "Doctores y Dentistas" },
      15: { name: "Miscelánea" },
      16: { name: "Otros" },
      17: { name: "Peaje" },
      18: { name: "Refacciones y Ferreterías" },
      19: { name: "Renta de Autos" },
      20: { name: "Restaurantes" },
      21: { name: "Salones de Belleza" },
      22: { name: "Supermercados" },
      23: { name: "Telecomunicaciones" },
      24: { name: "Transporte Aéreo" },
      25: { name: "Transaporte Terrestre de Pasajeros" },
    };
    return businessLineArray[businessLine].name;
  };

  let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  let currPassword = "",
    newPass = "",
    newEmail = "",
    repeatPassword = "";
  let avatar = "";

  const handleChangeEmail = (currentPassword, newEmail) => {
    // console.log(currentPassword, newEmail)
    /* changeEmail(currentPassword, newEmail);
    currPassword = "";
    newEmail = ""; */
  };

  const handleChangePassword = (currentPassword, newPassword) => {
    // console.log(currentPassword, newPassword)
    /* changePassword(currentPassword, newPassword);
    currPassword = "";
    newPass = "";
    repeatPassword = ""; */
  };

  const handleUpdateBusinessInfo = async () => {
    // console.log(userData);
    // await updateUserInfo(userData)
    /* .then(() => {
      updateBusinessInfo = !updateBusinessInfo;
    })
    .catch((error) => {
      throw new Error(error)
    }) */
  };

  const getMonth = (month) => {
    const monthsArray = {
      0: { value: "Enero" },
      1: { value: "Febrero" },
      2: { value: "Marzo" },
      3: { value: "Abril" },
      4: { value: "Mayo" },
      5: { value: "Junio" },
      6: { value: "Julio" },
      7: { value: "Agosto" },
      8: { value: "Septiembre" },
      9: { value: "Octubre" },
      10: { value: "Noviembre" },
      11: { value: "Diciembre" },
    };

    return monthsArray[month].value;
  };

  onMount(async () => {
    /* financialData.state = userDetails.state;
    financialData.town = userDetails.town; */
  });

  afterUpdate(() => {});
</script>

<div class="container">
  <div class="card-container padding-2">
    <div class="content">
      <!-- Left Section -->
      <div class="left">
        <div class="card-secondary col padding-1">
          <div class="element">
            <div class="avatar-container">
              <div class="avatar">
                <img class="avatar-img" alt="imagen" src={$loggedInUser.avatar ? $loggedInUser.avatar : noUser} />
                <label for="file">
                  <input id="file" type="file" accept="image/jpeg, image/png" />
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
          <Input
            on:click={() => dispatch("cancel")}
            label="Cancelar"
            id="cancel"
            className="btn-plain blue"
            type="button"
          />
          <Input label="Guardar" id="saveData" className="btn-plain blue" type="button" />
        </div>
      </div>
      <!-- Middle Section -->
      <div class="middle">
        <div class="title">Datos de la Persona</div>
        <div class="element">
          <!-- bind:value={userDetails.name} -->
          <Input
            label="Nombre (s)"
            placeholder="Ejemplo de nombre"
            id="name"
            className="txt-field normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="element">
          <!-- bind:value={userDetails.firstlastName} -->
          <Input
            label="Primer Apellido"
            placeholder="Apellido"
            id="firstLastName"
            className="txt-field normal fill-blue"
            type="text"
            icon=""
          />
          <!-- bind:value={userDetails.secondLastName} -->
          <Input
            label="Segundo Apellido"
            placeholder="Apellido"
            id="secondLastName"
            className="txt-field normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="row-title">INE</div>
        <div class="element">
          <Input
            label="Frente"
            id="ineFront"
            bind:value={ineFront}
            className={ineFront != "" ? "btn-success-border" : "btn-plain blue"}
            type="file"
            accept="image/*,.pdf"
          />
          <Input
            label="Vuelta"
            id="ineBack"
            bind:value={ineBack}
            className={ineBack != "" ? "btn-success-border" : "btn-plain blue"}
            type="file"
            accept="image/*,.pdf"
          />
        </div>
        <div class="element">
          <!-- bind:value={userDetails.phone} -->
          <Input
            label="Teléfono"
            placeholder="331-3124-521"
            id="phone"
            className="txt-field normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="element">
          <!-- bind:value={userDetails.email} -->
          <Input
            label="Email"
            placeholder="nombre@dominio.com"
            id="email"
            className="txt-field normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="element">
          <!-- bind:value={userDetails.bankAccountInfo.clabe} -->
          <Input
            label="Número CLABE"
            placeholder="123123123456789011"
            id="clabe"
            className="txt-field normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="element button">
          <Input
            label="Carátula de Cuenta Bancaria"
            id="bankStatement"
            bind:value={bankStatement}
            className={bankStatement != "" ? "btn-success-border" : "btn-plain blue"}
            type="file"
            accept="application/pdf"
          />
        </div>
      </div>
      <!-- Right Section -->
      <div class="right">
        <div class="title">Datos Fiscales</div>
        <div class="element">
          <!-- bind:value={userDetails.rfc} -->
          <Input
            label="RFC"
            placeholder="AAAA1234562T1"
            id="rfc"
            className="txt-field normal fill-blue"
            type="text"
            icon=""
          />
        </div>
        <div class="element button">
          <!-- bind:value={financialData.csf} -->
          <Input
            label="Constancia de Situación Fiscal"
            id="csf"
            className={financialData.csf != "" ? "btn-success-border" : "btn-plain blue"}
            type="file"
            accept="application/pdf"
          />
        </div>
        <div class="element button">
          <!-- bind:value={financialData.complianceOpinion} -->
          <Input
            label="Opinión de Cumplimiento"
            id="complianceOpinion"
            className={financialData.complianceOpinion != "" ? "btn-success-border" : "btn-plain blue"}
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
            className="txt-field normal fill-blue"
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
    </div>
  </div>
</div>

<style lang="scss">
  /* ========================================== */
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .date {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem; /* 20px */
    line-height: 1.25rem; /* 20px */
    text-align: center;
    /* Text */
    color: $primary-dark;
  }
  .padding-1 {
    padding: 1rem;
  }

  .padding-2 {
    padding: 2rem;
  }
  .content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: -webkit-fill-available;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .row {
    display: grid;
    grid-auto-flow: column;
  }

  .left {
    min-width: 17.5rem; /* 280px */
  }

  .left > .buttons {
    margin: 1rem;
    display: grid;
    grid-auto-flow: column;
    gap: 0.5rem;
    min-height: 2rem;
  }

  .middle,
  .right {
    background: $background-light;
    padding: 0.5rem;
    height: fit-content;
  }

  .middle > .element,
  .right > .element {
    display: grid;
    grid-auto-flow: column;
    gap: 0.5rem;
    min-height: 2rem;
  }
  .middle > .element.button,
  .right > .element.button {
    margin: 1rem 0;
  }

  .middle > .row-title {
    color: $primary-dark;
    font-size: 0.875rem;
    line-height: 1.25rem;
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  .right > .elements-row {
    display: grid;
    /* grid-auto-flow: column; */
    grid-template-columns: repeat(3, 1fr);
    gap: 0.625rem; /* 10px */
    min-height: 2rem; /* 32px */
    max-width: inherit;
  }

  .element > .row-element {
    max-width: 95px;
  }

  .right {
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
  }

  .avatar-container {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  .avatar {
    position: relative;
    width: 130px;
    height: 130px;
    border-radius: 25px;
    overflow: hidden;
    background-color: $primary-dark;
  }
  .avatar img {
    height: 100%;
    width: 100%;
    border-radius: 25px;
    object-fit: cover;
    justify-content: center;
    cursor: pointer;
  }

  /*  */
  .avatar:hover .avatar-img {
    opacity: 0.5;
  }
  .avatar-content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  .avatar:hover .avatar-content {
    opacity: 1;
    cursor: pointer;
  }
  .avatar-text {
    text-transform: uppercase;
    font-size: 12px;
    width: 50%;
    text-align: center;
    cursor: pointer;
  }
  .avatar-icon {
    color: white;
  }
  .avatar input {
    display: none;
  }

  .title-blue {
    font-weight: 700;
    font-size: 20px;
    line-height: 16px;
    text-align: center;
    color: $primary-dark;
    margin: 0rem 0rem 0.5rem 0rem;
  }
  .description {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: $primary-dark;
    display: flex;
    align-items: center;
  }

  .title {
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    text-align: left;
    color: #fd9053;
    margin: 0rem 0rem 0.5rem 0rem;
  }

  .divider-hor {
    background: linear-gradient(138.32deg, rgba(0, 0, 0, 0.5) 8.26%, rgba(255, 255, 255, 0.5) 91.02%), #eaecf0;
    background-blend-mode: soft-light, normal;
    /* n-stroke */

    border: 1px solid rgba(255, 255, 255, 0.4);
    /* n-icon-1-1-2-in */

    box-shadow: inset -1px -1px 2px #fafbff, inset 1px 1px 2px #a6abbd;
    border-radius: 5px;
    height: 0.5rem; /* 8px */
    width: -webkit-fill-available;
  }

  .text-center {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .text-left {
    display: flex;
    justify-content: left;
    text-align: left;
  }

  .arrow-blue {
    color: $primary-light;
    cursor: pointer;
  }

  .hidden {
    display: none;
  }

  @media (max-width: 425px) {
    .content {
      flex-direction: column;
    }
  }

  @media (max-width: 540px) {
    .content {
      flex-direction: column;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .content {
      flex-direction: column;
    }
  }
</style>
