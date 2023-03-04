<script>
  import Icons from "$lib/components/Icons.svelte";
  import Input from "$lib/components/Input.svelte";
  import { terminate } from "firebase/firestore";
  let date = new Date;
  let optionSelected = 0;
  let submenu = 0;
  let rollsQty = 0;
  let terminals = {
    pocket:0,
    smart:0,
    master:0,
  }
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

  /* $: {
    console.log(optionSelected)
  } */
</script>
<svelte:window bind:innerWidth bind:innerHeight />
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
            on:click={requestSupport}
            on:keypress={(e) => e.key === 'Enter' ? requestSupport : ""} 
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
          <i class="arrow-blue" class:hidden={optionSelected == 0}
            on:click={() => (optionSelected = 0)}
            on:keypress={(e) => e.key === 'Enter' ? optionSelected = 0 : ""}
          >
            <Icons name="arrow-bwd" width="24" height="24"/>
          </i>
          <div
            on:click={requestProfileUpdate}
            on:keypress={(e) => e.key === 'Enter' ? requestProfileUpdate : ""}
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
    <div class="card-container container">
      <div class="col" class:hidden={optionSelected == 0}>
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

  .hidden {
    display: none;
  }
</style>