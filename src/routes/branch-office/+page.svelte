<script>
  import { loggedInUser } from '$lib/stores';
  import RedirectHome from '$lib/components/RedirectHome.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import { onMount } from 'svelte';
  import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
  } from 'firebase/firestore';
  import { db } from "$lib/firebase";


  let menuAddBranch = false;
  let dispersions = [];
  let date = new Date;
  let terminalId = "";
  let unassignedTerminals = [];
  let assignedTerminals = [];

  let newBranch = {
    name: "",
    address: "",
    exteriorNumber: "",
    interiorNumber: "",
    terminals: []
  }

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
    }
    return monthsArray[month].value
  }

  const handleAddNewBranchOffice = async() => {
    const branches = newBranch
    await updateDoc(doc(db, "users-client", $loggedInUser.uid), {branches: arrayUnion(newBranch)})
    .then(async() => {
      const docRef = doc(db, "users-client", $loggedInUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      try {
          const user = docSnap.data()
          console.log({user})
          loggedInUser.set(user);
          menuAddBranch = false;
          newBranch = {
            name: "",
            address: "",
            exteriorNumber: "",
            interiorNumber: "",
            terminals: []
          }
          //sessionStorage.setItem("userData", user);
        } catch (error) {
          throw new Error(error);
        }
      }
    })
    .catch((err) => {
      throw new Error(err)
    })
  }

  onMount(async() => {
    /* if($loggedInUser.branches?.length != 0){
      $loggedInUser.terminals.forEach(element => {
        unassignedTerminals.push({value: element.serialNumber, name: `${element.name} (No. de Serie ${element.serialNumber})`})
      });
    } */
	});
</script>

