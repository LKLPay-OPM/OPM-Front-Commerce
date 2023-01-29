<script>
  import { isLoggedIn, loggedInUser, onboardingSuccess } from '$lib/stores';
  import { updateUserInfo, updateUserAvatar, updateUserIne } from '$lib/hooks/updates.js'
  import { onMount } from 'svelte';
  import Select from '$lib/components/Select.svelte';
	import Input from '$lib/components/Input.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import SuccessLogo from '$lib/components/Success.svelte';
	import noUser from '$lib/assets/no_user.png';
	import Logo from '$lib/assets/Logo.png';
  import townsData from '$lib/assets/municipios.json';

  let all = townsData;
  let states = Object.keys(townsData);
  let selectedState;
  let statesArray = [];
  let townsArray = [];
  let towns;
  let success = false;
  let menu = 1;
  let ineFront = "", ineBack = "";

  let userData = {
		uid: $loggedInUser.uid,
		name: "",
		firstLastName: "",
		secondLastName: "",
		curp: "",
    rfc: "",
		accountType: "",
		businessName: "",
		businessLine: "",
		businessAddress: "",
		outsideNumber: "",
		insideNumber: "",
		zipCode: "",
		state: "Aguascalientes",
		town: "",
		suburb: "",
		avatar: "",
		phone: "",
		firstTimeUser: false,
    bankAccountInfo: {
      clabe: "",
      ineFront: "",
      ineBack: ""
    }
	}

  $: {
    townsArray = [];
    townsData[userData.state].map(function(key, index) {
      townsArray.push({name: key, value: key})
      // console.log(townsData[key]);
    });
  }

  let accountTypeOptions = [
    {
      value: "1",
      name: "LklPay"
    },
    {
      value: "2",
      name: "LklPay Pro"
    },
    {
      value: "3",
      name: "LklPay Master"
    },
    {
      value: "4",
      name: "LklPay E-Commerce"
    }
  ]

	let businessLineOptions = [
    {value: "travelAgency", name: "Agencias de Viajes"},
    // {value: "aggregators", name: "Agregadoras"},
    {value: "insurers", name:"Aseguradoras"},
    {value: "charity", name:"Beneficencia"},
    {value: "collegeAndUniversities", name:"Colegios y Universidades"},
    {value: "fastFood", name:"Comida Rápida"},
    {value: "basicEducation", name: "Educación Básica"},
    {value: "entertainment", name: "Entretenimiento"},
    {value: "parkings", name: "Estacionamientos"},
    {value: "pharmacy", name: "Farmacias"},
    {value: "gasStations", name: "Gasolineras"},
    {value: "hospitals", name: "Hospitales"},
    {value: "hotels", name: "Hoteles"},
    {value: "doctorsAndDentists", name: "Doctores y Dentistas"},
    {value: "miscellaneous", name: "Miscelánea"},
    {value: "others", name: "Otros"},
    {value: "toll", name: "Peaje"},
    {value: "sparePartsAndHardwareStores", name: "Refacciones y Ferreterías"},
    {value: "carRental", name: "Renta de Autos"},
    {value: "restaurants", name: "Restaurantes"},
    {value: "beautySalons", name: "Salones de Belleza"},
    {value: "supermarkets", name: "Supermercados"},
    {value: "telecommunications", name: "Telecomunicaciones"},
    {value: "airTransport", name: "Transporte Aéreo"},
    {value: "landPassengerTransport", name: "Transaporte Terrestre de Pasajeros"}
  ]

  /* const getTypesNames = (type) => {
    // console.log(type)
    const names = {
      "travelAgency": {data: "Agencias de Viajes"},
      "aggregators": {data: "Agregadoras"},
      "insurers": {data:"Aseguradoras"},
      "charity": {data:"Beneficencia"},
      "collegeAndUniversities": {data:"Colegios y Universidades"},
      "fastFood": {data:"Comida Rápida"},
      "basicEducation": {data: "Educación Básica"},
      "entertainment": {data: "Entretenimiento"},
      "parkings": {data: "Estacionamientos"},
      "pharmacy": {data: "Farmacias"},
      "gasStations": {data: "Gasolineras"},
      "hospitals": {data: "Hospitales"},
      "hotels": {data: "Hoteles"},
      "doctorsAndDentists": {data: "Doctores y Dentistas"},
      "miscellaneous": {data: "Miscelánea"},
      "others": {data: "Otros"},
      "toll": {data: "Peaje"},
      "sparePartsAndHardwareStores": {data: "Refacciones y Ferreterías"},
      "carRental": {data: "Renta de Autos"},
      "restaurants": {data: "Restaurantes"},
      "beautySalons": {data: "Salones de Belleza"},
      "supermarkets": {data: "Supermercados"},
      "telecommunications": {data: "Telecomunicaciones"},
      "airTransport": {data: "Transporte Aéreo"},
      "landPassengerTransport": {data: "Transaporte Terrestre de Pasajeros"}
    }
    return names[type].data;
  } */

	

  const handleUpdateProfile = async() => {
		/* console.log(userData)
    userData = {
      uid: $loggedInUser.uid,
      name: "",
      lastName: "",
      curp: "",
      rfc: "",
      accountType: "",
      businessName: "",
      businessLine: "",
      businessAddress: "",
      outsideNumber: "",
      insideNumber: "",
      zipCode: "",
      state: "Aguascalientes",
      town: "",
      suburb: "",
      avatar: "",
      phone: "",
      firstTimeUser: false,
    } */
    if(ineFront != "" && ineBack != ""){
      const frontINE = document.getElementById('buttonIneFront').files[0]
      const backINE = document.getElementById('buttonIneBack').files[0]
      const ineFrontType = document.getElementById('buttonIneFront').files[0].type;
      const ineBackType = document.getElementById('buttonIneBack').files[0].type;
  
      userData.bankAccountInfo.ineFront = frontINE;
      userData.bankAccountInfo.ineFrontType = ineFrontType;
      userData.bankAccountInfo.ineBack = backINE;
      userData.bankAccountInfo.ineBackType = ineBackType;
    }
    if(userData.accountType === "1"){
      userData.businessLine = "aggregators"
    }
    // console.log(userData)
    await updateUserIne(userData)
    .then(() => {
      // $onboardingSuccess = true;
      userData = {
        uid: $loggedInUser.uid,
        name: "",
        firstLastName: "",
        secondLastName: "",
        curp: "",
        rfc: "",
        accountType: "",
        businessName: "",
        businessLine: "aggregators",
        businessAddress: "",
        outsideNumber: "",
        insideNumber: "",
        zipCode: "",
        state: "Aguascalientes",
        town: "",
        suburb: "",
        avatar: "",
        phone: "",
        firstTimeUser: false,
        bankAccountInfo: {
          clabe: "",
          ineFront,
          ineBack
        }
      }
    })
    .catch((error) => {
      throw new Error(error)
    })
	}

	const handleUpdateProfilePic = async() => {
    const uid = userData.uid;
    const picture = document.getElementById('file').files[0]
    const fileType = document.getElementById('file').files[0].type;

    let profileData = {};
    profileData.uid = uid;
    profileData.avatar = picture;
    profileData.fileType = fileType;
    // await updateUserAvatar(profileData)
    // console.log(profileData)
    profileData = {};
  }

  
  onMount(() => {

    states.map(function(key, index) {
      statesArray.push({name: key, value: key})
      // console.log(townsData[key]);
    });
	});
