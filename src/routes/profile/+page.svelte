<script>
  import { isLoggedIn, loggedInUser, redirectBankProfile } from '$lib/stores';
  import { changeEmail, changePassword } from '$lib/hooks/auth.js'
  import { updateUserIne, updateUserBankAccountInfo } from '$lib/hooks/updates.js'
  import { updateUserInfo, updateUserAvatar } from '$lib/hooks/updates.js'
  import { onMount, afterUpdate } from 'svelte';
  import Input from '$lib/components/Input.svelte';
  import Icons from '$lib/components/Icons.svelte'
  import Select from '$lib/components/Select.svelte'
  import ButtonGroup from '$lib/components/ButtonGroup.svelte'
  import noUser from '$lib/assets/no_user.png';
  import townsData from '$lib/assets/municipios.json';

  let states = Object.keys(townsData);
  let statesArray = [];
  let townsArray = [];
  let formINEFront = "", formINEBack = "", formBankStatement = "";

  let stateIndex = 0;
  let townIndex = 0;
  let userData = {
    uid: $loggedInUser?.uid || "",
    name: $loggedInUser?.name || "",
    firstLastName: $loggedInUser?.firstLastName || "",
    secondLastName: $loggedInUser?.secondLastName || "",
    businessName: $loggedInUser?.businessName || "",
    rfc: $loggedInUser?.rfc || "",
    businessAddress: $loggedInUser?.businessAddress || "",
    businessLine: $loggedInUser?.businessLine || "",
    email: $loggedInUser?.email || "",
    state: $loggedInUser.state,
    town: $loggedInUser?.town,
    zipCode: $loggedInUser?.zipCode || "",
    suburb: $loggedInUser?.suburb || "",
    outsideNumber: $loggedInUser?.outsideNumber || "",
    insideNumber: $loggedInUser?.insideNumber || "",
    bankAccountInfo: {
      clabe: $loggedInUser.bankAccountInfo?.clabe || "",
      ineFront: $loggedInUser.bankAccountInfo?.ineFront || "",
      ineBack: $loggedInUser.bankAccountInfo?.ineBack || "",
      bankStatement: $loggedInUser.bankAccountInfo?.bankStatement || ""
    }
  }

  $: {
    townsArray = [];
    if(userData.state) {
      townsData[userData.state].map(function(key, index) {
        townsArray.push({name: key, value: key})
        // console.log(townsData[key]);
      });
      townIndex = townsArray.map(town => town.value).indexOf(userData.town)
    }
  }


  let active = "personalInfo";
  let updatePersonalInfo = false;
  let updatePassword = false;
  let updateEmail = false;
  let updateBusinessInfo = false;
  let updateBankAccountInfo = false;

  const handlePersonalInfo = () => {
    active = "personalInfo"
  }
  const handleBusinessInfo = () => {
    active = "businessInfo"
    
  }
  const handleClabe = () => {
    active = "bankAccountInfo"
  }
  
  let buttonGroupAggregatorAccount = [
    {value: "personalInfo", name: "Información Personal", click: handlePersonalInfo},
    {value: "bankAccountInfo", name: "Clabe Interbancaria", click: handleClabe},
  ]

  let buttonGroupOptions = [
    {value: "personalInfo", name: "Información Personal", click: handlePersonalInfo},
    {value: "businessInfo", name: "Inofrmación del Negocio", click: handleBusinessInfo},
    {value: "bankAccountInfo", name: "Clabe Interbancaria", click: handleClabe},
  ]

  const getBusinessLineName = (businessLine) => {
    const businessLineArray = {
      "travelAgency": {name: "Agencias de Viajes"},
      "aggregators": {name: "Agregadoras"},
      "insurers": {name:"Aseguradoras"},
      "charity": {name:"Beneficencia"},
      "collegeAndUniversities": {name:"Colegios y Universidades"},
      "fastFood": {name:"Comida Rápida"},
      "basicEducation": {name: "Educación Básica"},
      "entertainment": {name: "Entretenimiento"},
      "parkings": {name: "Estacionamientos"},
      "pharmacy": {name: "Farmacias"},
      "gasStations": {name: "Gasolineras"},
      "hospitals": {name: "Hospitales"},
      "hotels": {name: "Hoteles"},
      "doctorsAndDentists": {name: "Doctores y Dentistas"},
      "miscellaneous": {name: "Miscelánea"},
      "others": {name: "Otros"},
      "toll": {name: "Peaje"},
      "sparePartsAndHardwareStores": {name: "Refacciones y Ferreterías"},
      "carRental": {name: "Renta de Autos"},
      "restaurants": {name: "Restaurantes"},
      "beautySalons": {name: "Salones de Belleza"},
      "supermarkets": {name: "Supermercados"},
      "telecommunications": {name: "Telecomunicaciones"},
      "airTransport": {name: "Transporte Aéreo"},
      "landPassengerTransport": {name: "Transaporte Terrestre de Pasajeros"}
    }
    return businessLineArray[businessLine].name
  }

  let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/


  let currPassword ="", newPass = "", newEmail = "", repeatPassword = "";
  let avatar = "";

  const handleChangeEmail = (currentPassword, newEmail) => {
    // console.log(currentPassword, newEmail)
    changeEmail(currentPassword, newEmail);
    currPassword =""; 
    newEmail = "";
  }

  const handleChangePassword = (currentPassword, newPassword) => {
    // console.log(currentPassword, newPassword)
    changePassword(currentPassword, newPassword);
    currPassword =""; 
    newPass = ""; 
    repeatPassword = "";
  }

  const handleUpdateProfilePic = async() => {
    const uid = userData.uid;
    const picture = document.getElementById('file').files[0]
    const fileType = document.getElementById('file').files[0].type;

    let profileData = {};
    profileData.uid = uid;
    profileData.avatar = picture;
    profileData.fileType = fileType;
    await updateUserAvatar(profileData)
    // console.log(profileData)
    profileData = {};
  }

  const handleUpdateBankInfo = async() => {
    const bankStatement = document.getElementById('form-bank-statement').files[0]
    const bankStatementType = document.getElementById('form-bank-statement').files[0].type;
    userData.bankAccountInfo.bankStatement = bankStatement;
    userData.bankAccountInfo.bankStatementType = bankStatementType;
    // userData.bankAccountInfo.clabe = formCLABE;
    // userData.bankAccountInfo = bankAccountInfo;

    formBankStatement = ""

    // console.log(userData)
    await updateUserBankAccountInfo(userData)
    .then(() => {
      updateBankAccountInfo = !updateBankAccountInfo;
    })
    .catch((error) => {
      throw new Error(error)
    })

  }

  const handleUpdateBusinessInfo = async() => {
    // console.log(userData);
    await updateUserInfo(userData)
    .then(() => {
      updateBusinessInfo = !updateBusinessInfo;
    })
    .catch((error) => {
      throw new Error(error)
    })
  }

  const handleUpdatePersonalInfo = async() => {
    userData.uid = $loggedInUser.uid;
    const ineFront = document.getElementById('buttonIneFront').files[0]
    const ineBack = document.getElementById('buttonIneBack').files[0]
    /* const ine = URL.createObjectURL(
      document.getElementById('form-ine').files[0]
    ) */
    const ineFrontType = document.getElementById('buttonIneFront').files[0].type;
    const ineBackType = document.getElementById('buttonIneBack').files[0].type;

    /* const bankStatement = URL.createObjectURL(
      document.getElementById('form-bank-statement').files[0]
    ) */
      
    // bankAccountInfo.ine = ine;
    userData.bankAccountInfo.ineFront = ineFront;
    userData.bankAccountInfo.ineFrontType = ineFrontType;
    userData.bankAccountInfo.ineBack = ineBack;
    userData.bankAccountInfo.ineBackType = ineBackType;
    userData.bankAccountInfo.bankStatement = "";
    
    // userData.bankAccountInfo = bankAccountInfo;


    formINEFront = "", formINEBack = "";
    // bankDataDelivered.update(() => true)

    // console.log(userData)
    await updateUserIne(userData)
    .then(() => {
      updatePersonalInfo = !updatePersonalInfo;
    })
    .catch((error) => {
      throw new Error(error)
    })
    // await updateUserBankAccountInfo(bankAccountInfo)
    // bankAccountData.set(bankAccountInfo)
    // console.log(bankAccountInfo)
  }

  onMount(() => {
    if($redirectBankProfile === true){
      active = "bankAccountInfo";
      $redirectBankProfile = false;
    }
    states.map(function(key, index) {
      statesArray.push({name: key, value: key})
      // console.log(townsData[key]);
    });
    // console.log(statesArray)
    stateIndex = statesArray.map(state => state.value).indexOf(userData.state)
  });