{#if $loggedInUser.accountType === "3"}
<div class="dispersions">
  <div class="top">
    <div class="top__left">
      <div class="page-title">
        <p>Sucursales</p>
      </div>
    </div>
    <div class="top__middle">
      <div class="date">
        <p>
          {date.getDate()} de {getMonthName(date.getMonth())} del {date.getFullYear()}
        </p>
      </div>
      <!-- <ButtonGroup bind:active={active} options={buttonGroupOptions}/> -->
      <div class="card-group">
        <div class="card">
          <div><p>Sucursales</p></div>
          <div><span>{$loggedInUser.branches?.length || 0}</span></div>
        </div>
      </div>
    </div>
    <div class="top__right">
      <div class="buttons">
        <div class="element">
          {#if menuAddBranch}
            <Input on:click={() => (menuAddBranch = false)} label="Regresar" id="newBranchReturnButton" type="button" className="btn-plain" icon=""/>
          {:else}
            <Input on:click={() => (menuAddBranch = true)} label="Agregar Sucursal" id="addNewBranchButton" type="button" className="btn-plain" icon=""/>
          {/if}
        </div>
      </div>
    </div>
  </div>
  {#if !menuAddBranch}
    {#if $loggedInUser.branches?.length > 0}
      <div class="branch-tables">
        <div id="pdfTable" class="table-container">
          <table class="table-content">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Número Exterior</th>
                <th>Número Interior</th>
              </tr>
            </thead>
            <tbody>
              {#each $loggedInUser.branches as branch}
              <!-- on:click={() => (branchDetailView = true)}
              on:keypress={(e) => e.key === 'Enter' ? branchDetailView = true : ""}  -->
                <tr class="clickable-table-row"
                >
                  <td>{branch.name}</td>
                  <td>{branch.address}</td>
                  <td>{branch.exteriorNumber}</td>
                  <td>{branch.interiorNumber}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:else}
      <div class="message">
        No has agregado ninguna sucursal
      </div>
    {/if}
  {:else}
  <div class="form-container">
    <div class="form-add-branch">
      <div class="section">
        <Input 
          placeholder="Nombre de la Sucursal" 
          label="Nombre" 
          id="name" 
          bind:value={newBranch.name} 
          className={"txt-field-slim normal"} 
          type="text"
        />
      </div>
      <div class="section">
        <Input 
          placeholder="Dirección" 
          label="Dirección" 
          id="address" 
          bind:value={newBranch.address} 
          className={"txt-field-slim normal"} 
          type="text"
        />
      </div>
      <div class="section">
        <Input 
          placeholder="Número Exterior" 
          label="Número Exterior" 
          id="exteriorNumber" 
          bind:value={newBranch.exteriorNumber} 
          className={"txt-field-slim normal"} 
          type="text"
        />
        <Input 
          placeholder="Número Interior" 
          label="Número Interior" 
          id="interiorNumber" 
          bind:value={newBranch.interiorNumber} 
          className={"txt-field-slim normal"} 
          type="text"
        />
      </div>
      <!-- <div class="section">
        <Select bind:value={terminalId} label="Asignar Terminal" defaultText={"Elige una opción"} bind:optionsList={unassignedTerminals}/>
      </div> -->
      <div class="buttons">
        <Input 
          on:click={handleAddNewBranchOffice} 
          label="Agregar Sucursal" 
          id="newBranchAddButton" 
          type="button" 
          className="btn-plain {
            newBranch.name != "" &&
            newBranch.address != "" &&
            newBranch.exteriorNumber != "" ?
           "" : "disabled"
           }" 
          icon=""/>
      </div>
    </div>
  </div>
  {/if}
</div>
{:else}
<RedirectHome/>
{/if}

<style>
  
  .dispersions {
    /* display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: right; */
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }
  
  .dispersions .message {
    font-weight: 600;
    font-size: 1.5rem;/* 24px */
    line-height: 1.25rem;/* 20px */
    /* identical to box height, or 62% */
    display: flex;
    align-items: center;
    justify-content: center;
    /* Text */
    color: #113A62;
  }
  
  .top {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 2.5rem;
  }

  .top__left .page-title p{
    font-weight: 700;
    font-size: 32px;
    line-height: 20px;
    /* identical to box height, or 62% */
    display: flex;
    align-items: center;
    /* Text */
    color: #113A62;
  }

  .top__left .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .top__left .buttons .element {
    height: 2.5rem;/* 40px */
  }

  .top__middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .top__middle .date p {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.25rem;/* 20px */
    text-align: center;
    /* Text */
    color: #113A62;
  }
  
  .top__right {
    width: 15rem;/* 240px */
    padding: 1rem 0rem;
    display: flex;
  }
  .top__right .buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: -webkit-fill-available;
  }

  .top__right .buttons .element {
    height: 2.5rem;/* 40px */
  }

  .card-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    padding: 0px;
    gap: 24px;
    width: 610px;
    height: 88px;
    /* Inside auto layout */
    flex: none;
    order: 2;
    flex-grow: 0;
  }

  .card-group .card{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    gap: 16px;
    width: 166px;
    height: 88px;
    /* Nue Fill */
    background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
    /* out */
    box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
  }
  
  .card-group .card p {
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    /* text-placeholder */
    color: #8C9FB1;
  }

  .card-group .card span {
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 20px;
    text-align: center;
    /* Text */
    color: #113A62;
  }

  .form-container {
    display: flex;
    width: -webkit-fill-available;
    justify-content: center;
  }

  .form-container .form-add-branch {
    /* width: 80%; */
    padding: 3.75rem;/* 60px */
    gap: 32px;
    background: #F3F3F3;
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
  }

  .form-container .form-add-branch .section {
    gap: 1rem;
    display: grid;
    grid-auto-flow: column;
  }
  .form-container .form-add-branch .buttons {
    display: flex;
    justify-content: center;
    height: 2.5rem;/* 40px */
    gap: 1rem;
    margin: 1.5rem 0rem;
  }

  .dispersions-view {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .branch-search-bar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }

  .clarifications-select {
    display: flex;
    width: 50%;
  }
  .clarification-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* width: 50%; */
  }

  /* STYLES IMMEDIATE DEPOSIT MODAL */
  .immediate-deposit {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 1rem;
  }
  .immediate-deposit .row-element {
    display: flex;
  }
  .immediate-deposit .column-element {
    display: flex;
    flex-direction: column;
  }
  .immediate-deposit .column-element .blue-title{
    display: flex;
    align-self: center;
    font-weight: 700;
    font-size: 0.8125rem;/* 13px */
    line-height: 1.25rem;/* 20px */
    color: #113A62;
  }
  .immediate-deposit .column-element .gray-title{
    display: flex;
    align-self: center;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.25rem;/* 20px */
    color: #8C9FB1;
  }
  .immediate-deposit .column-element .content{
    display: flex;
    align-self: center;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.25rem;/* 20px */
    color: #113A62;
  }

  .immediate-deposit .terms {
    display: flex;
    flex-direction: row;
    height: 5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: 700;
    font-size: .8125rem;
    line-height: 1.25;
    display: flex;
    align-items: center;
    color: #8B9EB0;
  }

  .immediate-deposit .terms a {
    text-decoration: none;
    color: #5585FF;
  }

  .immediate-deposit .terms-checkbox {
    height: 100%;
    margin-right: .4375rem;
    display: flex;
    align-items: start;
  }
  /* -------------------------------------------- */

  .date-range-input {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .export-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0rem;
  }
  .not-found {
    display: flex;
    justify-content: center;
  }
  .not-found b {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.25rem;/* 20px */
    text-align: center;
    /* Text */
    color: #113A62;
  }
  .branch-tables {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .table-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .table-content {
    /* width: 46.875rem; */
    width: 70%;
    /* border-bottom: 1px solid; */
    border-collapse: collapse;
    padding: 1rem 1rem;
  }

  .table-content .clickable-table-row {
    cursor: pointer;
  }
  
  .table-content thead {
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    text-align: left;
    /* text-placeholder */
    color: #8C9FB1;
    height: 2.375rem;
  }

  .table-content td {
    font-family: 'Raleway';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #000000;
    text-align: center;
    border-bottom: 1px solid #8C9FB1;
    padding: .5rem .5rem;
    text-align: left;
  }

  .modal-buttons{
    width: 70%;
    height: 2.5rem;/* 40px */
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
  }

  .branch-details {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .details__top {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .details__top b{
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.25rem;
    color: #113A62;
  }
  .details__top p{
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.25rem;
    color: #8C9FB1;
  }

  .details__middle {
    width: 100%;
    display: flex;
    gap: 2rem;
    justify-content: space-evenly;
  }

  .details__middle .details-left .title {
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.125rem;
    color: #113A62;
  }

  .details__middle .details-left .item b {
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }
  .details__middle .details-left .item p {
    font-style: normal;
    font-weight: 700;
    font-size: .875rem;/* 14px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }

  .details__middle .details-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;/* 16px */
    gap: 2rem;/* 32px */
    width: 26.75rem;/* 428px */
    height: 13.125rem;/* 210px */
    /* Fill Container */
    background: #F3F3F3;
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;
  }

  .details__middle .details-center .details-card .details-card__top b{
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
  }
  .details__middle .details-center .details-card .details-card__middle{
    display: flex;
    flex-direction: row;
    gap: 2rem;
  }
  .details__middle .details-center .details-card .details-card__middle .item b{
    display: flex;
    justify-content: center;
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
  }

  .details__middle .details-center .details-card .details-card__middle .item p{
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem;/* 20px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
  }
  .details__middle .details-center .details-card .details-card__bottom{
    display: flex;
    flex-direction: row;
    gap: .5rem;
    width: -webkit-fill-available;
    justify-content: space-evenly;
  }
  .details__middle .details-center .details-card .details-card__bottom .item b{
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: 1.125rem;/* 18px */
    color: #8C9FB1;
  }

  .details__middle .details-center .details-card .details-card__bottom .item p{
    font-style: normal;
    font-weight: 700;
    font-size: .875rem;/* 14px */
    line-height: 1.125rem;/* 18px */
    color: #113A62;
    text-align: center;
  }

  .details__middle .details-center .details-card .details-card__bottom .item span{
    display: flex; 
    justify-content: center;
    font-style: normal;
    font-weight: 500;
    font-size: .625rem;/* 10px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }

  .details__middle .details-center .card-buttons {
    width: 100%;
    height: 2.5rem;/* 40px */
    display: flex;
    margin-top: 2rem;
    gap: 1rem;/* 16px */
    justify-content: center;
  }
  .details__middle .details-center .card-buttons .clarification-button {
    display: flex;
    width: 6rem; /* 80px */
  }
  .details__middle .details-center .card-buttons .email-button {
    display: flex;
    width: 7.5rem; /* 120px */
  }
  .details__middle .details-center .card-buttons .print-button {
    display: flex;
    width: 7.5rem; /* 120px */
  }

  .details__middle .details-right .title {
    display: flex;
    justify-content: center;
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.125rem;
    color: #113A62;
  }

  .details__middle .details-right .item b {
    font-style: normal;
    font-weight: 500;
    font-size: .8125rem;/* 13px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }
  .details__middle .details-right .item p {
    font-style: normal;
    font-weight: 700;
    font-size: .875rem;/* 14px */
    line-height: .875rem;/* 14px */
    color: #8C9FB1;
  }/* 
  .details-footer {
    margin: 1rem 0rem;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .details-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  } */
</style>