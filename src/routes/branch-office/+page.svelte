<script>
  import { loggedInUser } from "$lib/stores";
  import RedirectHome from "$lib/components/RedirectHome.svelte";
  import Input from "$lib/components/Input.svelte";
  import Select from "$lib/components/Select.svelte";
  import { onMount } from "svelte";
  import Icons from "$lib/components/Icons.svelte";
  import Branches from "$lib/components/Branches.svelte";
  import noUser from "$lib/assets/no_user.png";

  let menuAddBranch = false;
  let dispersions = [];
  let date = new Date();
  let terminalId = "";
  let unassignedTerminals = [];
  let assignedTerminals = [];

  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  let ratesBusinessType;
  let branchView = false;
  let selectedBranch;
  let allTransactions = [];
  let branches = [];

  let newBranch = {
    name: "",
    address: "",
    exteriorNumber: "",
    interiorNumber: "",
    terminals: [],
  };

  const getMonthName = (month) => {
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

  const handleAddNewBranchOffice = async () => {};

  const getBusinessLineName = (businessLine) => {
    const businessLineArray = {
      travelAgency: { name: "Agencias de Viajes" },
      aggregators: { name: "Agregadoras" },
      insurers: { name: "Aseguradoras" },
      charity: { name: "Beneficencia" },
      collegeAndUniversities: { name: "Colegios y Universidades" },
      fastFood: { name: "Comida Rápida" },
      basicEducation: { name: "Educación Básica" },
      entertainment: { name: "Entretenimiento" },
      parkings: { name: "Estacionamientos" },
      pharmacy: { name: "Farmacias" },
      gasStations: { name: "Gasolineras" },
      hospitals: { name: "Hospitales" },
      hotels: { name: "Hoteles" },
      doctorsAndDentists: { name: "Doctores y Dentistas" },
      miscellaneous: { name: "Miscelánea" },
      others: { name: "Otros" },
      toll: { name: "Peaje" },
      sparePartsAndHardwareStores: { name: "Refacciones y Ferreterías" },
      carRental: { name: "Renta de Autos" },
      restaurants: { name: "Restaurantes" },
      beautySalons: { name: "Salones de Belleza" },
      supermarkets: { name: "Supermercados" },
      telecommunications: { name: "Telecomunicaciones" },
      airTransport: { name: "Transporte Aéreo" },
      landPassengerTransport: { name: "Transaporte Terrestre de Pasajeros" },
    };
    return businessLineArray[businessLine].name;
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

  onMount(async () => {});
</script>

<div class="container">
  <div class="date">
    {date.getDate()} de {getMonth(date.getMonth())} del {date.getFullYear()}
  </div>
  <div class="card-container padding-2">
    <div class="content">
      {#if !branchView}
        <div class="right">
          <Branches bind:selected={selectedBranch} {branches} bind:branchView />
        </div>
      {:else}
        <div class="card-secondary col padding-1">
          <div class="element">
            <div
              class="element-center arrow-blue"
              on:click={() => (branchView = !branchView)}
              on:keypress={(e) => (e.key === "Enter" ? (branchView = !branchView) : "")}
            >
              <Icons name={"arrow-bwd"} width="24" height="24" />
            </div>
            <div class="avatar-container">
              <div class="avatar">
                <img
                  class="avatar-img"
                  alt="imagen"
                  src={selectedBranch.manager.avatar ? $loggedInUser.avatar : noUser}
                />
              </div>
            </div>
          </div>
          <div class="element">
            <div class="title-blue">
              {selectedBranch.name}
            </div>
            <div class="description text-center">
              {getBusinessLineName(selectedBranch.businessLine)}
            </div>
          </div>
          <div class="divider-hor" />
          <div class="element">
            <div class="title">Responsable Sucursal</div>
            <div class="description text-left">
              <Icons name={"user-fill"} width="24" height="24" />
              {selectedBranch.manager.name}
              {selectedBranch.manager.firstLastName}
            </div>
            <div class="description text-left">
              <Icons name={"phone"} width="24" height="24" />
              {selectedBranch.manager.phone}
            </div>
            <div class="description text-left">
              <Icons name={"mail"} width="24" height="24" />
              {selectedBranch.manager.email}
            </div>
          </div>
          <div class="element">
            <div class="title">Domicilio Sucursal</div>
            <div class="description text-left">
              {selectedBranch.address.street}
              {selectedBranch.address.outsideNumber}
            </div>
            <div class="description text-left">
              {selectedBranch.address.suburb}
              {selectedBranch.address.zipCode}
            </div>
            <div class="description text-left">
              {selectedBranch.address.town}, {selectedBranch.address.state}
            </div>
          </div>
        </div>
        <div class="right">
          <Branches bind:selected={selectedBranch} {branches} bind:branchView />
        </div>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
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

  .right {
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

  @media (max-width: 425px) {
    .content {
      flex-direction: column;
    }

    .container {
      margin: 0 0 4rem 0;
    }
  }

  @media (max-width: 540px) {
    .content {
      flex-direction: column;
    }

    .container {
      margin: 0 0 4rem 0;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
  }
</style>
