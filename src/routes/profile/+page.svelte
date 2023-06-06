<script>
  import { isLoggedIn, loggedInUser, redirectBankProfile } from "$lib/stores";
  import { onMount, afterUpdate } from "svelte";
  import Input from "$lib/components/Input.svelte";
  import Icons from "$lib/components/Icons.svelte";
  import Branches from "$lib/components/Branches.svelte";
  import noUser from "$lib/assets/no_user.png";

  export let data;
  let user = data.user;
  let transactions = data.transactions;
  let filter = data.filter;

  $: {
    // console.log(data);
  }

  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
  };

  const dbCollection = "users-client";
  const uid = $loggedInUser.uid;
  let date = new Date();
  let ratesBusinessType;
  let branchView = false;
  let selectedBranch;
  let allTransactions = [];
  let branches = [
    /* {
      id: "1",
      name: "Matriz",
      businessLine: "restaurants",
      manager: {
        avatar: "",
        name: "Mario Enrique",
        firstLastName: "Saldaña",
        phone: "3312412102",
        email: "armando.velasco@lklpay.com.mx",
      },
      address: {
        street: "Av. Jorge Alvarez del Castillo",
        outsideNumber: "1106",
        suburb: "Chapultepec Country",
        zipCode: "44620",
        town: "Guadalajara",
        state: "Jalisco",
      },
      transactions: [
        {
          "Transaction Date": "230214",
          "Transaction Time": "234234",
          Amount: "000000001500",
        },
        {
          "Transaction Date": "230214",
          "Transaction Time": "234233",
          Amount: "000000011500",
        },
      ],
    }, */
  ];

  $: {
  }

  const fetchDBRates = () => {
    /* try {
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
    } */
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
    // changeEmail(currentPassword, newEmail);
    currPassword = "";
    newEmail = "";
  };

  const handleChangePassword = (currentPassword, newPassword) => {
    // console.log(currentPassword, newPassword)
    // changePassword(currentPassword, newPassword);
    currPassword = "";
    newPass = "";
    repeatPassword = "";
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

  onMount(async () => {});
</script>

<div class="container">
  <div class="date">
    {date.getDate()} de {getMonth(date.getMonth())} del {date.getFullYear()}
  </div>
  <div class="card-container padding-2">
    <div class="content">
      {#if !branchView}
        <div class="left">
          <div class="card-secondary col padding-1">
            <div class="element">
              <div class="avatar-container">
                <div class="avatar">
                  <img class="avatar-img" alt="imagen" src={$loggedInUser.avatar ? $loggedInUser.avatar : noUser} />
                </div>
              </div>
            </div>
            <div class="element">
              <div class="title-blue">
                {user.businessName}
              </div>
              <div class="description text-center">
                {getBusinessLineName(user.businessLine)}
              </div>
            </div>
            <div class="element rates">
              <div class="title">Tasas</div>
              <div class="row">
                <div class="element">
                  <div class="title-blue">Crédito</div>
                  <div class="description text-center">
                    3.5%
                    <!-- {ratesBusinessType?.credit}% -->
                  </div>
                </div>
                <div class="element">
                  <div class="title-blue">Débito</div>
                  <div class="description text-center">
                    3.5%
                    <!-- {ratesBusinessType?.debit}% -->
                  </div>
                </div>
                <div class="element">
                  <div class="title-blue">AMEX</div>
                  <div class="description text-center">
                    3.5%
                    <!-- {ratesBusinessType?.amex}% -->
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="element">
                  <div class="title-blue">Internacionales</div>
                  <div class="description text-center">
                    3.5%
                    <!-- {ratesBusinessType?.internationals}% -->
                  </div>
                </div>
              </div>
            </div>
            <div class="divider-hor" />
            <div class="element">
              <div class="title">Asesor</div>
              <div class="description text-left">
                <Icons name={"user-fill"} width="24" height="24" />
                {user.adviser ?? ""}
              </div>
            </div>
            {#if $loggedInUser.accountType > 1}
              <div class="element">
                <div class="title">Persona Física</div>
                <div class="description text-left">
                  <Icons name={"user-fill"} width="24" height="24" />
                  Mario Enrique Saldaña
                </div>
                <div class="description text-left">
                  <Icons name={"phone"} width="24" height="24" />
                  3312412102
                </div>
                <div class="description text-left">
                  <Icons name={"mail"} width="24" height="24" />
                  armando.velasco@lklpay.com.mx
                </div>
              </div>
              <div class="element">
                <div class="title">Domicilio Fiscal</div>
                <div class="description text-left">
                  <!-- {$loggedInUser.businessAddress} -->
                  <!-- {$loggedInUser.outsideNumber} -->
                </div>
                <div class="description text-left">
                  <!-- {$loggedInUser.suburb} -->
                  <!-- {$loggedInUser.zipCode} -->
                </div>
                <div class="description text-left">
                  <!-- {$loggedInUser.town}, {$loggedInUser.state} -->
                </div>
              </div>
              <div class="divider-hor" />
              <div class="element">
                <div class="title">Responsable General</div>
                <div class="description text-left">
                  <Icons name={"user-fill"} width="24" height="24" />
                  Mario Enrique Saldaña
                </div>
                <div class="description text-left">
                  <Icons name={"phone"} width="24" height="24" />
                  3312412102
                </div>
                <div class="description text-left">
                  <Icons name={"mail"} width="24" height="24" />
                  armando.velasco@lklpay.com.mx
                </div>
              </div>
              <div class="element">
                <div class="title">Domicilio Operativo</div>
                <div class="description text-left">
                  <!-- {$loggedInUser.businessAddress} -->
                  <!-- {$loggedInUser.outsideNumber} -->
                </div>
                <div class="description text-left">
                  <!-- {$loggedInUser.suburb} -->
                  <!-- {$loggedInUser.zipCode} -->
                </div>
                <div class="description text-left">
                  <!-- {$loggedInUser.town}, {$loggedInUser.state} -->
                </div>
              </div>
            {/if}
          </div>
        </div>
        <div class="right">
          <Branches bind:filter {transactions} bind:selected={selectedBranch} {branches} bind:branchView />
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
              <!-- {getBusinessLineName(selectedBranch.businessLine)} -->
            </div>
          </div>
          <div class="divider-hor" />
          <div class="element">
            <div class="title">Responsable Sucursal</div>
            <div class="description text-left">
              <Icons name={"user-fill"} width="24" height="24" />
              <!-- {selectedBranch.manager.name} -->
              <!-- {selectedBranch.manager.firstLastName} -->
            </div>
            <div class="description text-left">
              <Icons name={"phone"} width="24" height="24" />
              <!-- {selectedBranch.manager.phone} -->
            </div>
            <div class="description text-left">
              <Icons name={"mail"} width="24" height="24" />
              <!-- {selectedBranch.manager.email} -->
            </div>
          </div>
          <div class="element">
            <div class="title">Domicilio Sucursal</div>
            <div class="description text-left">
              <!-- {selectedBranch.address.street} -->
              <!-- {selectedBranch.address.outsideNumber} -->
            </div>
            <div class="description text-left">
              <!-- {selectedBranch.address.suburb} -->
              <!-- {selectedBranch.address.zipCode} -->
            </div>
            <div class="description text-left">
              <!-- {selectedBranch.address.town}, {selectedBranch.address.state} -->
            </div>
          </div>
        </div>
        <div class="right">
          <Branches {filter} {transactions} bind:selected={selectedBranch} {branches} bind:branchView />
        </div>
      {/if}
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

  .element {
    &.rates {
      display: grid;
      gap: 1rem;
    }
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
    gap: 1rem;
  }

  .left {
    // min-width: 17.5rem; /* 280px */
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
