<script>
  import { isLoggedIn, loggedInUser } from '$lib/stores';
  import { updateUserInfo, updateUserAvatar } from '$lib/hooks/updates.js'
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

  let userData = {
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
      value: "basic",
      name: "Básico"
    },
    {
      value: "pro",
      name: "Profesional"
    },
    {
      value: "business",
      name: "Business"
    },
    {
      value: "ecommerce",
      name: "E-Commerce"
    }
  ]

	let businessLineOptions = [
    {value: "travelAgency", name: "Agencias de Viajes"},
    {value: "aggregators", name: "Agregadoras"},
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
    await updateUserInfo(userData)
    .then(() => {
      success = true;
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
    {#if success == true}
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
                on:click={() => (success = false)}
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
            userData.accountType === "basic" ||
            userData.accountType === "pro"
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
                Para verificar que realmente eres tu quien utilizará tu cuenta y brindarte la mejor seguridad,
                necesitamos los siguientes datos personales, siempre protegidos bajo nuestra <a href="/home#privacy">Política de Privacidad</a>
              </p>
            </div>
          </div>
          {#if menu == 1}
            <div 
              class={
                userData.accountType === "basic" ||
                userData.accountType === "pro"
                ? "form" : "form-large"
              }
            >
              <div class="title">
                <p>Iniciemos con lo básico</p>
              </div>
              <div class="inputs">
                <Select bind:value={userData.accountType} label="Tipo de cuenta" defaultText={"Elige una opción"} bind:optionsList={accountTypeOptions}/>
                <Input placeholder="Ejemplo de Nombre" label="Nombre de tu Empresa" id="businessName" bind:value={userData.businessName} className="txt-field normal" type="text"/>
                <Select bind:value={userData.businessLine} label="Giro" defaultText={"Elige una opción"} bind:optionsList={businessLineOptions}/>
                {#if userData.accountType === "business" || userData.accountType === "ecommerce"}
                  <Input placeholder="RFC" label="RFC" id="rfc" bind:value={userData.rfc} className="txt-field normal" type="text"/>
                {/if}
                <div class="footer">
                  <a href="/home#why" target="_blank" rel="noopener noreferrer">¿Por qué te pedimos estos datos?</a>
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
                      userData.accountType === "basic" && userData.businessName != "" || 
                      userData.accountType === "pro" && userData.businessName != "" ||
                      userData.accountType === "business" && userData.rfc != "" && userData.businessName != "" ||
                      userData.accountType === "ecommerce" && userData.rfc != "" && userData.businessName != ""
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
                  <Input label="Calle" id="businessAddress" bind:value={userData.businessAddress} className="txt-field normal" type="text"/>
                  <div class="row">
                    <Input label="N° Exterior" id="outsideNumber" bind:value={userData.outsideNumber} className="txt-field normal" type="text"/>
                    <Input label="N° Interior" id="insideNumber" bind:value={userData.insideNumber} className="txt-field normal" type="text"/>
                    <Input label="Código Postal" id="zipCode" bind:value={userData.zipCode} className="txt-field normal" type="text"/>
                  </div>
                  <div class="row">
                    <Select bind:value={userData.state} label="Estado" defaultText={"Elige una opción"} bind:optionsList={statesArray}/>
                    <Select bind:value={userData.town} label="Municipio" defaultText={"Elige una opción"} bind:optionsList={townsArray}/>
                  </div>
                  {#if userData.accountType === "physical" || userData.accountType === "moral"}
                    <Input placeholder="RFC" label="RFC" id="rfc" bind:value={userData.rfc} className="txt-field normal" type="text"/>
                  {/if}
                  <div class="footer">
                    <a href="/home#why" target="_blank" rel="noopener noreferrer">¿Por qué te pedimos estos datos?</a>
                  </div>
                </div>
                <div class="footer-buttons">
                  <Input
                    on:click={() => (success = true)}
                    on:click={handleUpdateProfile}
                    label="Siguiente" 
                    id="buttonMenuAddress" 
                    type="button" 
                    className={` 
                      ${
                        userData.businessAddress != "" &&
                        userData.outsideNumber != "" &&
                        userData.zipCode != ""
                        ? "btn" : "btn-disabled"}
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
    height: 51.375rem;
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
  .header .logo {

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
    width: 26rem;
    height: 23.375rem;
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
    width: 15rem;
  }

  .form .inputs .footer {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 1rem 0rem;
  }
  .form .inputs .footer a{
    font-weight: 500;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    color: #5585FF;
    text-decoration: none;
  }

  .form-address {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.25rem 0rem;
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
    width: 20rem;
  }

  .form-address .inputs .row {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .form-address .inputs .row-2 {
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
  .form-address .inputs .footer a{
    font-weight: 500;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    color: #5585FF;
    text-decoration: none;
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

  .form-large .inputs .footer a{
    font-weight: 500;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    display: flex;
    align-items: center;
    color: #5585FF;
    text-decoration: none;
  }

  .footer-buttons {
    width: 13.75rem;
    height: 2.5rem;
  }

  .avatar-container {
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 2rem;
    margin-bottom: .5rem;
  } 
.avatar {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #111;
}
.avatar img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  object-fit: cover;
  justify-content: center;
  cursor: pointer;
}
.avatar:hover .avatar-img {
  opacity: .5;
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
  transition: opacity .2s ease-in-out;
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
</style>