<script>
  import { loggedInUser } from '$lib/stores';
  import Icons from "$lib/components/Icons.svelte";
  import Input from "$lib/components/Input.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import EditProfile from "$lib/components/EditProfile.svelte";
  import { terminate } from "firebase/firestore";
  let date = new Date;
  let optionSelected = 0;
  let submenu = 0;
  let rollsQty = 0;
  let modalSupport;
  let detailTicketView = false;
  let selectedTicket = {};
  let terminals = {
    pocket:0,
    smart:0,
    master:0,
  }
  let supportDetails = {
    user: $loggedInUser.uid,
    description: "",
  }

  let userDetails = $loggedInUser

  let innerWidth=0, innerHeight=0;
  const getMonthName = (month) => {
    const monthsArray = {
      0: {value: "Enero"},
      1: {value: "Febrero"},
      2: {value: "Marzo"},
      3: {value: "Abril"},
      4: {value: "Mayo"},
      5: {value: "Junio"},
      6: {value: "Julio"},
      7: {value: "Agosto"},
      8: {value: "Septiembre"},
      9: {value: "Octubre"},
      10: {value: "Noviembre"},
      11: {value: "Diciembre"},
      "01": {value: "Enero"},
      "02": {value: "Febrero"},
      "03": {value: "Marzo"},
      "04": {value: "Abril"},
      "05": {value: "Mayo"},
      "06": {value: "Junio"},
      "07": {value: "Julio"},
      "08": {value: "Agosto"},
      "09": {value: "Septiembre"},
      "10": {value: "Octubre"},
      "11": {value: "Noviembre"},
      "12": {value: "Diciembre"},
    }
    return monthsArray[month].value
  }

  let tickets = [
    {id: 1, description: "Problema con terminal Problema con terminal en la sucursal Matriz, se traba al abrir la aplicación", status: "Pendiente"},
    {id: 2, description: "Revisión de terminal en sucursal Vallarta", status: "Pendiente"},
  ]

  const requestRolls = () => {
    optionSelected = 0, submenu = 0, rollsQty = 0;
  }
  const requestTerminals = () => {
    optionSelected = 0, submenu = 0;
    terminals = {pocket:0,smart:0,master:0}
  }
  const requestSupport = () => {
    console.log('Soporte')
  }
  const requestProfileUpdate = () => {
    console.log('Perfil')
  }

  const handleSupportRequest = () => {

  }

  const showModal = (option) => {
    option.show();
  }

  const closeModal = (option) => {  
    option.closeModal();
  }

  $: {
    // console.log($loggedInUser.state)
  }
</script>
<svelte:window bind:innerWidth bind:innerHeight />

<!-- MODAL SUPPORT -->
<Modal className={`modal-medium`} wrapperClass={"text-area-wrapper"} bind:this={modalSupport}>
  <div slot="header">
    <p>Solicitar Asistencia y Soporte</p>
  </div>
  <div slot="content">
    <div class="support">
      <div class="title">
        Describa su problema a continuación, o comuníquese al 800 12341 5672 para una atención personalizada
      </div>
      <div class="description">
        <p></p>
      </div>
    </div>
    <div class="support-description">
      <TextArea bind:value={supportDetails.description} label="Descripción" placeholder="¿Qué problema hay con esta transacción?" id="supportDescription" name="supportDescription"/>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input on:click={closeModal(modalSupport)} label="Cerrar" id="buttonCloseModalSupport" type="button" className="btn-plain" icon=""/>
    <Input 
      on:click={closeModal(modalSupport)} 
      on:click={() => handleSupportRequest()} 
      label="Enviar Solicitud" 
      id="buttonSaveModalSupport" 
      type="button" 
      className={`
        ${
          supportDetails.description != "" 
          ? "btn" : "btn-plain disabled"
        }`
      } 
      icon=""
    />
  </div>
</Modal>