</script>

<div class="onboarding-container">
  <div class="onboarding-content">
    {#if $onboardingSuccess}
      <div class="success-container">
        <div class="success-card">
          <div class="header">
            <div class="logo">
              <img src={Logo} alt="Logo LklPay">
            </div>
            <div class="title">
              <p>Estamos Listos</p>
            </div>
          </div>
          <div class="svg">
            <SuccessLogo/>
          </div>
          <div class="btn-layout">
            <div class="btn">
              <Input 
                label="Ir a mi Cuenta" 
                id="goToDashboardBtn" 
                type="button" 
                className="btn-success" 
                icon=""
                on:click={() => ($onboardingSuccess = false)}
                on:click={() => (menu = 1)}
              />
            </div>
          </div>
        </div>
      </div>
      {:else}
      <div class="card-container">
        <div 
          class={
            // userData.accountType === "1" && menu === 1 ||
            menu === 3
            ? "card" : "card-large"
          }
        >
          <div class="header">
            <div class="logo">
              <img src={Logo} alt="Logo LklPay">
            </div>
            <div class="title">
              <p>Bienvenido</p>
            </div>
            <div class="subtitle">
              <p>
                Para verificar que realmente eres tú quien utilizará tu cuenta y brindarte la mejor seguridad,
                necesitamos los siguientes datos personales, siempre protegidos bajo nuestra <a href="/home#privacy">Política de Privacidad</a>
              </p>
            </div>
          </div>
          {#if menu == 1}
            <div 
              class={
                userData.accountType === "1" ||
                userData.accountType === "2"
                ? "form" : "form"
              }
            >
              <div class="title">
                <p>Iniciemos con lo básico</p>
              </div>
              <div class="inputs">
                <div class="select">
                  <div class="element">
                    <Select bind:value={userData.accountType} label="Tipo de cuenta" defaultText={"Elige una opción"} bind:optionsList={accountTypeOptions}/>
                  </div>
                </div>
                <Input placeholder="Ejemplo de Nombre" label="Nombre (s)" id="businessName" bind:value={userData.name} className="txt-field-slim normal" type="text"/>
                <div class="row">
                  <div class="element">
                    <Input placeholder="Apellido" label="Primer Apellido" id="firstLastName" bind:value={userData.firstLastName} className="txt-field-slim normal" type="text"/>
                  </div>
                  <div class="element">
                    <Input placeholder="Apellido" label="Segundo Apellido" id="secondLastName" bind:value={userData.secondLastName} className="txt-field-slim normal" type="text"/>
                  </div>
                </div>
                <div class="text">
                </div>
                {#if userData.accountType !== "1"}
                  <div class="select">
                    <div class="element">
                      <Select bind:value={userData.businessLine} label="Giro" defaultText={"Elige una opción"} bind:optionsList={businessLineOptions}/>                
                    </div>
                  </div>
                {/if}
                <Input placeholder="Nombre de tu Empresa" label="Nombre de tu Empresa" id="businessName" bind:value={userData.businessName} className="txt-field-slim normal" type="text"/>
                <div class="footer tooltip">
                  ¿Por qué te pedimos estos datos?
                  <span class="tooltiptext">¿Por qué te pedimos estos datos?</span>
                </div>
              </div>
              <div class="footer-buttons">
                <Input
                  on:click={() => (menu = 2)}
                  label="Siguiente" 
                  id="buttonMenuBasicInfo" 
                  type="button" 
                  className={` 
                    ${
                      userData.businessName != "" &&
                      userData.name != "" &&
                      userData.firstLastName != ""
                      ? "btn" : "btn-disabled"}
                  `} 
                  icon=""
                />
              </div>
            </div>
          {:else if menu == 2}
            <div 
              class={"form-address"}
            >
              <div class="title">
                <p>Cuéntanos dónde te ubicas</p>
              </div>
              <div class="inputs">
                <Input placeholder="Circunvalación Jorge Álvarez del Castillo" label="Calle" id="businessAddress" bind:value={userData.businessAddress} className="txt-field normal" type="text"/>
                <div class="row">
                  <Input placeholder="1106" label="N° Exterior" id="outsideNumber" bind:value={userData.outsideNumber} className="txt-field normal" type="text"/>
                  <Input placeholder="NA" label="N° Interior" id="insideNumber" bind:value={userData.insideNumber} className="txt-field normal" type="text"/>
                  <Input placeholder="44620" label="Código Postal" id="zipCode" bind:value={userData.zipCode} className="txt-field normal" type="text"/>
                </div>
                <div class="row">
                  <Select bind:value={userData.state} label="Estado" defaultText={"Elige una opción"} bind:optionsList={statesArray}/>
                  <Select bind:value={userData.town} label="Municipio" defaultText={"Elige una opción"} bind:optionsList={townsArray}/>
                </div>
                <Input placeholder="Chapultepec Country" label="Colonia" id="businessSuburb" bind:value={userData.suburb} className="txt-field normal" type="text"/>
                <div class="footer tooltip">
                  ¿Por qué te pedimos estos datos?
                  <span class="tooltiptext">¿Por qué te pedimos estos datos?</span>
                </div>
              </div>
              <div class="footer-buttons">
                <Input
                on:click={() => (menu = 3)}
                  label="Siguiente" 
                  id="buttonMenuAddress" 
                  type="button" 
                  className={` 
                    ${
                      userData.businessAddress != "" &&
                      userData.outsideNumber != "" &&
                      userData.zipCode != "" &&
                      userData.suburb != ""
                      ? "btn" : "btn-disabled"}
                  `} 
                  icon=""
                />
              </div>
            </div>
          {:else if menu == 3}
            <div 
              class={"form-rfc"}
            >
              <div class="title">
                <p>
                  Tenemos casi todos tus datos completos,<br>
                  solo necesitamos unos pocos datos más
                </p>
              </div>
              <div class="inputs">
                <div class="row">
                  {#if userData.accountType != "1"}
                    <Input placeholder="ASDF1234567T1" label="RFC" id="rfc" bind:value={userData.rfc} className="txt-field normal" type="text"/>
                  {/if}
                  <Input placeholder="014320605732769900" label="CLABE" id="businessCLABE" bind:value={userData.bankAccountInfo.clabe} className="txt-field normal" type="text"/>
                </div>
                <div class="row-title">
                  Credencial del INE
                </div>
                <div class="row buttons-ine">
                  <Input label="Frente" id="buttonIneFront" bind:value={ineFront} className="{ineFront != "" ? "btn-success" : "btn-plain"}" type="file" accept="image/*,.pdf"/>
                  <Input label="Vuelta" id="buttonIneBack" bind:value={ineBack} className="{ineBack != "" ? "btn-success" : "btn-plain"}" type="file" accept="image/*,.pdf"/>
                  
                </div>
                <div class="form-divider">
                  <!-- <Select bind:value={userData.state} label="Estado" defaultText={"Elige una opción"} bind:optionsList={statesArray}/> -->
                  <!-- <Select bind:value={userData.town} label="Municipio" defaultText={"Elige una opción"} bind:optionsList={townsArray}/> -->
                </div>
                <div class="footer tooltip">
                  ¿Por qué te pedimos estos datos?
                  <span class="tooltiptext">¿Por qué te pedimos estos datos?</span>
                </div>
              </div>
              <div class="footer-buttons">
                <Input
                  on:click={handleUpdateProfile}
                  label="Saltar" 
                  id="buttonSkipMenuRfc" 
                  type="button" 
                  className={`btn-plain`} 
                  icon=""
                />
                <Input
                  on:click={handleUpdateProfile}
                  label="Siguiente" 
                  id="buttonMenuRfc" 
                  type="button" 
                  className={` 
                    ${
                      userData.rfc != "" &&
                      userData.bankAccountInfo.clabe != "" &&
                      ineFront != "" &&
                      ineBack != ""
                      ? "btn-plain" : "btn-plain disabled"}
                  `} 
                  icon=""
                />
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
    <!-- <div class="avatar-container">
			<div class="avatar">
				<img class="avatar-img" alt="imagen" src="{$loggedInUser.avatar ? $loggedInUser.avatar : noUser}" />
				<label for="file">
					<input id="file" type="file" on:change={handleUpdateProfilePic} accept="image/jpeg, image/png"/>
					<div class="avatar-content">
						<span class="avatar-icon"><Icons name="camera-fill" width="24" height="24"/></span>
						<span class="avatar-text">Cambiar Foto</span>
					</div>
				</label>
			</div>
		</div>
    <Input label="Nombre(s)" id="name" bind:value={userData.name} className="txt-field normal" type="text"/>
    <Input label="Apellidos(s)" id="lastName" bind:value={userData.lastName} className="txt-field normal" type="text"/>
    
    
    
    <Input label="Estado" id="state" bind:value={userData.state} className="txt-field normal" type="text"/>
    <Input label="Municipio" id="town" bind:value={userData.town} className="txt-field normal" type="text"/>
    <Input label="Colonia" id="suburb" bind:value={userData.suburb} className="txt-field normal" type="text"/>
    <Input label="Teléfono" id="phone" bind:value={userData.phone} className="txt-field normal" type="text"/>
    <div class="footer-buttons">
      <Input  label="Cerrar" id="buttonCloseModalBankInfo" type="button" className="button" icon=""/>
      <Input
        on:click={() => handleUpdateProfile()}
        label="Guardar" 
        id="buttonSaveModalBankInfo" 
        type="button" 
        className={`button 
          ${
            ""
          }`
        } 
        icon=""
      />
    </div> -->
  </div>
</div>

<style>

  .onboarding-container {
    width: 100%;
  }
  
  .onboarding-content {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .success-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .success-card {
    box-sizing: border-box;
    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 0.625rem;
    width: 30rem;
    height: 30rem;
    /* Fill Container */
    background: #F3F3F3;
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: .625rem;
  }

  .success-card .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 2.25rem;
  }
  .success-card .svg {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .success-card .btn-layout {
    width: 100%;
    height: 2.5rem;/* 40px */
    display: flex;
    justify-content: center;
  }
  .success-card .btn-layout .btn {
    width: 15rem;
  }

  .card-container{
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .card {
    box-sizing: border-box;
    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 0.625rem;
    width: 30rem;
    height: 46.5rem;
    /* Fill Container */
    background: #F3F3F3;
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: .625rem;
  }

  .card-large {
    box-sizing: border-box;
    /* Auto layout */
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 0.625rem;
    width: 30rem;
    height: 52rem; /* 832px */
    /* Fill Container */
    background: #F3F3F3;
    /* container effect */
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #FFFFFF, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: .625rem;
  }

  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 2.25rem;
  }

  .header .title {
    font-weight: 700;
    font-size: 2rem;
    line-height: 1.25rem;
    color: #113A62;
  }

  .header .subtitle {
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    text-align: center;
    color: #8B9EB0;
  }

  .header .subtitle p a {
    color: #5585FF;
    text-decoration: none;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.25rem 0rem;
    gap: 1rem;
    /* width: 26rem; */
    /* height: 23.375rem; */
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
  }

  .form .title {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    color: #FD9053;
  }

  .form .inputs {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .form .inputs .row {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: inherit;
  }
  .form .inputs .row .element{
    width: inherit;
  }
  
  .form .inputs .select {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .form .inputs .select .element {
    width: 15rem;/* 240px */
  }
  .form .inputs .footer {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 1rem 0rem;
  }

  .form-address {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* padding: 2.25rem 0rem; */
    gap: 1rem;
    width: 26rem;
    height: 23.375rem;
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
  }

  .form-address .title {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    color: #FD9053;
  }

  .form-address .inputs {
    width: 22rem;
  }

  .form-address .inputs .row {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .form-address .inputs .footer {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 1rem 0rem;
  }
  .form-rfc {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* padding: 2.25rem 0rem; */
    gap: 1rem;
    width: 26rem;
    height: 23.375rem;
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
  }

  .form-rfc .title {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    color: #FD9053;
    margin-top: 2rem;
  }

  .form-rfc .inputs {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .form-rfc .inputs .row-title{
    font-size: .8125rem;
    font-weight: 700;
    line-height: 1.25rem;
    color: #8B9EB0;
    text-align: center;
    margin: 1rem 0rem;
  }
  .form-rfc .inputs .row {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .form-rfc .inputs .buttons-ine{
    width: 13.75rem;
    height: 2.5rem;
    display: flex;
    align-self: center;
  }

  .form-rfc .inputs .form-divider {
    height: .5rem;
    margin: 1rem 0rem;
    background: linear-gradient(138.32deg, rgba(0, 0, 0, 0.5) 8.26%, rgba(255, 255, 255, 0.5) 91.02%), #EAECF0;
    background-blend-mode: soft-light, normal;
    /* n-stroke */
    border: 1px solid rgba(255, 255, 255, 0.4);
    /* n-icon-1-1-2-in */
    box-shadow: inset -1px -1px 2px #FAFBFF, inset 1px 1px 2px #A6ABBD;
    border-radius: 5px;
    transform: rotate(-180deg);
  }

  .form-rfc .inputs .footer {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 1rem 0rem;
  }

  .form-rfc .footer-buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .form-large {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.25rem 0rem;
    gap: 1rem;
    width: 26rem;
    height: 28.25rem;
    /* Inside auto layout */
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
  }

  .form-large .title {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    color: #FD9053;
  }

  .form-large .inputs {
    width: 15rem;
  }

  .form-large .inputs .footer {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 1rem 0rem;
  }

  .footer-buttons {
    width: 13.75rem;
    height: 2.5rem;
  }

.tooltip {
  position: relative;
  display: inline-block;
  font-weight: 500;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  display: flex;
  align-items: center;
  color: #5585FF;
  text-decoration: none;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: fit-content;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>