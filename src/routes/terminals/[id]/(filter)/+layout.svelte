<script>
  /* stores */
  import { isLoggedIn, loggedInUser, previousPage } from "$lib/stores";
  /* components */
  import LayoutTransactions from "$lib/components/terminals/transactions/Layout.svelte";
  /* components */
  import DateTitle from "$lib/components/DateTitle.svelte";

  export let data;
  let terminal = data?.terminal;
</script>

<div class="container">
  <DateTitle />
  <div class="card-primary padding-2">
    <div class="content">
      <div class="left">
        <div class="card-secondary card col padding-1">
          <!-- <div class="element">
            <div class="avatar-container">
              <div class="avatar">
                <img class="avatar-img" alt="imagen" src={$loggedInUser.avatar ? $loggedInUser.avatar : noUser} />
              </div>
            </div>
          </div> -->
          <!-- <div class="element">
            <div class="title-blue">
              <div class="trigger">
                <label for="nameModalTrigger">Ingresa tu Nombre</label>
                <input id="nameModalTrigger" type="button" on:click={openModal(modalName)} on:click={()=>$toastId="modalName"}/>
              </div>
            </div>
            <div class="description text-center">
              {getBusinessLineName(user.businessLine) ?? ""}
            </div>
          </div> -->
          <div class="element rates">
            <div class="title">Datos Generales</div>
            <div class="row">
              <div class="element">
                <div class="title-blue">Nombre</div>
                <div class="description text-left">
                  {terminal?.name ?? "N/A"}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="element">
                <div class="title-blue">Sucursal</div>
                <div class="description text-left">
                  {terminal?.branch ?? "N/A"}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="element">
                <div class="title-blue">Responsable</div>
                <div class="description text-left">
                  {terminal?.responsible ?? "N/A"}
                </div>
              </div>
            </div>
          </div>
          <div class="divider-hor" />
          <div class="element rates">
            <div class="title">Datos Relevantes</div>
            <div class="row">
              <div class="element">
                <div class="title-blue">ID</div>
                <div class="description text-left">
                  {terminal.id}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="element">
                <div class="title-blue">No. de Serie</div>
                <div class="description text-left">
                  {terminal.serial ?? "N/A"}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="element">
                <div class="title-blue">Tipo de Terminal</div>
                <div class="description text-left">
                  {terminal.type ?? "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <LayoutTransactions user={$loggedInUser} {data}>
          <slot />
        </LayoutTransactions>
        <!-- <Branches bind:filter {transactions} bind:selected={selectedBranch} {branches} bind:branchView /> -->
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  /* ========================================== */

  .card {
    min-width: 100%;
  }
  .trigger {
    label {
      cursor: pointer;
    }
    input {
      display: none;
    }
  }

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
    min-width: fit-content;
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
    text-align: left;
    color: $primary-dark;
    margin: 0rem 0rem 0.5rem 0rem;
  }
  .description {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    text-align: left;
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

  .modal-buttons {
    width: 70%;
    height: 2.5rem; /* 40px */
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
  }

  /* Dark Mode */
  :global(body.dark-mode) {
    .avatar {
      background-color: $dark;
    }
    .title-blue,
    .description {
      color: $font-dark-primary;
    }
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