<div class="content">
  <div class="container">
    <div class="date">
      <p>
        {date.getDate()} de {getMonthName(date.getMonth())} del {date.getFullYear()}
      </p>
    </div>
    <div class="card-container container">
      <div class="{innerWidth <= 540 ? "col" : "row"}" >
        <div class="element" class:hidden={optionSelected !== 0 && optionSelected !== 1}>
          <i class="arrow-blue" class:hidden={optionSelected == 0}
            on:click={() => (optionSelected = 0)}
            on:keypress={(e) => e.key === 'Enter' ? optionSelected = 0 : ""}
            on:click={() => (submenu = 0)}
            on:keypress={(e) => e.key === 'Enter' ? submenu = 0 : ""}
          >
            <Icons name="arrow-bwd" width="24" height="24"/>
          </i>
          <div
            on:click={() => optionSelected = 1}
            on:keypress={(e) => e.key === 'Enter' ? () => optionSelected = 1 : ""} 
            class={`option-col ${optionSelected === 1 ? "option-selected" :""}`}>
            <i>
              <Icons name="detailed-terminal" width="100" height="100"/>
            </i>
            <div class="option-name">
              Terminales
            </div>
          </div>
        </div>
        <div class="{innerWidth <= 540 ? "divider-hor":"divider-vert"}" class:hidden={optionSelected > 0}></div>
        <div class="element" class:hidden={optionSelected !== 0 && optionSelected !== 2}>
          <i class="arrow-blue" class:hidden={optionSelected == 0}
            on:click={() => (optionSelected = 0)}
            on:keypress={(e) => e.key === 'Enter' ? optionSelected = 0 : ""}
          >
            <Icons name="arrow-bwd" width="24" height="24"/>
          </i>
          <div
            on:click={showModal(modalSupport)}
            on:keypress={(e) => e.key === 'Enter' ? showModal(modalSupport) : ""} 
            class={`option-col ${optionSelected === 2 ? "option-selected" :""}`}>
            <i>
              <Icons name="detailed-support" width="100" height="100"/>
            </i>
            <div class="option-name">
              Asistencia y Soporte
            </div>
          </div>
        </div>
        <div class="{innerWidth <= 540 ? "divider-hor":"divider-vert"}" class:hidden={optionSelected > 0}></div>
        <div class="element" class:hidden={optionSelected !== 0 && optionSelected !== 3}>
          <!-- <i class="arrow-blue" class:hidden={optionSelected == 0}
            on:click={() => (optionSelected = 0)}
            on:keypress={(e) => e.key === 'Enter' ? optionSelected = 0 : ""}
          >
            <Icons name="arrow-bwd" width="24" height="24"/>
          </i> -->
          <div
            on:click={() => optionSelected = 3}
            on:keypress={(e) => e.key === 'Enter' ? () => optionSelected = 3 : ""}
            class={`option-col ${optionSelected === 3 ? "option-selected" :""}`}>
            <i>
              <Icons name="detailed-user" width="100" height="100"/>
            </i>
            <div class="option-name">
              Cambios Perfil
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-container container" class:hidden={optionSelected !== 1}>
      <div class="col">
        <div class="element" class:hidden={submenu !== 0 && submenu !== 1}>
          <i class="arrow-blue" class:hidden={submenu == 0}
            on:click={() => (submenu = 0)}
            on:keypress={(e) => e.key === 'Enter' ? submenu = 0 : ""}
          >
            <Icons name="arrow-bwd" width="24" height="24"/>
          </i>
          <div
            on:click={() => submenu = 1}
            on:keypress={(e) => e.key === 'Enter' ? () => submenu = 1 : ""} 
            class={`option-row ${submenu === 1 ? "option-selected" :""}`}>
            <i>
              <Icons name="roll" width="50" height="50"/>
            </i>
            <div class="option-name">
              Rollos para Impresora
            </div>
          </div>
        </div>
        <div class="divider-hor" class:hidden={submenu > 1}></div>
        <div class="element" class:hidden={submenu != 1}>
          <div class={innerWidth <= 540 ? "col":"row"}>
            <Input placeholder="" label="Cantidad" id="rollsQty" bind:value={rollsQty} className="txt-field-slim normal fill-blue" type="number"/>
            <div class="button">
              <Input
                on:click={requestRolls} 
                label="Solicitar" 
                id="buttonRollsQty" 
                type="button" 
                className={`
                  ${
                    rollsQty > 0 
                    ? "btn" : "btn-plain disabled"
                  }`
                } 
                icon=""
              />
            </div>
          </div>
        </div>
        <div class="element" class:hidden={submenu !== 0 && submenu !== 2}>
          <i class="arrow-blue" class:hidden={submenu == 0}
          on:click={() => (submenu = 0)}
          on:keypress={(e) => e.key === 'Enter' ? submenu = 0 : ""}
          >
            <Icons name="arrow-bwd" width="24" height="24"/>
          </i>
          <div
            on:click={() => submenu = 2}
            on:keypress={(e) => e.key === 'Enter' ? () => submenu = 1 : ""} 
            class={`option-row ${submenu === 2 ? "option-selected" :""}`}>
            <i>
              <Icons name="detailed-terminal" width="50" height="50"/>
            </i>
            <div class="option-name">
              Terminales
            </div>
          </div>
        </div>
        <div class="divider-hor" class:hidden={submenu !== 2}></div>
        <div class="element" class:hidden={submenu != 2}>
          <div class="col">
            <div class={innerWidth <= 540 ? "grid-row":"grid-col"}>
              <Input placeholder="" label="Pocket" id="PocketTerminalQty" bind:value={terminals.pocket} className="txt-field-horizontal normal blue" type="number"/>
              <Input placeholder="" label="Smart" id="SmartTerminalQty" bind:value={terminals.smart} className="txt-field-horizontal normal blue" type="number"/>
              <Input placeholder="" label="Master" id="MasterTerminalQty" bind:value={terminals.master} className="txt-field-horizontal normal blue" type="number"/>
            </div>
            <div class="button">
              <Input
                on:click={requestTerminals} 
                label="Solicitar" 
                id="buttonRollsQty" 
                type="button" 
                className={`
                  ${
                    terminals.pocket > 0 || terminals.smart > 0 || terminals.master > 0 
                    ? "btn" : "btn-plain disabled"
                  }`
                } 
                icon=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class:hidden={optionSelected != 3}>
      <EditProfile bind:optionSelected bind:userDetails/>
    </div>
    <div class="tickets-list" class:hidden={optionSelected !== 0}>
      {#if !detailTicketView}
        {#each tickets as ticket}
          <div class="ticket card-container clickable"
            on:click={() => selectedTicket = ticket}
            on:keypress={(e) => e.key === 'Enter' ? () => selectedTicket = ticket : ""} 
            on:click={() => detailTicketView = true}
            on:keypress={(e) => e.key === 'Enter' ? () => detailTicketView = true : ""} 
          >
            <div class="row">
              <div class="element">
                <div class="item">Ticket</div>
                <div class="item">{ticket.id}</div>
              </div>
              <div class="element">
                <div class="item">Estado</div>
                <div class="item">{ticket.status}</div>
              </div>
              <div class="element">
                <i class="arrow arrow-blue">
                  <Icons name="arrow-fwd" width="24" height="24"/>
                </i>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="ticket col card-container">
          <div class="row">
            <div class="element"
              on:click={() => detailTicketView = false}
              on:keypress={(e) => e.key === 'Enter' ? () => detailTicketView = false : ""}
            >
              <i class="arrow arrow-blue">
                <Icons name="arrow-bwd" width="24" height="24"/>
              </i>
            </div>
            <div class="element">
              <div class="item">Ticket</div>
              <div class="item">{selectedTicket.id}</div>
            </div>
            <div class="element">
              <div class="item">Estado</div>
              <div class="item">{selectedTicket.status}</div>
            </div>
          </div>
          <div class="row">
            <div class="element card-inside">
              <div class="description">{selectedTicket.description}</div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .content {
    width: 100%;
  }

  .content > .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .content * .container {
    /* width: 50%; */
  }

  .date p {
    margin: 2rem 0 0 0;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.25rem;/* 20px */
    text-align: center;
    /* Text */
    color: #113A62;
  }

  .row {
    display: flex;
    gap: 1rem; /* 16px */
    padding: 2rem 1rem;
    margin: 0rem 0rem 0rem 0rem;
  }

  .row > .button {
    display: grid;
    grid-auto-flow: row;
    color: #8C9FB1;
    height: 2.5rem;/* 40px */
    min-width: 10rem;/* 200px */
    align-self: self-end;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem; /* 16px */
    padding: 2rem 1rem;
    margin: 0rem 0rem 0rem 0rem;
  }

  .col  > .button {
    display: grid;
    grid-auto-flow: row;
    color: #8C9FB1;
    height: 2.5rem;/* 40px */
    min-width: 10rem;/* 200px */
    align-self: center;
  }

  .divider-vert {
    height: auto;
    width: .5rem;
    background: linear-gradient(138.32deg, rgba(0, 0, 0, 0.5) 8.26%, rgba(255, 255, 255, 0.5) 91.02%), #EAECF0;
    background-blend-mode: soft-light, normal;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: inset -1px -1px 2px #FAFBFF, inset 1px 1px 2px #A6ABBD;
    border-radius: 5px;
  }
  .divider-hor {
    width: auto;
    height: .5rem;
    background: linear-gradient(138.32deg, rgba(0, 0, 0, 0.5) 8.26%, rgba(255, 255, 255, 0.5) 91.02%), #EAECF0;
    background-blend-mode: soft-light, normal;
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: inset -1px -1px 2px #FAFBFF, inset 1px 1px 2px #A6ABBD;
    border-radius: 5px;
  }

  .element > .option-col {
    display: grid;
    grid-auto-flow: row;
    color: #113A62;
    transition: all .4s ease;
    cursor: pointer;
  }

  .element > .option-row {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    color: #113A62;
    transition: all .4s ease;
    cursor: pointer;
  }
  
  .element > .button {
    display: grid;
    grid-auto-flow: row;
    color: #8C9FB1;
    height: 2.5rem;/* 40px */
    width: 12.5rem;/* 200px */
  }
  
  .option-col > i {
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
  }
  .option-col > .option-name {
    font-weight: 700;
    font-size: 1.5rem;/* 24px */
    line-height: 1.25rem;/* 20px */
    text-align: center;
  }
  .option-row > i {
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
  }
  .option-row > .option-name {
    font-weight: 700;
    font-size: 1.5rem;/* 24px */
    line-height: 1.25rem;/* 20px */
  }

  .grid-row {
    display: grid;
    grid-auto-flow: row;
    gap: 1rem;
  }
  .grid-col {
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
  }

  .support {
    display: flex;
    flex-direction: column;
    width: 100%;
    /* TEXT */
    text-align: center;
    font-weight: 700;
    line-height: 1.25rem;/* 20px */
    color: #113A62;
  }
  .support .title {
    font-size: 1rem;/* 16px */
  }
  .support .description {
    font-size: 1.5rem;/* 16px */
  }
  .support-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* width: 50%; */
  }

  .modal-buttons{
    width: 70%;
    height: 2.5rem;/* 40px */
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
  }

  .ticket {
    min-width: 20rem;
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    text-align: center;
    margin: 1rem;
  }
  .ticket > .row {
    display: flex;
    justify-content: space-between;
    padding: 0;
  }
  .ticket * .element {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 700;
    line-height: 1.25rem;/* 20px */
    color: #113A62;
  }
  .ticket * .description {
    margin: .5rem;
    min-height: 2rem;
    text-align: left;
  }
  
  .element.card-inside {
    width: 100%;
    
  }
  .hidden {
    display: none;
  }

  .clickable {
    cursor: pointer;
  }
</style>