</script>

<div class="container">
  {#if $loggedInUser}
    <div class="content">
      <div class="title">
        <p>Perfil</p>
      </div>
      <div class="avatar-container">
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
      <div class="user-name">
        {$loggedInUser.name} {$loggedInUser.firstLastName}  
      </div>
    </div>
    <div class="display-user-info">
      <ButtonGroup bind:active={active} options={$loggedInUser.accountType !== "1" ? buttonGroupAggregatorAccount : buttonGroupOptions}/>
      {#if active === "personalInfo"}
      <div class="display">
        <div class="container">
          <div class="top">
            <div class="left">
              <p>Información Personal</p>
            </div>
            <div class="right">
              <p
                on:click={() => updatePersonalInfo = !updatePersonalInfo}
                on:keypress={(e) => e.key === 'Enter' ? updatePersonalInfo = !updatePersonalInfo : updatePersonalInfo = updatePersonalInfo} 
                on:click={() => formINEFront = ""}
                on:click={() => formINEBack = ""}
                on:keypress={(e) => e.key === 'Enter' ? formINEFront = "" : ""}
                on:keypress={(e) => e.key === 'Enter' ? formINEBack = "" : ""}
              >
                Editar <Icons name={"edit"} width="16" height="16"/>
              </p>
            </div>
          </div>
          <div class="content">
            {#if updatePersonalInfo}
              <div class="section">
                <Input 
                  disabled={!updatePersonalInfo}
                  placeholder="Nombre" 
                  label="Nombre" 
                  id="name" 
                  bind:value={userData.name} 
                  className={!updatePersonalInfo ? "disabled-txt-field" : "txt-field-slim normal"} 
                  type="text"
                />
              </div>
              <div class="section">
                <Input 
                  disabled={!updatePersonalInfo}
                  placeholder="Primer Apellido"
                  label="Primer Apellido"
                  id="firstLastName"
                  bind:value={userData.firstLastName}
                  className={!updatePersonalInfo ? "disabled-txt-field" : "txt-field-slim normal"}
                  type="text"
                />
              </div>
              <div class="section">
                <Input
                  disabled={!updatePersonalInfo}
                  placeholder="Segundo Apellido"
                  label="Segundo Apellido"
                  id="secondLastName"
                  bind:value={userData.secondLastName}
                  className={!updatePersonalInfo ? "disabled-txt-field" : "txt-field-slim normal"}
                  type="text"
                />
              </div>
              <div class="section">
                <span>INE</span>
                <div class="element">
                  <Input label="Frente" id="buttonIneFront" bind:value={formINEFront} className="{formINEFront != "" ? "btn-success" : "btn-plain"}"  type="file" accept="image/*,.pdf"/>
                  <Input label="Vuelta" id="buttonIneBack" bind:value={formINEBack} className="{formINEBack != "" ? "btn-success" : "btn-plain"}" type="file" accept="image/*,.pdf"/>
                </div>
              </div>
              <div class="button">
                <Input
                  on:click={handleUpdatePersonalInfo}
                  label="Modificar Información" 
                  id="buttonUpdateUserInfo" 
                  type="button" 
                  className={` 
                    ${
                      userData.name != "" &&
                      userData.firstLastName != "" &&
                      formINEFront != "" &&
                      formINEBack != ""
                      ? "btn-plain btn-success" : "btn-plain disabled"}
                  `} 
                  icon=""
                />
              </div>
            {:else}
              <div class="section">
                <Input 
                  disabled={!updatePersonalInfo}
                  placeholder="Nombre" 
                  label="Nombre" 
                  id="name" 
                  bind:value={userData.name} 
                  className={!updatePersonalInfo ? "disabled-txt-field" : "txt-field-slim normal"} 
                  type="text"
                />
              </div>
              <div class="section">
                <Input 
                  disabled={!updatePersonalInfo}
                  placeholder="Primer Apellido"
                  label="Primer Apellido"
                  id="firstLastName"
                  bind:value={userData.firstLastName}
                  className={!updatePersonalInfo ? "disabled-txt-field" : "txt-field-slim normal"}
                  type="text"
                />
              </div>
              <div class="section">
                <Input
                  disabled={!updatePersonalInfo}
                  placeholder="Segundo Apellido"
                  label="Segundo Apellido"
                  id="secondLastName"
                  bind:value={userData.secondLastName}
                  className={!updatePersonalInfo ? "disabled-txt-field" : "txt-field-slim normal"}
                  type="text"
                />
              </div>
              <div class="section">
                <span>Identificación Oficial (INE)</span>
                {#if userData.bankAccountInfo?.ineFront != "" && $loggedInUser.bankAccountInfo?.ineBack != ""}
                  <div class="img-row">
                    <a href={$loggedInUser.bankAccountInfo?.ineFront} target="_blank" rel="noopener noreferrer">
                      <img src={$loggedInUser.bankAccountInfo?.ineFront} alt="ineFront">
                    </a>
                    <a href={$loggedInUser.bankAccountInfo?.ineBack} target="_blank" rel="noopener noreferrer">
                      <img src={$loggedInUser.bankAccountInfo?.ineBack} alt="ineBack">
                    </a>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </div>
        <div class="double-container">
          <div class="container">
            <div class="top">
              <div class="left">
                <p>Contraseña</p>
              </div>
              <div class="right">
                <p
                  on:click={() => updatePassword = !updatePassword}
                  on:keypress={(e) => e.key === 'Enter' ? updatePassword = !updatePassword : updatePassword = updatePassword} 
                >
                  Editar Contraseña <Icons name={"edit"} width="16" height="16"/>
                </p>
              </div>
            </div>
            <div class="content">
              {#if updatePassword}
                <div class="section">
                  <Input
                    disabled={!updatePassword}
                    placeholder="Contraseña Actual"
                    label="Contraseña Actual"
                    id="currentPasswordUpdatePass"
                    bind:value={currPassword}
                    className={!updatePassword ? "disabled-txt-field" : "txt-field-slim normal"}
                    type="password"
                  />
                </div>
                <div class="section">
                  <Input
                    disabled={!updatePassword}
                    placeholder="Nueva Contraseña"
                    label="Nueva Contraseña"
                    id="newPasswordUpdatePass"
                    bind:value={newPass}
                    className={!updatePassword ? "disabled-txt-field" : "txt-field-slim normal"}
                    type="password"
                  />
                </div>
                <div class="pass-conditions">
                  <p class="{newPass.match(passPattern) ? "valid":"invalid"}">
                    Tu contraseña debe de tener <br>
                    <span class="{newPass.length >= 8 ? "valid":"invalid"}"> 8 caracteres </span>|
                    <span class="{newPass.match(/[A-Z]/g) ? "valid":"invalid"}"> 1 Mayúscula </span>|
                    <span class="{newPass.match(/[a-z]/g) ? "valid":"invalid"}"> 1 Minúscula </span>|
                    <span class="{newPass.match(/[0-9]/g) ? "valid":"invalid"}"> 1 Número </span>
                  </p>
                </div>
                <div class="button">
                  <Input
                    on:click={handleChangePassword}
                    label="Modificar Contraseña" 
                    id="buttonUpdatePassword" 
                    type="button" 
                    className={` 
                      ${
                        currPassword != "" &&
                        newPass != "" &&
                        newPass.match(passPattern)
                        ? "btn-plain btn-success" : "btn-plain disabled"}
                    `} 
                    icon=""
                  />
                </div>
              {/if}
            </div>
          </div>
          <div class="container">
            <div class="top">
              <div class="left">
                <p>Email</p>
              </div>
              <div class="right">
                <p
                  on:click={() => updateEmail = !updateEmail}
                  on:keypress={(e) => e.key === 'Enter' ? updateEmail = !updateEmail : updateEmail = updateEmail} 
                >
                  Editar Email <Icons name={"edit"} width="16" height="16"/>
                </p>
              </div>
            </div>
            <div class="content">
              {#if updateEmail}
                <div class="section">
                  <Input
                    disabled={!updateEmail}
                    placeholder="Email"
                    label="Email"
                    id="updateEmail"
                    bind:value={newEmail}
                    className={!updateEmail ? "disabled-txt-field" : "txt-field-slim normal"}
                    type="text"
                    />
                </div>
                <div class="section">
                  <Input
                    disabled={!updateEmail}
                    placeholder="Contraseña Actual"
                    label="Contraseña Actual"
                    id="currentPassUpdateEmail"
                    bind:value={currPassword}
                    className={!updateEmail ? "disabled-txt-field" : "txt-field-slim normal"}
                    type="password"
                  />
                </div>
                <div class="button">
                  <Input
                    on:click={handleChangeEmail}
                    label="Modificar Email" 
                    id="buttonUpdateEmail" 
                    type="button" 
                    className={` 
                      ${
                        currPassword != "" &&
                        newEmail != "" &&
                        newEmail.match(emailPattern)
                        ? "btn-plain btn-success" : "btn-plain disabled"}
                    `} 
                    icon=""
                  />
                </div>
              {:else}
                <div class="section">
                  <Input
                    disabled={!updateEmail}
                    placeholder="Email"
                    label="Email"
                    id="email"
                    bind:value={userData.email}
                    className={!updateEmail ? "disabled-txt-field" : "txt-field-slim normal"}
                    type="text"
                  />
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
      {:else if active === "businessInfo"}
        <div class="container">
          <div class="top">
            <div class="left">
              <p>Información de tu Negocio</p>
            </div>
            <div class="right">
              <p
                on:click={() => updateBusinessInfo = !updateBusinessInfo}
                on:keypress={(e) => e.key === 'Enter' ? updateBusinessInfo = !updateBusinessInfo : updateBusinessInfo = updateBusinessInfo} 
              >
                Editar <Icons name={"edit"} width="16" height="16"/>
              </p>
            </div>
          </div>
          <div class="content">
            {#if updateBusinessInfo}
              <div class="inputs">
                {#if $loggedInUser.accountType !== "1"}
                  <div class="element">
                    <Input placeholder="Nombre de tu Negocio" label="Nombre de tu Negocio" id="businessName" bind:value={userData.businessName} className="txt-field-slim normal" type="text"/>
                    <Input placeholder="ASDF1234567T1" label="RFC" id="rfc" bind:value={userData.rfc} className="txt-field-slim normal" type="text"/>
                  </div>
                {/if}
                <div class="element">
                  <Input placeholder="Circunvalación Jorge Álvarez del Castillo" label="Calle" id="businessAddress" bind:value={userData.businessAddress} className="txt-field-slim normal" type="text"/>
                </div>
                <div class="element">
                  <Input placeholder="1106" label="N° Exterior" id="outsideNumber" bind:value={userData.outsideNumber} className="txt-field-slim normal" type="text"/>
                  <Input placeholder="NA" label="N° Interior" id="insideNumber" bind:value={userData.insideNumber} className="txt-field-slim normal" type="text"/>
                  <Input placeholder="44620" label="Código Postal" id="zipCode" bind:value={userData.zipCode} className="txt-field-slim normal" type="text"/>
                </div>
                <div class="element">
                  <Select index={stateIndex} bind:value={userData.state} label="Estado" defaultText={"Elige una opción"} bind:optionsList={statesArray}/>
                  <Select index={townIndex} bind:value={userData.town} label="Municipio" defaultText={"Elige una opción"} bind:optionsList={townsArray}/>
                </div>
                <Input placeholder="Chapultepec Country" label="Colonia" id="businessSuburb" bind:value={userData.suburb} className="txt-field-slim normal" type="text"/>
                <!-- <div class="footer tooltip">
                  ¿Por qué te pedimos estos datos?
                  <span class="tooltiptext">¿Por qué te pedimos estos datos?</span>
                </div> -->
                <div class="button">
                  <Input
                    on:click={handleUpdateBusinessInfo}
                    label="Modificar Información" 
                    id="buttonUpdateBusinessInfo" 
                    type="button" 
                    className={` 
                      ${
                        userData.businessName != "" &&
                        userData.rfc != "" &&
                        userData.businessAddress != "" &&
                        userData.outsideNumber != "" &&
                        userData.zipCode != "" &&
                        userData.suburb != ""
                        ? "btn-plain btn-success" : "btn-plain disabled"}
                    `} 
                    icon=""
                  />
                </div>
              </div>
            {:else}
              <div class="section">
                <span>Nombre del negocio</span>
                <p>{userData.businessName}</p>
              </div>
              <div class="section">
                <span>RFC</span>
                <p>{userData.rfc}</p>
              </div>
              <div class="section">
                <span>Dirección del negocio</span>
                <p>{userData.businessAddress} {userData.outsideNumber}{userData.insideNumber != "" ? ` - ${userData.insideNumber}` : ""}</p>
                <p>{userData.suburb}. {userData.town}</p>
                <p>{userData.state}. {userData.zipCode}</p>
              </div>
              <div class="section">
                <span>Giro del Negocio</span>
                <p>{getBusinessLineName(userData.businessLine)}</p>
              </div>
            {/if}
          </div>
        </div>
      {:else if active === "bankAccountInfo"}
      <div class="container">
        <div class="top">
          <div class="left">
            <p>Cuenta Bancaria</p>
          </div>
          <div class="right">
            <p
              on:click={() => updateBankAccountInfo = !updateBankAccountInfo}
              on:keypress={(e) => e.key === 'Enter' ? updateBankAccountInfo = !updateBankAccountInfo : updateBankAccountInfo = updateBankAccountInfo}
              on:click={() => formBankStatement = ""}
              on:keypress={(e) => e.key === 'Enter' ? formBankStatement = "" : ""}
            >
              Editar <Icons name={"edit"} width="16" height="16"/>
            </p>
          </div>
        </div>
        <div class="content">
          {#if updateBankAccountInfo}
            <div class="inputs">
              <div class="section">
                <Input placeholder="CLABE Interbancaria" label="CLABE" id="CLABE" bind:value={userData.bankAccountInfo.clabe} className="txt-field-slim normal" type="text"/>
              </div>
              {#if $loggedInUser.accountType !="1"}
                <div class="button">
                  <Input label="Estado de Cuenta" id="form-bank-statement" bind:value={formBankStatement} className="{formBankStatement != "" ? "btn-success" : "btn-plain"}" type="file" accept="image/*,.pdf"/>
                </div>
              {/if}
              <!-- <div class="footer tooltip">
                ¿Por qué te pedimos estos datos?
                <span class="tooltiptext">¿Por qué te pedimos estos datos?</span>
              </div> -->
              <div class="button">
                <Input
                  on:click={handleUpdateBankInfo}
                  label="Modificar Información" 
                  id="buttonUpdateBankInfo" 
                  type="button" 
                  className={` 
                    ${
                      $loggedInUser.accountType === "1" && userData.bankAccountInfo.clabe != "" ||
                      $loggedInUser.accountType !== "1" && userData.bankAccountInfo.clabe != "" && $loggedInUser.bankAccountInfo.bankStatement != ""
                      ? "btn-plain btn-success" : "btn-plain disabled"}
                  `} 
                  icon=""
                />
              </div>
            </div>
          {:else}
            <div class="section">
              <span>CLABE Interbancaria</span>
              <p>{userData.bankAccountInfo.clabe}</p>
            </div>
            <div class="section">
              {#if userData.bankAccountInfo?.bankStatement != "" && $loggedInUser.accountType !="1"}
                <span>Estado de Cuenta</span>
                {#if userData.bankAccountInfo?.bankStatement != ""}
                  <div class="img-row">
                    <a href={$loggedInUser.bankAccountInfo?.bankStatement} target="_blank" rel="noopener noreferrer">
                      <img src={$loggedInUser.bankAccountInfo?.bankStatement} alt="bankStatement">
                    </a>
                  </div>
                {/if}
              {/if}
            </div>
          {/if}
        </div>
      </div>
      {/if}
    </div>
  {/if}
</div>

<style>
/* ========================================== */
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  display: flex;
  justify-content: center;
}
.title p {
  font-size: xx-large;
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
  background-color: #113A62;
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

.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.user-name{
  display: flex;
  justify-content: center;
  font-size: x-large;
  margin-bottom: 2rem;
}
.display-user-info{
  display: flex;
  flex-direction: column;
  max-width: calc(80% - 2rem);
  min-width: calc(80%);
  /* justify-content: center; */
  align-items: center;
  padding: 2rem 2rem;/* 32px 0px */
  gap: 16px;
  margin: 0rem 4rem;/* 0px 64px */
  /* min-width: calc(80% - 20rem); */
  min-height: 25rem;/* 400px */
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

.display-user-info .display {
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
  min-width: 50%;
  max-width: 60%;
}
.display-user-info .double-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  min-width: 80%;
  border-radius: 10px;
}
.display-user-info .double-container .container{
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  min-width: 80%;
  min-height: 13rem;
  /* Nue Fill */
  /* background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%); */
  /* out */
  /* box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41); */
  border-radius: 10px;
  /* Inside auto layout */
  /* flex: none;
  order: 0;
  flex-grow: 0; */
}
.display-user-info .container {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  min-width: calc(80% - 2rem);
  min-height: 13rem;
  /* Nue Fill */
  background: linear-gradient(91.36deg, #EFEEF5 0%, #E6E8EF 100%);
  /* out */
  box-shadow: 4px 4px 20px rgba(111, 140, 176, 0.41);
  border-radius: 10px;
  /* Inside auto layout */
  /* flex: none;
  order: 0;
  flex-grow: 0; */
}

.display-user-info .container .top {
  display: flex;
  width: -webkit-fill-available;
  padding: 1rem;
}
.display-user-info .container .top .left {
  display: flex;
  width: -webkit-fill-available;
  justify-content: left;
}
.display-user-info .container .top .left p{
  font-weight: 500;
  font-size: 1.5rem;/* 24px */
  line-height: 1.25rem;/* 20px */
  text-align: center;
  /* Text */
  color: #113A62;
}
.display-user-info .container .top .right {
  display: flex;
  width: 50%;
  justify-content: right;
}
.display-user-info .container .top .right p{
  font-weight: 500;
  font-size: 1rem;/* 16px */
  line-height: 1.25rem;/* 20px */
  text-align: center;
  /* Text */
  color: #113A62;
  cursor: pointer;
}

.display-user-info .container .content {
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;/* 16px 32px */
  width: -webkit-fill-available;
}
.display-user-info .container .content .inputs{
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;/* 16px 32px */
  width: -webkit-fill-available;
}
.display-user-info .container .content .inputs .button{
  display: flex;
  flex-direction: column;
  width: -webkit-fill-available;
  height: 2.5rem;/* 40px */
  margin: 1rem;/* 16px */
  align-items: center;
}
.display-user-info .container .content .inputs .element{
  display: grid;
  grid-auto-flow: column;
  padding: 0rem 0rem;/* 16px 32px */
  width: -webkit-fill-available;
  gap: 1rem;
}

.display-user-info .container .content .button{
  display: flex;
  flex-direction: column;
  padding: 0rem 2rem;/* 16px 32px */
  width: -webkit-fill-available;
  height: 2.5rem;/* 40px */
  margin: 1rem;/* 16px */
}

.display-user-info .container .content .section {
  margin: .5rem;/* 8px */
}
.display-user-info .container .content .section .img-row{
  display: flex;
  gap: 1rem;
  margin: .5rem;/* 8px */
}
.display-user-info .container .content .section .img-row img{
  max-width: 10rem;
  max-height: 5rem;
}
.display-user-info .container .content .section .element{
  display: flex;
  margin: 1rem;
  gap: 1rem;
  height: 2.5rem;
}

.display-user-info .container .content .section span {
  margin-top: 1rem;
  font-weight: 700;
  font-size: .8125rem;/* 13px */
  line-height: 1.25rem;/* 20px */
  color: #8B9EB0;
}
.display-user-info .container .content .section p {
  font-weight: 500;
  font-size: 1rem;/* 16px */
  line-height: 1.125rem;/* 18px */
  color: #113A62;
}

.pass-conditions {
  display: flex;
  width: 100%;
}
.pass-conditions p{
  font-weight: 700;
  font-size: .8125rem;
  line-height: 1.25rem;
}

.invalid {
  color: #FD9053;
}

.valid {
  color: #00C48C;
}
</style>