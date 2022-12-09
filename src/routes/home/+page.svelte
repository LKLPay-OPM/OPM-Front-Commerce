<script>
	import { isLoggedIn, loggedInUser } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte'
	import Modal from '$lib/components/Modal.svelte';
	import Select from '$lib/components/Select.svelte';
	import Input from '$lib/components/Input.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import noUser from '$lib/assets/no_user.png';

	let modalOnboarding;
	let selected;

  $: {
    // console.log(selected)
  }

	let options = [
    {
      value: "basic",
      name: "Básico"
    },
    {
      value: "pro",
      name: "Profesional"
    },
    {
      value: "physical",
      name: "Persona Física"
    },
    {
      value: "moral",
      name: "Persona Moral"
    }
  ]

	let userData = {
		uid: $loggedInUser.uid,
		name: "",
		lastName: "",
		curp: "",
		accountType: "",
		businessName: "",
		businessLine: "",
		businessAddress: "",
		outsideNumber: "",
		insideNumber: "",
		zipCode: "",
		state: "",
		town: "",
		suburb: "",
		avatar: "",
		phone: "",
	}

	

	const handleUpdateProfile = () => {
		console.log(userData)
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

	const show = (option) => {
    option.show();
  }

  const closeModal = (option) => {  
    option.closeModal();
  }

	onMount(() => {
		if($loggedInUser.firstTimeUser == true){
			show(modalOnboarding)
		}
			//console.log($page)
	});
</script>



{#if $isLoggedIn === true}
<Modal bind:this={modalOnboarding}>
  <div slot="header">
    <h1>Bienvenido a LKL Pay</h1>
  </div>
  <div slot="content">
    <p>
      Para verificar que realmente eres tu quien utilizara tu cuenta y brindarte la mejor seguridad,<br>
			necesitamos los siguientes datos personales, siempre protegidos bajo nuestra <a href="/home#privacy">Política de Privacidad</a>
    </p>
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
		<Select bind:value={userData.accountType} label="Tipo de cuenta" defaultText={"Elige una opción"} bind:optionsList={options}/>
    <Input label="Nombre(s)" id="name" bind:value={userData.name} className="txt-field normal" type="text"/>
    <Input label="Apellidos(s)" id="lastName" bind:value={userData.lastName} className="txt-field normal" type="text"/>
    <Input label="Nombre del Negocio" id="businessName" bind:value={userData.businessName} className="txt-field normal" type="text"/>
    <Input label="Giro" id="businessLine" bind:value={userData.businessLine} className="txt-field normal" type="text"/>
    <Input label="Dirección con Número" id="businessAddress" bind:value={userData.businessAddress} className="txt-field normal" type="text"/>
    <Input label="Número Exterior" id="outsideNumber" bind:value={userData.outsideNumber} className="txt-field normal" type="text"/>
    <Input label="Número Interior" id="insideNumber" bind:value={userData.insideNumber} className="txt-field normal" type="text"/>
    <Input label="Código Postal" id="zipCode" bind:value={userData.zipCode} className="txt-field normal" type="text"/>
    <Input label="Estado" id="state" bind:value={userData.state} className="txt-field normal" type="text"/>
    <Input label="Municipio" id="town" bind:value={userData.town} className="txt-field normal" type="text"/>
    <Input label="Colonia" id="suburb" bind:value={userData.suburb} className="txt-field normal" type="text"/>
    <Input label="Teléfono" id="phone" bind:value={userData.phone} className="txt-field normal" type="text"/>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input on:click={closeModal(modalOnboarding)} label="Cerrar" id="buttonCloseModalBankInfo" type="button" className="button" icon=""/>
    <Input 
      on:click={closeModal(modalOnboarding)} 
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
  </div>
</Modal>
<div class="content">
	<div class="title">
		<h1 class="text-8xl">Home</h1>
		<!-- {JSON.stringify($page.data)} -->
	</div>
</div>
{/if}

<style>
	.content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

.title{
  display: flex;
  justify-content: center;
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